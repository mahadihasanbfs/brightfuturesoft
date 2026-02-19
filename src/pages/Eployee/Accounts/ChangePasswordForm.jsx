import { useState, useContext } from "react"

import { FaEye, FaEyeSlash } from "react-icons/fa"
import { base_url } from "../../../layout/Title"
import { AuthContext } from "../../../context/UseContext/AuthProvider"

const ChangePasswordForm = ({ user }) => {
      const { changePassword } = useContext(AuthContext)
      const [isLoading, setIsLoading] = useState(false)
      const [message, setMessage] = useState({ type: "", text: "" })
      const [formData, setFormData] = useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
      })
      const [errors, setErrors] = useState({})

      const [visibility, setVisibility] = useState({
            currentPassword: false,
            newPassword: false,
            confirmPassword: false,
      })

      const handleChange = (e) => {
            const { name, value } = e.target
            setFormData((prev) => ({ ...prev, [name]: value }))
            if (errors[name]) {
                  setErrors((prev) => ({ ...prev, [name]: "" }))
            }
      }

      const toggleVisibility = (field) => {
            setVisibility((prev) => ({ ...prev, [field]: !prev[field] }))
      }

      const validateForm = () => {
            const newErrors = {}
            if (!formData.currentPassword) {
                  newErrors.currentPassword = "Current password is required"
            }
            if (!formData.newPassword) {
                  newErrors.newPassword = "New password is required"
            } else if (formData.newPassword.length < 6) {
                  newErrors.newPassword = "Password must be at least 6 characters"
            }
            if (!formData.confirmPassword) {
                  newErrors.confirmPassword = "Please confirm your new password"
            } else if (formData.newPassword !== formData.confirmPassword) {
                  newErrors.confirmPassword = "Passwords do not match"
            }

            setErrors(newErrors)
            return Object.keys(newErrors).length === 0
      }

      const handleSubmit = async (e) => {
            e.preventDefault()
            if (!validateForm()) return

            setIsLoading(true)
            setMessage({ type: "", text: "" })

            try {
                  const data = {
                        old_password: formData.currentPassword,
                        new_password: formData.newPassword,
                  }

                  fetch(`${base_url}/auth/update-user-password?user_id=${user?._id}`, {
                        method: "PUT",
                        headers: {
                              "Content-Type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(data),
                  })
                        .then((res) => res.json())
                        .then((data) => {
                              if (data.success) {
                                    setMessage({
                                          type: "success",
                                          text: "Password changed successfully!",
                                    });
                              }
                        });

            } catch (error) {
                  setMessage({
                        type: "error",
                        text: error.message || "Failed to change password. Please try again.",
                  })
            } finally {
                  setIsLoading(false)
            }
      }

      const renderPasswordInput = (label, name, value, error) => (
            <div>
                  <label htmlFor={name} className="block text-sm font-medium text-gray-100 mb-1">
                        {label}
                  </label>
                  <div className="relative">
                        <input
                              type={visibility[name] ? "text" : "password"}
                              id={name}
                              name={name}
                              value={value}
                              onChange={handleChange}
                              className={`w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md  focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-700"
                                    }`}
                        />
                        <button
                              type="button"
                              onClick={() => toggleVisibility(name)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 "
                        >
                              {visibility[name] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                  </div>
                  {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
      )

      return (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Change Password</h2>

                  {message.text && (
                        <div
                              className={`p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                        >
                              {message.text}
                        </div>
                  )}

                  <div className="space-y-4">
                        {renderPasswordInput("Current Password", "currentPassword", formData.currentPassword, errors.currentPassword)}
                        {renderPasswordInput("New Password", "newPassword", formData.newPassword, errors.newPassword)}
                        {renderPasswordInput("Confirm New Password", "confirmPassword", formData.confirmPassword, errors.confirmPassword)}
                  </div>

                  <div className="flex justify-end">
                        <button
                              type="submit"
                              disabled={isLoading}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors disabled:opacity-50"
                        >
                              {isLoading ? "Changing..." : "Change Password"}
                        </button>
                  </div>
            </form>
      )
}

export default ChangePasswordForm
