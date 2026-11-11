import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { api } from './api';
import { Empty, Field, btnPrimary, card, input, toastError } from '../Invoice/ui';

const TYPES = [
      ['casual', 'Casual leave', 'Personal work, usually 6-12 days a year.'],
      ['sick', 'Sick leave', 'Illness, usually 6-12 days a year.'],
      ['annual', 'Annual / earned leave', 'Usually 15-18 days a year.'],
      ['unpaid', 'Unpaid leave', 'Needs approval. A day of salary is deducted for each day taken.'],
];

function Form({ policy }) {
      const qc = useQueryClient();
      const [quotas, setQuotas] = useState(() => Object.fromEntries(TYPES.map(([t]) => [t, policy.quotas[t] ?? ''])));
      const [bonus, setBonus] = useState(policy.offDayBonusPercent);
      const [late, setLate] = useState(policy.lateDaysPerDeduction);
      const [holidays, setHolidays] = useState(policy.holidays);
      const [draft, setDraft] = useState({ date: '', name: '' });

      const save = useMutation({
            mutationFn: () => api('/policy', { method: 'PUT', body: { quotas, offDayBonusPercent: bonus, lateDaysPerDeduction: late, holidays } }),
            onSuccess: (d) => {
                  qc.setQueryData(['att-policy'], d);
                  ['att-balance', 'att-payroll', 'att-my', 'att-daily', 'att-monthly'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
                  Swal.fire({ icon: 'success', title: 'Policy saved', confirmButtonColor: '#0A65B4' });
            },
            onError: toastError,
      });
      const addHoliday = () => {
            if (!draft.date) return;
            setHolidays((h) => [...h.filter((x) => x.date !== draft.date), { date: draft.date, name: draft.name.trim() || 'Holiday' }].sort((a, b) => (a.date < b.date ? -1 : 1)));
            setDraft({ date: '', name: '' });
      };

      return (
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid gap-6 xl:grid-cols-2">
                  <div className={`${card} space-y-5 p-6`}>
                        <div>
                              <h3 className="font-semibold">Yearly leave limit</h3>
                              <p className="mt-1 text-sm text-gray-400">Days per person per calendar year, counted in working days. Once a limit is used up, no more can be requested.</p>
                        </div>
                        {TYPES.map(([t, label, hint]) => (
                              <Field key={t} label={label}>
                                    <input type="number" min={0} max={366} className={`${input} !w-32`} required value={quotas[t]} onChange={(e) => setQuotas((q) => ({ ...q, [t]: e.target.value }))} />
                                    <span className="mt-1 block text-xs text-gray-500">{hint}</span>
                              </Field>
                        ))}
                        <Field label="Late arrivals per day of salary deducted">
                              <input type="number" min={0} max={31} className={`${input} !w-32`} value={late} onChange={(e) => setLate(e.target.value)} />
                              <span className="mt-1 block text-xs text-gray-500">Every this many late days (after 10:15) costs one day's pay. 0 = no late deduction.</span>
                        </Field>
                        <Field label="Weekend / holiday work bonus (%)">
                              <input type="number" min={0} max={500} className={`${input} !w-32`} value={bonus} onChange={(e) => setBonus(e.target.value)} />
                              <span className="mt-1 block text-xs text-gray-500">Working on a weekend or holiday pays that day's salary plus this much extra.</span>
                        </Field>
                  </div>

                  <div className={`${card} space-y-4 p-6`}>
                        <div>
                              <h3 className="font-semibold">Company holidays</h3>
                              <p className="mt-1 text-sm text-gray-400">Not a working day: no absent mark, no leave counted, and working that day earns the bonus.</p>
                        </div>
                        <div className="flex flex-wrap items-end gap-2">
                              <Field label="Date"><input type="date" className={input} value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} /></Field>
                              <Field label="Name" className="min-w-40 flex-1"><input className={input} maxLength={60} placeholder="Eid, Victory Day…" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} /></Field>
                              <button type="button" className={btnPrimary} disabled={!draft.date} onClick={addHoliday}><Plus size={15} /> Add</button>
                        </div>
                        {holidays.length === 0 ? <p className="text-sm text-gray-500">No holidays added.</p> : (
                              <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
                                    {holidays.map((h) => (
                                          <li key={h.date} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                                                <span><b className="tabular-nums">{h.date}</b> <span className="ml-2 text-gray-300">{h.name}</span></span>
                                                <button type="button" aria-label={`Remove ${h.name}`} className="text-gray-500 hover:text-red-400" onClick={() => setHolidays((l) => l.filter((x) => x.date !== h.date))}><Trash2 size={15} /></button>
                                          </li>
                                    ))}
                              </ul>
                        )}
                  </div>

                  <div className="xl:col-span-2"><button className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save policy'}</button></div>
            </form>
      );
}

export default function LeavePolicy() {
      const { data, isPending, error } = useQuery({ queryKey: ['att-policy'], queryFn: () => api('/policy') });
      if (error) return <Empty>{error.message}</Empty>;
      if (isPending) return <Empty>Loading…</Empty>;
      return <Form policy={data} />;
}
