import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera } from 'lucide-react';
import uploadImage from '../../../Hook/ImageUpload';
import { Field, Modal, btnGhost, btnPrimary, input, toastError } from '../Invoice/ui';
import { api } from './api';
import { SOURCES } from './constants';

// Create or edit a lead. The visiting card photo is uploaded first and its link is saved on the lead.
export default function LeadForm({ lead, onClose, onSaved }) {
      const [f, setF] = useState({
            company: lead?.company || '', contactName: lead?.contactName || '', designation: lead?.designation || '', phone: lead?.phone || '', email: lead?.email || '',
            address: lead?.address || '', interest: lead?.interest || '', value: lead?.value || '', source: lead?.source || 'walk-in', nextFollowUp: lead?.nextFollowUp || '', notes: lead?.notes || '',
      });
      const [file, setFile] = useState(null);
      const preview = useMemo(() => (file ? URL.createObjectURL(file) : lead?.cardImage || ''), [file, lead]);
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const save = useMutation({
            mutationFn: async () => {
                  let cardImage = lead?.cardImage || '';
                  if (file) {
                        cardImage = await uploadImage(file);
                        if (!cardImage) throw new Error('Visiting card upload failed. Try again.');
                  }
                  const body = { ...f, value: Number(f.value) || 0, cardImage };
                  return lead ? api(`/leads/${lead._id}`, { method: 'PUT', body }) : api('/leads', { method: 'POST', body });
            },
            onSuccess: onSaved,
            onError: toastError,
      });
      return (
            <Modal title={lead ? 'Edit lead' : 'New lead'} onClose={onClose} wide>
                  <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-3">
                              <div>
                                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Visiting card</p>
                                    <label className="group relative flex aspect-[16/10] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/15 text-center transition hover:border-blue-500/60">
                                          {preview ? (
                                                <>
                                                      <img src={preview} alt="Visiting card" className="absolute inset-0 h-full w-full object-contain" />
                                                      <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-semibold opacity-0 transition group-hover:opacity-100">Replace photo</span>
                                                </>
                                          ) : (
                                                <div className="px-3 text-sm text-gray-400"><Camera className="mx-auto mb-2" size={26} />Take or upload a photo of their card</div>
                                          )}
                                          <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => setFile(e.target.files[0] || null)} />
                                    </label>
                              </div>
                              <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
                                    <Field label="Company"><input className={input} value={f.company} onChange={set('company')} /></Field>
                                    <Field label="Contact person"><input className={input} value={f.contactName} onChange={set('contactName')} /></Field>
                                    <Field label="Their designation"><input className={input} value={f.designation} onChange={set('designation')} /></Field>
                                    <Field label="Phone"><input className={input} value={f.phone} onChange={set('phone')} /></Field>
                                    <Field label="Email"><input type="email" className={input} value={f.email} onChange={set('email')} /></Field>
                                    <Field label="Source">
                                          <select className={`${input} capitalize`} value={f.source} onChange={set('source')}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
                                    </Field>
                              </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                              <Field label="Software / product interested in"><input className={input} value={f.interest} onChange={set('interest')} placeholder="e.g. POS, ERP, custom web app" /></Field>
                              <Field label="Deal value (BDT)"><input inputMode="decimal" className={input} value={f.value} onChange={set('value')} /></Field>
                              <Field label="Next follow-up"><input type="date" className={input} value={f.nextFollowUp} onChange={set('nextFollowUp')} /></Field>
                        </div>
                        <Field label="Address"><input className={input} value={f.address} onChange={set('address')} /></Field>
                        <Field label="Notes"><textarea rows={3} className={input} value={f.notes} onChange={set('notes')} /></Field>
                        <div className="flex justify-end gap-3">
                              <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                              <button className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Saving…' : lead ? 'Save changes' : 'Add lead'}</button>
                        </div>
                  </form>
            </Modal>
      );
}
