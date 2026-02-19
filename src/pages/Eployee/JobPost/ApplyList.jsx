"use client"

import React, { useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { base_url } from "../../../layout/Title"

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 500]


const Toast = ({ message, type, onClose }) => {
      useEffect(() => {
            const timer = setTimeout(onClose, 4000)
            return () => clearTimeout(timer)
      }, [onClose])

      const bgColor =
            type === "success"
                  ? "bg-green-500 border-green-500"
                  : type === "error"
                        ? "bg-red-500 border-red-500"
                        : "bg-blue-500 border-blue-500"

      const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"

      return (
            <div
                  className={`fixed top-4 right-4 z-[100] ${bgColor} border border-gray-500 rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3 min-w-[320px] animate-slide-in`}
            >
                  <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${type === "success"
                              ? "bg-green-500 text-success-bg"
                              : type === "error"
                                    ? "bg-danger text-danger-bg"
                                    : "bg-info text-info-bg"
                              }`}
                  >
                        {icon}
                  </div>
                  <p className="text-foreground text-sm flex-1">{message}</p>
                  <button
                        onClick={onClose}
                        className="text-muted hover:text-foreground transition-colors"
                  >
                        <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                        >
                              <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                              />
                        </svg>
                  </button>
            </div>
      )
}

const Apply_List = () => {
      const location = useLocation()
      const [show, set_show] = useState(null)
      const [resume, setResume] = useState(null)
      const [selectedApplications, setSelectedApplications] = useState([])
      const [sortConfig, setSortConfig] = useState({
            key: null,
            direction: "asc"
      })
      const [filterStatus, setFilterStatus] = useState("all")
      const [copied, setCopied] = useState(false)
      const [searchQuery, setSearchQuery] = useState("")
      const [showEmailModal, setShowEmailModal] = useState(false)
      const [emailType, setEmailType] = useState("")
      const [showInterviewModal, setShowInterviewModal] = useState(false)
      const [interviewData, setInterviewData] = useState({
            time: "",
            meetLink: "",
            date: ""
      })
      const [currentPage, setCurrentPage] = useState(1)
      const [pageSize, setPageSize] = useState(10)
      const [deletePopUp, setDeletePopUp] = useState(false)
      const [deleteId, setDeleteId] = useState("")
      const [toast, setToast] = useState(null)

      const showToast = (message, type) => {
            setToast({ message, type })
      }

      const { data: job_data = [], refetch, isLoading } = useQuery({
            queryKey: ["job_apply", location.search],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/job-post/get-job-apply${location.search}`,
                        {
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft"
                              },
                              method: "GET"
                        }
                  )
                  const data = await res.json()
                  return data.data
            }
      })

      const delete_meeting = id => {
            setDeletePopUp(true)
            setDeleteId(id)
      }

      const confirmDelete = async () => {
            if (deleteId) {
                  const res = await fetch(
                        `${base_url}/job-post/delete-job-apply?job_apply_id=${deleteId}`,
                        {
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft"
                              },
                              method: "DELETE"
                        }
                  )
                  const data = await res.json()
                  if (data.success) {
                        showToast(data.message, "success")
                        refetch()
                  } else {
                        showToast(data.message, "error")
                  }
                  setDeletePopUp(false)
                  setDeleteId("")
            }
      }

      const bulk_update_status = async (ids, status) => {
            const results = []
            for (const id of ids) {
                  try {
                        const res = await fetch(
                              `${base_url}/job-post/update-job-apply?job_apply_id=${id}`,
                              {
                                    headers: {
                                          "content-type": "application/json",
                                          author: "bright_future_soft"
                                    },
                                    method: "PUT",
                                    body: JSON.stringify({ status })
                              }
                        )
                        const data = await res.json()
                        results.push({ id, ...data })
                  } catch (err) {
                        results.push({
                              id,
                              success: false,
                              message: err?.message || "Network error"
                        })
                  }
            }
            return results
      }

      const shortlist_status = async (id, status) => {
            const res = await fetch(
                  `${base_url}/job-post/update-job-apply?job_apply_id=${id}`,
                  {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft"
                        },
                        method: "PUT",
                        body: JSON.stringify({ status })
                  }
            )
            const data = await res.json()
            if (data.success) {
                  showToast(data.message, "success")
                  refetch()
            } else {
                  showToast(data.message, "error")
            }
      }

      const handleSort = key => {
            let direction = "asc"
            if (sortConfig.key === key && sortConfig.direction === "asc")
                  direction = "desc"
            setSortConfig({ key, direction })
      }

      const handleSearch = e => setSearchQuery(e.target.value)

      const sortedData = React.useMemo(() => {
            const sortableData = [...job_data]
            if (sortConfig.key) {
                  sortableData.sort((a, b) => {
                        if (a[sortConfig.key] < b[sortConfig.key])
                              return sortConfig.direction === "asc" ? -1 : 1
                        if (a[sortConfig.key] > b[sortConfig.key])
                              return sortConfig.direction === "asc" ? 1 : -1
                        return 0
                  })
            }
            return sortableData
      }, [job_data, sortConfig])

      const filteredData = sortedData.filter(job => {
            if (filterStatus === "all") return true
            if (filterStatus === "shortlisted") return job.status === "shortlisted"
            if (filterStatus === "pending")
                  return !job.status || job.status === "pending"
            if (filterStatus === "rejected") return job.status === "rejected"
            if (filterStatus === "interview") return job.status === "interview"
            return true
      })

      const searchFilter = filteredData.filter(job =>
            Object.values(job).some(value =>
                  String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )
      )

      const paginatedData = searchFilter.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
      )
      const totalPages = Math.ceil(searchFilter.length / pageSize)

      const handleSelectAll = e => {
            if (e.target.checked)
                  setSelectedApplications(searchFilter.map(job => job._id))
            else setSelectedApplications([])
      }

      const handleSelectApplication = id => {
            setSelectedApplications(prev =>
                  prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
            )
      }

      const handleSendShortlistEmail = () => {
            if (selectedApplications.length === 0)
                  return showToast("Please select at least one application", "info")
            setEmailType("shortlist")
            setShowEmailModal(true)
      }

      const handleSendRejectEmail = () => {
            if (selectedApplications.length === 0)
                  return showToast("Please select at least one application", "info")
            setEmailType("reject")
            setShowEmailModal(true)
      }

      const handleScheduleInterview = () => {
            if (selectedApplications.length === 0)
                  return showToast("Please select at least one application", "info")
            setShowInterviewModal(true)
      }

      const sendBulkEmail = async (subject, message, type) => {
            const selectedCandidates = job_data.filter(job =>
                  selectedApplications.includes(job._id)
            )
            const bccEmails = [{ email: "hr@brightfuturesoft.com" }]

            let newStatus = null
            if (type === "shortlist") newStatus = "shortlisted"
            if (type === "reject") newStatus = "rejected"
            if (newStatus) {
                  await bulk_update_status(selectedApplications, newStatus)
                  refetch()
            }

            for (const job of selectedCandidates) {
                  const htmlContent = getEmailTemplate({
                        type,
                        candidateName: job.full_name,
                        interviewData
                  })
                  try {
                        console.log("hit");
                        await fetch(`${base_url}/mail/send-mail/candidate`, {
                              method: "POST",
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft"
                              },
                              body: JSON.stringify({
                                    sender: {
                                          name: "Bright Future Soft HR",
                                          email: "hr@brightfuturesoft.com"
                                    },
                                    to: [{ email: job.email_address }],
                                    bcc: bccEmails,
                                    subject: subject,
                                    htmlContent,
                                    textContent: message
                              })
                        }).then(res => {
                              console.log(res);
                        })
                  } catch (error) {
                        console.log(error);
                  }
            }

            showToast(
                  `Email sent to ${selectedCandidates.length} candidate(s)`,
                  "success"
            )
            setShowEmailModal(false)
            setSelectedApplications([])
      }

      const scheduleInterview = async () => {
            if (!interviewData.date || !interviewData.time || !interviewData.meetLink) {
                  return showToast("Please fill in all interview details", "info")
            }
            const selectedCandidates = job_data.filter(job =>
                  selectedApplications.includes(job._id)
            )
            await bulk_update_status(selectedApplications, "interview")
            refetch()

            for (const job of selectedCandidates) {
                  const htmlContent = getEmailTemplate({
                        type: "interview",
                        candidateName: job.full_name,
                        interviewData
                  })
                  try {
                        await fetch(`${base_url}/mail/send-mail/candidate`, {
                              method: "POST",
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft"
                              },
                              body: JSON.stringify({
                                    sender: {
                                          name: "Bright Future Soft HR",
                                          email: "hr@brightfuturesoft.com"
                                    },
                                    to: [{ email: job.email_address }],
                                    bcc: [{ email: "hr@brightfuturesoft.com" }],
                                    subject: "Interview Invitation",
                                    htmlContent,
                                    textContent: `Dear Candidate, You have been invited for an interview. Date: ${interviewData.date}, Time: ${interviewData.time}, Link: ${interviewData.meetLink}`
                              })
                        })

                  } catch (error) {
                        console.log(error);
                  }
            }
            showToast(
                  `Interview scheduled for ${selectedCandidates.length} candidate(s)`,
                  "success"
            )
            setShowInterviewModal(false)
            setInterviewData({ time: "", meetLink: "", date: "" })
            setSelectedApplications([])
      }

      if (isLoading) {
            return (
                  <div className="flex items-center justify-center min-h-screen bg-gray-900">
                        <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 border-2 border border-gray-500  border-t-gray-500 rounded-full animate-spin"></div>
                              <p className="text-muted text-sm">Loading applications...</p>
                        </div>
                  </div>
            )
      }

      const handleCopy = () => {
            if (resume) {
                  navigator.clipboard.writeText(resume).then(() => {
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                  })
            }
      }

      return (
            <div className="min-h-screen bg-gray-900 ">
                  {/* Toast Notification */}
                  {toast && (
                        <Toast
                              message={toast.message}
                              type={toast.type}
                              onClose={() => setToast(null)}
                        />
                  )}

                  <div className="max-w-[1600px] mx-auto px-6 py-8">
                        {/* Header */}
                        <div className="mb-8">
                              <div className="flex items-center gap-3 mb-6">
                                    <button
                                          onClick={() => window.history.back()}
                                          className="flex items-center gap-2 px-4 py-2 bg-surface   border border-gray-500  rounded-lg text-muted hover:text-foreground hover:border-hover transition-all"
                                    >
                                          <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M15 19l-7-7 7-7"
                                                />
                                          </svg>
                                          Back to Job Posts
                                    </button>
                              </div>
                              <div className="flex items-center justify-between">
                                    <div>
                                          <h1 className="text-3xl font-bold text-foreground mb-2">
                                                Application Management
                                          </h1>
                                          <p className="text-muted">
                                                Review and manage candidate applications
                                          </p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-gray-500 border rounded-lg">
                                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                          <span className="text-sm text-muted">
                                                {job_data.length} Total Applications
                                          </span>
                                    </div>
                              </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="bg-surface border border-gray-500 border  rounded-lg p-6 mb-6">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                          <select
                                                value={filterStatus}
                                                onChange={e => {
                                                      setFilterStatus(e.target.value)
                                                      setSelectedApplications([])
                                                      setCurrentPage(1)
                                                }}
                                                className="px-4 py-2 bg-surface-elevated border border-gray-500  rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                          >
                                                <option value="all">All Status</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="pending">Pending Review</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="interview">Interview Scheduled</option>
                                          </select>
                                          <div className="h-6 w-px bg-border"></div>
                                          <span className="text-sm text-muted font-mono">
                                                {searchFilter.length} of {job_data.length} applications
                                          </span>
                                    </div>
                                    <div className="relative">
                                          <input
                                                type="text"
                                                className="w-full lg:w-80 pl-10 pr-4 py-2 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground text-sm placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="Search applications..."
                                                onChange={handleSearch}
                                                value={searchQuery}
                                          />
                                          <svg
                                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                          </svg>
                                    </div>
                              </div>

                              {/* Bulk Actions */}
                              {selectedApplications.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-3 pt-4">
                                          <span className="text-sm text-muted">
                                                {selectedApplications.length} selected
                                          </span>
                                          <div className="h-6 w-px bg-border"></div>
                                          <button
                                                onClick={handleSendShortlistEmail}
                                                className="px-4 py-2 bg-green-500 border border-gray-500 border-gray-500 text-success rounded-lg text-sm font-medium hover:bg-success hover:text-success-bg transition-all flex items-center gap-2"
                                          >
                                                <svg
                                                      className="w-4 h-4"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                >
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                      />
                                                </svg>
                                                Shortlist
                                          </button>
                                          <button
                                                onClick={handleSendRejectEmail}
                                                className="px-4 py-2 bg-red-400 border border-gray-500 border-danger-border border-gray-500 text-danger rounded-lg text-sm font-medium hover:bg-danger hover:text-red-800 transition-all flex items-center gap-2"
                                          >
                                                <svg
                                                      className="w-4 h-4"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                >
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                      />
                                                </svg>
                                                Reject
                                          </button>
                                          <button
                                                onClick={handleScheduleInterview}
                                                className="px-4 py-2 bg-yellow-500 border border-gray-500 border-info-border border-gray-500 text-info rounded-lg text-sm font-medium hover:bg-info hover:text-info-bg transition-all flex items-center gap-2"
                                          >
                                                <svg
                                                      className="w-4 h-4"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                >
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                      />
                                                </svg>
                                                Schedule Interview
                                          </button>
                                    </div>
                              )}
                        </div>

                        {/* Table */}
                        <div className="bg-surface border border-gray-500   rounded-lg overflow-hidden">
                              <div className="overflow-x-auto">
                                    <table className="w-full">
                                          <thead>
                                                <tr className="border-b border-gray-500">
                                                      <th className="px-6 py-4 text-left">
                                                            <input
                                                                  type="checkbox"
                                                                  className="w-4 h-4 rounded border border-gray-500 bg-surface-elevated text-primary cursor-pointer"
                                                                  checked={
                                                                        selectedApplications.length === searchFilter.length &&
                                                                        searchFilter.length > 0
                                                                  }
                                                                  onChange={handleSelectAll}
                                                            />
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                                            #
                                                      </th>
                                                      <th
                                                            className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                                                            onClick={() => handleSort("full_name")}
                                                      >
                                                            <div className="flex items-center gap-2">
                                                                  Candidate
                                                                  {sortConfig.key === "full_name" && (
                                                                        <span className="text-primary">
                                                                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                                                                        </span>
                                                                  )}
                                                            </div>
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                                            Contact
                                                      </th>
                                                      <th
                                                            className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                                                            onClick={() => handleSort("experience_in_years")}
                                                      >
                                                            <div className="flex items-center gap-2">
                                                                  Experience
                                                                  {sortConfig.key === "experience_in_years" && (
                                                                        <span className="text-primary">
                                                                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                                                                        </span>
                                                                  )}
                                                            </div>
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                                                            Status
                                                      </th>
                                                      <th className="px-6 py-4 text-center text-xs font-medium text-muted uppercase tracking-wider">
                                                            Actions
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-border divide-gray-500">
                                                {paginatedData.map((job, index) => (
                                                      <tr
                                                            key={job._id}
                                                            className="hover:bg-surface-elevated transition-colors group"
                                                      >
                                                            <td className="px-6 py-4">
                                                                  <input
                                                                        type="checkbox"
                                                                        className="w-4 h-4 rounded border border-gray-500 bg-surface-elevated text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 focus:ring-offset-surface cursor-pointer"
                                                                        checked={selectedApplications.includes(job._id)}
                                                                        onChange={() => handleSelectApplication(job._id)}
                                                                  />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <span className="text-sm font-mono text-subtle">
                                                                        {(currentPage - 1) * pageSize + index + 1}
                                                                  </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div className="flex items-center gap-3">
                                                                        <div>
                                                                              <p className="text-sm font-medium text-foreground">
                                                                                    {job?.full_name}
                                                                              </p>
                                                                        </div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div className="space-y-1">
                                                                        <p className="text-sm text-foreground font-mono">
                                                                              {job?.email_address}
                                                                        </p>
                                                                        <p className="text-xs text-muted font-mono">
                                                                              {job?.phone_number}
                                                                        </p>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div className="space-y-1">
                                                                        <p className="text-sm text-foreground font-medium">
                                                                              {job?.salary_expectation?.split(" ")[0]} BDT
                                                                        </p>
                                                                        <p className="text-xs text-muted">
                                                                              {job.experience_in_years?.slice(0, 3)} Years
                                                                        </p>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <StatusBadge status={job.status} />
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div className="flex items-center justify-center gap-2">
                                                                        <button
                                                                              onClick={() => setResume(job?.resume)}
                                                                              className="px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground border border-gray-500 border border-gray-500 hover:border-hover rounded-lg transition-all"
                                                                        >
                                                                              Resume
                                                                        </button>
                                                                        <button
                                                                              onClick={() => set_show(job)}
                                                                              className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
                                                                        >
                                                                              View
                                                                        </button>
                                                                        <ActionMenu
                                                                              job={job}
                                                                              shortlist_status={shortlist_status}
                                                                              delete_meeting={delete_meeting}
                                                                        />
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))}
                                          </tbody>
                                    </table>
                              </div>

                              {/* Pagination */}
                              <div className="flex items-center justify-between px-6 py-4 border-t ">
                                    <div className="flex items-center gap-2">
                                          <label className="text-sm text-muted">Rows per page:</label>
                                          <select
                                                value={pageSize}
                                                onChange={e => {
                                                      setPageSize(Number(e.target.value))
                                                      setCurrentPage(1)
                                                }}
                                                className="px-3 py-1.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                          >
                                                {PAGE_SIZE_OPTIONS.map(size => (
                                                      <option key={size} value={size}>
                                                            {size}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>
                                    <div className="flex items-center gap-4">
                                          <span className="text-sm text-muted font-mono">
                                                Page {currentPage} of {totalPages || 1}
                                          </span>
                                          <div className="flex items-center gap-2">
                                                <button
                                                      disabled={currentPage === 1}
                                                      onClick={() => setCurrentPage(p => p - 1)}
                                                      className="px-3 py-1.5 border border-gray-500 border border-gray-500 rounded-lg text-muted hover:text-foreground hover:border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                      Previous
                                                </button>
                                                <button
                                                      disabled={currentPage === totalPages || totalPages === 0}
                                                      onClick={() => setCurrentPage(p => p + 1)}
                                                      className="px-3 py-1.5 border border-gray-500 border border-gray-500 rounded-lg text-muted hover:text-foreground hover:border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                      Next
                                                </button>
                                          </div>
                                    </div>
                              </div>

                              {/* Empty State */}
                              {searchFilter.length === 0 && (
                                    <div className="text-center py-16 px-6">
                                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-elevated border border-gray-500 border border-gray-500 mb-4">
                                                <svg
                                                      className="w-8 h-8 text-subtle"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      stroke="currentColor"
                                                >
                                                      <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                      />
                                                </svg>
                                          </div>
                                          <h3 className="text-lg font-medium text-foreground mb-2">
                                                No applications found
                                          </h3>
                                          <p className="text-sm text-muted">
                                                Try adjusting your filters or search query
                                          </p>
                                    </div>
                              )}
                        </div>

                        {/* Modals */}
                        {showEmailModal && (
                              <EmailModal
                                    emailType={emailType}
                                    selectedCount={selectedApplications.length}
                                    onClose={() => setShowEmailModal(false)}
                                    onSend={(subject, message) =>
                                          sendBulkEmail(subject, message, emailType)
                                    }
                              />
                        )}

                        {showInterviewModal && (
                              <InterviewModal
                                    selectedCount={selectedApplications.length}
                                    interviewData={interviewData}
                                    setInterviewData={setInterviewData}
                                    onClose={() => setShowInterviewModal(false)}
                                    onSchedule={scheduleInterview}
                              />
                        )}

                        {deletePopUp && (
                              <DeleteModal
                                    onClose={() => setDeletePopUp(false)}
                                    onConfirm={confirmDelete}
                              />
                        )}

                        {show && (
                              <ApplicationDetailsModal
                                    application={show}
                                    onClose={() => set_show(null)}
                                    onStatusChange={status => {
                                          shortlist_status(show._id, status)
                                          set_show(null)
                                    }}
                                    onViewResume={() => setResume(show.resume)}
                              />
                        )}

                        {resume && (
                              <ResumeModal
                                    resume={resume}
                                    onClose={() => setResume(null)}
                                    copied={copied}
                                    onCopy={handleCopy}
                              />
                        )}
                  </div>
            </div>
      )
}

const StatusBadge = ({ status }) => {
      const getStatusStyles = () => {
            switch (status) {
                  case "shortlisted":
                        return "text-green-300"
                  case "rejected":
                        return " text-red-500"
                  case "interview":
                        return "  text-blue-500"
                  default:
                        return "  text-yellow-500"
            }
      }

      const getStatusText = () => {
            switch (status) {
                  case "shortlisted":
                        return "Shortlisted"
                  case "rejected":
                        return "Rejected"
                  case "interview":
                        return "Interview"
                  default:
                        return "Pending"
            }
      }

      const getStatusIcon = () => {
            switch (status) {
                  case "shortlisted":
                        return "✓"
                  case "rejected":
                        return "✕"
                  case "interview":
                        return "📅"
                  default:
                        return "⏱"
            }
      }

      return (
            <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-gray-500 bg-gray-900 ${getStatusStyles()}`}
            >
                  <span>{getStatusIcon()}</span>
                  {getStatusText()}
            </span>
      )
}

function ActionMenu({ job, shortlist_status, delete_meeting }) {
      const [open, setOpen] = useState(false)
      const menuRef = useRef(null)

      useEffect(() => {
            function handler(e) {
                  if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
            }
            document.addEventListener("mousedown", handler)
            return () => document.removeEventListener("mousedown", handler)
      }, [])

      return (
            <div className="relative" ref={menuRef}>
                  <button
                        onClick={() => setOpen(o => !o)}
                        className="p-2 rounded-lg hover:bg-surface-elevated border border-gray-500 border-transparent  transition-all"
                        aria-label="Open actions"
                  >
                        <svg
                              className="w-4 h-4 text-muted"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                        >
                              <circle cx="10" cy="4" r="1.5" />
                              <circle cx="10" cy="10" r="1.5" />
                              <circle cx="10" cy="16" r="1.5" />
                        </svg>
                  </button>
                  {open && (
                        <div className="absolute right-0 bg-gray-900 mt-2 w-48  border border-gray-500  rounded-lg shadow-2xl z-50 overflow-hidden">
                              <button
                                    className={`w-full text-left px-4 py-2.5 text-green-500  text-sm transition-colors flex items-center gap-2 ${job.status === "shortlisted"
                                          ? " bg-green-500 text-white"
                                          : "text-foreground hover:bg-surface"
                                          }`}
                                    onClick={() => {
                                          shortlist_status(
                                                job._id,
                                                job.status === "shortlisted" ? "pending" : "shortlisted"
                                          )
                                          setOpen(false)
                                    }}
                              >
                                    {job.status === "shortlisted" ? "✓" : "○"} Shortlist
                              </button>
                              <button
                                    className={`w-full text-left px-4 py-2.5 text-red-400 text-sm transition-colors flex items-center gap-2 ${job.status === "rejected"
                                          ? "bg-red-500 text-white"
                                          : "text-foreground hover:bg-surface"
                                          }`}
                                    onClick={() => {
                                          shortlist_status(
                                                job._id,
                                                job.status === "rejected" ? "pending" : "rejected"
                                          )
                                          setOpen(false)
                                    }}
                              >
                                    {job.status === "rejected" ? "✓" : "○"} Reject
                              </button>
                              <button
                                    className={`w-full text-left px-4 py-2.5 text-sm text-blue-500 transition-colors flex items-center gap-2 ${job.status === "interview"
                                          ? "bg-blue-500 text-white"
                                          : "text-foreground hover:bg-surface"
                                          }`}
                                    onClick={() => {
                                          shortlist_status(
                                                job._id,
                                                job.status === "interview" ? "pending" : "interview"
                                          )
                                          setOpen(false)
                                    }}
                              >
                                    {job.status === "interview" ? "✓" : "○"} Interview
                              </button>
                              <div className="h-px bg-border border-gray-500 my-1"></div>
                              <button
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors text-red-500  flex items-center gap-2 `}
                                    onClick={() => {
                                          delete_meeting(job._id)
                                          setOpen(false)
                                    }}
                              >
                                    <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                    >
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                    </svg>
                                    Delete
                              </button>
                        </div>
                  )}
            </div>
      )
}

