import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { money, monthLabel } from '../format';
import { Empty, Row, Stat, Table, Td, input } from '../ui';
import { useSummary } from './DashboardTab';

export default function ReportsTab() {
      const [year, setYear] = useState(new Date().getFullYear());
      const { data: s, error } = useSummary(year);

      if (error) return <Empty>{error.message}</Empty>;
      if (!s) return <Empty>Loading…</Empty>;

      const chart = s.months.map((m) => ({ ...m, name: monthLabel(m.month).slice(0, 3) }));
      const categories = Object.entries(s.expenseByCategory).sort((a, b) => b[1] - a[1]);

      return (
            <div className="space-y-8">
                  <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">Year</span>
                        <input type="number" min="2000" max="2100" className={`${input} max-w-[7rem]`} value={year} onChange={(e) => setYear(Number(e.target.value) || year)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                        <Stat label="Invoiced" value={money(s.totals.invoiced)} />
                        <Stat label="Collected" value={money(s.totals.collected)} tone="text-emerald-400" />
                        <Stat label="Expenses" value={money(s.totals.expenses)} tone="text-red-300" />
                        <Stat label="Salary paid" value={money(s.totals.salaryPaid)} tone="text-amber-300" />
                        <Stat label="FX gain / loss" value={money(s.totals.fxGain)} tone={s.totals.fxGain < 0 ? 'text-red-400' : 'text-emerald-400'} hint="Rate at payment vs invoice rate" />
                  </div>

                  <section>
                        <h2 className="mb-3 text-sm font-semibold text-gray-300">Money in vs out by month (cash basis)</h2>
                        <div className="h-80 rounded-xl border border-gray-800 bg-gray-900 p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chart}>
                                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                          <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
                                          <Tooltip formatter={(v) => money(v)} contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
                                          <Legend />
                                          <Bar dataKey="collected" name="Collected" fill="#10b981" />
                                          <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                                          <Bar dataKey="salaryPaid" name="Salary paid" fill="#fbbf24" />
                                    </BarChart>
                              </ResponsiveContainer>
                        </div>
                  </section>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <section>
                              <h2 className="mb-3 text-sm font-semibold text-gray-300">Monthly detail</h2>
                              <Table head={['Month', 'Invoiced', 'Collected', 'Out']}>
                                    {s.months.map((m) => (
                                          <Row key={m.month}>
                                                <Td>{monthLabel(m.month)}</Td>
                                                <Td>{money(m.invoiced)}</Td>
                                                <Td className="text-emerald-400">{money(m.collected)}</Td>
                                                <Td className="text-red-300">{money(m.expenses + m.salaryPaid)}</Td>
                                          </Row>
                                    ))}
                              </Table>
                        </section>
                        <section>
                              <h2 className="mb-3 text-sm font-semibold text-gray-300">Expenses by category</h2>
                              {categories.length === 0 ? <Empty>No expenses in {year}.</Empty> : (
                                    <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900">
                                          {categories.map(([c, v]) => (
                                                <div key={c} className="flex justify-between px-5 py-3 text-sm"><span>{c}</span><b>{money(v)}</b></div>
                                          ))}
                                    </div>
                              )}
                        </section>
                  </div>
            </div>
      );
}
