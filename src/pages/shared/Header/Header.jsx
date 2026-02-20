import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../Assctes/logo.webp";
import { RiMenu3Fill } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

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
                  ? "text-[#00d5ff] relative after:absolute after:left-0 after:right-0 after:-bottom-2 after:h-[3px] after:w-6 after:mx-auto after:rounded-full after:bg-[#00bfff]"
                  : "text-gray-300 hover:text-[#418CD2] transition duration-300";

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
            document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
      }, [isMenuOpen]);

      return (
            <div className="border-b border-gray-100">
                  <nav className="fixed -top-0.5 left-0 right-0 z-50   glass ">
                        <div className=" w-full px-[4%] py-3 flex items-center justify-between mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">

                              {/* Logo */}
                              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                    <img src={logo} alt="logo" className="w-[120px]" />
                              </Link>

                              {/* Desktop Menu */}
                              <ul className="hidden lg:flex items-center gap-8 font-medium ">
                                    <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
                                    <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
                                    <li><NavLink to="/all_project" className={navLinkClass}>Project</NavLink></li>
                                    <li><NavLink to="/service" className={navLinkClass}>Service</NavLink></li>
                                    <li><NavLink to="/blog" className={navLinkClass}>Blog</NavLink></li>
                                    <li><NavLink to="/careers" className={navLinkClass}>Careers</NavLink></li>

                                    {!user && (
                                          <li>
                                                <button onClick={() => setSchedule(true)} className="relative px-6 py-2 border border-[#1c65b4] overflow-hidden group" > <span className="absolute inset-0 bg-[#1c65b4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span> <span className="relative text-white"> Appointment </span> </button>
                                          </li>
                                    )}

                                    {user && <li className="relative">
                                          <button
                                                onClick={() => setProfileOpen(!profileOpen)}
                                          >
                                                <img
                                                      src={user?.image}
                                                      alt="profile"
                                                      className="w-10 h-10 mt-2 rounded-full object-cover border-2 border-[#00d5ff]"
                                                />
                                          </button>
                                    </li>}

                                    {user && (
                                          <li className="relative" ref={dropdownRef}>


                                                {profileOpen && (
                                                      <div className="absolute top-6 right-8 mt-4 w-56 bg-[#111633] p-2 rounded-xl shadow-xl border border-[#115fd4] animate-fadeIn">
                                                            <Link
                                                                  to="/dashboard/home"
                                                                  className="block px-4 py-2 rounded-md text-gray-300 hover:bg-[#1c65b4] hover:text-white transition"
                                                            >
                                                                  Dashboard
                                                            </Link>

                                                            <button
                                                                  onClick={logOut}
                                                                  className="w-full text-left px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition"
                                                            >
                                                                  Log out
                                                            </button>
                                                      </div>
                                                )}
                                          </li>
                                    )}

                              </ul>

                              {/* Mobile Right Section */}
                              <div className="flex items-center gap-3 lg:hidden relative">


                                    {user && (
                                          <div className="" ref={mobileProfileRef}>


                                                {profileOpen_sm && (
                                                      <div className="absolute right-0 top-12 w-52 bg-[#111633] rounded-xl shadow-xl border border-[#115fd4] p-2 animate-fadeIn">
                                                            <Link
                                                                  to="/dashboard/home"
                                                                  onClick={() => setProfileOpen_sm(false)}
                                                                  className="block px-4 py-2 rounded-md text-gray-300 hover:bg-[#1c65b4] hover:text-white transition"
                                                            >
                                                                  Dashboard
                                                            </Link>

                                                            <button
                                                                  onClick={() => {
                                                                        logOut();
                                                                        setProfileOpen_sm(false);
                                                                  }}
                                                                  className="w-full text-left px-4 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white transition"
                                                            >
                                                                  Log out
                                                            </button>
                                                      </div>
                                                )}
                                          </div>
                                    )}
                                    {user && <button
                                          onClick={() => setProfileOpen_sm(!profileOpen_sm)}
                                    >
                                          <img
                                                src={user?.image}
                                                alt="profile"
                                                className="w-9 h-9  rounded-full object-cover border-2 border-[#00d5ff]"
                                          />
                                    </button>}

                                    <button
                                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                                          className="text-white text-3xl"
                                    >
                                          {isMenuOpen ? <GiCancel /> : <RiMenu3Fill />}
                                    </button>
                              </div>
                        </div>

                        {/* Mobile Menu */}
                        <div
                              className={`lg:hidden fixed top-[68px] left-0 w-full glass transition-all duration-500   ${isMenuOpen
                                    ? "max-h-[600px] py-6 opacity-100"
                                    : "max-h-0 overflow-hidden opacity-0"
                                    }`}
                        >
                              <ul className="flex flex-col items-center gap-6 font-medium text-lg">
                                    <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Home</NavLink>
                                    <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>About</NavLink>
                                    <NavLink to="/all_project" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Project</NavLink>
                                    <NavLink to="/service" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Service</NavLink>
                                    <NavLink to="/blog" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Blog</NavLink>
                                    <NavLink to="/careers" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Careers</NavLink>

                                    {!user && (
                                          <button
                                                onClick={() => {
                                                      setSchedule(true);
                                                      setIsMenuOpen(false);
                                                }}
                                                className="mt-4 px-8 py-2 rounded-full bg-[#1c65b4] hover:bg-[#1454a1] transition text-white"
                                          >
                                                Appointment
                                          </button>
                                    )}
                              </ul>
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
