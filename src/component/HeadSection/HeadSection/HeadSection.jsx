import React, { useState } from 'react';
import vectorHdr from '../../../Assctes/vectors/vector(header).png';
import Typewriter from 'typewriter-effect';
import { HiArrowSmallRight } from "react-icons/hi2";
import "animate.css/animate.min.css";
import homeVc from './company.json';
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';
import { CallSchedule } from '../../../pages/shared/Header/Header';

const HeadSection = () => {

      const [schedule, set_schedule] = useState(false)

      return (
            <div className=" header-bg w-full md:pt-[100px] pt-[100px]     capitalize">

                  <div className="px-4  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl  lg:px-8 ">
                        <div className="flex flex-col items-center justify-between w-full  lg:flex-row">
                              <div className="mb-16 lg:mb-0 lg:max-w-lg lg:pr-5">
                                    <div className="max-w-xl mb-6">
                                          <div>
                                                <p className="inline-block px-3 py-px mb-4 text-[10px] font-semibold tracking-wider uppercase bg-teal-400 text-teal-900 rounded-full">
                                                      <Typewriter
                                                            options={{
                                                                  strings: [
                                                                        "Enterprise Web Design & Development",
                                                                        "Corporate Mobile App Development",
                                                                        "Enterprise Software Consulting",
                                                                        "Custom Enterprise Software",
                                                                        "Enterprise POS Systems",
                                                                        "Scalable Corporate E-commerce",
                                                                        "Enterprise ERP Systems",
                                                                        "Corporate LMS Solutions",
                                                                        "Tailored Big Business Software",
                                                                        "Enterprise E-learning Platforms"
                                                                  ],
                                                                  autoStart: true,
                                                                  loop: true,
                                                            }}
                                                      />
                                                </p>
                                          </div>
                                          <h2 className="font-sans text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl sm:leading-none max-w-lg mb-6">
                                                Envisioning the {" "}
                                                <span className="inline-block text-red-600">FUTURE,</span>
                                                <br className="" />
                                                Building the {""}
                                                <span className="inline-block text-[#F2D354]">SOFTWARE.</span>
                                          </h2>
                                          <p className="text-gray-300 text-base md:text-lg">We are a top software and IT solutions company in Bangladesh, delivering custom ERP, LMS, POS, CRM, and mobile/web apps tailored to your business needs.

                                          </p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                          <button
                                                className="group flex items-center justify-between gap-4  border border-[#0A65B4] bg-[#0A65B4] px-8 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                                onClick={() => set_schedule(!schedule)}
                                          >
                                                <span
                                                      className="font-medium text-[10px] md:text-xs lg:text-sm text-white transition-colors group-hover:text-[#0A65B4] group-active:text-[#0A65B4]"
                                                >
                                                      Book an Appointment
                                                </span>


                                          </button>

                                          {/* Border */}

                                          <Link
                                                className="group flex items-center justify-between gap-4  border border-current px-8 py-3 text-[#0A65B4] transition-colors hover:bg-[#0A65B4] focus:outline-none focus:ring active:bg-[#0A65B4]"
                                                to='/all_project'
                                          >
                                                <span className="font-medium text-[10px] md:text-xs lg:text-sm transition-colors group-hover:text-white">
                                                      Our  Portfolio
                                                </span>


                                          </Link>
                                    </div>
                              </div>
                              <div className="flex items-center justify-center lg:w-1/2">
                                    <Lottie className='lg:w-10/12' animationData={homeVc} loop={true} />
                              </div>
                        </div>

                  </div>
                  {
                        schedule && (
                              <CallSchedule isModalOpen={schedule} setModalOpen={set_schedule} />
                        )
                  }
            </div>
      );
};

export default HeadSection;
