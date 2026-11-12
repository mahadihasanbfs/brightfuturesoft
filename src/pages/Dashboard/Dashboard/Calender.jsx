import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { base_url } from "../../../layout/Title";
import { AuthContext } from "../../../context/UseContext/AuthProvider";











const ChevronLeftIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
      </svg>
)

const ChevronRightIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
      </svg>
)

const CalendarIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
)

export default function CalendarPage() {
      const today = new Date()
      const [currentDate, setCurrentDate] = useState(today)
      const [selectedKey, setSelectedKey] = useState(null) // YYYY-MM-DD of the day shown in the agenda panel
      const [hidden, setHidden] = useState([]) // event categories switched off in the legend
      const { user } = useContext(AuthContext)

      const { data: teamMembers = [], } = useQuery({
            queryKey: ["team_birthday"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all`, {
                        headers: {
                              'content-type': 'application/json',
                              'author': 'bright_future_soft'
                        },
                        method: 'GET',
                  });
                  const data = await res.json();
                  return data.data;
            },
      });


 const {
            data: contacts = [],
            refetch: _refetchContact,
            isLoading: _isLoadingContact,
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

      const { data: meting_data = [], refetch: _refetchMeting, isLoading: _isLoadingMeting } = useQuery({
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
            refetch: _refetchNotice,
            isLoading: _isLoadingNotice,
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
            isLoading: _isLoadingIssue,
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


      
      const getLocalDateKey = (value) => {
            const date = new Date(value)
            if (Number.isNaN(date.getTime())) return null
            const yearValue = date.getFullYear()
            const monthValue = String(date.getMonth() + 1).padStart(2, "0")
            const dayValue = String(date.getDate()).padStart(2, "0")
            return `${yearValue}-${monthValue}-${dayValue}`
      }

      const { data: sampleHolidays = [] } = useQuery({
            queryKey: ["company-holidays"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/appointment/holidays`);
                  const data = await res.json();
                  return Array.isArray(data.data) ? data.data : [];
            },
      });

      const { data: meetings = [] } = useQuery({
            queryKey: ["appointments"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/appointment/list`);
                  const data = await res.json();
                  return Array.isArray(data.data) ? data.data.filter(a => a.status !== "cancelled") : [];
            },
      });



      const employeeBirthdays = teamMembers
            .filter(member => member.dob) 
            .map(member => {
                  const dobDate = new Date(member.dob);

                  return {
                        id: member._id,
                        name: member.name,
                        month: dobDate.getMonth() + 1,
                        day: dobDate.getDate(),
                        image: member.image,
                        designation: member.designation,
                        position: member.possition,
                  };
            });

      const normalizeMeetingItem = (meeting) => {
            const dateKey = getLocalDateKey(meeting?.date)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "meeting",
                  title: meeting?.name || "Meeting",
                  summary: meeting?.status ? `Status: ${meeting.status}` : "Meeting schedule",
                  raw: meeting,
            }
      }

      const normalizeContactItem = (contact) => {
            const dateKey = getLocalDateKey(contact?.time_stamp)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "contact",
                  title: contact?.full_name || "Contact message",
                  summary: contact?.email_or_phone || contact?.message || "Contact submission",
                  raw: contact,
            }
      }

      const normalizeNoticeItem = (notice) => {
            const dateKey = getLocalDateKey(notice?.notice_date)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "notice",
                  title: notice?.subject || "Notice",
                  summary: notice?.description || "Official notice",
                  raw: notice,
            }
      }

      const normalizeIssueItem = (issue) => {
            const dateKey = getLocalDateKey(issue?.issue_date)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "issue",
                  title: issue?.subject || `Issue #${issue?.issue_number || ""}`,
                  summary: issue?.status ? `Status: ${issue.status}` : "Issue submission",
                  raw: issue,
            }
      }

      const normalizeAppointmentItem = (meeting) => {
            const dateKey = getLocalDateKey(meeting?.start_time)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "client_meeting",
                  title: meeting?.name || "Appointment",
                  summary: [meeting?.type_name, meeting?.duration_minutes ? `${meeting.duration_minutes} min` : null, meeting?.mode === "online" ? "Online" : meeting?.mode === "phone" ? "Phone" : meeting?.mode === "client_site" ? "On site" : null].filter(Boolean).join(" · ") || "Appointment",
                  raw: meeting,
            }
      }

      const calendarItems = [
            ...(meting_data.map(normalizeMeetingItem).filter(Boolean)),
            ...(contacts.map(normalizeContactItem).filter(Boolean)),
            ...(notice_data.filter((n) => n.status !== "pending").map(normalizeNoticeItem).filter(Boolean)),
            ...(issue_data.map(normalizeIssueItem).filter(Boolean)),
            ...(Array.isArray(meetings) ? meetings.map(normalizeAppointmentItem).filter(Boolean) : []),
      ]

            
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
      ]

      const firstDayOfMonth = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const isWeekend = (day) => {
            const date = new Date(year, month, day)
            const dayOfWeek = date.getDay()
            return dayOfWeek === 6
      }

      const getEvents = (day) => {
            const currentMonth = month + 1;
            const dateKey = `${year}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const events = [];

            employeeBirthdays.forEach(b =>
                  b.month === currentMonth && b.day === day &&
                  events.push({
                        name: `${b.name}'s Birthday`,
                        type: "birthday",
                        title: b.name,
                        summary: b.designation || b.position || "Birthday",
                        raw: b,
                  })
            );
            sampleHolidays.forEach(h =>
                  h.date === dateKey &&
                  events.push({ name: h.name, type: h.type === "special" ? "special" : "holiday", title: h.name, summary: h.type === "special" ? "Special day" : "Holiday" })
            );

            calendarItems
                  .filter(item => item.dateKey === dateKey)
                  .forEach(item => {
                        events.push({
                              name: item.title,
                              type: item.type,
                              title: item.title,
                              summary: item.summary,
                              raw: item.raw,
                        })
                  })

            return events;
      };

      const pad2 = (n) => String(n).padStart(2, "0")
      const keyOf = (day) => `${year}-${pad2(month + 1)}-${pad2(day)}`
      const todayKey = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`
      const activeKey = selectedKey || todayKey

      const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1))
      const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
      const goToToday = () => { setCurrentDate(new Date()); setSelectedKey(todayKey) }

      // Event categories: one colour each, used by the chips, the legend and the agenda.
      const CATS = {
            client_meeting: { label: "Appointments", color: "#3B82F6", href: "/dashboard/client_meetings" },
            meeting: { label: "Meetings", color: "#818CF8", href: "/dashboard/meeting_management" },
            contact: { label: "Contact requests", color: "#2DD4BF", href: "/dashboard/contact-management" },
            notice: { label: "Notices", color: "#FBBF24", href: "/dashboard/notice" },
            issue: { label: "Issues", color: "#FB7185", href: "/dashboard/issue-submit" },
            birthday: { label: "Birthdays", color: "#F472B6" },
            special: { label: "Company events", color: "#A78BFA" },
            holiday: { label: "Holidays", color: "#F87171" },
      }
      const timeOf = (e) => {
            const v = e.type === "client_meeting" ? e.raw?.start_time : e.type === "meeting" ? e.raw?.date : null
            const d = v ? new Date(v) : null
            return d && !Number.isNaN(d.getTime()) && String(v).length > 10 ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : ""
      }
      const visibleEvents = (day) => getEvents(day).filter((e) => !hidden.includes(e.type))
      const dayStatus = (day) => {
            const events = getEvents(day)
            const holiday = events.find((e) => e.type === "holiday")
            return { holiday, weekend: isWeekend(day) }
      }

      const selDay = Number(activeKey.slice(8))
      const selInMonth = activeKey.slice(0, 7) === `${year}-${pad2(month + 1)}`
      const selDate = new Date(`${activeKey}T12:00:00`)
      const selEvents = selInMonth ? visibleEvents(selDay) : []
      const selStatus = selInMonth ? dayStatus(selDay) : { holiday: null, weekend: false }
      const groupedSel = Object.keys(CATS).map((type) => ({ type, list: selEvents.filter((e) => e.type === type) })).filter((g) => g.list.length)
      const monthCount = [...Array(daysInMonth)].reduce((n, _, i) => n + visibleEvents(i + 1).filter((e) => e.type !== "holiday").length, 0)

      const chip = (type) => ({ background: `${CATS[type].color}24`, borderLeft: `3px solid ${CATS[type].color}` })

      return (
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-4 shadow-xl md:p-6">
                  {/* Header */}
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">{monthNames[month]} {year}</h2>
                              <p className="text-xs text-gray-400 md:text-sm">{monthCount} item{monthCount === 1 ? "" : "s"} this month</p>
                        </div>
                        <div className="flex items-center gap-2">
                              <button onClick={previousMonth} aria-label="Previous month" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white transition hover:bg-gray-700"><ChevronLeftIcon /></button>
                              <button onClick={goToToday} className="h-9 rounded-lg bg-[#1c65b4] px-4 text-sm font-semibold text-white transition hover:bg-blue-700">Today</button>
                              <button onClick={nextMonth} aria-label="Next month" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white transition hover:bg-gray-700"><ChevronRightIcon /></button>
                        </div>
                  </div>

                  {/* Legend = filters */}
                  <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Show or hide event types">
                        {Object.entries(CATS).map(([type, c]) => {
                              const off = hidden.includes(type)
                              return (
                                    <button key={type} aria-pressed={!off} onClick={() => setHidden((h) => (off ? h.filter((x) => x !== type) : [...h, type]))} className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${off ? "border-gray-700 text-gray-500 line-through" : "border-gray-600 text-gray-200 hover:bg-gray-700"}`}>
                                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: off ? "#64748B" : c.color }} aria-hidden="true" />
                                          {c.label}
                                    </button>
                              )
                        })}
                  </div>

                  <div className="grid gap-5 2xl:grid-cols-[1fr_320px]">
                        {/* Month grid */}
                        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-700">
                              <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-900/60">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                                          <div key={d} className={`py-2.5 text-center text-[11px] font-bold uppercase tracking-wider ${i === 6 ? "text-rose-400" : "text-gray-400"}`}>
                                                <span className="hidden sm:inline">{d}</span><span className="sm:hidden">{d[0]}</span>
                                          </div>
                                    ))}
                              </div>
                              <div className="grid grid-cols-7">
                                    {[...Array(firstDayOfMonth)].map((_, i) => <div key={`e${i}`} className="min-h-[64px] border-b border-r border-gray-700/60 bg-gray-900/30 sm:min-h-[104px]" />)}
                                    {[...Array(daysInMonth)].map((_, i) => {
                                          const day = i + 1
                                          const key = keyOf(day)
                                          const events = visibleEvents(day)
                                          const { holiday, weekend } = dayStatus(day)
                                          const closed = Boolean(holiday) || weekend
                                          const isSel = key === activeKey
                                          const isTodayDate = key === todayKey
                                          const shown = events.filter((e) => e.type !== "holiday")
                                          return (
                                                <button
                                                      key={day}
                                                      type="button"
                                                      onClick={() => setSelectedKey(key)}
                                                      aria-label={`${monthNames[month]} ${day}${events.length ? `, ${events.length} items` : ""}${holiday ? `, ${holiday.name}` : weekend ? ", weekend" : ""}`}
                                                      aria-pressed={isSel}
                                                      className={`relative min-h-[64px] border-b border-r border-gray-700/60 p-1.5 text-left transition sm:min-h-[104px] sm:p-2 ${closed ? "bg-gray-900/50" : "bg-gray-800"} ${isSel ? "z-10 ring-2 ring-inset ring-blue-500" : "hover:bg-gray-700/40"}`}
                                                >
                                                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold sm:h-7 sm:w-7 sm:text-sm ${isTodayDate ? "bg-[#1c65b4] text-white" : closed ? "text-rose-400" : "text-gray-200"}`}>{day}</span>
                                                      {holiday && <span className="mt-0.5 block truncate text-[10px] font-medium text-rose-400 sm:text-[11px]">{holiday.name}</span>}
                                                      
                                                      <span className="mt-1 hidden space-y-1 sm:block">
                                                            {shown.slice(0, 2).map((e, idx) => (
                                                                  <span key={idx} className="block truncate rounded-sm px-1.5 py-0.5 text-[11px] font-medium text-gray-100" style={chip(e.type)}>{e.type === "birthday" ? "🎂 " : ""}{e.name}</span>
                                                            ))}
                                                            {shown.length > 2 && <span className="block text-[11px] font-semibold text-gray-400">+{shown.length - 2} more</span>}
                                                      </span>
                                                      {shown.length > 0 && (
                                                            <span className="mt-1 flex flex-wrap gap-1 sm:hidden" aria-hidden="true">
                                                                  {shown.slice(0, 4).map((e, idx) => <span key={idx} className="h-1.5 w-1.5 rounded-full" style={{ background: CATS[e.type].color }} />)}
                                                            </span>
                                                      )}
                                                </button>
                                          )
                                    })}
                              </div>
                        </div>

                        {/* Day agenda */}
                        <aside className="rounded-xl border border-gray-700 bg-gray-900/40 p-4" aria-live="polite">
                              <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">{activeKey === todayKey ? "Today" : "Selected day"}</p>
                              <h3 className="mt-1 text-lg font-bold text-white">{selDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
                              {selStatus.holiday && <p className="mt-2 rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300">Holiday: {selStatus.holiday.name}. Bookings are closed.</p>}
                              {!selStatus.holiday && selStatus.weekend && <p className="mt-2 rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-300">Weekend. Bookings are closed.</p>}
                              {!selInMonth ? (
                                    <p className="mt-4 rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">Pick a day in this month.</p>
                              ) : groupedSel.filter((g) => g.type !== "holiday").length === 0 ? (
                                    <p className="mt-4 rounded-lg border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500">Nothing scheduled.</p>
                              ) : (
                                    <div className="mt-4 space-y-4">
                                          {groupedSel.filter((g) => g.type !== "holiday").map((g) => (
                                                <section key={g.type}>
                                                      <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400"><span className="h-2.5 w-2.5 rounded-full" style={{ background: CATS[g.type].color }} aria-hidden="true" />{CATS[g.type].label}<span className="text-gray-500">{g.list.length}</span></h4>
                                                      <ul className="space-y-2">
                                                            {g.list.map((e, idx) => {
                                                                  const inner = (
                                                                        <>
                                                                              <span className="flex items-baseline justify-between gap-2"><span className="min-w-0 break-words text-sm font-semibold text-gray-100">{e.type === "birthday" ? "🎂 " : ""}{e.name}</span>{timeOf(e) && <span className="shrink-0 text-xs font-bold tabular-nums text-gray-300">{timeOf(e)}</span>}</span>
                                                                              {e.summary && <span className="mt-0.5 line-clamp-2 block text-xs text-gray-400">{e.summary}</span>}
                                                                        </>
                                                                  )
                                                                  return (
                                                                        <li key={idx}>
                                                                              {CATS[e.type].href
                                                                                    ? <Link to={CATS[e.type].href} className="block rounded-lg border border-gray-700 p-3 transition hover:border-gray-500" style={{ borderLeft: `3px solid ${CATS[e.type].color}` }}>{inner}</Link>
                                                                                    : <div className="rounded-lg border border-gray-700 p-3" style={{ borderLeft: `3px solid ${CATS[e.type].color}` }}>{inner}</div>}
                                                                        </li>
                                                                  )
                                                            })}
                                                      </ul>
                                                </section>
                                          ))}
                                    </div>
                              )}
                        </aside>
                  </div>
            </div>
      )
}
