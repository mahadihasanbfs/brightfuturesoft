import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api';
import { money, thisMonth } from '../format';
import { Modal, Field, input, btnPrimary, btnGhost, toastError } from '../ui';

export const EARNING_KINDS = [
      ['basic', 'Basic salary'], ['allowance', 'Allowance'], ['ta', 'TA (travel)'], ['da', 'DA (daily)'],
      ['extra', 'Extra work'], ['bonus', 'Bonus'], ['other', 'Other'],
];
export const DEDUCTION_KINDS = [
      ['advance', 'Advance recovery'], ['absence', 'Absence / late'], ['tax', 'Tax'], ['other', 'Other'],
];

const labelOf = (kinds, kind) => kinds.find(([k]) => k === kind)?.[1] || kind;

export function LineEditor({ title, kinds, rows, onChange }) {
      const setRow = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
      return (
            <div>
                  <p className="mb-2 text-xs font-medium text-gray-400">{title}</p>
                  <div className="space-y-2">
                        {rows.map((r, i) => (
                              <div key={i} className="grid grid-cols-12 gap-2">
                                    <select className={`${input} col-span-3`} value={r.kind} onChange={(e) => setRow(i, { kind: e.target.value, label: labelOf(kinds, e.target.value) })}>
                                          {kinds.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                                    </select>
                                    <input className={`${input} col-span-5`} placeholder="Label / note" value={r.label} onChange={(e) => setRow(i, { label: e.target.value })} />
                                    <input type="number" min="0" step="any" className={`${input} col-span-3`} placeholder="Amount" value={r.amount} onChange={(e) => setRow(i, { amount: e.target.value })} />
                                    <button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} className="col-span-1 text-gray-500 hover:text-red-400" aria-label="Remove line"><Trash2 size={16} /></button>
                              </div>
                        ))}
                  </div>
                  <button type="button" onClick={() => onChange([...rows, { kind: kinds[0][0], label: kinds[0][1], amount: '' }])} className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                        <Plus size={14} /> Add line
                  </button>
            </div>
      );
}

export const DEFAULT_PF = { enabled: true, employeePercent: 5, companyPercent: 5, base: 'basic' };

