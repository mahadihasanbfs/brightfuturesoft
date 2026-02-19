// import React, { useContext, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import logo from '../../../Assctes/logo.webp';

// import { HiBars3BottomLeft, HiBars3BottomRight, HiMinus } from 'react-icons/hi2';
// import { RiMenu3Fill } from 'react-icons/ri';
// import { GiCancel } from 'react-icons/gi';
// import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import { AuthContext } from '../../../context/UseContext/AuthProvider';



// const Header = () => {
//       const [isMenuOpen, setIsMenuOpen] = useState(false);
//       const { user, setUser } = useContext(AuthContext)
//       const [optOpen, setOptOpen] = useState(false);
//       const [schedule, setSchedule] = useState(false)
//       const navigate = useNavigate()


//       const logOut = () => {
//             setUser(null)
//             localStorage.removeItem('data')
//             navigate('/sign_in')

//       }


//       return (
//             <nav className="fixed  z-50 -top-0.5 left-0 right-0">
//                   <div className="py-2  mx-auto glass md:py-4 md:px-[4%] w-full px-[2%]">
//                         <div className="relative px-0 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 flex items-center justify-between">
//                               <Link to="/"><img loading="eager" src={logo} alt="" className='w-[135px]' /></Link>
//                               <ul className=" items-center hidden space-x-8 lg:flex ">
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/"

//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 Home
//                                           </NavLink>
//                                     </li>
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/about"
//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 About us
//                                           </NavLink>
//                                     </li>
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/all_project"
//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 Project
//                                           </NavLink>
//                                     </li>
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/service"
//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 Service
//                                           </NavLink>
//                                     </li>
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/blog"
//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 Blog
//                                           </NavLink>
//                                     </li>
//                                     <li className="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative">
//                                           <NavLink
//                                                 to="/careers"
//                                                 className={({ isActive, isPending }) =>
//                                                       isPending ? "hover:text-[#418CD2]" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                                 }
//                                           >
//                                                 Careers
//                                           </NavLink>
//                                     </li>


//                                     {!user && <li>
//                                           <a
//                                                 className="inline-flex cursor-pointer items-center justify-center group relative  overflow-hidden border border-[#418CD2] px-8 py-2 focus:outline-none focus:ring"

//                                                 onClick={() => setSchedule(true)}
//                                           >
//                                                 <span
//                                                       className="absolute inset-y-0 left-0 w-[2px] bg-[#418CD2] transition-all group-hover:w-full group-active:bg-[#418CD2]"
//                                                 ></span>

//                                                 <span
//                                                       className="relative text-sm font-medium  text-white transition-colors group-hover:text-white"
//                                                 >
//                                                       Appointment
//                                                 </span>
//                                           </a>
//                                     </li>}

//                                     {
//                                           user && <li className="flex items-center gap-3">
//                                                 <div className="dropdown dropdown-end cursor-pointer">
//                                                       <label tabIndex={0} >
//                                                             <div className="relative cursor-pointer">
//                                                                   <img
//                                                                         className="object-cover w-10 h-10 rounded-full"
//                                                                         src={user?.image}
//                                                                         alt=""
//                                                                   />
//                                                                   <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute right-1 ring-1 ring-white bottom-0" />
//                                                             </div>

//                                                       </label>

//                                                       <ul tabIndex={0} className="menu dropdown-content px-2 py-3 shadow rounded-box w-52 mt-4 bg-[#23263d] border border-[#115fd4]">
//                                                             <ul>

//                                                                   <li>
//                                                                         <Link
//                                                                               to={'/dashboard/home'}
//                                                                               className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
//                                                                         >
//                                                                               <svg
//                                                                                     xmlns="http://www.w3.org/2000/svg"
//                                                                                     className="h-5 w-5 opacity-75"
//                                                                                     fill="none"
//                                                                                     viewBox="0 0 24 24"
//                                                                                     stroke="currentColor"
//                                                                                     strokeWidth={2}
//                                                                               >
//                                                                                     <path
//                                                                                           strokeLinecap="round"
//                                                                                           strokeLinejoin="round"
//                                                                                           d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                                                                     />
//                                                                               </svg>
//                                                                               <span className="text-sm font-medium"> Dashboard </span>
//                                                                         </Link>
//                                                                   </li>
//                                                                   <li>
//                                                                         <button
//                                                                               onClick={logOut}
//                                                                               className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
//                                                                         >
//                                                                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 opacity-75"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
//                                                                               <span className="text-sm font-medium"> Log out </span>
//                                                                         </button>
//                                                                   </li>
//                                                             </ul>

