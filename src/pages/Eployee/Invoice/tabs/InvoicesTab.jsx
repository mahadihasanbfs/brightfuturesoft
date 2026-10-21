import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { api } from '../api';
import { money, fmtDate } from '../format';
import { Empty, Row, StatusBadge, Table, Td, input, btnPrimary } from '../ui';
import InvoiceFormModal from '../modal/InvoiceFormModal';
import InvoiceDetailModal from '../modal/InvoiceDetailModal';

const STATUSES = ['all', 'unpaid', 'partial', 'overdue', 'paid', 'draft', 'cancelled'];

export default function InvoicesTab() {
      const qc = useQueryClient();
      const [status, setStatus] = useState('all');
      const [search, setSearch] = useState('');
      const [form, setForm] = useState(null); // null closed, {} new, invoice = edit
      const [selected, setSelected] = useState(null);

      const { data: invoices = [], isLoading, error } = useQuery({ queryKey: ['acc-invoices'], queryFn: () => api('/invoices') });
      const { data: clients = [] } = useQuery({ queryKey: ['acc-clients'], queryFn: () => api('/clients') });

      const refresh = () => {
            qc.invalidateQueries({ queryKey: ['acc-invoices'] });
            qc.invalidateQueries({ queryKey: ['acc-summary'] });
      };

      const rows = invoices.filter((i) => {
            if (status !== 'all' && i.status !== status) return false;
            const q = search.trim().toLowerCase();
            return !q || [i.number, i.client?.name, i.client?.company, i.projectName].some((v) => v?.toLowerCase().includes(q));
      });

      const open = invoices.filter((i) => !['paid', 'draft', 'cancelled'].includes(i.status));
      const dueTotal = open.reduce((t, i) => t + i.balanceBase, 0);
      // Most recent rate used per currency, to prefill new invoices.
      const lastRates = {};
      [...invoices].reverse().forEach((i) => { if (i.currency !== 'BDT') lastRates[i.currency] = i.exchangeRate; });

      if (error) return <Empty>{error.message}</Empty>;

      return (
            <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                        <input className={`${input} max-w-xs`} placeholder="Search number, client, project…" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <select className={`${input} max-w-[10rem] capitalize`} value={status} onChange={(e) => setStatus(e.target.value)}>
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="text-sm text-gray-400">Outstanding (BDT): <b className="text-white">{money(dueTotal)}</b></span>
                        <button onClick={() => setForm({})} className={`${btnPrimary} ml-auto`}><Plus size={16} /> New invoice</button>
                  </div>

                  {isLoading ? <Empty>Loading…</Empty> : rows.length === 0 ? (
                        <Empty>{invoices.length ? 'No invoices match.' : clients.length ? 'No invoices yet. Create the first one.' : 'Add a client first (Clients tab), then create invoices.'}</Empty>
                  ) : (
                        <Table head={['Invoice', 'Client', 'Type', 'Due', 'Total', 'Paid', 'Balance', 'Status']}>
                              {rows.map((i) => (
                                    <Row key={i._id} onClick={() => setSelected(i)}>
                                          <Td className="font-medium">{i.number}</Td>
                                          <Td>{i.client?.name}<div className="text-xs text-gray-500">{i.projectName}</div></Td>
                                          <Td className="capitalize text-gray-400">{i.kind}</Td>
                                          <Td className={i.status === 'overdue' ? 'text-red-400' : 'text-gray-400'}>
                                                {fmtDate(i.dueDate)}
                                                {i.status === 'overdue' && <div className="text-xs">{i.daysOverdue}d late</div>}
                                          </Td>
                                          <Td>{money(i.total, i.currency)}{i.currency !== 'BDT' && <div className="text-xs text-gray-500">{money(i.totalBase)}</div>}</Td>
                                          <Td className="text-emerald-400">{money(i.paid, i.currency)}</Td>
                                          <Td className={i.balance > 0 ? 'font-semibold' : 'text-gray-500'}>{money(i.balance, i.currency)}{i.currency !== 'BDT' && i.balance > 0 && <div className="text-xs text-gray-500">{money(i.balanceBase)}</div>}</Td>
                                          <Td><StatusBadge status={i.status} /></Td>
                                    </Row>
                              ))}
                        </Table>
                  )}

                  {form && (
                        <InvoiceFormModal
                              invoice={form._id ? form : null}
                              clients={clients}
                              lastRates={lastRates}
                              onClose={() => setForm(null)}
                              onSaved={(saved) => {
                                    setForm(null);
                                    refresh();
                                    setSelected(saved);
                              }}
                        />
                  )}
                  {selected && !form && (
                        <InvoiceDetailModal
                              invoice={selected}
                              onClose={() => setSelected(null)}
                              onEdit={(inv) => setForm(inv)}
                              onChanged={(inv) => {
                                    refresh();
                                    setSelected(inv);
                              }}
                        />
                  )}
            </div>
      );
}
