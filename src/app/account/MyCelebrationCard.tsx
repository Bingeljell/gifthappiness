"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Check, Copy, ExternalLink, Loader2, Pencil } from "lucide-react";
import { updateMyCelebration, type MyCelebration, type UpdateMyCelebrationInput } from "@/lib/api";

// Human wording for the raw status column. A host should never be shown
// "expired" or "draft" -- those describe the row, not what happened to their
// celebration.
const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  draft: { label: "Awaiting approval", className: "bg-amber-100 text-amber-800" },
  published: { label: "Live", className: "bg-green-100 text-green-800" },
  expired: { label: "Complete", className: "bg-gray-100 text-gray-600" },
  flagged: { label: "Needs attention", className: "bg-red-100 text-red-800" },
};

type SaveState = { status: "idle" } | { status: "saving" } | { status: "error"; message: string };

export default function MyCelebrationCard({
  celebration,
  token,
  onUpdated,
}: {
  celebration: MyCelebration;
  token: string;
  onUpdated: (updated: MyCelebration) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [save, setSave] = useState<SaveState>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    celebrationType: celebration.celebration_type,
    celebrationDate: celebration.celebration_date ?? "",
    activeFrom: celebration.active_from ?? "",
    activeTill: celebration.active_till ?? "",
    message: celebration.message ?? "",
  });

  const status = STATUS_LABEL[celebration.status] ?? {
    label: celebration.status,
    className: "bg-gray-100 text-gray-600",
  };

  const isLive = celebration.status === "published";
  const canEdit = celebration.status === "draft" || isLive;
  // Built from the current origin so the link a host copies matches the domain
  // they're already on, rather than a hardcoded one.
  const shareUrl =
    typeof window === "undefined" ? "" : `${window.location.origin}/celebration/${celebration.slug}`;

  const update = (field: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions; the link is visible anyway.
    }
  };

  const handleSave = async () => {
    setSave({ status: "saving" });

    // Only send what this status actually accepts -- the backend rejects the
    // rest with a 409, and there's no reason to provoke it.
    const input: UpdateMyCelebrationInput = {
      celebrationDate: form.celebrationDate || null,
      activeFrom: form.activeFrom || null,
      activeTill: form.activeTill || null,
      message: form.message || null,
    };
    if (!isLive) input.celebrationType = form.celebrationType;

    const result = await updateMyCelebration(token, celebration.slug, input);
    if (result.ok) {
      onUpdated({ ...celebration, ...result.data.celebration });
      setEditing(false);
      setSave({ status: "idle" });
    } else {
      setSave({ status: "error", message: result.error });
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-gray-900 capitalize">{celebration.celebration_type}</p>
          <p className="text-sm text-gray-500">
            {celebration.celebration_date || "No date set"}
            {celebration.charity_name && <> &middot; supporting {celebration.charity_name}</>}
          </p>
        </div>
        <span className={`shrink-0 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>

      {celebration.status === "draft" && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          We review every celebration before it goes live. We&apos;ll email you as soon as it&apos;s approved.
        </p>
      )}

      {isLive && (
        <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Share with your guests</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 min-w-0 truncate text-xs text-gray-700">{shareUrl}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-primary-pink hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <Link
              href={`/celebration/${celebration.slug}`}
              className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-primary-pink hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </Link>
          </div>
        </div>
      )}

      {canEdit && !editing && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary-pink hover:underline"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      )}

      {editing && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          {isLive && (
            <p className="text-xs text-gray-500 leading-relaxed">
              Your celebration is live, so the occasion and chosen charity are locked &mdash; guests have already seen
              them. You can still update your message and dates.
            </p>
          )}

          {!isLive && (
            <Field id={`type-${celebration.id}`} label="Occasion" value={form.celebrationType} onChange={(v) => update("celebrationType", v)} />
          )}
          <Field id={`date-${celebration.id}`} label="Date" placeholder="YYYY-MM-DD" value={form.celebrationDate} onChange={(v) => update("celebrationDate", v)} />
          <Field id={`from-${celebration.id}`} label="Contributions open from" placeholder="YYYY-MM-DD" value={form.activeFrom} onChange={(v) => update("activeFrom", v)} />
          <Field id={`till-${celebration.id}`} label="Contributions close on" placeholder="YYYY-MM-DD" value={form.activeTill} onChange={(v) => update("activeTill", v)} />
          <Field id={`msg-${celebration.id}`} label="Message to your guests" value={form.message} onChange={(v) => update("message", v)} textarea />

          {save.status === "error" && (
            <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {save.message}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={save.status === "saving"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-pink text-white text-sm font-bold hover:bg-primary-pink/90 disabled:opacity-60"
            >
              {save.status === "saving" && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setSave({ status: "idle" });
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const className =
    "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} rows={3} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${className} resize-none`} />
      ) : (
        <input id={id} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={className} />
      )}
    </div>
  );
}
