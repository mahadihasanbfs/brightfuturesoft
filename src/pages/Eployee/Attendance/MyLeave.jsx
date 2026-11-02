import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarCheck, CalendarX, Check, CircleDot, Hourglass, Info, Send, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from './api';
import Badge from './Badge';
import { LEAVE_TYPES, localDate } from './format';
import { Empty, Field, btnDanger, btnPrimary, card, confirm, input, toastError } from '../Invoice/ui';

const dayList = (from, to) => {
      const out = [];
      for (let t = Date.parse(from); t <= Date.parse(to); t += 86400000) out.push(new Date(t));
      return out;
};
// Friday and Saturday are the weekend, so they are not leave days.
const workingDays = (from, to) => (from && to && from <= to ? dayList(from, to).filter((d) => ![5, 6].includes(d.getUTCDay())).length : 0);
const fmtDate = (d) => new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });
const fmtStamp = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short' }) : '');

const TYPE_TONE = { casual: 'text-sky-400', sick: 'text-pink-400', annual: 'text-emerald-400', unpaid: 'text-gray-300', other: 'text-violet-400' };

// Requested -> Under review -> Approved / Rejected
function Steps({ l }) {
      const decided = l.status !== 'pending';
      const rejected = l.status === 'rejected';
      const step = (done, tone, Icon, text, sub) => (
            <li className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${done ? tone : 'border-white/10 text-gray-600'}`}><Icon size={13} /></span>
                  <span className={`text-xs ${done ? 'text-gray-200' : 'text-gray-600'}`}>{text}{sub && <span className="text-gray-500"> · {sub}</span>}</span>
            </li>
      );
      return (
            <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {step(true, 'border-emerald-500/40 text-emerald-400', Check, 'Requested', fmtStamp(l.createdAt))}
                  {step(true, decided ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400', decided ? Check : Hourglass, decided ? 'Reviewed' : 'Waiting for approval')}
                  {decided
                        ? step(true, rejected ? 'border-red-500/40 text-red-400' : 'border-emerald-500/40 text-emerald-400', rejected ? X : Check, rejected ? 'Rejected' : 'Approved', [l.decidedByName, fmtStamp(l.decidedAt)].filter(Boolean).join(' · '))
                        : step(false, '', CircleDot, 'Decision')}
            </ol>
      );
}

export default function MyLeave() {
      const qc = useQueryClient();
      const empty = { from: localDate(), to: localDate(), type: 'casual', reason: '' };
      const [form, setForm] = useState(empty);
      const [filter, setFilter] = useState('all');
      const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
      const { data: leaves = [], isPending, error } = useQuery({ queryKey: ['att-my-leaves'], queryFn: () => api('/my-leaves') });

      const done = () => { qc.invalidateQueries({ queryKey: ['att-my-leaves'] }); qc.invalidateQueries({ queryKey: ['att-my'] }); };
      const submit = useMutation({
            mutationFn: () => api('/leaves', { method: 'POST', body: form }),
            onSuccess: () => {
                  setForm(empty); done();
                  Swal.fire({ icon: 'success', title: 'Sent for approval', text: 'It counts as leave only after it is approved.', confirmButtonColor: '#0A65B4' });
            },
            onError: toastError,
      });
      const cancel = useMutation({ mutationFn: (id) => api(`/leaves/${id}`, { method: 'DELETE' }), onSuccess: done, onError: toastError });

      const year = localDate().slice(0, 4);
      const stats = useMemo(() => {
            const inYear = leaves.filter((l) => l.from.startsWith(year));
            const days = (status) => inYear.filter((l) => l.status === status).reduce((n, l) => n + workingDays(l.from, l.to), 0);
            const byType = LEAVE_TYPES.map((t) => [t, inYear.filter((l) => l.status === 'approved' && l.type === t).reduce((n, l) => n + workingDays(l.from, l.to), 0)]).filter(([, n]) => n > 0);
            return { pending: leaves.filter((l) => l.status === 'pending').length, approved: days('approved'), rejected: inYear.filter((l) => l.status === 'rejected').length, byType };
      }, [leaves, year]);

      const requestDays = workingDays(form.from, form.to);
      const shown = leaves.filter((l) => filter === 'all' || l.status === filter);

      return (
            <div className="grid gap-6 xl:grid-cols-3">
                  <div className="space-y-6 xl:col-span-1">
                        <form onSubmit={(e) => { e.preventDefault(); submit.mutate(); }} className={`${card} space-y-4 p-5`}>
                              <h3 className="font-semibold">Request leave</h3>
                              <div className="grid grid-cols-2 gap-3">
                                    <Field label="From"><input type="date" required className={input} value={form.from} onChange={set('from')} /></Field>
                                    <Field label="To"><input type="date" required min={form.from} className={input} value={form.to} onChange={set('to')} /></Field>
                              </div>
                              <Field label="Type">
                                    <div className="flex flex-wrap gap-1.5">
                                          {LEAVE_TYPES.map((t) => (
                                                <button type="button" key={t} onClick={() => setForm((f) => ({ ...f, type: t }))} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${form.type === t ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t}</button>
                                          ))}
                                    </div>
                              </Field>
                              <Field label="Reason"><textarea rows={3} className={input} maxLength={500} placeholder="Tell your approver why (optional)" value={form.reason} onChange={set('reason')} /></Field>
                              <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm">
                                    <span className="text-gray-400">Working days</span>
                                    <b className="text-lg tabular-nums">{requestDays}</b>
                              </div>
                              {requestDays === 0 && form.from <= form.to && <p className="text-xs text-amber-400">Those dates are all weekend (Fri/Sat), nothing to request.</p>}
                              <p className="flex items-start gap-2 text-xs text-gray-400"><Info size={14} className="mt-0.5 shrink-0" />Leave is not valid until your manager or the CEO approves it. Until then those days count as absent.</p>
                              <button className={`${btnPrimary} w-full`} disabled={submit.isPending || requestDays === 0}><Send size={15} /> {submit.isPending ? 'Sending…' : 'Send for approval'}</button>
                        </form>

                        <div className={`${card} p-5`}>
                              <h3 className="font-semibold">Approved leave in {year}</h3>
                              <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-400">{stats.approved}<span className="ml-1 text-sm font-medium text-gray-400">days</span></p>
                              {stats.byType.length === 0 ? <p className="mt-2 text-sm text-gray-500">No approved leave yet.</p> : (
                                    <ul className="mt-3 space-y-2">
                                          {stats.byType.map(([t, n]) => (
                                                <li key={t} className="flex items-center justify-between text-sm"><span className={`capitalize ${TYPE_TONE[t]}`}>{t}</span><b className="tabular-nums">{n}</b></li>
                                          ))}
                                    </ul>
                              )}
                        </div>
                  </div>

                  <section className="space-y-4 xl:col-span-2">
                        <div className="grid grid-cols-3 gap-4">
                              <div className={`${card} p-4`}><p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-400"><Hourglass size={14} className="text-amber-400" />Pending</p><p className="mt-1 text-2xl font-bold text-amber-400">{stats.pending}</p></div>
                              <div className={`${card} p-4`}><p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-400"><CalendarCheck size={14} className="text-emerald-400" />Approved days</p><p className="mt-1 text-2xl font-bold text-emerald-400">{stats.approved}</p></div>
                              <div className={`${card} p-4`}><p className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-400"><CalendarX size={14} className="text-red-400" />Rejected</p><p className="mt-1 text-2xl font-bold text-red-400">{stats.rejected}</p></div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                              {['all', 'pending', 'approved', 'rejected'].map((k) => (
                                    <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${filter === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>{k}</button>
                              ))}
                        </div>

                        {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : shown.length === 0 ? <Empty>No {filter === 'all' ? '' : filter} leave requests.</Empty> : (
                              <ul className="space-y-3">
                                    {shown.map((l) => (
                                          <li key={l._id} className={`${card} space-y-3 p-5`}>
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                      <div>
                                                            <p className="font-semibold">{l.from === l.to ? fmtDate(l.from) : `${fmtDate(l.from)} → ${fmtDate(l.to)}`}</p>
                                                            <p className="mt-0.5 text-sm text-gray-400"><span className={`font-medium capitalize ${TYPE_TONE[l.type]}`}>{l.type}</span> · {workingDays(l.from, l.to)} working day{workingDays(l.from, l.to) === 1 ? '' : 's'}</p>
                                                      </div>
                                                      <div className="flex items-center gap-2">
                                                            <Badge status={l.status} />
                                                            {l.status === 'pending' && (
                                                                  <button className={`${btnDanger} !px-3 !py-1.5`} onClick={async () => (await confirm('Cancel this leave request?', 'Cancel request')) && cancel.mutate(l._id)}>Cancel</button>
                                                            )}
                                                      </div>
                                                </div>
                                                {l.reason && <p className="text-sm text-gray-300">“{l.reason}”</p>}
                                                <Steps l={l} />
                                                {l.decisionNote && (
                                                      <p className={`rounded-xl border px-3 py-2 text-sm ${l.status === 'rejected' ? 'border-red-500/30 text-red-300' : 'border-emerald-500/30 text-emerald-300'}`}>
                                                            {l.decidedByName ? `${l.decidedByName}: ` : ''}{l.decisionNote}
                                                      </p>
                                                )}
                                          </li>
                                    ))}
                              </ul>
                        )}
                  </section>
            </div>
      );
}
