
import { useQuery } from "@tanstack/react-query"
import { base_url } from "../../../layout/Title"
import { useContext, useState } from "react"

import { Trash2, Pencil, X, Check, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import Link_Button from "../../shared/Link_Button"
import { AuthContext } from "../../../context/UseContext/AuthProvider"

const EmployeeManagement = () => {
      const { user } = useContext(AuthContext)
      const [editingUser, setEditingUser] = useState(null)
      const [deleteConfirm, setDeleteConfirm] = useState(null)
      const [formData, setFormData] = useState({
            name: "",
            email: "",
            role: "",
            image: "",
      })
      const [isSubmitting, setIsSubmitting] = useState(false)

      const {
            data: all_users = [],
            refetch,
            isLoading,
      } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all?email=${user?.email}`, {
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

      const handleEdit = (user) => {
            setEditingUser(user)
            setFormData({
                  name: user?.name,
                  email: user?.email,
                  role: user.role,
                  image: user?.image,
            })
      }

      const handleChange = (e) => {
            const { name, value } = e.target
            setFormData((prev) => ({
                  ...prev,
                  [name]: value,
            }))
      }

      const handleUpdate = async (e) => {
            e.preventDefault()
            setIsSubmitting(true)

            try {
                  const res = await fetch(`${base_url}/auth/update/${editingUser._id}`, {
                        method: "PATCH",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(formData),
                  })

                  const data = await res.json()

                  if (data.success) {
                        setEditingUser(null)
                        refetch()
                  }
            } catch (error) {
                  console.error("Update failed:", error)
            } finally {
                  setIsSubmitting(false)
            }
      }

      const handleDelete = async (id) => {
            setIsSubmitting(true)

            try {
                  const res = await fetch(`${base_url}/auth/delete/${id}`, {
                        method: "DELETE",
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  })

                  const data = await res.json()

                  if (data.success) {
                        setDeleteConfirm(null)
                        refetch()
                  }
            } catch (error) {
                  console.error("Delete failed:", error)
            } finally {
                  setIsSubmitting(false)
            }
      }

      return (
            <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold mb-8 text-gray-100">Employee Management</h1>

                  <div className="mb-4 flex gap-2">
                        <Link_Button name={'Add New Employee'} url={'/sign_up'} />{' '}
                        {/* <Link_Button name={'Attendance'} url={'/dashboard/employee-management/attendance'} /> */}
                  </div>

                  {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        </div>
                  ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {all_users.map((user) => (
                                    <div
                                          key={user._id}
                                          className=" rounded-lg relative shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                                    >
                                          <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                      <div className="flex items-center">
                                                            {user?.image ? (
                                                                  <img
                                                                        src={user?.image || "/placeholder.svg"}
                                                                        alt={user?.name}
                                                                        className="w-12 h-12 rounded object-cover mr-4"
                                                                  />
                                                            ) : (
                                                                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                                                        <span className="text-xl font-bold text-gray-500">{user?.name.charAt(0).toUpperCase()}</span>
                                                                  </div>
                                                            )}
                                                            <div>
                                                                  <h3 className="font-semibold text-lg text-gray-100">{user?.name}</h3>
                                                                  <p className="text-sm text-gray-600">{user?.email}</p>
                                                            </div>
                                                      </div>
                                                </div>

                                                <div className="mt-2 mb-4">
                                                      <span className="inline-block px-3 py-1 capitalize  text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                                                            {user.designation}
                                                      </span>
                                                </div>

                                                <div className="flex justify-end gap-2 absolute bottom-2 right-2">
                                                      <button
                                                            onClick={() => handleEdit(user)}
                                                            className="p-2 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                                                      >
                                                            <Pencil className="w-5 h-5" />
                                                      </button>
                                                      <button
                                                            onClick={() => setDeleteConfirm(user)}
                                                            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                      >
                                                            <Trash2 className="w-5 h-5" />
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  )}

                  {/* Edit Modal */}
                  {editingUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                    <div className="flex justify-between items-center p-6 border-b">
                                          <h2 className="text-xl font-semibold">Edit Employee</h2>
                                          <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-700">
                                                <X className="w-5 h-5" />
                                          </button>
                                    </div>

                                    <form onSubmit={handleUpdate} className="p-6">
                                          <div className="space-y-4">
                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                                      <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                      />
                                                </div>

                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                      <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                      />
                                                </div>

                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                                      <select
                                                            name="role"
                                                            value={formData.role}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            required
                                                      >
                                                            <option value="admin">Admin</option>
                                                            <option value="manager">Manager</option>
                                                            <option value="employee">Employee</option>
                                                      </select>
                                                </div>

                                                <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                                      <input
                                                            type="text"
                                                            name="image"
                                                            value={formData.image}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                      />
                                                </div>
                                          </div>

                                          <div className="mt-6 flex justify-end space-x-3">
                                                <button
                                                      type="button"
                                                      onClick={() => setEditingUser(null)}
                                                      className="px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      type="submit"
                                                      disabled={isSubmitting}
                                                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                                                >
                                                      {isSubmitting ? (
                                                            <>
                                                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                  Updating...
                                                            </>
                                                      ) : (
                                                            <>
                                                                  <Check className="w-4 h-4 mr-2" />
                                                                  Update
                                                            </>
                                                      )}
                                                </button>
                                          </div>
                                    </form>
                              </div>
                        </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {deleteConfirm && (
                        <div className="fixed inset-0 bg-gray-900/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
                              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                                    <div className="p-6">
                                          <h2 className="text-xl text-black font-semibold mb-4">Confirm Delete</h2>
                                          <p className="text-gray-600 mb-6">
                                                Are you sure you want to delete <span className="font-medium">{deleteConfirm.name}</span>? This action
                                                cannot be undone.
                                          </p>

                                          <div className="flex justify-end space-x-3">
                                                <button
                                                      onClick={() => setDeleteConfirm(null)}
                                                      className="px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-50"
                                                >
                                                      Cancel
                                                </button>
                                                <button
                                                      onClick={() => handleDelete(deleteConfirm._id)}
                                                      disabled={isSubmitting}
                                                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                                                >
                                                      {isSubmitting ? (
                                                            <>
                                                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                  Deleting...
                                                            </>
                                                      ) : (
                                                            <>
                                                                  <Trash2 className="w-4 h-4 mr-2" />
                                                                  Delete
                                                            </>
                                                      )}
                                                </button>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  )}

                  {/* Empty state */}
                  {!isLoading && all_users.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                              <p className="text-gray-500">Add employees to get started.</p>
                        </div>
                  )}
            </div>
      )
}

export default EmployeeManagement