function EmailModal({ emailType, selectedCount, onClose, onSend }) {
      const [subject, setSubject] = useState(
            emailType === "shortlist"
                  ? "Congratulations! You've been shortlisted"
                  : emailType === "reject"
                        ? "Application Status Update"
                        : "Interview Invitation"
      )
      const [message, setMessage] = useState(
            emailType === "shortlist"
                  ? "Dear Candidate,\n\nWe are pleased to inform you that you have been shortlisted for the next round of our selection process.\n\nBest regards,\nHR Team"
                  : emailType === "reject"
                        ? "Dear Candidate,\n\nThank you for your interest in our company. After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.\n\nWe wish you the best in your job search.\n\nBest regards,\nHR Team"
                        : "Dear Candidate,\n\nYou have been selected for an interview.\n\nBest regards,\nHR Team"
      )

      const getModalColor = () => {
            switch (emailType) {
                  case "shortlist":
                        return "border-success-border"
                  case "reject":
                        return "border-danger-border"
                  default:
                        return "border-info-border"
            }
      }

      const getButtonColor = () => {
            switch (emailType) {
                  case "shortlist":
                        return "bg-green-500 hover:bg-green-600"
                  case "reject":
                        return "bg-red-500 hover:bg-red-600"
                  default:
                        return "bg-blue-500 hover:bg-blue-600"
            }
      }

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs   p-4">
                  <div
                        className={`relative bg-gray-900 border-2 border-gray-700 ${getModalColor()} rounded-xl shadow-2xl w-full max-w-2xl`}
                  >
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                              <h2 className="text-xl font-bold text-foreground">
                                    {emailType === "shortlist"
                                          ? "Send Shortlist Email"
                                          : emailType === "reject"
                                                ? "Send Rejection Email"
                                                : "Send Interview Email"}
                              </h2>
                              <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-surface-elevated border border-gray-700 hover:bg-gray-500 transition-colors text-muted "
                              >
                                    <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                    >
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                          />
                                    </svg>
                              </button>
                        </div>
                        <div className="p-6 space-y-6">
                              <div className="p-4 bg-surface-elevated border border-gray-700  rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-muted mb-2">
                                          <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                          </svg>
                                          <span className="font-medium">
                                                Recipients: {selectedCount} candidate(s)
                                          </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted">
                                          <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                          </svg>
                                          <span className="font-mono">BCC: hr@brightfuturesoft.com</span>
                                    </div>
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                          Subject
                                    </label>
                                    <input
                                          type="text"
                                          value={subject}
                                          onChange={e => setSubject(e.target.value)}
                                          className="w-full px-4 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                          Message
                                    </label>
                                    <textarea
                                          value={message}
                                          onChange={e => setMessage(e.target.value)}
                                          rows={8}
                                          className="w-full px-4 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none font-mono text-sm"
                                    />
                              </div>
                        </div>
                        <div className="flex items-center gap-3 p-6 border-t border-gray-700">
                              <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground font-medium hover:bg-surface transition-all"
                              >
                                    Cancel
                              </button>
                              <button
                                    onClick={() => onSend(subject, message)}
                                    className={`flex-1 px-6 py-2.5 ${getButtonColor()} bg-green-500 text-white rounded-lg font-medium transition-all`}
                              >
                                    Send Email
                              </button>
                        </div>
                  </div>
            </div>
      )
}

