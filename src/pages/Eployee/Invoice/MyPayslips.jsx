import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from './api';
import { money, monthLabel } from './format';
import { Empty, Row, StatusBadge, Table, Td } from './ui';
import PayslipDetailModal from './modal/PayslipDetailModal';

// Any signed-in employee: their own payslips, read only.
export default function MyPayslips() {
      const [selected, setSelected] = useState(null);
      const { data: slips = [], isLoading, error } = useQuery({ queryKey: ['acc-my-payslips'], queryFn: () => api('/my-payslips') });

      return (
            <main className="min-h-screen bg-gray-950 p-8 text-white">
                  <h1 className="mb-6 text-2xl font-bold">My Payslips</h1>
                  {error ? <Empty>{error.message}</Empty> : isLoading ? <Empty>Loading…</Empty> : slips.length === 0 ? <Empty>No payslips yet.</Empty> : (
                        <Table head={['Month', 'Gross', 'Deductions', 'Net', 'Paid', 'Status']}>
                              {slips.map((s) => (
                                    <Row key={s._id} onClick={() => setSelected(s)}>
                                          <Td className="font-medium">{monthLabel(s.month)}</Td>
                                          <Td>{money(s.gross)}</Td>
                                          <Td className="text-red-300">{money(s.totalDeductions)}</Td>
                                          <Td className="font-semibold">{money(s.net)}</Td>
                                          <Td className="text-emerald-400">{money(s.paid)}</Td>
                                          <Td><StatusBadge status={s.status} /></Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  {selected && <PayslipDetailModal slip={selected} admin={false} onClose={() => setSelected(null)} />}
            </main>
      );
}
