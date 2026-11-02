import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, FileCheck2, FileX2, Search } from 'lucide-react';
import { api } from './api';
import Badge from './Badge';
import ReportView from './ReportView';
import { fmtHours, fmtTime, localDate } from './format';
import { Empty, Stat, card, input } from '../Invoice/ui';

const Avatar = ({ name, image }) => image
      ? <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
      : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/30 font-semibold text-blue-200">{(name || '?').charAt(0).toUpperCase()}</span>;

const FILTERS = [['all', 'All'], ['submitted', 'Submitted'], ['missing', 'No report yet'], ['blockers', 'Has blockers']];

// Who wrote which daily report, for one day.
export default function WorkReports() {
      const [date, setDate] = useState(localDate());
      const [q, setQ] = useState('');
      const [filter, setFilter] = useState('all');
      const { data, isPending, error } = useQuery({ queryKey: ['att-daily', date], queryFn: () => api(`/daily?date=${date}`) });

      const rows = useMemo(() => (data?.rows || []).map((r) => ({
            ...r,
            checkedIn: Boolean(r.sessions?.length),
            hasReport: Boolean(r.report),
            blockers: Boolean(r.reportParts?.blockers),
      })), [data]);

      const submitted = rows.filter((r) => r.hasReport);
      const missing = rows.filter((r) => r.checkedIn && !r.hasReport);
      const shown = rows.filter((r) => r.checkedIn || r.hasReport).filter((r) =>
            (filter === 'all' || (filter === 'submitted' && r.hasReport) || (filter === 'missing' && !r.hasReport) || (filter === 'blockers' && r.blockers)) &&
            (!q.trim() || `${r.name} ${r.designation || ''} ${r.report}`.toLowerCase().includes(q.trim().toLowerCase())));

      return (
            <section className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                        <input type="date" className={`${input} !w-auto`} value={date} max={localDate()} onChange={(e) => e.target.value && setDate(e.target.value)} />
                        <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
                              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input className={`${input} !pl-9`} placeholder="Search name or report text…" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                              {FILTERS.map(([k, label]) => <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>{label}</button>)}
                        </div>
                  </div>

                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : (
                        <>
                              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                                    <Stat icon={FileCheck2} label="Reports submitted" value={submitted.length} tone="text-emerald-400" />
                                    <Stat icon={FileX2} label="Checked in, no report yet" value={missing.length} tone={missing.length ? 'text-amber-400' : 'text-white'} hint={missing.length ? missing.map((m) => m.name.split(' ')[0]).join(', ') : undefined} />
                                    <Stat icon={AlertTriangle} label="Reporting blockers" value={rows.filter((r) => r.blockers).length} tone={rows.some((r) => r.blockers) ? 'text-amber-400' : 'text-white'} />
                                    <Stat label="Staff" value={rows.length} />
                              </div>

                              {shown.length === 0 ? <Empty>No reports match for this day.</Empty> : (
                                    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                                          {shown.map((r) => (
                                                <article key={r.userId} className={`${card} flex flex-col gap-4 p-5 ${r.blockers ? 'border-amber-500/40' : ''}`}>
                                                      <header className="flex items-center gap-3">
                                                            <Avatar name={r.name} image={r.image} />
                                                            <div className="min-w-0 flex-1">
                                                                  <p className="truncate font-semibold">{r.name}</p>
                                                                  <p className="truncate text-xs text-gray-500">{r.designation}</p>
                                                            </div>
                                                            <Badge status={r.status} />
                                                      </header>
                                                      <p className="text-xs text-gray-400">In {fmtTime(r.checkIn)} · Out {r.open ? <b className="text-emerald-400">in office</b> : fmtTime(r.checkOut)} · Worked {fmtHours(r.workedMinutes)}</p>
                                                      {r.hasReport ? <ReportView parts={r.reportParts} report={r.report} /> : <p className="rounded-xl border border-dashed border-amber-500/40 px-3 py-3 text-sm text-amber-300">Has not ended the day yet, so no report. It is required when they end their day.</p>}
                                                </article>
                                          ))}
                                    </div>
                              )}
                        </>
                  )}
            </section>
      );
}