function InterviewModal({
      selectedCount,
      interviewData,
      setInterviewData,
      onClose,
      onSchedule
}) {
      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900   p-4">
                  <div className="relative bg-surface border-2 border-info-border border-gray-500 rounded-xl shadow-2xl w-full max-w-2xl">
                        <div className="flex items-center justify-between p-6 ">
                              <h2 className="text-xl font-bold text-foreground border-b">
                                    Schedule Interview
                              </h2>
                              <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-muted hover:text-foreground"
                              >
                                    <svg
                                          className="w-5 h-5"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                    >
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                          />
                                    </svg>
                              </button>
                        </div>
                        <div className="p-6 space-y-6">
                              <div className="p-4 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-muted">
                                          <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                          </svg>
                                          <span className="font-medium">
                                                Candidates: {selectedCount} will receive interview invitation
                                          </span>
                                    </div>
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                          Interview Date
                                    </label>
                                    <input
                                          type="date"
                                          value={interviewData.date}
                                          onChange={e =>
                                                setInterviewData({ ...interviewData, date: e.target.value })
                                          }
                                          className="w-full px-4 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                          Interview Time
                                    </label>
                                    <input
                                          type="time"
                                          value={interviewData.time}
                                          onChange={e =>
                                                setInterviewData({ ...interviewData, time: e.target.value })
                                          }
                                          className="w-full px-4 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    />
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                          Meeting Link
                                    </label>
                                    <input
                                          type="url"
                                          value={interviewData.meetLink}
                                          onChange={e =>
                                                setInterviewData({ ...interviewData, meetLink: e.target.value })
                                          }
                                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                          className="w-full px-4 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm"
                                    />
                                    <p className="mt-2 text-xs text-muted">
                                          Enter the video conference link (Google Meet, Zoom, Teams, etc.)
                                    </p>
                              </div>
                        </div>
                        <div className="flex items-center gap-3 p-6 border-t">
                              <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground font-medium hover:bg-surface transition-all"
                              >
                                    Cancel
                              </button>
                              <button
                                    onClick={onSchedule}
                                    className="flex-1 px-6 py-2.5 bg-info hover:bg-info/90 text-white rounded-lg font-medium transition-all"
                              >
                                    Schedule Interview
                              </button>
                        </div>
                  </div>
            </div>
      )
}

