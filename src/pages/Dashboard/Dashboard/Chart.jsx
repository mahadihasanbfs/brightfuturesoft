import { useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSprings, animated } from "@react-spring/web"
import { CheckCircle, Calendar, Bell, Bug, AlertTriangle, FileText, MessageSquare, FolderOpen } from "lucide-react"
import { base_url } from "../../../layout/Title"
import { FaBlog } from "react-icons/fa"
import { Link } from "react-router-dom"
import CalendarPage from "./Calender"
import { AuthContext } from "../../../context/UseContext/AuthProvider"

export default function TaskReport() {
      const { user } = useContext(AuthContext)
      const [greeting, setGreeting] = useState("")

      useEffect(() => {
            const hour = new Date().getHours();
            let greet = "Hello";
            if (hour >= 0 && hour < 5) {
                  greet = "Good Midnight";
            } else if (hour >= 5 && hour < 7) {
                  greet = "Good Dawn";
            } else if (hour >= 7 && hour < 12) {
                  greet = "Good Morning";
            } else if (hour === 12) {
                  greet = "Good Noon";
            } else if (hour > 12 && hour < 17) {
                  greet = "Good Afternoon";
            } else if (hour >= 17 && hour < 19) {
                  greet = "Good Evening";
            } else if (hour >= 19 && hour < 21) {
                  greet = "Good Dusk";
            } else if (hour >= 21 && hour <= 23) {
                  greet = "Good Night";
            }
            setGreeting(greet);
      }, []);

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

      const CALENDLY_TOKEN = "Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUxMDIzMDQ4LCJqdGkiOiI3OWMzZDE3NS1hYjJkLTRiOTMtOWUwMS1lM2E5MGE2ZTQ0YmYiLCJ1c2VyX3V1aWQiOiJiMTgxNmZlZi1kYWEyLTRhMWItYmM1NS03MjM0OGRjODA2ZWEifQ.fqFBxpZJcdkp7d4yHaB8_54B5_zpFGSKcKGXQlExAE4psCUv-amJMaIMddsLaQdvkMlra0OtKh6pLajwbKpdXQ";

      const getDateString = (date) => date.toISOString().split("T")[0];

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

      const statsData = [
            { icon: CheckCircle, label: "New Tasks", value: "0", color: "text-emerald-400", bgColor: "bg-emerald-500/20", href: "/dashboard/your-task" },
            { icon: Calendar, label: "New Meetings", value: meting_data?.filter(meting => meting.status !== "end").length, color: "text-blue-400", bgColor: "bg-blue-500/20", href: "/dashboard/meeting_management" },
            { icon: Bell, label: "Notices", value: Array.isArray(notice_data) ? notice_data.filter(item => new Date(item.notice_date).getTime() >= Date.now() - 3 * 24 * 60 * 60 * 1000)?.length : 0, color: "text-amber-400", bgColor: "bg-amber-500/20", href: "/dashboard/notice" },
            { icon: Bug, label: "Employee Issues", value: Array.isArray(issue_data) ? issue_data.filter(issue => issue.status == "pending")?.length : 0, color: "text-red-400", bgColor: "bg-red-500/20", href: "/dashboard/issue-submit" },
            { icon: AlertTriangle, label: "New Client Meeting", value: todaysMeetingCount, color: "text-orange-400", bgColor: "bg-orange-500/20", href: "/dashboard/client_meetings" },
            { icon: FileText, label: "Applications", value: reactApplicationCount, color: "text-purple-400", bgColor: "bg-purple-500/20", href: "/dashboard/job-management" },
            { icon: MessageSquare, label: "Contact Requests", value: Array.isArray(contacts) ? contacts?.filter(contact => contact.status !== "contacted").length : 0, color: "text-cyan-400", bgColor: "bg-cyan-500/20", href: "/dashboard/contact-management" },
            { icon: FolderOpen, label: "Projects", value: Array.isArray(project_data) ? project_data?.length : 0, color: "text-indigo-400", bgColor: "bg-indigo-500/20", href: "/dashboard/project-management" },
            { icon: FaBlog, label: "Blogs", value: Array.isArray(blog_data) ? blog_data?.length : 0, color: "text-indigo-400", bgColor: "bg-indigo-500/20", href: "/dashboard/blog-management" },
      ]

      if (isLoadingContact || isLoadingMeting || isLoadingNotice || isLoadingIssue || isLoadingProject) {
            return <LoadingSkeleton />
      }

      return (
            <div className="min-h-screen bg-[#111827] py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
                  <div className="max-w-7xl ">
                        {/* Header Section */}
                        <div className="text-start mb-12 lg:mb-16">
                              <div className="space-y-4">
                                    <SplitText
                                          text={`${greeting}, `}
                                          className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white"
                                          delay={150}
                                          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
                                          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                                          easing="easeOutCubic"
                                          threshold={0.2}
                                          rootMargin="-50px"
                                    />
                                    <div className="text-3xl sm:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                          {user?.name}
                                    </div>
                                    <h4 className="text-lg sm:text-2xl lg:text-4xl font-medium text-gray-300 font-sans mt-4">
                                          Today's All Reports Are Here
                                    </h4>
                              </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                              {statsData.map((stat, index) => (
                                    <SpotlightCard key={index} className="group" spotlightColor="rgba(59, 130, 246, 0.15)">
                                          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-800/70 hover:border-gray-600/50 transition-all duration-300 h-full shadow-xl hover:shadow-2xl">
                                                <Link to={stat.href} >
                                                      <div className="p-6">
                                                            <div className="flex items-center space-x-4">
                                                                  <div
                                                                        className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                                                                  >
                                                                        <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                                                                  </div>
                                                                  <div className="flex-1 min-w-0">
                                                                        <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-300">
                                                                              {stat.value}
                                                                        </h4>
                                                                        <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-300 leading-tight group-hover:text-gray-200 transition-colors duration-300">
                                                                              {stat.label}
                                                                        </p>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </Link>
                                          </div>
                                    </SpotlightCard>
                              ))}
                        </div>

                        <CalendarPage />

                  </div>
            </div>
      )
}

