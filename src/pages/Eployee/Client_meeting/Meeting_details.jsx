import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base_url } from "../../../layout/Title";

import MeetingModal from "./MeetingModal";
import { useContext } from "react";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

const statusOptions = [
      "Interested", "Not Interested", "Almost Own", "Good Lead", "Bad Lead",
      "Future Lead", "Owned", "Lost", "Decline", "No Show", "Proposal", "Follow Up", "YTM"
];
const mediumOptions = ["LinkedIn", "WhatsApp", "Email", "Phone"];

export default function MeetingDetails() {
      const { user } = useContext(AuthContext);
      const queryClient = useQueryClient();


      const {
            data: rows = [],
            refetch,
      } = useQuery({
            queryKey: ["client_meetings_data", user?.email],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/meeting/get-client-meeting?email=${user?.email}`,
                        {
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                              method: "GET",
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
            enabled: !!user?.email,
      });

      // Modal & Filters
      const [modalOpen, setModalOpen] = useState(false);
      const [editRow, setEditRow] = useState(null);
      const [filter, setFilter] = useState("");
      const [dateFilter, setDateFilter] = useState("");
      const [ownerFilter, setOwnerFilter] = useState("");
      const [dateFilterType, setDateFilterType] = useState("meetingDate"); // or "lastChat"

      // Add/Edit
      const handleModalSave = async (formData) => {
            if (formData._id) {
                  // Edit mode
                  await fetch(
                        `${base_url}/meeting/edit-client-meeting?client_meeting_id=${formData._id}`,
                        {
                              method: "PUT",
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                              body: JSON.stringify(formData),
                        }
                  );
            } else {
                  // Add mode
                  await fetch(`${base_url}/meeting/add-client-meeting`, {
                        method: "POST",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(formData),
                  });
            }
            setModalOpen(false);
            setEditRow(null);
            refetch();
            queryClient.invalidateQueries({ queryKey: ["client_meetings"] });
      };

      // Delete
      const handleDelete = async (id) => {
            if (window.confirm("Are you sure you want to delete this meeting?")) {
                  await fetch(
                        `${base_url}/meeting/delete-client-meeting?client_meeting_id=${id}`,
                        {
                              method: "DELETE",
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                        }
                  );
                  refetch();
                  queryClient.invalidateQueries({ queryKey: ["client_meetings"] });
            }
      };

      // Status change (edit in place)
      const handleStatusChange = async (id, status) => {
            const meeting = rows.find((row) => row._id === id || row.id === id);
            if (!meeting) return;
            const meetingId = meeting._id;
            await fetch(
                  `${base_url}/meeting/edit-client-meeting?client_meeting_id=${meetingId}`,
                  {
                        method: "PUT",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify({ status }),
                  }
            );
            refetch()
            queryClient.invalidateQueries({ queryKey: ["client_meetings"] });

      };

      // Helpers
      const getUniqueOwners = () => {
            const owners = [...new Set((rows || []).map((row) => row.cOwner).filter(Boolean))];
            return owners.sort();
      };

      // Filtered Rows
      const filteredRows = rows?.filter((row) => {
            // Name filter: skip if filter is empty
            const nameMatch = !filter || row?.prospectName?.toLowerCase().includes(filter.toLowerCase());
            // Date filter
            let dateMatch = true;
            if (dateFilter) {
                  const filterDate = new Date(dateFilter);
                  const rowDate = dateFilterType === "meetingDate"
                        ? new Date(row.meetingDate)
                        : new Date(row.lastChat);
                  if (!isNaN(filterDate.getTime()) && !isNaN(rowDate.getTime())) {
                        dateMatch = rowDate.toDateString() === filterDate.toDateString();
                  }
            }
            // Owner filter: skip if ownerFilter is empty
            const ownerMatch = !ownerFilter || row.cOwner === ownerFilter;
            return nameMatch && dateMatch && ownerMatch;
      });

      console.log(filteredRows, "filteredRows", rows, 'rows');

      // Status badge
      const getStatusBadge = (status) => {
            const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
            switch (status) {
                  case "Interested":
                        return `${baseClasses} bg-green-900 text-green-300 border border-green-700`;
                  case "YTM":
                        return `${baseClasses} bg-yellow-900 text-yellow-300 border border-yellow-700`;
                  default:
                        return `${baseClasses} bg-gray-700 text-gray-300 border border-gray-600`;
            }
      };

      function formatTimeTo12Hour(time24) {
            const [hourStr, minuteStr] = time24.split(':');
            let hour = parseInt(hourStr, 10);
            const minute = minuteStr;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12; // Convert to 12-hour format
            return `${hour}:${minute} ${ampm}`;
      }

      return (
            <div className="min-h-screen bg-gray-900 p-4 lg:p-8">
                  <div>
                        {/* Header */}
                        <div className="mb-8">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                          <h1 className="text-3xl font-bold text-white mb-2">Meeting Details</h1>
                                          <p className="text-gray-400">Manage your prospect meetings and track their status</p>
                                    </div>
                                    <button
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg"
                                          onClick={() => { setEditRow(null); setModalOpen(true); }}
                                    >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                          Add Meeting
                                    </button>
                              </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="mb-6">
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                                    {/* Search Input */}
                                    <div className="relative">
                                          <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
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
                                                placeholder="Search prospects..."
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                          />
                                    </div>

                                    {/* Date Filter Type */}
                                    <div>
                                          <select
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={dateFilterType}
                                                onChange={(e) => setDateFilterType(e.target.value)}
                                          >
                                                <option value="meetingDate">Filter by Meeting Date</option>
                                                <option value="lastChat">Filter by Last Chat</option>
                                          </select>
                                    </div>

                                    {/* Date Filter */}
                                    <div className="relative">
                                          <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                          </svg>
                                          <input
                                                type="date"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                value={dateFilter}
                                                onChange={(e) => setDateFilter(e.target.value)}
                                                placeholder="Select date"
                                          />
                                    </div>

                                    {/* Owner Filter */}
                                    <div className="relative">
                                          <svg
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                          </svg>
                                          <select
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                                                value={ownerFilter}
                                                onChange={(e) => setOwnerFilter(e.target.value)}
                                          >
                                                <option value="">All Owners</option>
                                                {getUniqueOwners().map((owner) => (
                                                      <option key={owner} value={owner}>
                                                            {owner}
                                                      </option>
                                                ))}
                                          </select>
                                    </div>
                              </div>

                              {/* Filter Summary and Clear */}
                              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                          {filter && (
                                                <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-700 flex items-center gap-2">
                                                      Search: "{filter}"
                                                      <button onClick={() => setFilter("")} className="hover:text-white transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                      </button>
                                                </span>
                                          )}
                                          {dateFilter && (
                                                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm border border-green-700 flex items-center gap-2">
                                                      {dateFilterType === "meetingDate" ? "Meeting" : "Last Chat"}: {dateFilter}
                                                      <button onClick={() => setDateFilter("")} className="hover:text-white transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                      </button>
                                                </span>
                                          )}
                                          {ownerFilter && (
                                                <span className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-700 flex items-center gap-2">
                                                      Owner: {ownerFilter}
                                                      <button onClick={() => setOwnerFilter("")} className="hover:text-white transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                      </button>
                                                </span>
                                          )}
                                          {(filter || dateFilter || ownerFilter) && (
                                                <button
                                                      onClick={() => {
                                                            setFilter("");
                                                            setDateFilter("");
                                                            setOwnerFilter("");
                                                      }}
                                                      className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-sm border border-red-700 hover:bg-red-800 transition-colors"
                                                >
                                                      Clear All Filters
                                                </button>
                                          )}
                                    </div>

                                    <div className="flex gap-4 text-sm">
                                          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                                                <span className="text-gray-400">Total: </span>
                                                <span className="text-white font-medium">{rows.length}</span>
                                          </div>
                                          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                                                <span className="text-gray-400">Filtered: </span>
                                                <span className="text-white font-medium">{filteredRows.length}</span>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Table */}
                        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                              <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                          <thead>
                                                <tr className="bg-gray-700 border-b border-gray-600">
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Prospect
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Location
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Company
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Contact
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Meeting
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Status
                                                      </th>
                                                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                            Actions
                                                      </th>
                                                </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-700">
                                                {filteredRows.map((row, index) => (
                                                      <tr
                                                            key={row._id || row.id}
                                                            className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"} hover:bg-gray-700 transition-colors duration-150`}
                                                      >
                                                            <td className="px-6 py-4">
                                                                  <div>
                                                                        <a target="_blank" href={row?.linkedin_link} className="text-blue-500 hover:text-blue-600 font-medium">{row.clientName}</a>
                                                                        <div className="text-gray-400 text-sm">Owner: {row.cOwner}</div>
                                                                        <div className="text-gray-400 text-sm">Source: {row.source}</div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div>
                                                                        <div className="text-white">{row.country}</div>
                                                                        <div className="text-gray-400 text-sm">{row.zone}</div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div>
                                                                        <div className="text-white font-medium">{row.company}</div>
                                                                        <div className="text-gray-400 text-sm">{row.industry}</div>
                                                                        <div className="text-gray-400 text-sm">{row.companySize} employees</div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div>
                                                                        {row.email && <div className="text-blue-400 text-sm mb-1">{row.email}</div>}
                                                                        {row.phone && <div className="text-green-400 text-sm mb-1">{row.phone}</div>}
                                                                        {row.medium && <div className="text-gray-400 text-sm">via {row.medium}</div>}
                                                                        <div className="text-gray-400 text-sm">Last: {row.lastChat}</div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div>
                                                                        <div className="text-white font-medium">{row.meetingDate}</div>

                                                                        {row.time && (
                                                                              <div className="text-gray-400 text-sm">
                                                                                    {formatTimeTo12Hour(row.time)}
                                                                              </div>
                                                                        )}
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <select
                                                                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                        value={row.status}
                                                                        onChange={(e) => handleStatusChange(row._id || row.id, e.target.value)}
                                                                  >
                                                                        <option value="">Select Status</option>
                                                                        {statusOptions.map((opt) => (
                                                                              <option key={opt} value={opt}>
                                                                                    {opt}
                                                                              </option>
                                                                        ))}
                                                                  </select>
                                                                  {row.status && (
                                                                        <div className="mt-2">
                                                                              <span className={getStatusBadge(row.status)}>{row.status}</span>
                                                                        </div>
                                                                  )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <div className="flex gap-2">
                                                                        <button
                                                                              onClick={() => { setEditRow(row); setModalOpen(true); }}
                                                                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                                                                        >
                                                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path
                                                                                          strokeLinecap="round"
                                                                                          strokeLinejoin="round"
                                                                                          strokeWidth={2}
                                                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                                    />
                                                                              </svg>
                                                                              Edit
                                                                        </button>
                                                                        <button
                                                                              onClick={() => handleDelete(row._id || row.id)}
                                                                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                                                                        >
                                                                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                                            </td>
                                                      </tr>
                                                ))}
                                                {filteredRows.length === 0 && (
                                                      <tr>
                                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                                  <div className="text-gray-400">
                                                                        <svg
                                                                              className="mx-auto h-12 w-12 text-gray-500 mb-4"
                                                                              fill="none"
                                                                              stroke="currentColor"
                                                                              viewBox="0 0 24 24"
                                                                        >
                                                                              <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                              />
                                                                        </svg>
                                                                        <p className="text-lg font-medium">No meetings found</p>
                                                                        <p className="text-sm">Try adjusting your search criteria or add a new meeting.</p>
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                )}
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  </div>

                  {modalOpen && (
                        <MeetingModal
                              refetch={refetch}
                              open={modalOpen}
                              onClose={() => { setModalOpen(false); setEditRow(null); }}
                              onSave={handleModalSave}
                              row={editRow}
                              statusOptions={statusOptions}
                              mediumOptions={mediumOptions}
                        />
                  )}
            </div>
      );
}
