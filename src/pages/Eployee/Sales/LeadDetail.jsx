import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, CheckCircle2, Loader2, LocateFixed, MapPin, Pencil, Phone, Mail, Trash2, TriangleAlert, X } from 'lucide-react';
import Swal from 'sweetalert2';
import uploadImage from '../../../Hook/ImageUpload';
import { Empty, Field, Modal, btnGhost, btnPrimary, card, confirm, input, toastError } from '../Invoice/ui';
import { api } from './api';
import { OUTCOMES, STAGES, bdt, fmtWhen, mapUrl, stageOf } from './constants';
import LeadForm from './LeadForm';
import { useLiveGps } from './gps';
import { promptDialog } from '../../../Hook/confirmDialog';

function GpsBadge({ gps }) {
      return gps ? (
            <a href={mapUrl(gps)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25">
                  <MapPin size={12} /> {gps.lat.toFixed(5)}, {gps.lng.toFixed(5)}{gps.accuracy ? ` · ±${gps.accuracy}m` : ''}
            </a>
      ) : <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-300"><TriangleAlert size={12} /> No location</span>;
}

function VisitForm({ lead, onSaved }) {
      const { status, gps, error, locate, approximate } = useLiveGps();
      const [f, setF] = useState({ purpose: '', outcome: '', notes: '', nextFollowUp: lead.nextFollowUp || '', stage: lead.stage });
      const [files, setFiles] = useState([]);
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const save = useMutation({
            mutationFn: async () => {
                  const photos = (await Promise.all(files.map(uploadImage))).filter(Boolean);
                  if (files.length && photos.length !== files.length) throw new Error('A photo failed to upload. Try again.');
                  return api(`/leads/${lead._id}/visits`, { method: 'POST', body: { ...f, photos, gps } });
            },
            onSuccess: () => { Swal.fire({ icon: 'success', title: 'Visit saved', timer: 1200, showConfirmButton: false }); onSaved(); },
            onError: toastError,
      });
      return (
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className={`${card} space-y-4 p-5`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">Log a visit</h3>
                        <div className="flex items-center gap-2 text-xs">
                              {status === 'locating' && <span className="inline-flex items-center gap-1.5 text-gray-400"><Loader2 size={13} className="animate-spin" /> Getting your location…</span>}
                              {status === 'ok' && <span className="inline-flex items-center gap-1.5 text-emerald-300"><CheckCircle2 size={13} /> {approximate ? 'Approximate location' : 'Location captured'} ±{Math.round(gps.accuracy)}m</span>}
                              {status === 'error' && <span className="max-w-md text-amber-300">{error}</span>}
                              <button type="button" onClick={locate} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-gray-300 hover:bg-white/10"><LocateFixed size={12} /> Retry</button>
                        </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Purpose"><input className={input} value={f.purpose} onChange={set('purpose')} placeholder="e.g. Product demo" /></Field>
                        <Field label="Outcome">
                              <select className={input} value={f.outcome} onChange={set('outcome')}>
                                    <option value="">Select…</option>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}
                              </select>
                        </Field>
                  </div>
                  <Field label="Notes"><textarea rows={3} className={input} value={f.notes} onChange={set('notes')} placeholder="What was discussed?" /></Field>
                  <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Photos</p>
                        <div className="flex flex-wrap gap-2">
                              {files.map((file, i) => (
                                    <span key={i} className="relative">
                                          <img src={URL.createObjectURL(file)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                                          <button type="button" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))} className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5" aria-label="Remove photo"><X size={12} /></button>
                                    </span>
                              ))}
                              {files.length < 6 && (
                                    <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 text-gray-400 hover:border-blue-500/60">
                                          <Camera size={18} /><span className="text-[10px]">Add</span>
                                          <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => setFiles((l) => [...l, ...Array.from(e.target.files)].slice(0, 6))} />
                                    </label>
                              )}
                        </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Move deal to">
                              <select className={input} value={f.stage} onChange={set('stage')}>{STAGES.filter((s) => s.id !== 'lost').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
                        </Field>
                        <Field label="Next follow-up"><input type="date" className={input} value={f.nextFollowUp} onChange={set('nextFollowUp')} /></Field>
                  </div>
                  <button className={`${btnPrimary} w-full`} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save visit'}</button>
                  {status !== 'ok' && <p className="text-xs text-amber-300">Without a location this visit will show “No location” to your manager.</p>}
            </form>
      );
}

