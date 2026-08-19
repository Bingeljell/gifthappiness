"use client";

import { sdgDescriptions } from "@/lib/sdgs";

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
