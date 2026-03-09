

import { useContext, useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"

import logo from "../Assctes/logo.png"
import { AuthContext } from "../context/UseContext/AuthProvider"
import { Mail } from "lucide-react"
import { FaFileInvoice } from "react-icons/fa"


const navigationItems = [
      {
            title: "Dashboard",
            path: "/dashboard/home",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                  </svg>
            ),
      },
      {
            title: "Issue Submit",
            path: "/dashboard/issue-submit",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                  </svg>
            ),
      },
      {
            title: "Notice",
            path: "/dashboard/notice",
            icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-alert-icon lucide-badge-alert"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
            ),
      },
      {
            title: "Your Task",
            path: "/dashboard/your-task",
            icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-check2-icon lucide-calendar-check-2"><path d="M8 2v4" /><path d="M16 2v4" /><path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><path d="M3 10h18" /><path d="m16 20 2 2 4-4" /></svg>
            ),
      },
      {
            title: "Client Meeting",
            path: "/dashboard/client_meetings",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                  </svg>
            ),
      },
      {
            title: "Meeting",
            path: "/dashboard/meeting_management",
            icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-presentation-icon lucide-presentation"><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
            ),
      },
      {
            title: "Web Mail",
            path: "https://mail.google.com/mail/u/0/#inbox",
            icon: (
                  <Mail className="h-5 w-5" />
            ),
      },
]

// Admin-only navigation items
const adminNavigationItems = [
      {
            title: "Blog Management",
            path: "/dashboard/blog-management",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                  </svg>
            ),
      },
      {
            title: "Job Post",
            path: "/dashboard/job-management",
            icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-id-card-lanyard-icon lucide-id-card-lanyard"><path d="M13.5 8h-3" /><path d="m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" /><path d="M16.899 22A5 5 0 0 0 7.1 22" /><path d="m9 2 3 6" /><circle cx="12" cy="15" r="3" /></svg>
            ),
      },
      {
            title: "Project Management",
            path: "/dashboard/project-management",
            icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-kanban-icon lucide-folder-kanban"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /><path d="M8 10v4" /><path d="M12 10v2" /><path d="M16 10v6" /></svg>
            ),
      },
      {
            title: "Employee Management",
            path: "/dashboard/employee-management",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                  </svg>
            ),
      },
      {
            title: "Invoice Management",
            path: "/dashboard/invoice",
            icon: (
                  <FaFileInvoice />
            ),
      },
      // {
      //       title: "Testimonial Management",
      //       path: "/dashboard/testimonial-management",
      //       icon: (
      //             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      //                   <path
      //                         strokeLinecap="round"
      //                         strokeLinejoin="round"
      //                         d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
      //                   />
      //             </svg>
      //       ),
      // },
]

// Common navigation items for all users
const commonNavigationItems = [
      {
            title: "Contact Management",
            path: "/dashboard/contact-management",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                  </svg>
            ),
      },
      {
            title: "Subscribers Management",
            path: "/dashboard/subscribers",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                  </svg>
            ),
      },
      {
            title: "Account",
            path: "/dashboard/account",
            icon: (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
            ),
      },
]

// Navigation Item Component (declared at module scope to avoid recreating during render)
const NavigationItem = ({ item, onClick }) => (
      <NavLink
            target={item.title === "Web Mail" ? "_blank" : "_self"}
            to={item.path}
            className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-[#1c65b4] text-white shadow-lg" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
            }
            onClick={onClick}
      >
            <span className="opacity-75">{item.icon}</span>
            <span>{item.title}</span>
      </NavLink>
)

