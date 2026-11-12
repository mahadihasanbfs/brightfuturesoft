import { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Search, UserCheck, CalendarOff, UserX, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import DiscordSettings from './DiscordSettings';
import LeavePolicy from './LeavePolicy';
import Payroll from './Payroll';
import TeamPerformance from './TeamPerformance';
import WorkReports from './WorkReports';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import { api } from './api';
import Badge from './Badge';
import { fmtDay, fmtHours, fmtTime, localDate, localMonth, toHHMM } from './format';
import { Empty, Field, Modal, PageHeader, Row, Stat, Table, Td, btnDanger, btnGhost, btnPrimary, confirm, input, toastError } from '../Invoice/ui';
import { promptDialog } from '../../../Hook/confirmDialog';

const ADMIN_DESIGNATIONS = ['Chief Executive Officer', 'manager'];

function EditModal({ row, date, onClose, onSaved }) {
      const initial = row.sessions?.length ? row.sessions.map((x) => ({ checkIn: toHHMM(x.in), checkOut: toHHMM(x.out) })) : [{ checkIn: '10:00', checkOut: '' }];
      const [sessions, setSessions] = useState(initial);
      const [f, setF] = useState({ status: row.sessions?.length ? (row.status === 'late' ? 'late' : 'present') : '', note: row.note || '' });
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const setS = (i, k) => (e) => setSessions((list) => list.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)));
      const save = useMutation({
            mutationFn: () => api('/records', { method: 'PUT', body: { userId: row.userId, date, sessions, status: f.status || undefined, note: f.note } }),
            onSuccess: onSaved,
            onError: toastError,
      });
      const remove = useMutation({
            mutationFn: () => api(`/records?userId=${row.userId}&date=${date}`, { method: 'DELETE' }),
            onSuccess: onSaved,
            onError: toastError,
      });
      return (
            <Modal title={`${row.name} · ${fmtDay(date)}`} onClose={onClose}>
                  <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
                        <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-400">Sessions (Bangladesh time). Leave check out empty if still in office.</p>
                              {sessions.map((x, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                          <span className="w-6 text-xs text-gray-500">{i + 1}</span>
                                          <input type="time" required className={input} value={x.checkIn} onChange={setS(i, 'checkIn')} />
                                          <input type="time" className={input} value={x.checkOut} onChange={setS(i, 'checkOut')} />
                                          <button type="button" className={`${btnGhost} !px-3`} disabled={sessions.length === 1} onClick={() => setSessions((l) => l.filter((_, j) => j !== i))} aria-label="Remove session">✕</button>
                                    </div>
                              ))}
                              <button type="button" className={btnGhost} onClick={() => setSessions((l) => [...l, { checkIn: '', checkOut: '' }])}>+ Add session</button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                              <Field label="Status">
                                    <select className={input} value={f.status} onChange={set('status')}>
                                          <option value="">Automatic (from first check-in)</option>
                                          <option value="present">Present</option>
                                          <option value="late">Late</option>
                                    </select>
                              </Field>
                              <Field label="Note"><input className={input} maxLength={300} value={f.note} onChange={set('note')} /></Field>
                        </div>
                        <div className="flex justify-between">
                              <div>
                                    {row.sessions?.length > 0 && (
                                          <button type="button" className={btnDanger} onClick={async () => (await confirm('Delete this attendance record?', 'Delete')) && remove.mutate()}>
                                                Delete record
                                          </button>
                                    )}
                              </div>
                              <div className="flex gap-3">
                                    <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                                    <button className={btnPrimary} disabled={save.isPending}>Save</button>
                              </div>
                        </div>
                  </form>
            </Modal>
      );
}

