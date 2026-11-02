import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, Clock3, Target, Timer } from 'lucide-react';
import { api } from './api';
import { grade, lastMonths, metrics, monthLabel } from './performance';
import { Empty, Stat, card } from '../Invoice/ui';

const COLORS = { present: '#10b981', late: '#f59e0b', leave: '#0ea5e9', absent: '#ef4444', blue: '#3b82f6', violet: '#8b5cf6' };
const AXIS = { stroke: '#6b7280', fontSize: 12, tickLine: false, axisLine: false };
const TIP = { contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#fff' }, cursor: { fill: 'rgba(255,255,255,.04)' } };

const ChartCard = ({ title, subtitle, children }) => (
      <section className={`${card} p-5`}>
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <p className="mb-4 text-xs text-gray-400">{subtitle}</p>}
            <div className="h-64">{children}</div>
      </section>
);

export default function MyPerformance() {
      const months = useMemo(() => lastMonths(6), []);
      const results = useQueries({ queries: months.map((m) => ({ queryKey: ['att-my', m], queryFn: () => api(`/my?month=${m}`) })) });
      const loading = results.some((r) => r.isPending);
      const failed = results.find((r) => r.error);
      if (failed) return <Empty>{failed.error.message}</Empty>;
      if (loading) return <Empty>Loading…</Empty>;

      const trend = months.map((m, i) => {
            const s = results[i].data.summary;
            const x = metrics(s);
            return { month: monthLabel(m), Attendance: x.attendance, Punctuality: x.punctuality, 'Avg hours/day': x.avgHours };
      });
      const current = results[results.length - 1].data;
      const cur = metrics(current.summary);
      const [gradeLabel, gradeTone] = grade(cur.score);
      const pie = [
            ['Present', current.summary.present, COLORS.present],
            ['Late', current.summary.late, COLORS.late],
            ['Leave', current.summary.leave, COLORS.leave],
            ['Absent', current.summary.absent, COLORS.absent],
      ].filter(([, v]) => v > 0).map(([name, value, color]) => ({ name, value, color }));
      const daily = current.days.filter((d) => d.workedMinutes > 0).map((d) => ({ day: Number(d.date.slice(8)), Hours: Math.round((d.workedMinutes / 60) * 10) / 10 }));

      return (
            <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className={`${card} p-5`}>
                              <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Performance score</p>
                                    <Award size={16} className={gradeTone} />
                              </div>
                              <p className={`mt-2 text-4xl font-bold tabular-nums ${gradeTone}`}>{cur.score ?? '–'}<span className="text-lg text-gray-500">/100</span></p>
                              <p className={`mt-1 text-sm font-medium ${gradeTone}`}>{gradeLabel}</p>
                              <p className="mt-1 text-xs text-gray-500">60% attendance + 40% punctuality, this month</p>
                        </div>
                        <Stat icon={Target} label="Attendance rate" value={cur.attendance === null ? '–' : `${cur.attendance}%`} tone="text-emerald-400" hint="Days attended vs working days (leave excluded)" />
                        <Stat icon={Clock3} label="Punctuality" value={cur.punctuality === null ? '–' : `${cur.punctuality}%`} tone="text-amber-400" hint={`${current.summary.late} late arrival${current.summary.late === 1 ? '' : 's'} this month`} />
                        <Stat icon={Timer} label="Avg hours / day" value={cur.avgHours ? `${cur.avgHours}h` : '–'} tone="text-sky-400" hint="Across days you attended" />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                        <ChartCard title="6-month trend" subtitle="Attendance rate and punctuality (%)">
                              <ResponsiveContainer>
                                    <LineChart data={trend} margin={{ left: -16, right: 8, top: 8 }}>
                                          <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                          <XAxis dataKey="month" {...AXIS} />
                                          <YAxis domain={[0, 100]} {...AXIS} />
                                          <Tooltip {...TIP} />
                                          <Legend wrapperStyle={{ fontSize: 12 }} />
                                          <Line type="monotone" dataKey="Attendance" stroke={COLORS.present} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                                          <Line type="monotone" dataKey="Punctuality" stroke={COLORS.late} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
                                    </LineChart>
                              </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Average hours per day" subtitle="Last 6 months">
                              <ResponsiveContainer>
                                    <BarChart data={trend} margin={{ left: -16, right: 8, top: 8 }}>
                                          <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                          <XAxis dataKey="month" {...AXIS} />
                                          <YAxis {...AXIS} />
                                          <Tooltip {...TIP} />
                                          <Bar dataKey="Avg hours/day" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
                                    </BarChart>
                              </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="This month at a glance" subtitle="Days by status">
                              {pie.length === 0 ? <Empty>No attendance data yet this month.</Empty> : (
                                    <ResponsiveContainer>
                                          <PieChart>
                                                <Pie data={pie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                                                      {pie.map((p) => <Cell key={p.name} fill={p.color} />)}
                                                </Pie>
                                                <Tooltip {...TIP} />
                                                <Legend wrapperStyle={{ fontSize: 12 }} />
                                          </PieChart>
                                    </ResponsiveContainer>
                              )}
                        </ChartCard>

                        <ChartCard title="Hours worked each day" subtitle="This month">
                              {daily.length === 0 ? <Empty>No hours recorded yet this month.</Empty> : (
                                    <ResponsiveContainer>
                                          <BarChart data={daily} margin={{ left: -16, right: 8, top: 8 }}>
                                                <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                                <XAxis dataKey="day" {...AXIS} />
                                                <YAxis {...AXIS} />
                                                <Tooltip {...TIP} />
                                                <Bar dataKey="Hours" fill={COLORS.violet} radius={[6, 6, 0, 0]} />
                                          </BarChart>
                                    </ResponsiveContainer>
                              )}
                        </ChartCard>
                  </div>
            </div>
      );
}