// Sidebar Content Component (module scope)
const SidebarContent = ({ onItemClick, searchValue, onSearchChange, isAdmin, user, handleLogout, logo }) => (
      <div className="flex flex-col h-full">
            <div className="hidden lg:flex items-center justify-start px-6 py-8 border-b border-gray-800">
                  <Link to="/" className="flex items-start ">
                        <img src={logo || "/placeholder.svg"} alt="Logo" className="w-40" />
                  </Link>
            </div>

            <div className="overflow-y-auto">
                  <nav className="flex-1 px-4 py-6 space-y-2 ">

                        <div className="flex items-center justify-between mb-4">
                              <input
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    value={searchValue}
                                    placeholder="Search navigation..."
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                              />
                        </div>

                        <div className="space-y-1">
                              {navigationItems.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())).map((item) => (
                                    <NavigationItem key={item.path} item={item} onClick={onItemClick} />
                              ))}
                        </div>


                        {isAdmin && (
                              <>
                                    <div className="pt-6">
                                          <div className="px-4 pb-2">
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</h3>
                                          </div>
                                          <div className="space-y-1">
                                                {adminNavigationItems.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())).map((item) => (
                                                      <NavigationItem key={item.path} item={item} onClick={onItemClick} />
                                                ))}
                                          </div>
                                    </div>
                              </>
                        )}


                        <div className="pt-6">
                              <div className="px-4 pb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">General</h3>
                              </div>
                              <div className="space-y-1">
                                    {commonNavigationItems.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase())).map((item) => (
                                          <NavigationItem key={item.path} item={item} onClick={onItemClick} />
                                    ))}
                              </div>
                        </div>


                        <div className="pt-6">
                              <button
                                    onClick={() => {
                                          handleLogout()
                                          onItemClick?.()
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
                              >
                                    <svg className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                          />
                                    </svg>
                                    <span>Log out</span>
                              </button>
                        </div>
                  </nav>
            </div>



            {user && (
                  <div className="px-4 py-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                              <img
                                    src={user?.image || "https://randomuser.me/api/portraits/women/79.jpg"}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                                    alt={user?.name || "User"}
                              />
                              <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.possition
                                    }</p>
                              </div>
                        </div>
                  </div>
            )}
      </div>
)

const Dashboard = () => {
      const { user, setUser } = useContext(AuthContext)
      const navigate = useNavigate()
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
      const [searchValue, setSearchValue] = useState("")


      const handleLogout = () => {
            setUser(null)
            localStorage.removeItem("data")
            navigate("/sign_in")
      }

      const closeMobileMenu = () => {
            setMobileMenuOpen(false)
      }

      const isAdmin = user?.designation === "Chief Executive Officer" || user?.designation === "manager"

      if (!user) {
            navigate("/sign_in")
      }

      

      return (
            <div className="flex h-screen bg-gray-100">
                  {/* Mobile Menu Overlay */}
                  {mobileMenuOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={closeMobileMenu} />
                  )}

                  {/* Desktop Sidebar */}
                  <aside className="hidden lg:flex ">
                        <div className="flex flex-col w-80 bg-gray-900 border-r border-gray-800">
                              <SidebarContent onItemClick={closeMobileMenu} searchValue={searchValue} onSearchChange={setSearchValue} isAdmin={isAdmin} user={user} handleLogout={handleLogout} logo={logo} />
                        </div>
                  </aside>

                  {/* Mobile Sidebar */}
                  <div
                        className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col h-full ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                              }`}
                  >
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
                              <Link to="/" className="flex items-center">
                                    <img src={logo || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />
                              </Link>
                              <button
                                    onClick={closeMobileMenu}
                                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                              >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                              </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                              <SidebarContent onItemClick={closeMobileMenu} searchValue={searchValue} onSearchChange={setSearchValue} isAdmin={isAdmin} user={user} handleLogout={handleLogout} logo={logo} />
                        </div>

                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Mobile Header */}
                        <header className="lg:hidden bg-gray-900 shadow-sm border-b border-gray-700">
                              <div className="flex items-center justify-between px-4 py-3">
                                    <Link to="/" className="flex items-center">
                                          <img src={logo || "/placeholder.svg"} alt="Logo" className="h-12 w-auto" />
                                    </Link>
                                    <button
                                          onClick={() => setMobileMenuOpen(true)}
                                          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                    >
                                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                          </svg>
                                    </button>
                              </div>
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 overflow-y-auto bg-gray-900">
                              <div className="h-full">
                                    <Outlet />
                              </div>
                        </main>
                  </div>
            </div>
      )
}

export default Dashboard
