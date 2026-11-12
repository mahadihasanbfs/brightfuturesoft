import { Fragment, useCallback, useEffect, useState } from "react";
import { base_url } from "../../../layout/Title";
import SlotPicker from "../../../component/Booking/SlotPicker";
import { confirmDialog } from "../../../Hook/confirmDialog";

const FILTERS = [["upcoming", "Upcoming"], ["past", "Past"], ["cancelled", "Cancelled"], ["all", "All"]];
const MODE_LABEL = { online: "Online", phone: "Phone", client_site: "On site", office: "At our office" };
const STATUS_STYLE = { confirmed: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30", completed: "bg-sky-500/15 text-sky-300 ring-sky-500/30", cancelled: "bg-red-500/15 text-red-300 ring-red-500/30" };

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
            if (!(await confirmDialog({ title: "Disconnect Google Calendar?", message: "New online bookings will no longer get a Meet link, and booking emails fall back to the SMTP login.", confirmText: "Disconnect", tone: "warning" }))) return;
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
            if (!(await confirmDialog({ title: "Delete this appointment?", message: "It is removed permanently and cannot be restored.", confirmText: "Delete", tone: "danger" }))) return;
            await fetch(`${base_url}/appointment/delete?appointment_id=${id}`, { method: "DELETE" });
            load();
      };

      const [search, setSearch] = useState("");
      const [typeFilter, setTypeFilter] = useState("all");
      const [openId, setOpenId] = useState(null);
      const [range, setRange] = useState("any");
      const [showGoogle, setShowGoogle] = useState(null); // null = open only while not connected
      const [sortDir, setSortDir] = useState(null); // null = automatic (soonest first for upcoming, newest first otherwise)
      const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(10);

      const now = Date.now();
      const startOf = a => new Date(a.start_time).getTime();
      const endOf = a => startOf(a) + (a.duration_minutes || 30) * 60000;
      const isUpcoming = a => a.status === "confirmed" && endOf(a) > now;
      const isPast = a => a.status !== "cancelled" && endOf(a) <= now;

      const counts = {
            upcoming: items.filter(isUpcoming).length,
            past: items.filter(isPast).length,
            cancelled: items.filter(a => a.status === "cancelled").length,
            all: items.length,
      };
      const dayKey = ms => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
      const todayKey = dayKey(now);
      const stats = [
            { label: "Today", value: items.filter(a => isUpcoming(a) && dayKey(startOf(a)) === todayKey).length, hint: "appointments" },
            { label: "Next 7 days", value: items.filter(a => isUpcoming(a) && startOf(a) < now + 7 * 86400000).length, hint: "upcoming" },
            { label: "Needs Meet link", value: items.filter(a => isUpcoming(a) && a.mode === "online" && !a.meet_link).length, hint: "online bookings", warn: true },
            { label: "All time", value: items.length, hint: "bookings" },
      ];
      const typeOptions = [...new Map(items.filter(a => a.type).map(a => [a.type, a.type_name || a.type])).entries()];

      const q = search.trim().toLowerCase();
      const rangeOk = a => {
            const t = startOf(a);
            if (range === "today") return dayKey(t) === todayKey;
            if (range === "week") return t >= now - 3600000 && t < now + 7 * 86400000;
            if (range === "month") return t >= now - 3600000 && t < now + 30 * 86400000;
            return true;
      };
      const dir = sortDir || (filter === "upcoming" ? "asc" : "desc");
      const shown = items
            .filter(a => (filter === "upcoming" ? isUpcoming(a) : filter === "past" ? isPast(a) : filter === "cancelled" ? a.status === "cancelled" : true))
            .filter(a => typeFilter === "all" || a.type === typeFilter)
            .filter(rangeOk)
            .filter(a => !q || [a.name, a.email, a.company, a.phone, a.type_name, a.agenda].some(v => String(v || "").toLowerCase().includes(q)))
            .sort((x, y) => (dir === "asc" ? startOf(x) - startOf(y) : startOf(y) - startOf(x)));
      const pages = Math.max(1, Math.ceil(shown.length / pageSize));
      const cur = Math.min(page, pages);
      const rows = shown.slice((cur - 1) * pageSize, cur * pageSize);

      const rel = a => {
            const m = Math.round((startOf(a) - now) / 60000);
            if (a.status !== "confirmed") return "";
            if (m > 0) return m < 60 ? `in ${m}m` : m < 1440 ? `in ${Math.floor(m / 60)}h ${m % 60}m` : `in ${Math.floor(m / 1440)}d`;
            return endOf(a) > now ? "in progress" : "";
      };
      const soon = a => a.status === "confirmed" && startOf(a) - now <= 3600000 && endOf(a) > now;

      const btn = "rounded-md border border-gray-600 bg-gray-700/60 px-3 py-1.5 text-xs font-semibold text-gray-100 transition hover:bg-gray-600";
      const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join("") || "?";
      const googleOpen = showGoogle ?? (google ? !google.connected : false);
      const filtersActive = q || typeFilter !== "all" || range !== "any";
      const clearFilters = () => { setSearch(""); setTypeFilter("all"); setRange("any"); setPage(1); };
      const select = "rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none";

      return (
            <div className="min-h-screen  p-3 text-gray-100 sm:p-6">
                  {/* Header */}
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                              <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
                              <p className="mt-1 text-sm text-gray-400">Bookings from the public booking page · times in {tz}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                              {google && (
                                    <button onClick={() => setShowGoogle(!googleOpen)} aria-expanded={googleOpen} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${google.connected ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700" : "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"}`}>
                                          <span className={`h-2 w-2 rounded-full ${google.connected ? "bg-emerald-400" : "bg-amber-400"}`} aria-hidden="true" />
                                          Google {google.connected ? "connected" : "not connected"}
                                          <span aria-hidden="true">{googleOpen ? "▴" : "▾"}</span>
                                    </button>
                              )}
                              <button onClick={load} className={btn + " py-2"}>Refresh</button>
                        </div>
                  </div>

                  {notice && (
                        <div role="status" className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-indigo-500/40 bg-indigo-500/10 p-3 text-sm">
                              <p>{notice}</p>
                              <button onClick={() => setNotice("")} className="shrink-0 text-gray-400 hover:text-white" aria-label="Dismiss">✕</button>
                        </div>
                  )}

                  {/* Google panel (collapsible) */}
                  {google && googleOpen && (
                        <div className={`mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-sm ${google.connected ? "border-gray-700 bg-gray-800" : "border-amber-500/40 bg-amber-500/5"}`}>
                              <div className="max-w-3xl">
                                    {google.connected ? (
                                          <p className="text-gray-300"><span className="font-semibold text-white">{google.email || "Google account"}</span> creates the Meet links and Calendar events. {google.canSend ? "Booking emails and reminders are sent from this account." : "Email sending was not allowed: reconnect and tick the Gmail send permission."}</p>
                                    ) : google.configured ? (
                                          <p className="text-gray-300">Connect the company Google account to create Meet links and send booking emails and reminders. In Google Cloud, enable the Calendar API and add this redirect URI: <span className="break-all font-mono text-xs text-gray-400">{google.redirectUri}</span></p>
                                    ) : (
                                          <p className="text-gray-300">Google sign-in is not configured on the server.</p>
                                    )}
                              </div>
                              {google.connected ? (
                                    <div className="flex gap-2">
                                          <button onClick={backfill} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">Create missing Meet links</button>
                                          <button onClick={disconnectGoogle} className={btn}>Disconnect</button>
                                    </div>
                              ) : google.configured && (
                                    <button onClick={connectGoogle} className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500">Connect Google Calendar</button>
                              )}
                        </div>
                  )}

                  {/* Stats strip */}
                  <div className="mb-5 grid grid-cols-2 divide-gray-700 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 sm:grid-cols-4 sm:divide-x">
                        {stats.map(t => (
                              <div key={t.label} className="flex items-baseline justify-between gap-3 border-b border-gray-700 p-4 last:border-b-0 sm:block sm:border-b-0">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t.label}</p>
                                    <p className="sm:mt-1"><span className={`text-2xl font-bold ${t.warn && t.value > 0 ? "text-amber-300" : "text-white"}`}>{t.value}</span> <span className="text-xs text-gray-500">{t.hint}</span></p>
                              </div>
                        ))}
                  </div>

                  {/* Toolbar */}
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                        <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-700 bg-gray-800 p-1">
                              {FILTERS.map(([key, name]) => (
                                    <button
                                          key={key}
                                          onClick={() => { setFilter(key); setPage(1); }}
                                          aria-pressed={filter === key}
                                          className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${filter === key ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700"}`}
                                    >
                                          {name}
                                          <span className={`rounded-full px-2 py-0.5 text-[11px] ${filter === key ? "bg-white/20" : "bg-gray-700 text-gray-300"}`}>{counts[key]}</span>
                                    </button>
                              ))}
                        </div>
                        <input
                              type="search"
                              value={search}
                              onChange={e => { setSearch(e.target.value); setPage(1); }}
                              placeholder="Search name, email, company, agenda"
                              aria-label="Search appointments"
                              className={`${select} min-w-[200px] flex-1 placeholder-gray-500`}
                        />
                        <select value={range} onChange={e => { setRange(e.target.value); setPage(1); }} aria-label="Filter by date range" className={select}>
                              <option value="any">Any date</option>
                              <option value="today">Today</option>
                              <option value="week">Next 7 days</option>
                              <option value="month">Next 30 days</option>
                        </select>
                        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} aria-label="Filter by type" className={select}>
                              <option value="all">All types</option>
                              {typeOptions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                        </select>
                        {filtersActive && <button onClick={clearFilters} className="text-xs font-semibold text-indigo-300 hover:underline">Clear filters</button>}
                  </div>

                  {error && <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

                  {/* Table */}
                  {loading ? (
                        <div className="space-y-2" aria-busy="true">
                              {[0, 1, 2, 3].map(i => <div key={i} className="h-16 animate-pulse rounded-lg border border-gray-700 bg-gray-800" />)}
                        </div>
                  ) : shown.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-800/50 p-10 text-center">
                              <p className="font-semibold">{filtersActive ? "No appointments match your filters" : `No ${filter === "all" ? "" : filter + " "}appointments`}</p>
                              <p className="mt-1 text-sm text-gray-400">{filtersActive ? "Try a different word or widen the date range." : "New bookings from the booking page show up here."}</p>
                              {filtersActive && <button onClick={clearFilters} className={btn + " mt-4"}>Clear filters</button>}
                        </div>
                  ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-800">
                              <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px] text-left text-sm">
                                          <thead className="bg-gray-900/70 text-xs uppercase tracking-wider text-gray-400">
                                                <tr>
                                                      <th scope="col" className="w-40 px-4 py-3 font-semibold">
                                                            <button onClick={() => setSortDir(dir === "asc" ? "desc" : "asc")} className="flex items-center gap-1.5 uppercase tracking-wider hover:text-white" aria-label={`Sort by date, currently ${dir === "asc" ? "soonest first" : "latest first"}`}>
                                                                  When <span aria-hidden="true">{dir === "asc" ? "↑" : "↓"}</span>
                                                            </button>
                                                      </th>
                                                      <th scope="col" className="px-4 py-3 font-semibold">Client</th>
                                                      <th scope="col" className="px-4 py-3 font-semibold">Appointment</th>
                                                      <th scope="col" className="w-28 px-4 py-3 font-semibold">Status</th>
                                                      <th scope="col" className="w-64 px-4 py-3 text-right font-semibold">Actions</th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-700">
                                                {rows.map(a => {
                                                      const open = openId === a._id;
                                                      const start = new Date(a.start_time);
                                                      const isToday = dayKey(startOf(a)) === todayKey && a.status === "confirmed";
                                                      const noLink = a.mode === "online" && a.status === "confirmed" && !a.meet_link;
                                                      return (
                                                            <Fragment key={a._id}>
                                                                  <tr className={`align-middle transition hover:bg-gray-700/30 ${soon(a) ? "bg-indigo-500/10" : isToday ? "bg-indigo-500/[0.04]" : ""} ${a.status === "cancelled" ? "opacity-60" : ""}`}>
                                                                        <td className="whitespace-nowrap px-4 py-3">
                                                                              <p className="text-base font-bold tabular-nums">{start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
                                                                              <p className="text-xs text-gray-400">{isToday ? <span className="font-bold text-indigo-300">Today</span> : start.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · {a.duration_minutes}m</p>
                                                                              {rel(a) && <p className={`text-xs font-semibold ${soon(a) ? "text-indigo-300" : "text-gray-500"}`}>{soon(a) && <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 align-middle" aria-hidden="true" />}{rel(a)}</p>}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                              <div className="flex items-center gap-3">
                                                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300" aria-hidden="true">{initials(a.name)}</span>
                                                                                    <div className="min-w-0">
                                                                                          <p className="truncate font-semibold">{a.name}{a.company && <span className="font-normal text-gray-400"> · {a.company}</span>}</p>
                                                                                          <p className="truncate text-xs"><a className="text-indigo-300 hover:underline" href={`mailto:${a.email}`}>{a.email}</a>{a.phone && <> <span className="text-gray-600">·</span> <a className="text-gray-300 hover:underline" href={`tel:${a.phone}`}>{a.phone}</a></>}</p>
                                                                                    </div>
                                                                              </div>
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                              <p className="font-semibold">{a.type_name || "Consultation"}</p>
                                                                              <p className="mt-0.5 text-xs text-gray-400">{MODE_LABEL[a.mode] || "Online"}{noLink && <span className="ml-2 font-semibold text-amber-300">· no Meet link yet</span>}{a.mode === "phone" && a.phone ? ` · ${a.phone}` : ""}</p>
                                                                              {a.agenda && <p className="mt-1 line-clamp-1 max-w-sm text-xs text-gray-500" title={a.agenda}>{a.agenda}</p>}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                              <span className={`inline-block rounded-md px-2 py-1 text-xs font-semibold capitalize ring-1 ${STATUS_STYLE[a.status] || "bg-gray-700 text-gray-200 ring-gray-600"}`}>{a.status}</span>
                                                                              {(a.reschedule_count || 0) > 0 && <p className="mt-1 text-[11px] text-gray-500">moved {a.reschedule_count}×</p>}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                              <div className="flex flex-wrap items-center justify-end gap-2">
                                                                                    {a.mode === "online" && a.meet_link && a.status === "confirmed" && <a href={a.meet_link} target="_blank" rel="noopener noreferrer" className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Join Meet</a>}
                                                                                    {a.mode === "client_site" && a.visit_map_url && a.status === "confirmed" && <a href={a.visit_map_url} target="_blank" rel="noopener noreferrer" className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Open map</a>}
                                                                                    {a.status === "confirmed" && <button onClick={() => { setMoving(a); setPending(null); }} className={btn}>Reschedule</button>}
                                                                                    {a.status === "cancelled" && <button onClick={() => setStatus(a._id, "confirmed")} className={btn}>Restore</button>}
                                                                                    <button onClick={() => setOpenId(open ? null : a._id)} aria-expanded={open} aria-label={open ? "Hide details" : "Show details"} className={btn}>{open ? "▴" : "▾"}</button>
                                                                              </div>
                                                                        </td>
                                                                  </tr>
                                                                  {open && (
                                                                        <tr className="bg-gray-900/40">
                                                                              <td colSpan={5} className="px-4 py-4">
                                                                                    <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                                                                          <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">When</dt><dd className="mt-0.5">{start.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}</dd></div>
                                                                                          <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Reference</dt><dd className="mt-0.5 font-mono uppercase">{String(a._id).slice(-8)}</dd></div>
                                                                                          <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Booked</dt><dd className="mt-0.5">{a.created_at ? new Date(a.created_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—"}</dd></div>
                                                                                          {a.tz && <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Visitor timezone</dt><dd className="mt-0.5">{a.tz}</dd></div>}
                                                                                          {a.mode === "client_site" && <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Visit location</dt><dd className="mt-0.5">{a.visit_place || a.visit_address}{a.visit_place && a.visit_address && a.visit_address !== a.visit_place ? ` · ${a.visit_address}` : ""}</dd></div>}
                                                                                          {a.meet_link && <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Meet link</dt><dd className="mt-0.5 break-all"><a className="text-indigo-300 hover:underline" href={a.meet_link} target="_blank" rel="noopener noreferrer">{a.meet_link}</a></dd></div>}
                                                                                          {a.agenda && <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Agenda</dt><dd className="mt-0.5 whitespace-pre-wrap">{a.agenda}</dd></div>}
                                                                                          {a.topic && <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs font-bold uppercase tracking-wider text-gray-500">Notes</dt><dd className="mt-0.5 whitespace-pre-wrap">{a.topic}</dd></div>}
                                                                                          {a.email_sent === false && <div><dt className="text-xs font-bold uppercase tracking-wider text-amber-400">Email</dt><dd className="mt-0.5 text-amber-300">Confirmation email could not be sent</dd></div>}
                                                                                    </dl>
                                                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                                                          {a.status === "confirmed" && (
                                                                                                <>
                                                                                                      <button onClick={() => setStatus(a._id, "completed")} className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500">Mark as done</button>
                                                                                                      <button onClick={async () => { if (await confirmDialog({ title: "Cancel this appointment?", message: `${a.name} will be emailed that it was cancelled, and the time is released.`, confirmText: "Cancel appointment", cancelText: "Keep it", tone: "danger" })) setStatus(a._id, "cancelled"); }} className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500">Cancel appointment</button>
                                                                                                </>
                                                                                          )}
                                                                                          <button onClick={() => remove(a._id)} className="rounded-md bg-red-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500">Delete</button>
                                                                                    </div>
                                                                              </td>
                                                                        </tr>
                                                                  )}
                                                            </Fragment>
                                                      );
                                                })}
                                          </tbody>
                                    </table>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-700 bg-gray-900/40 px-4 py-3 text-xs text-gray-400">
                                    <p>Showing {(cur - 1) * pageSize + 1}–{Math.min(cur * pageSize, shown.length)} of {shown.length}</p>
                                    <div className="flex items-center gap-3">
                                          <label className="flex items-center gap-2">Rows
                                                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white">
                                                      {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                                </select>
                                          </label>
                                          <div className="flex items-center gap-1.5">
                                                <button disabled={cur <= 1} onClick={() => setPage(cur - 1)} className={btn + " disabled:opacity-40"} aria-label="Previous page">‹</button>
                                                <span className="px-1">{cur} / {pages}</span>
                                                <button disabled={cur >= pages} onClick={() => setPage(cur + 1)} className={btn + " disabled:opacity-40"} aria-label="Next page">›</button>
                                          </div>
                                    </div>
                              </div>
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
