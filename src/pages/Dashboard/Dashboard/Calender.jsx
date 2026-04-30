import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react"
import { Link } from "react-router-dom";
import { base_url } from "../../../layout/Title";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

const sampleHolidays = [
      { date: "2026-02-04", name: "Shab e-Barat (Night of Records)" },
      { date: "2026-02-21", name: "Shahid Dibosh (International Mother Language Day)" },
      { date: "2026-03-17", name: "Shab-e-Qadar (Night of Destiny)" },
      { date: "2026-03-19", name: "Eid-ul-Fitr Holiday" },
      { date: "2026-03-20", name: "Jumatul Bidah" },
      { date: "2026-03-20", name: "Eid-ul-Fitr Holiday" },
      { date: "2026-03-21", name: "Eid-ul-Fitr (End of Ramadan)" },
      { date: "2026-03-22", name: "Eid-ul-Fitr Holiday" },
      { date: "2026-03-23", name: "Eid-ul-Fitr Holiday" },
      { date: "2026-03-26", name: "Independence Day (National Day)" },
      { date: "2026-04-14", name: "Pahela Baishakh (Bangla New Year)" },
      { date: "2026-05-01", name: "May Day" },
      { date: "2026-05-01", name: "Buddha Purnima (Buddha Day)" },
      { date: "2026-05-26", name: "Eid-ul-Azha Holiday" },
      { date: "2026-05-27", name: "Eid-ul-Azha Holiday" },
      { date: "2026-05-28", name: "Eid-ul-Azha (Feast of Sacrifice)" },
      { date: "2026-05-29", name: "Eid-ul-Azha Holiday" },
      { date: "2026-05-30", name: "Eid-ul-Azha Holiday" },
      { date: "2026-05-31", name: "Eid-ul-Azha Holiday" },
      { date: "2026-06-26", name: "Ashura (Muharram)" },
      { date: "2026-07-01", name: "July Bank Holiday" },
      { date: "2026-08-05", name: "July Mass Uprising Day" },
      { date: "2026-08-26", name: "Eid-e-Milad-un-Nabi (Prophet’s Birthday)" },
      { date: "2026-09-04", name: "Sri Krishna Janmashtami" },
      { date: "2026-10-20", name: "Durga Puja Holiday" },
      { date: "2026-10-21", name: "Durga Puja (Bijoya Dashami)" },
      { date: "2026-12-16", name: "Bijoy Dibosh (Victory Day)" },
      { date: "2026-12-25", name: "Christmas Day" },
      { date: "2025-12-16", name: "Victory Day" },
      { date: "2025-12-25", name: "Christmas Day" },
];







