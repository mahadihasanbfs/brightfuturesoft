import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base_url } from "../../layout/Title";
import useSeo, { buildBookingJsonLd } from "./useSeo";
import SlotPicker from "./SlotPicker";
import OfficeMap from "./OfficeMap";
import MapPreview from "./MapPreview";
import MeetingPrep from "./MeetingPrep";

const pad = n => String(n).padStart(2, "0");

const STEPS = [
      ["01", "Pick a day", "Choose any open date. Closed days are shown in red."],
      ["02", "Choose a time", "Times are shown in your own timezone."],
      ["03", "Confirm details", "Tell us who you are and what to prepare."],
];

const MODES = [
      ["online", "Online meeting", "Google Meet link by email", "video"],
      ["phone", "Phone call", "We call you at the booked time", "phone"],
      ["client_site", "We visit you", "Our team comes to your place", "pin"],
];
const MODE_LABELS = { online: "Online meeting", phone: "Phone call", office: "At our office", client_site: "We visit your office" };

const ICONS = {
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
      phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
      pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
      chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
      screen: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
      map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14"/>',
      calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
      code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
      lifebuoy: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
      handshake: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2L15 11M7 15l1.5 1.5a1.4 1.4 0 0 0 2-2M3 9l4-4 4 1 3-1 4 4v5l-3 2"/>',
};

const Icon = ({ name, className = "h-4 w-4 shrink-0 text-[#0A65B4]" }) => (
      <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[name] || ICONS.chat }} />
);

const GRID_BG = {
      backgroundImage: "linear-gradient(rgb(10 44 77 / 2.2%) 1px, transparent 1px), linear-gradient(90deg, rgb(10 44 77 / 2.2%) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
};

