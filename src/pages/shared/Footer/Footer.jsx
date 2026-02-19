import React from 'react';
import logo from '../../../Assctes/logo.png'
import { Link } from 'react-router-dom';
import { BsFacebook, BsLinkedin, BsTwitter, BsWhatsapp } from 'react-icons/bs';
const Footer = () => {
      return (
            <div className="bg-orange-400 w-full footer-bg">
                  <div className="px-1 py-10 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-20 lg:px-8 md:w-[80%] w-[95%]">
                        <div className="grid md:grid-cols-3 justify-center gap-2">
                              <div className="flex md:block flex-col items-center md:col-span-1 col-span-3">
                                    <Link to={'/'}> <img loading="lazy" src={logo} alt="" className="w-[120px] md:mx-0 mx-auto" /></Link>
                                    <p className="mt-4 ml-1 text-sm md:text-left text-center text-[gray]">
                                          Envisioning the <span className='text-red-500'>FUTURE</span>,
                                          <br />
                                          Building the <span className='text-yellow-300'>SOFTWARE</span>.
                                    </p>
                                    <div className='flex md:flex-col md:items-start md:gap-1 items-center gap-2  mt-2  ml-1 text-sm md:text-left text-center text-blue-500'>
                                          <Link to={"/terms-and-conditions"}>Terms and conditions</Link>
                                          <Link to={"/policy"}>Privacy & Policies</Link>
                                    </div>
                                    <div className="goodfirm-widget" data-widget-type="goodfirms-widget-t8" data-widget-pattern="poweredby-star" data-height="60" data-company-id="134938"></div>
                              </div>
                              <div className="col-span-2">
                                    <div className="grid md:grid-cols-3 grid-cols-2 gap-2 cols-3">
                                          <div className="">
                                                <h2 className="text-white font-semibold md:text-left text-center md:mt-0 mt-4">Social media</h2>
                                                <ul className="mt-3">
                                                      <li>
                                                            <Link to="https://www.facebook.com/brightfuturesoft/" className="text-blue-500 flex items-center md:justify-start justify-center gap-2">
                                                                  <BsFacebook className='text-xl' /> Facebook
                                                            </Link>
                                                      </li>
                                                      <li className='mt-3'>
                                                            <Link to="https://www.linkedin.com/company/brightfuturesoft/" className="text-blue-500 flex items-center md:justify-start justify-center gap-2">
                                                                  <BsLinkedin className='text-xl' /> LinkedIn
                                                            </Link>
                                                      </li>
                                                      <li className='mt-3'>
                                                            <Link to="https://x.com/brightfuturebd" className="text-blue-400 flex items-center md:justify-start justify-center gap-2">
                                                                  <img className='w-6 rounded-full' src="https://images.seeklogo.com/logo-png/49/1/twitter-x-logo-png_seeklogo-492394.png" alt="" /> X
                                                            </Link>
                                                      </li>
                                                      <li className='mt-3'>
                                                            <Link to="https://wa.link/w7hsiz" className="text-green-400 flex items-center md:justify-start justify-center gap-2">
                                                                  <BsWhatsapp className='text-xl' /> Whatsapp
                                                            </Link>
                                                      </li>
                                                </ul>
                                          </div>
                                          <div className="">
                                                <h2 className="text-white font-semibold md:text-left text-center md:mt-0 mt-4">Our Services</h2>
                                                <ul className="">
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to='/service/web-development' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500 ">Web Apps</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to='/service/e-commerce-solutions' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">ECommerce</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to='/service/app-development' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Mobile Apps</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to='/service/crm-solutions' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">CRM Solutions</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to='/service/custom-software-development' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Software Development</Link>
                                                      </li>
                                                </ul>

                                          </div>
                                          <div className="md:block hidden">
                                                <h2 className="text-white font-semibold md:text-left text-center md:mt-0 mt-4">Our Product</h2>
                                                <ul className="">
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to={'/project/bright_erp'} className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Bright Erp</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to={'/project/bright_restaurant_pos'} className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">POS</Link>
                                                      </li>
                                                      <li className='mt-3 md:text-left text-center'>
                                                            <Link to={'/project/bright_lms__transforming_learning_experiences'} className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Bright LMS</Link>
                                                      </li>
                                                      {/* <li className='mt-3 md:text-left text-center'>
                                                  <Link to='' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Resume Builder</Link>
                                             </li>
                                             <li className='mt-3 md:text-left text-center'>
                                                  <Link to='' className="text-[#00bfff]  hover:border-b-2 hover:border-blue-500">Portfolio Builder</Link>
                                             </li> */}

                                                </ul>
                                          </div>


                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default Footer;