const specialDays = [
      { month: 1, day: 1, name: "New Year Celebrations" },
      { month: 1, day: 3, name: "Company Anniversary" }
];

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
      const [modalOpen, setModalOpen] = useState(false)
      const [selectedDayInfo, setSelectedDayInfo] = useState(null)
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

      console.log(meting_data);

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


      const CALENDLY_TOKEN = "Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUxMDIzMDQ4LCJqdGkiOiI3OWMzZDE3NS1hYjJkLTRiOTMtOWUwMS1lM2E5MGE2ZTQ0YmYiLCJ1c2VyX3V1aWQiOiJiMTgxNmZlZi1kYWEyLTRhMWItYmM1NS03MjM0OGRjODA2ZWEifQ.fqFBxpZJcdkp7d4yHaB8_54B5_zpFGSKcKGXQlExAE4psCUv-amJMaIMddsLaQdvkMlra0OtKh6pLajwbKpdXQ";

      const getLocalDateKey = (value) => {
            const date = new Date(value)
            if (Number.isNaN(date.getTime())) return null
            const yearValue = date.getFullYear()
            const monthValue = String(date.getMonth() + 1).padStart(2, "0")
            const dayValue = String(date.getDate()).padStart(2, "0")
            return `${yearValue}-${monthValue}-${dayValue}`
      }

      const formatDateTime = (value) => {
            const date = new Date(value)
            if (Number.isNaN(date.getTime())) return ""
            return date.toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
            })
      }

      function useCalendlyUser() {
            return useQuery({
                  queryKey: ["calendly-user"],
                  queryFn: async () => {
                        const res = await fetch("https://api.calendly.com/users/me", {
                              headers: { Authorization: CALENDLY_TOKEN },
                        });
                        const data = await res.json();
                        return data.resource.uri;
                  },
            });
      }

      function useCalendlyMeetings(userUri) {
            return useQuery({
                  queryKey: ["calendly-meetings", userUri],
                  enabled: !!userUri,
                  queryFn: async () => {
                        let events = [];
                        let nextPage = `https://api.calendly.com/scheduled_events?user=${userUri}`;
                        while (nextPage) {
                              const res = await fetch(nextPage, {
                                    headers: { Authorization: CALENDLY_TOKEN },
                              });
                              const data = await res.json();
                              events = [...events, ...(data.collection || [])];
                              nextPage = data.pagination?.next_page || null;
                        }
                        return events;
                  },
            });
      }

        const { data: userUri } = useCalendlyUser();
      const { data: meetings } = useCalendlyMeetings(userUri);


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

      const normalizeCalendlyItem = (meeting) => {
            const dateKey = getLocalDateKey(meeting?.start_time)
            if (!dateKey) return null

            return {
                  dateKey,
                  type: "client_meeting",
                  title: meeting?.name ? `Client Meeting: ${meeting.name}` : "Client Meeting",
                  summary: meeting?.status ? `Client meeting status: ${meeting.status}` : "Client meeting booking",
                  raw: meeting,
            }
      }

      const calendarItems = [
            ...(meting_data.map(normalizeMeetingItem).filter(Boolean)),
            ...(contacts.map(normalizeContactItem).filter(Boolean)),
            ...(notice_data.map(normalizeNoticeItem).filter(Boolean)),
            ...(issue_data.map(normalizeIssueItem).filter(Boolean)),
            ...(Array.isArray(meetings) ? meetings.map(normalizeCalendlyItem).filter(Boolean) : []),
      ]

            
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
      ]

      const firstDayOfMonth = new Date(year, month, 1).getDay()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const isToday = (day) =>
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

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
            specialDays.forEach(s =>
                  s.month === currentMonth && s.day === day &&
                  events.push({ name: s.name, type: "special", title: s.name, summary: "Special day" })
            );
            sampleHolidays.forEach(h =>
                  h.date === dateKey &&
                  events.push({ name: h.name, type: "holiday", title: h.name, summary: "Holiday" })
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

      const getMembersForDay = (day) => {
            const currentMonth = month + 1
            return teamMembers.filter(m => {
                  if (!m.dob) return false
                  const d = new Date(m.dob)
                  return (d.getMonth() + 1) === currentMonth && d.getDate() === day
            })
      }

      const openDayModal = (day) => {
            const events = getEvents(day)
            const members = getMembersForDay(day)
            const currentMonth = month + 1
            const dateStr = `${year}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            const items = calendarItems.filter(item => item.dateKey === dateStr)
            setSelectedDayInfo({ day, dateStr, events, members, items })
            setModalOpen(true)
      }

      const closeModal = () => {
            setModalOpen(false)
            setSelectedDayInfo(null)
      }

      const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1))
      const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
      const goToToday = () => setCurrentDate(new Date())

      return (
            <div className="min-h-screen bg-gray-900 mt-4">
                  <div className="max-w-7xl mx-auto">
                        <div className="bg-gray-900 rounded-xl p-4 md:p-6 lg:p-8 shadow-xl border border-slate-700">
                              {/* Header */}
                              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                          {/* <div className="p-2 md:p-3 bg-gray-100 rounded-lg">
                                                <CalendarIcon />
                                          </div> */}
                                          <div>
                                                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                                                      {monthNames[month]} {year}
                                                </h1>
                                                <p className="text-xs md:text-sm text-slate-300">
                                                      {today.toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                      })}
                                                </p>
                                          </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <button onClick={previousMonth}
                                                className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg border border-slate-600 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                                                <ChevronLeftIcon />
                                          </button>
                                          <button onClick={goToToday}
                                                className="h-9 px-3 md:h-10 md:px-4 text-xs md:text-sm font-medium rounded-lg bg-[#1c65b4] text-white hover:bg-blue-700 transition-colors">
                                                Today
                                          </button>
                                          <button onClick={nextMonth}
                                                className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg border border-slate-600 bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                                                <ChevronRightIcon />
                                          </button>
                                    </div>
                              </div>
                              {/* Legend */}
                              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-700">
                                    <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm ring-2 ring-blue-600"></div>
                                          <span className="text-xs md:text-sm text-slate-200">Today</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-red-500 border border-red-400"></div>
                                          <span className="text-xs md:text-sm text-red-500">Holiday/Weekend</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-green-200 border border-green-400"></div>
                                          <span className="text-xs md:text-sm text-green-200">Birthday</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-sm bg-yellow-200 border border-yellow-400"></div>
                                          <span className="text-xs md:text-sm text-yellow-200">Special Day</span>
                                    </div>
                              </div>
                              {/* Calendar Grid */}
                              <div className="rounded-lg overflow-hidden border border-slate-700 shadow-sm">
                                    {/* Day headers */}
                                    <div className="grid grid-cols-7 bg-slate-700">
                                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                                                <div key={day}
                                                      className={`p-2 md:p-3 text-center text-xs md:text-sm font-semibold ${index === 0 || index === 6 ? "text-red-300" : "text-slate-200"}`}>
                                                      <span className="hidden md:inline">{day}</span>
                                                      <span className="md:hidden">{day.charAt(0)}</span>
                                                </div>
                                          ))}
                                    </div>
                                    <div className="grid grid-cols-7 bg-gray-900">
                                          {/* Empty cells for days before month starts */}
                                          {[...Array(firstDayOfMonth)].map((_, i) => (
                                                <div key={`empty-${i}`} className="aspect-square md:aspect-auto md:h-24 lg:h-28 border border-slate-800 bg-gray-900"></div>
                                          ))}
                                          {[...Array(daysInMonth)].map((_, i) => {
                                                const day = i + 1
                                                const isTodayDate = isToday(day)
                                                const isWeekendDay = isWeekend(day)
                                                const events = getEvents(day)
                                                // Color priority: birthday > special > holiday > weekend
                                                let bg = "bg-gray-900 hover:bg-slate-800"
                                                let border = "border-slate-800"
                                                let dayText = "text-slate-200"
                                                if (events.find(e => e.type === "birthday")) {
                                                      bg = "bg-green-200 hover:bg-green-300"
                                                      border = "border-green-500 rounded"
                                                      dayText = "text-green-800"
                                                } else if (events.find(e => e.type === "special")) {
                                                      bg = "bg-yellow-200 hover:bg-yellow-300"
                                                      border = "border-yellow-500 rounded"
                                                      dayText = "text-yellow-800"
                                                } else if (events.find(e => e.type === "holiday")) {
                                                      bg = "bg-red-500 hover:bg-red-600"
                                                      border = "border-red-400 rounded "
                                                      dayText = "text-white"
                                                } else if (isWeekendDay) {
                                                      bg = "bg-red-500 hover:bg-red-600"
                                                      border = "border-red-400  "
                                                      dayText = "text-white"
                                                }

                                                return (
                                                      <div key={day}
                                                            onClick={() => openDayModal(day)}
                                                            role="button"
                                                            tabIndex={0}
                                                            className={`cursor-pointer aspect-square md:aspect-auto md:h-24 lg:h-28 border ${border} p-1.5 md:p-2 lg:p-3 transition-all hover:shadow-md relative overflow-hidden group ${bg} ${isTodayDate ? "ring-2 ring-blue-600 ring-inset" : ""}`}>
                                                            <div className="flex flex-col h-full relative z-10">
                                                                  <span className={`text-xs md:text-sm lg:text-base font-semibold ${isTodayDate ? "text-blue-700" : dayText}`}>
                                                                        {day}
                                                                  </span>
                                                                  {isTodayDate && (<span className="hidden md:block text-[10px] lg:text-xs font-medium text-blue-800">Today</span>)}
                                                                  {events.map((event, idx) => (
                                                                        <span
                                                                              key={idx}
                                                                              className={`
                                                                                    text-[9px] md:text-[10px] lg:text-xs mt-0.5 md:mt-1 line-clamp-2 md:line-clamp-3 font-medium
                                                                                    ${event.type === "holiday" ? "text-white" : ""}
                                                                                    ${event.type === "birthday" ? "text-green-900" : ""}
                                                                                    ${event.type === "special" ? "text-black" : ""}
                                                                              `}
                                                                        >
                                                                              {event.type === "birthday" ? `🎂 ${event.name}` : event.name}
                                                                        </span>
                                                                  ))}
                                                                  {!events.length && isWeekendDay && (
                                                                        <span className="hidden md:block text-[10px] lg:text-xs text-red-300 mt-1">Weekend</span>
                                                                  )}
                                                            </div>
                                                            {isTodayDate && <div className="absolute inset-0 bg-blue-100/50 pointer-events-none"></div>}
                                                      </div>
                                                )
                                          })}
                                    </div>
                              </div>
                              {/* Day detail modal */}
                              {modalOpen && selectedDayInfo && (
                                   <DayDetailModal 
  isOpen={modalOpen}
  selectedDayInfo={selectedDayInfo}
  onClose={closeModal}
  formatDateTime={formatDateTime}
/>
                              )}
                        </div>
                  </div>
            </div>
      )
}





import { X } from 'lucide-react'



// Reusable section component to reduce repetition
function ModalSection({
  title,
  count,
  colorScheme,
  children,
}) {
  return (
    <section className={`rounded-md border ${colorScheme.border} ${colorScheme.bg} p-4`}>
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-200">
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${colorScheme.text}`}>
          {title}
        </h4>
        <span className={`rounded-md ${colorScheme.badge} px-2 py-0.5 text-xs font-medium ${colorScheme.badgeText}`}>
          {count}
        </span>
      </div>
      {children}
    </section>
  )
}

