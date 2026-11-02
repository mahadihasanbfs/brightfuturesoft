import { useMemo, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { Award, ChevronDown, ChevronUp, Download, Search, TrendingDown, Users } from 'lucide-react';
import { api } from './api';
import Badge from './Badge';
import CalendarStrip from './CalendarStrip';
import { fmtDay, fmtHours, fmtTime, localMonth } from './format';
import { grade, lastMonths, leaveDays, metrics, monthLabel } from './performance';
import { Empty, Modal, Row, Stat, Table, Td, btnGhost, card, input } from '../Invoice/ui';

const AXIS = { stroke: '#6b7280', fontSize: 12, tickLine: false, axisLine: false };
const TIP = { contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#fff' }, cursor: { fill: 'rgba(255,255,255,.04)' } };
const scoreColor = (n) => (n === null ? '#4b5563' : n >= 90 ? '#10b981' : n >= 75 ? '#0ea5e9' : n >= 50 ? '#f59e0b' : '#ef4444');
const pct = (n) => (n === null ? '–' : `${n}%`);
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

const Avatar = ({ name, image, size = 'h-9 w-9' }) =>
      image ? <img src={image} alt="" className={`${size} shrink-0 rounded-full object-cover`} /> : (
            <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-blue-600/30 text-sm font-semibold text-blue-200`}>{(name || '?').charAt(0).toUpperCase()}</span>
      );

// Everything about one employee: 6-month trend, this month's calendar, late/absent days, leave history.
function EmployeeDetail({ row, month, onClose }) {
      const months = useMemo(() => lastMonths(6), []);
      const results = useQueries({ queries: months.map((m) => ({ queryKey: ['att-emp', row.userId, m], queryFn: () => api(`/employee/${row.userId}?month=${m}`) })) });
      const selected = useQuery({ queryKey: ['att-emp', row.userId, month], queryFn: () => api(`/employee/${row.userId}?month=${month}`) });
      const trend = results.every((r) => r.data) ? months.map((m, i) => { const x = metrics(results[i].data.summary); return { month: monthLabel(m), Attendance: x.attendance, Punctuality: x.punctuality }; }) : null;
      const d = selected.data;
      const m = d ? metrics(d.summary) : null;
      const [gl, tone] = grade(m?.score ?? null);
      const problem = d ? d.days.filter((x) => ['late', 'absent'].includes(x.status)) : [];

      return (
            <Modal title={row.name} onClose={onClose} wide>
                  {selected.error ? <Empty>{selected.error.message}</Empty> : !d ? <Empty>Loading…</Empty> : (
                        <div className="space-y-6">
                              <div className="flex flex-wrap items-center gap-4">
                                    <Avatar name={d.user.name} image={d.user.image} size="h-14 w-14" />
                                    <div className="min-w-0">
                                          <p className="text-sm text-gray-400">{d.user.designation || 'Employee'}</p>
                                          <p className="truncate text-sm text-gray-300">{[d.user.email, d.user.phone].filter(Boolean).join(' · ')}</p>
                                    </div>
                                    <div className="ml-auto text-right">
                                          <p className={`text-4xl font-bold tabular-nums ${tone}`}>{m.score ?? '–'}<span className="text-base text-gray-500">/100</span></p>
                                          <p className={`text-sm font-medium ${tone}`}>{gl}</p>
                                    </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <Stat label="Attendance" value={pct(m.attendance)} tone="text-emerald-400" />
                                    <Stat label="Punctuality" value={pct(m.punctuality)} tone="text-amber-400" />
                                    <Stat label="Avg hours / day" value={m.avgHours ? `${m.avgHours}h` : '–'} tone="text-sky-400" />
                                    <Stat label="Hours worked" value={fmtHours(d.summary.workedMinutes)} hint={`${d.summary.present + d.summary.late} days attended`} />
                              </div>

                              <CalendarStrip days={d.days} />

                              <div className="grid gap-6 lg:grid-cols-2">
                                    <section className={`${card} p-5`}>
                                          <h3 className="mb-4 font-semibold">6-month trend</h3>
                                          <div className="h-56">
                                                {!trend ? <Empty>Loading…</Empty> : (
                                                      <ResponsiveContainer>
                                                            <LineChart data={trend} margin={{ left: -16, right: 8, top: 8 }}>
                                                                  <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                                                  <XAxis dataKey="month" {...AXIS} />
                                                                  <YAxis domain={[0, 100]} {...AXIS} />
                                                                  <Tooltip {...TIP} />
                                                                  <Legend wrapperStyle={{ fontSize: 12 }} />
                                                                  <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                                                                  <Line type="monotone" dataKey="Punctuality" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                                                            </LineChart>
                                                      </ResponsiveContainer>
                                                )}
                                          </div>
                                    </section>

                                    <section className={`${card} p-5`}>
                                          <h3 className="mb-3 font-semibold">Late and absent days</h3>
                                          {problem.length === 0 ? <p className="text-sm text-gray-500">None this month.</p> : (
                                                <ul className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
                                                      {problem.map((x) => (
                                                            <li key={x.date} className="flex items-center justify-between gap-3">
                                                                  <span className="text-gray-300">{fmtDay(x.date)}</span>
                                                                  <span className="flex items-center gap-3 text-gray-400">{x.checkIn ? fmtTime(x.checkIn) : ''}<Badge status={x.status} /></span>
                                                            </li>
                                                      ))}
                                                </ul>
                                          )}
                                    </section>
                              </div>

                              <section>
                                    <h3 className="mb-3 font-semibold">Leave history</h3>
                                    {d.leaves.length === 0 ? <p className="text-sm text-gray-500">No leave requests.</p> : (
                                          <Table head={['Dates', 'Days', 'Type', 'Reason', 'Status', 'Decision']}>
                                                {d.leaves.map((l) => (
                                                      <Row key={l._id}>
                                                            <Td className="whitespace-nowrap">{l.from === l.to ? l.from : `${l.from} → ${l.to}`}</Td>
                                                            <Td className="tabular-nums">{leaveDays(l.from, l.to)}</Td>
                                                            <Td className="capitalize">{l.type}</Td>
                                                            <Td className="max-w-xs truncate text-gray-400" title={l.reason}>{l.reason || '-'}</Td>
                                                            <Td><Badge status={l.status} /></Td>
                                                            <Td className="max-w-xs truncate text-xs text-gray-400" title={l.decisionNote}>{l.decidedAt ? `${l.decidedByName || ''}${l.decisionNote ? ` · ${l.decisionNote}` : ''}` : '-'}</Td>
                                                      </Row>
                                                ))}
                                          </Table>
                                    )}
                              </section>
                        </div>
                  )}
            </Modal>
      );
}

const COLUMNS = [
      ['score', 'Score'], ['attendance', 'Attendance'], ['punctuality', 'Punctuality'], ['avgHours', 'Avg hrs'],
      ['late', 'Late'], ['absent', 'Absent'], ['leave', 'Leave'],
];

export default function TeamPerformance() {
      const [month, setMonth] = useState(localMonth());
      const [q, setQ] = useState('');
      const [sort, setSort] = useState({ key: 'score', dir: 'desc' });
      const [open, setOpen] = useState(null);
      const { data, isPending, error } = useQuery({ queryKey: ['att-monthly', month], queryFn: () => api(`/monthly?month=${month}`) });

      const rows = useMemo(() => (data?.rows || []).map((r) => ({ ...r, ...metrics(r) })), [data]);
      const shown = useMemo(() => {
            const list = rows.filter((r) => !q.trim() || `${r.name} ${r.designation || ''}`.toLowerCase().includes(q.trim().toLowerCase()));
            const val = (r) => r[sort.key] ?? -1;
            return [...list].sort((a, b) => (sort.dir === 'asc' ? val(a) - val(b) : val(b) - val(a)));
      }, [rows, q, sort]);

      const scored = rows.filter((r) => r.score !== null);
      const avg = (k) => { const v = scored.map((r) => r[k]).filter((n) => n !== null); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
      const best = [...scored].sort((a, b) => b.score - a.score)[0];
      const worst = [...scored].sort((a, b) => a.score - b.score)[0];

      const toggle = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'desc' ? 'asc' : 'desc' } : { key, dir: 'desc' }));
      const exportCsv = () => {
            const lines = [['Name', 'Designation', 'Score', 'Attendance %', 'Punctuality %', 'Avg hours/day', 'Present', 'Late', 'Leave', 'Absent', 'Hours worked'],
                  ...shown.map((r) => [r.name, r.designation, r.score, r.attendance, r.punctuality, r.avgHours, r.present, r.late, r.leave, r.absent, (r.workedMinutes / 60).toFixed(1)])];
            const url = URL.createObjectURL(new Blob([lines.map((l) => l.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
            Object.assign(document.createElement('a'), { href: url, download: `team-performance-${month}.csv` }).click();
            URL.revokeObjectURL(url);
      };

      const chartData = [...scored].sort((a, b) => b.score - a.score).map((r) => ({ name: r.name.split(' ')[0], Score: r.score }));

      return (
            <section className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                        <input type="month" className={`${input} !w-auto`} value={month} max={localMonth()} onChange={(e) => e.target.value && setMonth(e.target.value)} />
                        <button className={btnGhost} disabled={!rows.length} onClick={exportCsv}><Download size={16} /> Export CSV</button>
                  </div>

                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : (
                        <>
                              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                                    <Stat icon={Users} label="Team score" value={avg('score') ?? '–'} tone="text-sky-400" hint={`Attendance ${pct(avg('attendance'))} · punctuality ${pct(avg('punctuality'))}`} />
                                    <Stat icon={Award} label="Top performer" value={best ? best.name.split(' ')[0] : '–'} tone="text-emerald-400" hint={best ? `${best.score}/100` : undefined} />
                                    <Stat icon={TrendingDown} label="Needs attention" value={worst ? worst.name.split(' ')[0] : '–'} tone="text-red-400" hint={worst ? `${worst.score}/100` : undefined} />
                                    <Stat label="Late arrivals" value={rows.reduce((n, r) => n + r.late, 0)} tone="text-amber-400" hint={`${rows.reduce((n, r) => n + r.absent, 0)} absences this month`} />
                              </div>

                              {chartData.length > 0 && (
                                    <div className={`${card} p-5`}>
                                          <h3 className="mb-4 font-semibold">Score by employee</h3>
                                          <div className="h-64">
                                                <ResponsiveContainer>
                                                      <BarChart data={chartData} margin={{ left: -16, right: 8, top: 8 }}>
                                                            <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                                            <XAxis dataKey="name" {...AXIS} interval={0} />
                                                            <YAxis domain={[0, 100]} {...AXIS} />
                                                            <Tooltip {...TIP} />
                                                            <Bar dataKey="Score" radius={[6, 6, 0, 0]}>
                                                                  {chartData.map((c) => <Cell key={c.name} fill={scoreColor(c.Score)} />)}
                                                            </Bar>
                                                      </BarChart>
                                                </ResponsiveContainer>
                                          </div>
                                    </div>
                              )}

                              <div className="relative min-w-[14rem] sm:max-w-xs">
                                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input className={`${input} !pl-9`} placeholder="Search employee…" value={q} onChange={(e) => setQ(e.target.value)} />
                              </div>

                              {shown.length === 0 ? <Empty>No employees match.</Empty> : (
                                    <Table head={['#', 'Employee', ...COLUMNS.map(([k, label]) => (
                                          <button key={k} onClick={() => toggle(k)} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white">
                                                {label}{sort.key === k && (sort.dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
                                          </button>
                                    ))]}>
                                          {shown.map((r, i) => {
                                                const [gl, tone] = grade(r.score);
                                                return (
                                                      <Row key={r.userId} onClick={() => setOpen(r)}>
                                                            <Td className="text-gray-500">{i + 1}</Td>
                                                            <Td>
                                                                  <div className="flex items-center gap-3">
                                                                        <Avatar name={r.name} image={r.image} />
                                                                        <div className="min-w-0"><p className="truncate font-medium">{r.name}</p><p className="truncate text-xs text-gray-500">{r.designation}</p></div>
                                                                  </div>
                                                            </Td>
                                                            <Td>
                                                                  <div className="flex items-center gap-2">
                                                                        <b className={`tabular-nums ${tone}`}>{r.score ?? '–'}</b>
                                                                        <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-white/10 md:block"><span className="block h-full rounded-full" style={{ width: `${r.score ?? 0}%`, background: scoreColor(r.score) }} /></span>
                                                                        <span className={`hidden text-xs xl:inline ${tone}`}>{gl}</span>
                                                                  </div>
                                                            </Td>
                                                            <Td>{pct(r.attendance)}</Td>
                                                            <Td>{pct(r.punctuality)}</Td>
                                                            <Td>{r.avgHours ? `${r.avgHours}h` : '–'}</Td>
                                                            <Td className="text-amber-400">{r.late}</Td>
                                                            <Td className="text-red-400">{r.absent}</Td>
                                                            <Td className="text-sky-400">{r.leave}</Td>
                                                      </Row>
                                                );
                                          })}
                                    </Table>
                              )}
                              <p className="text-xs text-gray-500">Score = 60% attendance rate (leave excluded) + 40% punctuality. Click an employee for the full picture.</p>
                        </>
                  )}
                  {open && <EmployeeDetail row={open} month={month} onClose={() => setOpen(null)} />}
            </section>
      );
}
