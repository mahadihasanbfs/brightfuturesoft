import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api';
import { addDays, BASE_CURRENCY, CURRENCIES, money, todayISO } from '../format';
import { Modal, Field, input, btnPrimary, btnGhost, toastError } from '../ui';

const blankItem = { description: '', qty: 1, rate: '' };

export default function InvoiceFormModal({ invoice, clients, lastRates = {}, onClose, onSaved }) {
      const editing = Boolean(invoice);
      const [form, setForm] = useState(() => ({
            clientId: invoice?.clientId || '',
            kind: invoice?.kind || 'project',
            projectName: invoice?.projectName || '',
            currency: invoice?.currency || BASE_CURRENCY,
            exchangeRate: invoice?.currency && invoice.currency !== BASE_CURRENCY ? invoice.exchangeRate : '',
            issueDate: invoice?.issueDate || todayISO(),
            dueDate: invoice?.dueDate || addDays(todayISO(), 7),
            periodFrom: invoice?.periodFrom || '',
            periodTo: invoice?.periodTo || '',
            items: invoice?.items?.map(({ description, qty, rate }) => ({ description, qty, rate })) || [{ ...blankItem }],
            discount: invoice?.discount || 0,
            taxPercent: invoice?.taxPercent || 0,
            notes: invoice?.notes || '',
            terms: invoice?.terms ?? 'Payment due by the due date. Late payment may delay ongoing work and maintenance.',
            draft: invoice?.draft || false,
            advance: '',
      }));
      const [saving, setSaving] = useState(false);
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const setItem = (i, k, v) =>
            setForm({ ...form, items: form.items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)) });

      const subtotal = form.items.reduce((t, it) => t + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0);
      const discount = Math.min(Number(form.discount) || 0, subtotal);
      const tax = ((subtotal - discount) * (Number(form.taxPercent) || 0)) / 100;
      const total = subtotal - discount + tax;
      const foreign = form.currency !== BASE_CURRENCY;
      const hasPayments = Boolean(invoice?.payments?.length);

      const pickCurrency = (e) => {
            const currency = e.target.value;
            setForm({ ...form, currency, exchangeRate: currency === BASE_CURRENCY ? '' : form.exchangeRate || lastRates[currency] || '' });
      };

      const submit = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  const { advance, ...payload } = form;
                  payload.items = payload.items
                        .filter((it) => it.description.trim())
                        .map((it) => ({ ...it, qty: Number(it.qty) || 1, rate: Number(it.rate) || 0 }));
                  payload.discount = Number(payload.discount) || 0;
                  payload.taxPercent = Number(payload.taxPercent) || 0;
                  payload.exchangeRate = foreign ? Number(payload.exchangeRate) : 1;

                  let saved;
                  if (editing) {
                        saved = await api(`/invoices/${invoice._id}`, { method: 'PUT', body: payload });
                  } else {
                        saved = await api('/invoices', { method: 'POST', body: payload });
                        if (Number(advance) > 0 && !payload.draft) {
                              saved = await api(`/invoices/${saved._id}/payments`, {
                                    method: 'POST',
                                    body: { amount: Number(advance), type: 'advance', method: 'Bank Transfer', note: 'Advance at invoicing' },
                              });
                        }
                  }
                  onSaved(saved);
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal title={editing ? `Edit ${invoice.number}` : 'New invoice'} onClose={onClose} wide>
                  <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <Field label="Client">
                                    <select required className={input} value={form.clientId} onChange={set('clientId')}>
                                          <option value="">Select client…</option>
                                          {clients.map((c) => <option key={c._id} value={c._id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>)}
                                    </select>
                              </Field>
                              <Field label="Type">
                                    <select className={input} value={form.kind} onChange={set('kind')}>
                                          <option value="project">Project</option>
                                          <option value="maintenance">Maintenance</option>
                                          <option value="extra">Extra work</option>
                                    </select>
                              </Field>
                              <Field label="Currency">
                                    <select disabled={hasPayments} className={input} value={form.currency} onChange={pickCurrency}>
                                          {Object.keys(CURRENCIES).map((c) => <option key={c} value={c}>{c} {CURRENCIES[c]}</option>)}
                                    </select>
                              </Field>
                              {foreign && (
                                    <Field label={`Exchange rate (BDT per 1 ${form.currency})`}>
                                          <input required type="number" min="0" step="any" className={input} value={form.exchangeRate} onChange={set('exchangeRate')} placeholder="e.g. 122.50" />
                                    </Field>
                              )}
                              <Field label="Project / reference">
                                    <input className={input} value={form.projectName} onChange={set('projectName')} />
                              </Field>
                              <Field label="Issue date"><input required type="date" className={input} value={form.issueDate} onChange={set('issueDate')} /></Field>
                              <Field label="Due date"><input required type="date" className={input} value={form.dueDate} onChange={set('dueDate')} /></Field>
                              {form.kind === 'maintenance' && (
                                    <div className="grid grid-cols-2 gap-2">
                                          <Field label="Period from"><input type="date" className={input} value={form.periodFrom} onChange={set('periodFrom')} /></Field>
                                          <Field label="Period to"><input type="date" className={input} value={form.periodTo} onChange={set('periodTo')} /></Field>
                                    </div>
                              )}
                        </div>

                        <div>
                              <p className="mb-2 text-xs font-medium text-gray-400">Items</p>
                              <div className="space-y-2">
                                    {form.items.map((it, i) => (
                                          <div key={i} className="grid grid-cols-12 gap-2">
                                                <input required placeholder="Description" className={`${input} col-span-6`} value={it.description} onChange={(e) => setItem(i, 'description', e.target.value)} />
                                                <input type="number" min="0" step="any" placeholder="Qty" className={`${input} col-span-2`} value={it.qty} onChange={(e) => setItem(i, 'qty', e.target.value)} />
                                                <input required type="number" min="0" step="any" placeholder="Rate" className={`${input} col-span-3`} value={it.rate} onChange={(e) => setItem(i, 'rate', e.target.value)} />
                                                <button type="button" disabled={form.items.length === 1} onClick={() => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })} className="col-span-1 text-gray-500 hover:text-red-400 disabled:opacity-30" aria-label="Remove item">
                                                      <Trash2 size={16} />
                                                </button>
                                          </div>
                                    ))}
                              </div>
                              <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { ...blankItem }] })} className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                                    <Plus size={14} /> Add item
                              </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              <Field label={`Discount (${form.currency})`}><input type="number" min="0" step="any" className={input} value={form.discount} onChange={set('discount')} /></Field>
                              <Field label="Tax %"><input type="number" min="0" step="any" className={input} value={form.taxPercent} onChange={set('taxPercent')} /></Field>
                              {!editing && (
                                    <Field label={`Advance received now (${form.currency})`} className="col-span-2">
                                          <input type="number" min="0" step="any" className={input} value={form.advance} onChange={set('advance')} disabled={form.draft} />
                                    </Field>
                              )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Field label="Notes"><textarea rows={2} className={input} value={form.notes} onChange={set('notes')} /></Field>
                              <Field label="Terms"><textarea rows={2} className={input} value={form.terms} onChange={set('terms')} /></Field>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-4">
                              <label className="flex items-center gap-2 text-sm text-gray-300">
                                    <input type="checkbox" checked={form.draft} onChange={(e) => setForm({ ...form, draft: e.target.checked })} />
                                    Save as draft (no payments until issued)
                              </label>
                              <div className="text-right text-sm">
                                    <span className="text-gray-400">Total </span>
                                    <span className="text-lg font-bold">{money(total, form.currency)}</span>
                                    {foreign && Number(form.exchangeRate) > 0 && (
                                          <div className="text-xs text-gray-400">= {money(total * Number(form.exchangeRate))}</div>
                                    )}
                              </div>
                        </div>

                        <div className="flex justify-end gap-3">
                              <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
                              <button disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create invoice'}</button>
                        </div>
                  </form>
            </Modal>
      );
}
