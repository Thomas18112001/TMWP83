#!/usr/bin/env python3
"""
Deploy public site updates to /var/www/tmwp83-dev.
- Backs up current live dir (timestamped)
- Uploads source (excl. node_modules / .next / public/images)
- Copies public/images from backup to avoid re-uploading 267MB
- Builds in release dir, then swaps into live
- Restarts tmwp83-dev only; leaves tmwp83-auth and tmwp83-strapi untouched
"""

import io
import os
import sys
import tarfile
import time
from datetime import datetime

import paramiko

HOST = "212.227.86.233"
PORT = 22
USER = "root"
PASSWORD = "KUyv8qPrWcRVXG"

LIVE_DIR = "/var/www/tmwp83-dev"
LOCAL_ROOT = os.path.dirname(os.path.abspath(__file__))

TS = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_DIR = f"/var/www/tmwp83-dev-backup-{TS}"
RELEASE_DIR = f"/var/www/tmwp83-dev-release-{TS}"
REMOTE_TAR = "/tmp/tmwp83-public-src.tar.gz"

INCLUDE_DIRS = ["app", "components", "lib", "styles"]
INCLUDE_PUBLIC_SUBDIRS = ["brand", "generated", "partenaires"]
INCLUDE_PUBLIC_FILES = ["robots.txt"]
INCLUDE_FILES = [
    "middleware.ts",
    "proxy.ts",
    "next.config.js",
    "package.json",
    "package-lock.json",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    "next-env.d.ts",
]

SKIP_NAMES = {"node_modules", ".next", ".git", "__pycache__", ".DS_Store"}


def should_skip(rel_path: str) -> bool:
    parts = rel_path.replace("\\", "/").split("/")
    return any(p in SKIP_NAMES or p.endswith(".log") for p in parts)


def add_dir(tar: tarfile.TarFile, local_dir: str, arcname_prefix: str) -> None:
    for root, dirs, files in os.walk(local_dir):
        dirs[:] = [d for d in dirs if d not in SKIP_NAMES]
        for fname in files:
            full = os.path.join(root, fname)
            rel = os.path.relpath(full, local_dir).replace("\\", "/")
            arc = f"{arcname_prefix}/{rel}"
            if not should_skip(arc):
                tar.add(full, arcname=arc)


def build_tarball() -> io.BytesIO:
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz") as tar:
        for d in INCLUDE_DIRS:
            local = os.path.join(LOCAL_ROOT, d)
            if os.path.isdir(local):
                add_dir(tar, local, d)

        # public/ subdirs (skip images — already on VPS)
        for sub in INCLUDE_PUBLIC_SUBDIRS:
            local = os.path.join(LOCAL_ROOT, "public", sub)
            if os.path.isdir(local):
                add_dir(tar, local, f"public/{sub}")

        # public/ loose files (robots.txt etc.)
        for fname in INCLUDE_PUBLIC_FILES:
            local = os.path.join(LOCAL_ROOT, "public", fname)
            if os.path.isfile(local):
                tar.add(local, arcname=f"public/{fname}")

        # root config files
        for fname in INCLUDE_FILES:
            local = os.path.join(LOCAL_ROOT, fname)
            if os.path.isfile(local):
                tar.add(local, arcname=fname)

    buf.seek(0)
    return buf


def safe_print(text: str, limit: int = 1600) -> None:
    """Print text, replacing characters unsupported by the console encoding."""
    truncated = text[:limit]
    encoded = truncated.encode(sys.stdout.encoding or "ascii", errors="replace").decode(
        sys.stdout.encoding or "ascii", errors="replace"
    )
    print(encoded)


def run(ssh: paramiko.SSHClient, cmd: str, check: bool = True):
    print(f"  $ {cmd}")
    _, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    code = stdout.channel.recv_exit_status()
    if out:
        safe_print(f"    {out}", limit=1600)
    if err and err != out:
        safe_print(f"    STDERR: {err}", limit=800)
    if check and code != 0:
        print(f"    ERROR: exit {code}")
        sys.exit(1)
    return out, err, code


