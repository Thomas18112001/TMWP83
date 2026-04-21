"use client";

import { FormEvent as FE, useState } from "react";

const initialState = {
  name: "",
  email: "",
  subject: "Question générale",
  message: ""
};

export function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FE<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    setValues(initialState);
  };

  return (
    <form onSubmit={onSubmit} className="news-glow interactive-panel rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
          Nom
          <input
            required
            placeholder="Votre nom"
            value={values.name}
            onChange={(e) =>
              setValues((c) => ({ ...c, name: e.target.value }))
            }
            className="h-12 rounded-2xl border border-ink/10 bg-shell px-4 text-sm font-normal text-ink outline-none transition-all duration-300 hover:border-ink/20 focus:border-ember focus:shadow-[0_0_0_4px_rgba(213,36,29,0.10)]"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
          Email
          <input
            required
            type="email"
            placeholder="votre@email.com"
            value={values.email}
            onChange={(e) =>
              setValues((c) => ({ ...c, email: e.target.value }))
            }
            className="h-12 rounded-2xl border border-ink/10 bg-shell px-4 text-sm font-normal text-ink outline-none transition-all duration-300 hover:border-ink/20 focus:border-ember focus:shadow-[0_0_0_4px_rgba(213,36,29,0.10)]"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
        Objet
        <select
          value={values.subject}
          onChange={(e) =>
            setValues((c) => ({ ...c, subject: e.target.value }))
          }
          className="h-12 rounded-2xl border border-ink/10 bg-shell px-4 text-sm font-normal text-ink outline-none transition-all duration-300 hover:border-ink/20 focus:border-ember focus:shadow-[0_0_0_4px_rgba(213,36,29,0.10)]"
        >
          <option>Question générale</option>
          <option>Inscription</option>
          <option>Partenariat</option>
          <option>Presse</option>
          <option>Autre demande</option>
        </select>
      </label>

      <label className="mt-4 flex flex-col gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
        Message
        <textarea
          required
          rows={5}
          placeholder="Votre message..."
          value={values.message}
          onChange={(e) =>
            setValues((c) => ({ ...c, message: e.target.value }))
          }
          className="rounded-2xl border border-ink/10 bg-shell px-4 py-3 text-sm font-normal text-ink outline-none transition-all duration-300 hover:border-ink/20 focus:border-ember focus:shadow-[0_0_0_4px_rgba(213,36,29,0.10)]"
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="button-sheen wave-to-ink inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-ink"
        >
          Envoyer la demande
        </button>
        {sent && (
          <p className="text-sm font-semibold text-green-700">
            Message envoyé — merci !
          </p>
        )}
      </div>
    </form>
  );
}
