import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Pencil, Ban, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '../api';
import { Modal, PaymentsPanel, StatusBadge, btnGhost, btnDanger, btnPrimary, confirm, toastError } from '../ui';
import { A4_PAGE_STYLE, InvoiceDocument } from '../print/Documents';
import { BASE_CURRENCY, money, fmtDate } from '../format';

const PAYMENT_TYPES = [
      { value: 'partial', label: 'Partial' },
      { value: 'advance', label: 'Advance' },
      { value: 'final', label: 'Final' },
];

export default function InvoiceDetailModal({ invoice, onClose, onChanged, onEdit }) {
      const printRef = useRef(null);
      const print = useReactToPrint({ contentRef: printRef, documentTitle: invoice.number, pageStyle: A4_PAGE_STYLE });

      const run = async (fn) => {
            try {
                  await fn();
            } catch (err) {
                  toastError(err);
            }
      };

      const addPayment = async (body) => {
            const updated = await api(`/invoices/${invoice._id}/payments`, { method: 'POST', body });
            onChanged(updated);
      };

      const removePayment = (p) =>
            run(async () => {
                  if (!(await confirm(`Remove payment of ${money(p.amount)}?`, 'Remove'))) return;
                  onChanged(await api(`/invoices/${invoice._id}/payments/${p._id}`, { method: 'DELETE' }));
            });

      const cancel = () =>
            run(async () => {
                  if (!(await confirm('Cancelled invoices stop counting as receivable.', 'Cancel invoice'))) return;
                  await api(`/invoices/${invoice._id}/cancel`, { method: 'POST' });
                  onChanged({ ...invoice, cancelled: true, status: 'cancelled' }, true);
            });

      const restore = () =>
            run(async () => {
                  await api(`/invoices/${invoice._id}/restore`, { method: 'POST' });
                  onChanged(await api(`/invoices/${invoice._id}`), true);
            });

      const remove = () =>
            run(async () => {
                  if (!(await confirm('This permanently deletes the invoice.', 'Delete'))) return;
                  await api(`/invoices/${invoice._id}`, { method: 'DELETE' });
                  onChanged(null, true);
                  onClose();
            });

      const foreign = invoice.currency !== BASE_CURRENCY;
      const issued = invoice.status !== 'draft' && invoice.status !== 'cancelled';

      return (
            <Modal title={`${invoice.number} · ${invoice.client?.name}`} onClose={onClose} wide>
                  <div className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                    <StatusBadge status={invoice.status} />
                                    <span className="text-sm text-gray-400">
                                          Due {fmtDate(invoice.dueDate)}
                                          {invoice.daysOverdue > 0 && invoice.balance > 0 && (
                                                <span className="ml-2 text-red-400">{invoice.daysOverdue} days overdue</span>
                                          )}
                                    </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                    <button onClick={print} className={btnPrimary}><Printer size={16} /> Print / PDF</button>
                                    <button onClick={() => onEdit(invoice)} className={btnGhost}><Pencil size={16} /> Edit</button>
                                    {invoice.status === 'cancelled' ? (
                                          <button onClick={restore} className={btnGhost}><RotateCcw size={16} /> Restore</button>
                                    ) : (
                                          <button onClick={cancel} className={btnGhost}><Ban size={16} /> Cancel</button>
                                    )}
                                    {invoice.payments.length === 0 && (
                                          <button onClick={remove} className={btnDanger}><Trash2 size={16} /> Delete</button>
                                    )}
                              </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center">
                              {[['Total', invoice.total, invoice.totalBase, ''], ['Paid', invoice.paid, invoice.paidBase, 'text-emerald-400'], ['Balance', invoice.balance, invoice.balanceBase, invoice.balance > 0 ? 'text-red-400' : '']].map(([l, v, base, t]) => (
                                    <div key={l} className="rounded-lg border border-gray-800 p-3">
                                          <p className="text-xs text-gray-400">{l}</p>
                                          <p className={`text-lg font-bold ${t}`}>{money(v, invoice.currency)}</p>
                                          {foreign && <p className="text-xs text-gray-500">{money(base)}</p>}
                                    </div>
                              ))}
                        </div>

                        {foreign && (
                              <p className="text-xs text-gray-400">
                                    Invoice rate 1 {invoice.currency} = {money(invoice.exchangeRate)}.
                                    {invoice.payments.length > 0 && <> Exchange {invoice.fxGain >= 0 ? 'gain' : 'loss'} on payments: <b className={invoice.fxGain >= 0 ? 'text-emerald-400' : 'text-red-400'}>{money(Math.abs(invoice.fxGain))}</b></>}
                              </p>
                        )}

                        <PaymentsPanel
                              currency={invoice.currency}
                              rate={invoice.exchangeRate}
                              payments={invoice.payments}
                              balance={invoice.balance}
                              canPay={issued}
                              onAdd={addPayment}
                              onRemove={removePayment}
                              types={PAYMENT_TYPES}
                        />

                        <div className="overflow-x-auto rounded-xl bg-gray-200 p-4">
                              <InvoiceDocument ref={printRef} invoice={invoice} />
                        </div>
                  </div>
            </Modal>
      );
}
