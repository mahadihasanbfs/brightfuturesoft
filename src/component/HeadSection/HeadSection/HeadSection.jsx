import React, { useState, useRef } from 'react';
import { 
      HiArrowSmallRight, 
      HiArrowUpRight, 
      HiCheck, 
      HiBuildingOffice2, 
      HiGlobeAlt, 
      HiDevicePhoneMobile, 
      HiCpuChip,
      HiPlay,
      HiPause
} from "react-icons/hi2";
import { CallSchedule } from '../../../pages/shared/Header/Header';
import headerPoster from '../../../Assctes/backgrounds/header.png';

// High-speed CDN video streams (Software engineering, programming code & enterprise tech matrix)
const HERO_VIDEO_URL = "https://www.pexels.com/download/video/8348321/";
const HERO_FALLBACK_VIDEO_URL = "https://www.pexels.com/download/video/8348321/";

const capabilities = [
      {
            num: '01',
            icon: HiBuildingOffice2,
            tag: 'Operations & Scale',
            title: 'Enterprise ERP & CRM',
            description: 'Custom multi-branch operations, real-time inventory synchronization, and automated billing workflows.',
      },
      {
            num: '02',
            icon: HiGlobeAlt,
            tag: 'Cloud Scalability',
            title: 'Web Platforms & SaaS',
            description: 'High-traffic React & Node systems engineered for sub-second API performance and cloud scalability.',
      },
      {
            num: '03',
            icon: HiDevicePhoneMobile,
            tag: 'Flutter & Native',
            title: 'iOS & Android Apps',
            description: 'Cross-platform Flutter and native applications engineered for 60fps responsiveness and offline sync.',
      },
      {
            num: '04',
            icon: HiCpuChip,
            tag: 'Intelligent Workflows',
            title: 'AI & Automation',
            description: 'Intelligent document parsing, real-time data pipelines, and custom AI agents that eliminate manual work.',
      },
];

const HeadSection = () => {
      const [schedule, set_schedule] = useState(false);
      const [isPlaying, setIsPlaying] = useState(true);
      const videoRef = useRef(null);

      const toggleVideo = () => {
            if (!videoRef.current) return;
            if (videoRef.current.paused) {
                  videoRef.current.play();
                  setIsPlaying(true);
            } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
            }
      };

      return (
            <section
                  aria-labelledby="home-hero-title"
                  className="relative w-full overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32 px-4 sm:px-6 lg:px-8 bg-white"
            >
                  {/* Background Video Layer */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
                        <video
                              ref={videoRef}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              poster={headerPoster}
                              controlsList="nodownload"
                              disablePictureInPicture
                              className="w-full h-full object-cover object-center opacity-40"
                        >
                              <source src={HERO_VIDEO_URL} type="video/mp4" />
                              <source src={HERO_FALLBACK_VIDEO_URL} type="video/mp4" />
                        </video>
                        {/* Soft Brand Gradient & Decorative Texture Overlay for Crisp Text Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#f7faff]/80 to-white/95" />
                        <div 
                              className="absolute inset-0 opacity-30 pointer-events-none"
                              style={{
                                    backgroundImage: `linear-gradient(rgb(10 44 77 / 2.5%) 1px, transparent 1px), linear-gradient(90deg, rgb(10 44 77 / 2.5%) 1px, transparent 1px)`,
                                    backgroundSize: '84px 84px'
                              }}
                        />
                  </div>

                  {/* Accessible Background Video Control */}
                  <button
                        type="button"
                        onClick={toggleVideo}
                        className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/85 hover:bg-white text-slate-600 hover:text-[#0a65b4] text-[11px] font-medium border border-slate-200 shadow-xs transition-all backdrop-blur-xs"
                        aria-label={isPlaying ? "Pause background video" : "Play background video"}
                        title={isPlaying ? "Pause background video" : "Play background video"}
                  >
                        {isPlaying ? (
                              <>
                                    <HiPause className="text-xs text-[#0a65b4]" />
                                    <span className="hidden sm:inline">Pause video</span>
                              </>
                        ) : (
                              <>
                                    <HiPlay className="text-xs text-[#0a65b4]" />
                                    <span className="hidden sm:inline">Play video</span>
                              </>
                        )}
                  </button>

                  <div className="relative z-10 mx-auto w-full max-w-7xl">
                        {/* Top Centered Editorial Header */}
                        <div className="hero-container mx-auto flex flex-col items-center text-center">
                              {/* Status Eyebrow Badge */}
                              <div className="hero-status-pill">
                                    <span className="hero-status-pulse" aria-hidden="true" />
                                    <span>Enterprise Software Engineering</span>
                              </div>

                              {/* Hero Title */}
                              <h1 id="home-hero-title" className="hero-main-title">
                                    Envisioning the <span>FUTURE</span>,<br className="hidden sm:inline" />{" "}
                                    Building the <span>SOFTWARE</span>.
                              </h1>

                              {/* Hero Description */}
                              <p className="hero-description">
                                    Bright Future Soft is a software engineering company in Bangladesh. We design and deliver custom enterprise ERP systems, scalable cloud platforms, mobile applications, and intelligent automation built for reliability and business growth.
                              </p>

                              {/* Direct Conversion Actions */}
                              <div className="hero-actions">
                                    <button
                                          type="button"
                                          className="hero-primary-btn group"
                                          onClick={() => set_schedule(true)}
                                    >
                                          <span>Book an appointment</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                    <a
                                          className="hero-secondary-btn group"
                                          href="/company-profile.pdf"
                                          target="_blank"
                                          rel="noreferrer"
                                    >
                                          <span>Company profile</span>
                                          <HiArrowUpRight className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                    </a>
                              </div>

                              {/* Trust Reassurance Line */}
                              <div className="hero-trust-bar">
                                    <span className="hero-trust-item">
                                          <HiCheck className="hero-check-svg" aria-hidden="true" />
                                          <span>Predictable Agile Delivery</span>
                                    </span>
                                    <span className="hero-trust-item">
                                          <HiCheck className="hero-check-svg" aria-hidden="true" />
                                          <span>100% Code &amp; IP Ownership</span>
                                    </span>
                                    <span className="hero-trust-item">
                                          <HiCheck className="hero-check-svg" aria-hidden="true" />
                                          <span>SLA-Backed Support</span>
                                    </span>
                              </div>
                        </div>

                        {/* Engineering Capability Showcase Grid */}
                        <div className="hero-grid-showcase">
                              {capabilities.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                          <div key={item.num} className="hero-showcase-card group">
                                                <div className="hero-card-top">
                                                      <span className="hero-card-icon-box">
                                                            <IconComponent className="text-lg" aria-hidden="true" />
                                                      </span>
                                                      {/* <span className="hero-card-tag">{item.tag}</span> */}
                                                </div>
                                                <h3 className="hero-card-title">{item.title}</h3>
                                                <p className="hero-card-desc">{item.description}</p>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>

                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={set_schedule} />
                  )}
            </section>
      );
};

export default HeadSection;
