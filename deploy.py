#!/usr/bin/env python3
"""Deploy tmwp83 to dev.toulonwaterpolo.fr (212.227.86.233)."""

import os
import sys
import paramiko
import time

HOST = "212.227.86.233"
PORT = 22
USER = "root"
PASSWORD = "KUyv8qPrWcRVXG"
REMOTE_DIR = "/var/www/tmwp83-dev"
LOCAL_ROOT = os.path.dirname(os.path.abspath(__file__))

ENV_CONTENT = """SITE_PASSWORD_HASH=30893320216f1625a6cf339b096eb9e3289e6bd7f78732dca8661b3ea02553af
EDITOR_PASSWORD_HASH=bb61de8d1d0e75557b77943a9cedf7dbfe5b7a141501f4465fc2567d611051ec
JWT_SECRET=9c7d856e38775366d7c1115fecc1ce64a3dbaf7a4296fa07f65ffa8ea96dce07
NODE_ENV=production
"""

NGINX_CONF = """server {
    listen 80;
    server_name dev.toulonwaterpolo.fr;

    # Rate-limit login endpoint
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    location /api/auth/login {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Block dotfiles
    location ~ /\\. {
        deny all;
    }
}
"""

PM2_ECOSYSTEM = """{
  "apps": [{
    "name": "tmwp83-dev",
    "script": "node_modules/.bin/next",
    "args": "start -p 3002",
    "cwd": "/var/www/tmwp83-dev",
    "env": {
      "NODE_ENV": "production",
      "PORT": "3002"
    }
  }]
}
"""


def run(ssh, cmd, check=True):
    print(f"  $ {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode("utf-8", errors="replace").strip()
    err = stderr.read().decode("utf-8", errors="replace").strip()
    if out:
        print(f"    {out[:800]}")
    if err:
        print(f"    STDERR: {err[:400]}")
    exit_code = stdout.channel.recv_exit_status()
    if check and exit_code != 0:
        print(f"    ERROR: exit code {exit_code}")
        sys.exit(1)
    return out, err, exit_code


def upload_file(sftp, local_path, remote_path):
    size = os.path.getsize(local_path)
    print(f"  upload {local_path} -> {remote_path}  ({size // 1024}KB)")
    sftp.put(local_path, remote_path)


def upload_dir(sftp, ssh, local_dir, remote_dir):
    """Recursively upload a directory."""
    run(ssh, f"mkdir -p {remote_dir}", check=False)
    for entry in os.scandir(local_dir):
        remote_path = f"{remote_dir}/{entry.name}"
        if entry.is_dir(follow_symlinks=False):
            upload_dir(sftp, ssh, entry.path, remote_path)
        else:
            try:
                sftp.put(entry.path, remote_path)
            except Exception as e:
                print(f"    WARNING: failed to upload {entry.path}: {e}")


def write_remote(sftp, remote_path, content):
    import io
    buf = io.BytesIO(content.encode())
    sftp.putfo(buf, remote_path)
    print(f"  wrote {remote_path}")


def main():
    print("=== TMWP83 Deployment ===\n")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {HOST}...")
    ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=30)
    print("Connected.\n")
    sftp = ssh.open_sftp()

    # 1. Create remote directory
    print("1. Preparing remote directory...")
    run(ssh, f"mkdir -p {REMOTE_DIR}/public")

    # 2. Upload source tarball
    print("\n2. Uploading source tarball...")
    local_tarball = os.path.expanduser("~/tmwp83-src.tar.gz")
    upload_file(sftp, local_tarball, "/tmp/tmwp83-src.tar.gz")
    run(ssh, f"tar -xzf /tmp/tmwp83-src.tar.gz -C {REMOTE_DIR}")
    run(ssh, "rm /tmp/tmwp83-src.tar.gz")
    print("   Source extracted.")

    # 3. Upload public/images
    print("\n3. Uploading public/images (267MB — this will take a while)...")
    images_dir = os.path.join(LOCAL_ROOT, "public", "images")
    if os.path.isdir(images_dir):
        upload_dir(sftp, ssh, images_dir, f"{REMOTE_DIR}/public/images")
        print("   Images uploaded.")
    else:
        print("   WARNING: public/images not found locally, skipping.")

    # 4. Upload public/generated
    print("\n4. Uploading public/generated...")
    generated_dir = os.path.join(LOCAL_ROOT, "public", "generated")
    if os.path.isdir(generated_dir):
        upload_dir(sftp, ssh, generated_dir, f"{REMOTE_DIR}/public/generated")
        print("   Generated assets uploaded.")
    else:
        print("   WARNING: public/generated not found locally, skipping.")

    # 5. Write .env.local
    print("\n5. Writing .env.local...")
    write_remote(sftp, f"{REMOTE_DIR}/.env.local", ENV_CONTENT)

    # 6. Install Node / npm dependencies
    print("\n6. Checking Node.js...")
    out, _, _ = run(ssh, "node --version", check=False)
    if not out.startswith("v"):
        print("   Installing Node.js 20...")
        run(ssh, "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -")
        run(ssh, "apt-get install -y nodejs")
    else:
        print(f"   Node.js {out} already installed.")

    print("\n7. Installing npm dependencies...")
    run(ssh, f"cd {REMOTE_DIR} && npm ci --omit=dev 2>&1 | tail -5", check=False)

    # 7. Build
    print("\n8. Building Next.js app...")
    run(ssh, f"cd {REMOTE_DIR} && npm run build 2>&1 | tail -20")

    # 8. PM2
    print("\n9. Setting up PM2...")
    out, _, _ = run(ssh, "which pm2", check=False)
    if not out:
        run(ssh, "npm install -g pm2")

    write_remote(sftp, f"{REMOTE_DIR}/ecosystem.config.json", PM2_ECOSYSTEM)
    run(ssh, f"cd {REMOTE_DIR} && pm2 delete tmwp83-dev 2>/dev/null || true", check=False)
    run(ssh, f"cd {REMOTE_DIR} && pm2 start ecosystem.config.json")
    run(ssh, "pm2 save")
    run(ssh, "pm2 startup systemd -u root --hp /root 2>&1 | tail -3", check=False)

    # 9. Nginx
    print("\n10. Configuring Nginx...")
    out, _, _ = run(ssh, "which nginx", check=False)
    if not out:
        run(ssh, "apt-get install -y nginx")

    write_remote(sftp, "/etc/nginx/sites-available/tmwp83-dev", NGINX_CONF)
    run(ssh, "ln -sf /etc/nginx/sites-available/tmwp83-dev /etc/nginx/sites-enabled/tmwp83-dev", check=False)
    run(ssh, "rm -f /etc/nginx/sites-enabled/default", check=False)
    run(ssh, "nginx -t")
    run(ssh, "systemctl reload nginx")

    # 10. Certbot SSL
    print("\n11. Setting up SSL with certbot...")
    out, _, _ = run(ssh, "which certbot", check=False)
    if not out:
        run(ssh, "apt-get install -y certbot python3-certbot-nginx")
    run(ssh, "certbot --nginx -d dev.toulonwaterpolo.fr --non-interactive --agree-tos -m admin@toulonwaterpolo.fr --redirect 2>&1 | tail -10", check=False)

    # Done
    print("\n=== Deployment complete! ===")
    print("Site: https://dev.toulonwaterpolo.fr")
    out, _, _ = run(ssh, f"pm2 status tmwp83-dev", check=False)

    sftp.close()
    ssh.close()


if __name__ == "__main__":
    main()
