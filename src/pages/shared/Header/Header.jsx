import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../Assctes/logo.png";
import { 
      HiOutlineBars3, 
      HiOutlineXMark,
      HiOutlineSquares2X2,
      HiOutlineArrowRightOnRectangle,
      HiOutlineChevronRight,
      HiOutlineArrowUpRight,
      HiOutlinePhone,
      HiOutlineEnvelope
} from "react-icons/hi2";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

const navigationItems = [
      { label: "Home", to: "/" },
      { label: "About", to: "/about" },
      { label: "Project", to: "/all_project" },
      { label: "Service", to: "/service" },
      { label: "Blog", to: "/blog" },
      { label: "Careers", to: "/careers" },
];

const Header = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [schedule, setSchedule] = useState(false);
      const [profileOpen, setProfileOpen] = useState(false);
      const [profileOpen_sm, setProfileOpen_sm] = useState(false);

      const dropdownRef = useRef(null);
      const mobileProfileRef = useRef(null);

      const { user, setUser } = useContext(AuthContext);
      const navigate = useNavigate();

      const logOut = () => {
            setUser(null);
            localStorage.removeItem("data");
            navigate("/sign_in");
      };

      const navLinkClass = ({ isActive }) =>
            isActive
                  ? "nav-active relative inline-flex px-2 py-2 text-xs font-semibold after:absolute after:inset-x-2 after:-bottom-[2px] after:h-0.5 xl:px-2.5 xl:text-sm text-[#0A65B4]"
                  : "inline-flex px-2 py-2 text-xs font-medium text-slate-600 transition-colors hover:text-[#0A65B4] xl:px-2.5 xl:text-sm";

      /* -------- Outside Click Close -------- */
      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (
                        dropdownRef.current &&
                        !dropdownRef.current.contains(event.target)
                  ) {
                        setProfileOpen(false);
                  }

                  if (
                        mobileProfileRef.current &&
                        !mobileProfileRef.current.contains(event.target)
                  ) {
                        setProfileOpen_sm(false);
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                  document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      /* -------- Prevent Scroll When Menu Open -------- */
      useEffect(() => {
            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = isMenuOpen ? "hidden" : previousOverflow;

            return () => {
                  document.body.style.overflow = previousOverflow;
            };
      }, [isMenuOpen]);

      useEffect(() => {
            const closeOnEscape = (event) => {
                  if (event.key === "Escape") {
                        setIsMenuOpen(false);
                        setProfileOpen(false);
                        setProfileOpen_sm(false);
                  }
            };

            document.addEventListener("keydown", closeOnEscape);
            return () => document.removeEventListener("keydown", closeOnEscape);
      }, []);

      return (
            <div>
                  <nav 
                        aria-label="Main navigation" 
                        className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-xl px-4 sm:px-6 lg:px-8 transition-all"
                  >
                        <div className="grid h-[68px] sm:h-[72px] w-full mx-auto max-w-7xl grid-cols-[1fr_auto_1fr] items-center">

                              {/* Logo */}
                              <Link 
                                    to="/" 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className="inline-flex items-center gap-2.5 whitespace-nowrap focus:outline-none"
                              >
                                    <img src={logo} alt="Bright Future Soft" className="h-8 sm:h-9 object-contain" />
                              </Link>

                              {/* Desktop Navigation */}
                              <div className="hidden items-center justify-center xl:flex">
                                    <ul className="flex items-center gap-3 2xl:gap-6">
                                          {navigationItems.map(({ label, to }) => (
                                                <li key={to}>
                                                      <NavLink to={to} className={navLinkClass}>
                                                            {label}
                                                      </NavLink>
                                                </li>
                                          ))}
                                    </ul>
                              </div>

                              {/* Desktop Right Actions */}
                              <div className="hidden items-center justify-end xl:flex">
                                    {!user ? (
                                          <button 
                                                onClick={() => setSchedule(true)} 
                                                className="header-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xs transition-all hover:brightness-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0A65B4]/30"
                                          >
                                                <span>Book a call</span>
                                                <HiOutlineArrowUpRight className="text-sm" aria-hidden="true" />
                                          </button>
                                    ) : (
                                          <div className="relative" ref={dropdownRef}>
                                                <button
                                                      onClick={() => setProfileOpen(!profileOpen)}
                                                      aria-label="Open account menu"
                                                      aria-expanded={profileOpen}
                                                      className="relative rounded-full p-0.5 transition-all duration-200 hover:ring-2 hover:ring-[#0A65B4]/30 focus:outline-none focus:ring-2 focus:ring-[#0A65B4]"
                                                >
                                                      <img 
                                                            src={user?.image || "/favicon.ico"} 
                                                            alt={user?.name || "User"} 
                                                            className="h-9 w-9 rounded-full border border-slate-200 object-cover shadow-2xs" 
                                                      />
                                                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                </button>

                                                {/* Aesthetic Profile Dropdown */}
                                                {profileOpen && (
                                                      <div className="absolute right-0 top-full mt-2.5 w-60 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-2 shadow-[0_16px_40px_rgba(20,34,53,0.12)] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                                                            {/* User Info Header */}
                                                            <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-slate-100">
                                                                  <img
                                                                        src={user?.image || "/favicon.ico"}
                                                                        alt={user?.name || "User"}
                                                                        className="h-8 w-8 rounded-full border border-slate-200 object-cover flex-shrink-0"
                                                                  />
                                                                  <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-bold text-[#142235] truncate leading-tight">
                                                                              {user?.name || "Member Account"}
                                                                        </p>
                                                                        <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                                                                              {user?.email || "Signed in"}
                                                                        </p>
                                                                  </div>
                                                            </div>

                                                            {/* Menu Actions */}
                                                            <div className="py-1 space-y-0.5">
                                                                  <Link
                                                                        to="/dashboard/home"
                                                                        onClick={() => setProfileOpen(false)}
                                                                        className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0A65B4]/10 hover:text-[#0A65B4] transition-colors"
                                                                  >
                                                                        <HiOutlineSquares2X2 className="text-base text-[#0A65B4]" />
                                                                        <span>Dashboard</span>
                                                                  </Link>
                                                            </div>

                                                            {/* Sign Out */}
                                                            <div className="pt-1 border-t border-slate-100">
                                                                  <button
                                                                        onClick={() => {
                                                                              logOut();
                                                                              setProfileOpen(false);
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                                                  >
                                                                        <HiOutlineArrowRightOnRectangle className="text-base" />
                                                                        <span>Log out</span>
                                                                  </button>
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    )}
                              </div>

                              {/* Mobile Right Section (Profile + Hamburger) */}
                              <div className="relative col-start-3 ml-auto flex items-center gap-2.5 xl:hidden">
                                    {/* Mobile User Profile Button */}
                                    {user && (
                                          <div className="relative" ref={mobileProfileRef}>
                                                <button
                                                      onClick={() => setProfileOpen_sm(!profileOpen_sm)}
                                                      aria-label="Open account menu"
                                                      aria-expanded={profileOpen_sm}
                                                      className="relative rounded-full p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#0A65B4]/20 active:scale-95"
                                                >
                                                      <img 
                                                            src={user?.image || "/favicon.ico"} 
                                                            alt={user?.name || "User"} 
                                                            className="h-8 w-8 rounded-full border border-slate-200 object-cover shadow-2xs" 
                                                      />
                                                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                                                </button>

                                                {/* Mobile Profile Dropdown */}
                                                {profileOpen_sm && (
                                                      <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-2 shadow-[0_16px_40px_rgba(20,34,53,0.12)] animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                                                            <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center gap-2">
                                                                  <img
                                                                        src={user?.image || "/favicon.ico"}
                                                                        alt=""
                                                                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                                                                  />
                                                                  <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-bold text-[#142235] truncate">{user?.name || "User"}</p>
                                                                        <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                                                                  </div>
                                                            </div>
                                                            <div className="py-1 space-y-0.5">
                                                                  <Link
                                                                        to="/dashboard/home"
                                                                        onClick={() => setProfileOpen_sm(false)}
                                                                        className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-[#0A65B4]/10 hover:text-[#0A65B4] transition-colors"
                                                                  >
                                                                        <HiOutlineSquares2X2 className="text-base text-[#0A65B4]" />
                                                                        <span>Dashboard</span>
                                                                  </Link>
                                                            </div>
                                                            <div className="pt-1 border-t border-slate-100">
                                                                  <button
                                                                        onClick={() => {
                                                                              logOut();
                                                                              setProfileOpen_sm(false);
                                                                        }}
                                                                        className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                                                  >
                                                                        <HiOutlineArrowRightOnRectangle className="text-base" />
                                                                        <span>Log out</span>
                                                                  </button>
                                                            </div>
                                                      </div>
                                                )}
                                          </div>
                                    )}

                                    {/* Minimalist Aesthetic Hamburger Toggle */}
                                    <button
                                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                                          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                                          aria-expanded={isMenuOpen}
                                          className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-800 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0A65B4]/20"
                                    >
                                          {isMenuOpen ? (
                                                <HiOutlineXMark className="text-xl text-[#142235] transition-transform duration-200" />
                                          ) : (
                                                <HiOutlineBars3 className="text-xl text-[#142235] transition-transform duration-200" />
                                          )}
                                    </button>
                              </div>
                        </div>

                        {/* Mobile Backdrop Overlay */}
                        <div 
                              onClick={() => setIsMenuOpen(false)}
                              className={`fixed inset-0 top-[68px] sm:top-[72px] z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden ${
                                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                              }`}
                        />

                        {/* Aesthetic & Expensive Mobile Drawer Menu */}
                        <div
                              aria-hidden={!isMenuOpen}
                              inert={!isMenuOpen}
                              className={`fixed left-0 top-[68px] sm:top-[72px] z-50 w-full rounded-b-3xl border-b border-slate-200/90 bg-white/95 px-5 pt-4 pb-6 shadow-2xl shadow-slate-950/10 backdrop-blur-2xl transition-all duration-300 xl:hidden ${
                                    isMenuOpen
                                          ? "max-h-[85vh] overflow-y-auto opacity-100 translate-y-0"
                                          : "pointer-events-none max-h-0 overflow-hidden opacity-0 -translate-y-2"
                              }`}
                        >
                              <div className="mx-auto max-w-md">
                                    {/* Category header */}
                                    <div className="flex items-center justify-between px-2 mb-2">
                                          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
                                                Navigation
                                          </span>
                                          <span className="text-[10.5px] text-[#0A65B4] font-semibold">
                                                Bright Future Soft
                                          </span>
                                    </div>

                                    {/* Navigation Items List */}
                                    <ul className="flex flex-col gap-1">
                                          {navigationItems.map(({ label, to }) => (
                                                <li key={to}>
                                                      <NavLink
                                                            to={to}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className={({ isActive }) =>
                                                                  `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                                        isActive
                                                                              ? "bg-[#0A65B4]/10 text-[#0A65B4]"
                                                                              : "text-slate-700 hover:bg-slate-50 hover:text-[#0A65B4]"
                                                                  }`
                                                            }
                                                      >
                                                            <span className="flex items-center gap-2.5">
                                                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#0A65B4] transition-colors" />
                                                                  {label}
                                                            </span>
                                                            <HiOutlineChevronRight className="text-xs text-slate-400 group-hover:text-[#0A65B4] group-hover:translate-x-0.5 transition-all" />
                                                      </NavLink>
                                                </li>
                                          ))}
                                    </ul>

                                    {/* Divider */}
                                    <div className="my-3.5 border-t border-slate-100" />

                                    {/* Bottom Action Area */}
                                    {!user ? (
                                          <div className="space-y-2.5">
                                                <button
                                                      onClick={() => {
                                                            setSchedule(true);
                                                            setIsMenuOpen(false);
                                                      }}
                                                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0A65B4] hover:bg-[#084F8D] active:scale-[0.99] py-3 px-4 text-sm font-bold text-white shadow-sm transition-all"
                                                >
                                                      <span>Book a call</span>
                                                      <HiOutlineArrowUpRight className="text-base" />
                                                </button>

                                                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                                                      <a
                                                            href="tel:+8801792205520"
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[11.5px] font-semibold text-slate-600 transition-colors border border-slate-100"
                                                      >
                                                            <HiOutlinePhone className="text-xs text-[#0A65B4]" />
                                                            <span>Call Us</span>
                                                      </a>
                                                      <a
                                                            href="mailto:contact@brightfuturesoft.com"
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-[11.5px] font-semibold text-slate-600 transition-colors border border-slate-100"
                                                      >
                                                            <HiOutlineEnvelope className="text-xs text-[#0A65B4]" />
                                                            <span>Email Us</span>
                                                      </a>
                                                </div>
                                          </div>
                                    ) : (
                                          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5">
                                                <div className="flex items-center gap-3">
                                                      <img
                                                            src={user?.image || "/favicon.ico"}
                                                            alt={user?.name || "User"}
                                                            className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                                                      />
                                                      <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-bold text-[#142235] truncate">{user?.name || "User"}</p>
                                                            <p className="text-[11px] text-slate-400 truncate">{user?.email || "Signed in"}</p>
                                                      </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60">
                                                      <Link
                                                            to="/dashboard/home"
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0A65B4] hover:bg-blue-50 transition-colors shadow-2xs"
                                                      >
                                                            <HiOutlineSquares2X2 className="text-sm" />
                                                            <span>Dashboard</span>
                                                      </Link>
                                                      <button
                                                            onClick={() => {
                                                                  logOut();
                                                                  setIsMenuOpen(false);
                                                            }}
                                                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors shadow-2xs"
                                                      >
                                                            <HiOutlineArrowRightOnRectangle className="text-sm" />
                                                            <span>Log out</span>
                                                      </button>
                                                </div>
                                          </div>
                                    )}

                                    {/* Minimalist sub-footer */}
                                    <p className="text-[10px] text-slate-400 text-center pt-3 pb-0.5 font-medium tracking-tight">
                                          Bright Future Soft • Enterprise Engineering
                                    </p>
                              </div>
                        </div>
                  </nav>

                  {schedule && (
                        <CallSchedule
                              isModalOpen={schedule}
                              setModalOpen={setSchedule}
                        />
                  )}
            </div>
      );
};

export default Header;

/* ------------------ MODAL ------------------ */

export const CallSchedule = ({ isModalOpen, setModalOpen }) => {
      if (!isModalOpen) return null;

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
                  <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
                        <iframe
                              src="https://calendly.com/brightfuturesoft-bd"
                              title="Calendly Schedule"
                              className="w-full h-[80vh]"
                        />
                        <button
                              onClick={() => setModalOpen(false)}
                              className="absolute top-4 right-4 bg-[#2463eb] hover:bg-[#315bb6] w-10 h-10 rounded-full flex items-center justify-center text-white"
                        >
                              ✕
                        </button>
                  </div>
            </div>
      );
};