//                                                       </ul>
//                                                 </div>
//                                           </li>
//                                     }
//                               </ul>
//                               <div className="lg:hidden flex items-center gap-3">
//                                     {
//                                           user && <div className="cursor-pointer">
//                                                 <div className="dropdown dropdown-end cursor-pointer">
//                                                       <label tabIndex={0} >
//                                                             <div className="relative">
//                                                                   <img
//                                                                         className="object-cover w-10 h-10 rounded-full"
//                                                                         src={user?.image}
//                                                                         alt=""
//                                                                   />
//                                                                   <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 absolute right-1 ring-1 ring-white bottom-0" />
//                                                             </div>

//                                                       </label>

//                                                       <ul tabIndex={0} className="menu dropdown-content px-2 py-3 shadow rounded-box w-52 mt-4 bg-[#23263d] border border-[#115fd4]">
//                                                             <li>
//                                                                   <Link
//                                                                         to={'/dashboard/home'}
//                                                                         className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
//                                                                   >
//                                                                         <svg
//                                                                               xmlns="http://www.w3.org/2000/svg"
//                                                                               className="h-5 w-5 opacity-75"
//                                                                               fill="none"
//                                                                               viewBox="0 0 24 24"
//                                                                               stroke="currentColor"
//                                                                               strokeWidth={2}
//                                                                         >
//                                                                               <path
//                                                                                     strokeLinecap="round"
//                                                                                     strokeLinejoin="round"
//                                                                                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                                                               />
//                                                                         </svg>
//                                                                         <span className="text-sm font-medium"> Dashboard </span>
//                                                                   </Link>
//                                                             </li>
//                                                             <li>
//                                                                   <button
//                                                                         onClick={logOut}
//                                                                         className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
//                                                                   >
//                                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 opacity-75"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
//                                                                         <span className="text-sm font-medium"> Log out </span>
//                                                                   </button>
//                                                             </li>

//                                                       </ul>
//                                                 </div>
//                                           </div>
//                                     }
//                                     {/* onClick={() => setIsMenuOpen(!isMenuOpen)} */}
//                                     <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="">
//                                           {!isMenuOpen ? <RiMenu3Fill className='text-4xl border-[red]' />
//                                                 : <GiCancel className='text-4xl border-[red]' />}
//                                     </button>


//                               </div>
//                         </div>
//                   </div>
//                   <div className={`${isMenuOpen ? 's-open' : 's-close'} bg-[#14143f] text-start lg:hidden block`}>
//                         <ul className="p-2 text-center">

//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center  mt-300 h-[40px] flex items-center rounded overflow-hidden px-2 racking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute top-0 left bottom-0 flex items-center rounded px-3 h-full justify-center w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           Home
//                                     </NavLink>
//                               </li>
//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/about"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute top-0 left-0 bottom-0 flex justify-center items-center px-3 h-full w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           About us
//                                     </NavLink>
//                               </li>
//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/all_project"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute top-0 left-0 bottom-0 flex justify-center items-center px-3 h-full w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           Project
//                                     </NavLink>
//                               </li>
//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/service"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute top-0 left-0 bottom-0 flex justify-center items-center px-3 h-full w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           Service
//                                     </NavLink>
//                               </li>

//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/review"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute top-0 left-0 bottom-0 flex justify-center items-center px-3 h-full w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           Review
//                                     </NavLink>
//                               </li>


//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/blog"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "" : isActive ? "absolute justify-center top-0 left-0 bottom-0 flex items-center px-3 h-full w-full bg-[#1796f034]" : ""
//                                           }
//                                     >
//                                           Blog
//                                     </NavLink>
//                               </li>
//                               <li onClick={() => setIsMenuOpen(!isMenuOpen)} className="font-medium justify-center mt-3 h-[40px] flex items-center rounded overflow-hidden px-2 tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400 relative ">
//                                     <NavLink
//                                           to="/careers"
//                                           className={({ isActive, isPending }) =>
//                                                 isPending ? "hover:text-[#418CD2]" : isActive ? "text-[#00d5ff] after:absolute after:left-0 after:right-0 after:bottom-[-10px] after:h-[4px] after:w-[20px] after:mx-auto after:rounded-full  after:bg-[#00bfff]" : "hover:text-[#418CD2]"
//                                           }
//                                     >
//                                           Careers
//                                     </NavLink>
//                               </li>


