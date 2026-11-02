import { useEffect, useState } from 'react';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarOff, CheckCircle2, ChevronDown, Clock3, Download, FileText, History, Hourglass, LogIn, LogOut, OctagonAlert, RefreshCw, Send, Timer, UserCheck, UserX } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from './api';
import Badge from './Badge';
import { fmtDay, fmtHours, fmtTime, localDate, localMonth } from './format';
import { lastMonths } from './performance';
import CalendarStrip from './CalendarStrip';
import MyLeave from './MyLeave';
import MyPerformance from './MyPerformance';
import ReportView from './ReportView';
import { Empty, Modal, PageHeader, Row, Stat, Table, Td, btnDanger, btnGhost, btnPrimary, input, toastError } from '../Invoice/ui';

function Clock() {
      const [now, setNow] = useState(new Date());
      useEffect(() => {
            const t = setInterval(() => setNow(new Date()), 1000);
            return () => clearInterval(t);
      }, []);
      return (
            <div>
                  <p className="text-5xl font-bold tabular-nums tracking-tight text-white sm:text-6xl">
                        {now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                        {now.toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} · Bangladesh time
                  </p>
            </div>
      );
}

const MIN_REPORT = 10;
const DAY_TARGET_MIN = 8 * 60;

const REPORT_FIELDS = [
      { key: 'done', icon: CheckCircle2, tone: 'text-emerald-300', label: 'Finished today', hint: 'Required', placeholder: 'e.g. Built the leave approval screen\nFixed the location bug on the visit form', rows: 4 },
      { key: 'progress', icon: RefreshCw, tone: 'text-sky-300', label: 'Still in progress', hint: 'Optional', placeholder: 'e.g. Discord report, about 70% done', rows: 2 },
      { key: 'blockers', icon: OctagonAlert, tone: 'text-amber-300', label: 'Blockers or help needed', hint: 'Optional', placeholder: 'Leave empty if nothing is blocking you', rows: 2 },
];

// Ending the day: a short three-part report. The server enforces the required part too.
function CheckoutModal({ rec, busy, onSubmit, onClose }) {
      // Always starts empty: each end of day is a fresh report.
      const [f, setF] = useState({ done: '', progress: '', blockers: '' });
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const left = MIN_REPORT - f.done.trim().length;
      const [now] = useState(() => Date.now());
      const live = rec?.open && rec?.sessions?.length ? Math.round((now - new Date(rec.sessions[rec.sessions.length - 1].in).getTime()) / 60000) : 0;
      const worked = (rec?.workedMinutes || 0) + Math.max(live, 0);
      return (
            <Modal title="End your day" onClose={onClose}>
                  <form onSubmit={(e) => { e.preventDefault(); onSubmit({ done: f.done.trim(), progress: f.progress.trim(), blockers: f.blockers.trim() }); }} className="space-y-5">
                        <div className="grid grid-cols-3 gap-3 rounded-xl border border-white/10 p-3 text-center text-sm">
                              <div><p className="text-xs text-gray-500">In</p><p className="font-semibold">{fmtTime(rec?.checkIn)}</p></div>
                              <div><p className="text-xs text-gray-500">Out</p><p className="font-semibold">{fmtTime(new Date(now).toISOString())}</p></div>
                              <div><p className="text-xs text-gray-500">Worked</p><p className="font-semibold">{fmtHours(worked) === '-' ? '0h 00m' : fmtHours(worked)}</p></div>
                        </div>
                        {REPORT_FIELDS.map(({ key, icon: Icon, tone, label, hint, placeholder, rows }) => (
                              <label key={key} className="block">
                                    <span className="mb-1.5 flex items-center justify-between">
                                          <span className={`flex items-center gap-2 text-sm font-semibold ${tone}`}><Icon size={15} />{label}</span>
                                          <span className="text-xs text-gray-500">{hint}</span>
                                    </span>
                                    <textarea autoFocus={key === 'done'} required={key === 'done'} rows={rows} maxLength={1500} className={input} value={f[key]} onChange={set(key)} placeholder={placeholder} />
                              </label>
                        ))}
                        <p className="flex items-start gap-2 text-xs text-gray-500"><Send size={13} className="mt-0.5 shrink-0" />Your name, times and this report are posted to the team's Discord channel.</p>
                        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                              <span className={`text-xs ${left > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>{left > 0 ? `${left} more character${left === 1 ? '' : 's'} needed in “Finished today”` : 'Ready to send'}</span>
                              <div className="flex gap-3">
                                    <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                                    <button className={btnPrimary} disabled={busy || left > 0}><LogOut size={16} /> {busy ? 'Ending day…' : 'Submit and end day'}</button>
                              </div>
                        </div>
                  </form>
            </Modal>
      );
}

const STATE = {
      idle: { label: 'Not checked in', dot: 'bg-gray-500', tone: 'text-gray-300' },
      in: { label: 'In office', dot: 'bg-emerald-500', tone: 'text-emerald-300' },
      out: { label: 'Stepped out', dot: 'bg-amber-500', tone: 'text-amber-300' },
      ended: { label: 'Day ended', dot: 'bg-sky-500', tone: 'text-sky-300' },
};

const dur = (m) => (m === null ? '' : m < 1 ? '<1m' : m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`);
const sessionMins = (x) => (x.out ? Math.round((new Date(x.out) - new Date(x.in)) / 60000) : null);

// Sessions of the day. Long lists collapse to the latest few.
function SessionList({ sessions }) {
      const [all, setAll] = useState(false);
      if (!sessions?.length) return <p className="text-sm text-gray-500">No check-ins yet today.</p>;
      const LIMIT = 4;
      const list = all ? sessions : sessions.slice(-LIMIT);
      const offset = sessions.length - list.length;
      return (
            <div>
                  <ol className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {list.map((x, i) => (
                              <li key={offset + i} className="flex items-center gap-3 text-sm">
                                    <span className="w-5 shrink-0 text-xs tabular-nums text-gray-600">{offset + i + 1}</span>
                                    <span className={`h-2 w-2 shrink-0 rounded-full ${x.out ? 'bg-gray-600' : 'animate-pulse bg-emerald-500'}`} />
                                    <span className="tabular-nums text-gray-200">{fmtTime(x.in)}</span>
                                    <span className="text-gray-600">→</span>
                                    <span className="tabular-nums">{x.out ? fmtTime(x.out) : <b className="text-emerald-400">now</b>}</span>
                                    <span className="ml-auto text-xs text-gray-500">{dur(sessionMins(x))}</span>
                              </li>
                        ))}
                  </ol>
                  {sessions.length > LIMIT && (
                        <button onClick={() => setAll((v) => !v)} className="mt-3 text-xs font-medium text-blue-300 hover:underline">{all ? 'Show fewer' : `Show all ${sessions.length} sessions`}</button>
                  )}
            </div>
      );
}

const MiniStat = ({ label, value }) => (
      <div className="rounded-xl border border-white/10 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
      </div>
);

function TodayCard() {
      const qc = useQueryClient();
      const { data, isPending, error } = useQuery({ queryKey: ['att-today'], queryFn: () => api('/today') });
      const refresh = () => {
            qc.invalidateQueries({ queryKey: ['att-today'] });
            qc.invalidateQueries({ queryKey: ['att-my'] });
      };
      const [checkingOut, setCheckingOut] = useState(false);
      const punch = useMutation({
            mutationFn: ({ kind, body }) => api(`/${kind}`, { method: 'POST', body }),
            onSuccess: (_d, { kind, body }) => {
                  refresh();
                  setCheckingOut(false);
                  Swal.fire({ icon: 'success', title: kind === 'check-in' ? 'Checked in' : body?.endDay ? 'Day ended. Report sent.' : 'Checked out', timer: 1600, showConfirmButton: false });
            },
            onError: (e) => { toastError(e); refresh(); },
      });

      const rec = data?.record;
      const state = !rec ? 'idle' : rec.open ? 'in' : rec.dayClosedAt ? 'ended' : 'out';
      const st = STATE[state];
      const busy = isPending || punch.isPending;
      const worked = rec?.workedMinutes || 0;
      const pct = Math.min(100, Math.round((worked / DAY_TARGET_MIN) * 100));
      const lastOut = rec?.sessions?.length ? rec.sessions[rec.sessions.length - 1].out : null;

      return (
            <section className="space-y-4">
                  <div className="grid gap-4 xl:grid-cols-5">
                        <div className="rounded-2xl border border-white/10 p-6 xl:col-span-3">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                    <Clock />
                                    <p className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm font-semibold ${st.tone}`}>
                                          <span className={`h-2 w-2 rounded-full ${st.dot} ${state === 'in' ? 'animate-pulse' : ''}`} /> {st.label}
                                          {rec && <Badge status={rec.status} />}
                                    </p>
                              </div>

                              <div className="mt-6 border-t border-white/10 pt-5">
                                    {state === 'in' ? (
                                          <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                      <button className={`${btnGhost} w-full !py-3`} disabled={busy} onClick={() => punch.mutate({ kind: 'check-out' })}><LogOut size={18} /> Check out</button>
                                                      <p className="mt-1.5 px-1 text-xs text-gray-500">Break, lunch or stepping out. No report needed.</p>
                                                </div>
                                                <div>
                                                      <button className={`${btnDanger} w-full !py-3`} disabled={busy} onClick={() => setCheckingOut(true)}><FileText size={18} /> End day</button>
                                                      <p className="mt-1.5 px-1 text-xs text-gray-500">Closing the office. You write a short report.</p>
                                                </div>
                                          </div>
                                    ) : (
                                          <div className="grid gap-3 sm:grid-cols-2">
                                                <div>
                                                      <button className={`${btnPrimary} w-full !py-3`} disabled={busy} onClick={() => punch.mutate({ kind: 'check-in' })}><LogIn size={18} /> {state === 'idle' ? 'Check in' : 'Check in again'}</button>
                                                      <p className="mt-1.5 px-1 text-xs text-gray-500">{state === 'idle' ? 'Start your day.' : 'Back at work.'}</p>
                                                </div>
                                                {state === 'out' && (
                                                      <div>
                                                            <button className={`${btnDanger} w-full !py-3`} disabled={busy} onClick={() => setCheckingOut(true)}><FileText size={18} /> End day</button>
                                                            <p className="mt-1.5 px-1 text-xs text-gray-500">Done for today? Send your report without checking in again.</p>
                                                      </div>
                                                )}
                                                {state === 'ended' && <p className="self-center px-1 text-sm text-gray-400">Your day is closed. Check in again if you go back to work.</p>}
                                          </div>
                                    )}
                              </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 p-6 xl:col-span-2">
                              <div className="mb-4 flex items-baseline justify-between">
                                    <h3 className="font-semibold">Today</h3>
                                    <span className="text-xs text-gray-500">{pct}% of 8h</span>
                              </div>
                              {error ? <p className="text-red-400">{error.message}</p> : (
                                    <>
                                          <div className="grid grid-cols-2 gap-3">
                                                <MiniStat label="First in" value={isPending ? '…' : fmtTime(rec?.checkIn)} />
                                                <MiniStat label="Last out" value={isPending ? '…' : rec?.open ? 'in office' : fmtTime(lastOut)} />
                                                <MiniStat label="Worked" value={dur(worked)} />
                                                <MiniStat label="Sessions" value={rec?.sessions?.length || 0} />
                                          </div>
                                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} /></div>
                                          {rec?.open && <p className="mt-2 text-xs text-gray-500">The open session is added when you check out.</p>}
                                    </>
                              )}
                        </div>
                  </div>

                  {rec?.sessions?.length > 0 && (
                        <div className="rounded-2xl border border-white/10 p-6">
                              <h3 className="mb-4 font-semibold">Sessions <span className="text-gray-500">({rec.sessions.length})</span></h3>
                              <SessionList sessions={rec.sessions} />
                        </div>
                  )}

                  {rec?.report && (
                        <div className="rounded-2xl border border-white/10 p-6">
                              <div className="mb-3 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 font-semibold"><FileText size={16} className="text-gray-400" /> Today's report</h3>
                                    {rec.reportAt && <span className="text-xs text-gray-500">Sent {fmtTime(rec.reportAt)}</span>}
                              </div>
                              <ReportView parts={rec.reportParts} report={rec.report} />
                        </div>
                  )}
                  {checkingOut && <CheckoutModal rec={rec} busy={punch.isPending} onSubmit={(parts) => punch.mutate({ kind: 'check-out', body: { ...parts, endDay: true } })} onClose={() => setCheckingOut(false)} />}
            </section>
      );
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// Stat cards + colored calendar for one month.
function MonthSummary({ data }) {
      const s = data.summary;
      return (
            <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <Stat icon={UserCheck} label="Present" value={s.present} tone="text-emerald-400" />
                        <Stat icon={Clock3} label="Late" value={s.late} tone="text-amber-400" />
                        <Stat icon={CalendarOff} label="Leave" value={s.leave} tone="text-sky-400" />
                        <Stat icon={UserX} label="Absent" value={s.absent} tone="text-red-400" />
                        <Stat icon={Timer} label="Hours worked" value={fmtHours(s.workedMinutes)} hint={`${s.workingDays} working days so far`} />
                  </div>
                  <CalendarStrip days={data.days} />
            </div>
      );
}

function PendingLeaveBanner({ onOpen }) {
      const { data: leaves = [] } = useQuery({ queryKey: ['att-my-leaves'], queryFn: () => api('/my-leaves') });
      const pending = leaves.filter((l) => l.status === 'pending').length;
      if (!pending) return null;
      return (
            <button onClick={onOpen} className="flex w-full items-center gap-3 rounded-2xl border border-amber-500/30 px-5 py-3 text-left text-sm text-amber-300 transition hover:bg-amber-500/10">
                  <Hourglass size={16} />
                  <span><b>{pending}</b> leave request{pending === 1 ? ' is' : 's are'} waiting for approval. Those days count as absent until approved.</span>
            </button>
      );
}

// The latest earlier days that have a report, newest first. The first one opens by default.
function PreviousReports({ onSeeAll }) {
      const months = lastMonths(2);
      const results = useQueries({ queries: months.map((m) => ({ queryKey: ['att-my', m], queryFn: () => api(`/my?month=${m}`) })) });
      const today = localDate();
      const days = results.flatMap((r) => r.data?.days || []).filter((d) => d.report && d.date < today).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
      if (results.every((r) => r.isPending)) return null;
      return (
            <div className="rounded-2xl border border-white/10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold"><History size={16} className="text-gray-400" /> Previous reports</h3>
                        <button onClick={onSeeAll} className="text-xs font-medium text-blue-300 hover:underline">See all</button>
                  </div>
                  {days.length === 0 ? <p className="text-sm text-gray-500">No earlier reports yet. They appear here after you end a day.</p> : (
                        <div className="divide-y divide-white/10">
                              {days.map((d, i) => (
                                    <details key={d.date} open={i === 0} className="group py-3 first:pt-0 last:pb-0">
                                          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm">
                                                <span className="font-medium">{fmtDay(d.date)}{i === 0 && <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-[11px] font-semibold text-blue-300">Latest</span>}</span>
                                                <span className="flex items-center gap-3 text-xs text-gray-500">
                                                      {d.reportParts?.blockers && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-300">blocker</span>}
                                                      {fmtHours(d.workedMinutes) !== '-' && <span>{fmtHours(d.workedMinutes)}</span>}
                                                      <ChevronDown size={14} className="transition group-open:rotate-180" />
                                                </span>
                                          </summary>
                                          <div className="mt-3"><ReportView parts={d.reportParts} report={d.report} /></div>
                                    </details>
                              ))}
                        </div>
                  )}
            </div>
      );
}

function Overview({ goLeave, goReport }) {
      const month = localMonth();
      const { data, isPending, error } = useQuery({ queryKey: ['att-my', month], queryFn: () => api(`/my?month=${month}`) });
      return (
            <div className="space-y-6">
                  <TodayCard />
                  <PendingLeaveBanner onOpen={goLeave} />
                  <PreviousReports onSeeAll={goReport} />
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : <MonthSummary data={data} />}
            </div>
      );
}

function Report() {
      const [month, setMonth] = useState(localMonth());
      const [viewing, setViewing] = useState(null);
      const { data, isPending, error } = useQuery({ queryKey: ['att-my', month], queryFn: () => api(`/my?month=${month}`) });
      const exportCsv = () => {
            const lines = [['Date', 'Status', 'Check in', 'Check out', 'Worked', 'Daily report'], ...data.days.map((d) => [d.date, d.status, fmtTime(d.checkIn), d.open ? 'in office' : fmtTime(d.checkOut), fmtHours(d.workedMinutes), d.report])];
            const url = URL.createObjectURL(new Blob([lines.map((l) => l.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
            Object.assign(document.createElement('a'), { href: url, download: `my-attendance-${month}.csv` }).click();
            URL.revokeObjectURL(url);
      };
      return (
            <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                        <input type="month" className={`${input} !w-auto`} value={month} max={localMonth()} onChange={(e) => e.target.value && setMonth(e.target.value)} />
                        <button className={btnGhost} disabled={!data?.days} onClick={exportCsv}><Download size={16} /> Export CSV</button>
                  </div>
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : (
                        <>
                              <MonthSummary data={data} />
                              <Table head={['Date', 'Status', 'Check in', 'Check out', 'Worked', 'Daily report']}>
                                    {data.days.map((d) => (
                                          <Row key={d.date}>
                                                <Td className="font-medium">{fmtDay(d.date)}</Td>
                                                <Td><Badge status={d.status} /></Td>
                                                <Td>{fmtTime(d.checkIn)}</Td>
                                                <Td>{d.open ? <span className="text-emerald-400">in office</span> : fmtTime(d.checkOut)}</Td>
                                                <Td>{fmtHours(d.workedMinutes)}</Td>
                                                <Td>{d.report ? <button className="text-sm font-medium text-blue-300 hover:underline" onClick={() => setViewing(d)}>View report</button> : <span className="text-gray-500">-</span>}</Td>
                                          </Row>
                                    ))}
                              </Table>
                        </>
                  )}
                  {viewing && <Modal title={`Report · ${fmtDay(viewing.date)}`} onClose={() => setViewing(null)}><ReportView parts={viewing.reportParts} report={viewing.report} /></Modal>}
            </div>
      );
}

const TABS = [['overview', 'Overview'], ['performance', 'Performance'], ['report', 'Report'], ['leave', 'Leave']];

// Any signed-in employee.
export default function MyAttendance() {
      const [tab, setTab] = useState('overview');
      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader title="Attendance" subtitle="Check in, track your performance and request leave." />
                  <nav className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 p-1" role="tablist">
                        {TABS.map(([id, label]) => (
                              <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === id ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>{label}</button>
                        ))}
                  </nav>
                  {tab === 'overview' && <Overview goLeave={() => setTab('leave')} goReport={() => setTab('report')} />}
                  {tab === 'performance' && <MyPerformance />}
                  {tab === 'report' && <Report />}
                  {tab === 'leave' && <MyLeave />}
            </main>
      );
}
