import { useEffect, useRef, useState } from "react";
import { AlertTriangle, HelpCircle, Trash2 } from "lucide-react";

// The look of the custom confirmation dialog. Used by confirmDialog()/promptDialog() and by the older DeleteModal.

const TONES = {
      danger: { Icon: Trash2, ring: "bg-red-500/15 text-red-500", button: "bg-red-600 hover:bg-red-500 focus-visible:ring-red-500/50" },
      warning: { Icon: AlertTriangle, ring: "bg-amber-500/15 text-amber-500", button: "bg-amber-600 hover:bg-amber-500 focus-visible:ring-amber-500/50" },
      default: { Icon: HelpCircle, ring: "bg-blue-500/15 text-blue-500", button: "bg-[#0A65B4] hover:bg-[#084F8D] focus-visible:ring-blue-500/50" },
};

export function ConfirmView({ title, message, confirmText = "Confirm", cancelText = "Cancel", tone = "default", dark = true, prompt, busy = false, onConfirm, onCancel }) {
      const t = TONES[tone] || TONES.default;
      const [value, setValue] = useState(prompt?.defaultValue || "");
      const [error, setError] = useState("");
      const cancelRef = useRef(null);
      const confirmRef = useRef(null);
      const inputRef = useRef(null);

      // Destructive actions start on Cancel so Enter never deletes by accident; prompts start in the field.
      useEffect(() => {
            const el = prompt ? inputRef.current : tone === "danger" ? cancelRef.current : confirmRef.current;
            el?.focus();
      }, [prompt, tone]);

      useEffect(() => {
            const onKey = (e) => { if (e.key === "Escape") { e.preventDefault(); onCancel(); } };
            document.addEventListener("keydown", onKey);
            return () => document.removeEventListener("keydown", onKey);
      }, [onCancel]);

      const submit = () => {
            if (prompt) {
                  const v = value.trim();
                  if (prompt.required && !v) { setError(prompt.requiredMessage || "This is required"); inputRef.current?.focus(); return; }
                  onConfirm(v);
            } else onConfirm(true);
      };

      const c = dark
            ? { panel: "bg-[#111A2E] border-slate-600/30 text-slate-100", body: "text-slate-400", cancel: "border-slate-600/40 bg-slate-500/10 text-slate-200 hover:bg-slate-500/20", field: "border-slate-600/50 bg-[#0B1220] text-slate-100 placeholder-slate-500" }
            : { panel: "bg-white border-[#E1E9F2] text-[#142235]", body: "text-[#66758A]", cancel: "border-[#D3DEEA] bg-white text-[#142235] hover:bg-[#F1F8FF]", field: "border-[#D3DEEA] bg-white text-[#142235] placeholder-[#8794A4]" };

      return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="presentation">
                  <style>{`@keyframes cf-pop{from{opacity:0;transform:translateY(8px) scale(.97)}to{opacity:1;transform:none}}@keyframes cf-fade{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.cf-anim{animation:none!important}}`}</style>
                  <div className="cf-anim absolute inset-0 bg-[#070C16]/60 backdrop-blur-sm" style={{ animation: "cf-fade .15s ease-out" }} onClick={onCancel} />
                  <div role="alertdialog" aria-modal="true" aria-labelledby="cf-title" aria-describedby={message ? "cf-msg" : undefined} className={`cf-anim relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${c.panel}`} style={{ animation: "cf-pop .18s ease-out" }}>
                        <div className="flex gap-4">
                              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${t.ring}`} aria-hidden="true"><t.Icon size={20} /></span>
                              <div className="min-w-0 flex-1">
                                    <h2 id="cf-title" className="text-base font-bold leading-snug">{title}</h2>
                                    {message && <p id="cf-msg" className={`mt-1.5 text-sm leading-relaxed ${c.body}`}>{message}</p>}
                                    {prompt && (
                                          <div className="mt-3">
                                                {prompt.label && <label htmlFor="cf-input" className={`mb-1.5 block text-xs font-semibold uppercase tracking-wide ${c.body}`}>{prompt.label}</label>}
                                                <input
                                                      id="cf-input"
                                                      ref={inputRef}
                                                      value={value}
                                                      onChange={(e) => { setValue(e.target.value); setError(""); }}
                                                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
                                                      placeholder={prompt.placeholder}
                                                      maxLength={prompt.maxLength || 300}
                                                      aria-invalid={Boolean(error)}
                                                      aria-describedby={error ? "cf-error" : undefined}
                                                      className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 ${c.field}`}
                                                />
                                                {error && <p id="cf-error" role="alert" className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
                                          </div>
                                    )}
                              </div>
                        </div>
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                              <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${c.cancel}`}>{cancelText}</button>
                              <button ref={confirmRef} type="button" onClick={submit} disabled={busy} className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 disabled:opacity-60 ${t.button}`}>{busy ? "Working…" : confirmText}</button>
                        </div>
                  </div>
            </div>
      );
}
