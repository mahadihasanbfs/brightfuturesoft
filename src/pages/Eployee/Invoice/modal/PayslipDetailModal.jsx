import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Pencil, Trash2 } from 'lucide-react';
import { api } from '../api';
import { Modal, PaymentsPanel, StatusBadge, btnGhost, btnDanger, btnPrimary, confirm, toastError } from '../ui';
import { A4_PAGE_STYLE, PayslipDocument } from '../print/Documents';
import { money, monthLabel } from '../format';

const PAYMENT_TYPES = [
      { value: 'salary', label: 'Salary' },
      { value: 'advance', label: 'Advance' },
      { value: 'partial', label: 'Partial' },
];

// `admin` false = employee viewing their own payslip: print only.
export default function PayslipDetailModal({ slip, admin = true, onClose, onChanged, onEdit }) {
      const printRef = useRef(null);
      const print = useReactToPrint({ contentRef: printRef, documentTitle: `Payslip ${slip.month} ${slip.employee?.name}`, pageStyle: A4_PAGE_STYLE });

      const run = async (fn) => {
            try {
                  await fn();
            } catch (err) {
                  toastError(err);
            }
      };

      const addPayment = async (body) => onChanged(await api(`/payslips/${slip._id}/payments`, { method: 'POST', body }));

      const removePayment = (p) =>
            run(async () => {
                  if (!(await confirm(`Remove payment of ${money(p.amount)}?`, 'Remove'))) return;
                  onChanged(await api(`/payslips/${slip._id}/payments/${p._id}`, { method: 'DELETE' }));
            });

      const remove = () =>
            run(async () => {
                  if (!(await confirm('This permanently deletes the payslip.', 'Delete'))) return;
                  await api(`/payslips/${slip._id}`, { method: 'DELETE' });
                  onChanged(null);
                  onClose();
            });

      return (
            <Modal title={`${slip.employee?.name} · ${monthLabel(slip.month)}`} onClose={onClose} wide>
                  <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                              <StatusBadge status={slip.status} />
                              <div className="flex flex-wrap gap-2">
                                    <button onClick={print} className={btnPrimary}><Printer size={16} /> Print / PDF</button>
                                    {admin && <button onClick={() => onEdit(slip)} className={btnGhost}><Pencil size={16} /> Edit</button>}
                                    {admin && slip.payments.length === 0 && <button onClick={remove} className={btnDanger}><Trash2 size={16} /> Delete</button>}
                              </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                              {[['Net pay', slip.net, ''], ['Paid', slip.paid, 'text-emerald-400'], ['Balance', slip.balance, slip.balance > 0 ? 'text-amber-400' : '']].map(([l, v, t]) => (
                                    <div key={l} className="rounded-lg border border-gray-800 p-3">
                                          <p className="text-xs text-gray-400">{l}</p>
                                          <p className={`text-lg font-bold ${t}`}>{money(v)}</p>
                                    </div>
                              ))}
                        </div>

                        {admin && (
                              <PaymentsPanel payments={slip.payments} balance={slip.balance} canPay onAdd={addPayment} onRemove={removePayment} types={PAYMENT_TYPES} />
                        )}

                        <div className="overflow-x-auto rounded-xl bg-gray-200 p-4">
                              <PayslipDocument ref={printRef} slip={slip} />
                        </div>
                  </div>
            </Modal>
      );
}
