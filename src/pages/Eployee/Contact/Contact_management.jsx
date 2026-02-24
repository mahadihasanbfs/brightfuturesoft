

import { useState, useEffect } from "react"
import { base_url } from "../../../layout/Title"
import { useQuery } from "@tanstack/react-query"

const Contact_management = () => {
      const [error, setError] = useState(null)
      const [selectContact, setSelectContact] = useState(null)

      // Close modal when escape key is pressed
      useEffect(() => {
            const handleEsc = (event) => {
                  if (event.key === 'Escape') {
                        setSelectContact(null)
                  }
            }
            window.addEventListener('keydown', handleEsc)

            return () => {
                  window.removeEventListener('keydown', handleEsc)
            }
      }, [])

      const {
            data: contacts = [],
            refetch,
            isLoading,
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

      // Handle delete contact
      const handleDelete = async (id) => {
            if (window.confirm("Are you sure you want to delete this contact?")) {
                  try {
                        await fetch(`${base_url}/contact/delete-contact?contact_id=${id}`, {
                              method: 'DELETE',
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                        })
                        refetch();
                  } catch (err) {
                        setError("Error deleting contact: " + err.message)
                  }
            }
      }

      // Handle status update
      const handleStatusUpdate = (id, newStatus) => {
            fetch(`${base_url}/contact/update-contact?contact_id=${id}`, {
                  method: 'PUT',
                  headers: {
                        "content-type": "application/json",
                        author: "bright_future_soft",
                  },
                  body: JSON.stringify({ status: newStatus }),
            })
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              refetch();
                        }
                  })
            // In a real app, you would call an API to update the status
      }

      // Format date
      const formatDate = (dateString) =>
            new Date(dateString).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
            });

      if (isLoading)
            return (
                  <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
            )

      if (error)
            return (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                  </div>
            )

      return (
            <div className="container mx-auto p-4 relative">
                  <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

                  <div className="overflow-x-auto shadow-md border border-white border-opacity-20 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 divide-opacity-20">
                              <thead className="">
                                    <tr>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email/Phone
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Message
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                          </th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                    {contacts.length === 0 ? (
                                          <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                      No contacts found
                                                </td>
                                          </tr>
                                    ) : (
                                          contacts.map((contact) => (
                                                <tr key={contact._id} className="">
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-200">{contact.full_name}</div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-200">
                                                                  {contact.email_or_phone.includes("@") ? (
                                                                        <a
                                                                              href={`mailto:${contact.email_or_phone}`}
                                                                              className="text-blue-400 hover:text-blue-600 hover:underline"
                                                                        >
                                                                              {contact.email_or_phone}
                                                                        </a>
                                                                  ) : (
                                                                        <a
                                                                              href={`tel:${contact.email_or_phone}`}
                                                                              className="text-blue-400 hover:text-blue-600 hover:underline"
                                                                        >
                                                                              {contact.email_or_phone}
                                                                        </a>
                                                                  )}
                                                            </div>
                                                      </td>
                                                      <td
                                                            onClick={() => setSelectContact(contact)}
                                                            className="px-6 py-4 cursor-pointer  transition-colors"
                                                      >
                                                            <div className="text-sm text-gray-200 truncate max-w-xs">
                                                                  {contact.message.split(" ").slice(0, 10).join(" ")}
                                                                  {contact.message.split(" ").length > 10 ? "..." : ""}
                                                            </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-200">{formatDate(contact.time_stamp)}</div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                  value={contact.status || "pending"}
                                                                  onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                                                                  className="text-sm rounded-md bg-transparent border-gray-700 shadow-sm focus:border-blue-300 focus:ring focus:ring-opacity-50"
                                                            >
                                                                  <option value="pending">Pending</option>
                                                                  <option value="contacted">Contacted</option>
                                                            </select>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                  onClick={() => handleDelete(contact._id)}
                                                                  className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                                                            >
                                                                  Delete
                                                            </button>
                                                      </td>
                                                </tr>
                                          ))
                                    )}
                              </tbody>
                        </table>
                  </div>

                  {selectContact && (
                        <div
                              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                              onClick={() => setSelectContact(null)}
                        >
                              <div
                                    className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-white/10 to-white/5
                 backdrop-blur-xl border border-white/20 rounded-2xl
                 shadow-2xl flex flex-col"
                                    onClick={(e) => e.stopPropagation()}
                              >
                                    {/* Close Button */}
                                    <button
                                          onClick={() => setSelectContact(null)}
                                          className="absolute top-4 right-4 text-gray-300 hover:text-white transition text-xl"
                                    >
                                          ✕
                                    </button>

                                    {/* Header (Fixed) */}
                                    <div className="p-6 border-b border-white/20">
                                          <h3 className="text-2xl font-bold text-white">
                                                Contact Details
                                          </h3>
                                    </div>

                                    {/* Scrollable Content Area */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">

                                          <InfoCard label="Name" value={selectContact.full_name} />

                                          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                                <p className="text-sm text-gray-300 font-medium">Contact</p>
                                                <p className="text-white break-words">
                                                      {selectContact.email_or_phone.includes("@") ? (
                                                            <a
                                                                  href={`mailto:${selectContact.email_or_phone}`}
                                                                  className="text-blue-400 hover:underline"
                                                            >
                                                                  {selectContact.email_or_phone}
                                                            </a>
                                                      ) : (
                                                            <a
                                                                  href={`tel:${selectContact.email_or_phone}`}
                                                                  className="text-blue-400 hover:underline"
                                                            >
                                                                  {selectContact.email_or_phone}
                                                            </a>
                                                      )}
                                                </p>
                                          </div>

                                          <InfoCard
                                                label="Date"
                                                value={formatDate(selectContact.time_stamp)}
                                          />

                                          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                                <p className="text-sm text-gray-300 font-medium">Message</p>

                                                {/* Message Height Control */}
                                                <div className="max-h-60 overflow-y-auto mt-2 pr-2">
                                                      <p dangerouslySetInnerHTML={{ __html: selectContact.message }} className="text-white whitespace-pre-wrap">

                                                      </p>
                                                </div>
                                          </div>
                                    </div>

                                    {/* Footer (Fixed) */}
                                    <div className="p-4 border-t border-white/20 flex justify-end">
                                          <button
                                                onClick={() => setSelectContact(null)}
                                                className="px-5 py-2 rounded-lg bg-gradient-to-r
                     from-blue-500 to-indigo-600 text-white
                     hover:scale-105 transition"
                                          >
                                                Close
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}


            </div>
      )
}

export default Contact_management


const InfoCard = ({ label, value }) => (
      <div className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/20 transition">
            <p className="text-sm text-gray-300 font-medium">{label}</p>
            <p className="text-lg font-semibold text-white break-words">
                  {value}
            </p>
      </div>
);
