import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CONTACT_REASONS } from "../contactReasons";

// "Why are you contacting us?" dropdown. A real listbox: arrow keys, Home/End, Enter/Space, Esc, type-to-jump,
// closes on an outside click, and each option carries a short hint.
export default function ReasonSelect({ value, onChange, invalid = false }) {
      const [open, setOpen] = useState(false);
      const [active, setActive] = useState(0);
      const [box, setBox] = useState(null); // where the list sits on screen (it is drawn above the page, so no card can clip it)
      const root = useRef(null);
      const list = useRef(null);
      const typed = useRef({ text: "", t: 0 });
      const uid = useId();
      const selected = CONTACT_REASONS.find((r) => r.id === value);

      useEffect(() => {
            if (!open) return undefined;
            const onDown = (e) => { if (root.current && !root.current.contains(e.target) && !list.current?.contains(e.target)) setOpen(false); };
            document.addEventListener("mousedown", onDown);
            return () => document.removeEventListener("mousedown", onDown);
      }, [open]);

      // Keep the highlighted option in view.
      useEffect(() => {
            if (open) list.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
      }, [active, open]);

      // Place the list under the field, or above it when that side has more room; size it to the space on screen.
      const HEADER = 80; // sticky site header
      const place = () => {
            const el = root.current;
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const NEED = 8 * 50 + 12;
            const below = window.innerHeight - r.bottom - 16;
            const above = r.top - HEADER;
            const up = below < Math.min(NEED, 260) && above > below;
            const max = Math.max(150, Math.min(NEED, up ? above : below));
            return { left: r.left, width: r.width, max, ...(up ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }) };
      };
      const openList = () => {
            setBox(place());
            setActive(Math.max(0, CONTACT_REASONS.findIndex((r) => r.id === value)));
            setOpen(true);
      };
      // Follow the field while the page scrolls or resizes.
      useEffect(() => {
            if (!open) return undefined;
            const update = () => setBox(place());
            window.addEventListener("scroll", update, true);
            window.addEventListener("resize", update);
            return () => { window.removeEventListener("scroll", update, true); window.removeEventListener("resize", update); };
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [open]);
      const choose = (i) => { onChange(CONTACT_REASONS[i].id); setOpen(false); root.current?.querySelector("button")?.focus(); };

      const onKeyDown = (e) => {
            const last = CONTACT_REASONS.length - 1;
            if (!open) {
                  if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(); }
                  return;
            }
            if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
            else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, last)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Home") { e.preventDefault(); setActive(0); }
            else if (e.key === "End") { e.preventDefault(); setActive(last); }
            else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(active); }
            else if (e.key === "Tab") setOpen(false);
            else if (e.key.length === 1) {
                  const now = Date.now();
                  typed.current.text = now - typed.current.t > 700 ? e.key.toLowerCase() : typed.current.text + e.key.toLowerCase();
                  typed.current.t = now;
                  const hit = CONTACT_REASONS.findIndex((r) => r.label.toLowerCase().startsWith(typed.current.text));
                  if (hit >= 0) setActive(hit);
            }
      };

      return (
            <div ref={root} className="relative normal-case">
                  <button
                        type="button"
                        id={`${uid}-btn`}
                        onClick={() => (open ? setOpen(false) : openList())}
                        onKeyDown={onKeyDown}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={`${uid}-list`}
                        aria-invalid={invalid}
                        className={`flex min-h-[46px] w-full items-center justify-between gap-3 rounded-[2px] border bg-white px-[14px] py-3 text-left text-[13px] transition focus:outline-none ${invalid ? "border-red-400" : open ? "border-[#7db3e0] shadow-[0_0_0_3px_rgb(10_101_180/8%)]" : "border-[#dde5ee] hover:border-[#7db3e0]"}`}>
                        <span className={selected ? "font-medium text-[#17283e]" : "text-[#98a4b2]"}>{selected ? selected.label : "Select a reason"}</span>
                        <svg className={`h-4 w-4 shrink-0 text-[#66758A] transition ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 8 5 5 5-5" /></svg>
                  </button>

                  {open && box && createPortal(
                        <ul
                              ref={list}
                              id={`${uid}-list`}
                              role="listbox"
                              aria-labelledby={`${uid}-btn`}
                              aria-activedescendant={`${uid}-o${active}`}
                              tabIndex={-1}
                              style={{ position: "fixed", left: box.left, width: box.width, top: box.top, bottom: box.bottom, maxHeight: box.max }} className="z-[9998] overflow-y-auto rounded-md border border-[#E1E9F2] bg-white p-1 normal-case shadow-[0_18px_40px_-16px_rgba(20,34,53,0.35)]"
                        >
                              {CONTACT_REASONS.map((r, i) => {
                                    const isSel = r.id === value;
                                    return (
                                          <li
                                                key={r.id}
                                                id={`${uid}-o${i}`}
                                                data-i={i}
                                                role="option"
                                                aria-selected={isSel}
                                                onMouseEnter={() => setActive(i)}
                                                onClick={() => choose(i)}
                                                className={`flex cursor-pointer items-start justify-between gap-3 rounded px-3 py-2 ${i === active ? "bg-[#F1F8FF]" : ""}`}
                                          >
                                                <span className="min-w-0">
                                                      <span className={`block text-[13px] ${isSel ? "font-bold text-[#0A65B4]" : "font-semibold text-[#17283e]"}`}>{r.label}</span>
                                                      <span className="block text-[12px] leading-snug text-[#66758A]">{r.hint}</span>
                                                </span>
                                                {isSel && <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#0A65B4]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 10 4 4 8-9" /></svg>}
                                          </li>
                                    );
                              })}
                        </ul>,
                        document.body
                  )}
</div>
      );
}
