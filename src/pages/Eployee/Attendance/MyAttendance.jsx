import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarOff, Clock3, Download, Hourglass, LogIn, LogOut, Timer, UserCheck, UserX } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from './api';
import Badge from './Badge';
import { fmtDay, fmtHours, fmtTime, localMonth } from './format';
import CalendarStrip from './CalendarStrip';
import MyLeave from './MyLeave';
import MyPerformance from './MyPerformance';
import { Empty, PageHeader, Row, Stat, Table, Td, btnGhost, btnPrimary, input, toastError } from '../Invoice/ui';

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

function TodayCard() {
      const qc = useQueryClient();
      const { data, isPending, error } = useQuery({ queryKey: ['att-today'], queryFn: () => api('/today') });
      const refresh = () => {
            qc.invalidateQueries({ queryKey: ['att-today'] });
            qc.invalidateQueries({ queryKey: ['att-my'] });
      };
      const punch = useMutation({
            mutationFn: (kind) => api(`/${kind}`, { method: 'POST' }),
            onSuccess: (_d, kind) => {
                  refresh();
                  Swal.fire({ icon: 'success', title: kind === 'check-in' ? 'Checked in' : 'Checked out', timer: 1400, showConfirmButton: false });
            },
            onError: (e) => { toastError(e); refresh(); },
      });

      const rec = data?.record;
      return (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6 sm:p-8">
                  <div className="relative flex flex-wrap items-center justify-between gap-8">
                  <Clock />
                  <div className="min-w-[14rem] text-sm text-gray-300">
                        {error ? <span className="text-red-400">{error.message}</span> : isPending ? 'Loading…' : (
                              <div className="space-y-1.5">
                                    <p className="flex items-center gap-2">First check in: <b className="text-white">{fmtTime(rec?.checkIn)}</b> {rec && <Badge status={rec.status} />}</p>
                                    {rec?.sessions?.map((x, i) => (
                                          <p key={i} className="text-xs text-gray-400">
                                                Session {i + 1}: {fmtTime(x.in)} → {x.out ? fmtTime(x.out) : <b className="text-emerald-400">in office</b>}
                                          </p>
                                    ))}
                                    {rec && <p>Worked today: <b className="text-white">{fmtHours(rec.workedMinutes)}</b>{rec.open ? ' (closed sessions)' : ''}</p>}
                              </div>
                        )}
                  </div>
                  <div className="flex w-full gap-3 sm:w-auto">
                        <button className={`${btnPrimary} flex-1 !px-6 !py-3 sm:flex-none`} disabled={isPending || Boolean(rec?.open) || punch.isPending} onClick={() => punch.mutate('check-in')}>
                              <LogIn size={18} /> {rec ? 'Check in again' : 'Check in'}
                        </button>
                        <button className={`${btnGhost} flex-1 !px-6 !py-3 sm:flex-none`} disabled={isPending || !rec?.open || punch.isPending} onClick={() => punch.mutate('check-out')}>
                              <LogOut size={18} /> Check out
                        </button>
                  </div>
                  </div>
            </div>
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

function Overview({ goLeave }) {
      const month = localMonth();
      const { data, isPending, error } = useQuery({ queryKey: ['att-my', month], queryFn: () => api(`/my?month=${month}`) });
      return (
            <div className="space-y-6">
                  <TodayCard />
                  <PendingLeaveBanner onOpen={goLeave} />
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : <MonthSummary data={data} />}
            </div>
      );
}

function Report() {
      const [month, setMonth] = useState(localMonth());
      const { data, isPending, error } = useQuery({ queryKey: ['att-my', month], queryFn: () => api(`/my?month=${month}`) });
      const exportCsv = () => {
            const lines = [['Date', 'Status', 'Check in', 'Check out', 'Worked'], ...data.days.map((d) => [d.date, d.status, fmtTime(d.checkIn), d.open ? 'in office' : fmtTime(d.checkOut), fmtHours(d.workedMinutes)])];
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
                              <Table head={['Date', 'Status', 'Check in', 'Check out', 'Worked']}>
                                    {data.days.map((d) => (
                                          <Row key={d.date}>
                                                <Td className="font-medium">{fmtDay(d.date)}</Td>
                                                <Td><Badge status={d.status} /></Td>
                                                <Td>{fmtTime(d.checkIn)}</Td>
                                                <Td>{d.open ? <span className="text-emerald-400">in office</span> : fmtTime(d.checkOut)}</Td>
                                                <Td>{fmtHours(d.workedMinutes)}</Td>
                                          </Row>
                                    ))}
                              </Table>
                        </>
                  )}
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
                  {tab === 'overview' && <Overview goLeave={() => setTab('leave')} />}
                  {tab === 'performance' && <MyPerformance />}
                  {tab === 'report' && <Report />}
                  {tab === 'leave' && <MyLeave />}
            </main>
      );
}
