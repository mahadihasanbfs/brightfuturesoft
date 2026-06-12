import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Clock, Monitor, HeartHandshake, GraduationCap,
  Award, CalendarDays, Lightbulb, Lock, FileText,
  X, CheckCircle2, ArrowRight, Zap, ChevronRight, Briefcase,
  PiggyBank,
  Laptop,
  Scale,
  AlertTriangle
} from "lucide-react";
import MetaTitle, { base_url } from "../../layout/Title";
import JobCard from "./Card";
import News_Letter from "../Testimonials/Testimonials/News_Letter";

const Job = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const brandColor = "#1c65b4";

const policies = [
  {
    id: 1,
    icon: <ShieldCheck />,
    title: "Professional Environment",
    short: "Safe, ethical and respectful workplace.",
    details: {
      highlights: [
        "Zero Harassment",
        "Equal Opportunity",
        "Professional Ethics",
        "Employee Protection"
      ],
      fullDesc:
        "Bright Future Soft is committed to maintaining a professional, respectful, and inclusive work environment. Discrimination, harassment, bullying, threats, abusive behavior, or any unethical conduct will not be tolerated. Every employee is expected to treat colleagues, clients, and partners with professionalism and respect."
    }
  },

  {
    id: 2,
    icon: <Clock />,
    title: "Probation & Confirmation",
    short: "Structured onboarding and evaluation process.",
    details: {
      highlights: [
        "3-Month Probation",
        "Performance Evaluation",
        "Mentorship Support",
        "Confirmation Review"
      ],
      fullDesc:
        "All newly hired employees undergo a 3-month probation period. During this period, performance, communication, technical skills, reliability, attendance, and overall contribution are evaluated. The company reserves the right to confirm, extend, or terminate employment based on performance and business requirements."
    }
  },

  {
    id: 3,
    icon: <Monitor />,
    title: "Remote-First Culture",
    short: "Global collaboration and accountability.",
    details: {
      highlights: [
        "Discord Availability",
        "Fixed Working Hours",
        "Daily Communication",
        "Remote Collaboration"
      ],
      fullDesc:
        "As a remote-first company, employees must remain active and reachable on Discord during assigned working hours. Team members are expected to participate in meetings, respond to messages in a reasonable timeframe, provide project updates when required, and maintain professional communication. Unexplained absence, repeated unavailability, or poor communication may result in disciplinary action."
    }
  },

  {
    id: 4,
    icon: <HeartHandshake />,
    title: "People & Culture",
    short: "Collaboration and continuous growth.",
    details: {
      highlights: [
        "Open Communication",
        "Team Trust",
        "Respectful Culture",
        "Work-Life Balance"
      ],
      fullDesc:
        "Our culture is built on trust, transparency, accountability, and teamwork. Employees are encouraged to share ideas, support one another, and contribute to a positive and productive work environment."
    }
  },

  {
    id: 5,
    icon: <GraduationCap />,
    title: "Learning & Growth",
    short: "Investing in professional development.",
    details: {
      highlights: [
        "Technical Training",
        "Mentorship",
        "Knowledge Sharing",
        "Career Growth"
      ],
      fullDesc:
        "We encourage continuous learning and professional growth. Employees are expected to improve their technical and professional skills through project work, self-learning, mentorship, and internal knowledge-sharing initiatives."
    }
  },

  {
    id: 6,
    icon: <Award />,
    title: "Performance & Recognition",
    short: "Rewarding ownership and contribution.",
    details: {
      highlights: [
        "Performance Reviews",
        "Recognition Programs",
        "Leadership Opportunities",
        "Career Advancement"
      ],
      fullDesc:
        "Performance is evaluated based on quality of work, communication, ownership, teamwork, attendance, and overall contribution. Outstanding employees may receive recognition, additional responsibilities, promotions, or leadership opportunities."
    }
  },

  {
    id: 7,
    icon: <CalendarDays />,
    title: "Leave & Attendance",
    short: "Responsible leave management.",
    details: {
      highlights: [
        "Advance Approval",
        "Emergency Leave",
        "Attendance Monitoring",
        "Working Hour Compliance"
      ],
      fullDesc:
        "Employees are expected to maintain regular attendance and obtain approval before taking leave whenever possible. Emergency leave may be granted for genuine unforeseen circumstances. Repeated unauthorized absences, attendance violations, or failure to communicate may affect performance evaluations and employment status."
    }
  },

  {
    id: 8,
    icon: <Lightbulb />,
    title: "Innovation & Ownership",
    short: "Driving impact through initiative.",
    details: {
      highlights: [
        "Creative Thinking",
        "Ownership Mindset",
        "Problem Solving",
        "Continuous Improvement"
      ],
      fullDesc:
        "Every employee is encouraged to take ownership of their work, identify opportunities for improvement, solve problems proactively, and contribute innovative ideas that help the company grow."
    }
  },

  {
    id: 9,
    icon: <Lock />,
    title: "Confidentiality & Intellectual Property",
    short: "Protecting company and client assets.",
    details: {
      highlights: [
        "IP Protection",
        "Source Code Security",
        "Client Confidentiality",
        "NDA Compliance"
      ],
      fullDesc:
        "All software, source code, designs, documents, databases, credentials, business information, and intellectual property developed during employment remain the exclusive property of Bright Future Soft. Confidential information must not be disclosed during or after employment."
    }
  },

  {
    id: 10,
    icon: <PiggyBank />,
    title: "Provident Fund (PF)",
    short: "Supporting long-term financial security.",
    details: {
      highlights: [
        "5% Employee Contribution",
        "5% Company Contribution",
        "Monthly Savings",
        "Long-Term Benefits"
      ],
      fullDesc:
        "Eligible permanent employees may participate in the Provident Fund program. Employees contribute 5% of their basic salary, and Bright Future Soft contributes an additional 5%, helping employees build long-term financial security."
    }
  },

  {
    id: 11,
    icon: <Laptop />,
    title: "Equipment & Account Security",
    short: "Protecting digital assets and access.",
    details: {
      highlights: [
        "Password Protection",
        "Authorized Access Only",
        "Repository Security",
        "Data Protection"
      ],
      fullDesc:
        "Employees are responsible for protecting company devices, accounts, repositories, cloud resources, and client data. Unauthorized sharing of credentials, access, or confidential information is strictly prohibited."
    }
  },

  {
    id: 12,
    icon: <Scale />,
    title: "Conflict of Interest",
    short: "Maintaining integrity and transparency.",
    details: {
      highlights: [
        "Business Ethics",
        "Client Protection",
        "Transparency",
        "Professional Conduct"
      ],
      fullDesc:
        "Employees must avoid activities that create conflicts with the interests of Bright Future Soft, its clients, or its business operations. Potential conflicts must be disclosed to management immediately."
    }
  },

  {
    id: 13,
    icon: <AlertTriangle />,
    title: "Policy Violations",
    short: "Accountability for misconduct.",
    details: {
      highlights: [
        "Attendance Violations",
        "Data Misuse",
        "Harassment",
        "Disciplinary Actions"
      ],
      fullDesc:
        "Violations of company policies, misconduct, fraud, data theft, repeated attendance issues, insubordination, harassment, or actions that damage company interests may result in warnings, suspension, or termination of employment."
    }
  },

  {
    id: 14,
    icon: <FileText />,
    title: "Resignation & Exit Process",
    short: "Professional separation procedures.",
    details: {
      highlights: [
        "Written Resignation",
        "Notice Period",
        "Project Handover",
        "Final Clearance"
      ],
      fullDesc:
        "Employees intending to resign must submit a formal resignation letter and complete the applicable notice period. Before departure, all projects, source code, documentation, credentials, company assets, and responsibilities must be handed over. Experience letters, recommendation letters, and final settlements may be processed after successful completion of all clearance procedures."
    }
  },

  {
    id: 15,
    icon: <Briefcase />,
    title: "Project Ownership & Handover",
    short: "Ensuring business continuity.",
    details: {
      highlights: [
        "Documentation Required",
        "Code Handover",
        "Knowledge Transfer",
        "Client Transition"
      ],
      fullDesc:
        "Employees are responsible for maintaining proper documentation of their work. In the event of role changes, leave, or resignation, all project knowledge, source code, credentials, and relevant information must be transferred to the designated team member."
    }
  }
];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${base_url}/job-post/all-job`);
        const data = await response.json();
        setJobList(data.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchJobs();
  }, []);

  // Animation Variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

    useEffect(() => {
      window.scrollTo(0, 0);

      document.title =
            "Bright Future Soft | Careers - Join Our Team of Innovators and Problem Solvers";

      const description =
            "Explore exciting career opportunities at Bright Future Soft, a leading software development company in Bangladesh. Join our remote-first team and build the future of SaaS, AI, and ERP solutions. Apply now to be part of our innovative and dynamic work environment.";

      const keywords =
            "Bright Future Soft careers, software development jobs in Bangladesh, remote software jobs, SaaS careers, AI careers, ERP careers, software engineering jobs, tech jobs in Bangladesh, Sales jobs, marketing jobs, design jobs, HR jobs, internship opportunities at Bright Future Soft";

      // Meta Description
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Meta Keywords
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
            metaKeywords = document.createElement("meta");
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);

      // OG Title
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
            ogTitle = document.createElement("meta");
            ogTitle.setAttribute("property", "og:title");
            document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute(
            "content",
            "Careers at Bright Future Soft - Join Our Remote-First Team"
      );

      // OG Description
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
            ogDesc = document.createElement("meta");
            ogDesc.setAttribute("property", "og:description");
            document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);

      // OG Image (Logo or Banner)
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
            ogImage = document.createElement("meta");
            ogImage.setAttribute("property", "og:image");
            document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", "https://brightfuturesoft.com/logo.png");

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);

}, []);

  return (
 
  <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#1c65b4]/30 font-sans overflow-x-hidden ">

       <MetaTitle
                                    title={`Careers at Bright Future Soft}`}
                                    description={`Explore exciting career opportunities at Bright Future Soft, a leading software development company in Bangladesh. Join our remote-first team and build the future of SaaS, AI, and ERP solutions. Apply now to be part of our innovative and dynamic work environment.`}
                                    keywords={`Bright Future Soft careers, software development jobs in Bangladesh, remote software jobs, SaaS careers, AI careers, ERP careers, software engineering jobs, tech jobs in Bangladesh`}
                                    author="Bright Future Soft"
                                    ogTitle={`Careers at Bright Future Soft - Join Our Remote-First Team`}
                                    ogDescription={`Discover exciting career opportunities at Bright Future Soft, a leading software development company in Bangladesh. Join our remote-first team and build the future of SaaS, AI, and ERP solutions. Apply now to be part of our innovative and dynamic work environment.`}
                                    ogImage="https://www.brightfuturesoft.com/logo.png"
                                    ogUrl={`https://www.brightfuturesoft.com/careers || ''}`}
                                    schema={{
                                          "@context": "https://schema.org",
                                          "@type": "Organization",
                                          "name": "Bright Future Soft",
                                          "url": "https://www.brightfuturesoft.com",
                                          "logo": "https://www.brightfuturesoft.com/logo.png",
                                          "sameAs": [
                                                "https://www.facebook.com/brightfuturesoft",
                                                "https://www.linkedin.com/company/bright-future-soft",
                                                "https://twitter.com/brightfuturesoft"
                                          ],
                                          "description": `Explore exciting career opportunities at Bright Future Soft, a leading software development company in Bangladesh. Join our remote-first team and build the future of SaaS, AI, and ERP solutions. Apply now to be part of our innovative and dynamic work environment.`
                                    }}
                              />
      {/* 1. BACKGROUND TEXTURE (The "Glass" Grid) */}
      <div className="fixed inset-0 z-0 p-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-[0.15] blur-[120px] rounded-full" style={{ backgroundColor: brandColor }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 ">
        
        {/* 2. HERO SECTION */}
        <section className="pt-32 pb-24 text-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-sm font-medium mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: brandColor }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: brandColor }}></span>
              </span>
              <span className="text-slate-400">Join our growing team in Bangladesh</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
              BUILD THE <br /> 
              <span className="italic" style={{ color: brandColor }}>NEXT GEN</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We are a remote-first engineering powerhouse building world-class SaaS, AI, and ERP solutions. Your bright future starts here.
            </p>
          </motion.div>
        </section>

        {/* 3. JOBS SECTION (Priority 1 for Users) */}
        <section className="pb-32 p-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white italic">Current Openings</h2>
              <p className="text-slate-500">Explore roles across engineering, product, and design.</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-400">
                {jobList.length} Opportunities
              </div>
            </div>
          </div>

          <motion.div variants={containerVars} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid gap-4">
            {console.log(jobList)}
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-24 bg-slate-900/50 border border-slate-800 animate-pulse rounded-2xl" />)
            ) : jobList.length > 0 ? (
              jobList.map((job) => (
                  <JobCard data={job} />
              ))
            ) : (
              <div className="py-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2rem]">
                <Zap className="mx-auto mb-4 opacity-20" size={40} style={{ color: brandColor }} />
                <p className="text-slate-500 font-medium italic">We're not actively hiring right now, but we'd love to see your CV.</p>
              </div>
            )}
          </motion.div>
        </section>

        {/* 4. POLICY GRID SECTION (The "Why Join Us") */}
        <section className="py-24 border-t border-slate-800/50 p-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The BFS Standard</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Our culture is built on transparency and excellence. Click any card to explore our core policies.</p>
          </div>

          <motion.div variants={containerVars} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                variants={itemVars}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedPolicy(policy)}
                className="group cursor-pointer p-8 rounded-[2rem] bg-slate-900/30 border border-slate-800/50 hover:border-[#1c65b4]/50 hover:bg-slate-900/50 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Subtle Glow on Hover */}
                <div className="absolute -right-4 -top-4 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: brandColor }} />
                
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-slate-800/50 text-[#1c65b4] group-hover:scale-110 group-hover:bg-[#1c65b4] group-hover:text-white transition-all duration-300 shadow-inner">
                  {policy.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#1c65b4] transition-colors">{policy.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{policy.short}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-[#1c65b4] transition-all">
                  Read Details <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* 5. MODAL SYSTEM */}
      <AnimatePresence>
        {selectedPolicy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPolicy(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 md:p-14">
                <div className="flex justify-between items-center mb-10">
                  <div className="p-4 bg-slate-800 rounded-2xl text-[#1c65b4]"> {selectedPolicy.icon} </div>
                  <button onClick={() => setSelectedPolicy(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors"><X /></button>
                </div>

                <h2 className="text-3xl font-bold mb-4 text-white italic">{selectedPolicy.title}</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-10">{selectedPolicy.details.fullDesc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                  {selectedPolicy.details.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                      <CheckCircle2 size={18} style={{ color: brandColor }} />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setSelectedPolicy(null)}
                  className="w-full py-4 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <News_Letter />
    </div>
</div>
  );
};

export default Job;