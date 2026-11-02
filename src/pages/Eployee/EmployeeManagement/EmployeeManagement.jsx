import { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Briefcase, Cake, KeyRound, Linkedin, Mail, Pencil, Phone, Plus, Power, Search, Shield, ShieldCheck, Trash2, UserCheck, UserX, Users, Wifi } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import { base_url } from '../../../layout/Title';
import { PAGE_GROUPS, accessApi } from '../../../layout/access';
import uploadImage from '../../../Hook/ImageUpload';
import Badge from '../Attendance/Badge';
import { Empty, Field, Modal, PageHeader, Stat, btnGhost, btnPrimary, card, confirm, input, toastError } from '../Invoice/ui';

const api = async (path, { method = 'GET', body } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/employees${path}`, {
            method,
            headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Request failed');
      return json.data;
};

const DESIGNATIONS = ['Chief Executive Officer', 'manager'];
const FILTERS = [['all', 'All'], ['online', 'Online now'], ['admin', 'Admins'], ['present', 'In today'], ['leave', 'On leave'], ['absent', 'Not in'], ['inactive', 'Deactivated']];
const ago = (iso) => {
      if (!iso) return 'Never signed in';
      const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
      if (m < 1) return 'Last seen just now';
      if (m < 60) return `Last seen ${m}m ago`;
      if (m < 1440) return `Last seen ${Math.round(m / 60)}h ago`;
      return `Last seen ${Math.round(m / 1440)}d ago`;
};
const inToday = (e) => e.today === 'present' || e.today === 'late';

const Avatar = ({ name, image, size = 'h-14 w-14' }) =>
      image ? <img src={image} alt="" className={`${size} shrink-0 rounded-full object-cover`} /> : (
            <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-blue-600/30 text-lg font-semibold text-blue-200`}>{(name || '?').charAt(0).toUpperCase()}</span>
      );

function EditModal({ employee, onClose, onSaved }) {
      const [f, setF] = useState({
            name: employee.name || '', email: employee.email || '', designation: employee.designation || '', possition: employee.possition || '',
            phone: employee.phone || '', linkedin: employee.linkedin || '', dob: employee.dob || '', salary: employee.salary || '', image: employee.image || '',
      });
      const [file, setFile] = useState(null);
      const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
      const preview = useMemo(() => (file ? URL.createObjectURL(file) : f.image), [file, f.image]);
      const save = useMutation({
            mutationFn: async () => api(`/${employee._id}`, { method: 'PUT', body: { ...f, image: file ? await uploadImage(file) : f.image } }),
            onSuccess: onSaved,
            onError: toastError,
      });
      return (
            <Modal title={`Edit ${employee.name}`} onClose={onClose} wide>
                  <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5">
                        <div className="flex items-center gap-4">
                              <Avatar name={f.name} image={preview} size="h-20 w-20" />
                              <label className={`${btnGhost} cursor-pointer`}>
                                    Change photo
                                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files[0] || null)} />
                              </label>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                              <Field label="Full name"><input required className={input} value={f.name} onChange={set('name')} /></Field>
                              <Field label="Email"><input required type="email" className={input} value={f.email} onChange={set('email')} /></Field>
                              <Field label="Designation">
                                    <input required list="designations" className={input} value={f.designation} onChange={set('designation')} />
                                    <datalist id="designations">{DESIGNATIONS.map((d) => <option key={d} value={d} />)}</datalist>
                              </Field>
                              <Field label="Position / team"><input className={input} value={f.possition} onChange={set('possition')} placeholder="e.g. Frontend developer" /></Field>
                              <Field label="Phone"><input className={input} value={f.phone} onChange={set('phone')} /></Field>
                              <Field label="Date of birth"><input type="date" className={input} value={f.dob} onChange={set('dob')} /></Field>
                              <Field label="LinkedIn"><input className={input} value={f.linkedin} onChange={set('linkedin')} /></Field>
                              <Field label="Monthly salary (BDT)"><input inputMode="decimal" className={input} value={f.salary} onChange={set('salary')} /></Field>
                        </div>
                        <p className="text-xs text-gray-500">“Chief Executive Officer” and “manager” are the two admin designations: they can see every employee, attendance and approve leave.</p>
                        <div className="flex justify-end gap-3">
                              <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                              <button className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save changes'}</button>
                        </div>
                  </form>
            </Modal>
      );
}

