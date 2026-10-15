import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base_url } from "../../../layout/Title";
import { CallSchedule } from "../../../pages/shared/Header/Header";
import { HiChevronDown, HiArrowSmallRight } from "react-icons/hi2";

const FaqItem = ({ question, answer, isOpen, onToggle, id }) => {
      return (
            <div className={`about-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                        type="button"
                        id={`faq-btn-${id}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${id}`}
                        className="about-faq-btn"
                        onClick={onToggle}
                  >
                        <span>{question}</span>
                        <div className="about-faq-toggle-icon" aria-hidden="true">
                              <HiChevronDown />
                        </div>
                  </button>
                  {isOpen && (
                        <div
                              id={`faq-answer-${id}`}
                              role="region"
                              aria-labelledby={`faq-btn-${id}`}
                              className="about-faq-body"
                        >
                              <p>{answer}</p>
                        </div>
                  )}
            </div>
      );
};

export const Faq = () => {
      const [openIndex, setOpenIndex] = useState(0);
      const [schedule, setSchedule] = useState(false);

      const { data: teamMembers = [] } = useQuery({
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

      const faqs = [
            {
                  question: "What software engineering services does Bright Future Soft specialize in?",
                  answer: "We engineer custom enterprise ERP & CRM systems, high-traffic SaaS web platforms, cross-platform mobile apps (Flutter, iOS, Android), and AI-powered workflow automation. We manage the entire lifecycle from architectural planning and UI/UX design through automated testing, cloud deployment, and long-term maintenance."
            },
            {
                  question: "Where is your team located, and how do you collaborate with global clients?",
                  answer: "Our engineering headquarters is located in Dhaka, Bangladesh. We work with clients across North America, Europe, Australia, and Asia. We align our sprint ceremonies, standups, and bi-weekly demos with your local timezone, using Slack, Jira, and Google Meet for transparent daily communication."
            },
            {
                  question: "Do clients retain 100% intellectual property (IP) and source code ownership?",
                  answer: "Yes, absolutely. All custom software, database schemas, UI designs, and documentation developed for your project are 100% your intellectual property. Upon delivery, we transfer complete source code repositories and deployment access with zero proprietary licensing lock-ins."
            },
            {
                  question: "What is your typical project delivery timeline and sprint model?",
                  answer: "We operate in structured 2-week agile sprints. A focused MVP or cloud prototype typically launches in 4 to 8 weeks, while full-scale enterprise ERP or multi-branch platforms generally range from 3 to 6 months. Every sprint ends with an interactive demo so you test working software continuously."
            },
            {
                  question: "Do you provide ongoing SLA support and post-launch maintenance?",
                  answer: "Yes. We offer SLA-backed technical maintenance and evolution packages. Our engineers handle 24/7 server monitoring, performance tuning, proactive security patching, database backups, and scheduled sprint hours for iterative feature enhancements."
            },
            {
                  question: "How do we get started with Bright Future Soft on a new project?",
                  answer: "Getting started is straightforward. Book an initial 30-minute discovery call through our appointment scheduler or submit your project details via our contact page. We will review your goals, execute an NDA, and provide a clear architectural roadmap and estimate within 48 hours."
            }
      ];

      return (
            <section className="about-faq-section px-4 sm:px-6 lg:px-8" aria-labelledby="about-faq-title">
                  <div className="mx-auto max-w-7xl">
                        <div className="about-section-header">
                              <span className="site-eyebrow">Clear Answers</span>
                              <h2 id="about-faq-title" className="about-section-title">
                                    Frequently asked questions <br className="hidden sm:inline" />
                                    <span>about working with us.</span>
                              </h2>
                              <p className="about-section-subtitle">
                                    Everything you need to know about our engineering approach, team engagement, intellectual property, and delivery standards.
                              </p>
                        </div>

                        <div className="about-faq-container">
                              <div className="about-faq-list">
                                    {faqs.map((faq, idx) => (
                                          <FaqItem
                                                key={idx}
                                                id={idx}
                                                question={faq.question}
                                                answer={faq.answer}
                                                isOpen={openIndex === idx}
                                                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                          />
                                    ))}
                              </div>

                              <div className="about-faq-cta">
                                    <div className="flex items-center justify-center -space-x-2">
                                          {teamMembers.slice(0, 3).map((member) => (
                                                <img
                                                      key={member._id}
                                                      className="relative inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                      src={member.image}
                                                      alt={member.name || "Engineering team member"}
                                                      loading="lazy"
                                                />
                                          ))}
                                          {teamMembers.length > 3 && (
                                                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0a65b4] text-xs font-semibold text-white ring-2 ring-white">
                                                      +{teamMembers.length - 3}
                                                </div>
                                          )}
                                    </div>

                                    <h3>Have a custom project or architecture question?</h3>
                                    <p>
                                          Speak directly with our engineering leaders to explore feasibility, system architecture, and project timelines.
                                    </p>

                                    <div className="about-faq-cta-actions">
                                          {/* <button
                                                type="button"
                                                onClick={() => setSchedule(true)}
                                                className="hero-primary"
                                          >
                                                Schedule a consultation
                                          </button> */}

                                           <button
                                          type="button"
                                          className="hero-primary-btn group"
                                           onClick={() => setSchedule(true)}
                                    >
                                          <span>Book an appointment</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                          <Link to="/contacts" className="site-outline-button">
                                                Send us a message <span aria-hidden="true">→</span>
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </div>

                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </section>
      );
};

export default Faq;
