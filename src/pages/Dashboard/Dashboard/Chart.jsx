import { useContext, useMemo } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, Calendar, Bell, Bug, AlertTriangle, FileText, MessageSquare, FolderOpen, ArrowUpRight, Clock } from "lucide-react"
import { base_url } from "../../../layout/Title"
import { FaBlog } from "react-icons/fa"
import { Link } from "react-router-dom"
import CalendarPage from "./Calender"
import { AuthContext } from "../../../context/UseContext/AuthProvider"
import { ADMIN_DESIGNATIONS, DEFAULT_PAGES, accessApi, canOpen } from "../../../layout/access"

export default function TaskReport() {
      const { user } = useContext(AuthContext)
      const greeting = useMemo(() => {
            const hour = new Date().getHours()
            return hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night"
      }, [])

      const {
            data: contacts = [],
            refetch: refetchContact,
            isLoading: isLoadingContact,
      } = useQuery({
            queryKey: ["contacts"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/contact/get-contacts`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        method: "GET",
                  })
                  const data = await res.json()
                  return data.data
            },
      })

      const { data: meting_data = [], refetch: refetchMeting, isLoading: isLoadingMeting } = useQuery({
            queryKey: ['meting_data', user?.email],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/meeting/get-meetings?email=${user?.email}`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft',
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
            enabled: !!user?.email,
      });

      const {
            data: notice_data = [],
            refetch: refetchNotice,
            isLoading: isLoadingNotice,
      } = useQuery({
            queryKey: ["notice_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/notice/get-notice`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });

      const {
            data: issue_data = [],
            isLoading: isLoadingIssue,
      } = useQuery({
            queryKey: ["issue_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/issue/get-issue?author_name=${user?.name}`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });

      const { data: project_data = [], isLoading: isLoadingProject } = useQuery({
            queryKey: ["project_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/project/get-project`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });

      const { data: blog_data = [], isLoading: isLoadingBlog } = useQuery({
            queryKey: ["blog_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/blog/get-blog`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });

      const { data: job_data = [], refetch: refetchJob, isLoading: isLoadingJob } = useQuery({
            queryKey: ["job_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/job-post/all-job`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });




      
      // My own open tasks (the server returns only tasks assigned to me or created by me, scope=mine).
      const { data: myTasks = [] } = useQuery({
            queryKey: ["tasks", "home-mine"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/task/get-task?scope=mine`, { headers: { "content-type": "application/json", author: "bright_future_soft" } })
                  const json = await res.json()
                  return Array.isArray(json.data) ? json.data : []
            },
      })

      // Which dashboard pages this person may open: tiles for other pages are hidden.
      const { data: access } = useQuery({
            queryKey: ["access-me"],
            queryFn: () => accessApi("/me"),
            enabled: Boolean(user),
            staleTime: 30000,
            retry: false,
      })
      const permissions = ADMIN_DESIGNATIONS.includes(user?.designation) ? ["*"] : access?.permissions || DEFAULT_PAGES

      const getDateString = (date) => date.toISOString().split("T")[0];

      const { data: meetings = [] } = useQuery({
            queryKey: ["appointments"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/appointment/list`);
                  const data = await res.json();
                  return Array.isArray(data.data) ? data.data.filter(a => a.status !== "cancelled") : [];
            },
      });


      const todayString = getDateString(new Date());
      const todaysMeetings = meetings?.filter(
            (meeting) => getDateString(new Date(meeting.created_at)) === todayString
      );
      const todaysMeetingCount = todaysMeetings?.length || 0;

      const now = new Date();

      const reactApplicationCount = Array.isArray(job_data) ? job_data
            ?.filter(job =>
                  new Date(job.dateline) > now
            )
            ?.reduce((sum, job) => sum + (job.application_count || 0), 0) : 0;

      const openTasks = myTasks.filter((t) => t.column !== "done")
      const overdueTasks = openTasks.filter((t) => t.deadline && new Date(t.deadline).getTime() < Date.now()).length
      const tile = (icon, label, value, color, bgColor, href, hint) => ({ icon, label, value: Number(value) || 0, color, bgColor, href, hint })
      const GROUPS = [
            {
                  title: "Your work",
                  tiles: [
                        tile(CheckCircle, "Open tasks", openTasks.length, "text-blue-400", "bg-blue-500/15", "/dashboard/your-task", overdueTasks ? `${overdueTasks} overdue` : "none overdue"),
                        tile(Calendar, "Upcoming meetings", Array.isArray(meting_data) ? meting_data.filter((m) => m.status !== "end").length : 0, "text-blue-400", "bg-blue-500/15", "/dashboard/meeting_management"),
                        tile(AlertTriangle, "Booked today", todaysMeetingCount, "text-blue-400", "bg-blue-500/15", "/dashboard/client_meetings"),
                  ],
            },
            {
                  title: "Team & company",
                  tiles: [
                        tile(Bell, "New notices", Array.isArray(notice_data) ? notice_data.filter((item) => item.status !== "pending" && new Date(item.notice_date).getTime() >= Date.now() - 3 * 24 * 60 * 60 * 1000).length : 0, "text-amber-400", "bg-amber-500/15", "/dashboard/notice", "last 3 days"),
                        tile(Bug, "Pending issues", Array.isArray(issue_data) ? issue_data.filter((issue) => issue.status == "pending").length : 0, "text-rose-400", "bg-rose-500/15", "/dashboard/issue-submit"),
                        tile(MessageSquare, "Contact requests", Array.isArray(contacts) ? contacts.filter((contact) => contact.status !== "contacted").length : 0, "text-amber-400", "bg-amber-500/15", "/dashboard/contact-management", "not contacted yet"),
                        tile(FileText, "Job applications", reactApplicationCount, "text-amber-400", "bg-amber-500/15", "/dashboard/job-management", "open positions"),
                  ],
            },
            {
                  title: "Content",
                  tiles: [
                        tile(FolderOpen, "Projects", Array.isArray(project_data) ? project_data.length : 0, "text-teal-400", "bg-teal-500/15", "/dashboard/project-management"),
                        tile(FaBlog, "Blog posts", Array.isArray(blog_data) ? blog_data.length : 0, "text-teal-400", "bg-teal-500/15", "/dashboard/blog-management"),
                  ],
            },
      ]
            .map((g) => ({ ...g, tiles: g.tiles.filter((t) => canOpen(permissions, t.href)) }))
            .filter((g) => g.tiles.length > 0)

      // Right-hand "Today" panel
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const todayEnd = todayStart.getTime() + 86400000
      const todaysAppointments = (Array.isArray(meetings) ? meetings : [])
            .filter((a) => a.status === "confirmed" && new Date(a.start_time).getTime() >= todayStart.getTime() && new Date(a.start_time).getTime() < todayEnd)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
      const nextAppointments = (Array.isArray(meetings) ? meetings : [])
            .filter((a) => a.status === "confirmed" && new Date(a.start_time).getTime() >= todayEnd)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 3)
      const recentNotices = (Array.isArray(notice_data) ? notice_data : []).filter((n) => n.status !== "pending").slice().sort((a, b) => new Date(b.notice_date) - new Date(a.notice_date)).slice(0, 3)
      const dueTasks = openTasks.filter((t) => t.deadline).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 4)
      const canSee = (path) => canOpen(permissions, path)

      if (isLoadingContact || isLoadingMeting || isLoadingNotice || isLoadingIssue || isLoadingProject) {
            return <LoadingSkeleton />
      }


      // const {
      //       data: teamMembers = [],
      // } = useQuery({
      //       queryKey: ["all_users"],
      //       queryFn: async () => {
      //             const res = await fetch(`${base_url}/auth/all`, {
      //                   headers: {
      //                         "content-type": "application/json",
      //                         author: "bright_future_soft",
      //                   },
      //                   method: "GET",
      //             })
      //             const data = await res.json()
      //             return data.data
      //       },
      // })



      // ---- chart data (all from what this page already loaded) ----
      const DAY = 86400000
      const dayStart = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime() }
      const today0 = dayStart(Date.now())
      const held = (Array.isArray(meetings) ? meetings : []).filter((a) => a.status !== "cancelled")
      const perDay = Array.from({ length: 30 }, (_, i) => {
            const t = today0 - (29 - i) * DAY
            return { t, label: new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "short" }), count: 0 }
      })
      held.forEach((a) => {
            const idx = Math.floor((dayStart(new Date(a.start_time).getTime()) - perDay[0].t) / DAY)
            if (idx >= 0 && idx < 30) perDay[idx].count++
      })
      const last30 = perDay.reduce((n, d) => n + d.count, 0)
      const prev30 = held.filter((a) => { const t = new Date(a.start_time).getTime(); return t >= today0 - 59 * DAY && t < today0 - 29 * DAY }).length
      const apptDelta = prev30 ? Math.round(((last30 - prev30) / prev30) * 100) : null
      const typeCounts = Object.entries(held.reduce((m, a) => { const k = a.type_name || "Consultation"; m[k] = (m[k] || 0) + 1; return m }, {})).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
      const STATUS_COLS = [["backlog", "Backlog"], ["ready", "Ready"], ["in_progress", "In progress"], ["in_review", "In review"], ["done", "Done"]]
      const taskCounts = STATUS_COLS.map(([id, name]) => ({ name, count: myTasks.filter((t) => t.column === id).length }))
      const contactWeeks = Array.from({ length: 8 }, (_, i) => {
            const end = today0 + DAY - (7 - i) * 7 * DAY + 6 * DAY - 6 * DAY
            const start = end - 7 * DAY
            return { start, label: new Date(start + DAY).toLocaleDateString(undefined, { day: "numeric", month: "short" }), count: 0 }
      })
      ;(Array.isArray(contacts) ? contacts : []).forEach((c) => {
            const t = Number(c.time_stamp)
            contactWeeks.forEach((w) => { if (t >= w.start && t < w.start + 7 * DAY) w.count++ })
      })
      const contactTotal = contactWeeks.reduce((n, w) => n + w.count, 0)
      const showAppts = canSee("/dashboard/client_meetings")
      const showTasks = canSee("/dashboard/your-task")
      const showContacts = canSee("/dashboard/contact-management")

      const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      const quick = [
            ["/dashboard/your-task", "My tasks"],
            ["/dashboard/client_meetings", "Appointments"],
            ["/dashboard/attendance", "Attendance"],
            ["/dashboard/mail", "Mail"],
      ].filter(([href]) => canSee(href))
      const card = "rounded-xl border border-gray-700 bg-gray-800"

      return (
            <div className="min-h-screen bg-[#111827] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                  <div className=" space-y-8">
                        {/* Header */}
                        <header className="flex flex-wrap items-end justify-between gap-4">
                              <div>
                                    <p className="text-sm text-gray-400">{dateLabel}</p>
                                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}, <span className="text-blue-400">{user?.name || "there"}</span></h1>
                                    <p className="mt-1 text-sm text-gray-400">Here is what needs your attention today.</p>
                              </div>
                              {quick.length > 0 && (
                                    <nav aria-label="Quick links" className="flex flex-wrap gap-2">
                                          {quick.map(([href, name]) => (
                                                <Link key={href} to={href} className="rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2 text-sm font-medium text-gray-200 transition hover:border-blue-500 hover:text-white">{name}</Link>
                                          ))}
                                    </nav>
                              )}
                        </header>

                        {/* Stat groups */}
                        {GROUPS.map((group) => (
                              <section key={group.title} aria-label={group.title}>
                                    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">{group.title}</h2>
                                    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${{ 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4" }[group.tiles.length] || "xl:grid-cols-4"}`}>
                                          {group.tiles.map((t) => (
                                                <Link key={t.label} to={t.href} className={`${card} group flex items-center gap-4 p-4 transition hover:border-gray-500 hover:bg-gray-700/40`}>
                                                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${t.bgColor} ${t.color}`}><t.icon className="h-5 w-5" /></span>
                                                      <span className="min-w-0 flex-1">
                                                            <span className="block text-2xl font-bold leading-none text-white">{t.value}</span>
                                                            <span className="mt-1 block text-sm leading-snug text-gray-300">{t.label}</span>
                                                            {t.hint && <span className="block truncate text-xs text-gray-500">{t.hint}</span>}
                                                      </span>
                                                      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:text-gray-200" aria-hidden="true" />
                                                </Link>
                                          ))}
                                    </div>
                              </section>
                        ))}

                        {/* Today at a glance */}
                        {(canSee("/dashboard/client_meetings") || canSee("/dashboard/your-task") || canSee("/dashboard/notice")) && (
                              <section aria-label="Today at a glance">
                                    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Today at a glance</h2>
                                    <div className="grid gap-4 lg:grid-cols-3">
                                    {canSee("/dashboard/client_meetings") && (
                                          <section className={`${card} p-4`}>
                                                <div className="mb-3 flex items-center justify-between">
                                                      <h2 className="text-sm font-bold text-white">Today&apos;s appointments</h2>
                                                      <Link to="/dashboard/client_meetings" className="text-xs font-semibold text-blue-400 hover:underline">View all</Link>
                                                </div>
                                                {todaysAppointments.length === 0 ? (
                                                      <p className="rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">Nothing scheduled today.</p>
                                                ) : (
                                                      <ul className="space-y-2">
                                                            {todaysAppointments.map((a) => (
                                                                  <li key={a._id} className="flex items-center gap-3 rounded-lg border border-gray-700 p-3">
                                                                        <span className="w-14 shrink-0 text-sm font-bold tabular-nums text-white">{new Date(a.start_time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                                                                        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-gray-100">{a.name}</span><span className="block truncate text-xs text-gray-400">{a.type_name || "Appointment"}</span></span>
                                                                        {a.meet_link && <a href={a.meet_link} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500">Join</a>}
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                )}
                                                {nextAppointments.length > 0 && (
                                                      <div className="mt-4 border-t border-gray-700 pt-3">
                                                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Coming up</p>
                                                            <ul className="space-y-1.5 text-sm">
                                                                  {nextAppointments.map((a) => (
                                                                        <li key={a._id} className="flex items-center justify-between gap-3 text-gray-300"><span className="truncate">{a.name}</span><span className="shrink-0 text-xs text-gray-500">{new Date(a.start_time).toLocaleDateString(undefined, { day: "numeric", month: "short" })} · {new Date(a.start_time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span></li>
                                                                  ))}
                                                            </ul>
                                                      </div>
                                                )}
                                          </section>
                                    )}

                                    {canSee("/dashboard/your-task") && (
                                          <section className={`${card} p-4`}>
                                                <div className="mb-3 flex items-center justify-between">
                                                      <h2 className="text-sm font-bold text-white">Task deadlines</h2>
                                                      <Link to="/dashboard/your-task" className="text-xs font-semibold text-blue-400 hover:underline">Open board</Link>
                                                </div>
                                                {dueTasks.length === 0 ? (
                                                      <p className="rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">No open tasks with a deadline.</p>
                                                ) : (
                                                      <ul className="space-y-2">
                                                            {dueTasks.map((t) => {
                                                                  const late = new Date(t.deadline).getTime() < Date.now()
                                                                  return (
                                                                        <li key={t._id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-700 p-3">
                                                                              <span className="min-w-0 truncate text-sm text-gray-100">{t.title}</span>
                                                                              <span className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${late ? "text-red-400" : "text-gray-400"}`}><Clock className="h-3 w-3" aria-hidden="true" />{new Date(t.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short" })}{late ? " · late" : ""}</span>
                                                                        </li>
                                                                  )
                                                            })}
                                                      </ul>
                                                )}
                                          </section>
                                    )}

                                    {canSee("/dashboard/notice") && (
                                          <section className={`${card} p-4`}>
                                                <div className="mb-3 flex items-center justify-between">
                                                      <h2 className="text-sm font-bold text-white">Latest notices</h2>
                                                      <Link to="/dashboard/notice" className="text-xs font-semibold text-blue-400 hover:underline">View all</Link>
                                                </div>
                                                {recentNotices.length === 0 ? (
                                                      <p className="rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">No notices yet.</p>
                                                ) : (
                                                      <ul className="space-y-2">
                                                            {recentNotices.map((n, i) => (
                                                                  <li key={n._id || i} className="rounded-lg border border-gray-700 p-3">
                                                                        <p className="line-clamp-1 text-sm font-semibold text-gray-100">{n.subject || n.title || "Notice"}</p>
                                                                        <p className="text-xs text-gray-500">{n.notice_date ? new Date(n.notice_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                )}
                                          </section>
                                    )}
                                    </div>
                              </section>
                        )}

                        {/* Insights */}
                        {(showAppts || showTasks || showContacts) && (
                              <section aria-label="Insights">
                                    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Insights</h2>
                                    <div className="grid gap-4 lg:grid-cols-3">
                                          {showAppts && (
                                                <ChartCard title="Appointments" subtitle="Booked per day, last 30 days" figure={last30} delta={apptDelta} className="lg:col-span-2">
                                                      {last30 === 0 ? <Empty text="No appointments in the last 30 days" /> : (
                                                            <div className="h-56">
                                                                  <ResponsiveContainer width="100%" height="100%">
                                                                        <AreaChart data={perDay} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                                                                              <defs>
                                                                                    <linearGradient id="apptFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.45} /><stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} /></linearGradient>
                                                                              </defs>
                                                                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" vertical={false} />
                                                                              <XAxis dataKey="label" {...AXIS} interval={4} />
                                                                              <YAxis {...AXIS} allowDecimals={false} />
                                                                              <Tooltip {...TIP} formatter={(v) => [v, "Appointments"]} />
                                                                              <Area type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2.5} fill="url(#apptFill)" />
                                                                        </AreaChart>
                                                                  </ResponsiveContainer>
                                                            </div>
                                                      )}
                                                </ChartCard>
                                          )}
                                          {showAppts && (
                                                <ChartCard title="By type" subtitle="All appointments">
                                                      {typeCounts.length === 0 ? <Empty text="No appointments yet" /> : (
                                                            <div className="flex flex-col items-center gap-3 sm:flex-row lg:flex-col xl:flex-row">
                                                                  <div className="h-44 w-44 shrink-0">
                                                                        <ResponsiveContainer width="100%" height="100%">
                                                                              <PieChart>
                                                                                    <Pie data={typeCounts} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                                                                                          {typeCounts.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                                                                                    </Pie>
                                                                                    <Tooltip {...TIP} />
                                                                              </PieChart>
                                                                        </ResponsiveContainer>
                                                                  </div>
                                                                  <ul className="w-full min-w-0 space-y-1.5 text-xs">
                                                                        {typeCounts.slice(0, 6).map((t, i) => (
                                                                              <li key={t.name} className="flex items-center justify-between gap-2 text-gray-300"><span className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden="true" /><span className="truncate">{t.name}</span></span><span className="font-semibold text-white">{t.value}</span></li>
                                                                        ))}
                                                                  </ul>
                                                            </div>
                                                      )}
                                                </ChartCard>
                                          )}
                                          {showTasks && (
                                                <ChartCard title="My tasks by status" subtitle={`${openTasks.length} open · ${myTasks.length - openTasks.length} done`} className={showContacts ? "" : "lg:col-span-2"}>
                                                      {myTasks.length === 0 ? <Empty text="No tasks yet" /> : (
                                                            <div className="h-52">
                                                                  <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart data={taskCounts} layout="vertical" margin={{ top: 0, right: 12, left: 6, bottom: 0 }}>
                                                                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" horizontal={false} />
                                                                              <XAxis type="number" {...AXIS} allowDecimals={false} />
                                                                              <YAxis type="category" dataKey="name" {...AXIS} width={80} />
                                                                              <Tooltip {...TIP} formatter={(v) => [v, "Tasks"]} />
                                                                              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                                                                                    {taskCounts.map((_, i) => <Cell key={i} fill={["#94A3B8", "#22D3EE", "#FBBF24", "#818CF8", "#2DD4BF"][i]} />)}
                                                                              </Bar>
                                                                        </BarChart>
                                                                  </ResponsiveContainer>
                                                            </div>
                                                      )}
                                                </ChartCard>
                                          )}
                                          {showContacts && (
                                                <ChartCard title="Contact requests" subtitle="Per week, last 8 weeks" figure={contactTotal} className="lg:col-span-2">
                                                      {contactTotal === 0 ? <Empty text="No contact requests in the last 8 weeks" /> : (
                                                            <div className="h-52">
                                                                  <ResponsiveContainer width="100%" height="100%">
                                                                        <BarChart data={contactWeeks} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                                                                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.15)" vertical={false} />
                                                                              <XAxis dataKey="label" {...AXIS} />
                                                                              <YAxis {...AXIS} allowDecimals={false} />
                                                                              <Tooltip {...TIP} formatter={(v) => [v, "Requests"]} labelFormatter={(l) => `Week of ${l}`} />
                                                                              <Bar dataKey="count" fill="#2DD4BF" radius={[6, 6, 0, 0]} maxBarSize={36} />
                                                                        </BarChart>
                                                                  </ResponsiveContainer>
                                                            </div>
                                                      )}
                                                </ChartCard>
                                          )}
                                    </div>
                              </section>
                        )}

                        {/* Calendar */}
                        <section aria-label="Calendar">
                              <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Calendar</h2>
                              <CalendarPage />
                        </section>
                  </div>
            </div>
      )
}

// One palette for the whole page: brand blue first, then calm accents that stay readable on dark and light.
const PALETTE = ["#3B82F6", "#22D3EE", "#2DD4BF", "#818CF8", "#FBBF24", "#FB7185", "#A78BFA"]
const TIP = { contentStyle: { background: "var(--dash-tip-bg, #111827)", border: "1px solid var(--dash-tip-line, rgba(255,255,255,.12))", borderRadius: 10, color: "var(--dash-tip-ink, #F8FAFC)", fontSize: 12 }, labelStyle: { color: "var(--dash-tip-ink, #F8FAFC)", fontWeight: 600 }, itemStyle: { color: "var(--dash-tip-ink, #F8FAFC)" }, cursor: { fill: "rgba(120,140,170,.12)" } }
const AXIS = { stroke: "#8794A4", fontSize: 11, tickLine: false, axisLine: false }

const ChartCard = ({ title, subtitle, figure, delta, className = "", children }) => (
      <section className={`rounded-xl border border-gray-700 bg-gray-800 p-5 ${className}`}>
            <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                        <h3 className="text-sm font-bold text-white">{title}</h3>
                        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
                  </div>
                  {figure != null && (
                        <div className="text-right">
                              <p className="text-2xl font-bold leading-none text-white">{figure}</p>
                              {delta != null && <p className={`mt-1 text-xs font-semibold ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs previous</p>}
                        </div>
                  )}
            </div>
            {children}
      </section>
)

const Empty = ({ text }) => <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-500">{text}</div>

const LoadingSkeleton = () => (
      <div className="min-h-screen bg-[#111827] px-4 py-6 sm:px-6 lg:px-8 lg:py-8" aria-busy="true">
            <div className="mx-auto max-w-7xl space-y-8">
                  <div className="space-y-3">
                        <div className="h-4 w-48 animate-pulse rounded bg-gray-700/40" />
                        <div className="h-9 w-80 max-w-full animate-pulse rounded bg-gray-700/40" />
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[82px] animate-pulse rounded-xl border border-gray-700 bg-gray-800" />)}
                  </div>
            </div>
      </div>
)
