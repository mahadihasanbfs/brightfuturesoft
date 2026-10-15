import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaTitle from "../../layout/Title";
import { 
  Award, ShieldCheck, CheckCircle2, Server, 
  Lock, FileCheck, Layers, Cpu, Mail, Download, ArrowRight
} from "lucide-react";
import { CallSchedule } from "../../pages/shared/Header/Header";

const Compliance = () => {
  const [schedule, setSchedule] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const standardsPillars = [
    {
      title: "ISO/IEC 27001 Alignment",
      subtitle: "Information Security Management",
      icon: <ShieldCheck className="w-6 h-6" />,
      desc: "Our software development processes and internal operations follow ISO/IEC 27001 standards, governing risk assessment, access control, asset management, and technical security perimeters."
    },
    {
      title: "SOC 2 Type II Controls",
      subtitle: "Trust Services Criteria",
      icon: <Server className="w-6 h-6" />,
      desc: "Engineered around the five SOC 2 trust principles: Security, Availability, Processing Integrity, Confidentiality, and Privacy, backed by automated infrastructure logging and monitoring."
    },
    {
      title: "ISO 9001 Quality Standards",
      subtitle: "Software Engineering Quality",
      icon: <Award className="w-6 h-6" />,
      desc: "Structured quality management ensuring every client sprint undergoes automated unit testing, peer code reviews, continuous integration (CI/CD), and rigorous user acceptance testing (UAT)."
    },
    {
      title: "GDPR & Privacy Compliance",
      subtitle: "Global Data Protection",
      icon: <Lock className="w-6 h-6" />,
      desc: "Full adherence to European Union GDPR principles: data minimization, purpose limitation, encryption by default, and execution of comprehensive Data Processing Agreements (DPAs)."
    }
  ];

  const sections = [
    {
      id: "executive-summary",
      num: "01",
      title: "Enterprise Compliance & Trust Statement",
      content: (
        <>
          <p>
            At <strong>Bright Future Soft</strong>, we believe that world-class software engineering requires an uncompromising commitment to security, quality, and regulatory compliance. As a technology partner to enterprises, fast-growing startups, and government entities, we design our software architectures to meet the most rigorous international security benchmarks.
          </p>
          <p>
            Whether developing custom bespoke software for enterprise clients or hosting our proprietary SaaS and ERP platforms, Bright Future Soft implements defense-in-depth security controls aligned with <strong>ISO/IEC 27001</strong>, <strong>SOC 2 Type II</strong>, and <strong>ISO 9001</strong> frameworks.
          </p>
          <div className="legal-callout-box">
            <h4>Security-by-Design Philosophy</h4>
            <p>
              Security is not an afterthought or an add-on at Bright Future Soft. From the initial system architecture diagram to CI/CD automated deployments, every line of code is inspected for vulnerabilities and regulatory compliance.
            </p>
          </div>
        </>
      )
    },
    {
      id: "iso-27001",
      num: "02",
      title: "ISO/IEC 27001 Information Security Management",
      content: (
        <>
          <p>
            Our Information Security Management System (ISMS) adheres to the Annex A control set of ISO/IEC 27001:
          </p>
          <ul>
            <li>
              <strong>A.9 Access Control:</strong> Strict Principle of Least Privilege (PoLP), centralized identity management, mandatory Multi-Factor Authentication (MFA), and automated quarterly access entitlement reviews.
            </li>
            <li>
              <strong>A.10 Cryptography:</strong> Mandatory encryption across all data states. AES-256 for persistent block and database storage; TLS 1.3 for all external and service-to-service communications.
            </li>
            <li>
              <strong>A.12 Operations Security:</strong> Immutable audit logs, centralized intrusion detection, automated vulnerability scanning, and daily air-gapped encrypted backups.
            </li>
            <li>
              <strong>A.14 System Acquisition &amp; Maintenance:</strong> Secure coding standards, dependency vulnerability auditing, and separate development, staging, and production environments.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "soc-2",
      num: "03",
      title: "SOC 2 Type II Trust Services Criteria",
      content: (
        <>
          <p>
            Our cloud platforms and developer operations align with the AICPA SOC 2 Trust Services Criteria:
          </p>
          <div className="compliance-pillars-grid">
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <Lock className="w-5 h-5" />
              </div>
              <h4>Security Perimeter</h4>
              <p>Perimeter firewalls, AWS/GCP VPC subnet isolation, WAF rules blocking SQLi and XSS, and automated anomaly detection.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <Server className="w-5 h-5" />
              </div>
              <h4>99.9% Availability SLA</h4>
              <p>High-availability multi-zone cloud architecture, redundant database failover, and documented Disaster Recovery plans with RTO &lt; 2 hrs and RPO &lt; 1 hr.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4>Processing Integrity</h4>
              <p>Strict schema validation, idempotent database mutations, and continuous integration pipeline test coverage exceeding 85%.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4>Confidentiality</h4>
              <p>Bilateral non-disclosure agreements, data masking in development environments, and secure cryptographic key rotation.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: "ssdlc",
      num: "04",
      title: "Secure Software Development Lifecycle (SSDLC)",
      content: (
        <>
          <p>
            We bake security into every stage of the agile engineering lifecycle:
          </p>
          <ul>
            <li>
              <strong>Architecture Threat Modeling:</strong> During sprint planning, engineers identify potential attack vectors and define mitigation strategies before writing code.
            </li>
            <li>
              <strong>OWASP Top 10 Mitigation:</strong> Strict protection against injection, broken authentication, sensitive data exposure, XML external entities (XXE), and security misconfigurations.
            </li>
            <li>
              <strong>Automated SAST &amp; DAST Scanning:</strong> Code repositories integrate SonarQube, GitHub CodeQL, and Snyk to scan every pull request for vulnerabilities and hardcoded secrets before merging.
            </li>
            <li>
              <strong>Mandatory Peer Reviews:</strong> Production deployments require approval from at least two senior software engineers, verifying architecture integrity and test coverage.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "client-vendor-due-diligence",
      num: "05",
      title: "Enterprise Client Due Diligence & Audit Support",
      content: (
        <>
          <p>
            We regularly collaborate with enterprise procurement and security compliance teams:
          </p>
          <ul>
            <li>
              <strong>Security Questionnaires:</strong> Our security office responds to vendor security assessments (SIG, CAIQ, VSA) within 5 business days.
            </li>
            <li>
              <strong>Data Processing Agreements (DPA):</strong> Standard and custom DPAs available with EU Standard Contractual Clauses (SCCs) for cross-border data protection.
            </li>
            <li>
              <strong>Architecture Whitepapers:</strong> Detailed cloud infrastructure and data flow diagrams available under mutual NDA.
            </li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="public-site legal-page">
      <MetaTitle
        title="SOC & ISO Standards Compliance — Bright Future Soft | Enterprise Security"
        description="Explore Bright Future Soft's enterprise security compliance, ISO/IEC 27001 alignment, SOC 2 Type II trust principles, and Secure Software Development Lifecycle (SSDLC)."
        keywords="SOC 2 software company, ISO 27001 Bangladesh, Bright Future Soft compliance, enterprise software security, SSDLC, OWASP software engineering"
        author="Bright Future Soft"
        ogTitle="SOC & ISO Standards Compliance — Bright Future Soft"
        ogDescription="Verify Bright Future Soft's technical safeguards, ISO 27001 information security controls, and SOC 2 Type II trust principles."
        ogUrl="https://brightfuturesoft.com/compliance"
      />

      {/* HERO SECTION */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">
            <Award className="w-3.5 h-3.5" /> Trust &amp; Standards Center
          </div>
          <h1 className="legal-hero-title">SOC &amp; ISO Standards Compliance</h1>
          <p className="legal-hero-subtitle">
            Demonstrating our institutional commitment to enterprise security, quality management, and international regulatory frameworks across all software services.
          </p>

          <div className="legal-meta-strip">
            <div className="legal-meta-item">
              <span>Primary Frameworks:</span> <strong>ISO 27001, SOC 2, ISO 9001</strong>
            </div>
            <div className="legal-meta-item">
              <span>Data Protection:</span> <strong>GDPR &amp; CCPA Aligned</strong>
            </div>
            <div className="legal-meta-item">
              <span>Security Office:</span> <strong>compliance@brightfuturesoft.com</strong>
            </div>
          </div>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <nav className="bg-white border-b border-[#e1e9f2] sticky top-0 z-30 shadow-xs" aria-label="Legal document switcher">
        <div className="max-w-[1240px] mx-auto px-5 flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2 py-3">
            <Link
              to="/trams-and-conditions"
              className="px-4 py-2 rounded-md text-xs md:text-sm font-semibold text-[#55667c] hover:text-[#0a65b4] hover:bg-[#f1f6fc] transition-colors"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/policy"
              className="px-4 py-2 rounded-md text-xs md:text-sm font-semibold text-[#55667c] hover:text-[#0a65b4] hover:bg-[#f1f6fc] transition-colors"
            >
              Privacy &amp; ISMS Policy
            </Link>
            <Link
              to="/compliance"
              className="px-4 py-2 rounded-md text-xs md:text-sm font-bold bg-[#0a65b4] text-white shadow-xs"
            >
              SOC &amp; ISO Standards
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#728296]">
            <span>Request compliance pack:</span>
            <a
              href="mailto:compliance@brightfuturesoft.com"
              className="font-bold text-[#0a65b4] hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> compliance@brightfuturesoft.com
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT LAYOUT */}
      <div className="legal-container">
        {/* Compliance Pillars Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {standardsPillars.map((p, idx) => (
            <div key={idx} className="bg-white border border-[#e1e9f2] rounded-lg p-6 shadow-xs hover:border-[#0a65b4] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[#eef6fc] text-[#0a65b4] flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <span className="text-[11px] font-bold text-[#0a65b4] uppercase tracking-wider block mb-1">{p.subtitle}</span>
              <h3 className="text-base font-bold text-[#142235] mb-2">{p.title}</h3>
              <p className="text-xs text-[#55667c] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="legal-layout">
          {/* Quick Jump Sidebar */}
          <aside className="legal-sidebar">
            <div className="legal-sidebar-title">Compliance Topics</div>
            <ul className="legal-toc-list">
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="legal-toc-link">
                    {sec.num}. {sec.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-[#edf2f7]">
              <div className="text-xs font-bold text-[#142235] mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#0a65b4]" />
                Security Questionnaire
              </div>
              <p className="text-xs text-[#66758a] leading-relaxed mb-4">
                Need our security response for your vendor risk assessment? Send your questionnaire to our compliance officer.
              </p>
              <a
                href="mailto:compliance@brightfuturesoft.com?subject=Vendor%20Security%20Questionnaire%20Request"
                className="w-full inline-block py-2.5 px-3 bg-[#eef6fc] hover:bg-[#ddebfa] text-[#0a65b4] font-bold text-xs rounded transition-colors text-center"
              >
                Submit Security Questionnaire
              </a>
            </div>
          </aside>

          {/* Legal Main Content */}
          <main className="legal-main-content">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="legal-section">
                <div className="legal-section-header">
                  <div className="legal-section-num">{sec.num}</div>
                  <h2>{sec.title}</h2>
                </div>
                {sec.content}
              </section>
            ))}

            {/* Bottom Support Callout */}
            <div className="mt-10 p-6 bg-[#f8fafd] border border-[#e1e9f2] rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-[#142235]">Looking to Partner with an Enterprise-Ready Software Firm?</h4>
                <p className="text-xs text-[#66758a] mt-1">
                  Schedule a direct conversation with our engineering leads to review your architectural requirements and compliance safeguards.
                </p>
              </div>
              <button
                onClick={() => setSchedule(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a65b4] text-white rounded-md text-xs font-bold hover:bg-[#084e8a] transition-colors whitespace-nowrap"
              >
                Schedule Technical Review
              </button>
            </div>
          </main>
        </div>
      </div>

      {schedule && <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />}
    </div>
  );
};

export default Compliance;