const LoadingSkeleton = () => {
      return (
            <div className="min-h-screen bg-[#111827] py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
                  <div className="max-w-7xl">
                        <div className="text-start mb-12 lg:mb-16 space-y-4">
                              <div className="h-16 sm:h-24 lg:h-32 w-3/4 bg-gray-700/30 rounded-lg"></div>
                              <div className="h-12 sm:h-16 lg:h-20 w-1/2 bg-gray-700/30 rounded-lg"></div>
                              <div className="h-6 sm:h-8 w-1/3 bg-gray-700/30 rounded-lg"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                              {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl">
                                          <div className="p-6">
                                                <div className="flex items-center space-x-4">
                                                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gray-700/30"></div>
                                                      <div className="flex-1 space-y-2">
                                                            <div className="h-8 sm:h-10 w-16 bg-gray-700/30 rounded"></div>
                                                            <div className="h-4 sm:h-5 w-24 bg-gray-700/30 rounded"></div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>
      )
}

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(59, 130, 246, 0.15)" }) => {
      const divRef = useRef(null)

      const handleMouseMove = (e) => {
            if (!divRef.current) return

            const rect = divRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            divRef.current.style.setProperty("--mouse-x", `${x}px`)
            divRef.current.style.setProperty("--mouse-y", `${y}px`)
            divRef.current.style.setProperty("--spotlight-color", spotlightColor)
      }

      return (
            <div
                  ref={divRef}
                  onMouseMove={handleMouseMove}
                  className={`relative overflow-hidden rounded-xl ${className}`}
                  style={{
                        background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--spotlight-color, ${spotlightColor}) 0%, transparent 50%)`,
                  }}
            >
                  {children}
            </div>
      )
}

const SplitText = ({
      text = "",
      className = "",
      delay = 100,
      animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
      animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
      easing = "easeOutCubic",
      threshold = 0.1,
      rootMargin = "-100px",
      textAlign = "center",
      onLetterAnimationComplete,
}) => {
      const words = text.split(" ").map((word) => word.split(""))
      const letters = words.flat()
      const [inView, setInView] = useState(false)
      const ref = useRef(null)
      const animatedCount = useRef(0)

      useEffect(() => {
            if (!ref.current) return

            const observer = new window.IntersectionObserver(
                  ([entry]) => {
                        if (entry.isIntersecting) {
                              setInView(true)
                              observer.unobserve(ref.current)
                        }
                  },
                  { threshold, rootMargin },
            )

            observer.observe(ref.current)
            return () => observer.disconnect()
      }, [threshold, rootMargin])

      const springs = useSprings(
            letters.length,
            letters.map((_, i) => ({
                  from: animationFrom,
                  to: inView
                        ? async (next) => {
                              await next(animationTo)
                              animatedCount.current += 1
                              if (animatedCount.current === letters.length && onLetterAnimationComplete) {
                                    onLetterAnimationComplete()
                              }
                        }
                        : animationFrom,
                  delay: i * delay,
                  config: { easing },
            })),
      )

      return (
            <p
                  ref={ref}
                  className={`${className}`}
                  style={{
                        textAlign: textAlign,
                        overflow: "hidden",
                        display: "inline",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                  }}
            >
                  {words.map((word, wordIndex) => (
                        <span key={wordIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                              {word.map((letter, letterIndex) => {
                                    const index = words.slice(0, wordIndex).reduce((acc, w) => acc + w.length, 0) + letterIndex
                                    return (
                                          <animated.span
                                                key={index}
                                                style={{
                                                      ...springs[index],
                                                      display: "inline-block",
                                                      willChange: "transform, opacity",
                                                }}
                                          >
                                                {letter}
                                          </animated.span>
                                    )
                              })}
                              <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
                        </span>
                  ))}
            </p>
      )
}
