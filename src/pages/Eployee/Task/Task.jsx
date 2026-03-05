import JoditEditor from "jodit-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, Calendar, CheckCircle2, ChevronDown, Clock, MessageSquare, MoreHorizontal, Plus, Trash2, X, User } from "lucide-react";
import { base_url } from "../../../layout/Title";
import uploadImage from "../../../Hook/ImageUpload";

function Modal({ open, onClose, children }) {
      if (!open) return null;

      return (
            <div className="fixed inset-0 z-50 text-white">
                  <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={onClose}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-6xl rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl overflow-hidden border border-slate-800/50 max-h-[90vh] overflow-y-auto">
                              {children}
                        </div>
                  </div>
            </div>
      );
}

function timeAgo(date) {
      const now = new Date();
      const past = new Date(date);
      const diff = Math.floor((now - past) / 1000); // seconds

      const minutes = Math.floor(diff / 60);
      const hours = Math.floor(diff / 3600);
      const days = Math.floor(diff / 86400);
      const months = Math.floor(diff / 2592000);
      const years = Math.floor(diff / 31536000);

      if (diff < 60) return "Just now";
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
      if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
      return `${years} year${years > 1 ? "s" : ""} ago`;
}

function computeNewOrder({ beforeOrder, afterOrder }) {
      if (typeof beforeOrder === "number" && typeof afterOrder === "number") {
            return (beforeOrder + afterOrder) / 2;
      }
      if (typeof afterOrder === "number") return afterOrder - 1000;
      if (typeof beforeOrder === "number") return beforeOrder + 1000;
      return Date.now();
}

function sanitizeTextFromHtml(html) {
      return String(html || "").replace(/<[^>]*>/g, "");
}

function IconChevronDown() {
      return (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400" aria-hidden="true">
                  <path d="M3.22 5.97a.75.75 0 0 1 1.06 0L8 9.69l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 7.03a.75.75 0 0 1 0-1.06Z" />
            </svg>
      );
}

function IconX() {
      return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400" aria-hidden="true">
                  <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 1 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
            </svg>
      );
}

function IconBack() {
      return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-300" aria-hidden="true">
                  <path d="M7.25 12.5a.75.75 0 0 1 0-1.06L10.69 8 7.25 4.56A.75.75 0 1 1 8.31 3.5l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0Z" />
                  <path d="M3 8a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 8Z" />
            </svg>
      );
}

function IconPaperclip() {
      return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-slate-400" aria-hidden="true">
                  <path d="M4.5 7.75V11a3.5 3.5 0 0 0 7 0V4.75a2.25 2.25 0 0 0-4.5 0V11a1 1 0 1 0 2 0V6.25a.75.75 0 0 1 1.5 0V11a2.5 2.5 0 0 1-5 0V4.75a3.75 3.75 0 0 1 7.5 0V11a5 5 0 0 1-10 0V7.75a.75.75 0 0 1 1.5 0Z" />
            </svg>
      );
}

function ChipDropdown({
      leftIcon,
      label,
      valueText,
      open,
      setOpen,
      children,
}) {
      const wrapperRef = useRef(null);
      const buttonRef = useRef(null);
      const dropdownRef = useRef(null);
      const [position, setPosition] = useState("bottom");

      /* ---------------- Auto Position ---------------- */
      useLayoutEffect(() => {
            if (!open) return;

            function updatePosition() {
                  const buttonRect = buttonRef.current?.getBoundingClientRect();
                  const dropdownRect = dropdownRef.current?.getBoundingClientRect();

                  if (!buttonRect || !dropdownRect) return;

                  const spaceBelow = window.innerHeight - buttonRect.bottom;
                  const spaceAbove = buttonRect.top;

                  if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
                        setPosition("top");
                  } else {
                        setPosition("bottom");
                  }
            }

            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition);

            return () => {
                  window.removeEventListener("resize", updatePosition);
                  window.removeEventListener("scroll", updatePosition);
            };
      }, [open]);

      /* ---------------- Outside Click Close ---------------- */
      useEffect(() => {
            if (!open) return;

            function handleClickOutside(e) {
                  if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                        setOpen(false);
                  }
            }

            document.addEventListener("mousedown", handleClickOutside);

            return () => {
                  document.removeEventListener("mousedown", handleClickOutside);
            };
      }, [open, setOpen]);

      return (
            <div ref={wrapperRef} className="relative">
                  <button
                        ref={buttonRef}
                        type="button"
                        onClick={(e) => {
                              e.stopPropagation();
                              setOpen((v) => !v);
                        }}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg
                        bg-slate-800/50 border border-slate-700/50
                        text-slate-200 text-sm font-medium
                        hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
                  >
                        <span className="text-slate-400">{leftIcon}</span>
                        <span>
                              {label}
                              {valueText && (
                                    <span className="font-normal text-slate-400 ml-1">
                                          : {valueText}
                                    </span>
                              )}
                        </span>
                        <IconChevronDown />
                  </button>

                  {open && (
                        <div
                              ref={dropdownRef}
                              className={`absolute z-50 w-96 rounded-xl
                              border border-slate-700/50 bg-slate-900
                              shadow-2xl overflow-hidden
                              ${position === "bottom"
                                          ? "mt-2 top-full"
                                          : "mb-2 bottom-full"
                                    }`}
                        >
                              {children}
                        </div>
                  )}
            </div>
      );
}

