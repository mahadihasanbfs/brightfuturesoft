import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import MetaTitle, { base_url } from '../../layout/Title';
import { Link, useParams } from 'react-router-dom';
import uploadImage from '../../Hook/ImageUpload';
import Swal from 'sweetalert2';
import { country_code } from './country_code';
import { 
  Briefcase, Building2, CalendarDays, ChevronRight, 
  MapPin, Users, ArrowLeft, UploadCloud, CheckCircle2, 
  Share2, Copy, Check, Clock, ShieldCheck, HeartHandshake,
  Sparkles, ExternalLink, AlertCircle, FileText
} from 'lucide-react';
import { FaLinkedinIn, FaTwitter, FaFacebookF } from 'react-icons/fa6';
import logoImg from '../../Assctes/logo.png';

const ViewDetails = () => {
  const { id } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [selectedCode, setSelectedCode] = useState(country_code[0]);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const formRef = useRef(null);

  // Fetch job details
  const { data: job_data = {}, isLoading, isError } = useQuery({
    queryKey: ["job_detail", id],
    queryFn: async () => {
      const res = await fetch(
        `${base_url}/job-post/get-job-by-id?job_post_id=${id}`,
        {
          headers: {
            'content-type': 'application/json',
            'author': 'bright_future_soft'
          },
          method: 'GET',
        }
      );
      const data = await res.json();
      return data.data || {};
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isDeadlinePassed = job_data?.dateline
    ? new Date(job_data.dateline + "T23:59:59") < new Date()
    : false;

  const formatDate = (dateString) => {
    if (!dateString) return "Rolling Admissions";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getWorkplaceIcon = (workplace) => {
    switch (workplace?.toLowerCase()) {
      case "remote":
        return <MapPin className="w-4 h-4 text-[#0a65b4]" />;
      case "onsite":
        return <Building2 className="w-4 h-4 text-[#0a65b4]" />;
      case "hybrid":
        return <Briefcase className="w-4 h-4 text-[#0a65b4]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#0a65b4]" />;
    }
  };

  // Resume upload handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File too large',
        text: 'Please select a document under 5MB.',
        confirmButtonColor: '#0a65b4',
      });
      return;
    }

    setUploadingResume(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setResumeUrl(uploadedUrl);
        setResumeFileName(file.name);
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
    } finally {
      setUploadingResume(false);
    }
  };

  // Application submission handler
  const handleApplySubmit = async (e) => {
    e.preventDefault();

    if (isDeadlinePassed) {
      Swal.fire({
        icon: 'info',
        title: 'Deadline Passed',
        text: 'This position is no longer accepting new applications.',
        confirmButtonColor: '#0a65b4',
      });
      return;
    }

    if (!resumeUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'Resume Required',
        text: 'Please upload your resume before submitting your application.',
        confirmButtonColor: '#0a65b4',
      });
      return;
    }

    setSubmitting(true);
    const form = e.target;
    const full_name = form.full_name.value.trim();
    const email_address = form.email_address.value.trim();
    const rawPhone = form.phone_number.value.trim();
    const phone_number = `${selectedCode.value} ${rawPhone}`;
    const salary_expectation = form.salary_expectation.value.trim();
    const experience_in_years = form.experience_in_years.value.trim();
    const why = form.why.value.trim();

    const payload = {
      full_name,
      email_address,
      phone_number,
      resume: resumeUrl,
      salary_expectation,
      experience_in_years,
      job_post_id: id,
      why
    };

    try {
      const res = await fetch(`${base_url}/job-post/apply-job`, {
        headers: {
          'content-type': 'application/json',
          'author': 'bright_future_soft'
        },
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Application Received!',
          text: data.message || 'Thank you for applying to Bright Future Soft. Our team will review your application shortly.',
          confirmButtonColor: '#0a65b4',
        });
        form.reset();
        setResumeUrl('');
        setResumeFileName('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Issue',
          text: data.message || 'Failed to submit application. Please check your information and try again.',
          confirmButtonColor: '#0a65b4',
        });
      }
    } catch (error) {
      console.error("Apply error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: 'An unexpected error occurred. Please try again later or email careers@brightfuturesoft.com.',
        confirmButtonColor: '#0a65b4',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToApply = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const metaTitle = job_data?.job_position 
    ? `${job_data.job_position} — Careers at Bright Future Soft` 
    : 'Career Opportunity — Bright Future Soft';

  const metaDescription = job_data?.short_description || 
    (job_data?.description ? stripHtml(job_data.description).slice(0, 160) : '') ||
    'Join Bright Future Soft. Work on enterprise software, AI solutions, and SaaS with high autonomy and competitive benefits.';

  // Schema.org structured data
  const jobSchema = job_data?.job_position ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://brightfuturesoft.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Careers",
            "item": "https://brightfuturesoft.com/careers"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": job_data.job_position,
            "item": `https://brightfuturesoft.com/careers/${id}`
          }
        ]
      },
      {
        "@type": "JobPosting",
        "title": job_data.job_position,
        "description": job_data.description || metaDescription,
        "datePosted": job_data.createdAt || job_data.date || new Date().toISOString(),
        "validThrough": job_data.dateline ? new Date(job_data.dateline + 'T23:59:59').toISOString() : undefined,
        "employmentType": job_data.job_type || "FULL_TIME",
        "directApply": true,
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Bright Future Soft",
          "sameAs": "https://brightfuturesoft.com",
          "logo": "https://brightfuturesoft.com/assets/logo.png"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job_data.location || 'Dhaka',
            "addressCountry": 'BD'
          }
        }
      }
    ]
  } : null;

  return (
    <div className="public-site career-details-page">
      {jobSchema && (
        <MetaTitle
          title={metaTitle}
          description={metaDescription}
          keywords={`Bright Future Soft careers, ${job_data.job_position}, tech jobs Bangladesh, remote software engineer`}
          author="Bright Future Soft"
          ogTitle={metaTitle}
          ogDescription={metaDescription}
          ogImage="https://brightfuturesoft.com/assets/logo.png"
          ogUrl={`https://brightfuturesoft.com/careers/${id}`}
          schema={jobSchema}
        />
      )}

      {/* HEADER SECTION */}
      <header className="px-4 sm:px-6 lg:px-8 ">
        <div className="mx-auto max-w-7xl pt-24 ">
          {/* Breadcrumb / Back link */}
        
        

          <h1 className="career-details-h1">
            {job_data?.job_position || "Software Engineering Role"}
          </h1>

          <p className="text-base md:text-lg text-[#55667c] max-w-3xl leading-relaxed">
            Join the Bright Future Soft remote engineering team to build scalable enterprise platforms, intuitive digital products, and intelligent AI solutions.
          </p>

          {/* Meta Cards Grid */}
          <div className="career-meta-grid">
            <div className="career-meta-card">
              {getWorkplaceIcon(job_data.workplace)}
              <div>
                <span className="career-meta-label">Workplace</span>
                <span className="career-meta-val">{job_data.workplace || "Remote-First"}</span>
              </div>
            </div>

            <div className="career-meta-card">
              <Briefcase className="w-4 h-4 text-[#0a65b4]" />
              <div>
                <span className="career-meta-label">Employment</span>
                <span className="career-meta-val">{job_data.job_type || "Full-Time"}</span>
              </div>
            </div>

            <div className="career-meta-card">
              <Users className="w-4 h-4 text-[#0a65b4]" />
              <div>
                <span className="career-meta-label">Open Positions</span>
                <span className="career-meta-val">{job_data.vacancy ? `${job_data.vacancy} Vacancies` : "Multiple Openings"}</span>
              </div>
            </div>

            <div className="career-meta-card">
              <CalendarDays className="w-4 h-4 text-[#0a65b4]" />
              <div>
                <span className="career-meta-label">Application Deadline</span>
                <span className="career-meta-val">{formatDate(job_data.dateline)}</span>
              </div>
            </div>

            <div className="career-meta-card">
              <MapPin className="w-4 h-4 text-[#0a65b4]" />
              <div>
                <span className="career-meta-label">HQ / Location</span>
                <span className="career-meta-val">{job_data.location || "Dhaka, Bangladesh"}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="mx-auto max-w-7xl mt-4 md:mt-10">
        <div className="career-details-layout">
          {/* LEFT COLUMN: Role Description & Application Form */}
          <main className="space-y-8">
            {/* Rich Job Description */}
            <article className="career-article-content">
              <div className="border-b border-[#e1e9f2] pb-5 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0a65b4]">
                  Role Overview & Requirements
                </span>
                <h2 className="text-2xl font-bold text-[#142235] mt-1 border-none p-0">
                  About this Opportunity
                </h2>
              </div>

              {isLoading ? (
                <div className="space-y-4 py-8 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-24 bg-slate-100 rounded"></div>
                </div>
              ) : job_data.description ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: job_data.description }}
                />
              ) : (
                <div className="text-[#55667c] py-4">
                  <p>
                    Bright Future Soft is seeking a talented individual for the <strong>{job_data.job_position}</strong> role. 
                    In this position, you will collaborate with cross-functional product and engineering teams to architect, 
                    develop, test, and maintain modern software solutions.
                  </p>
                  <p className="mt-4">
                    Please refer to the form below to submit your resume and portfolio.
                  </p>
                </div>
              )}
            </article>

            {/* APPLICATION FORM CARD */}
            <section ref={formRef} id="apply-section" className="career-apply-card scroll-mt-24">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0a65b4]">
                    Direct Application
                  </span>
                  <h3 className="text-2xl font-bold text-[#142235] mt-1">
                    Apply for {job_data?.job_position || "this Position"}
                  </h3>
                  <p className="text-sm text-[#66758a] mt-1 mb-0">
                    Submit your credentials directly to our hiring team. All applications are reviewed carefully.
                  </p>
                </div>
              </div>

              {isDeadlinePassed ? (
                <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-800">Applications Closed for this Position</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      The deadline for this opening has passed. You can explore other active roles on our careers page or send an open application to <strong>careers@brightfuturesoft.com</strong>.
                    </p>
                    <Link
                      to="/careers"
                      className="inline-block mt-3 text-xs font-bold text-[#0a65b4] hover:underline"
                    >
                      Browse other open roles →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit}>
                  <div className="career-form-grid">
                    {/* Full Name */}
                    <div className="career-form-group">
                      <label className="career-form-label">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        placeholder="e.g. Tanvir Ahmed"
                        className="career-form-input"
                      />
                    </div>

                    {/* Email */}
                    <div className="career-form-group">
                      <label className="career-form-label">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email_address"
                        required
                        placeholder="you@example.com"
                        className="career-form-input"
                      />
                    </div>

                    {/* Phone Number with Country Code */}
                    <div className="career-form-group">
                      <label className="career-form-label">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={selectedCode.value}
                          onChange={(e) => {
                            const found = country_code.find(c => c.value === e.target.value);
                            if (found) setSelectedCode(found);
                          }}
                          className="bg-[#f8fafd] border border-[#d9e3ed] rounded-md px-2.5 py-2.5 text-xs font-semibold text-[#142235] outline-none focus:border-[#0a65b4] w-28"
                        >
                          {country_code.map((c, i) => (
                            <option key={i} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          name="phone_number"
                          required
                          placeholder="1712345678"
                          className="career-form-input flex-1"
                        />
                      </div>
                    </div>

                    {/* Salary Expectation */}
                    <div className="career-form-group">
                      <label className="career-form-label">
                        Salary Expectation (BDT / Month) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="salary_expectation"
                        required
                        placeholder="e.g. 60,000 BDT or Negotiable"
                        className="career-form-input"
                      />
                    </div>

                    {/* Experience in Years */}
                    <div className="career-form-group full">
                      <label className="career-form-label">
                        Relevant Experience (Years) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="experience_in_years"
                        required
                        placeholder="e.g. 3 years or Fresh Graduate"
                        className="career-form-input"
                      />
                    </div>

                    {/* Resume Upload Box */}
                    <div className="career-form-group full">
                      <label className="career-form-label">
                        Resume / CV (PDF or DOCX, Max 5MB) <span className="text-red-500">*</span>
                      </label>
                      
                      <div className={`career-upload-box ${resumeUrl ? 'uploaded' : ''}`}>
                        {uploadingResume ? (
                          <div className="py-4 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-3 border-[#0a65b4] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm font-semibold text-[#0a65b4]">Uploading your document...</span>
                          </div>
                        ) : resumeUrl ? (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                            <div className="flex items-center gap-3 text-left">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#142235] truncate max-w-xs sm:max-w-md">
                                  {resumeFileName || "Resume Attached"}
                                </p>
                                <span className="text-xs text-emerald-600 font-semibold">Document uploaded successfully</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0a65b4] bg-[#eef6fc] rounded hover:bg-[#ddebfa] transition-colors"
                              >
                                View File <ExternalLink className="w-3 h-3" />
                              </a>
                              <label
                                htmlFor="resume-file-input"
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#66758a] hover:text-[#142235] bg-white border border-[#d9e3ed] rounded cursor-pointer transition-colors"
                              >
                                Replace
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label htmlFor="resume-file-input" className="cursor-pointer block py-3">
                            <UploadCloud className="w-10 h-10 text-[#0a65b4] mx-auto mb-2" />
                            <p className="text-sm font-bold text-[#142235]">
                              Click to upload or drag & drop your resume
                            </p>
                            <p className="text-xs text-[#728296] mt-1">
                              PDF, DOC, or DOCX up to 5MB
                            </p>
                          </label>
                        )}

                        <input
                          id="resume-file-input"
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Why are you a good fit */}
                    <div className="career-form-group full">
                      <label className="career-form-label">
                        Why do you think you are a great fit for this position? <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="why"
                        required
                        rows={5}
                        placeholder="Briefly highlight your technical background, major achievements, and why Bright Future Soft is the right next step for your career..."
                        className="career-form-input resize-y"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={submitting || isDeadlinePassed}
                      className="w-full py-4 bg-[#0a65b4] hover:bg-[#084e8a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-md transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                    <p className="text-center text-xs text-[#728296] mt-3">
                      By submitting, you agree to our candidate privacy standards. We treat all applicant information in strict confidence.
                    </p>
                  </div>
                </form>
              )}
            </section>
          </main>

          {/* RIGHT COLUMN: Sticky Sidebar */}
          <aside className="career-sidebar">
            {/* Quick Action Box */}
            <div className="career-sidebar-box">
              <h4 className="text-base font-bold text-[#142235] mb-2">Role Snapshot</h4>
              <p className="text-xs text-[#66758a] mb-5">
                Ready to contribute to world-class software solutions?
              </p>

              <button
                onClick={scrollToApply}
                disabled={isDeadlinePassed}
                className="w-full py-3 bg-[#0a65b4] hover:bg-[#084e8a] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm mb-4"
              >
                {isDeadlinePassed ? "Application Closed" : "Apply for this Position"}
              </button>

              <div className="border-t border-[#edf2f7] pt-4 space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#55667c]">
                  <span>Status</span>
                  <span className="font-semibold text-emerald-600">
                    {isDeadlinePassed ? "Closed" : "Accepting Applications"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#55667c]">
                  <span>Work Arrangement</span>
                  <span className="font-semibold text-[#142235]">{job_data.workplace || "Remote-First"}</span>
                </div>
                <div className="flex justify-between items-center text-[#55667c]">
                  <span>Department</span>
                  <span className="font-semibold text-[#142235]">Software Engineering</span>
                </div>
              </div>
            </div>

            {/* About Bright Future Soft Box */}
            <div className="career-sidebar-box">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logoImg}
                  alt="Bright Future Soft Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#142235]">Bright Future Soft</h4>
                  <p className="text-[11px] text-[#728296]">Enterprise & AI Solutions</p>
                </div>
              </div>

              <p className="text-xs text-[#55667c] leading-relaxed mb-4">
                Bright Future Soft is a premier software engineering firm in Bangladesh dedicated to architecting mission-critical SaaS, ERP systems, and AI workflows for global clients.
              </p>

              <blockquote className="border-l-2 border-[#0a65b4] pl-3 py-1 text-xs italic text-[#3b4d63] bg-[#f8fafd] rounded-r my-4">
                "Envisioning the FUTURE, Building the SOFTWARE."
              </blockquote>

              <Link
                to="/about"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0a65b4] hover:text-[#084e8a]"
              >
                Learn more about BFS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Candidate Promise */}
            <div className="career-sidebar-box bg-[#f8fafd]">
              <h4 className="text-sm font-bold text-[#142235] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0a65b4]" />
                Our Candidate Commitment
              </h4>
              <ul className="space-y-2 text-xs text-[#55667c]">
                <li className="flex items-start gap-2">
                  <span className="text-[#0a65b4] font-bold">✓</span>
                  <span>Every application is reviewed by engineering leads.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0a65b4] font-bold">✓</span>
                  <span>Feedback provided within 5 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0a65b4] font-bold">✓</span>
                  <span>Practical assessments, no puzzle questions.</span>
                </li>
              </ul>
            </div>

            {/* Share Opening */}
            <div className="career-sidebar-box">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#66758a] mb-3">
                Share this Opening
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-md bg-[#f1f5f9] hover:bg-[#0a65b4] text-[#55667c] hover:text-white flex items-center justify-center transition-colors text-sm"
                  aria-label="Share on LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Career Opportunity at Bright Future Soft: ${job_data.job_position || 'Software Engineer'}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-md bg-[#f1f5f9] hover:bg-[#0a65b4] text-[#55667c] hover:text-white flex items-center justify-center transition-colors text-sm"
                  aria-label="Share on Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-md bg-[#f1f5f9] hover:bg-[#0a65b4] text-[#55667c] hover:text-white flex items-center justify-center transition-colors text-sm"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex-1 h-9 rounded-md bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#142235] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#55667c]" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