function PasswordModal({ employee, onClose }) {
      const [password, setPassword] = useState('');
      const reset = useMutation({
            mutationFn: () => api(`/${employee._id}/password`, { method: 'PUT', body: { password } }),
            onSuccess: () => { Swal.fire({ icon: 'success', title: 'Password reset', text: `Share the new password with ${employee.name} privately.`, confirmButtonColor: '#0A65B4' }); onClose(); },
            onError: toastError,
      });
      return (
            <Modal title={`Reset password · ${employee.name}`} onClose={onClose}>
                  <form onSubmit={(e) => { e.preventDefault(); reset.mutate(); }} className="space-y-4">
                        <Field label="New password"><input required minLength={6} type="text" autoComplete="off" className={input} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></Field>
                        <div className="flex justify-end gap-3">
                              <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                              <button className={btnPrimary} disabled={reset.isPending}>{reset.isPending ? 'Resetting…' : 'Reset password'}</button>
                        </div>
                  </form>
            </Modal>
      );
}

function PagePicker({ value, onChange, disabled }) {
      const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
      const toggleGroup = (keys, on) => onChange(on ? [...new Set([...value, ...keys])] : value.filter((k) => !keys.includes(k)));
      return (
            <div className="space-y-4">
                  {PAGE_GROUPS.map((g) => {
                        const keys = g.pages.map(([k]) => k);
                        const all = keys.every((k) => value.includes(k));
                        return (
                              <fieldset key={g.title} disabled={disabled} className="rounded-xl border border-white/10 p-4 disabled:opacity-60">
                                    <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{g.title}</legend>
                                    <label className="mb-3 flex items-center gap-2 text-xs text-blue-300">
                                          <input type="checkbox" checked={all} onChange={(e) => toggleGroup(keys, e.target.checked)} /> Select all
                                    </label>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                          {g.pages.map(([key, label]) => (
                                                <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
                                                      <input type="checkbox" checked={value.includes(key)} onChange={() => toggle(key)} /> {label}
                                                </label>
                                          ))}
                                    </div>
                              </fieldset>
                        );
                  })}
            </div>
      );
}

const ALL_PAGES = PAGE_GROUPS.flatMap((g) => g.pages.map(([k]) => k));