export function PfEditor({ pf, onChange }) {
      const set = (k) => (e) => onChange({ ...pf, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
      return (
            <div className="rounded-lg border border-gray-800 p-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <input type="checkbox" checked={pf.enabled} onChange={set('enabled')} />
                        Provident fund
                  </label>
                  {pf.enabled && (
                        <div className="mt-3 grid grid-cols-3 gap-3">
                              <Field label="Employee %"><input type="number" min="0" max="100" step="any" className={input} value={pf.employeePercent} onChange={set('employeePercent')} /></Field>
                              <Field label="Company %"><input type="number" min="0" max="100" step="any" className={input} value={pf.companyPercent} onChange={set('companyPercent')} /></Field>
                              <Field label="Calculated on">
                                    <select className={input} value={pf.base} onChange={set('base')}>
                                          <option value="basic">Basic salary</option>
                                          <option value="gross">Gross pay</option>
                                    </select>
                              </Field>
                        </div>
                  )}
            </div>
      );
}

// Same arithmetic as the server (accounts_calc.calc_pf), for the live preview only.
const previewPf = (pf, earnings, gross) => {
      if (!pf.enabled) return { employee: 0, company: 0 };
      const basic = earnings.filter((r) => r.kind === 'basic').reduce((t, r) => t + (Number(r.amount) || 0), 0);
      const base = pf.base === 'gross' ? gross : basic;
      const cut = (pct) => Math.round(((base * (Number(pct) || 0)) / 100 + Number.EPSILON) * 100) / 100;
      return { employee: cut(pf.employeePercent), company: cut(pf.companyPercent) };
};

const fromProfile = (profile) => {
      if (!profile) return [{ kind: 'basic', label: 'Basic salary', amount: '' }];
      return [
            { kind: 'basic', label: 'Basic salary', amount: profile.basic || '' },
            ...(profile.allowances || []).map((a) => ({ kind: a.kind || 'allowance', label: a.label, amount: a.amount })),
      ];
};

export default function PayslipFormModal({ slip, employees, profiles, defaultMonth, onClose, onSaved }) {
      const editing = Boolean(slip);
      const [form, setForm] = useState(() => ({
            employeeId: slip?.employeeId || '',
            month: slip?.month || defaultMonth || thisMonth(),
            workingDays: slip?.workingDays ?? '',
            absentDays: slip?.absentDays ?? '',
            extraHours: slip?.extraHours ?? '',
            earnings: slip?.earnings || fromProfile(null),
            deductions: slip?.deductions || [],
            notes: slip?.notes || '',
            pf: !slip ? { ...DEFAULT_PF } : slip.pf?.enabled ? { enabled: true, employeePercent: slip.pf.employeePercent, companyPercent: slip.pf.companyPercent, base: slip.pf.base } : { ...DEFAULT_PF, enabled: false },
      }));
      const [saving, setSaving] = useState(false);
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const pickEmployee = (e) => {
            const employeeId = e.target.value;
            const profile = profiles.find((p) => p.employeeId === employeeId);
            setForm({ ...form, employeeId, earnings: fromProfile(profile), pf: profile?.pf ? { ...DEFAULT_PF, ...profile.pf } : { ...DEFAULT_PF } });
      };

      const gross = form.earnings.reduce((t, r) => t + (Number(r.amount) || 0), 0);
      const ded = form.deductions.reduce((t, r) => t + (Number(r.amount) || 0), 0);
      const pfPreview = previewPf(form.pf, form.earnings, gross);
      const net = gross - ded - pfPreview.employee;

      const submit = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  const clean = (rows) => rows.filter((r) => Number(r.amount) > 0).map((r) => ({ ...r, amount: Number(r.amount) }));
                  const num = (v) => (v === '' ? undefined : Number(v));
                  const body = {
                        ...form,
                        workingDays: num(form.workingDays),
                        absentDays: num(form.absentDays),
                        extraHours: num(form.extraHours),
                        earnings: clean(form.earnings),
                        deductions: clean(form.deductions),
                        pf: { ...form.pf, employeePercent: Number(form.pf.employeePercent) || 0, companyPercent: Number(form.pf.companyPercent) || 0 },
                  };
                  if (editing) {
                        delete body.employeeId;
                        delete body.month;
                  }
                  onSaved(await api(editing ? `/payslips/${slip._id}` : '/payslips', { method: editing ? 'PUT' : 'POST', body }));
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal title={editing ? `Edit payslip · ${slip.employee?.name}` : 'New payslip'} onClose={onClose} wide>
                  <form onSubmit={submit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                              <Field label="Employee">
                                    <select required disabled={editing} className={input} value={form.employeeId} onChange={pickEmployee}>
                                          <option value="">Select…</option>
                                          {employees.map((u) => <option key={u._id} value={u._id}>{u.name} — {u.designation}</option>)}
                                    </select>
                              </Field>
                              <Field label="Month"><input required disabled={editing} type="month" className={input} value={form.month} onChange={set('month')} /></Field>
                              <Field label="Working days"><input type="number" min="0" className={input} value={form.workingDays} onChange={set('workingDays')} /></Field>
                              <Field label="Absent days"><input type="number" min="0" className={input} value={form.absentDays} onChange={set('absentDays')} /></Field>
                              <Field label="Extra work hours"><input type="number" min="0" step="any" className={input} value={form.extraHours} onChange={set('extraHours')} /></Field>
                        </div>

                        <LineEditor title="Earnings (basic, TA/DA, extra work, bonus…)" kinds={EARNING_KINDS} rows={form.earnings} onChange={(earnings) => setForm({ ...form, earnings })} />
                        <LineEditor title="Deductions (advance recovery, absence, tax…)" kinds={DEDUCTION_KINDS} rows={form.deductions} onChange={(deductions) => setForm({ ...form, deductions })} />

                        <PfEditor pf={form.pf} onChange={(pf) => setForm({ ...form, pf })} />

                        <Field label="Notes"><textarea rows={2} className={input} value={form.notes} onChange={set('notes')} /></Field>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-4 text-sm">
                              <span className="text-gray-400">
                                    Gross {money(gross)} − Deductions {money(ded)}
                                    {form.pf.enabled && <> − PF {money(pfPreview.employee)} <span className="text-gray-500">(+ company PF {money(pfPreview.company)})</span></>}
                              </span>
                              <span>Net pay <b className="text-lg">{money(net)}</b></span>
                        </div>
                        <div className="flex justify-end gap-3">
                              <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
                              <button disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create payslip'}</button>
                        </div>
                  </form>
            </Modal>
      );
}