function Timeline({ visits, canDelete, onDelete }) {
      if (!visits.length) return <Empty>No visits logged yet.</Empty>;
      return (
            <ol className="space-y-3">
                  {visits.map((v) => (
                        <li key={v._id} className={`${card} space-y-2 p-4`}>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm font-semibold">{v.purpose || 'Visit'}{v.outcome && <span className="ml-2 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-300">{v.outcome}</span>}</p>
                                    <span className="text-xs text-gray-400">{fmtWhen(v.at)} · {v.userName}</span>
                              </div>
                              {v.notes && <p className="whitespace-pre-wrap text-sm text-gray-300">{v.notes}</p>}
                              {v.photos?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                          {v.photos.map((p) => <a key={p} href={p} target="_blank" rel="noreferrer"><img src={p} alt="Visit" loading="lazy" className="h-20 w-20 rounded-lg object-cover transition hover:opacity-80" /></a>)}
                                    </div>
                              )}
                              <div className="flex items-center justify-between">
                                    <GpsBadge gps={v.gps} />
                                    {canDelete(v) && <button onClick={() => onDelete(v)} className="text-xs text-red-400 hover:text-red-300" aria-label="Delete visit"><Trash2 size={14} /></button>}
                              </div>
                        </li>
                  ))}
            </ol>
      );
}

