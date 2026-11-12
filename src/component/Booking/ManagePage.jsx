import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { base_url } from "../../layout/Title";
import SlotPicker from "./SlotPicker";
import OfficeMap from "./OfficeMap";
import MapPreview from "./MapPreview";
import MeetingPrep from "./MeetingPrep";
import { confirmDialog } from "../../Hook/confirmDialog";

const MODES = { online: "Online meeting", phone: "Phone call", office: "At our office", client_site: "We visit your office" };
const GRID_BG = {
      backgroundImage: "linear-gradient(rgb(10 44 77 / 2.2%) 1px, transparent 1px), linear-gradient(90deg, rgb(10 44 77 / 2.2%) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
};

const ManagePage = () => {
      const { id } = useParams();
      const [params] = useSearchParams();
      const token = params.get("token") || "";
      const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

      const [a, setA] = useState(null);
      const [state, setState] = useState("loading"); // loading | ready | missing
      const [picking, setPicking] = useState(false);
      const [pending, setPending] = useState(null); // { date, time }
      const [h12, setH12] = useState(true);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState("");
      const [notice, setNotice] = useState("");

      useEffect(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            document.title = "Manage your appointment | Bright Future Soft";
            // Private page: keep it out of search results.
            const meta = document.createElement("meta");
            meta.name = "robots";
            meta.content = "noindex, nofollow";
            document.head.appendChild(meta);
            return () => meta.remove();
      }, []);

      const load = useCallback(async () => {
            try {
                  const res = await fetch(`${base_url}/appointment/manage?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`);
                  const json = await res.json();
                  if (!res.ok || !json.success) { setState("missing"); return; }
                  setA(json.data);
                  setState("ready");
            } catch {
                  setState("missing");
            }
      }, [id, token]);

      useEffect(() => { load(); }, [load]);

      const post = async (path, body) => {
            setBusy(true);
            setError("");
            try {
                  const res = await fetch(`${base_url}/appointment/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, token, ...body }) });
                  const json = await res.json();
                  if (!res.ok || !json.success) { setError(json.message || "Something went wrong"); return false; }
                  return true;
            } catch {
                  setError("Network error. Try again.");
                  return false;
            } finally {
                  setBusy(false);
            }
      };

      const confirmReschedule = async () => {
            if (await post("reschedule", pending)) {
                  setNotice("Your appointment was moved. A new confirmation was emailed to you.");
                  setPicking(false);
                  setPending(null);
                  await load();
            }
      };

      const cancel = async () => {
            if (!(await confirmDialog({ title: "Cancel this appointment?", message: "Your time will be released and we will email you a confirmation. You can book a new time any time.", confirmText: "Yes, cancel it", cancelText: "Keep appointment", tone: "danger" }))) return;
            if (await post("cancel", {})) {
                  setNotice("Your appointment was cancelled.");
                  await load();
            }
      };

      const labelOf = (date, time) => new Date(`${date}T${time}:00+06:00`).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: h12 });
      const cancelled = a?.status === "cancelled";
      const btn = "rounded-sm border border-[#E1E9F2] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#0A65B4] hover:text-[#0A65B4] disabled:opacity-50";

      return (
            <section className="bg-white px-4 py-12 text-[#142235] sm:px-6 lg:px-8 lg:py-20" style={GRID_BG}>
                  <div className="mx-auto max-w-4xl">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0A65B4]">Your appointment</p>
                        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Manage your booking</h1>

                        {state === "loading" && <p className="mt-8 text-sm text-[#8794A4]">Loading…</p>}
                        {state === "missing" && (
                              <div className="mt-8 rounded-sm border border-[#E1E9F2] bg-white p-8">
                                    <p className="font-semibold">We could not find this booking.</p>
                                    <p className="mt-1 text-sm text-[#66758A]">The link may be incomplete. Open it again from your confirmation email, or book a new time.</p>
                                    <Link to="/book" className="mt-5 inline-block rounded-sm bg-[#0A65B4] px-5 py-3 text-sm font-semibold text-white hover:bg-[#084F8D]">Book an appointment</Link>
                              </div>
                        )}

                        {state === "ready" && a && (
                              <div className="mt-8 space-y-4">
                                    {notice && <p role="status" className="rounded-sm border border-[#0A65B4]/30 bg-[#F1F8FF] p-4 text-sm font-medium text-[#0A65B4]">{notice}</p>}

                                    <div className="rounded-sm border border-[#E1E9F2] bg-[#F7FAFF] shadow-[0_24px_60px_-30px_rgba(10,101,180,0.25)]">
                                          <div className="flex items-center justify-between border-b border-[#E1E9F2] p-6">
                                                <h2 className="text-xl font-bold tracking-tight">{a.type_name}</h2>
                                                <span className={`rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${cancelled ? "bg-red-50 text-red-600" : "bg-[#F1F8FF] text-[#0A65B4]"}`}>{a.status}</span>
                                          </div>
                                          <dl className="divide-y divide-[#E1E9F2] text-sm">
                                                <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">When</dt><dd className="font-medium">{new Date(a.start_time).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", hour12: h12 })} ({tz}) · {a.duration_minutes} min</dd></div>
                                                <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">How</dt><dd className="font-medium">{MODES[a.mode] || MODES.online}</dd></div>
                                                {a.mode === "online" && <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">Link</dt><dd className="font-medium">{a.meet_link ? <a href={a.meet_link} target="_blank" rel="noopener noreferrer" className="break-all text-[#0A65B4]">{a.meet_link}</a> : "Meeting link will be emailed before the call"}</dd></div>}
                                                <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">Who</dt><dd className="font-medium">{a.name}{a.company ? `, ${a.company}` : ""} · {a.email}</dd></div>
                                                {a.agenda && <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">Agenda</dt><dd className="whitespace-pre-wrap font-medium">{a.agenda}</dd></div>}
                                                <div className="flex gap-4 p-5"><dt className="w-24 shrink-0 text-[#8794A4]">Reference</dt><dd className="font-mono text-xs font-medium uppercase">{String(a._id).slice(-8)}</dd></div>
                                          </dl>
                                          {a.mode === "office" && !cancelled && <div className="p-6 pt-2"><OfficeMap /></div>}
                                          {(a.mode === "online" || a.mode === "phone") && !cancelled && a.prep && <div className="p-6 pt-2"><MeetingPrep kind={a.mode} mode={a.prep.mode} prepare={a.prep.prepare} phone={a.phone} /></div>}
                                          {a.mode === "client_site" && !cancelled && <div className="p-6 pt-2">{a.visit_lat != null ? <MapPreview lat={a.visit_lat} lng={a.visit_lng} name={a.visit_place || "Meeting location"} address={a.visit_address} mapUrl={a.visit_map_url} verified /> : <OfficeMap place={{ name: "Meeting location", address: a.visit_address, map_url: a.visit_map_url, link_reachable: true, exact_pin: true }} />}</div>}
                                    </div>

                                    {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

                                    {!cancelled && a.status === "confirmed" && (
                                          a.can_change ? (
                                                <div className="flex flex-wrap gap-2">
                                                      <button type="button" onClick={() => { setPicking(p => !p); setPending(null); setError(""); }} className={btn}>{picking ? "Close" : "Reschedule"}</button>
                                                      <button type="button" disabled={busy} onClick={cancel} className={`${btn} text-red-600 hover:border-red-400 hover:text-red-600`}>Cancel appointment</button>
                                                </div>
                                          ) : (
                                                <p className="rounded-sm border border-[#E1E9F2] bg-white p-4 text-sm text-[#66758A]">Changes close {a.min_notice_hours} hours before the meeting. To change this booking now, <Link to="/contact" className="font-semibold text-[#0A65B4]">contact us</Link>.</p>
                                          )
                                    )}
                                    {cancelled && <Link to={`/book`} className="inline-block rounded-sm bg-[#0A65B4] px-5 py-3 text-sm font-semibold text-white hover:bg-[#084F8D]">Book a new time</Link>}

                                    {picking && a.can_change && (
                                          <div className="rounded-sm border border-[#E1E9F2] bg-[#F7FAFF]">
                                                {pending ? (
                                                      <div className="p-6 sm:p-9">
                                                            <button type="button" onClick={() => setPending(null)} className="mb-4 text-sm font-medium text-[#66758A] hover:text-[#0A65B4]">← Pick another time</button>
                                                            <h3 className="text-xl font-bold tracking-tight">Move to this time?</h3>
                                                            <p className="mt-2 text-sm font-medium text-[#0A65B4]">{labelOf(pending.date, pending.time)}</p>
                                                            <button type="button" disabled={busy} onClick={confirmReschedule} className="mt-6 rounded-sm bg-[#0A65B4] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#084F8D] disabled:opacity-50">{busy ? "Moving…" : "Confirm new time"}</button>
                                                      </div>
                                                ) : (
                                                      <SlotPicker typeId={a.type} excludeId={a._id} tz={tz} h12={h12} setH12={setH12} onSelect={(date, time) => setPending({ date, time })} />
                                                )}
                                          </div>
                                    )}
                              </div>
                        )}
                  </div>
            </section>
      );
};

export default ManagePage;