def main() -> None:
    print(f"=== TMWP83-DEV Public Deploy ({TS}) ===\n")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {HOST}:{PORT} ...")
    ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=30)
    print("Connected.\n")
    sftp = ssh.open_sftp()

    # ── 0. Cleanup any stale release dirs ────────────────────────────────────
    run(ssh, "rm -rf /var/www/tmwp83-dev-release-*", check=False)

    # ── 1. Backup live ────────────────────────────────────────────────────────
    print(f"[1/8] Backing up {LIVE_DIR} -> {BACKUP_DIR} ...")
    run(ssh, f"cp -r {LIVE_DIR} {BACKUP_DIR}")
    print(f"      Backup: {BACKUP_DIR}\n")

    # ── 2. Create release dir and upload source ───────────────────────────────
    print(f"[2/8] Building tarball locally ...")
    tarball = build_tarball()
    size_kb = tarball.seek(0, 2) // 1024
    tarball.seek(0)
    print(f"      Size: {size_kb} KB")

    run(ssh, f"mkdir -p {RELEASE_DIR}/public")
    sftp.putfo(tarball, REMOTE_TAR)
    print(f"      Uploaded to {REMOTE_TAR}")
    run(ssh, f"tar -xzf {REMOTE_TAR} -C {RELEASE_DIR}")
    run(ssh, f"rm {REMOTE_TAR}")
    print("      Source extracted.\n")

    # ── 3. Copy public/images from backup (267MB, already there) ─────────────
    print("[3/8] Copying public/images from backup ...")
    run(ssh, f"cp -r {BACKUP_DIR}/public/images {RELEASE_DIR}/public/images", check=False)
    print()

    # ── 4. Copy .env.local from live ─────────────────────────────────────────
    print("[4/8] Copying .env.local ...")
    _, _, code = run(ssh, f"cp {LIVE_DIR}/.env.local {RELEASE_DIR}/.env.local", check=False)
    if code != 0:
        print("      WARNING: no .env.local in live dir — skipping.")
    print()

    # ── 4b. Verify key files landed ──────────────────────────────────────────
    print("[4b/8] Verifying uploaded files ...")
    run(ssh, f"ls {RELEASE_DIR}/lib/ {RELEASE_DIR}/components/", check=False)
    print()

    # ── 4c. Verify tsconfig paths ─────────────────────────────────────────────
    print("[4c/8] Checking tsconfig paths on VPS ...")
    run(ssh, f"node -e \"var t=require('{RELEASE_DIR}/tsconfig.json'); console.log(JSON.stringify(t.compilerOptions.paths));\"", check=False)
    print()

    # ── 5. npm ci (all deps — PostCSS/Tailwind needed at build time) ──────────
    print("[5/8] npm ci ...")
    run(ssh, f"cd {RELEASE_DIR} && npm ci 2>&1 | tail -10", check=False)
    print()

    # ── 6. npm run build ─────────────────────────────────────────────────────
    print("[6/8] npm run build ...")
    run(ssh, f"cd {RELEASE_DIR} && npm run build 2>&1 | tail -60")
    print()

    # ── 7. Atomic swap ───────────────────────────────────────────────────────
    print(f"[7/8] Swapping release -> live ...")
    run(ssh, f"rm -rf {LIVE_DIR}")
    run(ssh, f"mv {RELEASE_DIR} {LIVE_DIR}")
    print(f"      {LIVE_DIR} updated - OK\n")

    # ── 8. Restart pm2 (tmwp83-dev only) ────────────────────────────────────
    print("[8/8] Restarting pm2 tmwp83-dev ...")
    run(ssh, "pm2 restart tmwp83-dev")
    run(ssh, "pm2 save", check=False)
    print()

    # ── Verify ───────────────────────────────────────────────────────────────
    print("Waiting 6s for app to come up ...")
    time.sleep(6)
    print("\nVerification:")

    checks = [
        ("/activites",            200, "real activities page"),
        ("/competitions",         200, "competitions page"),
        ("/le-club",              200, "FFN standings page"),
        ("/matchs",               307, "/matchs → /competitions redirect"),
        ("/planning",             307, "/planning redirects to /activites"),
    ]

    base = "http://127.0.0.1:3002"
    all_ok = True
    for path, expected_code, label in checks:
        url = f"{base}{path}"
        out, _, _ = run(
            ssh,
            f"curl -s -o /dev/null -w '%{{http_code}}' --max-time 15 --max-redirs 0 {url}",
            check=False,
        )
        actual = out.strip()
        ok = actual == str(expected_code)
        if not ok:
            all_ok = False
        mark = "OK" if ok else "FAIL"
        line = f"  [{mark}]  {path:<30} HTTP {actual}  (expected {expected_code})  - {label}"
        safe_print(line)

    # Also check redirect destination for /matchs
    out, _, _ = run(
        ssh,
        f"curl -s -o /dev/null -w '%{{redirect_url}}' --max-time 15 --max-redirs 0 {base}/matchs",
        check=False,
    )
    print(f"     /matchs redirect_url: {out.strip()}")

    print()
    run(ssh, "pm2 list", check=False)

    print(f"\n{'='*50}")
    print(f"  Status : {'ALL OK' if all_ok else 'SOME CHECKS FAILED - review above'}")
    print(f"  Live   : {LIVE_DIR}")
    print(f"  Backup : {BACKUP_DIR}")
    print(f"  Site   : https://dev.toulonwaterpolo.fr")
    print(f"{'='*50}")

    sftp.close()
    ssh.close()


if __name__ == "__main__":
    main()
