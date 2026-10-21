import { useState } from 'react';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { BASE_CURRENCY, money, todayISO } from './format';

export const input =
      'w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none';
export const btn =
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50';
export const btnPrimary = `${btn} bg-blue-600 text-white hover:bg-blue-500`;
export const btnGhost = `${btn} border border-gray-700 text-gray-300 hover:bg-gray-800`;
export const btnDanger = `${btn} bg-red-600/90 text-white hover:bg-red-500`;

export const toastError = (err) =>
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0A65B4' });

export const confirm = async (text, confirmButtonText = 'Yes') =>
      (await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text,
            showCancelButton: true,
            confirmButtonText,
            confirmButtonColor: '#dc2626',
      })).isConfirmed;

export function Field({ label, children, className = '' }) {
      return (
            <label className={`block ${className}`}>
                  <span className="mb-1 block text-xs font-medium text-gray-400">{label}</span>
                  {children}
            </label>
      );
}

export function Modal({ title, onClose, children, wide = false }) {
      return (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4">
                  <div className={`my-8 w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} rounded-2xl border border-gray-800 bg-gray-900`}>
                        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                              <h2 className="text-lg font-semibold">{title}</h2>
                              <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
                                    <X size={20} />
                              </button>
                        </div>
                        <div className="p-6">{children}</div>
                  </div>
            </div>
      );
}

const STATUS_STYLE = {
      paid: 'bg-emerald-500/15 text-emerald-400',
      partial: 'bg-amber-500/15 text-amber-400',
      unpaid: 'bg-sky-500/15 text-sky-400',
      overdue: 'bg-red-500/15 text-red-400',
      draft: 'bg-gray-500/20 text-gray-300',
      cancelled: 'bg-gray-500/20 text-gray-500 line-through',
};

export function StatusBadge({ status }) {
      return (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[status] || STATUS_STYLE.draft}`}>
                  {status}
            </span>
      );
}

export function Stat({ label, value, tone = 'text-white', hint }) {
      return (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                  <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                  <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
                  {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
            </div>
      );
}

export const Empty = ({ children }) => (
      <div className="rounded-xl border border-dashed border-gray-800 p-10 text-center text-sm text-gray-500">{children}</div>
);

export const Table = ({ head, children }) => (
      <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-xs uppercase text-gray-400">
                        <tr>{head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">{children}</tbody>
            </table>
      </div>
);

export const Row = ({ children, onClick }) => (
      <tr onClick={onClick} className={`bg-gray-950 ${onClick ? 'cursor-pointer hover:bg-gray-900' : ''}`}>{children}</tr>
);

export const Td = ({ children, className = '' }) => <td className={`px-4 py-3 ${className}`}>{children}</td>;

// Records a payment against an invoice or payslip and lists existing ones.
export function PaymentsPanel({ payments = [], balance, canPay, onAdd, onRemove, types, currency = BASE_CURRENCY, rate = 1 }) {
      const foreign = currency !== BASE_CURRENCY;
      const [form, setForm] = useState({ amount: '', date: todayISO(), method: 'Bank Transfer', type: types[0].value, note: '', rate: '' });
      const [saving, setSaving] = useState(false);
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const submit = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  await onAdd({ ...form, amount: Number(form.amount), rate: foreign ? Number(form.rate) || rate : undefined });
                  setForm({ ...form, amount: '', note: '', rate: '' });
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-300">Payments</h3>
                  {payments.length === 0 ? (
                        <p className="text-sm text-gray-500">No payments recorded yet.</p>
                  ) : (
                        <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800">
                              {payments.map((p) => (
                                    <li key={p._id} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                                          <div>
                                                <span className="font-semibold text-emerald-400">{money(p.amount, currency)}</span>
                                                <span className="ml-2 text-gray-400">
                                                      {foreign && <>= {money(p.amount * p.rate)} @ {p.rate} · </>}
                                                      {p.date} · {p.method} · <span className="capitalize">{p.type}</span>
                                                      {p.note ? ` · ${p.note}` : ''}
                                                </span>
                                          </div>
                                          <button onClick={() => onRemove(p)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                    </li>
                              ))}
                        </ul>
                  )}
                  {canPay && balance > 0 && (
                        <form onSubmit={submit} className="grid grid-cols-2 gap-3 rounded-lg border border-gray-800 p-4 md:grid-cols-5">
                              <Field label={`Amount (due ${money(balance, currency)})`} className="col-span-2">
                                    <input required type="number" min="0.01" step="0.01" max={balance} className={input} value={form.amount} onChange={set('amount')} />
                              </Field>
                              <Field label="Date"><input required type="date" className={input} value={form.date} onChange={set('date')} /></Field>
                              <Field label="Type">
                                    <select className={input} value={form.type} onChange={set('type')}>
                                          {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                              </Field>
                              <Field label="Method">
                                    <select className={input} value={form.method} onChange={set('method')}>
                                          {['Cash', 'Bank Transfer', 'bKash', 'Nagad', 'Cheque', 'Card'].map((m) => <option key={m}>{m}</option>)}
                                    </select>
                              </Field>
                              {foreign && (
                                    <Field label={`Rate today (BDT per 1 ${currency})`} className="col-span-2">
                                          <input type="number" min="0" step="any" className={input} value={form.rate} onChange={set('rate')} placeholder={`Invoice rate ${rate}`} />
                                    </Field>
                              )}
                              <Field label="Note" className="col-span-2 md:col-span-4">
                                    <input className={input} value={form.note} onChange={set('note')} placeholder="Reference, txn id…" />
                              </Field>
                              <div className="flex items-end">
                                    <button disabled={saving} className={`${btnPrimary} w-full`}>{saving ? 'Saving…' : 'Record'}</button>
                              </div>
                        </form>
                  )}
            </div>
      );
}
