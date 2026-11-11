import { useCallback, useEffect, useState } from "react";
import { base_url } from "../../../layout/Title";
import SlotPicker from "../../../component/Booking/SlotPicker";

const FILTERS = ["upcoming", "past", "cancelled", "all"];

const Appointments = () => {
      const [items, setItems] = useState([]);
      const [filter, setFilter] = useState("upcoming");
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");
      const [google, setGoogle] = useState(null);
      const [moving, setMoving] = useState(null); // appointment being rescheduled
      const [pending, setPending] = useState(null); // { date, time }
      const [h12, setH12] = useState(true);
      const [notice, setNotice] = useState("");
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const load = useCallback(async () => {
            setLoading(true);
            setError("");
            try {
                  const json = await fetch(`${base_url}/appointment/list`).then(r => r.json());
                  if (!json.success) throw new Error(json.message || "Failed to load");
                  setItems(json.data || []);
            } catch (e) {
                  setError(e.message || "Failed to load");
            } finally {
                  setLoading(false);
            }
      }, []);

      useEffect(() => { load(); }, [load]);

      const loadGoogle = useCallback(async () => {
            try {
                  const json = await fetch(`${base_url}/appointment/google/status`).then(r => r.json());
                  if (json.success) setGoogle(json.data);
            } catch { /* panel just stays hidden */ }
      }, []);

      useEffect(() => {
            loadGoogle();
            const q = new URLSearchParams(window.location.search);
            if (q.get("gcal") === "connected") {
                  setNotice("Google Calendar connected. Creating Meet links for upcoming online bookings…");
                  backfill();
            }
            else if (q.get("gcal") === "error") {
                  const why = {
                        redirect_uri_mismatch: "The redirect URI is not listed in Google Cloud. Add the address shown below and try again.",
                        state_expired: "Sign-in took longer than 10 minutes. Click Connect again and finish quickly.",
                        state_invalid: "The sign-in session did not match this server. Click Connect again from this same site.",
                        invalid_client: "The Google client ID or secret on the server is wrong.",
                        invalid_grant: "Google rejected the sign-in code. Click Connect again.",
                        access_denied: "Access was not allowed on Google's screen.",
                        permissions_missing: "Calendar permission was not ticked. Connect again and allow Calendar access.",
                        no_refresh_token: "Google did not return a long-lived token. Remove the app at myaccount.google.com/permissions and connect again.",
                        encryption_key: "The server's encryption key (GMAIL_ENC_KEY) is missing or invalid.",
                        database: "The server could not save the connection (database error).",
                  }[q.get("reason")];
                  setNotice(`Google Calendar was not connected. ${why || `Reason: ${q.get("reason") || "failed"}.`}${q.get("detail") ? ` (${q.get("detail")})` : ""}`);
            }
            if (q.get("gcal")) window.history.replaceState({}, "", window.location.pathname);
      }, [loadGoogle]);

      // Meet links for upcoming online bookings made before Google was connected; each visitor is emailed.
      const backfill = async () => {
            try {
                  const json = await fetch(`${base_url}/appointment/google/backfill`, { method: "POST" }).then(r => r.json());
                  if (json.success) {
                        const { checked, created } = json.data;
                        setNotice(checked === 0 ? "Google Calendar connected. New online bookings now get a Google Meet link." : `Google Calendar connected. Created ${created} of ${checked} missing Meet link(s) and emailed the visitors.`);
                        load();
                  } else {
                        setNotice(json.message || "Connected, but creating Meet links failed.");
                  }
            } catch {
                  setNotice("Connected, but creating Meet links failed. Try the button again.");
            }
      };

      const connectGoogle = async () => {
            const json = await fetch(`${base_url}/appointment/google/auth-url`).then(r => r.json()).catch(() => ({}));
            if (json.success) window.location.href = json.data.url;
            else alert(json.message || "Could not start Google sign-in");
      };

      const disconnectGoogle = async () => {
            if (!window.confirm("Disconnect Google Calendar? New bookings will no longer get a Meet link.")) return;
            await fetch(`${base_url}/appointment/google/disconnect`, { method: "DELETE" });
            loadGoogle();
      };

      const confirmMove = async () => {
            const res = await fetch(`${base_url}/appointment/admin-reschedule?appointment_id=${moving._id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(pending),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) { alert(json.message || "Reschedule failed"); return; }
            setNotice("Appointment rescheduled. The visitor was emailed the new time.");
            setMoving(null);
            setPending(null);
            load();
      };

      const setStatus = async (id, status) => {
            const res = await fetch(`${base_url}/appointment/update?appointment_id=${id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) alert(json.message || "Update failed");
            load();
      };

      const remove = async id => {
            if (!window.confirm("Delete this appointment permanently?")) return;
            await fetch(`${base_url}/appointment/delete?appointment_id=${id}`, { method: "DELETE" });
            load();
      };

      const now = Date.now();
      const shown = items.filter(a => {
            const t = new Date(a.start_time).getTime();
            if (filter === "upcoming") return a.status === "confirmed" && t + a.duration_minutes * 60000 > now;
            if (filter === "past") return a.status !== "cancelled" && t + a.duration_minutes * 60000 <= now;
            if (filter === "cancelled") return a.status === "cancelled";
            return true;
      });

      return (
            <div className="min-h-screen max-w-6xl p-3 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-2xl font-semibold">Appointments</h2>
                        <div className="flex gap-1 rounded-xl border border-gray-700 bg-gray-900 p-1">
                              {FILTERS.map(f => (
                                    <button
                                          key={f}
                                          onClick={() => setFilter(f)}
                                          className={`rounded-lg px-4 py-1.5 text-sm capitalize ${filter === f ? "bg-indigo-600 text-white" : "text-gray-300"}`}
                                    >
                                          {f}
                                    </button>
                              ))}
                        </div>
                  </div>

                  {notice && <p role="status" className="mb-4 rounded-lg border border-indigo-500/40 bg-indigo-500/10 p-3 text-sm">{notice}</p>}

                  {google && (
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100/25 p-4 text-sm">
                              <div>
                                    <p className="font-semibold">Google Meet links</p>
                                    {google.connected ? (
                                          <p className="text-gray-400">Connected as {google.email || "Google account"}. Online bookings get a Meet link and a Calendar event automatically.{google.canSend ? " Booking emails and reminders are sent from this account." : " Email sending was not allowed, so booking emails use the fallback SMTP login. Reconnect and tick the Gmail send permission."}</p>
                                    ) : google.configured ? (
                                          <p className="text-gray-400">Not connected. Connect the company Google account so online bookings get a Meet link and booking emails and reminders are sent from it. In Google Cloud, enable the Calendar API and add this redirect URI: <span className="break-all font-mono text-xs">{google.redirectUri}</span></p>
                                    ) : (
                                          <p className="text-gray-400">Google sign-in is not configured on the server.</p>
                                    )}
                              </div>
                              {google.connected ? (
                                    <div className="flex gap-2">
                                          <button onClick={backfill} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">Create missing Meet links</button>
                                          <button onClick={disconnectGoogle} className="rounded-lg bg-gray-700 px-3 py-1.5 text-white">Disconnect</button>
                                    </div>
                              ) : google.configured && (
                                    <button onClick={connectGoogle} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-white">Connect Google Calendar</button>
                              )}
                        </div>
                  )}

                  {error && <p className="text-red-500">{error}</p>}
                  {loading ? (
                        <p>Loading…</p>
                  ) : shown.length === 0 ? (
                        <p className="text-gray-400">No appointments.</p>
                  ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                              {shown.map(a => (
                                    <div key={a._id} className="rounded-2xl border border-indigo-100/25 p-4 shadow-lg">
                                          <div className="flex items-start justify-between gap-2">
                                                <div>
                                                      <p className="text-lg font-semibold">{a.name}{a.company ? <span className="text-sm font-normal text-gray-400"> · {a.company}</span> : null}</p>
                                                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">{a.type_name || "Consultation"}{a.mode ? ` · ${a.mode}` : ""}</p>
                                                      <p className="text-sm text-gray-400">
                                                            {new Date(a.start_time).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} · {a.duration_minutes} min
                                                      </p>
                                                </div>
                                                <span className="rounded-full bg-gray-700 px-3 py-1 text-xs capitalize">{a.status}</span>
                                          </div>
                                          <div className="mt-2 space-y-1 text-sm">
                                                <p><a className="text-indigo-400" href={`mailto:${a.email}`}>{a.email}</a></p>
                                                {a.phone && <p>{a.phone}</p>}
                                                {a.mode === "client_site" && <p className="text-gray-300">Visit: {a.visit_address} · <a className="text-indigo-400" href={a.visit_map_url} target="_blank" rel="noopener noreferrer">Open map</a></p>}
                                                {a.mode === "online" && a.status === "confirmed" && (a.meet_link
                                                      ? <p><a className="text-indigo-400" href={a.meet_link} target="_blank" rel="noopener noreferrer">Join Google Meet</a></p>
                                                      : <p className="text-xs text-yellow-500">No Meet link (Google Calendar not connected when booked)</p>)}
                                                {a.agenda && <p className="whitespace-pre-wrap text-gray-200"><span className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Agenda · </span>{a.agenda}</p>}
                                                {a.topic && <p className="whitespace-pre-wrap text-gray-300">{a.topic}</p>}
                                          </div>
                                          <div className="mt-3 flex flex-wrap gap-2 text-sm">
                                                {a.status === "confirmed" && (
                                                      <>
                                                            <button onClick={() => { setMoving(a); setPending(null); }} className="rounded-lg bg-indigo-600 px-3 py-1 text-white">Reschedule</button>
                                                            <button onClick={() => setStatus(a._id, "completed")} className="rounded-lg bg-green-600 px-3 py-1 text-white">Mark done</button>
                                                            <button onClick={() => setStatus(a._id, "cancelled")} className="rounded-lg bg-yellow-600 px-3 py-1 text-white">Cancel</button>
                                                      </>
                                                )}
                                                {a.status === "cancelled" && (
                                                      <button onClick={() => setStatus(a._id, "confirmed")} className="rounded-lg bg-indigo-600 px-3 py-1 text-white">Restore</button>
                                                )}
                                                <button onClick={() => remove(a._id)} className="rounded-lg bg-red-600 px-3 py-1 text-white">Delete</button>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  )}

                  {moving && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Reschedule appointment">
                              <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-sm bg-white text-[#142235]">
                                    <div className="flex items-center justify-between border-b border-[#E1E9F2] p-4">
                                          <p className="font-bold">Reschedule {moving.name} · {moving.type_name}</p>
                                          <button onClick={() => { setMoving(null); setPending(null); }} className="text-sm font-semibold text-[#66758A]">Close</button>
                                    </div>
                                    {pending ? (
                                          <div className="p-6">
                                                <p className="font-semibold">Move to {new Date(`${pending.date}T${pending.time}:00+06:00`).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}?</p>
                                                <p className="mt-1 text-sm text-[#66758A]">The visitor gets an email with the new time and an updated calendar invite.</p>
                                                <div className="mt-5 flex gap-2">
                                                      <button onClick={confirmMove} className="rounded-sm bg-[#0A65B4] px-5 py-2.5 text-sm font-semibold text-white">Confirm</button>
                                                      <button onClick={() => setPending(null)} className="rounded-sm border border-[#E1E9F2] px-5 py-2.5 text-sm font-semibold">Back</button>
                                                </div>
                                          </div>
                                    ) : (
                                          <SlotPicker typeId={moving.type || "consultation"} excludeId={moving._id} tz={tz} h12={h12} setH12={setH12} onSelect={(date, time) => setPending({ date, time })} />
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default Appointments;