function DropdownHeader({ title, onClose }) {
      return (
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                  <div className="text-sm font-semibold text-slate-200">{title}</div>
                  <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                        aria-label="Close"
                  >
                        <IconX />
                  </button>
            </div>
      );
}

function PriorityBadge({ priority }) {
      const config = {
            low: { label: "Low", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20", icon: Clock },
            medium: { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: AlertCircle },
            high: { label: "High", color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: AlertCircle },
            critical: { label: "Critical", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: AlertCircle },
      };

      const p = config[priority.toLowerCase()] || config.medium;
      const Icon = p.icon;

      return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${p.color}`}>
                  <Icon size={12} />
                  {p.label}
            </span>
      );
}

function DropdownList({ children }) {
      return <div className="max-h-72 overflow-auto p-2">{children}</div>;
}

function DropdownItem({ active, onClick, children, right }) {
      return (
            <button
                  type="button"
                  onClick={onClick}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150
        ${active
                              ? "bg-blue-500/20 text-slate-100 border border-blue-500/30"
                              : "text-slate-300 hover:bg-slate-800/70 border border-transparent"
                        }`}
            >
                  <div className="flex items-center justify-between gap-2">
                        <div className="truncate">{children}</div>
                        {right ? <div>{right}</div> : null}
                  </div>
            </button>
      );
}