function DeleteModal({ onClose, onConfirm }) {
      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs   p-4">
                  <div className="relative bg-surface border-2 border-danger-border bg-gray-900 border-gray-500 rounded-xl shadow-2xl w-full max-w-md">
                        <div className="p-6">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-danger-bg border border-gray-500 border-danger-border border-gray-500 mb-4 mx-auto">
                                    <svg
                                          className="w-6 h-6 text-danger"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                    >
                                          <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                          />
                                    </svg>
                              </div>
                              <h2 className="text-xl font-bold text-foreground text-center mb-2">
                                    Delete Application
                              </h2>
                              <p className="text-sm text-muted text-center mb-6">
                                    Are you sure you want to delete this application? This action cannot
                                    be undone.
                              </p>
                              <div className="flex items-center gap-3">
                                    <button
                                          onClick={onClose}
                                          className="flex-1 px-6 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground font-medium hover:bg-surface transition-all"
                                    >
                                          Cancel
                                    </button>
                                    <button
                                          onClick={onConfirm}
                                          className="flex-1 px-6 py-2.5 bg-red-500 hover:bg-red-500/90 text-white rounded-lg font-medium transition-all"
                                    >
                                          Delete
                                    </button>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

function ApplicationDetailsModal({
      application,
      onClose,
      onStatusChange,
      onViewResume
}) {
      return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/95  backdrop-blur-xs ">
                  <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-surface  border border-gray-500 rounded-xl shadow-2xl w-full max-w-4xl">
                              <div className="flex items-center justify-between p-6 border-b ">
                                    <div>
                                          <h2 className="text-2xl font-bold text-foreground">
                                                Application Details
                                          </h2>
                                          <p className="text-sm text-muted mt-1">
                                                Complete candidate information
                                          </p>
                                    </div>
                                    <button
                                          onClick={onClose}
                                          className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-muted hover:text-foreground"
                                    >
                                          <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"
                                                />
                                          </svg>
                                    </button>
                              </div>
                              <div className="p-6 overflow-y-auto max-h-[70vh]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {/* Personal Information */}
                                          <div className="space-y-4">
                                                <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
                                                      Personal Information
                                                </h3>
                                                <InfoItem
                                                      icon={
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path
                                                                        fillRule="evenodd"
                                                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                        clipRule="evenodd"
                                                                  />
                                                            </svg>
                                                      }
                                                      label="Full Name"
                                                      value={application.full_name}
                                                      color="text-success"
                                                />
                                                <InfoItem
                                                      icon={
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                            </svg>
                                                      }
                                                      label="Email Address"
                                                      value={application.email_address}
                                                      color="text-info"
                                                      mono
                                                />
                                                <InfoItem
                                                      icon={
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                            </svg>
                                                      }
                                                      label="Phone Number"
                                                      value={application.phone_number}
                                                      color="text-warning"
                                                      mono
                                                />
                                          </div>
                                          {/* Professional Information */}
                                          <div className="space-y-4">
                                                <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
                                                      Professional Information
                                                </h3>
                                                <InfoItem
                                                      icon={
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path
                                                                        fillRule="evenodd"
                                                                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                                                        clipRule="evenodd"
                                                                  />
                                                                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                                            </svg>
                                                      }
                                                      label="Experience"
                                                      value={`${application.experience_in_years} Years`}
                                                      color="text-primary"
                                                />
                                                <InfoItem
                                                      icon={
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path
                                                                        fillRule="evenodd"
                                                                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                                                        clipRule="evenodd"
                                                                  />
                                                            </svg>
                                                      }
                                                      label="Salary Expectation"
                                                      value={`${application.salary_expectation} BDT`}
                                                      color="text-success"
                                                />
                                                <div className="flex items-start gap-3">
                                                      <div className="flex-shrink-0 w-10 h-10 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg flex items-center justify-center text-danger">
                                                            <svg
                                                                  className="w-5 h-5"
                                                                  viewBox="0 0 20 20"
                                                                  fill="currentColor"
                                                            >
                                                                  <path
                                                                        fillRule="evenodd"
                                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                                        clipRule="evenodd"
                                                                  />
                                                            </svg>
                                                      </div>
                                                      <div className="flex-1">
                                                            <p className="text-sm font-medium text-muted mb-1">
                                                                  Status
                                                            </p>
                                                            <StatusBadge status={application.status} />
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                                    {/* Why Apply Section */}
                                    {application.why && (
                                          <div className="mt-6">
                                                <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">
                                                      Why Apply
                                                </h3>
                                                <div className="bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg p-4">
                                                      <p className="text-foreground leading-relaxed text-sm">
                                                            <span dangerouslySetInnerHTML={{ __html: application.why }} />
                                                      </p>
                                                </div>
                                          </div>
                                    )}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3 p-6 border-t ">
                                    <button
                                          onClick={onClose}
                                          className="flex-1 px-6 py-2.5 bg-surface-elevated border border-gray-500 border border-gray-500 rounded-lg text-foreground font-medium hover:bg-surface transition-all"
                                    >
                                          Close
                                    </button>
                                    <button
                                          onClick={() =>
                                                onStatusChange(
                                                      application.status === "shortlisted"
                                                            ? "pending"
                                                            : "shortlisted"
                                                )
                                          }
                                          className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all ${application.status === "shortlisted"
                                                ? "bg-yellow-500 hover:bg-yellow-500/90 text-white"
                                                : "bg-green-500 hover:bg-green-500/90 text-white"
                                                }`}
                                    >
                                          {application.status === "shortlisted"
                                                ? "Remove Shortlist"
                                                : "Add to Shortlist"}
                                    </button>
                                    <button
                                          onClick={onClose}
                                          className="flex-1 px-6 py-2.5 bg-red-500 hover:bg-red-500/90 text-white rounded-lg font-medium transition-all"
                                    >
                                          Rejected
                                    </button>

                                    <button
                                          onClick={onViewResume}
                                          className="flex-1 px-6 py-2.5 bg-blue-500 hover:bg-blue-500/90 text-white rounded-lg font-medium transition-all"
                                    >
                                          View Resume
                                    </button>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

function InfoItem({ icon, label, value, color, mono }) {
      return (
            <div className="flex items-start gap-3">
                  <div
                        className={`flex-shrink-0 w-10 h-10 bg-surface-elevated border border-gray-500 rounded-lg flex items-center justify-center ${color}`}
                  >
                        {icon}
                  </div>
                  <div className="flex-1">
                        <p className="text-sm font-medium text-muted mb-1">{label}</p>
                        <p className={`text-foreground ${mono ? "font-mono text-sm" : ""}`}>
                              {value}
                        </p>
                  </div>
            </div>
      )
}

function ResumeModal({ resume, onClose, copied, onCopy }) {
      return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900  ">
                  <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative w-full max-w-5xl bg-surface border border-gray-500 rounded-xl shadow-2xl">
                              <div className="flex items-center justify-between p-4 border-b ">
                                    <h2 className="text-lg font-semibold text-foreground">
                                          Resume Preview
                                    </h2>
                                    <button
                                          onClick={onClose}
                                          className="p-2 rounded-lg hover:bg-surface-elevated transition-colors text-muted hover:text-foreground"
                                    >
                                          <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"
                                                />
                                          </svg>
                                    </button>
                              </div>
                              <div className="flex items-center gap-2 px-4 py-3 bg-surface-elevated border-b ">
                                    <p className="text-xs text-muted font-mono break-all flex-1">
                                          {resume}
                                    </p>
                                    <button
                                          onClick={onCopy}
                                          className={`p-2 rounded-lg transition-all ${copied
                                                ? "bg-success-bg text-success"
                                                : "bg-surface border border-gray-500 text-muted hover:text-foreground"
                                                }`}
                                          title={copied ? "Copied!" : "Copy to clipboard"}
                                    >
                                          {copied ? (
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                >
                                                      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                      <path d="m9 14 2 2 4-4" />
                                                </svg>
                                          ) : (
                                                <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="16"
                                                      height="16"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                >
                                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                                </svg>
                                          )}
                                    </button>
                              </div>
                              <div className="p-4">
                                    <iframe
                                          src={resume}
                                          width="100%"
                                          height="700"
                                          title="Resume"
                                          className="border-none rounded-lg bg-white"
                                    />
                              </div>
                        </div>
                  </div>
            </div>
      )
}

// HTML Email Template generator
function getEmailTemplate({ type, candidateName, interviewData }) {
      switch (type) {
            case "shortlist":
                  return `
      <div style="font-family:sans-serif; color:#222; background:#f7fff9; border-radius:10px; padding:32px; border:1px solid #b8f5d1;">
        <h2 style="color:#117a2e;">Congratulations, ${candidateName}!</h2>
        <p>We're happy to inform you that you have been <b>shortlisted</b> for the next round.</p>
        <p>We'll contact you soon with further steps.</p>
        <p style="margin-top:24px">Best regards,<br><b>Bright Future Soft HR Team</b></p>
        <div style="margin-top:32px; font-size:12px; color:#aaa;">This is an automated notification from Bright Future Soft</div>
      </div>
      `
            case "reject":
                  return `
      <div style="font-family:sans-serif; color:#222; background:#fff5f5; border-radius:10px; padding:32px; border:1px solid #f5b8b8;">
        <h2 style="color:#c0392b;">Application Update</h2>
        <p>Dear ${candidateName},</p>
        <p>Thank you for your interest in working with us, but we will not be moving forward with your application at this time.</p>
        <p>We wish you the best in your job search.</p>
        <p style="margin-top:24px">Best regards,<br><b>Bright Future Soft HR Team</b></p>
        <div style="margin-top:32px; font-size:12px; color:#aaa;">This is an automated notification from Bright Future Soft</div>
      </div>
      `
            case "interview":
                  return `
      <div style="font-family:sans-serif; color:#222; background:#f5faff; border-radius:10px; padding:32px; border:1px solid #b8e0f5;">
        <h2 style="color:#2166c8;">Interview Invitation</h2>
        <p>Dear ${candidateName},</p>
        <p>We are pleased to invite you for an interview.</p>
        <ul style="line-height:1.7;">
          <li><b>Date:</b> ${interviewData?.date || ""}</li>
          <li><b>Time:</b> ${interviewData?.time || ""}</li>
          <li><b>Meeting Link:</b> <a href="${interviewData?.meetLink ||
                        "#"}">${interviewData?.meetLink || ""}</a></li>
        </ul>
        <p style="margin-top:24px">Best regards,<br><b>Bright Future Soft HR Team</b></p>
        <div style="margin-top:32px; font-size:12px; color:#aaa;">This is an automated notification from Bright Future Soft</div>
      </div>
      `
            default:
                  return ""
      }
}

export default Apply_List
