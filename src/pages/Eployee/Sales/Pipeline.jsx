import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { Empty, Row, Table, Td, btnPrimary, card, input, toastError } from '../Invoice/ui';
import { api } from './api';
import { STAGES, bdt, stageOf, today } from './constants';
import LeadForm from './LeadForm';
import { promptDialog } from '../../../Hook/confirmDialog';

const Avatar = ({ name, image }) => image
      ? <img src={image} alt={name} title={name} className="h-6 w-6 rounded-full object-cover" />
      : <span title={name} className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/30 text-[11px] font-semibold text-blue-200">{(name || '?').charAt(0).toUpperCase()}</span>;

function LeadCard({ lead, admin, onOpen }) {
      const overdue = lead.nextFollowUp && lead.nextFollowUp < today() && !['won', 'lost'].includes(lead.stage);
      return (
            <div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', lead._id)} onClick={() => onOpen(lead._id)}
                  className="cursor-pointer space-y-2 rounded-xl border border-white/10 p-3 transition hover:border-white/25 active:cursor-grabbing">
                  <p className="truncate text-sm font-semibold">{lead.company || lead.contactName}</p>
                  {lead.company && lead.contactName && <p className="truncate text-xs text-gray-400">{lead.contactName}</p>}
                  {lead.interest && <p className="truncate text-xs text-gray-500">{lead.interest}</p>}
                  <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold tabular-nums">{bdt(lead.value)}</span>
                        {admin && <Avatar name={lead.ownerName} image={lead.ownerImage} />}
                  </div>
                  {lead.nextFollowUp && <p className={`text-xs ${overdue ? 'font-semibold text-red-400' : 'text-gray-400'}`}>{overdue ? 'Overdue · ' : 'Follow-up · '}{lead.nextFollowUp}</p>}
            </div>
      );
}

export default function Pipeline({ admin, onOpen }) {
      const qc = useQueryClient();
      const [q, setQ] = useState('');
      const [view, setView] = useState('board');
      const [adding, setAdding] = useState(false);
      const [over, setOver] = useState('');
      const { data: leads = [], isPending, error } = useQuery({ queryKey: ['sales-leads'], queryFn: () => api('/leads') });

      const move = useMutation({
            mutationFn: async ({ id, stage }) => {
                  let lostReason;
                  if (stage === 'lost') {
                        const reason = await promptDialog({ title: 'Why was this deal lost?', label: 'Reason', placeholder: 'What happened?', requiredMessage: 'A reason helps the team learn', confirmText: 'Mark lost', tone: 'danger' });
                        if (reason === null) return null;
                        lostReason = reason;
                  }
                  return api(`/leads/${id}`, { method: 'PUT', body: { stage, lostReason } });
            },
            onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales-leads'] }); qc.invalidateQueries({ queryKey: ['sales-summary'] }); },
            onError: toastError,
      });

      const shown = useMemo(() => leads.filter((l) => !q.trim() || `${l.company} ${l.contactName} ${l.phone} ${l.interest}`.toLowerCase().includes(q.trim().toLowerCase())), [leads, q]);

      return (
            <section className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[14rem] flex-1 sm:max-w-sm">
                              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input className={`${input} !pl-9`} placeholder="Search company, contact, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="flex gap-1 rounded-xl border border-white/10 p-1">
                              {[['board', 'Board'], ['list', 'List']].map(([k, label]) => (
                                    <button key={k} onClick={() => setView(k)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view === k ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>{label}</button>
                              ))}
                        </div>
                        <button className={`${btnPrimary} ml-auto`} onClick={() => setAdding(true)}><Plus size={16} /> New lead</button>
                  </div>

                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : leads.length === 0 ? <Empty>No leads yet. Add your first lead, ideally with a photo of their visiting card.</Empty> : view === 'board' ? (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                              {STAGES.map((s) => {
                                    const rows = shown.filter((l) => l.stage === s.id);
                                    return (
                                          <div key={s.id}
                                                onDragOver={(e) => { e.preventDefault(); setOver(s.id); }} onDragLeave={() => setOver('')}
                                                onDrop={(e) => { e.preventDefault(); setOver(''); const id = e.dataTransfer.getData('text/plain'); const lead = leads.find((l) => l._id === id); if (lead && lead.stage !== s.id) move.mutate({ id, stage: s.id }); }}
                                                className={`${card} w-72 shrink-0 space-y-3 p-3 transition ${over === s.id ? 'border-blue-500/60' : ''}`}>
                                                <div className="flex items-center justify-between px-1">
                                                      <h3 className={`text-sm font-semibold ${s.tone}`}>{s.label} <span className="text-gray-500">{rows.length}</span></h3>
                                                      <span className="text-xs tabular-nums text-gray-400">{bdt(rows.reduce((n, l) => n + (l.value || 0), 0))}</span>
                                                </div>
                                                <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                                                      {rows.length === 0 ? <p className="py-6 text-center text-xs text-gray-600">Drop a lead here</p> : rows.map((l) => <LeadCard key={l._id} lead={l} admin={admin} onOpen={onOpen} />)}
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                  ) : (
                        <Table head={['Lead', 'Contact', 'Stage', 'Value', 'Follow-up', ...(admin ? ['Owner'] : [])]}>
                              {shown.map((l) => (
                                    <Row key={l._id} onClick={() => onOpen(l._id)}>
                                          <Td><p className="font-medium">{l.company || l.contactName}</p><p className="text-xs text-gray-500">{l.interest}</p></Td>
                                          <Td className="text-gray-400">{l.contactName}{l.phone ? ` · ${l.phone}` : ''}</Td>
                                          <Td><span className={`font-semibold ${stageOf(l.stage).tone}`}>{stageOf(l.stage).label}</span></Td>
                                          <Td className="tabular-nums">{bdt(l.value)}</Td>
                                          <Td>{l.nextFollowUp || '-'}</Td>
                                          {admin && <Td>{l.ownerName}</Td>}
                                    </Row>
                              ))}
                        </Table>
                  )}
                  {adding && <LeadForm onClose={() => setAdding(false)} onSaved={() => { setAdding(false); qc.invalidateQueries({ queryKey: ['sales-leads'] }); qc.invalidateQueries({ queryKey: ['sales-summary'] }); }} />}
            </section>
      );
}
