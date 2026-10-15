import { useEffect, useState } from 'react';
import { 
      HiShieldCheck, 
      HiCpuChip, 
      HiRocketLaunch, 
      HiArrowPathRoundedSquare, 
      HiCalendarDays, 
      HiChevronDown 
} from "react-icons/hi2";
import ui from '../../../Assctes/vectors/ui.gif';
import web from '../../../Assctes/vectors/web.gif';
import app from '../../../Assctes/vectors/app.gif';
import it_consulting from '../../../Assctes/vectors/IT Consulting.gif';
import custom_software_development from '../../../Assctes/vectors/Custom Software Development.gif';
import data_analytics from '../../../Assctes/vectors/animated Data Analytics.gif';
import DevOps from '../../../Assctes/vectors/DevOps.gif';
import support from '../../../Assctes/vectors/Support And Maintenance.gif';
import e_commerce from '../../../Assctes/vectors/E-commerce.gif';
import erp from '../../../Assctes/vectors/ERP Systems.gif';
import legacy from '../../../Assctes/vectors/Legacy System Modernization.gif';
import crm from '../../../Assctes/vectors/CRM.gif';

import ServiceCart from '../../ServiceCart/ServiceCart';
import Contact from '../../Contact/Contact/Contact';
import moduleName from '../../../Assctes/logo.png';
import { CallSchedule } from '../../../pages/shared/Header/Header';

