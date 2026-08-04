"use client";

import { useState, type FormEvent } from "react";

export default function UnlockPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Incorrect passphrase");
      }

      // Full navigation (not client-side routing) so the browser resends the
      // request with the freshly-set cookie and proxy re-checks it clean.
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      window.location.href = next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center bg-[var(--surface-0)] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface-1)] p-6"
      >
        <h1 className="mb-1 text-lg font-medium text-[var(--text-primary)]">Enter passphrase</h1>
        <p className="mb-4 text-sm text-[var(--text-secondary)]">This app is gated to one user.</p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoFocus
          placeholder="Passphrase"
          className="mb-3 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
        />
        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !key}
          className="w-full rounded-lg bg-[var(--text-primary)] px-3 py-2 text-sm text-[var(--surface-0)] disabled:opacity-50"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </main>
  );
}
