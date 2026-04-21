"use client";

import { Edit3, Image as ImageIcon, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tmwp83:inline-editor:v1";
const SESSION_KEY = "tmwp83:editor-active";
const TEXT_SELECTOR =
  "main h1, main h2, main h3, main p, main a, main button, main li, footer h2, footer h3, footer p, footer a, footer li";

type StoredEdits = {
  text: Record<string, string>;
  images: Record<string, string>;
};

const emptyEdits: StoredEdits = { text: {}, images: {} };

function readEdits(): StoredEdits {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyEdits, ...JSON.parse(raw) } : emptyEdits;
  } catch {
    return emptyEdits;
  }
}

function writeEdits(edits: StoredEdits) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

function editableKey(prefix: string, element: Element, index: number) {
  const page = window.location.pathname || "/";
  const label =
    element.getAttribute("data-edit-key") ||
    element.getAttribute("href") ||
    element.getAttribute("alt") ||
    element.textContent?.trim().slice(0, 36) ||
    element.tagName.toLowerCase();

  return `${page}:${prefix}:${element.tagName.toLowerCase()}:${index}:${label}`;
}

// isEditor is derived server-side from the verified JWT (root layout → middleware header).
export function FrontEndEditor({ isEditor }: { isEditor: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  // Restore edit mode state from sessionStorage (persists across page navigations
  // within the session; cleared when the browser is closed, same as the auth cookie).
  useEffect(() => {
    if (!isEditor) return;
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setEnabled(true);
    }
  }, [isEditor]);

  // Apply saved edits to the DOM (only meaningful for editors on the same device).
  useEffect(() => {
    if (!isEditor) return;
    const edits = readEdits();
    const textElements = Array.from(document.querySelectorAll<HTMLElement>(TEXT_SELECTOR))
      .filter((el) => el.textContent?.trim() && !el.closest("[data-editor-ui]"));
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img, footer img"));

    textElements.forEach((el, i) => {
      const key = editableKey("text", el, i);
      el.dataset.editorKey = key;
      if (edits.text[key]) el.textContent = edits.text[key];
    });

    images.forEach((img, i) => {
      const key = editableKey("image", img, i);
      img.dataset.editorKey = key;
      if (edits.images[key]) img.src = edits.images[key];
    });
  }, [isEditor]);

  useEffect(() => {
    if (!isEditor) return;
    document.documentElement.classList.toggle("editor-active", enabled);

    const textElements = Array.from(document.querySelectorAll<HTMLElement>("[data-editor-key]"))
      .filter((el) => el.matches(TEXT_SELECTOR));
    const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-editor-key]"));

    const saveText = (event: Event) => {
      const el = event.currentTarget as HTMLElement;
      const key = el.dataset.editorKey;
      if (!key) return;
      const edits = readEdits();
      edits.text[key] = el.textContent?.trim() || "";
      writeEdits(edits);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    };

    const editImage = (event: MouseEvent) => {
      if (!enabled) return;
      event.preventDefault();
      event.stopPropagation();
      const img = event.currentTarget as HTMLImageElement;
      const key = img.dataset.editorKey;
      if (!key) return;
      const next = window.prompt("Nouvelle URL de l'image", img.currentSrc || img.src);
      if (!next?.trim()) return;
      img.src = next.trim();
      const edits = readEdits();
      edits.images[key] = next.trim();
      writeEdits(edits);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    };

    textElements.forEach((el) => {
      el.contentEditable = enabled ? "true" : "false";
      el.spellcheck = enabled;
      if (enabled) el.addEventListener("blur", saveText);
    });

    images.forEach((img) => {
      if (enabled) img.addEventListener("click", editImage);
    });

    const preventNavigation = (event: MouseEvent) => {
      if (!enabled) return;
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (target && !target.closest("[data-editor-ui]")) event.preventDefault();
    };

    document.addEventListener("click", preventNavigation, true);

    return () => {
      textElements.forEach((el) => {
        el.contentEditable = "false";
        el.removeEventListener("blur", saveText);
      });
      images.forEach((img) => img.removeEventListener("click", editImage));
      document.removeEventListener("click", preventNavigation, true);
      document.documentElement.classList.remove("editor-active");
    };
  }, [enabled, isEditor]);

  const toggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    sessionStorage.setItem(SESSION_KEY, String(next));
  };

  const resetEdits = () => {
    if (!window.confirm("Supprimer les modifications locales de l'editeur ?")) return;
    window.localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  if (!isEditor) return null;

  return (
    <div data-editor-ui className="editor-toolbar">
      <button type="button" onClick={toggleEnabled} className={enabled ? "is-active" : ""}>
        {enabled ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
        {enabled ? "Quitter" : "Editer"}
      </button>
      {enabled ? (
        <>
          <span><ImageIcon className="h-3.5 w-3.5" /> clic image</span>
          <button type="button" onClick={resetEdits}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </>
      ) : null}
      {saved ? <span><Save className="h-3.5 w-3.5" /> sauvegarde</span> : null}
    </div>
  );
}
