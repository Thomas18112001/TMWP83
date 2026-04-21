"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Hard navigation: forces the browser to send the new cookie to the server
        // so middleware and server components re-evaluate with the correct role.
        // router.push/refresh doesn't reliably invalidate the RSC cache here.
        window.location.replace(from.startsWith("/") ? from : "/");
      } else {
        const data = await res.json();
        setError(data.error ?? "Mot de passe incorrect");
        setPassword("");
        setLoading(false);
        inputRef.current?.focus();
      }
    } catch {
      setError("Erreur réseau — réessayez.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(213,36,29,0.14),transparent_28%)]" />

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <img
            src="/brand/logo-light.png"
            alt="Toulon Métropole Water-Polo 83"
            className="mx-auto mb-8 h-14 w-auto"
          />
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-ember">
            Accès restreint
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">
            Site privé
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/40">
            Ce site est en cours de développement.<br />
            Entrez le mot de passe pour y accéder.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="space-y-4">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder-white/25 outline-none transition-all focus:border-ember/50 focus:ring-2 focus:ring-ember/20"
          />

          {error && (
            <p role="alert" className="text-center text-sm font-semibold text-ember">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="button-sheen wave-red w-full rounded-2xl bg-ember py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Connexion…" : "Accéder au site"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-white/20">
          TMWP83 — Accès développement
        </p>
      </div>
    </div>
  );
}
