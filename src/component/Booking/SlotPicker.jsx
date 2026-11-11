import { useEffect, useMemo, useState } from "react";
import { base_url } from "../../layout/Title";

const pad = n => String(n).padStart(2, "0");
const toKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MAX_DAYS = 60;
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Calendar + available times for one appointment type. Used for new bookings and for rescheduling.
// excludeId: a booking being moved, so its current time counts as free.
const SlotPicker = ({ typeId, excludeId, tz, h12, setH12, onDateChange, onSelect }) => {
      const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
      const lastDay = useMemo(() => new Date(today.getTime() + MAX_DAYS * 86400000), [today]);
      const [view, setView] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
      const [date, setDate] = useState("");
      const offset = useMemo(() => {
            try { return new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date()).find(p => p.type === "timeZoneName")?.value || ""; } catch { return ""; }
      }, [tz]);
      const [result, setResult] = useState({ key: "", slots: [] });
      const [holidays, setHolidays] = useState({});
      const [weekend, setWeekend] = useState([6]);

      // All times are shown in the visitor's own timezone (detected from the browser).
      const fmtTime = ms => new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: h12 });

      useEffect(() => {
            fetch(`${base_url}/appointment/holidays`)
                  .then(r => r.json())
                  .then(r => {
                        const map = {};
                        (r.data || []).forEach(h => { map[h.date] = map[h.date] ? `${map[h.date]}, ${h.name}` : h.name; });
                        setHolidays(map);
                        if (Array.isArray(r.weekend_days)) setWeekend(r.weekend_days);
                  })
                  .catch(() => {});
      }, []);

      // The picked day is a LOCAL day, but slots are defined per Dhaka day (UTC+6). A local day can span two Dhaka days,
      // so fetch both and keep only the slots that fall inside the picked local day.
      const dhakaDate = ms => new Date(ms + 6 * 3600 * 1000).toISOString().slice(0, 10);
      const dayRange = key => {
            const [y, m, d] = key.split("-").map(Number);
            return [new Date(y, m - 1, d).getTime(), new Date(y, m - 1, d + 1).getTime()];
      };
      const fetchKey = date && typeId ? `${date}|${typeId}|${excludeId || ""}` : "";
      useEffect(() => {
            if (!fetchKey) return;
            let stale = false;
            const [from, to] = dayRange(date);
            const dates = [...new Set([dhakaDate(from), dhakaDate(to - 1)])];
            Promise.all(dates.map(dd =>
                  fetch(`${base_url}/appointment/slots?date=${dd}&type=${typeId}${excludeId ? `&exclude=${excludeId}` : ""}`)
                        .then(r => r.json())
                        .then(r => (r.data || []).map(t => ({ dhakaDate: dd, time: t, ms: new Date(`${dd}T${t}:00+06:00`).getTime() })))
            ))
                  .then(lists => {
                        if (stale) return;
                        const picked = lists.flat().filter(x => x.ms >= from && x.ms < to).sort((a, b) => a.ms - b.ms);
                        setResult({ key: fetchKey, slots: picked });
                  })
                  .catch(() => { if (!stale) setResult({ key: fetchKey, slots: [] }); });
            return () => { stale = true; };
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [fetchKey]);
      const loadingSlots = Boolean(fetchKey) && result.key !== fetchKey;
      const slots = result.key === fetchKey ? result.slots : [];

      const pickDate = key => { setDate(key); onDateChange && onDateChange(key); };

      const cells = useMemo(() => {
            const first = new Date(view.getFullYear(), view.getMonth(), 1);
            const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
            return [...Array(first.getDay()).fill(null), ...Array.from({ length: count }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
      }, [view]);

      const dhakaOpen = ms => {
            const dd = new Date(ms + 6 * 3600 * 1000);
            return !weekend.includes(dd.getUTCDay()) && !holidays[dd.toISOString().slice(0, 10)];
      };
      const available = d => {
            if (d < today || d > lastDay) return false;
            const [from, to] = [d.getTime(), new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()];
            return dhakaOpen(from) || dhakaOpen(to - 1);
      };
      const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
      const canNext = new Date(view.getFullYear(), view.getMonth() + 1, 1) <= lastDay;

      return (
                <div className="grid md:grid-cols-[1fr_250px]">
                      <div className="p-6 sm:p-9">
                            <div className="mb-6 flex items-center justify-between">
                                  <h2 className="text-2xl font-bold tracking-tight">{MONTHS[view.getMonth()]} <span className="font-normal text-[#8794A4]">{view.getFullYear()}</span></h2>
                                  <div className="flex gap-1.5">
                                        <button type="button" disabled={!canPrev} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="h-9 w-9 rounded-sm border border-[#E1E9F2] bg-white text-lg transition hover:border-[#0A65B4] hover:text-[#0A65B4] disabled:opacity-30" aria-label="Previous month">‹</button>
                                        <button type="button" disabled={!canNext} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="h-9 w-9 rounded-sm border border-[#E1E9F2] bg-white text-lg transition hover:border-[#0A65B4] hover:text-[#0A65B4] disabled:opacity-30" aria-label="Next month">›</button>
                                  </div>
                            </div>
                            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#8794A4]">
                                  {DOW.map(d => <div key={d} className="py-1">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                  {cells.map((d, i) => {
                                        if (!d) return <div key={`b${i}`} />;
                                        const key = toKey(d);
                                        const ok = available(d);
                                        const active = key === date;
                                        const isToday = key === toKey(today);
                                        return (
                                              <button
                                                    key={key}
                                                    type="button"
                                                    disabled={!ok}
                                                    aria-pressed={active}
                                                    aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) + (holidays[key] ? ` (closed: ${holidays[key]})` : "")}
                                                    title={holidays[key] || undefined}
                                                    onClick={() => pickDate(key)}
                                                    className={`relative h-12 rounded-sm border text-sm font-semibold transition ${active ? "border-[#0A65B4] bg-[#0A65B4] text-white" : ok ? "border-[#E1E9F2] bg-white text-[#142235] hover:border-[#0A65B4] hover:bg-[#F1F8FF] hover:text-[#0A65B4]" : holidays[key] ? "cursor-not-allowed border-transparent bg-red-50 text-red-300" : "cursor-not-allowed border-transparent text-[#C3CCD8]"}`}
                                              >
                                                    {d.getDate()}
                                                    {isToday && <span aria-hidden="true" className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${active ? "bg-white" : "bg-[#0A65B4]"}`} />}
                                              </button>
                                        );
                                  })}
                            </div>
                            <p className="mt-5 text-xs text-[#8794A4]">Closed on weekends, public holidays and company events (shown in red). Times are shown in your local timezone: {tz}{offset ? ` (${offset})` : ""}, detected automatically.</p>
                      </div>

                      <div className="border-t border-[#E1E9F2] p-6 md:border-l md:border-t-0 md:p-7">
                            {date ? (
                                  <>
                                        <div className="mb-4 flex items-center justify-between">
                                              <p className="text-sm font-bold">{new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                                              <div className="flex overflow-hidden rounded-sm border border-[#E1E9F2] bg-white text-xs">
                                                    <button type="button" aria-pressed={h12} onClick={() => setH12(true)} className={`px-2.5 py-1 ${h12 ? "bg-[#0A65B4] font-semibold text-white" : "text-[#66758A]"}`}>12h</button>
                                                    <button type="button" aria-pressed={!h12} onClick={() => setH12(false)} className={`px-2.5 py-1 ${!h12 ? "bg-[#0A65B4] font-semibold text-white" : "text-[#66758A]"}`}>24h</button>
                                              </div>
                                        </div>
                                        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                                              {loadingSlots ? (
                                                    <p className="text-sm text-[#8794A4]">Loading…</p>
                                              ) : slots.length === 0 ? (
                                                    <p className="text-sm text-[#8794A4]">No times available. Pick another day.</p>
                                              ) : slots.map(sl => (
                                                    <button key={sl.ms} type="button" onClick={() => onSelect(sl.dhakaDate, sl.time)} className="flex w-full items-center justify-between rounded-sm border border-[#E1E9F2] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#0A65B4] hover:bg-[#0A65B4] hover:text-white">
                                                          {fmtTime(sl.ms)}
                                                          <span aria-hidden="true">→</span>
                                                    </button>
                                              ))}
                                        </div>
                                  </>
                            ) : (
                                  <div className="flex h-full min-h-[160px] items-center justify-center text-center text-sm text-[#8794A4]">Select a date to see available times.</div>
                            )}
                      </div>
                </div>
      );
};

export default SlotPicker;
