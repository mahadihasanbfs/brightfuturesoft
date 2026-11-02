import { useState } from "react";
import { Briefcase, CalendarDays, Cake, Mail, Phone } from "lucide-react";

const Item = ({ icon: Icon, label, value }) => (
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="rounded-lg bg-blue-500/15 p-2 text-blue-400"><Icon size={16} /></span>
            <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
                  <p className="mt-0.5 truncate font-medium text-white">{value || "Not provided"}</p>
            </div>
      </div>
);

const ProfileSection = ({ user }) => {
      const [imageLoaded, setImageLoaded] = useState(true);
      const created = user?.timestamp
            ? new Date(user.timestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";

      return (
            <div className="space-y-8">
                  <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/10 shadow-xl">
                              {user?.image && imageLoaded ? (
                                    <img src={user.image} alt={user?.name} className="h-full w-full object-cover" onError={() => setImageLoaded(false)} />
                              ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold">
                                          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                              )}
                        </div>
                        <div>
                              <h2 className="text-2xl font-bold tracking-tight">{user?.name || "Your name"}</h2>
                              {user?.designation && (
                                    <span className="mt-2 inline-block rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">{user.designation}</span>
                              )}
                        </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                        <Item icon={Mail} label="Email" value={user?.email} />
                        <Item icon={Phone} label="Phone" value={user?.phone} />
                        <Item icon={Briefcase} label="Designation" value={user?.designation} />
                        <Item icon={Cake} label="Date of birth" value={user?.dob} />
                        <Item icon={CalendarDays} label="Member since" value={created} />
                  </div>
            </div>
      );
};

export default ProfileSection;
