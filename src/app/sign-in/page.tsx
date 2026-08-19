"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Mail } from "lucide-react";
import { confirmLogin, requestLogin } from "@/lib/api";
import { useSession } from "@/lib/session";

type Status =
  | { step: "email" }
  | { step: "sending" }
  | { step: "code" }
  | { step: "confirming" }
  | { step: "error"; message: string };

export default function SignInPage() {
  const router = useRouter();
  const { setToken } = useSession();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>({ step: "email" });

  const onSendCode = async () => {
    if (!email) return;
    setStatus({ step: "sending" });
    const result = await requestLogin(email);
    setStatus(result.ok ? { step: "code" } : { step: "error", message: result.error });
  };

  const onConfirmCode = async () => {
    if (!code) return;
    setStatus({ step: "confirming" });
    const result = await confirmLogin(email, code);
    if (result.ok) {
      setToken(result.data.token);
      router.push("/account");
    } else {
      setStatus({ step: "error", message: result.error });
    }
  };

  const isBusy = status.step === "sending" || status.step === "confirming";

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[#FFF4ED] -z-10" />
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-10 shadow-2xl border border-white/70">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sign in</h1>
            <p className="text-sm text-gray-500">One account for celebrations and donations.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="sign-in-email" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
            Email
          </label>
          <input
            id="sign-in-email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            disabled={status.step === "code" || status.step === "confirming"}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-60"
          />
        </div>

        {status.step === "email" || status.step === "sending" ? (
          <button
            type="button"
            onClick={onSendCode}
            disabled={isBusy || !email}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.step === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
            Send sign-in code
          </button>
        ) : (
          <div className="mt-6 space-y-3">
            <div>
              <label htmlFor="sign-in-code" className="text-sm font-bold text-gray-600 uppercase tracking-widest ml-1">
                6-digit code
              </label>
              <input
                id="sign-in-code"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full mt-2 px-6 py-4 rounded-2xl bg-white border border-gray-200 focus:border-primary-pink/30 focus:ring-4 focus:ring-primary-pink/5 outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 px-1">
              Actual email delivery isn&apos;t wired up yet, so check <code>workers/src/routes/auth.ts</code> once a provider is
              chosen.
            </p>
            <button
              type="button"
              onClick={onConfirmCode}
              disabled={isBusy || !code}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary-pink text-white font-bold hover:bg-primary-pink/90 transition-colors disabled:opacity-60"
            >
              {status.step === "confirming" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Confirm and sign in
                </>
              )}
            </button>
          </div>
        )}

        {status.step === "error" && (
          <p className="flex items-start gap-2 text-sm font-semibold text-primary-pink mt-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
