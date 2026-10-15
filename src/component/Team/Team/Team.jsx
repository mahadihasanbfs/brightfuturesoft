
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


import { AiFillLinkedin } from "react-icons/ai";
import { Link } from "react-router-dom";
import { base_url } from "../../../layout/Title";
import { useQuery } from "@tanstack/react-query";
// import { SwiperSlide } from 'swiper/react';

const Team = () => {

     const { data: teamMembers = [], isLoading } = useQuery({
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

      return (
            <section className="team-bg team-section px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="team-heading">
                  <div className="mx-auto max-w-7xl">
                        <div className="section-heading-row">
                              <div><span className="site-eyebrow">Meet the people behind the work</span><h2 id="team-heading">Thoughtful people.<br /><span>Reliable partners.</span></h2></div>
                              <p>Our team brings product thinking, design, and engineering together to help clients make meaningful progress.</p>
                        </div>

                        {teamMembers.length > 0 ? <Swiper
                              modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                              pagination={{ clickable: true }}
                              autoplay={{
                                    delay: 3200,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                              }}
                              speed={500}
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
                                          <SwiperSlide key={tData.id} className="cursor-grab">
                                                <div className="team-slide-wrap">
                                                      <article className="team-card">
                                                            <img className="team-photo" src={tData?.image} alt={tData?.name || 'Team member'} loading="lazy" />
                                                            <div className="team-member-copy">
                                                                  <h3>{tData?.name}</h3>
                                                                  <p>{tData.possition ?? tData.designation}</p>
                                                                  {tData.linkedin && <a href={tData.linkedin} target="_blank" rel="noreferrer" aria-label={`${tData?.name} on LinkedIn`}><AiFillLinkedin aria-hidden="true" /> <span>Connect on LinkedIn</span></a>}
                                                            </div>
                                                      </article>
                                                </div>
                                          </SwiperSlide>)
                              }

                        </Swiper> : (
                              <div className="team-empty-state">
                                    <span className="site-eyebrow">{isLoading ? 'Loading our team' : 'Get to know our team'}</span>
                                    <h3>{isLoading ? 'Meet the people behind your next project.' : 'A hands-on team, ready to help.'}</h3>
                                    <p>{isLoading ? 'Our team profiles are on their way.' : 'Talk with us about your goals and we’ll bring the right people into the conversation.'}</p>
                                    {!isLoading && <Link to="/contacts" className="site-outline-button">Talk with our team <span aria-hidden="true">↗</span></Link>}
                              </div>
                        )}
                  </div>


            </section>
      );
};

export default Team;
