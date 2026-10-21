import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Plus, Settings2, Wand2 } from 'lucide-react';
import { api } from '../api';
import { money, thisMonth, monthLabel } from '../format';
import { Empty, Field, Modal, Row, Stat, StatusBadge, Table, Td, input, btnPrimary, btnGhost, toastError } from '../ui';
import PayslipFormModal, { DEFAULT_PF, LineEditor, PfEditor } from '../modal/PayslipFormModal';
import PayslipDetailModal from '../modal/PayslipDetailModal';

const FIXED_KINDS = [['allowance', 'Allowance'], ['ta', 'TA (travel)'], ['da', 'DA (daily)'], ['other', 'Other']];

function ProfilesModal({ employees, profiles, onClose, onSaved }) {
      const [employeeId, setEmployeeId] = useState('');
      const [basic, setBasic] = useState('');
      const [allowances, setAllowances] = useState([]);
      const [pf, setPf] = useState({ ...DEFAULT_PF });
      const [saving, setSaving] = useState(false);

      const pick = (e) => {
            const id = e.target.value;
            const p = profiles.find((x) => x.employeeId === id);
            setEmployeeId(id);
            setBasic(p?.basic ?? '');
            setAllowances((p?.allowances || []).map((a) => ({ ...a })));
            setPf(p?.pf ? { ...DEFAULT_PF, ...p.pf } : { ...DEFAULT_PF });
      };

      const save = async (e) => {
            e.preventDefault();
            setSaving(true);
            try {
                  await api(`/salary-profiles/${employeeId}`, {
                        method: 'PUT',
                        body: {
                              basic: Number(basic) || 0,
                              allowances: allowances.filter((a) => Number(a.amount) > 0).map((a) => ({ ...a, amount: Number(a.amount) })),
                              pf: { ...pf, employeePercent: Number(pf.employeePercent) || 0, companyPercent: Number(pf.companyPercent) || 0 },
                        },
                  });
                  onSaved();
                  setEmployeeId('');
            } catch (err) {
                  toastError(err);
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal title="Pay profiles (default monthly pay)" onClose={onClose}>
                  <form onSubmit={save} className="space-y-4">
                        <Field label="Employee">
                              <select required className={input} value={employeeId} onChange={pick}>
                                    <option value="">Select…</option>
                                    {employees.map((u) => {
                                          const p = profiles.find((x) => x.employeeId === u._id);
                                          return <option key={u._id} value={u._id}>{u.name}{p ? ` — ${money(p.basic)}` : ' — not set'}</option>;
                                    })}
                              </select>
                        </Field>
                        {employeeId && (
                              <>
                                    <Field label="Basic salary (৳)"><input required type="number" min="0" step="any" className={input} value={basic} onChange={(e) => setBasic(e.target.value)} /></Field>
                                    <LineEditor title="Fixed monthly allowances (optional)" kinds={FIXED_KINDS} rows={allowances} onChange={setAllowances} />
                                    <PfEditor pf={pf} onChange={setPf} />
                                    <div className="flex justify-end gap-3">
                                          <button type="button" onClick={onClose} className={btnGhost}>Close</button>
                                          <button disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : 'Save profile'}</button>
                                    </div>
                              </>
                        )}
                  </form>
            </Modal>
      );
}

