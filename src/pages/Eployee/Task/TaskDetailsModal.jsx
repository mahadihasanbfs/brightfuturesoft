import JoditEditor from "jodit-react";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, Clock, History, MessageSquare, Pencil, Trash2, X } from "lucide-react";
import { base_url } from "../../../layout/Title";
import { safeHtml } from "../../../layout/safeHtml";
import { confirmDialog } from "../../../Hook/confirmDialog";

const COLUMNS = [
      ["backlog", "Backlog", "bg-slate-400"],
      ["ready", "Ready", "bg-cyan-400"],
      ["in_progress", "In Progress", "bg-amber-400"],
      ["in_review", "In Review", "bg-orange-400"],
      ["done", "Done", "bg-emerald-400"],
];
const api = async (path, method = "GET", body) => {
      const res = await fetch(`${base_url}/task/${path}`, {
            method,
            headers: { "content-type": "application/json", author: "bright_future_soft" },
            body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || "Something went wrong");
      return json;
};

const ago = (ms) => {
      if (!ms) return "";
      const s = Math.floor((Date.now() - new Date(ms).getTime()) / 1000);
      if (s < 60) return "just now";
      if (s < 3600) return `${Math.floor(s / 60)}m ago`;
      if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
      if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
      return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
const full = (ms) => (ms ? new Date(ms).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "");
const day = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "No deadline");
const initials = (n) => String(n || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

const Avatar = ({ name, src, size = "h-8 w-8" }) => (
      <span className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-[11px] font-bold text-slate-200`}>
            {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : initials(name)}
      </span>
);

const FIELD_TEXT = {
      created: (h) => `created this task in ${h.to}`,
      status: (h) => `moved it from ${h.from} to ${h.to}`,
      title: (h) => `renamed it from “${h.from}” to “${h.to}”`,
      description: () => "updated the description",
      priority: (h) => `changed the priority from ${h.from} to ${h.to}`,
      deadline: (h) => `changed the deadline from ${h.from} to ${h.to}`,
      assignees: (h) => `changed the assignees from ${h.from} to ${h.to}`,
      labels: (h) => `changed the labels from ${h.from} to ${h.to}`,
};

export default function TaskDetailsModal({ task, members, isAdmin, meId, onClose, onChanged, onDeleted }) {
      const [tab, setTab] = useState("details");
      const [editing, setEditing] = useState(false);
      const [busy, setBusy] = useState(false);
      const [error, setError] = useState("");
      const [text, setText] = useState("");
      const [form, setForm] = useState(null);
      const editorRef = useRef(null);

      const byId = useMemo(() => new Map(members.map((m) => [String(m.id), m])), [members]);
      const comments = useMemo(() => (task.comment || []).filter(Boolean).map((c) => (typeof c === "string" ? { id: c, text: c, by: {}, at: null } : c)), [task.comment]);
      const history = useMemo(() => {
            const list = [...(task.history || [])];
            if (!list.some((h) => h.field === "created")) {
                  list.push({ id: "created", at: task.create_at || null, by: task.created_by || {}, field: "created", to: "this board" });
            }
            return list.sort((a, b) => (b.at || 0) - (a.at || 0));
      }, [task.history, task.create_at, task.created_by]);

      const guard = async (fn) => {
            setBusy(true);
            setError("");
            try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(false); }
      };

      const startEdit = () => {
            setForm({ title: task.title, priority: task.priority, deadline: task.deadline || "", assignees: [...(task.assignees || [])], labels: (task.labels || []).join(", "), description: task.description || "" });
            setEditing(true);
            setTab("details");
      };

      const save = () => guard(async () => {
            if (!form.title.trim()) throw new Error("Title is required");
            const json = await api(`update-task?id=${task.id}`, "PUT", {
                  title: form.title,
                  priority: form.priority,
                  deadline: form.deadline,
                  assignees: form.assignees,
                  labels: form.labels.split(",").map((l) => l.trim()).filter(Boolean),
                  description: editorRef.current?.value ?? form.description,
            });
            setEditing(false);
            onChanged(json.data);
      });

      const setStatus = (column) => guard(async () => {
            const json = await api(`update-task?id=${task.id}`, "PUT", { column });
            onChanged(json.data);
      });

      const sendComment = () => guard(async () => {
            if (!text.trim()) return;
            await api("comment", "POST", { task_id: task.id, text });
            setText("");
            onChanged();
      });

      const removeComment = (id) => guard(async () => {
            if (!(await confirmDialog({ title: "Delete this comment?", message: "It is removed for everyone on this task.", confirmText: "Delete", tone: "danger" }))) return;
            await api(`comment?task_id=${task.id}&comment_id=${id}`, "DELETE");
            onChanged();
      });

      const remove = () => guard(async () => {
            if (!(await confirmDialog({ title: "Delete this task?", message: "The task, its comments and its history are removed permanently.", confirmText: "Delete task", tone: "danger" }))) return;
            await api(`delete-task?id=${task.id}`, "DELETE");
            onDeleted(task.id);
      });

      const creator = task.created_by || null;
      const assigneeRows = (task.assignees || []).map((a) => byId.get(String(a)) || { id: a, name: String(a), avatar: "" });
      const tabs = [["details", "Details", null], ["comments", "Comments", comments.length], ["history", "History", history.length]];
      const label = "text-xs font-bold uppercase tracking-wider text-slate-500";
      const input = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40";

      return (
            <div className="relative flex max-h-[90vh] min-h-[420px] flex-col">
                  {/* header */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-3.5 sm:px-6">
                        <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white"><CheckCircle2 size={18} /></span>
                              <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Task</p>
                                    <p className="truncate text-xs text-slate-400">#{String(task.id).slice(-8)}</p>
                              </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                              {task.can_edit && !editing && (
                                    <button onClick={startEdit} className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"><Pencil size={14} />Edit</button>
                              )}
                              {task.can_delete && (
                                    <button onClick={remove} disabled={busy} aria-label="Delete task" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-rose-400"><Trash2 size={18} /></button>
                              )}
                              <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"><X size={18} /></button>
                        </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
                        {/* main column */}
                        <div className="min-w-0 flex-1 lg:overflow-y-auto">
                              <div className="space-y-3 border-b border-slate-800 p-5 sm:p-6">
                                    {editing ? (
                                          <input aria-label="Task title" className={`${input} text-lg font-bold`} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                    ) : (
                                          <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-100 [overflow-wrap:anywhere] sm:text-3xl">{task.title}</h2>
                                    )}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
                                          {creator?.name && (
                                                <span className="flex items-center gap-2">
                                                      <Avatar name={creator.name} src={creator.image} size="h-6 w-6" />
                                                      <span>Assigned by <span className="font-semibold text-slate-200">{String(creator.id) === String(meId) ? "you" : creator.name}</span></span>
                                                </span>
                                          )}
                                          <span className="flex items-center gap-1.5" title={full(task.create_at)}><Clock size={14} />{ago(task.create_at)}</span>
                                          <span className="flex items-center gap-1.5"><MessageSquare size={14} />{comments.length} comment{comments.length === 1 ? "" : "s"}</span>
                                    </div>
                              </div>

                              {!editing && (
                                    <div className="flex gap-1 border-b border-slate-800 px-5 sm:px-6" role="tablist">
                                          {tabs.map(([key, name, count]) => (
                                                <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition ${tab === key ? "border-blue-500 text-slate-100" : "border-transparent text-slate-400 hover:text-slate-200"}`}>
                                                      {key === "history" ? <History size={14} /> : key === "comments" ? <MessageSquare size={14} /> : null}{name}
                                                      {count != null && <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">{count}</span>}
                                                </button>
                                          ))}
                                    </div>
                              )}

                              <div className="p-5 sm:p-6">
                                    {editing ? (
                                          <div className="space-y-5">
                                                <div>
                                                      <label className={`${label} mb-2 block`}>Description</label>
                                                      <div className="overflow-hidden rounded-lg border border-slate-700">
                                                            <JoditEditor ref={editorRef} value={form.description} config={{ theme: "dark", height: 240, toolbarAdaptive: false, toolbarButtonSize: "small", buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "|", "undo", "redo"], placeholder: "Describe the task..." }} />
                                                      </div>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                      <div>
                                                            <label htmlFor="tk-priority" className={`${label} mb-2 block`}>Priority</label>
                                                            <select id="tk-priority" className={input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                                                  {["low", "medium", "high", "critical"].map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
                                                            </select>
                                                      </div>
                                                      <div>
                                                            <label htmlFor="tk-deadline" className={`${label} mb-2 block`}>Deadline</label>
                                                            <input id="tk-deadline" type="date" className={input} value={form.deadline ? String(form.deadline).slice(0, 10) : ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                                                      </div>
                                                      <div className="sm:col-span-2">
                                                            <label htmlFor="tk-labels" className={`${label} mb-2 block`}>Labels <span className="font-normal normal-case tracking-normal">(comma separated)</span></label>
                                                            <input id="tk-labels" className={input} value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} />
                                                      </div>
                                                </div>
                                                <fieldset>
                                                      <legend className={`${label} mb-2`}>Assignees</legend>
                                                      <div className="grid max-h-48 gap-1.5 overflow-y-auto rounded-lg border border-slate-800 p-2 sm:grid-cols-2">
                                                            {members.map((m) => {
                                                                  const on = form.assignees.map(String).includes(String(m.id));
                                                                  return (
                                                                        <label key={m.id} className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm ${on ? "bg-blue-500/15 text-slate-100" : "text-slate-300 hover:bg-slate-800"}`}>
                                                                              <input type="checkbox" checked={on} onChange={() => setForm({ ...form, assignees: on ? form.assignees.filter((a) => String(a) !== String(m.id)) : [...form.assignees, m.id] })} className="accent-blue-500" />
                                                                              <Avatar name={m.name} src={m.avatar} size="h-6 w-6" />
                                                                              <span className="truncate">{m.name}</span>
                                                                        </label>
                                                                  );
                                                            })}
                                                      </div>
                                                </fieldset>
                                                {error && <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
                                                <div className="flex gap-2">
                                                      <button onClick={save} disabled={busy} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">{busy ? "Saving…" : "Save changes"}</button>
                                                      <button onClick={() => { setEditing(false); setError(""); }} className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800">Cancel</button>
                                                </div>
                                          </div>
                                    ) : tab === "details" ? (
                                          <div className="space-y-6">
                                                <div className="space-y-2">
                                                      <h3 className={label}>Description</h3>
                                                      {task.description ? (
                                                            <div className="tk-rich max-w-none [overflow-wrap:anywhere]" dangerouslySetInnerHTML={{ __html: safeHtml(task.description) }} />
                                                      ) : <p className="text-sm italic text-slate-500">No description provided.</p>}
                                                </div>
                                                {task.images?.length > 0 && (
                                                      <div className="space-y-2">
                                                            <h3 className={label}>Attachments</h3>
                                                            <div className="grid gap-3 sm:grid-cols-2">
                                                                  {task.images.map((img, i) => (
                                                                        <a key={i} href={img} target="_blank" rel="noopener noreferrer" className="block aspect-video overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                                                                              <img src={img} alt={`Attachment ${i + 1}`} className="h-full w-full object-cover" />
                                                                        </a>
                                                                  ))}
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    ) : tab === "comments" ? (
                                          <div className="space-y-5">
                                                {comments.length === 0 ? (
                                                      <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">No comments yet. Start the conversation below.</p>
                                                ) : (
                                                      <ul className="space-y-4">
                                                            {comments.map((c) => {
                                                                  const isCreator = c.by?.id && String(c.by.id) === String(creator?.id);
                                                                  const isMine = c.by?.id && String(c.by.id) === String(meId);
                                                                  const isAssignee = (task.assignees || []).map(String).includes(String(c.by?.id));
                                                                  return (
                                                                        <li key={c.id} className="flex gap-3">
                                                                              <Avatar name={c.by?.name} src={c.by?.image} />
                                                                              <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
                                                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                                                          <span className="text-sm font-semibold text-slate-100">{isMine ? "You" : c.by?.name || "Unknown"}</span>
                                                                                          {isCreator && <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-300">Assigned this task</span>}
                                                                                          {!isCreator && isAssignee && <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-300">Assignee</span>}
                                                                                          <span className="text-xs text-slate-500" title={full(c.at)}>{ago(c.at)}</span>
                                                                                          {(isMine || isAdmin) && c.by && <button onClick={() => removeComment(c.id)} className="ml-auto text-xs text-slate-500 hover:text-rose-400">Delete</button>}
                                                                                    </div>
                                                                                    <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-300 [overflow-wrap:anywhere]">{c.text}</p>
                                                                              </div>
                                                                        </li>
                                                                  );
                                                            })}
                                                      </ul>
                                                )}
                                                <div className="space-y-2">
                                                      <label htmlFor="tk-comment" className="sr-only">Add a comment</label>
                                                      <textarea id="tk-comment" rows={3} maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendComment(); }} placeholder="Write a comment…  (Ctrl+Enter to send)" className={input} />
                                                      <div className="flex items-center justify-between">
                                                            <span className="text-xs text-slate-500">{text.length}/2000</span>
                                                            <button onClick={sendComment} disabled={busy || !text.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">Comment</button>
                                                      </div>
                                                </div>
                                                {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
                                          </div>
                                    ) : (
                                          <ol className="relative space-y-5 border-l border-slate-800 pl-6">
                                                {history.map((h) => (
                                                      <li key={h.id} className="relative">
                                                            <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-blue-500" aria-hidden="true" />
                                                            <p className="text-sm text-slate-300 [overflow-wrap:anywhere]"><span className="font-semibold text-slate-100">{String(h.by?.id) === String(meId) ? "You" : h.by?.name || "Someone"}</span> {(FIELD_TEXT[h.field] || (() => `updated ${h.field}`))(h)}</p>
                                                            <p className="text-xs text-slate-500" title={full(h.at)}>{h.at ? `${ago(h.at)} · ${full(h.at)}` : "Date unknown"}</p>
                                                      </li>
                                                ))}
                                          </ol>
                                    )}
                              </div>
                        </div>

                        {/* side column */}
                        <aside className="space-y-5 border-t border-slate-800 bg-slate-900/30 p-5 sm:p-6 lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-t-0">
                              <div className="space-y-2">
                                    <label htmlFor="tk-status" className={label}>Status</label>
                                    <select id="tk-status" value={task.column} disabled={busy || !task.can_move} onChange={(e) => setStatus(e.target.value)} className={input}>
                                          {COLUMNS.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                                    </select>
                              </div>
                              <div className="space-y-2">
                                    <p className={label}>Assigned by</p>
                                    {creator?.name ? (
                                          <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"><Avatar name={creator.name} src={creator.image} size="h-6 w-6" /><span className="truncate">{creator.name}</span></div>
                                    ) : <p className="text-sm text-slate-500">Not recorded (older task)</p>}
                              </div>
                              <div className="space-y-2">
                                    <p className={label}>Assignees</p>
                                    {assigneeRows.length ? (
                                          <ul className="space-y-1.5">
                                                {assigneeRows.map((m) => (
                                                      <li key={m.id} className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"><Avatar name={m.name} src={m.avatar} size="h-6 w-6" /><span className="truncate">{m.name}</span></li>
                                                ))}
                                          </ul>
                                    ) : <p className="text-sm text-slate-500">No assignees</p>}
                              </div>
                              <div className="space-y-2">
                                    <p className={label}>Priority</p>
                                    <span className={`tk-prio tk-prio-${task.priority || "medium"} inline-block capitalize`}>{task.priority}</span>
                              </div>
                              <div className="space-y-2">
                                    <p className={label}>Labels</p>
                                    {task.labels?.length ? (
                                          <div className="flex flex-wrap gap-1.5">{task.labels.map((l, i) => <span key={i} className="max-w-full truncate rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium capitalize text-slate-300">{l}</span>)}</div>
                                    ) : <p className="text-sm text-slate-500">No labels</p>}
                              </div>
                              <div className="space-y-2">
                                    <p className={label}>Deadline</p>
                                    <p className="flex items-center gap-2 text-sm text-slate-300"><Calendar size={14} className="text-slate-500" />{day(task.deadline)}</p>
                              </div>
                              {task.column !== "done" && task.can_move && (
                                    <button onClick={() => setStatus("done")} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">Complete task <ArrowRight size={16} /></button>
                              )}
                              {error && !editing && tab !== "comments" && <p role="alert" className="text-sm text-rose-300">{error}</p>}
                        </aside>
                  </div>
            </div>
      );
}
