
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext, useState } from "react"
import { base_url } from "../../../layout/Title"
import EmailList from "./Email-list"
import EmailDetail from "./Email-detail"
import ComposeModal from "./Compose-modal"
import { AuthContext } from "../../../context/UseContext/AuthProvider"


const fetcher = async (url) => {
      const res = await fetch(url, {
            headers: {
                  "content-type": "application/json",
                  author: "bright_future_soft",
            },
      })
      if (!res.ok) throw new Error("Failed to fetch")
      return await res.json()
}

export default function Mail() {
      const { user } = useContext(AuthContext)
      const [selectedMailIndex, setSelectedMailIndex] = useState(null)
      const [composeOpen, setComposeOpen] = useState(false)
      const [refreshInbox, setRefreshInbox] = useState(false)
      const [activeTab, setActiveTab] = useState("inbox")
      const [searchTerm, setSearchTerm] = useState("")
      const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
      const queryClient = useQueryClient()

      // Inbox query
      const {
            data: inboxData = { emails: [] },
            isLoading: isInboxLoading,
            isError: isInboxError,
            error: inboxError,
            refetch: refetchInbox,
      } = useQuery({
            queryKey: ["all_mail", user?.email, refreshInbox],
            queryFn: () => fetcher(`${base_url}/mail/get-all-mail?email=${user?.email}`),
            enabled: !!user?.email && activeTab === "inbox" && !searchTerm,
            refetchInterval: 30000,
      })

      // Sent query
      const {
            data: sentMailData = { emails: [] },
            isLoading: isSentLoading,
            isError: isSentError,
            error: sentMailError,
            refetch: refetchSent,
      } = useQuery({
            queryKey: ["sent_mail", user?.email, refreshInbox],
            queryFn: () => fetcher(`${base_url}/mail/sent-mail?email=${user?.email}`),
            enabled: !!user?.email && activeTab === "sent" && !searchTerm,
            refetchInterval: 30000,
      })

      // Search query
      const {
            data: searchData = { emails: [] },
            isLoading: isSearchLoading,
            isError: isSearchError,
            error: searchError,
      } = useQuery({
            queryKey: ["search_mail", user?.email, searchTerm],
            queryFn: () => fetcher(`${base_url}/mail/search?email=${user?.email}&q=${searchTerm}`),
            enabled: !!user?.email && !!searchTerm,
      })

      // Stats query
      const { data: statsData = {} } = useQuery({
            queryKey: ["mail_stats", user?.email],
            queryFn: () => fetcher(`${base_url}/mail/stats?email=${user?.email}`),
            enabled: !!user?.email,
      })

      // Send mail mutation
      const sendMailMutation = useMutation({
            mutationFn: async (mail) => {
                  const res = await fetch(`${base_url}/mail/send-mail`, {
                        method: "POST",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(mail),
                  })
                  if (!res.ok) throw new Error("Failed to send email")
                  return await res.json()
            },
            onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["all_mail"] })
                  queryClient.invalidateQueries({ queryKey: ["sent_mail"] })
            },
      })

      // Mark as read mutation
      const markAsReadMutation = useMutation({
            mutationFn: async (id) => {
                  await fetch(`${base_url}/mail/email/${id}/read`, {
                        method: "PUT",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  })
            },
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all_mail"] }),
      })

      // Toggle star mutation
      const toggleStarMutation = useMutation({
            mutationFn: async (id) => {
                  await fetch(`${base_url}/mail/email/${id}/star`, {
                        method: "PUT",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  })
            },
            onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all_mail"] }),
      })

      const selectedTabEmails = searchTerm
            ? searchData.emails
            : activeTab === "inbox"
                  ? inboxData.emails
                  : activeTab === "sent"
                        ? sentMailData.emails
                        : []

      const selectedMail = selectedMailIndex !== null ? selectedTabEmails[selectedMailIndex] : null

      const handleTabChange = (tab) => {
            setActiveTab(tab)
            setSelectedMailIndex(null)
            setSearchTerm("")
      }

      const handleRefresh = () => {
            setRefreshInbox((r) => !r)
            refetchInbox()
            refetchSent()
      }

      const handleReply = (email) => {
            setComposeOpen(true)
      }

      const handleForward = (email) => {
            setComposeOpen(true)
      }

      const handleMarkAsRead = (id) => {
            markAsReadMutation.mutate(id)
      }

      const handleToggleStar = (id) => {
            toggleStarMutation.mutate(id)
      }

      const handleSearch = (e) => {
            setSearchTerm(e.target.value)
            setSelectedMailIndex(null)
      }

      const sidebarItems = [
            {
                  id: "inbox",
                  label: "Inbox",
                  icon: "📥",
                  count: inboxData.emails.length,
            },
            {
                  id: "sent",
                  label: "Sent",
                  icon: "📤",
                  count: sentMailData.emails.length,
            },
            {
                  id: "drafts",
                  label: "Drafts",
                  icon: "📝",
                  count: 0,
            },
            {
                  id: "starred",
                  label: "Starred",
                  icon: "⭐",
                  count: 0,
            },
            {
                  id: "archive",
                  label: "Archive",
                  icon: "📦",
                  count: 0,
            },
            {
                  id: "trash",
                  label: "Trash",
                  icon: "🗑️",
                  count: 0,
            },
      ]

      return (
            <div className="h-screen bg-gray-900 flex overflow-hidden">
                  {/* Sidebar */}
                  <aside
                        className={`${sidebarCollapsed ? "w-16" : "w-72"
                              } bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300`}
                  >

                        {/* Search */}
                        {!sidebarCollapsed && (
                              <div className="p-4">
                                    <div className="relative">
                                          <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                          </svg>
                                          <input
                                                type="text"
                                                placeholder="Search emails..."
                                                value={searchTerm}
                                                onChange={handleSearch}
                                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                          />
                                    </div>
                              </div>
                        )}

                        {/* Navigation */}
                        <div className="flex-1 px-4 overflow-y-auto">
                              <nav className="space-y-1">
                                    {sidebarItems.map((item) => (
                                          <button
                                                key={item.id}
                                                onClick={() => handleTabChange(item.id)}
                                                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${activeTab === item.id
                                                      ? "bg-blue-600 text-white"
                                                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                      } ${sidebarCollapsed ? "justify-center" : ""}`}
                                          >
                                                <div className="flex items-center">
                                                      <span className="text-lg mr-3">{item.icon}</span>
                                                      {!sidebarCollapsed && <span>{item.label}</span>}
                                                </div>
                                                {!sidebarCollapsed && item.count > 0 && (
                                                      <span className="bg-gray-600 text-gray-200 text-xs font-medium px-2 py-1 rounded-full">
                                                            {item.count}
                                                      </span>
                                                )}
                                          </button>
                                    ))}
                              </nav>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-gray-700 space-y-2">
                              <button
                                    onClick={() => setComposeOpen(true)}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${sidebarCollapsed ? "px-3" : ""
                                          }`}
                              >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {!sidebarCollapsed && <span>Compose</span>}
                              </button>
                              <button
                                    onClick={handleRefresh}
                                    className={`w-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${sidebarCollapsed ? "px-3" : ""
                                          }`}
                              >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                          />
                                    </svg>
                                    {!sidebarCollapsed && <span>Refresh</span>}
                              </button>
                        </div>
                  </aside>

                  {/* Main Content */}
                  <main className="flex-1 flex overflow-hidden">
                        {/* Email List */}
                        <section className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col">
                              <div className="p-6 border-b border-gray-700">
                                    <div className="flex items-center justify-between">
                                          <h2 className="text-lg font-semibold text-white capitalize">{activeTab}</h2>
                                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                                                {selectedTabEmails.length} emails
                                          </span>
                                    </div>
                              </div>
                              <EmailList
                                    emails={selectedTabEmails}
                                    selectedMail={selectedMailIndex}
                                    onSelectMail={setSelectedMailIndex}
                                    isLoading={searchTerm ? isSearchLoading : activeTab === "inbox" ? isInboxLoading : isSentLoading}
                                    isError={searchTerm ? isSearchError : activeTab === "inbox" ? isInboxError : isSentError}
                                    error={searchTerm ? searchError : activeTab === "inbox" ? inboxError : sentMailError}
                                    activeTab={activeTab}
                                    onMarkAsRead={handleMarkAsRead}
                                    onToggleStar={handleToggleStar}
                              />
                        </section>

                        {/* Email Detail */}
                        <section className="flex-1 bg-gray-900">
                              <EmailDetail
                                    emailId={selectedMail}
                                    onReply={handleReply}
                                    onForward={handleForward}
                                    onMarkAsRead={handleMarkAsRead}
                                    onToggleStar={handleToggleStar}
                              />
                        </section>
                  </main>

                  {/* Compose Modal */}
                  <ComposeModal
                        open={composeOpen}
                        onClose={() => setComposeOpen(false)}
                        onSent={() => {
                              setRefreshInbox((r) => !r)
                              setComposeOpen(false)
                        }}
                        baseUrl={base_url}
                        sendMailMutation={sendMailMutation}
                  />
            </div>
      )
}
