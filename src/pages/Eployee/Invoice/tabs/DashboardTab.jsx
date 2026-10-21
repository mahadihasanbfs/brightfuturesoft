import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { money, fmtDate } from '../format';
import { Empty, Row, Stat, Table, Td } from '../ui';

export const useSummary = (year) =>
      useQuery({ queryKey: ['acc-summary', year], queryFn: () => api(`/reports/summary?year=${year}`) });

export default function DashboardTab() {
      const year = new Date().getFullYear();
      const { data: s, error } = useSummary(year);
      const { data: invoices = [] } = useQuery({ queryKey: ['acc-invoices'], queryFn: () => api('/invoices') });

      if (error) return <Empty>{error.message}</Empty>;
      if (!s) return <Empty>Loading…</Empty>;

      const overdue = invoices.filter((i) => i.status === 'overdue').sort((a, b) => b.daysOverdue - a.daysOverdue);
      const agingRows = [['Not yet due', s.aging.current], ['1–30 days', s.aging['0-30']], ['31–60 days', s.aging['31-60']], ['61–90 days', s.aging['61-90']], ['90+ days', s.aging['90+']]];
      const agingMax = Math.max(...agingRows.map(([, v]) => v), 1);

      return (
            <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <Stat label="Receivable (due)" value={money(s.receivable)} hint="Unpaid + partial + overdue" />
                        <Stat label="Overdue" value={money(s.overdue)} tone={s.overdue > 0 ? 'text-red-400' : ''} hint={`${s.overdueCount} invoice(s)`} />
                        <Stat label="Salary payable" value={money(s.salaryPayable)} tone={s.salaryPayable > 0 ? 'text-amber-400' : ''} hint="Unpaid payslip balance" />
                        <Stat label={`Net cash ${year}`} value={money(s.totals.netCash)} tone={s.totals.netCash < 0 ? 'text-red-400' : 'text-emerald-400'} hint="Collected − expenses − salary paid" />
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        <section>
                              <h2 className="mb-3 text-sm font-semibold text-gray-300">Receivables aging</h2>
                              <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-900 p-5">
                                    {agingRows.map(([label, v]) => (
                                          <div key={label}>
                                                <div className="mb-1 flex justify-between text-xs text-gray-400"><span>{label}</span><span>{money(v)}</span></div>
                                                <div className="h-2 rounded bg-gray-800"><div className="h-2 rounded bg-blue-500" style={{ width: `${(v / agingMax) * 100}%` }} /></div>
                                          </div>
                                    ))}
                              </div>
                        </section>
                        <section>
                              <h2 className="mb-3 text-sm font-semibold text-gray-300">Top clients owing</h2>
                              {s.topDebtors.length === 0 ? <Empty>Nobody owes anything.</Empty> : (
                                    <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900">
                                          {s.topDebtors.map((d) => (
                                                <div key={d.client} className="flex justify-between px-5 py-3 text-sm"><span>{d.client}</span><b>{money(d.balance)}</b></div>
                                          ))}
                                    </div>
                              )}
                        </section>
                  </div>

                  <section>
                        <h2 className="mb-3 text-sm font-semibold text-gray-300">Overdue invoices</h2>
                        {overdue.length === 0 ? <Empty>No overdue invoices.</Empty> : (
                              <Table head={['Invoice', 'Client', 'Due', 'Late', 'Balance']}>
                                    {overdue.map((i) => (
                                          <Row key={i._id}>
                                                <Td className="font-medium">{i.number}</Td>
                                                <Td>{i.client?.name}</Td>
                                                <Td className="text-gray-400">{fmtDate(i.dueDate)}</Td>
                                                <Td className="text-red-400">{i.daysOverdue} days</Td>
                                                <Td className="font-semibold">{money(i.balance, i.currency)}{i.currency !== 'BDT' && <div className="text-xs text-gray-500">{money(i.balanceBase)}</div>}</Td>
                                          </Row>
                                    ))}
                              </Table>
                        )}
                  </section>
            </div>
      );
}