function AccessModal({ employee, onClose, onSaved }) {
      const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => accessApi('/roles') });
      const [roleId, setRoleId] = useState(employee.roleId || '');
      const [custom, setCustom] = useState(employee.customAccess);
      const [pages, setPages] = useState(employee.permissions.includes('*') ? ALL_PAGES : employee.permissions);
      const role = roles.find((r) => r._id === roleId);
      const rolePages = role ? (role.permissions.includes('*') ? ALL_PAGES : role.permissions) : [];
      const save = useMutation({
            mutationFn: () => accessApi(`/users/${employee._id}`, { method: 'PUT', body: { roleId, permissions: custom ? pages : null } }),
            onSuccess: onSaved,
            onError: toastError,
      });
      return (
            <Modal title={`Role and page access · ${employee.name}`} onClose={onClose} wide>
                  {employee.isAdmin ? (
                        <p className="text-sm text-gray-300">{employee.designation} is always a full admin with every page. Change their designation first if you want to limit their access.</p>
                  ) : (
                        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5">
                              <Field label="Role">
                                    <select required className={input} value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                                          <option value="" disabled>Choose a role…</option>
                                          {roles.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                                    </select>
                              </Field>
                              <label className="flex items-center gap-2 text-sm text-gray-200">
                                    <input type="checkbox" checked={custom} onChange={(e) => { setCustom(e.target.checked); if (e.target.checked && !pages.length) setPages(rolePages); }} />
                                    Custom pages for this person only (instead of the role's pages)
                              </label>
                              <PagePicker value={custom ? pages : rolePages} onChange={setPages} disabled={!custom} />
                              <p className="text-xs text-gray-500">Changes apply within a minute, without the person signing in again.</p>
                              <div className="flex justify-end gap-3">
                                    <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
                                    <button className={btnPrimary} disabled={save.isPending || !roleId}>{save.isPending ? 'Saving…' : 'Save access'}</button>
                              </div>
                        </form>
                  )}
            </Modal>
      );
}

function RolesModal({ onClose }) {
      const qc = useQueryClient();
      const { data: roles = [], isPending } = useQuery({ queryKey: ['roles'], queryFn: () => accessApi('/roles') });
      const [selected, setSelected] = useState(null); // role object, or {} for a new one
      const [name, setName] = useState('');
      const [pages, setPages] = useState([]);
      const pick = (r) => { setSelected(r); setName(r.name || ''); setPages(r.permissions?.includes('*') ? ALL_PAGES : r.permissions || []); };
      const done = () => { qc.invalidateQueries({ queryKey: ['roles'] }); qc.invalidateQueries({ queryKey: ['employees'] }); };
      const save = useMutation({
            mutationFn: () => (selected._id
                  ? accessApi(`/roles/${selected._id}`, { method: 'PUT', body: { ...(selected.system ? {} : { name }), permissions: pages } })
                  : accessApi('/roles', { method: 'POST', body: { name, permissions: pages } })),
            onSuccess: (r) => { done(); setSelected(r); Swal.fire({ icon: 'success', title: 'Role saved', timer: 1200, showConfirmButton: false }); },
            onError: toastError,
      });
      const del = useMutation({ mutationFn: () => accessApi(`/roles/${selected._id}`, { method: 'DELETE' }), onSuccess: () => { done(); setSelected(null); }, onError: toastError });
      const isAdminRole = selected?.name === 'Admin';
      return (
            <Modal title="Roles and page access" onClose={onClose} wide>
                  <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-2">
                              {isPending ? <p className="text-sm text-gray-500">Loading…</p> : roles.map((r) => (
                                    <button key={r._id} onClick={() => pick(r)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${selected?._id === r._id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                                          <span className="font-medium">{r.name}{r.system && <span className="ml-2 text-xs text-gray-500">system</span>}</span>
                                          <span className="text-xs text-gray-400">{r.users} {r.users === 1 ? 'person' : 'people'}</span>
                                    </button>
                              ))}
                              <button onClick={() => pick({ name: '', permissions: [] })} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-blue-300 hover:bg-white/5"><Plus size={14} /> New role</button>
                        </div>
                        <div className="md:col-span-2">
                              {!selected ? <Empty>Pick a role to edit its pages, or create a new one.</Empty> : (
                                    <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
                                          <Field label="Role name"><input required className={input} value={name} disabled={selected.system} onChange={(e) => setName(e.target.value)} placeholder="e.g. Content editor" /></Field>
                                          <PagePicker value={pages} onChange={setPages} disabled={isAdminRole} />
                                          {isAdminRole ? <p className="text-xs text-gray-500">Admin always has every page and cannot be edited.</p> : (
                                                <div className="flex justify-between gap-3">
                                                      {selected._id && !selected.system ? <button type="button" className="text-sm text-red-400 hover:text-red-300" onClick={async () => (await confirm(`Delete the ${selected.name} role?`, 'Delete')) && del.mutate()}>Delete role</button> : <span />}
                                                      <button className={btnPrimary} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save role'}</button>
                                                </div>
                                          )}
                                    </form>
                              )}
                        </div>
                  </div>
            </Modal>
      );
}

const InfoRow = ({ icon: Icon, children }) => (children ? <p className="flex items-center gap-2 truncate text-sm text-gray-400"><Icon size={14} className="shrink-0 text-gray-500" />{children}</p> : null);

function EmployeeCard({ e, isSelf, onEdit, onPassword, onDelete, onAccess, onToggle }) {
      return (
            <article className={`${card} flex flex-col gap-4 p-5 transition hover:border-white/25`}>
                  <div className="flex items-start gap-4">
                        <div className="relative">
                              <Avatar name={e.name} image={e.image} />
                              <span title={e.online ? 'Online now' : ago(e.lastSeenAt)} className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-gray-950 ${e.online ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                              <h3 className="flex items-center gap-2 truncate font-semibold text-white">
                                    {e.name}{isSelf && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">You</span>}
                              </h3>
                              <p className="truncate text-sm text-blue-300">{e.designation}</p>
                              {e.possition && <p className="truncate text-xs text-gray-500">{e.possition}</p>}
                        </div>
                        {e.active ? <Badge status={e.today} /> : <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-300">deactivated</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${e.online ? 'text-emerald-400' : 'text-gray-500'}`}><Wifi size={12} />{e.online ? 'Online now' : ago(e.lastSeenAt)}</span>
                        {e.roleName && <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 font-semibold text-violet-300">{e.roleName}{e.customAccess ? ' · custom' : ''}</span>}
                  </div>
                  <div className="space-y-1.5">
                        <InfoRow icon={Mail}><a href={`mailto:${e.email}`} className="truncate hover:text-white">{e.email}</a></InfoRow>
                        <InfoRow icon={Phone}>{e.phone && <a href={`tel:${e.phone}`} className="hover:text-white">{e.phone}</a>}</InfoRow>
                        <InfoRow icon={Cake}>{e.dob}</InfoRow>
                        <InfoRow icon={Linkedin}>{e.linkedin && <a href={e.linkedin.startsWith('http') ? e.linkedin : `https://${e.linkedin}`} target="_blank" rel="noreferrer" className="truncate hover:text-white">{e.linkedin}</a>}</InfoRow>
                  </div>
                  <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4">
                        {e.isAdmin && <span className="mr-auto inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300"><Shield size={12} />Admin</span>}
                        <div className={`flex gap-2 ${e.isAdmin ? '' : 'ml-auto'}`}>
                              {!isSelf && <button onClick={() => onAccess(e)} title="Role and page access" aria-label="Role and page access" className="rounded-xl border border-white/10 p-2.5 text-gray-200 transition hover:bg-white/10"><ShieldCheck size={16} /></button>}
                              {!isSelf && <button onClick={() => onToggle(e)} title={e.active ? 'Deactivate account' : 'Activate account'} aria-label="Toggle account" className={`rounded-xl border p-2.5 transition ${e.active ? 'border-white/10 text-gray-200 hover:bg-white/10' : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/15'}`}><Power size={16} /></button>}
                              <button onClick={() => onEdit(e)} title="Edit" aria-label="Edit" className="rounded-xl border border-white/10 p-2.5 text-gray-200 transition hover:bg-white/10"><Pencil size={16} /></button>
                              <button onClick={() => onPassword(e)} title="Reset password" aria-label="Reset password" className="rounded-xl border border-white/10 p-2.5 text-gray-200 transition hover:bg-white/10"><KeyRound size={16} /></button>
                              {!isSelf && <button onClick={() => onDelete(e)} title="Delete" aria-label="Delete" className="rounded-xl border border-red-500/30 p-2.5 text-red-400 transition hover:bg-red-500/15"><Trash2 size={16} /></button>}
                        </div>
                  </div>
            </article>
      );
}

const EmployeeManagement = () => {
      const qc = useQueryClient();
      const { user: me } = useContext(AuthContext);
      const [q, setQ] = useState('');
      const [filter, setFilter] = useState('all');
      const [editing, setEditing] = useState(null);
      const [pwFor, setPwFor] = useState(null);
      const [accessFor, setAccessFor] = useState(null);
      const [rolesOpen, setRolesOpen] = useState(false);

      const { data: all = [], isPending, error, refetch } = useQuery({ queryKey: ['employees'], queryFn: () => api('') });
      const remove = useMutation({
            mutationFn: (id) => api(`/${id}`, { method: 'DELETE' }),
            onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); Swal.fire({ icon: 'success', title: 'Employee deleted', timer: 1400, showConfirmButton: false }); },
            onError: toastError,
      });
      const toggle = useMutation({
            mutationFn: (e) => api(`/${e._id}/status`, { method: 'PUT', body: { active: !e.active } }),
            onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
            onError: toastError,
      });
      const onToggle = async (e) => {
            if (!e.active || (await confirm(`Deactivate ${e.name}? They will be signed out and cannot sign in until you reactivate them.`, 'Deactivate'))) toggle.mutate(e);
      };
      const onDelete = async (e) => { if (await confirm(`Delete ${e.name}? Their account is removed and this cannot be undone.`, 'Delete')) remove.mutate(e._id); };

      const counts = useMemo(() => ({
            total: all.length,
            online: all.filter((e) => e.online).length,
            present: all.filter(inToday).length,
            leave: all.filter((e) => e.today === 'leave').length,
            notIn: all.filter((e) => ['not_in', 'absent'].includes(e.today)).length,
      }), [all]);

      const shown = useMemo(() => all.filter((e) => {
            if (filter === 'admin' && !e.isAdmin) return false;
            if (filter === 'online' && !e.online) return false;
            if (filter === 'inactive' && e.active) return false;
            if (filter === 'present' && !inToday(e)) return false;
            if (filter === 'leave' && e.today !== 'leave') return false;
            if (filter === 'absent' && !['not_in', 'absent'].includes(e.today)) return false;
            return !q.trim() || `${e.name} ${e.email} ${e.designation} ${e.possition || ''} ${e.phone || ''}`.toLowerCase().includes(q.trim().toLowerCase());
      }), [all, q, filter]);

      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader
                        title="Employees"
                        subtitle="Everyone on the team, who is in today, and quick account actions."
                        action={(
                              <div className="flex flex-wrap gap-2">
                                    <button className={btnGhost} onClick={() => setRolesOpen(true)}><ShieldCheck size={16} /> Roles and access</button>
                                    <Link to="/sign_up" className={btnPrimary}><Plus size={16} /> Add employee</Link>
                              </div>
                        )}
                  />

                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
                        <Stat icon={Users} label="Total" value={counts.total} />
                        <Stat icon={Wifi} label="Online now" value={counts.online} tone="text-emerald-400" />
                        <Stat icon={UserCheck} label="In today" value={counts.present} tone="text-emerald-400" />
                        <Stat icon={Briefcase} label="On leave" value={counts.leave} tone="text-sky-400" />
                        <Stat icon={UserX} label="Not in" value={counts.notIn} tone="text-red-400" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                        <div className="relative min-w-[14rem] flex-1 sm:max-w-sm">
                              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                              <input className={`${input} !pl-9`} placeholder="Search name, email, role, phone…" value={q} onChange={(e) => setQ(e.target.value)} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                              {FILTERS.map(([k, label]) => (
                                    <button key={k} onClick={() => setFilter(k)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${filter === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'}`}>{label}</button>
                              ))}
                        </div>
                  </div>

                  {error ? (
                        <Empty>{error.message} · <button className="text-blue-400 underline" onClick={() => refetch()}>Retry</button></Empty>
                  ) : isPending ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className={`${card} h-56 animate-pulse`} />)}</div>
                  ) : shown.length === 0 ? (
                        <Empty>{all.length === 0 ? 'No employees yet. Add the first one.' : 'No employees match.'}</Empty>
                  ) : (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                              {shown.map((e) => <EmployeeCard key={e._id} e={e} isSelf={e._id === me?._id} onEdit={setEditing} onPassword={setPwFor} onDelete={onDelete} onAccess={setAccessFor} onToggle={onToggle} />)}
                        </div>
                  )}

                  {editing && <EditModal employee={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); qc.invalidateQueries({ queryKey: ['employees'] }); Swal.fire({ icon: 'success', title: 'Saved', timer: 1200, showConfirmButton: false }); }} />}
                  {pwFor && <PasswordModal employee={pwFor} onClose={() => setPwFor(null)} />}
                  {accessFor && <AccessModal employee={accessFor} onClose={() => setAccessFor(null)} onSaved={() => { setAccessFor(null); qc.invalidateQueries({ queryKey: ['employees'] }); Swal.fire({ icon: 'success', title: 'Access updated', timer: 1200, showConfirmButton: false }); }} />}
                  {rolesOpen && <RolesModal onClose={() => setRolesOpen(false)} />}
            </main>
      );
};

export default EmployeeManagement;