//                               {
//                                     user ? <li onClick={() => setOptOpen(!optOpen)} className={` mt-3 ${optOpen ? 'h-[auto]' : 'h-[42px]'} hidden overflow-hidden`}>
//                                           <div className="flex items-center justify-between gap-2">
//                                                 <div className="flex items-center gap-3">
//                                                       <div className="">
//                                                             <p className='text-xl text-blue-500'>
//                                                                   {user?.displayName}
//                                                             </p>
//                                                       </div>
//                                                 </div>
//                                                 {
//                                                       optOpen ? <FaAngleUp className="text-xl" /> : <FaAngleDown className="text-xl" />
//                                                 }


//                                           </div>
//                                           <div className=" mt-3 p-2 rounded-lg">
//                                                 <button className='bg-[#0d3a73] w-full p-2 rounded-lg text-white' >Log out</button>
//                                           </div>
//                                     </li> : ""
//                               }

//                               {!user && <li className='mt-4'>
//                                     <button
//                                           className="inline-flex items-center cursor-pointer justify-center group relative  overflow-hidden border border-[#418CD2] px-8 py-2 focus:outline-none focus:ring"
//                                           onClick={() => setSchedule(true)}

//                                     >
//                                           <span
//                                                 className="absolute inset-y-0 left-0 w-[2px] bg-[#418CD2] transition-all group-hover:w-full group-active:bg-[#418CD2]"
//                                           ></span>

//                                           <span
//                                                 className="relative text-sm font-medium text-white transition-colors group-hover:text-white"
//                                           >
//                                                 Appointment
//                                           </span>
//                                     </button>
//                               </li>
//                               }

//                         </ul>
//                   </div>
//                   {schedule && <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />}
//             </nav>
//       );



// };

// export default Header;



// export const CallSchedule = ({ isModalOpen, setModalOpen }) => {
//       if (!isModalOpen) return null; // Modal won't render if it's closed

//       return (
//             <div className="fixed inset-0 z-50 flex items-center h-screen pt-20 justify-center bg-black bg-opacity-70">
//                   <div className="relative mx-6 w-full max-w-4xl  p-4 bg-white rounded-lg shadow-lg">

//                         {/* Calendly iframe with modifications */}
//                         <iframe
//                               src="https://calendly.com/brightfuturesoft-bd"
//                               title="Calendly Schedule"
//                               className="w-full h-[80vh]  rounded-lg    "
//                         // allow="camera; microphone"
//                         />

//                         {/* Close button */}
//                         <button
//                               onClick={() => setModalOpen(false)}
//                               className="absolute top-3 bg-[#2463eb] hover:bg-[#315bb6]  size-10 rounded-full right-3 flex justify-center items-center text-gray-100 hover:text-gray-300"
//                         >
//                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
//                         </button>
//                   </div>
//             </div>
//       );
// };


import React, {
      useContext,
      useState,
      useRef,
      useEffect,
} from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../../Assctes/logo.webp";
import { RiMenu3Fill } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

