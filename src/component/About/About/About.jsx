import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';
import 'swiper/css/autoplay';

import { RxLinkedinLogo } from "react-icons/rx";
import { HiArrowSmallRight, HiCheck } from "react-icons/hi2";

import Testimonials from '../../Testimonials/Testimonials/Testimonials';
import Contact from '../../Contact/Contact/Contact';
import { base_url } from '../../../layout/Title';
import { Faq } from './Faq';
import { OurProjects } from '../Projects';
import logo from '../../../Assctes/logo.png';
import { CallSchedule } from '../../../pages/shared/Header/Header';

const About = () => {
      const [schedule, setSchedule] = useState(false);

      const { data: teamMembers = [], isLoading: isTeamLoading } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  });
                  const { data } = await res.json();
                  return data
                        .filter(user => user.slot != null)
                        .sort((a, b) => {
                              if (a.slot === b.slot) {
                                    return a.name.localeCompare(b.name);
                              }
                              return Number(a.slot) - Number(b.slot);
                        });
            },
      });

      useEffect(() => {
            window.scrollTo(0, 0);
      }, []);

      useEffect(() => {
            if (!teamMembers.length) return;

            const teamNames = teamMembers.map(m => m.name).join(", ");

            document.title =
                  "About Us | Bright Future Soft - Software Engineering Company";

            const description =
                  `Bright Future Soft is a software engineering company based in Dhaka, Bangladesh, founded in January 2023. Our team includes ${teamNames}. We architect and build enterprise ERPs, cloud SaaS platforms, mobile applications, and intelligent automation.`;

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

            // Schema.org Structured Data
            const orgSchema = {
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "Bright Future Soft",
                  "url": window.location.origin,
                  "logo": logo,
                  "foundingDate": "2023-01",
                  "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Dhaka",
                        "addressCountry": "Bangladesh"
                  },
                  "sameAs": [
                        "https://www.linkedin.com/company/brightfuturesoft"
                  ]
            };

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

      const coreValues = [
            {
                  num: '01',
                  title: 'Craftsmanship over Shortcuts',
                  desc: 'We engineer clean, modular, and thoroughly tested code that solves real business problems. We refuse to accumulate technical debt for the sake of quick hacks.'
            },
            {
                  num: '02',
                  title: 'Radical Transparency',
                  desc: 'From sprint velocity and code reviews to budget tracking, we operate with complete openness. You always know what is being built, when, and why.'
            },
            {
                  num: '03',
                  title: 'Deep Client Empathy',
                  desc: 'We take the time to understand your operational model, end-user pain points, and business metrics before writing a single line of architecture.'
            },
            {
                  num: '04',
                  title: 'Relentless Innovation',
                  desc: 'Technology never stands still, and neither do we. We continually adopt modern cloud architectures, modern DevOps, and AI workflow automation.'
            }
      ];

      const deliveryProcess = [
            {
                  step: 'Phase 01',
                  name: 'Discovery & System Architecture',
                  desc: 'Technical scoping workshops, database schema modeling, user journeys, scalability analysis, and milestone roadmapping.'
            },
            {
                  step: 'Phase 02',
                  name: 'UI/UX & Interactive Prototyping',
                  desc: 'High-fidelity Figma wireframes, reusable component tokens, user flow validation, and interactive design prototypes.'
            },
            {
                  step: 'Phase 03',
                  name: 'Agile Sprints & Continuous CI/CD',
                  desc: '2-week iterative development cycles, comprehensive automated tests, bi-weekly demos, and staging environment updates.'
            },
            {
                  step: 'Phase 04',
                  name: 'Hardening, Launch & SLA Support',
                  desc: 'Load testing, security auditing, zero-downtime deployment, and SLA-backed ongoing monitoring and evolution.'
            }
      ];

      return (
            <div className="about-page-container mx-4 md:mx-0">
                  {/* Hero Section: Asymmetric Editorial Split */}
                  <section
                        aria-labelledby="about-hero-title"
                        className="about-hero-section "
                  >
                        <div className="mx-auto max-w-7xl">
                              <div className="about-hero-grid">
                                    {/* Left Column: Narrative & Philosophy */}
                                    <div className="about-hero-content">
                                          <div className="about-origin-badge">
                                                <span className="about-origin-dot" aria-hidden="true" />
                                                Who We Are • Est. January 2023
                                          </div>

                                          <h1 id="about-hero-title" className="about-hero-title">
                                                Architecting resilient software <br className="hidden sm:inline" />
                                                <span>for organizations that never stop growing.</span>
                                          </h1>

                                          <div className="about-tagline-quote">
                                                <p className="about-tagline-quote-text">
                                                      Envisioning the <span>FUTURE</span>,
                                                      <br />
                                                       Building the <span>SOFTWARE</span>.
                                                </p>
                                                <span className="about-tagline-quote-sub">
                                                      — Bright Future Soft 
                                                </span>
                                          </div>

                                          <p className="about-hero-desc">
                                                Bright Future Soft is an engineering-first technology studio based in Dhaka, Bangladesh. We bridge high-level business strategy with rigorous, fault-tolerant execution designing custom enterprise ERPs, cloud platforms, mobile apps, and workflow automations that scale cleanly as your business grows.
                                          </p>

                                          <div className="about-trust-row">
                                                <div className="about-trust-pill">
                                                       Dhaka, Bangladesh Hub
                                                </div>
                                                <div className="about-trust-pill">
                                                  2 Week Agile Sprints
                                                </div>
                                                <div className="about-trust-pill">
                                                      100% IP &amp; Code Ownership
                                                </div>
                                          </div>

                                          <div className="about-hero-actions">
                                                {/* <button
                                                      type="button"
                                                      onClick={() => setSchedule(true)}
                                                      className="hero-primary group inline-flex items-center gap-3"
                                                >
                                                      Schedule a consultation
                                                      <HiArrowSmallRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                                </button> */}

                                                 <button
                                                                                          type="button"
                                                                                          className="hero-primary-btn group"
                                                                                          onClick={() => setSchedule(true)}
                                                                                    >
                                                                                          <span>Book an appointment</span>
                                                                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                                                                    </button>
                                                <a
                                                      className="site-outline-button"
                                                      href="/company-profile.pdf"
                                                      target="_blank"
                                                      rel="noreferrer"
                                                >
                                                      Company profile <span aria-hidden="true">↗</span>
                                                </a>
                                          </div>
                                    </div>

                                    {/* Right Column: Engineering Studio Dossier Snapshot */}
                                    <aside aria-label="Company snapshot" className="about-dossier-card">
                                          <div className="about-dossier-header">
                                                <span className="about-dossier-label">Company Dossier</span>
                                               
                                          </div>

                                          <div className="about-dossier-list">
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">Headquarters</span>
                                                      <span className="about-dossier-val">Dhaka, Bangladesh</span>
                                                </div>
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">Established</span>
                                                      <span className="about-dossier-val">January 2023</span>
                                                </div>
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">Core Specialization</span>
                                                      <span className="about-dossier-val">Enterprise ERP, SaaS &amp; AI</span>
                                                </div>
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">Delivery Cadence</span>
                                                      <span className="about-dossier-val">2-Week Iterative Sprints</span>
                                                </div>
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">Track Record</span>
                                                      <span className="about-dossier-val"><strong>50+ Deployments</strong> (99.8% SLA)</span>
                                                </div>
                                                <div className="about-dossier-row">
                                                      <span className="about-dossier-key">IP Ownership</span>
                                                      <span className="about-dossier-val"><strong>100% Client Transferred</strong></span>
                                                </div>
                                          </div>

                                          <div className="about-dossier-footer">
                                                <p className="about-dossier-quote">
                                                      “We don't build software to sell billable hours. We architect systems that eliminate operational bottlenecks and create enduring equity.”
                                                </p>
                                                <span className="about-dossier-author">
                                                      — Bright Future Soft Engineering Leadership
                                                </span>
                                          </div>
                                    </aside>
                              </div>

                              {/* Stat Strip */}
                              <div className="about-stat-strip">
                                    <div className="about-stat-card">
                                          <div className="about-stat-num">2023</div>
                                          <div className="about-stat-label">Founded in Dhaka</div>
                                          <div className="about-stat-sub">Engineering headquarters</div>
                                    </div>
                                    <div className="about-stat-card">
                                          <div className="about-stat-num">50+</div>
                                          <div className="about-stat-label">Production Deployments</div>
                                          <div className="about-stat-sub">Enterprise ERPs &amp; SaaS</div>
                                    </div>
                                    <div className="about-stat-card">
                                          <div className="about-stat-num">100%</div>
                                          <div className="about-stat-label">IP &amp; Code Ownership</div>
                                          <div className="about-stat-sub">Zero proprietary lock-in</div>
                                    </div>
                                    <div className="about-stat-card">
                                          <div className="about-stat-num">99.8%</div>
                                          <div className="about-stat-label">On-Time Delivery</div>
                                          <div className="about-stat-sub">Predictable 2-week sprints</div>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Mission & Vision Section */}
                  <section
                        aria-labelledby="about-mv-heading"
                        className="about-mv-section px-4 sm:px-6 lg:px-8"
                  >
                        <div className="mx-auto max-w-7xl">
                              <div className="about-section-header">
                                    <span className="site-eyebrow">Purpose &amp; Direction</span>
                                    <h2 id="about-mv-heading" className="about-section-title">
                                          Engineering with purpose. <br className="hidden sm:inline" />
                                          <span>Driven by a clear vision.</span>
                                    </h2>
                                    <p className="about-section-subtitle">
                                          Our mission anchors every architectural decision we make today, while our vision guides how we elevate our clients and industry into the future.
                                    </p>
                              </div>

                              <div className="about-mv-grid">
                                    {/* Mission Card */}
                                    <article className="about-mv-card">
                                          <div className="about-mv-badge">Our Mission</div>
                                          <h3 className="about-mv-heading">
                                                Empowering enterprises through engineering excellence.
                                          </h3>
                                          <p className="about-mv-copy">
                                                To design and deliver resilient, scalable, and human-centric software solutions that eliminate operational bottlenecks, automate manual friction, and unlock lasting competitive advantage for our partners.
                                          </p>

                                          <ul className="about-mv-pillars">
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>Architectural Resilience</strong>
                                                            <span>Fault-tolerant system design engineered for high concurrency, zero downtime, and long-term maintainability.</span>
                                                      </div>
                                                </li>
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>100% Client Ownership</strong>
                                                            <span>Complete intellectual property, clean Git repositories, and transparent documentation transferred to you.</span>
                                                      </div>
                                                </li>
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>Long-Term SLA Partnership</strong>
                                                            <span>Dependable post-deployment maintenance, proactive security monitoring, and continuous system evolution.</span>
                                                      </div>
                                                </li>
                                          </ul>
                                    </article>

                                    {/* Vision Card */}
                                    <article className="about-mv-card">
                                          <div className="about-mv-badge">Our Vision</div>
                                          <h3 className="about-mv-heading">
                                                Becoming the global benchmark for software craftsmanship.
                                          </h3>
                                          <p className="about-mv-copy">
                                                To establish Bright Future Soft as Bangladesh's premier software engineering partner on the global stage, recognized worldwide for architectural brilliance, transparent collaboration, and transformative digital platforms.
                                          </p>

                                          <ul className="about-mv-pillars">
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>Global Innovation Footprint</strong>
                                                            <span>Delivering international-grade engineering solutions from Dhaka to enterprises across North America, Europe, and Asia.</span>
                                                      </div>
                                                </li>
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>Intelligent Automation</strong>
                                                            <span>Empowering knowledge workers by replacing tedious manual processes with intelligent workflows and AI agents.</span>
                                                      </div>
                                                </li>
                                                <li className="about-mv-pillar-item">
                                                      <div className="about-mv-pillar-icon" aria-hidden="true"><HiCheck /></div>
                                                      <div className="about-mv-pillar-text">
                                                            <strong>Sustainable Tech Culture</strong>
                                                            <span>Investing in top-tier engineering talent, fostering continuous learning, and championing ethical software practices.</span>
                                                      </div>
                                                </li>
                                          </ul>
                                    </article>
                              </div>
                        </div>
                  </section>

                  {/* Core Values Section */}
                  <section
                        aria-labelledby="about-values-heading"
                        className="about-values-section px-4 sm:px-6 lg:px-8"
                  >
                        <div className="mx-auto max-w-7xl">
                              <div className="about-section-header">
                                    <span className="site-eyebrow">How We Think &amp; Work</span>
                                    <h2 id="about-values-heading" className="about-section-title">
                                          The core principles <br className="hidden sm:inline" />
                                          <span>behind every sprint.</span>
                                    </h2>
                                    <p className="about-section-subtitle">
                                          These four values guide our technical choices, our team collaboration, and our long-term client partnerships.
                                    </p>
                              </div>

                              <div className="about-values-grid">
                                    {coreValues.map((val) => (
                                          <div key={val.num} className="about-value-card">
                                                <span className="about-value-num">{val.num}</span>
                                                <h3 className="about-value-title">{val.title}</h3>
                                                <p className="about-value-desc">{val.desc}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* Engineering Process / Lifecycle */}
                  <section
                        aria-labelledby="about-process-heading"
                        className="about-process-section px-4 sm:px-6 lg:px-8"
                  >
                        <div className="mx-auto max-w-7xl">
                              <div className="about-section-header">
                                    <span className="site-eyebrow">Our Delivery Framework</span>
                                    <h2 id="about-process-heading" className="about-section-title">
                                          Predictable, transparent, <br className="hidden sm:inline" />
                                          <span>and engineered to ship.</span>
                                    </h2>
                                    <p className="about-section-subtitle">
                                          We combine structured sprint cadences with technical rigor to ensure continuous visibility, zero surprises, and on-time delivery.
                                    </p>
                              </div>

                              <div className="about-process-grid">
                                    {deliveryProcess.map((proc, index) => (
                                          <div key={index} className="about-process-card">
                                                <div className="about-process-step">{proc.step}</div>
                                                <h3 className="about-process-name">{proc.name}</h3>
                                                <p className="about-process-desc">{proc.desc}</p>
                                          </div>
                                    ))}
                              </div>
                        </div>
                  </section>

                  {/* Achievements & Track Record */}
                  <OurProjects />

                  {/* Team Section */}
                  <section className="team-section px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="about-team-heading">
                        <div className="mx-auto max-w-7xl">
                              <div className="section-heading-row">
                                    <div>
                                          <span className="site-eyebrow">Meet the people behind the work</span>
                                          <h2 id="about-team-heading">
                                                Thoughtful engineers. <br />
                                                <span>Reliable partners.</span>
                                          </h2>
                                    </div>
                                    <p>Our multidisciplinary team brings product strategy, architectural rigor, and engineering craftsmanship together to solve complex challenges.</p>
                              </div>

                              {teamMembers.length > 0 ? (
                                    <Swiper
                                          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                                          pagination={{ clickable: true }}
                                          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                                          speed={500}
                                          breakpoints={{
                                                320: { slidesPerView: 1, spaceBetween: 20 },
                                                480: { slidesPerView: 1, spaceBetween: 20 },
                                                640: { slidesPerView: 2, spaceBetween: 24 },
                                                768: { slidesPerView: 2, spaceBetween: 32 },
                                                1024: { slidesPerView: 4, spaceBetween: 36 },
                                          }}
                                          spaceBetween={36}
                                          slidesPerView={4}
                                    >
                                          {teamMembers.map(tData => (
                                                <SwiperSlide key={tData._id} className="cursor-grab">
                                                      <div className="team-slide-wrap">
                                                            <article className="team-card">
                                                                  <img
                                                                        className="team-photo"
                                                                        src={tData?.image}
                                                                        alt={tData?.name || 'Team member'}
                                                                        loading="lazy"
                                                                  />
                                                                  <div className="team-member-copy">
                                                                        <h3>{tData?.name}</h3>
                                                                        <p>{tData.possition ?? tData.designation}</p>
                                                                        {tData.linkedin && (
                                                                              <a
                                                                                    href={tData.linkedin}
                                                                                    target="_blank"
                                                                                    rel="noreferrer"
                                                                                    aria-label={`${tData?.name} on LinkedIn`}
                                                                              >
                                                                                    <RxLinkedinLogo aria-hidden="true" />
                                                                                    <span>Connect on LinkedIn</span>
                                                                              </a>
                                                                        )}
                                                                  </div>
                                                            </article>
                                                      </div>
                                                </SwiperSlide>
                                          ))}
                                    </Swiper>
                              ) : (
                                    <div className="team-empty-state">
                                          <span className="site-eyebrow">{isTeamLoading ? 'Loading our team' : 'Get to know our team'}</span>
                                          <h3>{isTeamLoading ? 'Meet the people behind your next project.' : 'A hands-on team, ready to help.'}</h3>
                                          <p>{isTeamLoading ? 'Our team profiles are on their way.' : 'Talk with us about your goals and we’ll bring the right people into the conversation.'}</p>
                                          {!isTeamLoading && (
                                                <Link to="/contacts" className="site-outline-button">
                                                      Talk with our team <span aria-hidden="true">↗</span>
                                                </Link>
                                          )}
                                    </div>
                              )}
                        </div>
                  </section>

                  {/* Frequently Asked Questions */}
                  <Faq />

                  {/* Testimonials & Contact */}
                  <Testimonials />
                  <Contact />

                  {/* Appointment Modal */}
                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </div>
      );
};

export default About;
