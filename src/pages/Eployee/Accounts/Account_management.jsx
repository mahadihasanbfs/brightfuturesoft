import { useContext, useState } from "react";

import ProfileSection from "./ProfileSection";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { AuthContext } from "../../../context/UseContext/AuthProvider";



const Account_management = () => {
      const { user } = useContext(AuthContext)
      const [activeTab, setActiveTab] = useState("profile")

      return (
            <div className="min-h-screen  py-8 text-white">
                  <div className="max-w-5xl px-4">
                        <h1 className="text-3xl font-bold mb-6">Account Management</h1>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 mb-6">
                              <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`py-2 px-4 font-medium text-sm ${activeTab === "profile" ? "border-b-2 border-[#1c65b4] text-[#1c65b4]" : "text-gray-200 hover:text-gray-700"
                                          }`}
                              >
                                    Profile
                              </button>
                              <button
                                    onClick={() => setActiveTab("update")}
                                    className={`py-2 px-4 font-medium text-sm ${activeTab === "update" ? "border-b-2 border-[#1c65b4] text-[#1c65b4]" : "text-gray-200 hover:text-gray-700"
                                          }`}
                              >
                                    Update Profile
                              </button>
                              <button
                                    onClick={() => setActiveTab("password")}
                                    className={`py-2 px-4 font-medium text-sm ${activeTab === "password"
                                          ? "border-b-2 border-[#1c65b4] text-[#1c65b4]"
                                          : "text-gray-200 hover:text-gray-700"
                                          }`}
                              >
                                    Change Password
                              </button>
                        </div>

                        {/* Content based on active tab */}
                        <div className="border border-gray-700 rounded-lg shadow-sm p-6">
                              {activeTab === "profile" && <ProfileSection user={user} />}
                              {activeTab === "update" && <UpdateProfileForm user={user} />}
                              {activeTab === "password" && <ChangePasswordForm user={user} />}
                        </div>
                  </div>
            </div>
      )
}

export default Account_management;
