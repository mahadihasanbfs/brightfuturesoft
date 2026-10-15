import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Clock, Monitor, HeartHandshake, GraduationCap,
  Award, CalendarDays, Lightbulb, Lock, FileText,
  X, CheckCircle2, ArrowRight, Zap, ChevronRight, Briefcase,
  PiggyBank, Laptop, Scale, AlertTriangle, Mail, Sparkles, Filter
} from "lucide-react";
import MetaTitle, { base_url } from "../../layout/Title";
import JobCard from "./Card";
import News_Letter from "../Testimonials/Testimonials/News_Letter";

const Job = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const policies = [
    {
      id: 1,
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Professional Environment",
      short: "A respectful, safe, and ethical workplace with equal opportunity for all.",
      details: {
        highlights: [
          "Zero Harassment Policy",
          "Equal Opportunity Employer",
          "Professional Ethics Standard",
          "Comprehensive Employee Protection"
        ],
        fullDesc:
          "Bright Future Soft is committed to maintaining a professional, respectful, and inclusive work environment. Discrimination, harassment, bullying, threats, abusive behavior, or any unethical conduct will not be tolerated. Every employee is expected to treat colleagues, clients, and partners with professionalism and respect."
      }
    },
    {
      id: 2,
      icon: <Clock className="w-6 h-6" />,
      title: "Probation & Confirmation",
      short: "Structured 3-month onboarding with dedicated mentorship and feedback.",
      details: {
        highlights: [
          "Structured 3-Month Period",
          "Objective Performance Evaluation",
          "Dedicated Mentorship Support",
          "Transparent Confirmation Review"
        ],
        fullDesc:
          "All newly hired employees undergo a 3-month probation period. During this period, performance, communication, technical skills, reliability, attendance, and overall contribution are evaluated. The company reserves the right to confirm, extend, or adjust employment based on performance and business requirements."
      }
    },
    {
      id: 3,
      icon: <Monitor className="w-6 h-6" />,
      title: "Remote-First Culture",
      short: "Global collaboration, flexible workspace, and team accountability on Discord.",
      details: {
        highlights: [
          "Real-time Discord Collaboration",
          "Structured Core Working Hours",
          "Daily Async Updates & Standups",
          "Transparent Communication"
        ],
        fullDesc:
          "As a remote-first company, employees remain active and reachable on Discord during assigned working hours. Team members participate in sync meetings, respond to communications within a reasonable timeframe, provide regular project updates, and maintain high standards of accountability."
      }
    },
    {
      id: 4,
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "People & Culture",
      short: "Trust, autonomy, peer respect, and genuine work-life balance.",
      details: {
        highlights: [
          "Open & Constructive Dialogue",
          "High Trust & Low Bureaucracy",
          "Supportive Peer Environment",
          "Sustainable Work-Life Harmony"
        ],
        fullDesc:
          "Our culture is built on trust, transparency, accountability, and teamwork. Employees are encouraged to voice ideas, support teammates across disciplines, and take pride in crafting software that makes a real impact."
      }
    },
    {
      id: 5,
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Learning & Growth",
      short: "Continuous upskilling, conference attendance, and technical mastery.",
      details: {
        highlights: [
          "Hands-on Project Architecture",
          "Internal Tech Talks & Brown Bags",
          "Knowledge Sharing Culture",
          "Clear Career Ladder Progression"
        ],
        fullDesc:
          "We invest heavily in the continuous learning of our team members. Employees are supported to deepen their technical mastery, explore cutting-edge AI frameworks and modern cloud tools, and share their knowledge with the wider team."
      }
    },
    {
      id: 6,
      icon: <PiggyBank className="w-6 h-6" />,
      title: "Provident Fund (PF)",
      short: "Long-term financial security with 5% employee + 5% company matching.",
      details: {
        highlights: [
          "5% Monthly Employee Contribution",
          "5% Matching Company Contribution",
          "Structured Long-term Growth",
          "Available for Permanent Staff"
        ],
        fullDesc:
          "Eligible confirmed permanent employees participate in the Bright Future Soft Provident Fund. Employees contribute 5% of their basic salary, matched with an additional 5% by the company, helping each team member build a secure financial foundation."
      }
    },
    {
      id: 7,
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation & Ownership",
      short: "Proactive problem-solving, architectural freedom, and creative thinking.",
      details: {
        highlights: [
          "Extreme Ownership Mindset",
          "Fast-Paced Experimentation",
          "Proactive Solution Finding",
          "Direct Impact on Products"
        ],
        fullDesc:
          "Every engineer and designer is empowered to own their domain end-to-end. We value builders who spot problems early, propose elegant architectures, and drive features from whiteboard concept to production release."
      }
    },
    {
      id: 8,
      icon: <Lock className="w-6 h-6" />,
      title: "Confidentiality & IP",
      short: "Strict enterprise data security, NDA compliance, and code protection.",
      details: {
        highlights: [
          "Client Data Confidentiality",
          "Source Code & Secrets Protection",
          "Enterprise NDA Compliance",
          "Secure Development Practices"
        ],
        fullDesc:
          "All software, source code, designs, architectures, and client data developed during employment are protected with enterprise-grade security. Confidential information is maintained strictly under non-disclosure agreements during and after tenure."
      }
    },
    {
      id: 9,
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Leave & Attendance",
      short: "Fair paid time off, emergency support, and predictable scheduling.",
      details: {
        highlights: [
          "Planned Paid Time Off (PTO)",
          "Compassionate Emergency Leave",
          "Predictable Schedules",
          "Holiday Calendar Observance"
        ],
        fullDesc:
          "We offer comprehensive paid time off, official national holidays, and compassionate leave for unforeseen circumstances. Advance notice helps our distributed teams maintain balance without impacting project delivery."
      }
    }
  ];

  const hiringSteps = [
    {
      number: "01",
      title: "CV & Portfolio Review",
      desc: "Our engineering leads review your experience, code repositories, and past projects to assess alignment."
    },
    {
      number: "02",
      title: "Technical Conversation",
      desc: "A hands-on, practical session focused on real-world system design, clean architecture, and problem solving."
    },
    {
      number: "03",
      title: "Culture & Team Alignment",
      desc: "A friendly discussion with future colleagues to align on working styles, mutual expectations, and team dynamics."
    },
    {
      number: "04",
      title: "Offer & Smooth Onboarding",
      desc: "A transparent offer letter followed by a structured onboarding plan, system credentials, and initial mentorship."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJobs = async () => {
      try {
        const response = await fetch(`${base_url}/job-post/all-job`);
        const data = await response.json();
        setJobList(data.data || []);
      } catch (err) { 
        console.error("Failed to fetch jobs:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs by category
  const filteredJobs = useMemo(() => {
    if (activeCategory === "all") return jobList;
    if (activeCategory === "engineering") {
      return jobList.filter(j => 
        /developer|engineer|fullstack|frontend|backend|devops|react|node|software|tech|qa|tester/i.test(j.job_position || "")
      );
    }
    if (activeCategory === "design") {
      return jobList.filter(j => 
        /designer|ui|ux|graphic|product designer|figma/i.test(j.job_position || "")
      );
    }
    if (activeCategory === "operations") {
      return jobList.filter(j => 
        /manager|marketing|sales|hr|operations|business|scrum/i.test(j.job_position || "")
      );
    }
    return jobList;
  }, [jobList, activeCategory]);

  // Dynamic Schema.org structured data for careers page
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Bright Future Soft",
        "url": "https://brightfuturesoft.com",
        "logo": "https://brightfuturesoft.com/assets/logo.png",
        "description": "Bright Future Soft is a remote-first enterprise software engineering company based in Bangladesh, specializing in SaaS, AI, and ERP solutions.",
        "sameAs": [
          "https://www.linkedin.com/company/bright-future-soft",
          "https://twitter.com/brightfuturesoft",
          "https://www.facebook.com/brightfuturesoft"
        ]
      },
      {
        "@type": "ItemList",
        "name": "Bright Future Soft Open Job Positions",
        "numberOfItems": jobList.length,
        "itemListElement": jobList.map((job, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "item": {
            "@type": "JobPosting",
            "title": job.job_position,
            "url": `https://brightfuturesoft.com/careers/${job._id}`,
            "employmentType": job.job_type || "FULL_TIME",
            "datePosted": job.createdAt || job.date || new Date().toISOString(),
            "validThrough": job.dateline ? new Date(job.dateline + "T23:59:59").toISOString() : undefined,
            "hiringOrganization": {
              "@type": "Organization",
              "name": "Bright Future Soft"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location || "Dhaka",
                "addressCountry": "BD"
              }
            }
          }
        }))
      }
    ]
  };

  return (
    <div className="public-site careers-page mx-4 md:mx-0">
      <MetaTitle
        title="Careers at Bright Future Soft — Join Our Remote-First Engineering Team"
        description="Explore engineering, design, and product opportunities at Bright Future Soft. Work on mission-critical enterprise software, SaaS, and AI systems with competitive benefits."
        keywords="Bright Future Soft careers, software developer jobs Bangladesh, remote software engineer, React Node.js jobs, tech jobs Dhaka, remote engineering careers"
        author="Bright Future Soft"
        ogTitle="Careers at Bright Future Soft — Remote-First Tech Opportunities"
        ogDescription="Join Bright Future Soft. We are building the next generation of enterprise software, ERPs, and AI tools with a high-trust, remote-first culture."
        ogImage="https://brightfuturesoft.com/assets/logo.png"
        ogUrl="https://brightfuturesoft.com/careers"
        schema={pageSchema}
      />

      {/* 1. HERO SECTION */}
      <section className="careers-hero">
        <div className="max-w-7xl mx-auto text-center ">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e1e9f2] text-xs font-semibold text-[#0a65b4] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a65b4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a65b4]"></span>
            </span>
            <span>We're Hiring Passionate Builders in Bangladesh & Beyond</span>
          </div>

          <h1 className="careers-hero-title">
            Build the Future of Enterprise & AI Software <span>Together with Us</span>
          </h1>

          <p className="careers-hero-subtitle">
            Bright Future Soft is a remote-first software engineering company. We partner with ambitious global clients to architect resilient SaaS platforms, intelligent AI workflows, and mission-critical enterprise systems.
          </p>

          {/* Perks Strip */}
          <div className="careers-perks-strip">
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>100% Remote-First</span>
            </div>
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>Provident Fund (5% + 5%)</span>
            </div>
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>Dedicated Learning Budget</span>
            </div>
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>Modern Tech Stack & AI</span>
            </div>
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>High Trust & Autonomy</span>
            </div>
            <div className="careers-perk-pill">
              <span className="careers-perk-dot"></span>
              <span>Merit-Based Growth</span>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto py-20" id="open-positions">
        <div className="careers-filter-bar">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#142235] tracking-tight">
              Open Positions
            </h2>
            <p className="text-sm text-[#66758a] mt-1">
              Find the role where you can make your most meaningful impact.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="careers-filter-pills">
            <button
              onClick={() => setActiveCategory("all")}
              className={`career-filter-btn ${activeCategory === "all" ? "active" : ""}`}
            >
              All Roles ({jobList.length})
            </button>
            <button
              onClick={() => setActiveCategory("engineering")}
              className={`career-filter-btn ${activeCategory === "engineering" ? "active" : ""}`}
            >
              Engineering
            </button>
            <button
              onClick={() => setActiveCategory("design")}
              className={`career-filter-btn ${activeCategory === "design" ? "active" : ""}`}
            >
              Design & UI/UX
            </button>
            <button
              onClick={() => setActiveCategory("operations")}
              className={`career-filter-btn ${activeCategory === "operations" ? "active" : ""}`}
            >
              Product & Operations
            </button>
          </div>
        </div>

        {/* Job List */}
        <div className="careers-job-list">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-[#e1e9f2] rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job._id} data={job} />
            ))
          ) : (
            <div className="text-center py-16 px-6 bg-white border border-dashed border-[#cbd5e1] rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#eef6fc] text-[#0a65b4] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#142235] mb-2">
                No active openings in this category right now
              </h3>
              <p className="text-sm text-[#66758a] max-w-md mx-auto mb-6">
                We are continually growing. If you don't see an exact match today, submit an open application and we'll reach out when an opportunity fits.
              </p>
              <a
                href="mailto:careers@brightfuturesoft.com?subject=Open%20Application%20-%20Bright%20Future%20Soft"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a65b4] text-white rounded-md text-sm font-semibold hover:bg-[#084e8a] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Submit Open Application
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 3. BFS CULTURE & STANDARDS */}
      <section className="">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0a65b4]">
              Culture & Values
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#142235] tracking-tight mt-2 mb-3">
              The BFS Standard: How We Work & Grow
            </h2>
            <p className="text-sm md:text-base text-[#66758a]">
              Craftsmanship, transparency, and deep mutual respect define our culture. Click any policy card below to inspect our full commitment.
            </p>
          </div>

          <div className="careers-culture-grid">
            {policies.map((policy) => (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className="career-culture-card"
              >
                <div className="career-culture-icon">
                  {policy.icon}
                </div>
                <h4>{policy.title}</h4>
                <p>{policy.short}</p>
                <span className="career-culture-link">
                  View Full Policy <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRANSPARENT HIRING PROCESS */}
      <section className="max-w-7xl mx-auto py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0a65b4]">
            Candidate Experience
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#142235] tracking-tight mt-2 mb-3">
            Our Transparent 4-Step Hiring Process
          </h2>
          <p className="text-sm md:text-base text-[#66758a]">
            We value your time and energy. Here is what you can expect from the moment you submit your application to your first day.
          </p>
        </div>

        <div className="careers-process-grid">
          {hiringSteps.map((step, idx) => (
            <div key={idx} className="career-process-card">
              <div className="career-process-num">Step {step.number}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. OPEN APPLICATION STRIP */}
      <section className="max-w-7xl mx-auto py-20">
        <div className="bg-gradient-to-r from-[#0a65b4] to-[#142235] rounded-xl p-8 md:p-12  flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 !text-white text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 !text-amber-300" />
              General Inquiries
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold leading-tight !text-white tracking-tight">
  Don't See Your Exact Role?
</h3>

           <p className="!text-white/80 text-sm md:text-base mt-2">
  We are always excited to meet brilliant software engineers, architects, UI/UX designers, and leaders. Send your resume and portfolio directly to our talent team.
</p>
          </div>
          <div className="flex-shrink-0">
            <a
              href="mailto:careers@brightfuturesoft.com?subject=Open%20Application%20-%20Bright%20Future%20Soft"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-[#0a65b4] hover:bg-[#f1f6fc] font-bold text-sm rounded-lg transition-all shadow-md active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Email careers@brightfuturesoft.com
            </a>
          </div>
        </div>
      </section>

      {/* 6. POLICY DETAILS MODAL */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="career-modal-backdrop" onClick={() => setSelectedPolicy(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="career-modal-card"
            >
              <div className="career-modal-head">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#eef6fc] text-[#0a65b4] flex items-center justify-center">
                    {selectedPolicy.icon}
                  </div>
                  <h3 className="career-modal-title">{selectedPolicy.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="career-modal-close"
                  aria-label="Close policy modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="career-modal-body">
                <p className="career-modal-desc">
                  {selectedPolicy.details.fullDesc}
                </p>

                <div className="career-modal-highlights">
                  {selectedPolicy.details.highlights.map((item, i) => (
                    <div key={i} className="career-highlight-item">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="w-full py-3 bg-[#0a65b4] hover:bg-[#084e8a] text-white font-bold text-sm rounded-md transition-colors"
                >
                  Close & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Newsletter */}
      <News_Letter />
    </div>
  );
};

export default Job;