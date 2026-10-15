import React, { useState } from "react";
import logo from "../../../Assctes/logo.png";
import { Link } from "react-router-dom";
import { BsFacebook, BsLinkedin, BsTwitter, BsWhatsapp } from "react-icons/bs";
import { 
      HiArrowSmallRight, 
      HiArrowUpRight, 
      HiOutlineEnvelope, 
      HiOutlinePhone, 
      HiOutlineMapPin 
} from "react-icons/hi2";
import { CallSchedule } from "../Header/Header";

const Footer = () => {
      const [schedule, setSchedule] = useState(false);

      return (
            <footer className="site-footer px-4 sm:px-6 lg:px-8" aria-labelledby="footer-heading">
                  <h2 id="footer-heading" className="sr-only">Footer</h2>
                  <div className="mx-auto max-w-7xl ">
                        {/* Pre-Footer Action Banner */}
                        <div className="footer-cta-card">
                              <div className="footer-cta-content">
                                    <span className="footer-cta-eyebrow">Ready to collaborate?</span>
                                    <h3 className="footer-cta-title">
                                          Have an enterprise system or ambitious product to build?
                                    </h3>
                                    <p className="footer-cta-desc">
                                          Partner with our engineering team to design, build, and deploy production-grade software that scales with your business.
                                    </p>
                              </div>
                              <div className="footer-cta-actions">
                                    <button
                                          type="button"
                                          className="footer-primary-btn group !py-3"
                                          onClick={() => setSchedule(true)}
                                    >
                                          <span>Book a consultation</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                    <Link to="/contacts" className="footer-secondary-btn group !py-3">
                                          <span>Contact our team</span>
                                          <HiArrowUpRight className="text-base transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                                    </Link>
                              </div>
                        </div>

                        {/* 5-Column Navigation Grid */}
                        <div className="footer-nav-grid">
                              {/* Col 1: Brand Anchor */}
                              <div className="footer-brand-col">
                                    <Link to="/" aria-label="Bright Future Soft Home" className="inline-flex">
                                          <img loading="lazy" src={logo} alt="Bright Future Soft" className="w-36 h-auto" />
                                    </Link>
                                    <p className="footer-tagline">
                                          Envisioning the <span className="footer-accent">FUTURE</span>,<br />
                                          Building the <span className="footer-accent">SOFTWARE</span>.
                                    </p>
                                    <p className="footer-mission-text">
                                          Premier software engineering company delivering custom enterprise ERPs, cloud platforms, mobile apps, and intelligent automation.
                                    </p>
                                    <div className="footer-social-row" aria-label="Social media">
                                          <a href="https://www.facebook.com/brightfuturesoft/" target="_blank" rel="noreferrer" aria-label="Bright Future Soft on Facebook" className="footer-social-link">
                                                <BsFacebook />
                                          </a>
                                          <a href="https://www.linkedin.com/company/brightfuturesoft/" target="_blank" rel="noreferrer" aria-label="Bright Future Soft on LinkedIn" className="footer-social-link">
                                                <BsLinkedin />
                                          </a>
                                          <a href="https://x.com/brightfuturebd" target="_blank" rel="noreferrer" aria-label="Bright Future Soft on X" className="footer-social-link">
                                                <BsTwitter />
                                          </a>
                                          <a href="https://wa.link/w7hsiz" target="_blank" rel="noreferrer" aria-label="Chat with Bright Future Soft on WhatsApp" className="footer-social-link">
                                                <BsWhatsapp />
                                          </a>
                                    </div>
                                    <div className="goodfirm-widget mt-4" data-widget-type="goodfirms-widget-t8" data-widget-pattern="poweredby-star" data-height="60" data-company-id="134938" />
                              </div>

                              {/* Col 2: Engineering & Services */}
                              <div className="footer-links-col">
                                    <h4 className="footer-col-heading">Engineering &amp; Services</h4>
                                    <ul className="footer-links-list">
                                          <li><Link to="/service/custom-software-development">Enterprise ERP &amp; CRM</Link></li>
                                          <li><Link to="/service/web-development">Cloud SaaS &amp; Web Apps</Link></li>
                                          <li><Link to="/service/app-development">Mobile App Development</Link></li>
                                          <li><Link to="/service/e-commerce-solutions">Scalable E-Commerce</Link></li>
                                          <li><Link to="/service/crm-solutions">CRM &amp; Workflow Systems</Link></li>
                                          <li><Link to="/service">View All Capabilities →</Link></li>
                                    </ul>
                              </div>

                              {/* Col 3: Products & Work */}
                              <div className="footer-links-col">
                                    <h4 className="footer-col-heading">Products &amp; Work</h4>
                                    <ul className="footer-links-list">
                                          <li><Link to="/project/bright_erp">Bright ERP Suite</Link></li>
                                          <li><Link to="/project/bright_restaurant_pos">Smart Restaurant POS</Link></li>
                                          <li><Link to="/project/bright_lms__transforming_learning_experiences">Bright LMS Platform</Link></li>
                                          <li><Link to="/all_project">Featured Case Studies</Link></li>
                                          <li><Link to="/technology">Technology Stack</Link></li>
                                    </ul>
                              </div>

                              {/* Col 4: Company & Culture */}
                              <div className="footer-links-col">
                                    <h4 className="footer-col-heading">Company &amp; Culture</h4>
                                    <ul className="footer-links-list">
                                          <li><Link to="/about">About Us</Link></li>
                                          <li><Link to="/company-profile">Company Profile (PDF)</Link></li>
                                          <li><Link to="/review">Client Testimonials</Link></li>
                                          <li><Link to="/careers">Careers &amp; Openings</Link></li>
                                          <li><Link to="/blog">Insights &amp; Engineering Blog</Link></li>
                                          <li><Link to="/contacts">Contact &amp; Support</Link></li>
                                    </ul>
                              </div>

                              {/* Col 5: Headquarters & Contact */}
                              <div className="footer-contact-col">
                                    <h4 className="footer-col-heading">Headquarters &amp; Reach</h4>
                                    <div className="footer-contact-items">
                                          <div className="footer-contact-item">
                                                <HiOutlineMapPin className="footer-contact-icon" aria-hidden="true" />
                                                <div>
                                                      <strong>Corporate Office</strong>
                                                      <span>Dhaka, Bangladesh</span>
                                                </div>
                                          </div>
                                          <div className="footer-contact-item">
                                                <HiOutlineEnvelope className="footer-contact-icon" aria-hidden="true" />
                                                <div>
                                                      <strong>Direct Email</strong>
                                                      <a href="mailto:info@brightfuturesoft.com">info@brightfuturesoft.com</a>
                                                </div>
                                          </div>
                                          <div className="footer-contact-item">
                                                <HiOutlinePhone className="footer-contact-icon" aria-hidden="true" />
                                                <div>
                                                      <strong>Direct Phone &amp; WhatsApp</strong>
                                                      <a href="tel:+8801792205520">+880 1792-205520</a>
                                                </div>
                                          </div>
                                          <div className="footer-operating-hours">
                                                <span className="footer-status-indicator" aria-hidden="true" />
                                                <span>Hours: Mon – Sat (9:00 AM – 7:00 PM BST)</span>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Bottom Copyright & Legal Strip */}
                        <div className="footer-bottom-strip">
                              <div className="footer-copyright">
                                    © {new Date().getFullYear()} Bright Future Soft. All rights reserved.
                              </div>
                              <div className="footer-legal-links">
                                    <Link to="/trams-and-conditions">Terms &amp; Conditions</Link>
                                    <span aria-hidden="true">&bull;</span>
                                    <Link to="/policy">Privacy &amp; ISMS Policy</Link>
                                    <span aria-hidden="true">&bull;</span>
                                    <Link to="/compliance">SOC &amp; ISO Standards Compliant</Link>
                              </div>
                              <div className="footer-systems-status">
                                    <span className="footer-status-dot" aria-hidden="true" />
                                    <span>All Systems Operational</span>
                              </div>
                        </div>
                  </div>

                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </footer>
      );
};

export default Footer;
