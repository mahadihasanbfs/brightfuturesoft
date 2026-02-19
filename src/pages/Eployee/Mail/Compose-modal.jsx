"use client"

import { useState } from "react"
import { base_url } from "../../../layout/Title"

export default function ComposeModal({ open, onClose, onSent, }) {
      const [form, setForm] = useState({ to: "", subject: "", text: "" })
      const [sending, setSending] = useState(false)
      const [sent, setSent] = useState(false)
      const [error, setError] = useState("")
      const [isMinimized, setIsMinimized] = useState(false)

      const handleChange = (e) => {
            setForm({ ...form, [e.target.name]: e.target.value })
            setSent(false)
            setError("")
      }

      const handleSend = async (e) => {
            e.preventDefault()
            setSending(true)
            setError("")

            try {
                  const response = await fetch(`${base_url}/mail/send-mail`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(form),
                  })

                  if (!response.ok) {
                        throw new Error("Failed to send email")
                  }

                  setSending(false)
                  setSent(true)
                  setForm({ to: "", subject: "", text: "" })
                  onSent()
                  setTimeout(onClose, 2000)
            } catch (err) {
                  setSending(false)
                  setError(err.message || "Failed to send email")
            }
      }

      const handleClose = () => {
            setForm({ to: "", subject: "", text: "" })
            setSent(false)
            setError("")
            onClose()
      }

      if (!open) return null

      return (
            <div className="fixed inset-0 bg-gray-900/90 bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div
                        className={`bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700 ${isMinimized ? "h-16" : "max-h-[90vh]"
                              } transition-all duration-300 overflow-hidden`}
                  >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                              <h2 className="text-xl font-semibold text-white">Compose Email</h2>
                              <div className="flex items-center space-x-2">
                                    <button
                                          onClick={() => setIsMinimized(!isMinimized)}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {isMinimized ? (
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                      />
                                                ) : (
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                )}
                                          </svg>
                                    </button>
                                    <button
                                          onClick={handleClose}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                    </button>
                              </div>
                        </div>

                        {!isMinimized && (
                              <form onSubmit={handleSend} className="p-6 space-y-6">
                                    <div className="space-y-4">
                                          <div>
                                                <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-2">
                                                      To
                                                </label>
                                                <input
                                                      type="email"
                                                      id="to"
                                                      name="to"
                                                      placeholder="recipient@example.com"
                                                      required
                                                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-black placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                      value={form.to}
                                                      onChange={handleChange}
                                                />
                                          </div>

                                          <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                                      Subject
                                                </label>
                                                <input
                                                      type="text"
                                                      id="subject"
                                                      name="subject"
                                                      placeholder="Email subject"
                                                      required
                                                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                      value={form.subject}
                                                      onChange={handleChange}
                                                />
                                          </div>

                                          <div>
                                                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                                                      Message
                                                </label>
                                                <textarea
                                                      id="text"
                                                      name="text"
                                                      placeholder="Write your message here..."
                                                      required
                                                      rows={12}
                                                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                      value={form.text}
                                                      onChange={handleChange}
                                                />
                                          </div>
                                    </div>

                                    {error && (
                                          <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
                                                <div className="flex items-center">
                                                      <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth={2}
                                                                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                      </svg>
                                                      <p className="text-sm text-red-300">{error}</p>
                                                </div>
                                          </div>
                                    )}

                                    {sent && (
                                          <div className="p-3 bg-green-900 border border-green-700 rounded-lg">
                                                <div className="flex items-center">
                                                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                      </svg>
                                                      <p className="text-sm text-green-300">Email sent successfully!</p>
                                                </div>
                                          </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                                          <button
                                                type="button"
                                                className="flex items-center px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                          >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                      />
                                                </svg>
                                                Attach files
                                          </button>

                                          <div className="flex space-x-3">
                                                <button
                                                      type="button"
                                                      onClick={handleClose}
                                                      className="px-6 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      disabled={sending}
                                                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 text-white rounded-lg transition-colors flex items-center space-x-2"
                                                >
                                                      {sending ? (
                                                            <>
                                                                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                                        <circle
                                                                              className="opacity-25"
                                                                              cx="12"
                                                                              cy="12"
                                                                              r="10"
                                                                              stroke="currentColor"
                                                                              strokeWidth="4"
                                                                        ></circle>
                                                                        <path
                                                                              className="opacity-75"
                                                                              fill="currentColor"
                                                                              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                        ></path>
                                                                  </svg>
                                                                  <span>Sending...</span>
                                                            </>
                                                      ) : (
                                                            <>
                                                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={2}
                                                                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                                                        />
                                                                  </svg>
                                                                  <span>Send Email</span>
                                                            </>
                                                      )}
                                                </button>
                                          </div>
                                    </div>
                              </form>
                        )}
                  </div>
            </div>
      )
}
