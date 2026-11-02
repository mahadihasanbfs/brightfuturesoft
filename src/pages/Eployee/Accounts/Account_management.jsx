import { useContext, useState } from "react";
import { Landmark, KeyRound, Pencil, User } from "lucide-react";

import ProfileSection from "./ProfileSection";
import UpdateProfileForm from "./UpdateProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import BankInfoForm from "./BankInfoForm";
import { AuthContext } from "../../../context/UseContext/AuthProvider";
import { PageHeader, card } from "../Invoice/ui";

const TABS = [
      { id: "profile", label: "Profile", icon: User },
      { id: "update", label: "Edit profile", icon: Pencil },
      { id: "bank", label: "Bank info", icon: Landmark },
      { id: "password", label: "Password", icon: KeyRound },
];

const Account_management = () => {
      const { user } = useContext(AuthContext);
      const [activeTab, setActiveTab] = useState("profile");

      return (
            <main className="w-full space-y-6 p-4 text-white sm:p-8">
                  <PageHeader title="Account" subtitle="Manage your profile, bank details and password." />

                  <nav className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 p-1" role="tablist">
                        {TABS.map(({ id, label, icon: Icon }) => (
                              <button
                                    key={id}
                                    role="tab"
                                    aria-selected={activeTab === id}
                                    onClick={() => setActiveTab(id)}
                                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === id ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
                              >
                                    <Icon size={15} /> {label}
                              </button>
                        ))}
                  </nav>

                  <div className={`${card} p-6 sm:p-8`}>
                        {activeTab === "profile" && <ProfileSection user={user} />}
                        {activeTab === "update" && <UpdateProfileForm user={user} />}
                        {activeTab === "bank" && <BankInfoForm />}
                        {activeTab === "password" && <ChangePasswordForm user={user} />}
                  </div>
            </main>
      );
};

export default Account_management;
