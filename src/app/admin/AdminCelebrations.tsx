"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Check, Flag, Loader2, Pencil, RotateCcw, Trash2, X } from "lucide-react";
import {
  adminListCelebrations,
  adminUpdateCelebration,
  adminDeleteCelebration,
  type AdminCelebration,
  type AdminUpdateCelebrationInput,
  type CelebrationStatus,
} from "@/lib/api";
import { FormField } from "./CharityFormFields";

type ListState =
  | { status: "loading" }
  | { status: "loaded"; celebrations: AdminCelebration[] }
  | { status: "error"; message: string };

type ActionState = { id: string; kind: "working" } | { id: string; kind: "error"; message: string } | null;

const STATUS_STYLES: Record<CelebrationStatus, string> = {
  draft: "bg-amber-100 text-amber-700",
  published: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-600",
  flagged: "bg-red-100 text-red-700",
};

export default function AdminCelebrations({ token }: { token: string }) {
  const [celebrations, setCelebrations] = useState<ListState>({ status: "loading" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [action, setAction] = useState<ActionState>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    adminListCelebrations(token).then((result) => {
      setCelebrations(result.ok ? { status: "loaded", celebrations: result.data.celebrations } : { status: "error", message: result.error });
    });
  }, [token]);

  const applyUpdate = (updated: AdminCelebration) => {
    setCelebrations((prev) =>
      prev.status === "loaded" ? { status: "loaded", celebrations: prev.celebrations.map((c) => (c.id === updated.id ? updated : c)) } : prev,
    );
  };

  const setStatus = async (c: AdminCelebration, status: CelebrationStatus) => {
    setAction({ id: c.id, kind: "working" });
    const result = await adminUpdateCelebration(token, c.slug, { status });
    if (!result.ok) {
      setAction({ id: c.id, kind: "error", message: result.error });
      return;
    }
    applyUpdate(result.data.celebration);
    setAction(null);
  };

  const handleSaved = (updated: AdminCelebration) => {
    applyUpdate(updated);
    setEditingId(null);
  };

  const handleDelete = async (c: AdminCelebration) => {
    setAction({ id: c.id, kind: "working" });
    const result = await adminDeleteCelebration(token, c.slug);
    if (!result.ok) {
      setAction({ id: c.id, kind: "error", message: result.error });
      return;
    }
    setCelebrations((prev) => (prev.status === "loaded" ? { status: "loaded", celebrations: prev.celebrations.filter((x) => x.id !== c.id) } : prev));
    setConfirmingDeleteId(null);
    setAction(null);
  };

  if (celebrations.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading...
      </div>
    );
  }

  if (celebrations.status === "error") {
    return (
      <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        {celebrations.message}
      </p>
    );
  }

  if (celebrations.celebrations.length === 0) {
    return (
      <div className="rounded-2xl bg-[#FFF4ED] border border-gray-100 p-6 text-center">
        <p className="text-gray-600 font-semibold">No celebrations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {celebrations.celebrations.map((c) =>
        editingId === c.id ? (
          <EditCelebrationForm key={c.id} celebration={c} token={token} onSaved={handleSaved} onCancel={() => setEditingId(null)} />
        ) : (
          <div key={c.id} className="rounded-2xl bg-white border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">
                  {c.host?.name ?? "Unnamed host"} &middot; {c.celebration_type}
                </p>
                <p className="text-sm text-gray-500">
                  {c.host?.email} &middot; for {c.charity?.name ?? "unknown charity"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {c.celebration_date ? `Date: ${c.celebration_date}` : "No date set"}
                  {c.active_from || c.active_till ? ` · Active ${c.active_from ?? "?"} to ${c.active_till ?? "?"}` : ""}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${STATUS_STYLES[c.status]}`}>
                {c.status}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              {c.status === "draft" && (
                <ActionButton
                  label="Approve & publish"
                  icon={<Check className="w-3.5 h-3.5" />}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setStatus(c, "published")}
                  busy={action?.id === c.id && action.kind === "working"}
                />
              )}
              {c.status === "published" && (
                <ActionButton
                  label="Mark complete"
                  icon={<Check className="w-3.5 h-3.5" />}
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                  onClick={() => setStatus(c, "expired")}
                  busy={action?.id === c.id && action.kind === "working"}
                />
              )}
              {(c.status === "expired" || c.status === "flagged") && (
                <ActionButton
                  label="Reopen"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setStatus(c, "published")}
                  busy={action?.id === c.id && action.kind === "working"}
                />
              )}
              {(c.status === "draft" || c.status === "published") && (
                <ActionButton
                  label="Flag"
                  icon={<Flag className="w-3.5 h-3.5" />}
                  className="bg-red-50 hover:bg-red-100 text-red-600"
                  onClick={() => setStatus(c, "flagged")}
                  busy={action?.id === c.id && action.kind === "working"}
                />
              )}
              <button
                type="button"
                onClick={() => setEditingId(c.id)}
                className="flex items-center gap-1.5 text-sm font-bold text-primary-pink hover:underline"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              {(c.status === "draft" || c.status === "expired") && confirmingDeleteId !== c.id && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmingDeleteId(c.id);
                    setAction(null);
                  }}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>

            {confirmingDeleteId === c.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-gray-700">Delete this celebration? This can&apos;t be undone.</p>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    disabled={action?.id === c.id && action.kind === "working"}
                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl disabled:opacity-60"
                  >
                    {action?.id === c.id && action.kind === "working" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Confirm delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmingDeleteId(null);
                      setAction(null);
                    }}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </div>
            )}

            {action?.id === c.id && action.kind === "error" && (
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-primary-pink">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {action.message}
              </p>
            )}
          </div>
        ),
      )}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  className,
  onClick,
  busy,
}: {
  label: string;
  icon: ReactNode;
  className: string;
  onClick: () => void;
  busy: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${className}`}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : icon}
      {label}
    </button>
  );
}

type EditFormState = {
  celebrationType: string;
  celebrationDate: string;
  activeFrom: string;
  activeTill: string;
  message: string;
};

function EditCelebrationForm({
  celebration,
  token,
  onSaved,
  onCancel,
}: {
  celebration: AdminCelebration;
  token: string;
  onSaved: (updated: AdminCelebration) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EditFormState>({
    celebrationType: celebration.celebration_type,
    celebrationDate: celebration.celebration_date ?? "",
    activeFrom: celebration.active_from ?? "",
    activeTill: celebration.active_till ?? "",
    message: celebration.message ?? "",
  });
  const [submit, setSubmit] = useState<{ status: "idle" } | { status: "submitting" } | { status: "error"; message: string }>({ status: "idle" });

  const update = <K extends keyof EditFormState>(field: K, value: EditFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmit({ status: "submitting" });

    const input: AdminUpdateCelebrationInput = {
      celebrationType: form.celebrationType,
      celebrationDate: form.celebrationDate,
      activeFrom: form.activeFrom,
      activeTill: form.activeTill,
      message: form.message,
    };
    const result = await adminUpdateCelebration(token, celebration.slug, input);
    if (!result.ok) {
      setSubmit({ status: "error", message: result.error });
      return;
    }
    onSaved(result.data.celebration);
  };

  return (
    <div className="rounded-2xl bg-white border border-primary-pink/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-bold text-gray-500">
          Editing <span className="text-gray-900">{celebration.host?.name ?? celebration.slug}</span>&apos;s {celebration.celebration_type}
        </p>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField id={`ct-${celebration.id}`} label="Celebration type" value={form.celebrationType} onChange={(v) => update("celebrationType", v)} />
        <FormField id={`cd-${celebration.id}`} label="Celebration date" placeholder="YYYY-MM-DD" value={form.celebrationDate} onChange={(v) => update("celebrationDate", v)} />
        <FormField id={`af-${celebration.id}`} label="Active from" placeholder="YYYY-MM-DD" value={form.activeFrom} onChange={(v) => update("activeFrom", v)} />
        <FormField id={`at-${celebration.id}`} label="Active till" placeholder="YYYY-MM-DD" value={form.activeTill} onChange={(v) => update("activeTill", v)} />
        <FormField id={`msg-${celebration.id}`} label="Message" textarea value={form.message} onChange={(v) => update("message", v)} />

        {submit.status === "error" && (
          <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {submit.message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submit.status === "submitting"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submit.status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save changes
          </button>
          <button type="button" onClick={onCancel} className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
