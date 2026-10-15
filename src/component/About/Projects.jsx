import React from 'react';

export const OurProjects = () => {
      return (
            <section className="about-achieve-section px-4 sm:px-6 lg:px-8" aria-labelledby="about-achievements-title">
                  <div className="mx-auto max-w-7xl">
                        <div className="about-section-header">
                              <span className="site-eyebrow">Proven Track Record</span>
                              <h2 id="about-achievements-title" className="about-section-title">
                                    Engineered for enterprise scale <br className="hidden sm:inline" />
                                    <span>and verified business results.</span>
                              </h2>
                              <p className="about-section-subtitle">
                                    Since our founding in January 2023, we have turned complex technical challenges into dependable software systems that empower teams and accelerate growth.
                              </p>
                        </div>

                        <div className="about-achieve-banner">
                              <div className="about-achieve-grid">
                                    <div className="about-achieve-item">
                                          <div className="about-achieve-val">50+</div>
                                          <div className="about-achieve-title">Production Deployments</div>
                                          <div className="about-achieve-desc">Enterprise ERPs, high-traffic SaaS products, and native mobile apps.</div>
                                    </div>

                                    <div className="about-achieve-item">
                                          <div className="about-achieve-val">99.8%</div>
                                          <div className="about-achieve-title">System Uptime &amp; SLA</div>
                                          <div className="about-achieve-desc">Fault-tolerant cloud architectures built for zero downtime operations.</div>
                                    </div>

                                    <div className="about-achieve-item">
                                          <div className="about-achieve-val">12+</div>
                                          <div className="about-achieve-title">Industry Verticals</div>
                                          <div className="about-achieve-desc">Retail, Healthcare, FinTech, Logistics, EdTech, and SaaS operations.</div>
                                    </div>

                                    <div className="about-achieve-item">
                                          <div className="about-achieve-val">100%</div>
                                          <div className="about-achieve-title">IP &amp; Code Ownership</div>
                                          <div className="about-achieve-desc">Full repository, intellectual property, and documentation transfer.</div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      );
};

export default OurProjects;