// Reusable item component for links
function ModalItem({
  title,
  summary,
  timestamp,
  href,
  colorScheme,
}) {
  return (
    <Link to={href} className="block">
      <div className={`rounded-md bg-white p-3 shadow-sm ring-1 ${colorScheme.ring} transition hover:shadow-md`}>
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        {summary && <div className="mt-1 text-xs text-gray-600">{summary}</div>}
        {timestamp && <div className="mt-1.5 text-xs text-gray-500">{timestamp}</div>}
      </div>
    </Link>
  )
}

// Reusable event item (for holidays/special days)
function ModalEventItem({ name }) {
  return (
    <div className="rounded-md bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ring-1 ring-gray-100">
      {name}
    </div>
  )
}

export function DayDetailModal({
  isOpen,
  selectedDayInfo,
  onClose,
  formatDateTime,
}) {
  if (!isOpen || !selectedDayInfo) return null

  const birthdayMembers = selectedDayInfo.members || []
  const holidayEvents = (selectedDayInfo.events || []).filter((e) => e.type === 'holiday')
  const specialEvents = (selectedDayInfo.events || []).filter((e) => e.type === 'special')
  const meetingItems = (selectedDayInfo.items || []).filter((i) => i.type === 'meeting')
  const clientMeetingItems = (selectedDayInfo.items || []).filter((i) => i.type === 'client_meeting')
  const contactItems = (selectedDayInfo.items || []).filter((i) => i.type === 'contact')
  const noticeItems = (selectedDayInfo.items || []).filter((i) => i.type === 'notice')
  const issueItems = (selectedDayInfo.items || []).filter((i) => i.type === 'issue')

  const hasAnyContent =
    birthdayMembers.length > 0 ||
    holidayEvents.length > 0 ||
    specialEvents.length > 0 ||
    meetingItems.length > 0 ||
    clientMeetingItems.length > 0 ||
    contactItems.length > 0 ||
    noticeItems.length > 0 ||
    issueItems.length > 0

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedDayInfo.dateStr}</h2>
            <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">Daily overview</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!hasAnyContent ? (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <div className="text-base font-semibold text-gray-700">This is just a normal day.</div>
              <div className="mt-2 text-sm text-gray-500">
                No birthdays, meetings, or events scheduled.
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Birthdays */}
              {birthdayMembers.length > 0 && (
                <ModalSection
                  title="Birthdays"
                  count={birthdayMembers.length}
                  colorScheme={{
                    border: 'border-green-100',
                    bg: 'bg-green-50',
                    text: 'text-green-800',
                    badge: 'bg-green-100',
                    badgeText: 'text-green-700',
                  }}
                >
                  <ul className="space-y-2">
                    {birthdayMembers.map((m) => (
                      <li key={m._id || m.email || m.name} className="flex gap-3 p-2">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm">{m.name}</div>
                          <div className="text-xs text-gray-500">
                            {m.dob && new Date(m.dob).toLocaleDateString()}
                          </div>
                          {m.position && <div className="text-xs text-gray-400">{m.position}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Meetings */}
              {meetingItems.length > 0 && (
                <ModalSection
                  title="Meetings"
                  count={meetingItems.length}
                  colorScheme={{
                    border: 'border-blue-100',
                    bg: 'bg-blue-50',
                    text: 'text-blue-800',
                    badge: 'bg-blue-100',
                    badgeText: 'text-blue-700',
                  }}
                >
                  <ul className="space-y-2">
                    {meetingItems.map((item, idx) => (
                      <ModalItem
                        key={`${item.raw?.uri || item.title}-${idx}`}
                        title={item.title}
                        summary={item.summary}
                        timestamp={item.raw?.start_time ? formatDateTime(item.raw.start_time) : undefined}
                        href="/dashboard/meeting_management"
                        colorScheme={{
                          ring: 'ring-blue-100',
                          hover: 'ring-blue-200',
                        }}
                      />
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Client Meetings */}
              {clientMeetingItems.length > 0 && (
                <ModalSection
                  title="Client Meetings"
                  count={clientMeetingItems.length}
                  colorScheme={{
                    border: 'border-purple-100',
                    bg: 'bg-purple-50',
                    text: 'text-purple-800',
                    badge: 'bg-purple-100',
                    badgeText: 'text-purple-700',
                  }}
                >
                  <ul className="space-y-2">
                    {clientMeetingItems.map((item, idx) => (
                      <ModalItem
                        key={`${item.raw?.uri || item.title}-${idx}`}
                        title={item.title}
                        summary={item.summary}
                        timestamp={item.raw?.start_time ? formatDateTime(item.raw.start_time) : undefined}
                        href="/dashboard/client_meetings"
                        colorScheme={{
                          ring: 'ring-purple-100',
                          hover: 'ring-purple-200',
                        }}
                      />
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Contacts */}
              {contactItems.length > 0 && (
                <ModalSection
                  title="Contacts"
                  count={contactItems.length}
                  colorScheme={{
                    border: 'border-cyan-200',
                    bg: 'bg-cyan-50',
                    text: 'text-cyan-700',
                    badge: 'bg-cyan-100',
                    badgeText: 'text-cyan-700',
                  }}
                >
                  <ul className="space-y-3">
                    {contactItems.map((item, idx) => (
                      <div
                        key={`${item.raw?._id || item.title}-${idx}`}
                        className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-cyan-100"
                      >
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="mt-1 text-sm text-gray-600">{item.summary}</div>
                        {item.raw?.time_stamp && (
                          <div className="mt-1.5 text-xs text-gray-500">
                            {formatDateTime(item.raw.time_stamp)}
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Notices */}
              {noticeItems.length > 0 && (
                <ModalSection
                  title="Notices"
                  count={noticeItems.length}
                  colorScheme={{
                    border: 'border-amber-200',
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    badge: 'bg-amber-100',
                    badgeText: 'text-amber-700',
                  }}
                >
                  <ul className="space-y-3">
                    {noticeItems.map((item, idx) => (
                      <ModalItem
                        key={`${item.raw?._id || item.title}-${idx}`}
                        title={item.title}
                        summary={item.summary}
                        timestamp={item.raw?.notice_date ? formatDateTime(item.raw.notice_date) : undefined}
                        href={`/dashboard/notice/${item.raw?._id || ''}`}
                        colorScheme={{
                          ring: 'ring-amber-100',
                          hover: 'ring-amber-200',
                        }}
                      />
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Issues */}
              {issueItems.length > 0 && (
                <ModalSection
                  title="Issues"
                  count={issueItems.length}
                  colorScheme={{
                    border: 'border-red-200',
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    badge: 'bg-red-100',
                    badgeText: 'text-red-700',
                  }}
                >
                  <ul className="space-y-3">
                    {issueItems.map((item, idx) => (
                      <ModalItem
                        key={`${item.raw?.issue_number || item.title}-${idx}`}
                        title={item.title}
                        summary={item.summary}
                        timestamp={item.raw?.issue_date ? formatDateTime(item.raw.issue_date) : undefined}
                        href="/dashboard/issue-submit"
                        colorScheme={{
                          ring: 'ring-red-100',
                          hover: 'ring-red-200',
                        }}
                      />
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Special Events */}
              {specialEvents.length > 0 && (
                <ModalSection
                  title="Special Days"
                  count={specialEvents.length}
                  colorScheme={{
                    border: 'border-yellow-200',
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    badge: 'bg-yellow-100',
                    badgeText: 'text-yellow-700',
                  }}
                >
                  <ul className="space-y-2">
                    {specialEvents.map((event, idx) => (
                      <ModalEventItem key={`${event.name}-${idx}`} name={event.name} />
                    ))}
                  </ul>
                </ModalSection>
              )}

              {/* Holidays */}
              {holidayEvents.length > 0 && (
                <ModalSection
                  title="Holidays"
                  count={holidayEvents.length}
                  colorScheme={{
                    border: 'border-orange-200',
                    bg: 'bg-orange-50',
                    text: 'text-orange-700',
                    badge: 'bg-orange-100',
                    badgeText: 'text-orange-700',
                  }}
                >
                  <ul className="space-y-2">
                    {holidayEvents.map((event, idx) => (
                      <ModalEventItem key={`${event.name}-${idx}`} name={event.name} />
                    ))}
                  </ul>
                </ModalSection>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
