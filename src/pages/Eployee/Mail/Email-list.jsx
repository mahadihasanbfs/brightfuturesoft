"use client"


export default function EmailList({
      emails,
      selectedMail,
      onSelectMail,
      isLoading,
      isError,
      error,
      activeTab,
      onMarkAsRead,
      onToggleStar,
}) {
      if (isLoading) {
            return (
                  <div className="p-4 space-y-3">
                        {Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className="p-4 rounded-lg bg-gray-700 ">
                                    <div className="flex items-start space-x-3">
                                          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                                          <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                                                <div className="h-3 bg-gray-600 rounded w-full"></div>
                                          </div>
                                          <div className="w-12 h-3 bg-gray-600 rounded"></div>
                                    </div>
                              </div>
                        ))}
                  </div>
            )
      }

      if (isError) {
            return (
                  <div className="flex items-center justify-center h-64 p-6">
                        <div className="text-center">
                              <div className="w-12 h-12 text-red-400 mx-auto mb-4">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                    </svg>
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">Error loading emails</h3>
                              <p className="text-gray-400 text-sm">{error?.message}</p>
                        </div>
                  </div>
            )
      }

      if (emails.length === 0) {
            return (
                  <div className="flex items-center justify-center h-64 p-6">
                        <div className="text-center">
                              <div className="w-16 h-16 text-gray-500 mx-auto mb-4">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          />
                                    </svg>
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">No emails found</h3>
                              <p className="text-gray-400 text-sm">Your {activeTab} is empty</p>
                        </div>
                  </div>
            )
      }

      return (
            <div className="flex-1 overflow-y-auto">
                  <div className="p-2">
                        {emails.map((mail, idx) => (
                              <div
                                    key={mail.uuid || idx}
                                    className={`group p-4 mb-2 cursor-pointer rounded-lg border transition-all duration-200 hover:bg-gray-700 ${selectedMail === idx
                                          ? "bg-gray-700 border-blue-500 shadow-lg"
                                          : "bg-gray-800 border-gray-600 hover:border-gray-500"
                                          }`}
                                    onClick={() => onSelectMail(idx)}
                              >
                                    <div className="flex items-start space-x-3">
                                          {/* Avatar */}
                                          <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${selectedMail === idx ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-200"
                                                      }`}
                                          >
                                                {(mail.from || mail.to || "U").charAt(0).toUpperCase()}
                                          </div>

                                          {/* Content */}
                                          <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                      <p
                                                            className={`text-sm font-medium truncate ${mail.isRead === false ? "text-white" : "text-gray-300"
                                                                  }`}
                                                      >
                                                            {mail.from || mail.to || "Unknown Sender"}
                                                      </p>
                                                      <div className="flex items-center space-x-2 ml-2">
                                                            <span className="text-xs text-gray-400">
                                                                  {mail.date ? new Date(mail.date).toLocaleDateString() : ""}
                                                            </span>
                                                            {mail.isStarred && <span className="text-yellow-400">⭐</span>}
                                                      </div>
                                                </div>

                                                <p
                                                      className={`text-sm mb-2 truncate ${mail.isRead === false ? "font-medium text-white" : "text-gray-300"
                                                            }`}
                                                >
                                                      {mail.subject || "No Subject"}
                                                </p>

                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                      {mail.text || "No message content available"}
                                                </p>

                                                {/* Attachments indicator */}
                                                {mail.attachments && mail.attachments.length > 0 && (
                                                      <div className="flex items-center mt-2">
                                                            <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                  />
                                                            </svg>
                                                            <span className="text-xs text-gray-400">
                                                                  {mail.attachments.length} attachment{mail.attachments.length > 1 ? "s" : ""}
                                                            </span>
                                                      </div>
                                                )}
                                          </div>

                                          {/* Actions */}
                                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {mail.isRead === false && (
                                                      <button
                                                            onClick={(e) => {
                                                                  e.stopPropagation()
                                                                  onMarkAsRead(mail.messageId || mail.uuid || "")
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-blue-400 rounded"
                                                      >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                                  />
                                                            </svg>
                                                      </button>
                                                )}
                                                <button
                                                      onClick={(e) => {
                                                            e.stopPropagation()
                                                            onToggleStar(mail.messageId || mail.uuid || "")
                                                      }}
                                                      className={`p-1 rounded ${mail.isStarred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"
                                                            }`}
                                                >
                                                      <svg className="w-4 h-4" fill={mail.isStarred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                            />
                                                      </svg>
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        ))}
                  </div>
            </div>
      )
}
