import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import logo from "../../../Assctes/logo.png";
import ceoSignature from "../../../Assctes/ceo-signature.png";
import { COMPANY, Watermark } from "../Invoice/print/Documents";
import { safeHtml } from "../../../layout/safeHtml";

// The notice on the company pad (letterhead): an A4 sheet. Colours are inline on purpose, so the sheet looks like
// paper in dark mode, light mode and in print.
// Letterhead details for notices (the invoices keep their own company settings).
const PAD = {
      ...COMPANY,
      tagline: "A Software Manufacture Company",
      email: "info@brightfuturesoft.com",
      };

const CEO_TITLE = "CEO and Founder";
const CEO_NAME = "Md. Mahadi Hasan";

const BLUE = "#0A65B4";
const INK = "#142235";
const MUTED = "#66758A";
const LINE = "#E1E9F2";

// The sheet itself: exactly 210 x 297 mm, so print and PDF match what is on screen.
export const NoticeSheet = forwardRef(function NoticeSheet({ subject, body, date, reference, draft, approval, status }, ref) {
      const when = new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      const approved = Boolean(approval);
      const waiting = !approved && (status === "pending" || draft);
      const avoid = { breakInside: "avoid", pageBreakInside: "avoid" };
      return (
            <div ref={ref} style={{ width: "210mm", minHeight: "297mm", background: "#fff", color: INK, fontFamily: "Inter, Arial, sans-serif", position: "relative", display: "flex", flexDirection: "column", boxSizing: "border-box", overflow: "hidden" }}>
                  <div style={{ height: "3mm", background: BLUE }} />

                  {/* watermark: the same faint company mark used on invoices and payslips */}
                  <Watermark />

                  {/* notice text: the site's base styles strip paragraph spacing and list bullets, so restore them for the sheet */}
                  <style>{`
                        .notice-pad-body p { margin: 0 0 3.2mm; }
                        .notice-pad-body ul { list-style: disc; padding-left: 6mm; margin: 0 0 3.2mm; }
                        .notice-pad-body ol { list-style: decimal; padding-left: 6mm; margin: 0 0 3.2mm; }
                        .notice-pad-body li { margin: 0 0 1mm; }
                        .notice-pad-body h1, .notice-pad-body h2, .notice-pad-body h3, .notice-pad-body h4 { font-weight: 800; margin: 4mm 0 2mm; line-height: 1.3; }
                        .notice-pad-body h1 { font-size: 15pt; } .notice-pad-body h2 { font-size: 13.5pt; } .notice-pad-body h3, .notice-pad-body h4 { font-size: 12pt; }
                        .notice-pad-body a { color: ${BLUE}; text-decoration: underline; }
                        .notice-pad-body blockquote { margin: 0 0 3.2mm; padding-left: 4mm; border-left: 0.8mm solid ${LINE}; color: ${MUTED}; }
                        .notice-pad-body table { border-collapse: collapse; width: 100%; margin: 0 0 3.2mm; }
                        .notice-pad-body td, .notice-pad-body th { border: 0.25mm solid ${LINE}; padding: 1.5mm 2.5mm; text-align: left; }
                        .notice-pad-body img { max-width: 100%; height: auto; }
                        .notice-pad-body > :last-child { margin-bottom: 0; }
                  `}</style>

                  {/* 1. letterhead */}
                  <header style={{ padding: "9mm 16mm 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8mm" }}>
                        <img src={logo} alt={PAD.name} style={{ height: "16mm", width: "auto" }} />
                        <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: "15pt", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.1, color: INK }}>{PAD.name}</div>
                              <div style={{ marginTop: "1.2mm", fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE }}>{PAD.tagline}</div>
                              <div style={{ fontSize: "8.5pt", lineHeight: 1.65, color: MUTED, marginTop: "2mm" }}>
                                    <div>{PAD.address}</div>
                                    <div>{PAD.phone} &nbsp;·&nbsp; {PAD.email}</div>
                                    <div>{PAD.website}</div>
                              </div>
                        </div>
                  </header>
                  <div style={{ margin: "6mm 16mm 0", borderTop: `0.7mm solid ${BLUE}`, borderBottom: `0.2mm solid ${LINE}`, height: "1.3mm" }} />

                  {/* 2. title */}
                  <div style={{ padding: "8mm 16mm 0", textAlign: "center" }}>
                        <div style={{ display: "inline-block", fontSize: "21pt", fontWeight: 800, letterSpacing: "0.3em", color: BLUE, paddingLeft: "0.3em" }}>NOTICE</div>
                        <div style={{ width: "24mm", height: "0.9mm", background: BLUE, margin: "2mm auto 0" }} />
                  </div>

                  {/* 3. reference and date (soft background, no border) */}
                  <div style={{ margin: "7mm 16mm 0", background: "#F7FAFF", borderRadius: "1.2mm", display: "flex", justifyContent: "space-between", padding: "3mm 5mm", fontSize: "9.5pt" }}>
                        <div><span style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>Ref. no. &nbsp;</span><strong>{reference}</strong></div>
                        <div><span style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>Date &nbsp;</span><strong>{when}</strong></div>
                  </div>

                  {/* 4. subject */}
                  <div style={{ margin: "7mm 16mm 0", borderLeft: `1.1mm solid ${BLUE}`, padding: "0.5mm 0 0.5mm 4.5mm", ...avoid }}>
                        <div style={{ fontSize: "7.5pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE }}>Subject</div>
                        <div style={{ fontSize: "14pt", fontWeight: 800, lineHeight: 1.3, marginTop: "1mm", overflowWrap: "anywhere" }}>{subject || (draft ? "Your notice headline appears here" : "")}</div>
                  </div>

                  {/* 5. body */}
                  <div style={{ padding: "7mm 16mm 0", flex: 1 }}>
                        <div
                              className="notice-pad-body"
                              style={{ fontSize: "11pt", lineHeight: 1.75, textAlign: "justify", overflowWrap: "anywhere", color: INK }}
                              dangerouslySetInnerHTML={{ __html: safeHtml(body) || (draft ? `<p style="color:${MUTED}">The notice text appears here as you type.</p>` : "") }}
                        />
                  </div>

                  {/* 6. closing: note on the left, a small CEO approval block on the right (no seal, no box) */}
                  <div style={{ padding: "8mm 16mm 7mm", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "10mm", ...avoid }}>
                        <div style={{ fontSize: "8pt", color: MUTED, lineHeight: 1.6, maxWidth: "80mm" }}>This is an official notice of {PAD.name}. Please read it carefully and follow it.</div>
                        <div style={{ width: "58mm", textAlign: "left" }}>
                              <div style={{ fontSize: "7pt", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: BLUE }}>Approved by</div>
                              <div style={{ height: "13mm", display: "flex", alignItems: "flex-end" }}>
                                    {approved ? (
                                          <img src={approval.signature || ceoSignature} alt="Signature" crossOrigin="anonymous" style={{ maxHeight: "12mm", maxWidth: "40mm", objectFit: "contain", mixBlendMode: "multiply" }} />
                                    ) : (
                                          <span style={{ marginBottom: "1mm", fontSize: "8pt", fontWeight: 700, color: "#B45309" }}>{waiting ? "Pending approval" : "Management"}</span>
                                    )}
                              </div>
                              <div style={{ borderTop: `0.3mm dashed ${INK}`, marginTop: "0.5mm", paddingTop: "1.2mm", fontSize: "10pt", fontWeight: 800 }}>{approved ? approval.name : CEO_NAME}</div>
                              <div style={{ fontSize: "8.5pt", color: MUTED }}>{approved ? approval.title || CEO_TITLE : CEO_TITLE}</div>
                              {approved && approval.date && <div style={{ fontSize: "7pt", color: MUTED }}>{new Date(approval.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>}
                        </div>
                  </div>

                  {/* 7. footer */}
                  <footer style={{ margin: "0 16mm", borderTop: `0.3mm solid ${LINE}`, padding: "3mm 0 4mm", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "6mm", fontSize: "8pt", color: MUTED, ...avoid }}>
                        <span>{PAD.website}</span>
                        <span>{PAD.email}</span>
                        <span style={{ textAlign: "right" }}>{PAD.phone}</span>
                  </footer>
                  <div style={{ height: "3mm", background: BLUE }} />
                  {draft && <div style={{ position: "absolute", top: "10mm", right: "16mm", border: `0.4mm solid ${BLUE}`, color: BLUE, fontSize: "8pt", fontWeight: 700, letterSpacing: "0.15em", padding: "1mm 3mm", borderRadius: "1mm", background: "#F1F8FF", zIndex: 5 }} data-no-print>PREVIEW</div>}
            </div>
      );
});

// Shrinks the A4 sheet to the width available (a paper-looking preview), without changing the sheet itself.
export default function FitSheet({ children, maxWidth }) {
      const box = useRef(null);
      const sheet = useRef(null);
      const [scale, setScale] = useState(1);
      const [height, setHeight] = useState(0);

      useLayoutEffect(() => {
            const el = box.current;
            if (!el) return undefined;
            const measure = () => {
                  const full = 793.7; // 210mm in CSS px
                  const next = Math.min(1, (maxWidth ? Math.min(el.clientWidth, maxWidth) : el.clientWidth) / full);
                  setScale(next);
                  setHeight((sheet.current?.offsetHeight || 0) * next);
            };
            measure();
            const ro = new ResizeObserver(measure);
            ro.observe(el);
            if (sheet.current) ro.observe(sheet.current);
            return () => ro.disconnect();
      }, [maxWidth, children]);

      return (
            <div ref={box} className="w-full" style={{ height: height || undefined }}>
                  <div style={{ width: "210mm", transform: `scale(${scale})`, transformOrigin: "top left" }}>
                        <div ref={sheet} className="shadow-[0_20px_50px_-20px_rgba(20,34,53,0.45)]">{children}</div>
                  </div>
            </div>
      );
}