const Header = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const [schedule, setSchedule] = useState(false);
      const [profileOpen, setProfileOpen] = useState(false);

      const dropdownRef = useRef(null);

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

      // Outside Click Close
      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (
                        dropdownRef.current &&
                        !dropdownRef.current.contains(event.target)
                  ) {
                        setProfileOpen(false);
                  }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                  document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      return (
            <>
                  <nav className="fixed z-50 -top-0.5 left-0 right-0 border-b border-gray-700 ">
                        <div className="py-2  mx-auto glass md:py-4 md:px-[4%] w-full px-[2%]">
                              <div className="relative px-0 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 flex items-center justify-between">
                                    <Link to="/">
                                          <img src={logo} alt="logo" className="w-[120px]" />
                                    </Link>

                                    {/* Desktop Menu */}
                                    <ul className="hidden lg:flex items-center gap-8 font-medium">
                                          <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
                                          <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
                                          <li><NavLink to="/all_project" className={navLinkClass}>Project</NavLink></li>
                                          <li><NavLink to="/service" className={navLinkClass}>Service</NavLink></li>
                                          <li><NavLink to="/blog" className={navLinkClass}>Blog</NavLink></li>
                                          <li><NavLink to="/careers" className={navLinkClass}>Careers</NavLink></li>

                                          {!user && (
                                                <li>
                                                      <button
                                                            onClick={() => setSchedule(true)}
                                                            className="relative px-6 py-2 border border-[#1c65b4]  overflow-hidden group"
                                                      >
                                                            <span className="absolute inset-0 bg-[#1c65b4] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                                                            <span className="relative text-white">
                                                                  Appointment
                                                            </span>
                                                      </button>
                                                </li>
                                          )}

                                          {user && (
                                                <li className="relative" ref={dropdownRef}>
                                                      <button
                                                            onClick={() =>
                                                                  setProfileOpen(!profileOpen)
                                                            }
                                                            className="flex items-center gap-2"
                                                      >
                                                            <img
                                                                  src={user?.image}
                                                                  alt="profile"
                                                                  className="w-10 h-10 rounded-full object-cover border-2 border-[#00d5ff]"
                                                            />
                                                      </button>

                                                      {profileOpen && (
                                                            <div className="absolute right-0 mt-4 w-56 bg-[#111633] p-3 shadow rounded-box rounded-xl  border border-[#115fd4] overflow-hidden animate-fadeIn">
                                                                  <div className="">
                                                                        {/* <div className="flex items-center gap-3">
                                                                        <div className="">
                                                                              <p className='text-xl text-blue-500'>
                                                                                    {user?.displayName}
                                                                              </p>
                                                                        </div>
                                                                  </div> */}
                                                                        {/* {
                                                                        optOpen ? <FaAngleUp className="text-xl" /> : <FaAngleDown className="text-xl" />
                                                                  } */}


                                                                        <ul tabIndex={0} className="">
                                                                              <li>
                                                                                    <Link
                                                                                          to={'/dashboard/home'}
                                                                                          className="flex items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700 rounded"
                                                                                    >
                                                                                          <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                className="h-5 w-5 opacity-75"
                                                                                                fill="none"
                                                                                                viewBox="0 0 24 24"
                                                                                                stroke="currentColor"
                                                                                                strokeWidth={2}
                                                                                          >
                                                                                                <path
                                                                                                      strokeLinecap="round"
                                                                                                      strokeLinejoin="round"
                                                                                                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                                                />
                                                                                          </svg>
                                                                                          <span className="text-sm font-medium"> Dashboard </span>
                                                                                    </Link>
                                                                              </li>
                                                                              <li>
                                                                                    <button
                                                                                          onClick={logOut}
                                                                                          className="flex w-full rounded items-center gap-2 border-s-[3px] border-transparent px-4 py-3 text-gray-500 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-700"
                                                                                    >
                                                                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 opacity-75"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                                                                          <span className="text-sm font-medium"> Log out </span>
                                                                                    </button>
                                                                              </li>

                                                                        </ul>
                                                                  </div>
                                                                  {/* <Link
                                                                  to="/dashboard/home"
                                                                  onClick={() =>
                                                                        setProfileOpen(false)
                                                                  }
                                                                  className="block px-4 py-3 text-gray-300 hover:bg-[#1a1f4d] hover:text-white transition"
                                                            >
                                                                  Dashboard
                                                            </Link>

                                                            <button
                                                                  onClick={() => {
                                                                        logOut();
                                                                        setProfileOpen(false);
                                                                  }}
                                                                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-[#1a1f4d] hover:text-white transition"
                                                            >
                                                                  Log out
                                                            </button> */}
                                                            </div>
                                                      )}
                                                </li>
                                          )}
                                    </ul>

                                    {/* Mobile Toggle */}
                                    <button
                                          onClick={() =>
                                                setIsMenuOpen(!isMenuOpen)
                                          }
                                          className="lg:hidden text-white text-3xl"
                                    >
                                          {isMenuOpen ? <GiCancel /> : <RiMenu3Fill />}
                                    </button>
                              </div>

                        </div>

                        {/* Mobile Menu */}
                        <div
                              className={`lg:hidden overflow-hidden transition-all duration-500 ${isMenuOpen
                                    ? "max-h-[600px] opacity-100"
                                    : "max-h-0 opacity-0"
                                    } bg-[#14143f]`}
                        >
                              <ul className="flex flex-col items-center gap-5 py-6 font-medium">
                                    <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                                    <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>About</NavLink>
                                    <NavLink to="/all_project" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Project</NavLink>
                                    <NavLink to="/service" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Service</NavLink>
                                    <NavLink to="/blog" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Blog</NavLink>
                                    <NavLink to="/careers" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Careers</NavLink>

                                    {!user && (
                                          <button
                                                onClick={() => {
                                                      setSchedule(true);
                                                      setIsMenuOpen(false);
                                                }}
                                                className="px-6 py-2 border border-[#418CD2]  text-white"
                                          >
                                                Appointment
                                          </button>
                                    )}

                                    {user && (
                                          <button
                                                onClick={() => {
                                                      logOut();
                                                      setIsMenuOpen(false);
                                                }}
                                                className="px-6 py-2 bg-[#0d3a73] rounded-md text-white"
                                          >
                                                Log out
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
            </>
      );
};

export default Header;

/* ------------------ MODAL ------------------ */

export const CallSchedule = ({
      isModalOpen,
      setModalOpen,
}) => {
      if (!isModalOpen) return null;

      return (
            <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-4">
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