const ServicePage = () => {
      const [activeCategory, setActiveCategory] = useState("all");
      const [schedule, setSchedule] = useState(false);
      const [openFaqIndex, setOpenFaqIndex] = useState(0);

      const serviceInfo = [
            {
                  id: 'ui-ux-design',
                  name: "UI/UX Design",
                  category: "Design & Strategy",
                  group: "design",
                  pic: ui,
                  description: "Human-centric interface design, design systems, and rapid clickable prototyping in Figma that turn complex user flows into intuitive digital products.",
                  highlights: [
                        "Figma Component Systems & Tokens",
                        "Interactive High-Fidelity Prototypes",
                        "Accessibility (WCAG 2.1 AA) Compliance"
                  ]
            },
            {
                  id: 'web-development',
                  name: "Web Development",
                  category: "Web & Mobile",
                  group: "web-mobile",
                  pic: web,
                  description: "High-performance, SEO-optimized web applications and scalable enterprise portals engineered with React, Next.js, TypeScript, and robust microservices.",
                  highlights: [
                        "Next.js Server-Side Rendering (SSR)",
                        "Micro-Frontend & REST/GraphQL APIs",
                        "Sub-second Core Web Vitals Performance"
                  ]
            },
            {
                  id: 'app-development',
                  name: "App Development",
                  category: "Web & Mobile",
                  group: "web-mobile",
                  pic: app,
                  description: "Native and cross-platform iOS and Android applications built with Flutter and React Native delivering fluid 60fps performance and offline-first persistence.",
                  highlights: [
                        "Cross-Platform Flutter & React Native",
                        "App Store & Google Play Deployment",
                        "Offline Sync & Biometric Authentication"
                  ]
            },
            {
                  id: 'custom-software-development',
                  name: "Custom Software Development",
                  category: "Enterprise & Cloud",
                  group: "enterprise",
                  pic: custom_software_development,
                  description: "Purpose-built enterprise platforms, automated business workflows, and distributed backend systems tailored precisely to your company's operational model.",
                  highlights: [
                        "Domain-Driven Modular Architecture",
                        "High-Concurrency Distributed Engines",
                        "Enterprise RBAC & Audit Trails"
                  ]
            },
            {
                  id: 'it-consulting',
                  name: "IT Consulting",
                  category: "Design & Strategy",
                  group: "design",
                  pic: it_consulting,
                  description: "Strategic technology roadmap consulting, cloud architecture audits, cybersecurity governance, and digital transformation roadmaps for ambitious leadership teams.",
                  highlights: [
                        "Cloud Architecture & Cost Optimization",
                        "Cybersecurity & Compliance Roadmaps",
                        "Tech Stack Modernization Advisory"
                  ]
            },
            {
                  id: 'data-analytics',
                  name: "Data Analytics & BI",
                  category: "Data & Automation",
                  group: "data",
                  pic: data_analytics,
                  description: "Actionable business intelligence, executive dashboards, predictive modeling, and automated data pipelines that transform raw operational logs into decisions.",
                  highlights: [
                        "Real-Time Executive BI Dashboards",
                        "Automated ETL / ELT Pipelines",
                        "Predictive Analytics & Metric Tracking"
                  ]
            },
            {
                  id: 'devops-ci-cd',
                  name: "DevOps and CI/CD",
                  category: "Enterprise & Cloud",
                  group: "enterprise",
                  pic: DevOps,
                  description: "Automated deployment pipelines, Docker containerization, Kubernetes orchestration, and cloud infrastructure as code (IaC) for zero-downtime releases.",
                  highlights: [
                        "Zero-Downtime Blue/Green Deployments",
                        "Infrastructure as Code (Terraform)",
                        "24/7 APM & Log Monitoring Alerting"
                  ]
            },
            {
                  id: 'support-maintenance',
                  name: "Support And Maintenance",
                  category: "Enterprise & Cloud",
                  group: "enterprise",
                  pic: support,
                  description: "Proactive 24/7 system monitoring, SLA-backed bug resolution, continuous security patching, and database optimization ensuring uninterrupted operations.",
                  highlights: [
                        "Guaranteed Response SLA Support",
                        "Security Patching & Vulnerability Scans",
                        "Continuous Database & Query Tuning"
                  ]
            },
            {
                  id: 'e-commerce-solutions',
                  name: "E-commerce Solutions",
                  category: "Web & Mobile",
                  group: "web-mobile",
                  pic: e_commerce,
                  description: "High-converting digital storefronts, custom headless checkouts, ERP inventory synchronization, and multi-currency global payment gateway integrations.",
                  highlights: [
                        "Headless Commerce & Custom Catalogs",
                        "Global Multi-Gateway Payment Checkout",
                        "Inventory & Warehouse Synchronization"
                  ]
            },
            {
                  id: 'erp-systems',
                  name: "ERP Systems",
                  category: "Enterprise & Cloud",
                  group: "enterprise",
                  pic: erp,
                  description: "Centralized enterprise resource planning covering multi-warehouse inventory, double-entry financial accounting, supply chain logistics, and HR payroll.",
                  highlights: [
                        "Multi-Branch Financial Accounting",
                        "Automated Inventory & Supply Chain",
                        "Integrated HRMS & Payroll Modules"
                  ]
            },
            {
                  id: 'legacy-system-modernization',
                  name: "Legacy System Modernization",
                  category: "Data & Automation",
                  group: "data",
                  pic: legacy,
                  description: "Systematic transformation of outdated monolithic codebases into cloud-native microservices with zero operational downtime and total data integrity.",
                  highlights: [
                        "Monolith to Microservices Migration",
                        "Zero-Downtime Database Migration",
                        "Cloud-Native Performance Acceleration"
                  ]
            },
            {
                  id: 'crm-solutions',
                  name: "CRM Solutions",
                  category: "Data & Automation",
                  group: "data",
                  pic: crm,
                  description: "Bespoke customer relationship platforms featuring automated lead routing, omni-channel communication, pipeline forecasting, and client portals.",
                  highlights: [
                        "Automated Lead Scoring & Pipeline",
                        "Omni-Channel Customer Conversations",
                        "Custom Customer & Partner Portals"
                  ]
            }
      ];

      const categories = [
            { id: "all", label: "All Engineering Services" },
            { id: "web-mobile", label: "Web & Mobile" },
            { id: "enterprise", label: "Enterprise & Cloud" },
            { id: "data", label: "Data & Modernization" },
            { id: "design", label: "Product & Strategy" }
      ];

      const filteredServices = activeCategory === "all" 
            ? serviceInfo 
            : serviceInfo.filter(s => s.group === activeCategory);

      const faqs = [
            {
                  question: "How do you scope and estimate software development projects?",
                  answer: "We begin with a thorough technical discovery session to analyze your requirements, architectural constraints, and business goals. We then provide a transparent statement of work (SOW) with milestone breakdown, time-and-materials or fixed-scope sprint estimates, and clear deliverable timelines."
            },
            {
                  question: "Can we hire a dedicated engineering squad or individual specialists?",
                  answer: "Yes. Bright Future Soft offers flexible engagement models: full cross-functional scrum teams (product manager, UX designer, backend/frontend engineers, QA), dedicated staff augmentation to accelerate existing squads, or end-to-end turn-key project delivery."
            },
            {
                  question: "Who retains ownership of the source code and intellectual property?",
                  answer: "You do. 100% of all code, git repositories, architectural diagrams, design tokens, database schemas, and intellectual property developed during our engagement are strictly owned by you from day one under our comprehensive master services agreement."
            },
            {
                  question: "How do you ensure enterprise code quality and security?",
                  answer: "We adhere strictly to CI/CD automation, SonarQube static code analysis, peer code reviews for every pull request, OWASP Top 10 security standards, automated unit and integration tests, and rigorous staging environment verification before any production deployment."
            },
            {
                  question: "What happens after our software is deployed to production?",
                  answer: "We provide comprehensive post-launch warranty support, knowledge transfer sessions, and customizable SLA maintenance packages including 24/7 uptime monitoring, critical bug hotfixes, infrastructure scaling, and regular feature iteration sprints."
            }
      ];

      useEffect(() => {
            window.scrollTo(0, 0);

            // Document Title
            document.title = "Software Engineering & IT Services | Bright Future Soft";

            const metaDescriptionContent = "Explore Bright Future Soft's engineering services: Custom Software, Web & Mobile App Development, Enterprise ERP, CRM, DevOps, Data Analytics, and UI/UX Design with 100% IP ownership.";
            const metaKeywordsContent = "Software Development Services, Enterprise ERP Systems, Mobile App Development, Web Development, UI/UX Design, DevOps CI/CD, IT Consulting, Custom Software, Bright Future Soft";

            // Meta Description
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                  metaDesc = document.createElement("meta");
                  metaDesc.name = "description";
                  document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", metaDescriptionContent);

            // Meta Keywords
            let metaKeywords = document.querySelector("meta[name='keywords']");
            if (!metaKeywords) {
                  metaKeywords = document.createElement("meta");
                  metaKeywords.name = "keywords";
                  document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute("content", metaKeywordsContent);

            // OG Title
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                  ogTitle = document.createElement("meta");
                  ogTitle.setAttribute("property", "og:title");
                  document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute("content", "Software Engineering & IT Services | Bright Future Soft");

            // OG Description
            let ogDesc = document.querySelector("meta[property='og:description']");
            if (!ogDesc) {
                  ogDesc = document.createElement("meta");
                  ogDesc.setAttribute("property", "og:description");
                  document.head.appendChild(ogDesc);
            }
            ogDesc.setAttribute("content", metaDescriptionContent);

            // OG Image
            let ogImage = document.querySelector("meta[property='og:image']");
            if (!ogImage) {
                  ogImage = document.createElement("meta");
                  ogImage.setAttribute("property", "og:image");
                  document.head.appendChild(ogImage);
            }
            ogImage.setAttribute("content", moduleName);

            // Canonical
            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                  canonical = document.createElement("link");
                  canonical.setAttribute("rel", "canonical");
                  document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", window.location.href);

            // JSON-LD Structured Data for Schema.org ItemList and Services
            const schemaData = {
                  "@context": "https://schema.org",
                  "@graph": [
                        {
                              "@type": "WebPage",
                              "@id": window.location.href,
                              "url": window.location.href,
                              "name": "Software Engineering & IT Services | Bright Future Soft",
                              "description": metaDescriptionContent,
                              "isPartOf": {
                                    "@type": "WebSite",
                                    "name": "Bright Future Soft",
                                    "url": "https://brightfuturesoft.com"
                              }
                        },
                        {
                              "@type": "ItemList",
                              "name": "Bright Future Soft Professional Services",
                              "itemListElement": serviceInfo.map((s, index) => ({
                                    "@type": "ListItem",
                                    "position": index + 1,
                                    "item": {
                                          "@type": "Service",
                                          "name": s.name,
                                          "description": s.description,
                                          "url": `https://brightfuturesoft.com/service/${s.id}`,
                                          "provider": {
                                                "@type": "Organization",
                                                "name": "Bright Future Soft",
                                                "url": "https://brightfuturesoft.com"
                                          }
                                    }
                              }))
                        }
                  ]
            };

            let scriptTag = document.getElementById("services-schema-jsonld");
            if (!scriptTag) {
                  scriptTag = document.createElement("script");
                  scriptTag.id = "services-schema-jsonld";
                  scriptTag.type = "application/ld+json";
                  document.head.appendChild(scriptTag);
            }
            scriptTag.text = JSON.stringify(schemaData);

            return () => {
                  const tag = document.getElementById("services-schema-jsonld");
                  if (tag) tag.remove();
            };
      }, []);

      return (
            <main className="services-page mx-4 md:mx-0">
                  {/* Hero Section */}
                  <header className="lg:py-16 py-8" aria-label="Software Engineering Services Hero Section">
                        <div className="mx-auto max-w-7xl pt-24 text-center">
                              <span className="site-eyebrow">Enterprise Engineering & Solutions</span>
                              <h1 className="services-hero-title">
                                    Software Engineering Services <br /> Built for <span>High Growth</span>
                              </h1>
                              <p className="services-hero-subtitle">
                                    From modern web platforms and fluid mobile apps to mission-critical ERPs and cloud architectures, Bright Future Soft builds dependable digital software with predictable sprint velocity and 100% IP ownership.
                              </p>

                              {/* Trust Metrics Strip */}
                              <div className="services-trust-strip" aria-label="Key delivery metrics">
                                    <div className="services-trust-pill">
                                          <span className="services-trust-dot" aria-hidden="true" />
                                          <span>100% Client IP Ownership</span>
                                    </div>
                                    {/* <div className="services-trust-pill">
                                          <span className="services-trust-dot" aria-hidden="true" />
                                          <span>2-Week Agile Sprint Cadence</span>
                                    </div> */}
                                    <div className="services-trust-pill">
                                          <span className="services-trust-dot" aria-hidden="true" />
                                          <span>SLA-Backed 24/7 Support</span>
                                    </div>
                                    <div className="services-trust-pill">
                                          <span className="services-trust-dot" aria-hidden="true" />
                                          <span>ISO & SOC2 Aligned Standards</span>
                                    </div>
                              </div>
                        </div>
                  </header>

                  {/* Filter Navigation */}
                  <nav className=" max-w-7xl mx-auto" aria-label="Service category filters">
                        <div className="services-filter-bar">
                              {categories.map(cat => (
                                    <button
                                          key={cat.id}
                                          type="button"
                                          onClick={() => setActiveCategory(cat.id)}
                                          className={`service-filter-btn ${activeCategory === cat.id ? "active" : ""}`}
                                    >
                                          {cat.label}
                                    </button>
                              ))}
                        </div>
                  </nav>

                  {/* Services Grid */}
                  <section className="max-w-7xl mx-auto mt-12" aria-labelledby="all-services-heading">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e1e9f2]">
                              <div>
                                    <h2 id="all-services-heading" className="text-2xl font-bold text-[#142235]">
                                          {activeCategory === "all" ? "Core Engineering Capabilities" : categories.find(c => c.id === activeCategory)?.label}
                                    </h2>
                                    <p className="text-sm text-[#55667c] mt-1">
                                          Showing {filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} tailored for production grade reliability
                                    </p>
                              </div>
                              <span className="text-xs font-semibold text-[#0a65b4] mt-2 sm:mt-0">
                                    Envisioning the FUTURE, Building the SOFTWARE.
                              </span>
                        </div>

                        <div className="services-grid">
                              {filteredServices.map(data => (
                                    <ServiceCart key={data.id} data={data} />
                              ))}
                        </div>
                  </section>

                  {/* Enterprise Delivery Guarantees */}
                  <section className="max-w-7xl mx-auto py-12" aria-labelledby="guarantees-heading">
                        <div className="">
                              <div className="text-center max-w-2xl mx-auto">
                                    <span className="site-eyebrow">Why Bright Future Soft</span>
                                    <h2 id="guarantees-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-3">
                                          Engineering Principles We Guarantee
                                    </h2>
                                    <p className="text-sm sm:text-base text-[#55667c] mt-2">
                                          We bridge the gap between creative product ideation and enterprise software architecture with rigorous engineering disciplines.
                                    </p>
                              </div>

                              <div className="services-guarantee-grid">
                                    <div className="services-guarantee-card">
                                          <div className="services-guarantee-icon" aria-hidden="true">
                                                <HiRocketLaunch />
                                          </div>
                                          <h4>Predictable Agile Cadence</h4>
                                          <p>Bi-weekly sprints, tangible working software demos, and daily standups keep you completely informed of progress.</p>
                                    </div>

                                    <div className="services-guarantee-card">
                                          <div className="services-guarantee-icon" aria-hidden="true">
                                                <HiShieldCheck />
                                          </div>
                                          <h4>Total IP & Code Ownership</h4>
                                          <p>All source code, Docker configs, documentation, and intellectual property belong 100% to your organization.</p>
                                    </div>

                                    <div className="services-guarantee-card">
                                          <div className="services-guarantee-icon" aria-hidden="true">
                                                <HiCpuChip />
                                          </div>
                                          <h4>Production-Grade Quality</h4>
                                          <p>Automated CI/CD pipelines, comprehensive unit/integration test coverage, and strict code review guard every release.</p>
                                    </div>

                                    <div className="services-guarantee-card">
                                          <div className="services-guarantee-icon" aria-hidden="true">
                                                <HiArrowPathRoundedSquare />
                                          </div>
                                          <h4>Seamless Scalability</h4>
                                          <p>Engineered with modular architectures and cloud infrastructure designed to support hundreds of thousands of concurrent users.</p>
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Frequently Asked Questions */}
                  <section className="service-section-wrap" aria-labelledby="faq-heading">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                              <span className="site-eyebrow">Clarifications & Process</span>
                              <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-[#142235] mt-3">
                                    Frequently Asked Service Questions
                              </h2>
                              <p className="text-sm sm:text-base text-[#55667c] mt-2">
                                    Everything you need to know about partnering with our software engineering teams.
                              </p>
                        </div>

                        <div className="service-faq-container">
                              {faqs.map((faq, index) => {
                                    const isOpen = openFaqIndex === index;
                                    return (
                                          <div key={index} className={`service-faq-item ${isOpen ? "is-open" : ""}`}>
                                                <button
                                                      type="button"
                                                      className="service-faq-btn"
                                                      onClick={(e) => {
                                                            e.preventDefault();
                                                            setOpenFaqIndex(isOpen ? null : index);
                                                      }}
                                                      aria-expanded={isOpen}
                                                >
                                                      <span>{faq.question}</span>
                                                      <span className="service-faq-icon" aria-hidden="true">
                                                            <HiChevronDown />
                                                      </span>
                                                </button>
                                                {isOpen && (
                                                      <div className="service-faq-answer">
                                                            <p>{faq.answer}</p>
                                                      </div>
                                                )}
                                          </div>
                                    );
                              })}
                        </div>

                        {/* Consultation Strip */}
                        <div className="service-consultation-strip">
                              <h3>Ready to discuss your software project?</h3>
                              <p>
                                    Schedule a 30-minute discovery call with our senior engineering architects. We will evaluate your technical requirements and outline a concrete execution roadmap.
                              </p>
                              <button
                                    type="button"
                                    onClick={() => setSchedule(true)}
                                    className="service-consultation-btn"
                              >
                                    <HiCalendarDays className="text-xl" aria-hidden="true" />
                                    <span>Schedule Technical Consultation</span>
                              </button>
                        </div>
                  </section>

                  {/* Contact Section Component */}
                  <Contact />

                  {/* Consultation Booking Modal */}
                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </main>
      );
};

export default ServicePage;
