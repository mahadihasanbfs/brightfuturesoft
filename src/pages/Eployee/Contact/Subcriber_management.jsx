


import { useState, useEffect } from "react"
import { base_url } from "../../../layout/Title"
import { useQuery } from "@tanstack/react-query"
import JoditEditor from "jodit-react"

const SubscribersTable = () => {
      const [error, setError] = useState(null)
      const [selectedSubscribers, setSelectedSubscribers] = useState([])
      const [selectAll, setSelectAll] = useState(false)
      const [showModal, setShowModal] = useState(false)


      // Add this function to handle opening the modal
      const openEmailModal = () => {
            setShowModal(true)
      }

      // Add this function to handle closing the modal
      const closeModal = () => {
            setShowModal(false)
      }

      // Mock data for subscribers - replace with actual API call
      const {
            data: subscribers = [],
            refetch,
            isLoading,
      } = useQuery({
            queryKey: ["subscribers"],
            queryFn: async () => {
                  // Replace with actual API endpoint
                  try {
                        const res = await fetch(`${base_url}/subscriber/get-subscribers`, {
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                              method: "GET",
                        })
                        const data = await res.json()
                        return data.data
                  } catch (error) {
                        console.error("Error fetching subscribers:", error)
                        return []
                  }
            },
      })


      // Handle select all checkbox
      useEffect(() => {
            if (selectAll) {
                  setSelectedSubscribers(subscribers.map((subscriber) => subscriber._id))
            } else if (selectedSubscribers.length === subscribers.length) {
                  setSelectedSubscribers([])
            }
      }, [selectAll, subscribers])

      // Update selectAll state when individual selections change
      useEffect(() => {
            if (subscribers.length > 0 && selectedSubscribers.length === subscribers.length) {
                  setSelectAll(true)
            } else {
                  setSelectAll(false)
            }
      }, [selectedSubscribers, subscribers])

      // Handle individual checkbox selection
      const handleSelectSubscriber = (id) => {
            if (selectedSubscribers.includes(id)) {
                  setSelectedSubscribers(selectedSubscribers.filter((subId) => subId !== id))
            } else {
                  setSelectedSubscribers([...selectedSubscribers, id])
            }
      }

      // Handle select all checkbox
      const handleSelectAll = () => {
            setSelectAll(!selectAll)
      }

      const delete_subscriber = async (id) => {
            if (window.confirm("Are you sure you want to delete this subscriber?")) {
                  try {
                        await fetch(`${base_url}/subscriber/delete-subscriber?subscriber_id=${id}`, {
                              method: 'DELETE',
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                        })
                        refetch();
                  } catch (err) {
                        setError("Error deleting subscriber: " + err.message)
                  }
            }
      }

      // Format date
      const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleString()
      }

      // Modal component
      const EmailModal = () => {

            if (!showModal) return null

            const selectedEmails = subscribers
                  .filter((subscriber) => selectedSubscribers.includes(subscriber._id))
                  .map((subscriber) => subscriber.email)

            const emailString = selectedEmails.join(", ")

            const handleOpenMailApp = (e) => {
                  e.preventDefault()
                  const mailtoLink = `mailto:${emailString}?subject=${encodeURIComponent(e.target.subject.value)}`
                  window.open(mailtoLink, "_blank")
            }

            return (
                  <div className="fixed inset-0 bg-gray-900/90 bg-opacity-40 z-50 flex items-center justify-center p-4">
                        <form onSubmit={handleOpenMailApp} className="bg-gray-900 border border-gray-700 border-opacity-20 rounded-lg shadow-xl w-full max-w-4xl  flex flex-col">
                              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                                    <h2 className="text-xl font-semibold">Compose Email</h2>
                                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                          <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                          >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                    </button>
                              </div>
                              <div className="flex-1 p-4 overflow-auto">
                                    <div className="mb-4">
                                          <div className="font-medium text-sm mb-1">To:</div>
                                          <div className="p-2 border border-gray-700 rounded-md bg-gray-900 bg-opacity-20 text-sm max-h-20 overflow-y-auto">{emailString}</div>
                                    </div>
                                    <div className="mb-4">
                                          <div className="font-medium text-sm mb-1">Subject:</div>
                                          <input
                                                type="text"
                                                name="subject"
                                                className="w-full p-2 text-white bg-gray-900 bg-opacity-20 border border-gray-700 rounded-md"
                                                placeholder="Enter email subject"
                                          />
                                    </div>

                              </div>
                              <div className="p-4 border-t border-gray-700 border-opacity-20 flex justify-end">
                                    <button
                                          type="submit"
                                          className="bg-blue-600 hover:bg-blue-700 bg-opacity-40 hover:bg-opacity-70 text-white px-4 py-2 rounded-md mr-2"
                                    >
                                          Open in Mail App
                                    </button>
                                    <button type="button" onClick={closeModal} className="bg-red-700 hover:bg-red-800 bg-opacity-40 hover:bg-opacity-70 text-white px-4 py-2 rounded-md">
                                          Close
                                    </button>
                              </div>
                        </form>
                  </div>
            )
      }

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
                  <h1 className="text-2xl font-bold mb-6">Subscribers</h1>

                  {/* Floating action button for sending emails */}
                  {selectedSubscribers.length > 0 && (
                        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
                              <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm">
                                    {selectedSubscribers.length} selected
                              </div>
                              <button
                                    onClick={openEmailModal}
                                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105"
                              >
                                    <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6"
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
                              </button>
                        </div>
                  )}

                  <div className="overflow-x-auto border border-gray-700 border-opacity-20 shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 divide-opacity-20">
                              <thead className="">
                                    <tr>
                                          <th className="px-6 py-3 text-left">
                                                <div className="flex items-center">
                                                      <input
                                                            type="checkbox"
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
                                                      />
                                                </div>
                                          </th>

                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subscription Date
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                              </thead>
                              <tbody className=" divide-y divide-gray-200 divide-opacity-20">
                                    {subscribers.length === 0 ? (
                                          <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                      No subscribers found
                                                </td>
                                          </tr>
                                    ) : (
                                          subscribers.map((subscriber) => (
                                                <tr
                                                      key={subscriber._id}
                                                      className={`hover:bg-gray-50 hover:bg-opacity-10 ${selectedSubscribers.includes(subscriber._id) ? "bg-blue-50 bg-opacity-10" : ""}`}
                                                >
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                  <input
                                                                        type="checkbox"
                                                                        checked={selectedSubscribers.includes(subscriber._id)}
                                                                        onChange={() => handleSelectSubscriber(subscriber._id)}
                                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
                                                                  />
                                                            </div>
                                                      </td>

                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                  <a
                                                                        href={`mailto:${subscriber.email}`}
                                                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                  >
                                                                        {subscriber.email}
                                                                  </a>
                                                            </div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500">{formatDate(subscriber.time_stamp)}</div>
                                                      </td>
                                                      <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                  onClick={() => delete_subscriber(subscriber._id)}
                                                                  className={`px-2 inline-flex text-xs cursor-pointer leading-5 font-semibold rounded-full  bg-red-100 text-red-800`}
                                                            >
                                                                  Delete Subscriber
                                                            </span>
                                                      </td>
                                                </tr>
                                          ))
                                    )}
                              </tbody>
                        </table>
                  </div>
                  <EmailModal />
            </div>
      )
}

export default SubscribersTable