function Daily() {
      const qc = useQueryClient();
      const [date, setDate] = useState(localDate());
      const [edit, setEdit] = useState(null);
      const { data, isPending, error } = useQuery({ queryKey: ['att-daily', date], queryFn: () => api(`/daily?date=${date}`) });
      const c = data?.counts || {};
      const [q, setQ] = useState('');
      const [filter, setFilter] = useState('all');
      const FILTERS = [['all', 'All'], ['present', 'Present'], ['late', 'Late'], ['leave', 'Leave'], ['absent', 'Absent'], ['not_in', 'Not in yet']];
      const shown = (data?.rows || []).filter((r) =>
            (filter === 'all' || r.status === filter) &&
            (!q.trim() || `${r.name} ${r.designation || ''}`.toLowerCase().includes(q.trim().toLowerCase())));
      return (
            <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                        <input type="date" className={`${input} !w-auto`} value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
                        {data?.weekend && <span className="text-sm text-gray-400">Weekend</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <Stat icon={UserCheck} label="Present" value={(c.present || 0) + (c.late || 0)} tone="text-emerald-400" hint={`${c.late || 0} late`} />
                        <Stat icon={CalendarOff} label="On leave" value={c.leave || 0} tone="text-sky-400" />
                        <Stat icon={UserX} label="Absent" value={(c.absent || 0) + (c.not_in || 0)} tone="text-red-400" hint={c.not_in ? `${c.not_in} not in yet` : undefined} />
                        <Stat icon={Users} label="Staff" value={data?.rows?.length || 0} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
                              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input className={`${input} !pl-9`} placeholder="Search employee…" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                              {FILTERS.map(([k, label]) => (
                                    <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>{label}</button>
                              ))}
                        </div>
                  </div>
                  {error ? <Empty>{error.message}</Empty> : isPending || !data?.rows ? <Empty>Loading…</Empty> : shown.length === 0 ? <Empty>No employees match.</Empty> : (
                        <Table head={['Employee', 'Status', 'First in', 'Last out', 'Sessions', 'Worked', 'Daily report', 'Note']}>
                              {shown.map((r) => (
                                    <Row key={r.userId} onClick={() => setEdit(r)}>
                                          <Td><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.designation}</p></Td>
                                          <Td><Badge status={r.status} /></Td>
                                          <Td>{fmtTime(r.checkIn)}</Td>
                                          <Td>{r.open ? <span className="text-emerald-400">in office</span> : fmtTime(r.checkOut)}</Td>
                                          <Td>{r.sessions?.length || '-'}</Td>
                                          <Td>{fmtHours(r.workedMinutes)}</Td>
                                          <Td className="max-w-sm truncate text-gray-300" title={r.report}>{r.report || '-'}</Td>
                                          <Td className="max-w-xs truncate text-gray-400">{r.note || '-'}</Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  <p className="text-xs text-gray-500">Click a row to add or correct that person's record.</p>
                  {edit && <EditModal row={edit} date={date} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); qc.invalidateQueries({ queryKey: ['att-daily'] }); qc.invalidateQueries({ queryKey: ['att-monthly'] }); }} />}
            </section>
      );
}

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

function Monthly() {
      const [month, setMonth] = useState(localMonth());
      const { data, isPending, error } = useQuery({ queryKey: ['att-monthly', month], queryFn: () => api(`/monthly?month=${month}`) });
      const exportCsv = () => {
            const head = ['Name', 'Email', 'Working days', 'Present', 'Late', 'Leave', 'Absent', 'Hours worked'];
            const lines = [head, ...(data?.rows ?? []).map((r) => [r.name, r.email, r.workingDays, r.present, r.late, r.leave, r.absent, (r.workedMinutes / 60).toFixed(1)])];
            const url = URL.createObjectURL(new Blob([lines.map((l) => l.map(csvCell).join(',')).join('\n')], { type: 'text/csv' }));
            Object.assign(document.createElement('a'), { href: url, download: `attendance-${month}.csv` }).click();
            URL.revokeObjectURL(url);
      };
      return (
            <section className="space-y-4">
                  <div className="flex items-center justify-between">
                        <input type="month" className={`${input} !w-auto`} value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
                        <button className={btnGhost} disabled={!data?.rows} onClick={exportCsv}><Download size={16} /> Export CSV</button>
                  </div>
                  {error ? <Empty>{error.message}</Empty> : isPending || !data?.rows ? <Empty>Loading…</Empty> : (
                        <Table head={['Employee', 'Working days', 'Present', 'Late', 'Leave', 'Absent', 'Hours']}>
                              {data.rows.map((r) => (
                                    <Row key={r.userId}>
                                          <Td><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.designation}</p></Td>
                                          <Td>{r.workingDays}</Td>
                                          <Td className="text-emerald-400">{r.present}</Td>
                                          <Td className="text-amber-400">{r.late}</Td>
                                          <Td className="text-sky-400">{r.leave}</Td>
                                          <Td className="text-red-400">{r.absent}</Td>
                                          <Td>{fmtHours(r.workedMinutes)}</Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  <p className="text-xs text-gray-500">Weekends (Fri, Sat) are not counted. Only approved leave counts as leave; a day with no record and no approved leave is absent.</p>
            </section>
      );
}

const leaveDays = (from, to) => {
      let n = 0;
      for (let t = Date.parse(from); t <= Date.parse(to); t += 86400000) if (![5, 6].includes(new Date(t).getUTCDay())) n += 1;
      return n;
};

function Leaves() {
      const qc = useQueryClient();
      const { user } = useContext(AuthContext);
      const [status, setStatus] = useState('pending');
      const { data: rows = [], isPending, error } = useQuery({ queryKey: ['att-leaves', status], queryFn: () => api(`/leaves${status === 'all' ? '' : `?status=${status}`}`) });
      const { data: pendingRows = [] } = useQuery({ queryKey: ['att-leaves', 'pending'], queryFn: () => api('/leaves?status=pending') });
      const decide = useMutation({
            mutationFn: ({ id, status: s, note }) => api(`/leaves/${id}/decision`, { method: 'PUT', body: { status: s, note } }),
            onSuccess: () => { qc.invalidateQueries({ queryKey: ['att-leaves'] }); qc.invalidateQueries({ queryKey: ['att-daily'] }); qc.invalidateQueries({ queryKey: ['att-monthly'] }); },
            onError: toastError,
      });
      const approve = async (l) => {
            const note = await promptDialog({ title: `Approve ${l.name}'s leave?`, message: `${l.from === l.to ? l.from : `${l.from} → ${l.to}`} · ${leaveDays(l.from, l.to)} working days`, label: 'Note (optional)', placeholder: 'Anything the employee should know', required: false, confirmText: 'Approve' });
            if (note !== null) decide.mutate({ id: l._id, status: 'approved', note });
      };
      const reject = async (l) => {
            const note = await promptDialog({ title: `Reject ${l.name}'s leave?`, label: 'Reason', placeholder: 'Tell them why', requiredMessage: 'Give a reason so they know why', confirmText: 'Reject', tone: 'danger' });
            if (note !== null) decide.mutate({ id: l._id, status: 'rejected', note });
      };
      const own = (l) => l.userId === String(user?._id) && user?.designation !== 'Chief Executive Officer';
      return (
            <section className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                        {['pending', 'approved', 'rejected', 'all'].map((k) => (
                              <button key={k} onClick={() => setStatus(k)} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${status === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>
                                    {k}{k === 'pending' && pendingRows.length > 0 && <span className="rounded-full bg-amber-500 px-1.5 text-[10px] text-black">{pendingRows.length}</span>}
                              </button>
                        ))}
                  </div>
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : rows.length === 0 ? <Empty>No {status === 'all' ? '' : status} leave requests.</Empty> : (
                        <Table head={['Employee', 'Dates', 'Days', 'Type', 'Reason', 'Status', 'Decision', '']}>
                              {rows.map((l) => (
                                    <Row key={l._id}>
                                          <Td className="font-medium">{l.name}</Td>
                                          <Td className="whitespace-nowrap">{l.from === l.to ? l.from : `${l.from} → ${l.to}`}</Td>
                                          <Td className="tabular-nums">{leaveDays(l.from, l.to)}</Td>
                                          <Td className="capitalize">{l.type}</Td>
                                          <Td className="max-w-xs truncate text-gray-400" title={l.reason}>{l.reason || '-'}</Td>
                                          <Td><Badge status={l.status} /></Td>
                                          <Td className="max-w-xs truncate text-xs text-gray-400" title={l.decisionNote}>{l.decidedAt ? `${l.decidedByName || ''} ${l.decisionNote ? `· ${l.decisionNote}` : ''}` : '-'}</Td>
                                          <Td>
                                                {own(l) ? <span className="text-xs text-gray-500">Needs another approver</span> : (
                                                      <div className="flex gap-2">
                                                            {l.status !== 'approved' && <button className={`${btnPrimary} !px-3 !py-1`} onClick={() => approve(l)}>Approve</button>}
                                                            {l.status !== 'rejected' && <button className={`${btnDanger} !px-3 !py-1`} onClick={() => reject(l)}>Reject</button>}
                                                      </div>
                                                )}
                                          </Td>
                                    </Row>
                              ))}
                        </Table>
                  )}
                  <p className="text-xs text-gray-500">Leave only counts after it is approved. Rejecting needs a reason. Managers cannot approve their own leave.</p>
            </section>
      );
}

const TABS = [
      { id: 'daily', label: 'Daily', Component: Daily },
      { id: 'reports', label: 'Daily reports', Component: WorkReports },
      { id: 'performance', label: 'Performance', Component: TeamPerformance },
      { id: 'monthly', label: 'Monthly report', Component: Monthly },
      { id: 'leaves', label: 'Leave requests', Component: Leaves },
      { id: 'payroll', label: 'Payroll', Component: Payroll },
      { id: 'policy', label: 'Leave policy', Component: LeavePolicy },
      { id: 'discord', label: 'Discord', Component: DiscordSettings },
];

// Admins only (the API enforces it again with the JWT).
export default function AttendanceAdmin() {
      const { user } = useContext(AuthContext);
      const [tab, setTab] = useState('daily');
      if (!ADMIN_DESIGNATIONS.includes(user?.designation)) {
            return <main className="flex items-center justify-center text-gray-400">Attendance management is available to admins only.</main>;
      }
      const { Component } = TABS.find((t) => t.id === tab);
      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader title="Attendance Management" subtitle="Daily status, monthly report and leave approvals · office starts 10:00, late after 10:15" />
                  <nav className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 p-1">
                        {TABS.map(({ id, label }) => (
                              <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === id ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                                    {label}
                              </button>
                        ))}
                  </nav>
                  <Component />
            </main>
      );
}
