import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../api';
import { money } from '../format';
import { Empty, Field, Modal, Row, Table, Td, input, btnPrimary, btnGhost, confirm, toastError } from '../ui';

const blank = { name: '', company: '', email: '', phone: '', address: '', notes: '' };

function ClientForm({ client, onClose, onSaved }) {
      const [form, setForm] = useState(client ? { ...blank, ...client } : blank);
      const [saving, setSaving] = useState(false);
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const submit = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  const body = Object.fromEntries(Object.entries(form).filter(([k]) => k !== '_id' && k !== 'createdAt'));
                  await api(client ? `/clients/${client._id}` : '/clients', { method: client ? 'PUT' : 'POST', body });
                  onSaved();
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal title={client ? 'Edit client' : 'New client'} onClose={onClose}>
                  <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                        <Field label="Name" className="col-span-2"><input required className={input} value={form.name} onChange={set('name')} /></Field>
                        <Field label="Company"><input className={input} value={form.company} onChange={set('company')} /></Field>
                        <Field label="Phone"><input className={input} value={form.phone} onChange={set('phone')} /></Field>
                        <Field label="Email" className="col-span-2"><input type="email" className={input} value={form.email} onChange={set('email')} /></Field>
                        <Field label="Address" className="col-span-2"><textarea rows={2} className={input} value={form.address} onChange={set('address')} /></Field>
                        <Field label="Notes" className="col-span-2"><textarea rows={2} className={input} value={form.notes} onChange={set('notes')} /></Field>
                        <div className="col-span-2 flex justify-end gap-3">
                              <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
                              <button disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save'}</button>
                        </div>
                  </form>
            </Modal>
      );
}

export default function ClientsTab() {
      const qc = useQueryClient();
      const [form, setForm] = useState(null);
      const { data: clients = [], isLoading, error } = useQuery({ queryKey: ['acc-clients'], queryFn: () => api('/clients') });
      const { data: invoices = [] } = useQuery({ queryKey: ['acc-invoices'], queryFn: () => api('/invoices') });

      const refresh = () => qc.invalidateQueries({ queryKey: ['acc-clients'] });

      const stats = (id) => {
            const mine = invoices.filter((i) => i.clientId === id && !['draft', 'cancelled'].includes(i.status));
            return {
                  billed: mine.reduce((t, i) => t + i.totalBase, 0),
                  due: mine.reduce((t, i) => t + i.balanceBase, 0),
                  overdue: mine.filter((i) => i.status === 'overdue').reduce((t, i) => t + i.balanceBase, 0),
            };
      };

      const remove = async (c) => {
            if (!(await confirm(`Delete ${c.name}?`, 'Delete'))) return;
            try {
                  await api(`/clients/${c._id}`, { method: 'DELETE' });
                  refresh();
            } catch (err) {
                  toastError(err);
            }
      };

      if (error) return <Empty>{error.message}</Empty>;

      return (
            <div className="space-y-5">
                  <div className="flex justify-end">
                        <button onClick={() => setForm({})} className={btnPrimary}><Plus size={16} /> New client</button>
                  </div>
                  {isLoading ? <Empty>Loading…</Empty> : clients.length === 0 ? <Empty>No clients yet.</Empty> : (
                        <Table head={['Client', 'Contact', 'Billed', 'Due', 'Overdue', '']}>
                              {clients.map((c) => {
                                    const s = stats(c._id);
                                    return (
                                          <Row key={c._id}>
                                                <Td className="font-medium">{c.name}<div className="text-xs text-gray-500">{c.company}</div></Td>
                                                <Td className="text-gray-400">{c.email}<div className="text-xs">{c.phone}</div></Td>
                                                <Td>{money(s.billed)}</Td>
                                                <Td>{money(s.due)}</Td>
                                                <Td className={s.overdue > 0 ? 'text-red-400' : 'text-gray-500'}>{money(s.overdue)}</Td>
                                                <Td className="text-right">
                                                      <button onClick={() => setForm(c)} className="mr-3 text-gray-400 hover:text-white" aria-label="Edit"><Pencil size={16} /></button>
                                                      <button onClick={() => remove(c)} className="text-gray-400 hover:text-red-400" aria-label="Delete"><Trash2 size={16} /></button>
                                                </Td>
                                          </Row>
                                    );
                              })}
                        </Table>
                  )}
                  {form && (
                        <ClientForm
                              client={form._id ? form : null}
                              onClose={() => setForm(null)}
                              onSaved={() => { setForm(null); refresh(); }}
                        />
                  )}
            </div>
      );
}
