import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../api';
import { money, fmtDate, todayISO } from '../format';
import { Empty, Field, Modal, Row, Stat, Table, Td, input, btnPrimary, btnGhost, confirm, toastError } from '../ui';

const CATEGORIES = ['Office rent', 'Utilities', 'Internet', 'Software / SaaS', 'Hosting / Domain', 'Marketing', 'Equipment', 'Travel', 'Food / Entertainment', 'Tax / Govt fee', 'Other'];

function ExpenseForm({ expense, onClose, onSaved }) {
      const [form, setForm] = useState(() => ({
            title: expense?.title || '',
            category: expense?.category || CATEGORIES[0],
            amount: expense?.amount || '',
            date: expense?.date || todayISO(),
            vendor: expense?.vendor || '',
            method: expense?.method || 'Cash',
            notes: expense?.notes || '',
      }));
      const [saving, setSaving] = useState(false);
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const submit = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  await api(expense ? `/expenses/${expense._id}` : '/expenses', { method: expense ? 'PUT' : 'POST', body: { ...form, amount: Number(form.amount) } });
                  onSaved();
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal title={expense ? 'Edit expense' : 'New expense'} onClose={onClose}>
                  <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                        <Field label="Title" className="col-span-2"><input required className={input} value={form.title} onChange={set('title')} /></Field>
                        <Field label="Category">
                              <select className={input} value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                        </Field>
                        <Field label="Amount (৳)"><input required type="number" min="0.01" step="any" className={input} value={form.amount} onChange={set('amount')} /></Field>
                        <Field label="Date"><input required type="date" className={input} value={form.date} onChange={set('date')} /></Field>
                        <Field label="Paid via">
                              <select className={input} value={form.method} onChange={set('method')}>{['Cash', 'Bank Transfer', 'bKash', 'Nagad', 'Card', 'Cheque'].map((m) => <option key={m}>{m}</option>)}</select>
                        </Field>
                        <Field label="Vendor" className="col-span-2"><input className={input} value={form.vendor} onChange={set('vendor')} /></Field>
                        <Field label="Notes" className="col-span-2"><textarea rows={2} className={input} value={form.notes} onChange={set('notes')} /></Field>
                        <div className="col-span-2 flex justify-end gap-3">
                              <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
                              <button disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                  </form>
            </Modal>
      );
}

export default function ExpensesTab() {
      const qc = useQueryClient();
      const [form, setForm] = useState(null);
      const [category, setCategory] = useState('all');
      const { data: expenses = [], isLoading, error } = useQuery({ queryKey: ['acc-expenses'], queryFn: () => api('/expenses') });

      const refresh = () => {
            qc.invalidateQueries({ queryKey: ['acc-expenses'] });
            qc.invalidateQueries({ queryKey: ['acc-summary'] });
      };

      const rows = category === 'all' ? expenses : expenses.filter((e) => e.category === category);
      const month = todayISO().slice(0, 7);
      const thisMonthTotal = expenses.filter((e) => e.date.startsWith(month)).reduce((t, e) => t + e.amount, 0);

      const remove = async (e) => {
            if (!(await confirm(`Delete "${e.title}"?`, 'Delete'))) return;
            try {
                  await api(`/expenses/${e._id}`, { method: 'DELETE' });
                  refresh();
            } catch (err) {
                  toastError(err);
            }
      };

      if (error) return <Empty>{error.message}</Empty>;

      return (
            <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                        <select className={`${input} max-w-[14rem]`} value={category} onChange={(e) => setCategory(e.target.value)}>
                              <option value="all">All categories</option>
                              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <button onClick={() => setForm({})} className={`${btnPrimary} ml-auto`}><Plus size={16} /> New expense</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Stat label="This month" value={money(thisMonthTotal)} />
                        <Stat label="Shown total" value={money(rows.reduce((t, e) => t + e.amount, 0))} />
                  </div>
                  {isLoading ? <Empty>Loading…</Empty> : rows.length === 0 ? <Empty>No expenses.</Empty> : (
                        <Table head={['Date', 'Title', 'Category', 'Vendor', 'Amount', '']}>
                              {rows.map((e) => (
                                    <Row key={e._id}>
                                          <Td className="text-gray-400">{fmtDate(e.date)}</Td>
                                          <Td className="font-medium">{e.title}</Td>
                                          <Td className="text-gray-400">{e.category}</Td>
                                          <Td className="text-gray-400">{e.vendor}</Td>
                                          <Td className="font-semibold">{money(e.amount)}</Td>
                                          <Td className="text-right">
                                                <button onClick={() => setForm(e)} className="mr-3 text-gray-400 hover:text-white" aria-label="Edit"><Pencil size={16} /></button>
                                                <button onClick={() => remove(e)} className="text-gray-400 hover:text-red-400" aria-label="Delete"><Trash2 size={16} /></button>
                                          </Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  {form && <ExpenseForm expense={form._id ? form : null} onClose={() => setForm(null)} onSaved={() => { setForm(null); refresh(); }} />}
            </div>
      );
}