const icsStamp = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const BookingPage = () => {
      const [params, setParams] = useSearchParams();

      const [types, setTypes] = useState([]);
      const [modeInfo, setModeInfo] = useState({});
      const [typesLoading, setTypesLoading] = useState(true);
      const [date, setDate] = useState("");
      const [time, setTime] = useState("");
      const [h12, setH12] = useState(true);
      const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", topic: "", mode: "online", visit_address: "", visit_map_url: "", agenda: "" });
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState("");
      const [done, setDone] = useState(null);
      const [mapCheck, setMapCheck] = useState({ state: "idle", url: null, reachable: false, lat: null, lng: null, place: null });

      const tz = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
      const type = types.find(t => t.id === params.get("type"));

      const seoTitle = type
            ? `Book a ${type.name} (${type.duration} min) | Bright Future Soft`
            : "Book an Appointment | Free Consultation, Demo & Workshops | Bright Future Soft";
      const seoDescription = type
            ? `${type.description} ${type.duration}-minute session. Choose a time online and get confirmed instantly.`
            : "Book a free consultation, live application demo, project discovery workshop, technical review or support session with the Bright Future Soft team. Pick a time online in under a minute.";
      const jsonLd = useMemo(() => buildBookingJsonLd(types, type), [types, type]);
      useSeo({ title: seoTitle, description: seoDescription, path: type ? `/book?type=${type.id}` : "/book", image: "/og/book.jpg", jsonLd });

      useEffect(() => {
            fetch(`${base_url}/appointment/types`)
                  .then(r => r.json())
                  .then(r => { setTypes(r.data || []); setModeInfo(r.modes || {}); })
                  .catch(() => {})
                  .finally(() => setTypesLoading(false));
      }, []);

      // Start at the top when the page opens, when the type changes, and when the booking is confirmed.
      // "instant" skips the site-wide smooth scrolling so it does not animate down the page.
      useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [params, done]);

      // Changing type invalidates the chosen time.
      useEffect(() => { setTime(""); setError(""); }, [params]);

      const chooseType = id => { setDate(""); setParams({ type: id }); };

      // As soon as a map link is pasted, the server checks it (allowed map sites only, must open) and reads where it points.
      const mapLink = form.visit_map_url.trim();
      useEffect(() => {
            if (form.mode !== "client_site" || !mapLink) return;
            let stale = false;
            const t = setTimeout(async () => {
                  setMapCheck(m => ({ ...m, state: "checking" }));
                  try {
                        const r = await fetch(`${base_url}/appointment/check-map?url=${encodeURIComponent(mapLink)}`).then(x => x.json());
                        if (stale) return;
                        const d = r.data || {};
                        setMapCheck(d.valid ? { state: "ok", url: d.url, reachable: d.reachable, lat: d.lat, lng: d.lng, place: d.place } : { state: "bad", url: null, reachable: false, lat: null, lng: null, place: null });
                  } catch {
                        if (!stale) setMapCheck({ state: "idle", url: null, reachable: false, lat: null, lng: null, place: null });
                  }
            }, 500);
            return () => { stale = true; clearTimeout(t); };
      }, [mapLink, form.mode]);

      const submit = async e => {
            e.preventDefault();
            setError("");
            setBusy(true);
            try {
                  const res = await fetch(`${base_url}/appointment/book`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...form, date, time, type: type.id, tz }),
                  });
                  const json = await res.json();
                  if (!res.ok || !json.success) {
                        setError(json.message || "Booking failed");
                        if (res.status === 409) {
                              setTime("");
                        }
                  } else {
                        setDone(json.data);
                  }
            } catch {
                  setError("Network error. Try again.");
            } finally {
                  setBusy(false);
            }
      };

      const calendarLinks = useMemo(() => {
            if (!done) return null;
            const start = new Date(done.start_time);
            const end = new Date(start.getTime() + done.duration_minutes * 60000);
            const title = `${done.type_name} with Bright Future Soft`;
            const details = `Booked via brightfuturesoft.com. Ref: ${done._id}`;
            const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${icsStamp(start)}/${icsStamp(end)}&details=${encodeURIComponent(details)}`;
            const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Bright Future Soft//Booking//EN", "BEGIN:VEVENT", `UID:${done._id}@brightfuturesoft.com`, `DTSTAMP:${icsStamp(new Date())}`, `DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(end)}`, `SUMMARY:${title}`, `DESCRIPTION:${details}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
            return { google, ics: `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}` };
      }, [done]);

      const selectedLabel = date && time
            ? new Date(`${date}T${time}:00+06:00`).toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: h12 })
            : "";
      const input = "w-full rounded-sm border border-[#E1E9F2] bg-white px-3.5 py-3 text-sm text-[#142235] placeholder-[#8794A4] focus:border-[#0A65B4] focus:outline-none focus:ring-2 focus:ring-[#0A65B4]/20";
      const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#66758A]";
      const stage = done ? 3 : time ? 2 : date ? 1 : 0;
      const shadow = "shadow-[0_24px_60px_-30px_rgba(10,101,180,0.25)]";

      return (
            <section className="bg-white px-4 py-12 text-[#142235] sm:px-6 lg:px-8 lg:py-20" style={GRID_BG}>
                  <div className="mx-auto max-w-7xl">
                        {/* Section intro */}
                        <div className="mb-10 grid items-end gap-6 lg:mb-14 lg:grid-cols-[1.4fr_1fr]">
                              <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0A65B4]">Book an appointment</p>
                                    <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-[#142235] sm:text-5xl lg:text-6xl">
                                          {type ? type.name : "What would you"}
                                          <span className="block text-[#0A65B4]">{type ? "with our team." : "like to book?"}</span>
                                    </h1>
                              </div>
                              <p className="max-w-md text-base leading-relaxed text-[#66758A] lg:justify-self-end">
                                    {type ? type.description : "Consultations, live application demos, project workshops, technical reviews and support sessions. Pick a type, then choose a time that suits you."}
                              </p>
                        </div>

                        {!type ? (
                              /* Type chooser */
                              typesLoading ? (
                                    <p className="text-sm text-[#8794A4]">Loading…</p>
                              ) : types.length === 0 ? (
                                    <p className="text-sm text-[#66758A]">Booking is unavailable right now. Please try again later or <Link to="/contact" className="font-semibold text-[#0A65B4]">contact us</Link>.</p>
                              ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                          {types.map((t, i) => (
                                                <button
                                                      key={t.id}
                                                      type="button"
                                                      onClick={() => chooseType(t.id)}
                                                      className={`group flex flex-col rounded-sm border border-[#E1E9F2] bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-[#0A65B4] hover:shadow-[0_18px_40px_-24px_rgba(10,101,180,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A65B4]`}
                                                >
                                                      <div className="mb-5 flex items-center justify-between">
                                                            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#F1F8FF] text-[#0A65B4]"><Icon name={t.icon} className="h-5 w-5" /></span>
                                                            <span className="text-sm font-semibold text-[#8794A4]">{pad(i + 1)}</span>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                            <h2 className="text-lg font-bold tracking-tight">{t.name}</h2>
                                                            {t.tag && <span className="rounded-sm bg-[#F1F8FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A65B4]">{t.tag}</span>}
                                                      </div>
                                                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#66758A]">{t.description}</p>
                                                      <div className="mt-5 flex items-center justify-between border-t border-[#E1E9F2] pt-4 text-sm">
                                                            <span className="flex items-center gap-2 font-medium text-[#142235]"><Icon name="clock" />{t.duration} min</span>
                                                            <span className="font-semibold text-[#0A65B4] transition group-hover:translate-x-0.5">Book now →</span>
                                                      </div>
                                                </button>
                                          ))}
                                    </div>
                              )
                        ) : (
                              <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
                                    {/* Main panel */}
                                    <div className={`rounded-sm border border-[#E1E9F2] bg-[#F7FAFF] ${shadow}`}>
                                          {done ? (
                                                <div className="flex min-h-[460px] flex-col items-center justify-center p-8 text-center sm:p-12">
                                                      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full text-2xl bg-[#F1F8FF] text-[#0A65B4]`} aria-hidden="true">✓</div>
                                                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0A65B4]">Confirmed</p>
                                                      <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Your appointment is booked</h2>
                                                      <dl className="mt-8 w-full max-w-md divide-y divide-[#E1E9F2] rounded-sm border border-[#E1E9F2] bg-white text-left text-sm">
                                                            <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">What</dt><dd className="font-medium">{done.type_name} · {done.duration_minutes} min</dd></div>
                                                            <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">When</dt><dd className="font-medium">{new Date(done.start_time).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short", hour12: h12 })} ({tz})</dd></div>
                                                            <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">How</dt><dd className="font-medium">{MODE_LABELS[done.mode] || MODE_LABELS.online}</dd></div>
                                                            {done.mode === "online" && <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">Link</dt><dd className="font-medium">{done.meet_link ? <a href={done.meet_link} target="_blank" rel="noopener noreferrer" className="break-all text-[#0A65B4]">{done.meet_link}</a> : "Meeting link will be emailed before the call"}</dd></div>}
                                                            <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">Who</dt><dd className="font-medium">{done.name}{done.company ? `, ${done.company}` : ""} · {done.email}</dd></div>
                                                            {done.agenda && <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">Agenda</dt><dd className="whitespace-pre-wrap font-medium">{done.agenda}</dd></div>}
                                                            <div className="flex gap-4 p-4"><dt className="w-20 shrink-0 text-[#8794A4]">Reference</dt><dd className="font-mono text-xs font-medium uppercase">{String(done._id).slice(-8)}</dd></div>
                                                      </dl>
                                                      {done.mode === "office" && <OfficeMap className="mt-6 w-full max-w-md text-left" />}
                                                      {(done.mode === "online" || done.mode === "phone") && done.prep && <MeetingPrep className="mt-6 w-full max-w-md" kind={done.mode} mode={done.prep.mode} prepare={done.prep.prepare} phone={done.phone} />}
                                                      {done.mode === "client_site" && (done.visit_lat != null ? <MapPreview className="mt-6 w-full max-w-md" lat={done.visit_lat} lng={done.visit_lng} name={done.visit_place || "Meeting location"} address={done.visit_address} mapUrl={done.visit_map_url} verified /> : <OfficeMap className="mt-6 w-full max-w-md text-left" place={{ name: "Meeting location", address: done.visit_address, map_url: done.visit_map_url, link_reachable: true, exact_pin: true }} />)}
                                                      {error && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{error}</p>}
                                                      {(
                                                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                                                  <a href={calendarLinks.google} target="_blank" rel="noopener noreferrer" className="rounded-sm border border-[#E1E9F2] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#0A65B4] hover:text-[#0A65B4]">Add to Google Calendar</a>
                                                                  <a href={calendarLinks.ics} download="appointment.ics" className="rounded-sm border border-[#E1E9F2] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#0A65B4] hover:text-[#0A65B4]">Download .ics</a>
                                                                  <Link to={`/book/manage/${done._id}?token=${done.cancel_token}`} className="rounded-sm border border-[#E1E9F2] bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#0A65B4] hover:text-[#0A65B4]">Reschedule or cancel</Link>
                                                            </div>
                                                      )}
                                                      <p className="mt-5 text-sm text-[#66758A]">{done.email_sent ? `A confirmation with the calendar invite was emailed to ${done.email}.` : "We could not send the confirmation email. Save the reference above and our team will contact you."}</p>
                                                      <Link to="/" className="mt-6 rounded-sm bg-[#0A65B4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#084F8D]">Back to home</Link>
                                                </div>
                                          ) : time ? (
                                                <form onSubmit={submit} className="p-6 sm:p-9">
                                                      <button type="button" onClick={() => setTime("")} className="mb-5 text-sm font-medium text-[#66758A] hover:text-[#0A65B4]">← Change time</button>
                                                      <h2 className="text-2xl font-bold tracking-tight">Almost done</h2>
                                                      <p className="mt-1 text-sm text-[#66758A]">Two quick steps to confirm your appointment.</p>

                                                      {/* chosen slot */}
                                                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#0A65B4]/30 bg-[#F1F8FF] px-4 py-3">
                                                            <div>
                                                                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A65B4]">{type.name} · {type.duration} min</p>
                                                                  <p className="text-sm font-semibold text-[#142235]">{selectedLabel}</p>
                                                            </div>
                                                            <button type="button" onClick={() => setTime("")} className="text-xs font-semibold text-[#0A65B4] underline-offset-2 hover:underline">Change</button>
                                                      </div>

                                                      {/* 1. About you */}
                                                      <fieldset className="mt-8">
                                                            <legend className="mb-4 flex items-center gap-3 text-base font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A65B4] text-xs text-white">1</span>About you</legend>
                                                            <div className="grid gap-4 sm:grid-cols-2">
                                                                  <div>
                                                                        <label htmlFor="bk-name" className={label}>Full name *</label>
                                                                        <input id="bk-name" className={input} required autoComplete="name" maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                                                  </div>
                                                                  <div>
                                                                        <label htmlFor="bk-email" className={label}>Email *</label>
                                                                        <input id="bk-email" className={input} type="email" required autoComplete="email" maxLength={150} placeholder="We send the confirmation here" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                                                  </div>
                                                                  <div>
                                                                        <label htmlFor="bk-company" className={label}>Company</label>
                                                                        <input id="bk-company" className={input} autoComplete="organization" maxLength={120} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                                                                  </div>
                                                                  {form.mode !== "phone" && (
                                                                        <div>
                                                                              <label htmlFor="bk-phone" className={label}>Phone / WhatsApp</label>
                                                                              <input id="bk-phone" className={input} type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </fieldset>

                                                      {/* 2. How to meet */}
                                                      <fieldset className="mt-8">
                                                            <legend className="mb-4 flex items-center gap-3 text-base font-bold"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A65B4] text-xs text-white">2</span>How should we meet?</legend>
                                                            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Meeting type">
                                                                  {MODES.map(([v, title, desc, icon]) => {
                                                                        const on = form.mode === v;
                                                                        return (
                                                                              <label key={v} className={`relative flex cursor-pointer flex-col gap-2 rounded-sm border p-4 transition focus-within:ring-2 focus-within:ring-[#0A65B4]/30 ${on ? "border-[#0A65B4] bg-[#F1F8FF]" : "border-[#E1E9F2] bg-white hover:border-[#0A65B4]/50"}`}>
                                                                                    <input type="radio" name="mode" value={v} checked={on} onChange={() => setForm({ ...form, mode: v })} className="sr-only" />
                                                                                    <span className="flex items-center justify-between">
                                                                                          <span className={`flex h-9 w-9 items-center justify-center rounded-sm ${on ? "bg-[#0A65B4] text-white" : "bg-[#F1F8FF] text-[#0A65B4]"}`}><Icon name={icon} className="h-5 w-5" /></span>
                                                                                          <span className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${on ? "border-[#0A65B4] bg-[#0A65B4] text-white" : "border-[#C3CCD8] text-transparent"}`} aria-hidden="true">✓</span>
                                                                                    </span>
                                                                                    <span className="text-sm font-bold text-[#142235]">{title}</span>
                                                                                    <span className="text-xs leading-snug text-[#66758A]">{desc}</span>
                                                                              </label>
                                                                        );
                                                                  })}
                                                            </div>

                                                            {/* what belongs to the chosen way of meeting */}
                                                            <div className="mt-4 space-y-4">
                                                                  {(form.mode === "online" || form.mode === "phone") && (
                                                                        <MeetingPrep kind={form.mode} mode={modeInfo[form.mode]} prepare={type.prepare} phone={form.phone} onPhone={v => setForm({ ...form, phone: v })} agenda={form.agenda} onAgenda={v => setForm({ ...form, agenda: v })} />
                                                                  )}
                                                                  {form.mode === "client_site" && (
                                                                        <div className="space-y-4 rounded-sm border border-[#E1E9F2] bg-white p-4">
                                                                              <p className="text-sm text-[#66758A]">Our team will come to you. Share the map link of the place so we can find it.</p>
                                                                              <div>
                                                                                    <label htmlFor="bk-map" className={label}>Map link *</label>
                                                                                    <input id="bk-map" className={input} required maxLength={500} placeholder="Paste a Google Maps share link" value={form.visit_map_url} onChange={e => { setForm({ ...form, visit_map_url: e.target.value }); setMapCheck({ state: e.target.value.trim() ? "checking" : "idle", url: null, reachable: false, lat: null, lng: null, place: null }); }} />
                                                                                    <p role="status" className={`mt-1.5 text-xs ${mapCheck.state === "bad" ? "font-medium text-red-600" : "text-[#66758A]"}`}>
                                                                                          {mapCheck.state === "idle" && !mapLink && "In Google Maps: Share, then Copy link, then paste it here."}
                                                                                          {mapLink && mapCheck.state === "checking" && "Checking link…"}
                                                                                          {mapLink && mapCheck.state === "ok" && (mapCheck.reachable ? "✓ Valid map link" : "Valid map link (could not open it to double-check)")}
                                                                                          {mapLink && mapCheck.state === "bad" && "This is not a valid map link. Use a Google Maps, Apple Maps or OpenStreetMap https link."}
                                                                                    </p>
                                                                              </div>
                                                                              {mapCheck.state === "ok" && (mapCheck.lat != null
                                                                                    ? <MapPreview lat={mapCheck.lat} lng={mapCheck.lng} name={mapCheck.place || "Meeting location"} address={form.visit_address.trim()} mapUrl={mapCheck.url} verified={mapCheck.reachable} />
                                                                                    : <OfficeMap place={{ name: mapCheck.place || "Meeting location", address: form.visit_address.trim() || "Open the link to see the exact spot", map_url: mapCheck.url, link_reachable: mapCheck.reachable, exact_pin: true }} />)}
                                                                              <div>
                                                                                    <label htmlFor="bk-visit" className={label}>Address details (optional)</label>
                                                                                    <input id="bk-visit" className={input} maxLength={300} placeholder="Floor, room, landmark" value={form.visit_address} onChange={e => setForm({ ...form, visit_address: e.target.value })} />
                                                                              </div>
                                                                              <div>
                                                                                    <label htmlFor="bk-agenda" className={label}>Meeting agenda *</label>
                                                                                    <textarea id="bk-agenda" rows={3} required maxLength={1000} className={input} placeholder="What should we cover, and what will you prepare or show us?" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} />
                                                                              </div>
                                                                        </div>
                                                                  )}
                                                            </div>
                                                      </fieldset>

                                                      {error && <p role="alert" className="mt-6 rounded-sm border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">{error}</p>}

                                                      {/* confirm bar */}
                                                      <div className="sticky bottom-0 -mx-6 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E9F2] bg-[#F7FAFF]/95 px-6 py-4 backdrop-blur sm:-mx-9 sm:px-9">
                                                            <p className="max-w-xs text-xs text-[#66758A]">We only use your details to arrange this appointment.</p>
                                                            <button type="submit" disabled={busy} className="rounded-sm bg-[#0A65B4] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#084F8D] disabled:opacity-50">{busy ? "Scheduling…" : "Confirm booking"}</button>
                                                      </div>
                                                </form>
                                          ) : (
                                                <SlotPicker
                                                      typeId={type.id}
                                                      tz={tz}
                                                      h12={h12}
                                                      setH12={setH12}
                                                      onDateChange={setDate}
                                                      onSelect={(d, t) => { setDate(d); setTime(t); }}
                                                />
                                          )}
                                    </div>

                                    {/* Side column */}
                                    <div className="space-y-3">
                                          <div className="rounded-sm border border-[#E1E9F2] bg-white p-6 shadow-[0_12px_30px_-20px_rgba(10,101,180,0.2)]">
                                                <div className="flex items-start justify-between gap-3">
                                                      <div>
                                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0A65B4]">Appointment type</p>
                                                            <h3 className="mt-2 text-xl font-bold tracking-tight">{type.name}</h3>
                                                      </div>
                                                      {!done && <button type="button" onClick={() => { setDate(""); setParams({}); }} className="shrink-0 text-xs font-semibold text-[#66758A] hover:text-[#0A65B4]">Change</button>}
                                                </div>
                                                <ul className="mt-4 space-y-3 text-sm text-[#142235]">
                                                      <li className="flex items-center gap-2.5"><Icon name="clock" />{type.duration} minutes</li>
                                                      <li className="flex items-start gap-2.5"><Icon name="video" /><span>Online, phone or in person. You choose at the last step.</span></li>
                                                      <li className="flex items-center gap-2.5"><Icon name="globe" />{tz} (your local time, auto-detected)</li>
                                                </ul>
                                                {selectedLabel && !done && (
                                                      <p className="mt-4 rounded-sm border border-[#0A65B4]/30 bg-[#F1F8FF] p-3 text-sm font-semibold text-[#0A65B4]">{selectedLabel}</p>
                                                )}
                                          </div>
                                          {STEPS.map(([n, t, d], i) => {
                                                const active = stage === i || (stage === 3 && i === 2);
                                                return (
                                                      <div key={n} className={`flex gap-5 rounded-sm border p-5 transition ${active ? "border-[#0A65B4] bg-[#F1F8FF]" : "border-[#E1E9F2] bg-white"}`}>
                                                            <span className={`pt-0.5 text-sm font-semibold ${active ? "text-[#0A65B4]" : "text-[#8794A4]"}`}>{n}</span>
                                                            <div>
                                                                  <p className={`font-bold ${active ? "text-[#0A65B4]" : "text-[#142235]"}`}>{t}</p>
                                                                  <p className="mt-1 text-sm leading-relaxed text-[#66758A]">{d}</p>
                                                            </div>
                                                      </div>
                                                );
                                          })}
                                    </div>
                              </div>
                        )}
                  </div>
            </section>
      );
};

export default BookingPage;
