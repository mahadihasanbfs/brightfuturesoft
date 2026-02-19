

import { useState } from "react"

const ProfileSection = ({ user }) => {
      const [imageLoaded, setImageLoaded] = useState(true)

      const handleImageError = () => {
            setImageLoaded(false)
      }

      return (
            <div className="flex flex-col md:flex-row gap-8 ">
                  <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4">
                              {user?.image && imageLoaded ? (
                                    <img
                                          src={user?.image || "/placeholder.svg"}
                                          alt={user?.name}
                                          className="w-full h-full object-cover"
                                          onError={handleImageError}
                                    />
                              ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                                          {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                              )}
                        </div>
                  </div>

                  <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4">Profile Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                    <p className="text-sm text-gray-200">Full Name</p>
                                    <p className="font-medium">{user?.name || "Not provided"}</p>
                              </div>

                              <div>
                                    <p className="text-sm text-gray-200">Email Address</p>
                                    <p className="font-medium">{user?.email || "Not provided"}</p>
                              </div>

                              <div>
                                    <p className="text-sm text-gray-200">Designation</p>
                                    <p className="font-medium">{user?.designation || "Not provided"}</p>
                              </div>
                              <div>
                                    <p className="text-sm text-gray-200">Phone</p>
                                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                              </div>

                              <div>
                                    <p className="text-sm text-gray-200">Date of Birth</p>
                                    <p className="font-medium">{user?.dob || "Not provided"}</p>
                              </div>



                              <div>
                                    <p className="text-sm text-gray-200">Account Created</p>
                                    <p className="font-medium">
                                          {user?.timestamp
                                                ? new Date(user.timestamp).toLocaleDateString("en-US", {
                                                      year: "numeric",
                                                      month: "long",
                                                      day: "numeric",
                                                })
                                                : "Not available"}
                                    </p>
                              </div>

                        </div>
                  </div>
            </div>
      )
}

export default ProfileSection
