import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BadgeCheck, CalendarClock, MapPinned, Percent, TrendingUp } from 'lucide-react';
import { Empty, Row, Stat, Table, Td, card } from '../Invoice/ui';
import { api } from './api';
import { STAGES, bdt, stageOf } from './constants';

const AXIS = { stroke: '#6b7280', fontSize: 12, tickLine: false, axisLine: false };

export default function Overview({ admin, onOpen }) {
      const { data, isPending, error } = useQuery({ queryKey: ['sales-summary'], queryFn: () => api('/summary') });
      if (error) return <Empty>{error.message}</Empty>;
      if (isPending) return <Empty>Loading…</Empty>;
      const chart = data.stages.filter((s) => s.id !== 'lost').map((s) => ({ ...s, label: stageOf(s.stage).label, color: stageOf(s.stage).color }));
      return (
            <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
                        <Stat icon={TrendingUp} label="Open pipeline" value={bdt(data.openValue)} tone="text-sky-400" hint={`${data.openCount} open deals`} />
                        <Stat icon={BadgeCheck} label="Won this month" value={bdt(data.wonMonth.value)} tone="text-emerald-400" hint={`${data.wonMonth.count} deals`} />
                        <Stat icon={Percent} label="Win rate" value={data.winRate === null ? '–' : `${data.winRate}%`} tone="text-violet-400" hint="Won out of closed deals" />
                        <Stat icon={MapPinned} label="Visits today" value={data.visitsToday} tone="text-amber-400" hint={`${data.visitsMonth} this month`} />
                        <Stat icon={CalendarClock} label="Follow-ups due" value={data.dueCount} tone={data.dueCount ? 'text-red-400' : 'text-white'} hint="Today and overdue" />
                  </div>

                  <div className="grid gap-6 xl:grid-cols-2">
                        <section className={`${card} p-5`}>
                              <h3 className="mb-4 font-semibold">Pipeline by stage</h3>
                              <div className="h-64">
                                    <ResponsiveContainer>
                                          <BarChart data={chart} margin={{ left: -16, right: 8, top: 8 }}>
                                                <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                                                <XAxis dataKey="label" {...AXIS} />
                                                <YAxis allowDecimals={false} {...AXIS} />
                                                <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,.04)' }} formatter={(v, _n, p) => [`${v} leads · ${bdt(p.payload.value)}`, '']} />
                                                <Bar dataKey="count" radius={[6, 6, 0, 0]}>{chart.map((c) => <Cell key={c.stage} fill={c.color} />)}</Bar>
                                          </BarChart>
                                    </ResponsiveContainer>
                              </div>
                        </section>

                        <section className={`${card} p-5`}>
                              <h3 className="mb-3 font-semibold">Follow-ups due</h3>
                              {data.followUps.length === 0 ? <p className="text-sm text-gray-500">Nothing due. Nice work.</p> : (
                                    <ul className="max-h-64 space-y-1 overflow-y-auto">
                                          {data.followUps.map((f) => (
                                                <li key={f._id}>
                                                      <button onClick={() => onOpen(f._id)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5">
                                                            <span className="truncate font-medium">{f.company}</span>
                                                            <span className={`shrink-0 text-xs ${f.overdue ? 'font-semibold text-red-400' : 'text-amber-300'}`}>{f.overdue ? 'Overdue ' : 'Today '}· {f.nextFollowUp}</span>
                                                      </button>
                                                </li>
                                          ))}
                                    </ul>
                              )}
                        </section>
                  </div>

                  {admin && data.team && (
                        <section className="space-y-3">
                              <h3 className="font-semibold">Team this month</h3>
                              {data.team.length === 0 ? <Empty>No sales activity yet.</Empty> : (
                                    <Table head={['Salesperson', 'Leads', 'Open', 'Won', 'Won value', 'Visits']}>
                                          {data.team.map((t) => (
                                                <Row key={t.userId}>
                                                      <Td className="font-medium">{t.name}</Td>
                                                      <Td>{t.leads}</Td><Td>{t.open}</Td>
                                                      <Td className="text-emerald-400">{t.wonCount}</Td>
                                                      <Td className="tabular-nums">{bdt(t.wonValue)}</Td>
                                                      <Td>{t.visits}</Td>
                                                </Row>
                                          ))}
                                    </Table>
                              )}
                        </section>
                  )}
            </div>
      );
}