export default function SalaryTab() {
      const qc = useQueryClient();
      const [month, setMonth] = useState(thisMonth());
      const [form, setForm] = useState(null);
      const [selected, setSelected] = useState(null);
      const [showProfiles, setShowProfiles] = useState(false);
      const [missing, setMissing] = useState([]);

      const { data: slips = [], isLoading, error } = useQuery({ queryKey: ['acc-payslips', month], queryFn: () => api(`/payslips?month=${month}`) });
      const { data: employees = [] } = useQuery({ queryKey: ['acc-employees'], queryFn: () => api('/employees') });
      const { data: fund } = useQuery({ queryKey: ['acc-pf'], queryFn: () => api('/provident-fund') });
      const { data: profiles = [] } = useQuery({ queryKey: ['acc-profiles'], queryFn: () => api('/salary-profiles') });

      const refresh = () => {
            qc.invalidateQueries({ queryKey: ['acc-payslips'] });
            qc.invalidateQueries({ queryKey: ['acc-pf'] });
            qc.invalidateQueries({ queryKey: ['acc-summary'] });
      };

      const totals = slips.reduce((t, s) => ({ net: t.net + s.net, paid: t.paid + s.paid, balance: t.balance + s.balance }), { net: 0, paid: 0, balance: 0 });

      // Server creates each missing payslip from the employee's pay profile and reports who has none.
      const generate = async ({ quiet = false } = {}) => {
            try {
                  const r = await api('/payslips/generate', { method: 'POST', body: { month } });
                  setMissing(r.missingProfile);
                  if (r.created) refresh();
                  if (quiet) return;
                  const lines = [];
                  if (r.created) lines.push(`${r.created} payslip(s) created. Open each to add TA/DA, extra work and deductions.`);
                  else if (r.skipped) lines.push('Every employee already has a payslip for this month.');
                  if (r.missingProfile.length) lines.push(`No pay profile (basic salary) for: ${r.missingProfile.map((u) => u.name).join(', ')}. Set it under "Pay profiles".`);
                  Swal.fire({ icon: r.missingProfile.length ? 'warning' : r.created ? 'success' : 'info', title: r.created ? 'Payslips generated' : 'Nothing new to generate', text: lines.join(' ') || 'No employees found.' });
            } catch (err) {
                  if (!quiet) toastError(err);
            }
      };

      // Auto-generate once per opened month (current or past), so payslips are there without a click.
      const autoRan = useRef(new Set());
      useEffect(() => {
            if (month > thisMonth() || autoRan.current.has(month)) return;
            autoRan.current.add(month);
            generate({ quiet: true });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [month]);

      if (error) return <Empty>{error.message}</Empty>;

      return (
            <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                        <input type="month" className={`${input} max-w-[11rem]`} value={month} onChange={(e) => setMonth(e.target.value)} />
                        <div className="ml-auto flex flex-wrap gap-2">
                              <button onClick={() => setShowProfiles(true)} className={btnGhost}><Settings2 size={16} /> Pay profiles</button>
                              <button onClick={() => generate()} className={btnGhost}><Wand2 size={16} /> Generate for {monthLabel(month)}</button>
                              <button onClick={() => setForm({})} className={btnPrimary}><Plus size={16} /> New payslip</button>
                        </div>
                  </div>

                  {missing.length > 0 && (
                        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
                              No payslip yet for {missing.map((u) => u.name).join(', ')} — they have no pay profile.{' '}
                              <button onClick={() => setShowProfiles(true)} className="underline">Set pay profiles</button>
                        </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Stat label="Net payable" value={money(totals.net)} />
                        <Stat label="Paid" value={money(totals.paid)} tone="text-emerald-400" />
                        <Stat label="Still to pay" value={money(totals.balance)} tone={totals.balance > 0 ? 'text-amber-400' : ''} />
                  </div>

                  {isLoading ? <Empty>Loading…</Empty> : slips.length === 0 ? (
                        <Empty>No payslips for {monthLabel(month)}. Set pay profiles, then generate.</Empty>
                  ) : (
                        <Table head={['Employee', 'Gross', 'Deductions', 'Net', 'Paid', 'Balance', 'Status']}>
                              {slips.map((s) => (
                                    <Row key={s._id} onClick={() => setSelected(s)}>
                                          <Td className="font-medium">{s.employee?.name}<div className="text-xs text-gray-500">{s.employee?.designation}</div></Td>
                                          <Td>{money(s.gross)}</Td>
                                          <Td className="text-red-300">{money(s.totalDeductions)}</Td>
                                          <Td className="font-semibold">{money(s.net)}</Td>
                                          <Td className="text-emerald-400">{money(s.paid)}</Td>
                                          <Td>{money(s.balance)}</Td>
                                          <Td><StatusBadge status={s.status} /></Td>
                                    </Row>
                              ))}
                        </Table>
                  )}

                  <section>
                        <h2 className="mb-3 text-sm font-semibold text-gray-300">Provident fund balances (all months)</h2>
                        {!fund || fund.rows.length === 0 ? <Empty>No provident fund contributions yet.</Empty> : (
                              <Table head={['Employee', 'Employee share', 'Company share', 'Fund balance', 'Months']}>
                                    {fund.rows.map((r) => (
                                          <Row key={r.employeeId}>
                                                <Td className="font-medium">{r.employee?.name}<div className="text-xs text-gray-500">{r.employee?.designation}</div></Td>
                                                <Td>{money(r.employeeTotal)}</Td>
                                                <Td>{money(r.companyTotal)}</Td>
                                                <Td className="font-semibold text-emerald-400">{money(r.balance)}</Td>
                                                <Td className="text-gray-400">{r.entries.length}</Td>
                                          </Row>
                                    ))}
                                    <Row>
                                          <Td className="font-semibold">Total</Td>
                                          <Td className="font-semibold">{money(fund.totals.employee)}</Td>
                                          <Td className="font-semibold">{money(fund.totals.company)}</Td>
                                          <Td className="font-semibold text-emerald-400">{money(fund.totals.balance)}</Td>
                                          <Td />
                                    </Row>
                              </Table>
                        )}
                  </section>

                  {form && (
                        <PayslipFormModal
                              slip={form._id ? form : null}
                              employees={employees}
                              profiles={profiles}
                              defaultMonth={month}
                              onClose={() => setForm(null)}
                              onSaved={(saved) => { setForm(null); refresh(); setSelected(saved); }}
                        />
                  )}
                  {selected && !form && (
                        <PayslipDetailModal
                              slip={selected}
                              onClose={() => setSelected(null)}
                              onEdit={(s) => setForm(s)}
                              onChanged={(s) => { refresh(); setSelected(s); }}
                        />
                  )}
                  {showProfiles && (
                        <ProfilesModal
                              employees={employees}
                              profiles={profiles}
                              onClose={() => setShowProfiles(false)}
                              onSaved={() => {
                                    qc.invalidateQueries({ queryKey: ['acc-profiles'] });
                                    generate({ quiet: true });
                              }}
                        />
                  )}
            </div>
      );
}
