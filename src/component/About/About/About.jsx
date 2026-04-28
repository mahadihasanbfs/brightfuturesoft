import React, { useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// import Swiper from 'swiper';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';
import 'swiper/css/autoplay';

import { RxLinkedinLogo } from "react-icons/rx";



import Service from '../../Service/Service/Service';
import Testimonials from '../../Testimonials/Testimonials/Testimonials';
import Contact from '../../Contact/Contact/Contact';
import { base_url } from '../../../layout/Title';


import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import homeVc from '../../../Assctes/vectors/App Development.json';
import { Faq } from './Faq';
import { OurProjects } from '../Projects';
import MetaTitle from '../../../layout/Title';
import logo from '../../../Assctes/logo.png';
import { useQuery } from '@tanstack/react-query';
// import { SwiperSlide } from 'swiper/react';

const About = () => {


   const { data: teamMembers = [] } = useQuery({
  queryKey: ["all_users"],
  queryFn: async () => {
    const res = await fetch(`${base_url}/auth/all`, {
      headers: {
        "content-type": "application/json",
        author: "bright_future_soft",
      },
    })
    const { data } = await res.json()
       return data
  .filter(user => user.slot != null)
  .sort((a, b) => {
    if (a.slot === b.slot) {
      return a.name.localeCompare(b.name) // duplicate hole name diye sort
    }
    return Number(a.slot) - Number(b.slot)
  })
  },
})

useEffect(() => {
      if (!teamMembers.length) return;

      window.scrollTo(0, 0);

      const teamNames = teamMembers.map(m => m.name).join(", ");

      document.title =
            "Bright Future Soft | About Us | Software Company in Bangladesh";

      const description =
            `Bright Future Soft is a leading software company in Bangladesh. Our expert team includes ${teamNames}. We specialize in ERP, SaaS, CRM, AI and custom software development.`;

      // Meta Description
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);

      // 🔥 Organization Schema
      const orgSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bright Future Soft",
            "url": window.location.origin,
            "logo": logo,
            "sameAs": [
                  "https://www.linkedin.com/company/brightfuturesoft"
            ]
      };

      // 🔥 Person Schema for all team members
      const personSchema = teamMembers.map(member => ({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": member.name,
            "jobTitle": member.designation ?? member.possition,
            "image": member.image,
            "email": member.email,
            "worksFor": {
                  "@type": "Organization",
                  "name": "Bright Future Soft"
            },
            "sameAs": member.linkedin ? [member.linkedin] : []
      }));

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify([orgSchema, ...personSchema]);

      document.head.appendChild(script);

      return () => {
            document.head.removeChild(script);
      };

}, [teamMembers]);


      useEffect(() => {
            window.scrollTo(0, 0);
      }, []); useEffect(() => {
            window.scrollTo(0, 0);
      }, [])

      return (
            <div className='py-4 bg-[#020A1C] p-2 about-bg'>
                 
                  <div className="head px-2 sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[85%] w-[98%] mx-auto rounded-lg ">
                        <div className="md:grid grid-cols-2 md:pt-0 pt-16  mt-2">
                              <div className="flex items-center">
                                    <div className="">
                                          <h1 className='text-xl text-[#3f98fd] font-[400] md:text-left text-center'>Software Company </h1>
                                          <h1 className="md:text-5xl text-[35px] text-white font-[700] md:text-left text-center">The <span className="text-[orange]">Bright Future Soft</span></h1>
                                          <div className="md:hidden flex  justify-end overflow-hidden mt-[-50px]">
                                                <Lottie className="" animationData={homeVc} loop={true} />
                                          </div>
                                          <p className="text-gray-300 md:mt-6 mt-[-50px]">
                                                At Bright Future Soft, we are a leading software company based in Bangladesh, founded in January 2023. We are passionate about harnessing the power of technology to drive positive change and empower individuals and businesses. With our innovative solutions and dedication to excellence, we strive to make a lasting impact in the software industry.
                                          </p>
                                    </div>
                              </div>
                              <div className="flex justify-end">
                                    <div className="md:flex hidden  justify-end overflow-hidden ">
                                          <Lottie className="" animationData={homeVc} loop={true} />
                                    </div>
                              </div>
                        </div>
                        <br />
                  </div>
                  <div className="mt-[10px]  sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[85%] w-[98%] mx-auto rounded-lg">
                        <h1 className="text-xl  font-bold relative after:absolute after:left-0 after:right-0 after:bottom-[-18px] after:w-[60px] after:rounded-full after:h-[6px] after:bg-[#0095ff] after:mx-auto text-center text-white">Our <span className="shadow-tx">Team</span></h1>
                        <Swiper
                              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                              pagination={{ clickable: true }}
                              autoplay={true}
                              breakpoints={{
                                    320: {
                                          slidesPerView: 1,
                                          spaceBetween: 20,
                                    },
                                    360: {
                                          slidesPerView: 1,
                                          spaceBetween: 20,
                                    },
                                    480: {
                                          slidesPerView: 1,
                                          spaceBetween: 20,
                                    },
                                    640: {
                                          slidesPerView: 1,
                                          spaceBetween: 20,
                                    },
                                    768: {
                                          slidesPerView: 2,
                                          spaceBetween: 40,
                                    },
                                    1024: {
                                          slidesPerView: 4,
                                          spaceBetween: 50,
                                    },
                              }}
                              spaceBetween={50}
                              slidesPerView={4}
                              onSlideChange={() => { }}
                              onSwiper={() => { }}>

                              {
                                    teamMembers.map(tData =>
                                          <SwiperSlide key={tData._id} className="cursor-grab">
                                                <div className=" py-[100px] px-2">
                                                      <div className="cart-box  p-2 bg-[#1d1e37bc] border-2 border-[#0059ff69] rounded-xl h-[340px]">
                                                            <div style={{ backgroundImage: `url("${tData.image}")`, backgroundSize: "cover" }} className="cart-header rounded-[20px]   w-[200px] h-[200px] mx-auto mt-[-40px] i-box">
                                                            </div>
                                                            <div className="body pb-4">
                                                                  <h2 className="text-white font-semibold mt-2">{tData.name}</h2>
                                                                  <p className="text-[14px] text-[#1becff] capitalize">{tData.possition ?? tData.designation}</p>
                                                                  <small className='text-gray-300'>{tData?.email}</small>
                                                                  <Link to={tData.linkedin} target="_blank">
                                                                        <RxLinkedinLogo className="text-4xl mt-4 m-auto text-[#1e6dff]" />
                                                                  </Link>
                                                            </div>
                                                      </div>
                                                </div>
                                          </SwiperSlide>)
                              }

                        </Swiper>


                  </div>

                  <br />
                  {/* content */}
                  <Service />
                  <Faq></Faq>
                  <OurProjects></OurProjects>
                  <Testimonials />
                  <Contact />
            </div>
      );
};

export default About;