export default function LeadDetail({ id, me, admin, onClose }) {
      const qc = useQueryClient();
      const [editing, setEditing] = useState(false);
      const { data: lead, error, refetch } = useQuery({ queryKey: ['sales-lead', id], queryFn: () => api(`/leads/${id}`) });
      const refresh = () => { refetch(); qc.invalidateQueries({ queryKey: ['sales-leads'] }); qc.invalidateQueries({ queryKey: ['sales-summary'] }); qc.invalidateQueries({ queryKey: ['sales-visits'] }); qc.invalidateQueries({ queryKey: ['sales-monitor'] }); };

      const move = useMutation({
            mutationFn: async (stage) => {
                  let lostReason;
                  if (stage === 'lost') {
                        const reason = await promptDialog({ title: 'Why was this deal lost?', label: 'Reason', placeholder: 'What happened?', requiredMessage: 'A reason helps the team learn', confirmText: 'Mark lost', tone: 'danger' });
                        if (reason === null) return null;
                        lostReason = reason;
                  }
                  return api(`/leads/${id}`, { method: 'PUT', body: { stage, lostReason } });
            },
            onSuccess: refresh,
            onError: toastError,
      });
      const remove = useMutation({ mutationFn: () => api(`/leads/${id}`, { method: 'DELETE' }), onSuccess: () => { refresh(); onClose(); }, onError: toastError });
      const delVisit = useMutation({ mutationFn: (v) => api(`/visits/${v._id}`, { method: 'DELETE' }), onSuccess: refresh, onError: toastError });

      if (error) return <Modal title="Lead" onClose={onClose}><Empty>{error.message}</Empty></Modal>;
      if (!lead) return <Modal title="Lead" onClose={onClose}><Empty>Loading…</Empty></Modal>;
      const st = stageOf(lead.stage);

      return (
            <Modal title={lead.company || lead.contactName} onClose={onClose} wide>
                  <div className="grid gap-6 lg:grid-cols-5">
                        <div className="space-y-5 lg:col-span-2">
                              <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                          <select value={lead.stage} onChange={(e) => move.mutate(e.target.value)} className={`rounded-full border border-white/10 bg-transparent px-3 py-1.5 text-sm font-semibold ${st.tone}`}>
                                                {STAGES.map((s) => <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.label}</option>)}
                                          </select>
                                          <b className="text-lg tabular-nums">{bdt(lead.value)}</b>
                                    </div>
                                    {lead.stage === 'lost' && lead.lostReason && <p className="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-300">Lost: {lead.lostReason}</p>}
                                    <dl className="space-y-1.5 text-sm">
                                          {lead.contactName && <div><dt className="inline text-gray-500">Contact: </dt><dd className="inline">{lead.contactName}{lead.designation ? `, ${lead.designation}` : ''}</dd></div>}
                                          {lead.interest && <div><dt className="inline text-gray-500">Interested in: </dt><dd className="inline">{lead.interest}</dd></div>}
                                          {lead.address && <div><dt className="inline text-gray-500">Address: </dt><dd className="inline">{lead.address}</dd></div>}
                                          <div><dt className="inline text-gray-500">Source: </dt><dd className="inline capitalize">{lead.source}</dd></div>
                                          {lead.nextFollowUp && <div><dt className="inline text-gray-500">Next follow-up: </dt><dd className="inline font-medium text-amber-300">{lead.nextFollowUp}</dd></div>}
                                          {admin && <div><dt className="inline text-gray-500">Owner: </dt><dd className="inline">{lead.ownerName}</dd></div>}
                                    </dl>
                                    <div className="flex flex-wrap gap-2">
                                          {lead.phone && <a href={`tel:${lead.phone}`} className={btnGhost}><Phone size={14} /> {lead.phone}</a>}
                                          {lead.email && <a href={`mailto:${lead.email}`} className={btnGhost}><Mail size={14} /> Email</a>}
                                    </div>
                                    {lead.notes && <p className="whitespace-pre-wrap rounded-xl border border-white/10 p-3 text-sm text-gray-300">{lead.notes}</p>}
                              </div>

                              {lead.cardImage ? (
                                    <a href={lead.cardImage} target="_blank" rel="noreferrer" className={`${card} block overflow-hidden`} title="Open visiting card">
                                          <img src={lead.cardImage} alt="Visiting card" className="w-full object-contain" />
                                    </a>
                              ) : <p className="text-sm text-gray-500">No visiting card photo. Edit the lead to add one.</p>}

                              {lead.history?.length > 1 && (
                                    <details className="text-sm text-gray-400">
                                          <summary className="cursor-pointer text-gray-300">Stage history</summary>
                                          <ul className="mt-2 space-y-1">{[...lead.history].reverse().map((h, i) => <li key={i}>{fmtWhen(h.at)} · {h.from ? `${stageOf(h.from).label} → ` : ''}{stageOf(h.to).label} · {h.by}</li>)}</ul>
                                    </details>
                              )}

                              <div className="flex gap-2">
                                    <button className={btnGhost} onClick={() => setEditing(true)}><Pencil size={14} /> Edit</button>
                                    <button className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/15" onClick={async () => (await confirm(`Delete ${lead.company || lead.contactName} and all its visits?`, 'Delete')) && remove.mutate()}><Trash2 size={14} /> Delete</button>
                              </div>
                        </div>

                        <div className="space-y-5 lg:col-span-3">
                              {lead.stage !== 'won' && lead.stage !== 'lost' && <VisitForm lead={lead} onSaved={refresh} />}
                              <h3 className="font-semibold">Visits ({lead.visits.length})</h3>
                              <Timeline visits={lead.visits} canDelete={(v) => admin || v.userId === me} onDelete={async (v) => (await confirm('Delete this visit?', 'Delete')) && delVisit.mutate(v)} />
                        </div>
                  </div>
                  {editing && <LeadForm lead={lead} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); refresh(); }} />}
            </Modal>
      );
}
