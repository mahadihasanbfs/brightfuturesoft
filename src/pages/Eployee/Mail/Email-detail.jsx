"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

import { base_url } from "../../../layout/Title"
import { AuthContext } from "../../../context/UseContext/AuthProvider"


export default function EmailDetail({ emailId, onReply, onForward, onMarkAsRead, onToggleStar }) {
      const { user } = useContext(AuthContext)

      const { data, isLoading, isError, error } = useQuery({
            queryKey: ["email_detail", emailId?.messageId],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/mail/email/${emailId?.messageId}?email=${user?.email}`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  })
                  if (!res.ok) throw new Error("Failed to fetch email details")
                  return await res.json()
            },
            enabled: !!emailId?.messageId,
      })

      if (!emailId?.messageId) {
            return (
                  <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">📧</span>
                              </div>
                              <h3 className="text-xl font-semibold text-white mb-2">No email selected</h3>
                              <p className="text-gray-400">Choose an email from the list to view its contents</p>
                        </div>
                  </div>
            )
      }

      if (isLoading) {
            return (
                  <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-gray-700">
                              <div className="space-y-4">
                                    <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                    <div className="flex items-center space-x-4">
                                          <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                                          <div className="space-y-2">
                                                <div className="h-4 bg-gray-700 rounded w-48 animate-pulse"></div>
                                                <div className="h-3 bg-gray-700 rounded w-32 animate-pulse"></div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        <div className="flex-1 p-6 space-y-4">
                              <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                              <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                              <div className="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
                              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                        </div>
                  </div>
            )
      }

      if (isError) {
            return (
                  <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                              <div className="w-16 h-16 text-red-400 mx-auto mb-4">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                    </svg>
                              </div>
                              <h3 className="text-lg font-medium text-white mb-2">Failed to load email</h3>
                              <p className="text-gray-400">{error?.message}</p>
                        </div>
                  </div>
            )
      }

      const email = data?.email

      if (!email) {
            return (
                  <div className="flex items-center justify-center h-full">
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
                              <h3 className="text-lg font-medium text-white mb-2">Email not found</h3>
                              <p className="text-gray-400">This email may have been deleted or moved</p>
                        </div>
                  </div>
            )
      }

      return (
            <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-gray-800 border-b border-gray-700 p-6">
                        <div className="flex items-start justify-between mb-6">
                              <h1 className="text-2xl font-bold text-white flex-1 mr-4 leading-tight">{email.subject || "No Subject"}</h1>
                              <div className="flex items-center space-x-2">
                                    <button
                                          onClick={() => onReply && onReply(email)}
                                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                                />
                                          </svg>
                                          <span>Reply</span>
                                    </button>
                                    <button
                                          onClick={() => onForward && onForward(email)}
                                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                          </svg>
                                          <span>Forward</span>
                                    </button>
                                    <button
                                          onClick={() => onToggleStar(email.messageId)}
                                          className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
                                    >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                        <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-lg">
                                          {(email.from || email.to || "U").charAt(0).toUpperCase()}
                                    </span>
                              </div>
                              <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                          </svg>
                                          <p className="font-semibold text-white">{email.from || email.to || "Unknown Sender"}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h8a2 2 0 002-2L16 7"
                                                />
                                          </svg>
                                          <span>{email.date ? new Date(email.date).toLocaleString() : "Unknown date"}</span>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                        {email.text ? (
                              <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
                                    <div className="prose prose-invert max-w-none">
                                          <div className="whitespace-pre-wrap text-gray-200 leading-relaxed text-base">{email.text}</div>
                                    </div>
                              </div>
                        ) : (
                              <div className="text-center py-16">
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
                                    <h3 className="text-lg font-medium text-white mb-2">No message content</h3>
                                    <p className="text-gray-400">This email appears to be empty</p>
                              </div>
                        )}

                        {/* Attachments */}
                        {email.attachments && email.attachments.length > 0 && (
                              <div className="mt-8">
                                    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                                          <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                      />
                                                </svg>
                                                <h3 className="text-lg font-semibold text-white">Attachments ({email.attachments.length})</h3>
                                          </div>
                                          <div className="grid gap-3">
                                                {email.attachments.map((attachment, idx) => (
                                                      <div
                                                            key={idx}
                                                            className="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
                                                      >
                                                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                                                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                                        />
                                                                  </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                  <p className="font-medium text-white truncate">{attachment.name}</p>
                                                                  <p className="text-sm text-gray-400">{attachment.size}</p>
                                                            </div>
                                                            <button className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                        />
                                                                  </svg>
                                                                  Download
                                                            </button>
                                                      </div>
                                                ))}
                                          </div>
                                    </div>
                              </div>
                        )}
                  </div>
            </div>
      )
}
