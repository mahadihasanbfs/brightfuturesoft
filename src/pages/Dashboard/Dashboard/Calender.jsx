import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { base_url } from "../../../layout/Title";

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





      const employeeBirthdays = teamMembers
            .filter(member => member.dob) // যাদের dob আছে
            .map(member => {
                  const dobDate = new Date(member.dob);

                  return {
                        id: member._id,
                        name: member.name,
                        month: dobDate.getMonth() + 1,
                        day: dobDate.getDate(),
                        image: member.image,
                        designation: member.designation,
                  };
            });



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
            const events = [];
            employeeBirthdays.forEach(b =>
                  b.month === currentMonth && b.day === day &&
                  events.push({ name: `${b.name}'s Birthday`, type: "birthday" })
            );
            specialDays.forEach(s =>
                  s.month === currentMonth && s.day === day &&
                  events.push({ name: s.name, type: "special" })
            );
            const dateStr = `${year}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            sampleHolidays.forEach(h =>
                  h.date === dateStr &&
                  events.push({ name: h.name, type: "holiday" })
            );
            return events;
      };

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
                                                            className={`aspect-square md:aspect-auto md:h-24 lg:h-28 border ${border} p-1.5 md:p-2 lg:p-3 transition-all hover:shadow-md relative overflow-hidden group ${bg} ${isTodayDate ? "ring-2 ring-blue-600 ring-inset" : ""}`}>
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
                        </div>
                  </div>
            </div>
      )
}
