import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { api } from './api';
import { localMonth } from './format';
import { Empty, Row, Stat, Table, Td, btnGhost, input } from '../Invoice/ui';

const money = (n) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

// Salary for the month, worked out from attendance. Nothing to enter by hand.
export default function Payroll() {
      const [month, setMonth] = useState(localMonth());
      const { data, isPending, error } = useQuery({ queryKey: ['att-payroll', month], queryFn: () => api(`/payroll?month=${month}`) });
      const rows = data?.rows ?? [];

      const exportCsv = () => {
            const head = ['Employee', 'Designation', 'Salary', 'Absent days', 'Unpaid leave days', 'Late days', 'Late deduction days', 'Deduction', 'Weekend/holiday days worked', 'Bonus', 'Net pay'];
            const lines = [head, ...rows.map((r) => [r.name, r.designation, r.salary, r.absent, r.unpaidLeave, r.lateDays, r.lateCharged, r.deduction, r.offDaysWorked, r.bonus, r.net])];
            const url = URL.createObjectURL(new Blob([lines.map((l) => l.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
            Object.assign(document.createElement('a'), { href: url, download: `payroll-${month}.csv` }).click();
            URL.revokeObjectURL(url);
      };

      return (
            <section className="space-y-4">
                  <div className="flex items-center justify-between">
                        <input type="month" className={`${input} !w-auto`} value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
                        <button className={btnGhost} disabled={!rows.length} onClick={exportCsv}><Download size={16} /> Export CSV</button>
                  </div>
                  {data && (
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                              <Stat label="Total salary" value={money(data.total.salary)} />
                              <Stat label="Deductions" value={money(data.total.deduction)} tone="text-red-400" />
                              <Stat label="Weekend / holiday bonus" value={money(data.total.bonus)} tone="text-emerald-400" />
                              <Stat label="Net payable" value={money(data.total.net)} tone="text-sky-400" />
                        </div>
                  )}
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : (
                        <Table head={['Employee', 'Salary', 'Absent', 'Unpaid leave', 'Late', 'Deduction', 'Off-day work', 'Bonus', 'Net pay']}>
                              {rows.map((r) => (
                                    <Row key={r.userId}>
                                          <Td><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.designation}</p></Td>
                                          <Td className="tabular-nums">{r.salary ? money(r.salary) : <span className="text-amber-400">not set</span>}</Td>
                                          <Td className="tabular-nums">{r.absent} d</Td>
                                          <Td className="tabular-nums">{r.unpaidLeave} d</Td>
                                          <Td className="tabular-nums">{r.lateDays}{r.lateCharged > 0 && <span className="text-red-400"> (−{r.lateCharged} d)</span>}</Td>
                                          <Td className="tabular-nums text-red-400">{r.deduction ? `−${money(r.deduction)}` : '-'}</Td>
                                          <Td className="tabular-nums">{r.offDaysWorked} d</Td>
                                          <Td className="tabular-nums text-emerald-400">{r.bonus ? `+${money(r.bonus)}` : '-'}</Td>
                                          <Td className="tabular-nums font-semibold">{money(r.net)}</Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  <p className="text-xs text-gray-500">
                        A day's pay is salary ÷ 30. A working day with no check-in and no approved leave loses a day's pay; so does approved unpaid leave. {data?.lateDaysPerDeduction > 0 ? `Every ${data.lateDaysPerDeduction} late arrivals also cost a day's pay.` : 'Late arrivals are not deducted.'} Paid leave (casual, sick, annual) costs nothing.
                        Working on a weekend or holiday adds that day's pay plus {data?.offDayBonusPercent ?? 20}%. The current month counts days up to yesterday. Salary comes from Employee Management.
                  </p>
            </section>
      );
}
