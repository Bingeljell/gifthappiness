"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";
import { sdgDescriptions } from "@/lib/sdgs";
import { adminUploadCharityLogo } from "@/lib/api";

export function ImageUploadField({
  id,
  token,
  value,
  onChange,
}: {
  id: string;
  token: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [status, setStatus] = useState<{ state: "idle" } | { state: "uploading" } | { state: "error"; message: string }>({ state: "idle" });

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setStatus({ state: "uploading" });
    const result = await adminUploadCharityLogo(token, file);
    if (!result.ok) {
      setStatus({ state: "error", message: result.error });
      return;
    }
    setStatus({ state: "idle" });
    onChange(result.data.url);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
        Picture (optional)
      </label>
      <div className="flex items-center gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-16 h-16 rounded-2xl object-cover border border-gray-200" />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-dashed border-gray-200" />
        )}
        <label
          htmlFor={id}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-all"
        >
          {status.state === "uploading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {value ? "Replace image" : "Upload image"}
        </label>
        <input id={id} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
      </div>
      {status.state === "error" && <p className="text-xs text-primary-pink font-semibold ml-1">{status.message}</p>}
    </div>
  );
}

export function FormField({
  id,
  label,
  placeholder,
  hint,
  inputMode,
  textarea,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  inputMode?: "text" | "numeric";
  textarea?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 ml-1">{hint}</p>}
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none"
        />
      ) : (
        <input
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
      )}
    </div>
  );
}

export function SdgChecklist({ selected, onToggle }: { selected: string[]; onToggle: (code: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">Relevant SDGs (optional)</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Object.entries(sdgDescriptions).map(([code, description]) => (
          <label
            key={code}
            className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(code)}
              onChange={() => onToggle(code)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary-pink"
            />
            <span>
              <span className="font-bold">{code}</span> — {description}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