function LevelPill({ label, colorClass }) {
      return (
            <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap ${colorClass}`}>
                  {label}
            </span>
      );
}

function TaskManagement() {
      const [draggedId, setDraggedId] = useState(null);
      const [dragOverColumn, setDragOverColumn] = useState(null);
      const [dropTarget, setDropTarget] = useState({ columnId: null, beforeId: null });

      const [addModalOpen, setAddModalOpen] = useState(false);
      const [addColumnId, setAddColumnId] = useState(null);
      const [addStep, setAddStep] = useState(1);
      const [issueType, setIssueType] = useState(null);
      const [newDescription, setNewDescription] = useState("");
      const [deadline, setDeadline] = useState("");
      const [selectedAssignees, setSelectedAssignees] = useState([]);
      const [selectedLabels, setSelectedLabels] = useState([]);

      const [assigneeOpen, setAssigneeOpen] = useState(false);
      const [labelOpen, setLabelOpen] = useState(false);
      const [issueTypeOpen, setIssueTypeOpen] = useState(false);
      const [priorityOpen, setPriorityOpen] = useState(false);

      const [labelSearch, setLabelSearch] = useState("");
      const [customLabels, setCustomLabels] = useState([]);
      const [imageFiles, setImageFiles] = useState([]);
      const imageInputRef = useRef(null);
      const [createMore, setCreateMore] = useState(false);
      const [saving, setSaving] = useState(false);

      const [viewModalOpen, setViewModalOpen] = useState(false);
      const [selectedTask, setSelectedTask] = useState(null);
      const editorRef = useRef(null);

      const COLUMNS = useMemo(
            () => [
                  { id: "backlog", label: "Backlog", color: "slate", icon: "📋" },
                  { id: "ready", label: "Ready", color: "cyan", icon: "🎯" },
                  { id: "in_progress", label: "In Progress", color: "amber", icon: "⚡" },
                  { id: "in_review", label: "In Review", color: "orange", icon: "👀" },
                  { id: "done", label: "Done", color: "emerald", icon: "✓" },
            ],
            []
      );

      const { data: teamMembers = [] } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        method: "GET",
                  });
                  const data = await res.json();
                  return data.data || [];
            },
      });

      const TEAM_MEMBERS = useMemo(() => {
            return (teamMembers || []).map((u, idx) => ({
                  id: u?.id || u?._id || u?.username || u?.email || `user-${idx}`,
                  name: u?.name || u?.fullName || u?.username || u?.email || "Unknown",
                  avatar: u?.image || u?.photoURL || "",
                  email: u?.email || "",
            }));
      }, [teamMembers]);

      const PRIORITIES = useMemo(
            () => [
                  { id: "low", label: "Low", color: "bg-cyan-900/30 border-cyan-700/50 text-cyan-300" },
                  { id: "medium", label: "Medium", color: "bg-amber-900/30 border-amber-700/50 text-amber-300" },
                  { id: "high", label: "High", color: "bg-orange-900/30 border-orange-700/50 text-orange-300" },
                  { id: "critical", label: "Critical", color: "bg-rose-900/30 border-rose-700/50 text-rose-300" },
            ],
            []
      );

      const [priority, setPriority] = useState("medium");

      const DEFAULT_LABELS = useMemo(
            () => [
                  { id: "ui", name: "ui" },
                  { id: "backend", name: "backend" },
                  { id: "bug", name: "bug" },
                  { id: "enhancement", name: "enhancement" },
            ],
            []
      );

      const ALL_LABELS = useMemo(() => {
            const map = new Map();
            for (const l of [...DEFAULT_LABELS, ...customLabels]) {
                  map.set(l.id, l);
            }
            return Array.from(map.values());
      }, [DEFAULT_LABELS, customLabels]);

      const filteredLabels = useMemo(() => {
            const q = labelSearch.trim().toLowerCase();
            if (!q) return ALL_LABELS;
            return ALL_LABELS.filter((l) => String(l.name).toLowerCase().includes(q));
      }, [ALL_LABELS, labelSearch]);

      const labelExactExists = useMemo(() => {
            const q = labelSearch.trim().toLowerCase();
            if (!q) return true;
            return ALL_LABELS.some((l) => String(l.name).toLowerCase() === q);
      }, [ALL_LABELS, labelSearch]);

      const createLabelFromSearch = () => {
            const name = labelSearch.trim();
            if (!name) return;
            const id = name.toLowerCase().replace(/\s+/g, "_");
            const exists = ALL_LABELS.some((l) => l.id === id || String(l.name).toLowerCase() === name.toLowerCase());
            if (exists) return;
            const newLabel = { id, name };
            setCustomLabels((prev) => [...prev, newLabel]);
            setSelectedLabels((prev) => (prev.includes(id) ? prev : [...prev, id]));
            setLabelSearch("");
      };

      const { data: getTasks = [], refetch, isLoading } = useQuery({
            queryKey: ["tasks"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/task/get-task`, {
                        method: "GET",
                        headers: { "content-type": "application/json", author: "bright_future_soft" },
                  });
                  const data = await res.json();
                  return data.data || [];
            },
      });

      const tasks = useMemo(() => {
            return (getTasks || []).map((t, index) => ({
                  id: t?.id ?? t?._id ?? `temp-${index}`,
                  title: t?.title ?? "",
                  description: t?.description ?? "",
                  column: String(t?.column ?? "backlog").toLowerCase(),
                  type: t?.type ?? "blank",
                  assignees: t?.assignees ?? [],
                  labels: t?.labels ?? [],
                  deadline: t?.deadline ?? "",
                  priority: t?.priority ?? t?.level ?? "medium",
                  images: t?.images ?? t?.attachments ?? [],
                  order: typeof t?.order === "number" ? t.order : index * 1000,
                  create_at: t?.create_at ?? "",
                  comment: t?.comment ?? [],
            }));
      }, [getTasks]);

      const tasksByColumn = useMemo(() => {
            const map = {};
            for (const c of COLUMNS) map[c.id] = [];
            for (const t of tasks) {
                  if (!map[t.column]) map[t.column] = [];
                  map[t.column].push(t);
            }
            for (const colId of Object.keys(map)) {
                  map[colId].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            }
            return map;
      }, [tasks, COLUMNS]);

      const closeAllDropdowns = () => {
            setAssigneeOpen(false);
            setLabelOpen(false);
            setIssueTypeOpen(false);
            setPriorityOpen(false);
      };

      const closeAddModal = () => {
            setAddModalOpen(false);
            setAddColumnId(null);
            setAddStep(1);
            setIssueType(null);
            setNewDescription("");
            setDeadline("");
            setSelectedAssignees([]);
            setSelectedLabels([]);
            setLabelSearch("");
            setPriority("medium");
            setImageFiles([]);
            setCreateMore(false);
            closeAllDropdowns();
      };

      const openAddModal = (columnId) => {
            setAddColumnId(columnId);
            setAddModalOpen(true);
            setAddStep(1);
            setIssueType(null);
            setNewDescription("");
            setDeadline("");
            setSelectedAssignees([]);
            setSelectedLabels([]);
            setLabelSearch("");
            setPriority("medium");
            setImageFiles([]);
            setCreateMore(false);
            closeAllDropdowns();
      };

      const goToStep2WithTemplate = (type) => {
            setIssueType(type);
            setAddStep(2);
            closeAllDropdowns();
      };

      const toggleAssignee = (id) => {
            setSelectedAssignees((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
      };

      const toggleLabel = (id) => {
            setSelectedLabels((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
      };

      const handleImagesPick = (e) => {
            const files = Array.from(e.target.files || []);
            if (!files.length) return;

            setImageFiles((prev) => [...prev, ...files]);
            e.target.value = "";
      };

      console.log(imageFiles);



      const addTask = async (e) => {
            e.preventDefault();
            const form = e.target;
            const title = (form.title?.value || "").trim();
            const description = (form.description?.value || "").trim() || String(newDescription || "");

            if (!title) return;

            try {
                  setSaving(true);
                  const colTasks = tasksByColumn[String(addColumnId).toLowerCase()] || [];
                  const last = colTasks[colTasks.length - 1];
                  const order = computeNewOrder({
                        beforeOrder: typeof last?.order === "number" ? last.order : undefined,
                        afterOrder: undefined,
                  });

                  let uploadedImageUrls = [];

                  if (imageFiles.length) {
                        const uploadPromises = imageFiles.map((file) =>
                              uploadImage(file)
                        );

                        uploadedImageUrls = await Promise.all(uploadPromises);
                  }

                  const res = await fetch(`${base_url}/task/add-task`, {
                        method: "POST",
                        headers: { "content-type": "application/json", author: "bright_future_soft" },
                        body: JSON.stringify({
                              title,
                              column: addColumnId,
                              description,
                              type: issueType || "blank",
                              assignees: selectedAssignees,
                              labels: selectedLabels,
                              deadline,
                              priority,
                              images: uploadedImageUrls,
                              order,
                              comment: [],
                              create_at: new Date().getTime()
                        }),
                  });

                  const data = await res.json();

                  if (data?.success) {
                        refetch();
                        if (createMore) {
                              form.reset();
                              setNewDescription("");
                              setDeadline("");
                              setSelectedAssignees([]);
                              setSelectedLabels([]);
                              setLabelSearch("");
                              setPriority("medium");
                              setImageFiles([]);
                              closeAllDropdowns();
                        } else {
                              closeAddModal();
                        }
                  } else {
                        console.error("Create failed:", data);
                  }
            } catch (error) {
                  console.error(error);
            } finally {
                  setSaving(false);
            }
      };

      const updateTask = async ({ taskId, columnId, order }) => {
            try {
                  await fetch(`${base_url}/task/update-task?id=${taskId}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json", author: "bright_future_soft" },
                        body: JSON.stringify({ column: columnId, order }),
                  });
                  refetch();
            } catch (error) {
                  console.error(error);
            }
      };

      const markTaskComplete = async (taskId) => {
            try {
                  await fetch(`${base_url}/task/update-task?id=${taskId}`, {
                        method: "PUT",
                        headers: { "content-type": "application/json", author: "bright_future_soft" },
                        body: JSON.stringify({ column: "done" }),
                  });
                  refetch();
                  // close modal if viewing the same task
                  if (selectedTask && selectedTask.id === taskId) closeViewModal();
            } catch (error) {
                  console.error(error);
            }
      };

      const handleDropOnColumn = async (e, columnId) => {
            e.preventDefault();
            if (!draggedId) return;
            const colId = String(columnId).toLowerCase();
            const colTasks = tasksByColumn[colId] || [];
            const last = colTasks[colTasks.length - 1];
            const newOrder = computeNewOrder({
                  beforeOrder: typeof last?.order === "number" ? last.order : undefined,
                  afterOrder: undefined,
            });
            await updateTask({ taskId: draggedId, columnId: colId, order: newOrder });
            setDraggedId(null);
            setDragOverColumn(null);
            setDropTarget({ columnId: null, beforeId: null });
      };

      const handleDropBeforeTask = async (e, columnId, beforeTaskId) => {
            e.preventDefault();
            e.stopPropagation();
            if (!draggedId) return;
            const colId = String(columnId).toLowerCase();
            const colTasks = tasksByColumn[colId] || [];
            const beforeIndex = colTasks.findIndex((t) => t.id === beforeTaskId);
            const afterTask = colTasks[beforeIndex];
            const prevTask = beforeIndex > 0 ? colTasks[beforeIndex - 1] : null;
            const newOrder = computeNewOrder({
                  beforeOrder: typeof prevTask?.order === "number" ? prevTask.order : undefined,
                  afterOrder: typeof afterTask?.order === "number" ? afterTask.order : undefined,
            });
            await updateTask({ taskId: draggedId, columnId: colId, order: newOrder });
            setDraggedId(null);
            setDragOverColumn(null);
            setDropTarget({ columnId: null, beforeId: null });
      };

      const delete_task = async (taskId) => {
            console.log(taskId);
            try {
                  await fetch(`${base_url}/task/delete-task?id=${taskId}`, {
                        method: "DELETE",
                        headers: { "content-type": "application/json", author: "bright_future_soft" },
                  });
                  refetch();
                  if (selectedTask && selectedTask.id === taskId) closeViewModal();
            } catch (error) {
                  console.error(error);
            }
      }

      const openViewModal = (task) => {
            setSelectedTask(task);
            setViewModalOpen(true);
      };

      const closeViewModal = () => {
            setSelectedTask(null);
            setViewModalOpen(false);
      };

      const priorityCfg = PRIORITIES.find((p) => p.id === priority);

      if (isLoading) {
            return (
                  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                        <div className="text-slate-400 text-lg font-medium">Loading tasks...</div>
                  </div>
            );
      }

      return (
            <>
                  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 ">
                        <div className="mb-8">
                              <h1 className="text-3xl font-bold text-slate-100 mb-2">Task Board</h1>
                              <p className="text-slate-400">Manage your team's workflow</p>
                        </div>

                        <div className="flex overflow-x-auto gap-6 pb-4">
                              {COLUMNS.map((column) => {
                                    const colId = String(column.id).toLowerCase();
                                    const columnTasks = tasksByColumn[colId] || [];

                                    return (
                                          <div
                                                key={column.id}
                                                className={`w-96 flex-shrink-0 rounded-xl p-5 flex flex-col border transition-all duration-200
                ${dragOverColumn === column.id
                                                            ? "bg-slate-800/60 ring-2 ring-blue-500/40 border-blue-500/30"
                                                            : "bg-slate-900/40 border-slate-800/50 backdrop-blur-sm"
                                                      }`}
                                                onDragOver={(e) => {
                                                      e.preventDefault();
                                                      setDragOverColumn(column.id);
                                                }}
                                                onDragLeave={() => setDragOverColumn(null)}
                                                onDrop={(e) => handleDropOnColumn(e, column.id)}
                                          >
                                                <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-800/50">
                                                      <div className="flex items-center gap-2">
                                                            <span className="text-xl">{column.icon}</span>
                                                            <h2 className="font-bold text-slate-100 text-base">
                                                                  {column.label}
                                                            </h2>
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-400 text-xs font-semibold">
                                                                  {columnTasks.length}
                                                            </span>
                                                      </div>
                                                </div>

                                                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                                                      {columnTasks.map((task) => {
                                                            const taskPriorityCfg = PRIORITIES.find((p) => p.id === task.priority) || null;

                                                            return (
                                                                  <div key={task.id} className="relative group">
                                                                        <div
                                                                              onDragOver={(e) => {
                                                                                    e.preventDefault();
                                                                                    setDropTarget({ columnId: colId, beforeId: task.id });
                                                                              }}
                                                                              onDrop={(e) => handleDropBeforeTask(e, colId, task.id)}
                                                                              className={`h-2 rounded transition-colors ${dropTarget.columnId === colId && dropTarget.beforeId === task.id
                                                                                    ? "bg-blue-500/30"
                                                                                    : ""
                                                                                    }`}
                                                                        />
                                                                        <div
                                                                              draggable
                                                                              onDragStart={() => setDraggedId(task.id)}
                                                                              onDragEnd={() => {
                                                                                    setDraggedId(null);
                                                                                    setDragOverColumn(null);
                                                                                    setDropTarget({ columnId: null, beforeId: null });
                                                                              }}
                                                                              onClick={() => openViewModal(task)}
                                                                              className={`p-4 rounded-xl border bg-slate-900/60 backdrop-blur-sm cursor-pointer
                          transition-all duration-200 hover:shadow-xl hover:shadow-slate-900/50 hover:-translate-y-0.5
                          ${draggedId === task.id ? "opacity-40 scale-95" : "hover:bg-slate-900/80 border-slate-800/50 hover:border-slate-700"}
                        `}
                                                                        >
                                                                              <div className="flex items-start justify-between gap-3 mb-2">
                                                                                    <div className="text-sm font-semibold text-slate-100 break-words flex-1 leading-snug">
                                                                                          {task.title}
                                                                                    </div>
                                                                                    {taskPriorityCfg ? (
                                                                                          <LevelPill label={taskPriorityCfg.label} colorClass={taskPriorityCfg.color} />
                                                                                    ) : null}
                                                                              </div>

                                                                              {task.description ? (
                                                                                    <div className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                                                                                          {sanitizeTextFromHtml(task.description)}
                                                                                    </div>
                                                                              ) : null}

                                                                              {task.labels && task.labels.length > 0 && (
                                                                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                                                                          {task.labels.slice(0, 3).map((label, idx) => (
                                                                                                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800/50 border border-slate-700/50 text-slate-300 text-xs font-medium">
                                                                                                      {label}
                                                                                                </span>
                                                                                          ))}
                                                                                          {task.labels.length > 3 && (
                                                                                                <span className="px-2 py-0.5 rounded-md bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-medium">
                                                                                                      +{task.labels.length - 3}
                                                                                                </span>
                                                                                          )}
                                                                                    </div>
                                                                              )}

                                                                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                                                                                    {task.assignees && task.assignees.length > 0 ? (
                                                                                          <div className="flex -space-x-2">
                                                                                                {task.assignees.slice(0, 3).map((assignee, idx) => (
                                                                                                      <div
                                                                                                            key={idx}
                                                                                                            className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-200 text-xs font-semibold"
                                                                                                            title={assignee}
                                                                                                      >
                                                                                                            <img className="w-5 h-5 rounded-full object-cover" src={TEAM_MEMBERS.find((m) => m.id === assignee)?.avatar || ''} alt="" />
                                                                                                      </div>
                                                                                                ))}
                                                                                                {task.assignees.length > 3 && (
                                                                                                      <div className="h-7 w-7 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-slate-400 text-xs font-semibold">
                                                                                                            +{task.assignees.length - 3}
                                                                                                      </div>
                                                                                                )}
                                                                                          </div>
                                                                                    ) : (
                                                                                          <div className="text-xs text-slate-500">No assignees</div>
                                                                                    )}

                                                                                    {task.deadline && (
                                                                                          <div className="flex items-center gap-1 text-xs text-slate-400">
                                                                                                <Calendar size={12} />
                                                                                                {
                                                                                                      task.deadline
                                                                                                            ? new Date(task.deadline).toLocaleDateString("en-GB", {
                                                                                                                  day: "numeric",
                                                                                                                  month: "long",
                                                                                                                  year: "numeric",
                                                                                                            })
                                                                                                            : "No deadline"
                                                                                                }
                                                                                          </div>
                                                                                    )}
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            );
                                                      })}
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-slate-800/50">
                                                      <button
                                                            onClick={() => openAddModal(column.id)}
                                                            className="w-full px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-800/40 hover:bg-slate-800/70 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
                                                      >
                                                            <Plus size={16} />
                                                            Add Task
                                                      </button>
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>

                  <Modal open={addModalOpen} onClose={closeAddModal}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                              <div className="flex items-center gap-3 min-w-0">
                                    {addStep === 2 ? (
                                          <button
                                                type="button"
                                                onClick={() => setAddStep(1)}
                                                className="p-2 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                                                title="Back"
                                          >
                                                <IconBack />
                                          </button>
                                    ) : null}
                                    <div className="min-w-0">
                                          <div className="text-base font-bold text-slate-100 truncate">
                                                {addStep === 1 ? "Create New Task" : `New ${issueType || ""} task`}
                                          </div>
                                    </div>
                              </div>
                              <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="p-2 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
                                    aria-label="Close"
                              >
                                    <IconX />
                              </button>
                        </div>

                        <div className="p-6" onMouseDown={closeAllDropdowns}>
                              {addStep === 1 ? (
                                    <div className="space-y-3">
                                          {[
                                                { id: "bug", title: "Bug report", desc: "Report a problem or issue", icon: "🐛" },
                                                { id: "feature", title: "Feature request", desc: "Suggest a new feature or improvement", icon: "✨" },
                                                { id: "blank", title: "Blank task", desc: "Start from scratch", icon: "📝" },
                                          ].map((t) => (
                                                <button
                                                      key={t.id}
                                                      onClick={() => goToStep2WithTemplate(t.id)}
                                                      className="w-full text-left border border-slate-800 rounded-xl px-5 py-4 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-200 group"
                                                >
                                                      <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{t.icon}</span>
                                                            <div>
                                                                  <div className="font-semibold text-slate-100 group-hover:text-white">{t.title}</div>
                                                                  <div className="text-sm text-slate-400">{t.desc}</div>
                                                            </div>
                                                      </div>
                                                </button>
                                          ))}
                                    </div>
                              ) : (
                                    <form onSubmit={addTask} className="space-y-5" onMouseDown={(e) => e.stopPropagation()}>
                                          <div>
                                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                                      Title <span className="text-rose-400">*</span>
                                                </label>
                                                <input
                                                      name="title"
                                                      placeholder="Enter task title..."
                                                      className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-slate-100
                             placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                />
                                          </div>

                                          <div>
                                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                                      Description
                                                </label>
                                                <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-900">
                                                      <JoditEditor
                                                            ref={editorRef}
                                                            name="description"
                                                            config={{
                                                                  theme: "dark",
                                                                  height: 260,
                                                                  toolbarSticky: false,
                                                                  toolbarAdaptive: false,
                                                                  toolbarButtonSize: "small",
                                                                  buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "|", "undo", "redo"],
                                                                  uploader: { insertImageAsBase64URI: true },
                                                                  placeholder: "Describe the task...",
                                                            }}
                                                      />
                                                      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-900/50">
                                                            <button
                                                                  type="button"
                                                                  onClick={() => imageInputRef.current?.click()}
                                                                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
                                                            >
                                                                  <IconPaperclip />
                                                                  Attach files
                                                            </button>
                                                            <input
                                                                  ref={imageInputRef}
                                                                  name="img_url"
                                                                  type="file"
                                                                  multiple
                                                                  className="hidden"
                                                                  onChange={handleImagesPick}
                                                            />
                                                      </div>
                                                </div>

                                                {imageFiles.length > 0 && (
                                                      <div className="mt-3 space-y-2">
                                                            {imageFiles.map((f, idx) => (
                                                                  <div
                                                                        key={`${f.name}-${idx}`}
                                                                        className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900/50"
                                                                  >
                                                                        <div className="min-w-0 flex-1">
                                                                              <div className="text-sm text-slate-200 truncate">{f.name}</div>
                                                                              <div className="text-xs text-slate-500">
                                                                                    {(f.size / 1024).toFixed(1)} KB
                                                                              </div>
                                                                        </div>
                                                                        <button
                                                                              type="button"
                                                                              onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                                                                              className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                                                                              title="Remove"
                                                                        >
                                                                              <IconX />
                                                                        </button>
                                                                  </div>
                                                            ))}
                                                      </div>
                                                )}
                                          </div>

                                          <div className="flex flex-wrap gap-2">
                                                <ChipDropdown
                                                      leftIcon={<User size={16} />}
                                                      label="Assignee"
                                                      valueText={selectedAssignees.length ? `${selectedAssignees.length} selected` : ""}
                                                      open={assigneeOpen}
                                                      setOpen={(v) => {
                                                            setAssigneeOpen(v);
                                                            setLabelOpen(false);
                                                            setIssueTypeOpen(false);
                                                            setPriorityOpen(false);
                                                      }}
                                                >
                                                      <DropdownHeader title="Assignees" onClose={() => setAssigneeOpen(false)} />
                                                      <DropdownList>
                                                            {TEAM_MEMBERS.length ? (
                                                                  TEAM_MEMBERS.map((m) => {
                                                                        const active = selectedAssignees.includes(m.id);
                                                                        return (
                                                                              <DropdownItem
                                                                                    key={m.id}
                                                                                    active={active}
                                                                                    onClick={() => toggleAssignee(m.id)}
                                                                                    right={active ? <CheckCircle2 size={16} className="text-blue-400" /> : null}
                                                                              >
                                                                                    <div className="flex items-center gap-2.5">
                                                                                          <div className="h-7 w-7 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-xs font-semibold text-slate-200">
                                                                                                {m.avatar ? (
                                                                                                      <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                                                                                                ) : (
                                                                                                      String(m.name || "U").slice(0, 2).toUpperCase()
                                                                                                )}
                                                                                          </div>
                                                                                          <div className="min-w-0">
                                                                                                <div className="truncate font-medium">{m.name}</div>
                                                                                                <div className="text-xs text-slate-500 truncate">{m.email}</div>
                                                                                          </div>
                                                                                    </div>
                                                                              </DropdownItem>
                                                                        );
                                                                  })
                                                            ) : (
                                                                  <div className="p-3 text-sm text-slate-500">No users found.</div>
                                                            )}
                                                      </DropdownList>
                                                </ChipDropdown>

                                                <ChipDropdown
                                                      leftIcon="🏷️"
                                                      label="Label"
                                                      valueText={selectedLabels.length ? `${selectedLabels.length} selected` : ""}
                                                      open={labelOpen}
                                                      setOpen={(v) => {
                                                            setLabelOpen(v);
                                                            setAssigneeOpen(false);
                                                            setIssueTypeOpen(false);
                                                            setPriorityOpen(false);
                                                      }}
                                                >
                                                      <DropdownHeader title="Labels" onClose={() => setLabelOpen(false)} />
                                                      <div className="p-3 border-b border-slate-800 bg-slate-900/50">
                                                            <input
                                                                  value={labelSearch}
                                                                  onChange={(e) => setLabelSearch(e.target.value)}
                                                                  placeholder="Search or create labels..."
                                                                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                            />
                                                            {!labelExactExists && labelSearch.trim() ? (
                                                                  <button
                                                                        type="button"
                                                                        onClick={createLabelFromSearch}
                                                                        className="mt-2 w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all"
                                                                  >
                                                                        Create "{labelSearch.trim()}"
                                                                  </button>
                                                            ) : null}
                                                      </div>
                                                      <DropdownList>
                                                            {filteredLabels.length ? (
                                                                  filteredLabels.map((l) => (
                                                                        <DropdownItem
                                                                              key={l.id}
                                                                              active={selectedLabels.includes(l.id)}
                                                                              onClick={() => toggleLabel(l.id)}
                                                                              right={selectedLabels.includes(l.id) ? <CheckCircle2 size={16} className="text-blue-400" /> : null}
                                                                        >
                                                                              {l.name}
                                                                        </DropdownItem>
                                                                  ))
                                                            ) : (
                                                                  <div className="p-3 text-sm text-slate-500">No matching labels.</div>
                                                            )}
                                                      </DropdownList>
                                                </ChipDropdown>

                                                <ChipDropdown
                                                      leftIcon="⭕"
                                                      label="Type"
                                                      valueText={issueType || ""}
                                                      open={issueTypeOpen}
                                                      setOpen={(v) => {
                                                            setIssueTypeOpen(v);
                                                            setAssigneeOpen(false);
                                                            setLabelOpen(false);
                                                            setPriorityOpen(false);
                                                      }}
                                                >
                                                      <DropdownHeader title="Task Type" onClose={() => setIssueTypeOpen(false)} />
                                                      <DropdownList>
                                                            {["bug", "feature", "blank"].map((t) => (
                                                                  <DropdownItem
                                                                        key={t}
                                                                        active={issueType === t}
                                                                        onClick={() => {
                                                                              setIssueType(t);
                                                                              setIssueTypeOpen(false);
                                                                        }}
                                                                  >
                                                                        {t}
                                                                  </DropdownItem>
                                                            ))}
                                                      </DropdownList>
                                                </ChipDropdown>

                                                <ChipDropdown
                                                      leftIcon="⚡"
                                                      label="Priority"
                                                      valueText={priorityCfg?.label || priority}
                                                      open={priorityOpen}
                                                      setOpen={(v) => {
                                                            setPriorityOpen(v);
                                                            setAssigneeOpen(false);
                                                            setLabelOpen(false);
                                                            setIssueTypeOpen(false);
                                                      }}
                                                >
                                                      <DropdownHeader title="Priority" onClose={() => setPriorityOpen(false)} />
                                                      <DropdownList>
                                                            {PRIORITIES.map((p) => (
                                                                  <DropdownItem
                                                                        key={p.id}
                                                                        active={priority === p.id}
                                                                        onClick={() => {
                                                                              setPriority(p.id);
                                                                              setPriorityOpen(false);
                                                                        }}
                                                                        right={<LevelPill label={p.label} colorClass={p.color} />}
                                                                  >
                                                                        {p.label}
                                                                  </DropdownItem>
                                                            ))}
                                                      </DropdownList>
                                                </ChipDropdown>
                                          </div>

                                          <div>
                                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                                      Deadline
                                                </label>
                                                <input
                                                      type="date"
                                                      value={deadline}
                                                      onChange={(e) => setDeadline(e.target.value)}
                                                      className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-slate-100
                               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                                />
                                          </div>

                                          <div className="flex items-center justify-end pt-4 border-t border-slate-800">


                                                <div className="flex items-center gap-3">
                                                      <button
                                                            type="button"
                                                            onClick={closeAddModal}
                                                            className="h-10 px-5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition-all"
                                                      >
                                                            Cancel
                                                      </button>
                                                      <button
                                                            type="submit"
                                                            disabled={saving}
                                                            className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700
                               text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/30"
                                                      >
                                                            {saving ? "Creating..." : "Create Task"}
                                                      </button>
                                                </div>
                                          </div>

                                          <input type="hidden" name="assignees" value={JSON.stringify(selectedAssignees)} readOnly />
                                          <input type="hidden" name="labels" value={JSON.stringify(selectedLabels)} readOnly />
                                          <input type="hidden" name="priority" value={priority} readOnly />
                                    </form>
                              )}
                        </div>
                  </Modal>

                  <Modal open={viewModalOpen} onClose={closeViewModal}>
                        {selectedTask && (
                              <div className="flex flex-col h-full max-h-[90vh] relative">
                                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                                          <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
                                                      <CheckCircle2 size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Task Details</span>
                                                      <span className="text-xs text-slate-400">#{selectedTask.id.slice(-8)}</span>
                                                </div>
                                          </div>
                                                <div className="flex items-center gap-2">
                                                <button onClick={() => delete_task(selectedTask.id)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-all" title="Mark complete">
                                                      <Trash2 size={18} />
                                                </button>
                                                <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-all">
                                                      <MoreHorizontal size={18} />
                                                </button>
                                                <div className="w-px h-6 bg-slate-800 mx-1" />
                                                <button onClick={closeViewModal} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-all">
                                                      <X size={18} />
                                                </button>
                                          </div>
                                    </div>

                                    <div className="flex-1 overflow-hidden flex">
                                          <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                                <div className="space-y-3">
                                                      <h2 className="text-3xl font-bold tracking-tight text-slate-100 leading-tight">{selectedTask.title}</h2>
                                                      <div className="flex items-center gap-4 text-sm text-slate-500">
                                                            <div className="flex items-center gap-1.5">
                                                                  <Clock size={14} />
                                                                  <span>{timeAgo(selectedTask.create_at)}</span>
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                            <div className="flex items-center gap-1.5">
                                                                  <MessageSquare size={14} />
                                                                  <span>{selectedTask.comment.length} comments</span>
                                                            </div>
                                                      </div>
                                                </div>

                                                <div className="space-y-3">
                                                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h3>
                                                      <div
                                                            className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed"
                                                            dangerouslySetInnerHTML={{
                                                                  __html: selectedTask.description || "<p class='text-slate-600 italic'>No description provided.</p>",
                                                            }}
                                                      />
                                                </div>
                                                {/* <textarea
                                                      className="w-[500px] h-20 p-2 absolute bottom-2 border border-slate-700 rounded bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                      placeholder="Add a comment..."
                                                /> */}

                                                {selectedTask.images && selectedTask.images.length > 0 && (
                                                      <div className="space-y-3">
                                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attachments</h3>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                  {selectedTask.images.map((img, i) => (
                                                                        <div key={i} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                                                              <img src={img} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                                                                    <span className="text-xs font-medium text-white">attachment-{i + 1}.png</span>
                                                                              </div>
                                                                        </div>
                                                                  ))}
                                                            </div>
                                                      </div>
                                                )}
                                          </div>

                                          <div className="w-80 border-l border-slate-800 bg-slate-900/30 p-6 space-y-6 overflow-y-auto">
                                                <div className="space-y-4">
                                                      <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                                            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm font-medium hover:bg-slate-700 transition-all capitalize">
                                                                  <div className="flex items-center gap-2 capitalize">
                                                                        <span className="w-2 h-2 rounded-full capitalize bg-amber-500" />
                                                                        {selectedTask.column.replace('_', ' ')}
                                                                  </div>

                                                            </button>
                                                      </div>

                                                      <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignees</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                  {selectedTask.assignees && selectedTask.assignees.length > 0 ? (
                                                                        selectedTask.assignees.map((a, i) => (
                                                                              <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium">
                                                                                    <img className="w-5 h-5 rounded-full object-cover" src={TEAM_MEMBERS.find((m) => m.id === a)?.avatar || ''} alt="" />
                                                                                    {TEAM_MEMBERS.find((m) => m.id === a)?.name}
                                                                              </div>
                                                                        ))
                                                                  ) : (
                                                                        <span className="text-sm text-slate-500">No assignees</span>
                                                                  )}
                                                                  <button className="w-7 h-7 rounded-lg border border-slate-700 border-dashed flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">
                                                                        <Plus size={14} />
                                                                  </button>
                                                            </div>
                                                      </div>

                                                      <div className="flex flex-col">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Priority</label>
                                                            <PriorityBadge priority={selectedTask.priority} />
                                                      </div>

                                                      <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Labels</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                  {selectedTask.labels && selectedTask.labels.length > 0 ? (
                                                                        selectedTask.labels.map((l, i) => (
                                                                              <span key={i} className="px-2.5 py-1 capitalize rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                                                                                    {l}
                                                                              </span>
                                                                        ))
                                                                  ) : (
                                                                        <span className="text-sm text-slate-500">No labels</span>
                                                                  )}

                                                            </div>
                                                      </div>

                                                      <div className="space-y-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</label>
                                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                                  <Calendar size={14} className="text-slate-500" />
                                                                  {
                                                                        selectedTask.deadline
                                                                              ? new Date(selectedTask.deadline).toLocaleDateString("en-GB", {
                                                                                    day: "numeric",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                              })
                                                                              : "No deadline"
                                                                  }
                                                            </div>
                                                      </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-800">
                                                      <button onClick={() => markTaskComplete(selectedTask.id)} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold hover:from-blue-500 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30">
                                                            Complete Task
                                                            <ArrowRight size={16} />
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        )}
                  </Modal>
            </>
      );
}

export default TaskManagement;
