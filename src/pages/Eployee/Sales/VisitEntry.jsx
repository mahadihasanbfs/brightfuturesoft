import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Camera, CheckCircle2, Loader2, LocateFixed, Radio, TriangleAlert, X } from 'lucide-react';
import Swal from 'sweetalert2';
import uploadImage from '../../../Hook/ImageUpload';
import { Field, Modal, btnGhost, btnPrimary, card, input, toastError } from '../Invoice/ui';
import { api } from './api';
import { OUTCOMES, STAGES, mapUrl } from './constants';
import { accuracyLabel, useLiveGps } from './gps';
import MapView from './MapView';

const ago = (ms) => (ms ? `${Math.max(0, Math.round((Date.now() - ms) / 1000))}s ago` : '');

// Field entry in one screen: live location, who you met (existing lead or a new prospect with their card), photos, notes.
export default function VisitEntry({ onClose, onSaved }) {
      const qc = useQueryClient();
      const { status, gps, error, locate, updatedAt, approximate } = useLiveGps();
      const { data: leads = [] } = useQuery({ queryKey: ['sales-leads'], queryFn: () => api('/leads') });
      const [mode, setMode] = useState('existing');
      const [leadId, setLeadId] = useState('');
      const [filter, setFilter] = useState('');
      const [p, setP] = useState({ company: '', contactName: '', phone: '', email: '', interest: '' });
      const [card_, setCard] = useState(null);
      const [photos, setPhotos] = useState([]);
      const [f, setF] = useState({ purpose: '', outcome: '', notes: '', stage: '', nextFollowUp: '' });
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const setPr = (k) => (e) => setP((x) => ({ ...x, [k]: e.target.value }));
      const cardPreview = useMemo(() => (card_ ? URL.createObjectURL(card_) : ''), [card_]);

      const matches = leads.filter((l) => !['won', 'lost'].includes(l.stage) && `${l.company} ${l.contactName}`.toLowerCase().includes(filter.trim().toLowerCase())).slice(0, 8);
      const chosen = leads.find((l) => l._id === leadId);

      const save = useMutation({
            mutationFn: async () => {
                  if (mode === 'existing' && !leadId) throw new Error('Pick the lead you visited');
                  if (mode === 'new' && !p.company.trim() && !p.contactName.trim()) throw new Error("Give the prospect's company or contact name");
                  const uploads = await Promise.all(photos.map(uploadImage));
                  if (uploads.some((u) => !u)) throw new Error('A photo failed to upload. Try again.');
                  let cardImage = '';
                  if (mode === 'new' && card_) {
                        cardImage = await uploadImage(card_);
                        if (!cardImage) throw new Error('Visiting card upload failed. Try again.');
                  }
                  return api('/visits', { method: 'POST', body: { ...f, stage: f.stage || undefined, photos: uploads, gps, ...(mode === 'existing' ? { leadId } : { newLead: { ...p, cardImage, source: 'walk-in' } }) } });
            },
            onSuccess: (visit) => {
                  ['sales-leads', 'sales-summary', 'sales-visits', 'sales-monitor'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
                  Swal.fire({ icon: 'success', title: 'Visit saved', text: gps ? `Location recorded for ${visit.company}.` : 'Saved without a location.', timer: 1600, showConfirmButton: false });
                  onSaved?.(visit);
                  onClose();
            },
            onError: toastError,
      });

      return (
            <Modal title="New visit" onClose={onClose} wide>
                  <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-6">
                        <section className={`${card} space-y-3 p-4`}>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="flex items-center gap-2 font-semibold"><Radio size={16} className={status === 'ok' ? 'text-emerald-400' : 'text-gray-500'} /> Live location</h3>
                                    <div className="flex items-center gap-2 text-xs">
                                          {status === 'locating' && <span className="inline-flex items-center gap-1.5 text-gray-400"><Loader2 size={13} className="animate-spin" /> Getting a fix…</span>}
                                          {status === 'ok' && gps && <span className={`inline-flex items-center gap-1.5 ${gps.accuracy <= 100 ? 'text-emerald-300' : 'text-amber-300'}`}><CheckCircle2 size={13} /> {accuracyLabel(gps.accuracy, approximate)} · ±{Math.round(gps.accuracy)}m · {ago(updatedAt)}</span>}
                                          {status === 'error' && <span className="max-w-md text-amber-300">{error}</span>}
                                          <button type="button" onClick={locate} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-gray-300 hover:bg-white/10"><LocateFixed size={12} /> Refresh</button>
                                    </div>
                              </div>
                              {gps ? (
                                    <>
                                          <MapView points={[{ lat: gps.lat, lng: gps.lng, label: 'You are here' }]} height={200} live />
                                          <p className="text-xs text-gray-400">{gps.lat.toFixed(6)}, {gps.lng.toFixed(6)} · <a href={mapUrl(gps)} target="_blank" rel="noreferrer" className="text-blue-300 hover:underline">Open in Google Maps</a>. The reading keeps updating until you save.</p>
                                          {gps.accuracy > 100 && <p className="flex items-center gap-1.5 text-xs text-amber-300"><TriangleAlert size={12} /> {approximate ? 'Approximate location from Wi-Fi or network, not GPS. It is saved as is; use a phone outdoors for a precise fix.' : 'Weak accuracy. Step outside or near a window for a better fix.'}</p>}
                                    </>
                              ) : <p className="text-sm text-gray-500">The map appears as soon as your device shares its location.</p>}
                        </section>

                        <section className="space-y-4">
                              <div className="flex gap-1 rounded-xl border border-white/10 p-1 sm:w-fit">
                                    {[['existing', 'Existing lead'], ['new', 'New prospect']].map(([k, label]) => (
                                          <button type="button" key={k} onClick={() => setMode(k)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${mode === k ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>{label}</button>
                                    ))}
                              </div>
                              {mode === 'existing' ? (
                                    <div className="space-y-2">
                                          <input className={input} placeholder="Search your leads by company or contact…" value={chosen ? chosen.company || chosen.contactName : filter} onChange={(e) => { setLeadId(''); setFilter(e.target.value); }} />
                                          {!chosen && matches.length > 0 && (
                                                <ul className="max-h-48 overflow-y-auto rounded-xl border border-white/10">
                                                      {matches.map((l) => (
                                                            <li key={l._id}><button type="button" onClick={() => setLeadId(l._id)} className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-white/5"><span className="truncate font-medium">{l.company || l.contactName}</span><span className="text-xs text-gray-500">{l.contactName}</span></button></li>
                                                      ))}
                                                </ul>
                                          )}
                                          {!chosen && leads.length === 0 && <p className="text-sm text-gray-500">No leads yet. Use “New prospect” to add one on the spot.</p>}
                                    </div>
                              ) : (
                                    <div className="grid gap-5 md:grid-cols-3">
                                          <div>
                                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Visiting card</p>
                                                <label className="group relative flex aspect-[16/10] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/15 text-center hover:border-blue-500/60">
                                                      {cardPreview ? <img src={cardPreview} alt="Visiting card" className="absolute inset-0 h-full w-full object-contain" /> : <div className="px-3 text-sm text-gray-400"><Camera className="mx-auto mb-2" size={26} />Photograph their card</div>}
                                                      <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => setCard(e.target.files[0] || null)} />
                                                </label>
                                          </div>
                                          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                                                <Field label="Company"><input className={input} value={p.company} onChange={setPr('company')} /></Field>
                                                <Field label="Contact person"><input className={input} value={p.contactName} onChange={setPr('contactName')} /></Field>
                                                <Field label="Phone"><input className={input} value={p.phone} onChange={setPr('phone')} /></Field>
                                                <Field label="Interested in"><input className={input} value={p.interest} onChange={setPr('interest')} placeholder="e.g. POS, ERP" /></Field>
                                          </div>
                                    </div>
                              )}
                        </section>

                        <section className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Purpose"><input className={input} value={f.purpose} onChange={set('purpose')} placeholder="e.g. Product demo" /></Field>
                                    <Field label="Outcome"><select className={input} value={f.outcome} onChange={set('outcome')}><option value="">Select…</option>{OUTCOMES.map((o) => <option key={o}>{o}</option>)}</select></Field>
                              </div>
                              <Field label="Notes"><textarea rows={3} className={input} value={f.notes} onChange={set('notes')} placeholder="What was discussed?" /></Field>
                              <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Visit photos</p>
                                    <div className="flex flex-wrap gap-2">
                                          {photos.map((file, i) => (
                                                <span key={i} className="relative">
                                                      <img src={URL.createObjectURL(file)} alt="" className="h-16 w-16 rounded-lg object-cover" />
                                                      <button type="button" onClick={() => setPhotos((l) => l.filter((_, j) => j !== i))} className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5" aria-label="Remove photo"><X size={12} /></button>
                                                </span>
                                          ))}
                                          {photos.length < 6 && (
                                                <label className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/15 text-gray-400 hover:border-blue-500/60">
                                                      <Camera size={18} /><span className="text-[10px]">Add</span>
                                                      <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => setPhotos((l) => [...l, ...Array.from(e.target.files)].slice(0, 6))} />
                                                </label>
                                          )}
                                    </div>
                              </div>
                              <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Move deal to"><select className={input} value={f.stage} onChange={set('stage')}><option value="">Keep current stage</option>{STAGES.filter((s) => s.id !== 'lost').map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></Field>
                                    <Field label="Next follow-up"><input type="date" className={input} value={f.nextFollowUp} onChange={set('nextFollowUp')} /></Field>
                              </div>
                        </section>

                        <div className="flex items-center justify-end gap-3">
                              {!gps && <span className="mr-auto text-xs text-amber-300">No location yet. You can still save, but it will show “No location”.</span>}
                              <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                              <button className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save visit'}</button>
                        </div>
                  </form>
            </Modal>
      );
}
