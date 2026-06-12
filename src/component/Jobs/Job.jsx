import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Clock, Monitor, HeartHandshake, GraduationCap,
  Award, CalendarDays, Lightbulb, Lock, FileText,
  X, CheckCircle2, ArrowRight, Zap, ChevronRight, Briefcase
} from "lucide-react";
import MetaTitle, { base_url } from "../../layout/Title";
import JobCard from "./Card";
import News_Letter from "../Testimonials/Testimonials/News_Letter";

const Job = () => {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const brandColor = "#1c65b4";

  // Policy Data
  const policies = [
    { id: 1, icon: <ShieldCheck />, title: "Professional Environment", short: "Safe, ethical and respectful workplace.", details: { highlights: ["Zero Harassment", "Equal Opportunity", "Professional Ethics", "Employee Protection"], fullDesc: "Bright Future Soft is committed to maintaining a professional, respectful, and inclusive work environment. Discrimination, harassment, or any unethical behavior will not be tolerated." } },
    { id: 2, icon: <Clock />, title: "Probation & Confirmation", short: "Structured onboarding process.", details: { highlights: ["3-Month Probation", "Performance Evaluation", "Mentorship Support", "Confirmation Review"], fullDesc: "All newly hired employees undergo a 3-month probation period focused on evaluation and mentorship to ensure a smooth transition into permanent status." } },
    { id: 3, icon: <Monitor />, title: "Remote-First Culture", short: "Global collaboration and accountability.", details: { highlights: ["Discord Availability", "Flexible Hours", "Daily Syncs", "Remote Tools"], fullDesc: "We operate as a remote-first company. Team members are expected to remain reachable on Discord and maintain clear communication during assigned hours." } },
    { id: 4, icon: <HeartHandshake />, title: "People & Culture", short: "Collaboration and continuous growth.", details: { highlights: ["Open Communication", "Team Trust", "Respectful Culture", "Work-Life Balance"], fullDesc: "Built on trust and transparency, our culture encourages open ideas and mutual support to shape the future of our products." } },
    { id: 5, icon: <GraduationCap />, title: "Learning & Growth", short: "Investing in your personal development.", details: { highlights: ["Technical Training", "Mentorship", "Certification Support", "Career Mapping"], fullDesc: "We value individuals who invest in their growth. We support self-learning and provide mentorship to help you master new technologies." } },
    { id: 6, icon: <Award />, title: "Recognition", short: "Rewarding ownership and impact.", details: { highlights: ["Performance Reviews", "Recognition Programs", "Leadership Paths", "Growth Bonus"], fullDesc: "Productivity and ownership are rewarded with career advancement and leadership opportunities within the organization." } },
    { id: 7, icon: <CalendarDays />, title: "Time Off", short: "Supporting employee well-being.", details: { highlights: ["Annual Leave", "Sick Leave", "Public Holidays", "Casual Leave"], fullDesc: "We provide competitive leave packages to ensure our team stays refreshed and maintains a healthy work-life harmony." } },
    { id: 8, icon: <Lightbulb />, title: "Innovation", short: "Drive impact through ownership.", details: { highlights: ["Creative Thinking", "Ownership Mindset", "Problem Solving", "Proactive Labs"], fullDesc: "We encourage every member to act like an owner—solving problems proactively and driving innovation at every level." } },
    { id: 9, icon: <Lock />, title: "Confidentiality", short: "Protecting code and client assets.", details: { highlights: ["IP Protection", "NDA Compliance", "Secure Environment", "Client Privacy"], fullDesc: "All work developed at BFS remains exclusive property. We maintain strict protocols to protect our source code and client confidentiality." } },
    { id: 10, icon: <FileText />, title: "Exit Process", short: "Professional separation procedures.", details: { highlights: ["Notice Period", "Project Handover", "Knowledge Transfer", "Final Settlement"], fullDesc: "We ensure a professional exit process including knowledge transfer and final settlements to maintain long-term professional relationships." } },
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

  return (
 
  <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-[#1c65b4]/30 font-sans overflow-x-hidden ">
      
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