
// import "swiper/swiper-bundle.min.css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
import doob from '../../../Assctes/Company/doob.png';
import hikmah from '../../../Assctes/Company/hikmahlogo.png';
import sea from '../../../Assctes/Company/sealogo.png';
import ai from '../../../Assctes/Company/aiexpertcareer_logo.jpeg';
import fc from '../../../Assctes/Company/fcwin4.png';
import onyx from '../../../Assctes/Company/onyx-hospitality.png';

// A11y, Autoplay

// import Swiper from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';
import 'swiper/css/autoplay';

import { MdFormatQuote } from "react-icons/md";

const Testimonials = () => {


      const testimonials = [
            {
                  id: 0,
                  img: doob,
                  name: "Doob",
                  companyName: "Doob",
                  comments: 'Bright Future Soft Soft expertly designed and developed our website. Their professionalism, attention to detail, and commitment to quality were outstanding. We are extremely satisfied with the final product and enjoyed the seamless collaboration throughout the project.',
                  title: "CEO and Founder",
            },
            {
                  id: 1,
                  img: hikmah,
                  name: "Hikmah Holdings LTD.",
                  companyName: "Hikmah Holdings LTD.",
                  comments: 'The team at Bright Future Soft Soft designed and developed our product with excellence. Their dedication to meeting our needs and delivering high-quality work exceeded our expectations. We are very pleased with the results and highly recommend their services.',
                  title: "BUZZMAKER",
            },
            {
                  id: 2,
                  img: sea,
                  name: "Sea Property LTD.",
                  companyName: "Sea Property LTD.",
                  comments: 'We are delighted with the website design and development provided by Bright Future Soft Soft. Their team was professional, responsive, and delivered exactly what we envisioned. The project was completed on time and within budget, and we are very happy with the outcome.',
                  title: "BUZZMAKER",
            },
            {
                  id: 3, // Corrected duplicate id
                  img: ai,
                  name: "AI Carrier Expert",
                  companyName: "AI Carrier Expert",
                  comments: 'Bright Future Soft Soft provided exceptional design services for our project. Their ability to understand our requirements and deliver a high-quality product was impressive. We appreciate their hard work, professional approach, and are extremely satisfied with the final result.',
                  title: "CGL Consulting Co",
            },
            {
                  id: 4,
                  img: fc,
                  name: "FC Win 4",
                  companyName: "FC Win 4",
                  comments: 'Working with Bright Future Soft was a smooth and rewarding experience. Their team demonstrated strong technical expertise and delivered our project on time with excellent attention to detail. We highly recommend their services for any organization seeking reliable and innovative software solutions.',
                  title: "CTO",
            },
            {
                  id: 5,
                  img: onyx,
                  name: "ONYX Hospitality",
                  companyName: "ONYX Hospitality",
                  comments: 'Bright Future Soft provided exceptional design services for our project. Their ability to understand our requirements and deliver a high-quality product was impressive. We appreciate their hard work, professional approach, and are extremely satisfied with the final result.',
                  title: "Project Manager",
            }

      ];



      return (
            <section className='testimonial-bg testimonial-section px-4 py-20 sm:px-6 lg:px-8 lg:py-24' aria-labelledby="testimonials-heading">
                  <div className="mx-auto max-w-7xl">
                        <div className="section-heading-row">
                              <div><span className="site-eyebrow">Client stories</span><h2 id="testimonials-heading">Good work speaks<br /><span>through our clients.</span></h2></div>
                              <p>We value the trust our clients place in us and the relationships we build along the way.</p>
                        </div>

                        <Swiper className="cursor-grab"
                              modules={[Navigation, Pagination, Scrollbar, Autoplay, A11y]}
                              pagination={{ clickable: true }}
                              autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                              }}
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
                                          slidesPerView: 1,
                                          spaceBetween: 40,
                                    },
                                    1024: {
                                          slidesPerView: 3,
                                          spaceBetween: 50,
                                    },
                              }}
                              spaceBetween={50}
                              onSlideChange={() => { }}
                              onSwiper={(swiper) => { }}>

                              {
                                    testimonials.map(testimonialData =>
                                          <SwiperSlide key={testimonialData.id} className="">
                                                <div className="testimonial-slide-wrap">
                                                      <article className="testimonial-card">
                                                            <div className="testimonial-card-top"><img loading="lazy" src={testimonialData.img} alt={`${testimonialData.companyName} logo`} /><span className="testimonial-quote-mark"><MdFormatQuote aria-hidden="true" /></span></div>
                                                            <p className="testimonial-quote">“{testimonialData?.comments.replace(/Bright Future Soft Soft/g, 'Bright Future Soft')}”</p>
                                                            <div className="testimonial-attribution"><strong>{testimonialData.companyName}</strong><span>{testimonialData.title}</span></div>
                                                      </article>
                                                </div>
                                          </SwiperSlide>)
                              }

                        </Swiper>
                  </div>
            </section>
      );
};

export default Testimonials;
