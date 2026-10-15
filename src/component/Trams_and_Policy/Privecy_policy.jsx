import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaTitle from "../../layout/Title";
import { 
  ShieldCheck, Lock, Eye, Server, 
  CheckCircle2, AlertTriangle, KeyRound, Mail, FileText
} from "lucide-react";
import { CallSchedule } from "../../pages/shared/Header/Header";

const PrivacyISMSPolicy = () => {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'privacy', 'isms'
  const [schedule, setSchedule] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "October 2026";
  const version = "3.2.0 (ISO 27001 / GDPR Aligned)";

  const sections = [
    {
      id: "policy-overview",
      num: "01",
      category: "privacy",
      title: "Commitment to Data Privacy & Security Governance",
      content: (
        <>
          <p>
            At <strong>Bright Future Soft</strong> ("BFS", "we", "our"), protecting the confidentiality, integrity, and privacy of our clients' intellectual assets, source code, and end-user data is our foundational priority.
          </p>
          <p>
            As a software engineering company delivering both custom bespoke solutions for global enterprises and proprietary software products (SaaS, ERP, CRM), we adhere to international data protection regulations including the <strong>General Data Protection Regulation (GDPR)</strong>, the <strong>California Consumer Privacy Act (CCPA)</strong>, and our comprehensive <strong>Information Security Management System (ISMS)</strong> aligned with <strong>ISO/IEC 27001</strong> and <strong>SOC 2 Type II</strong> trust principles.
          </p>
          <div className="legal-callout-box">
            <h4>Our Core Privacy Pledge</h4>
            <p>
              Bright Future Soft does not sell, lease, rent, or trade client source code, customer records, database schematics, or user personal data to any third party under any circumstances.
            </p>
          </div>
        </>
      )
    },
    {
      id: "client-custom-data",
      num: "02",
      category: "privacy",
      title: "Client Project Data & Development Asset Handling",
      content: (
        <>
          <p>
            In the course of providing custom software engineering services, clients may share technical documentation, business workflows, API credentials, and staging environments. We treat all such assets as strictly confidential:
          </p>
          <ul>
            <li>
              <strong>Isolated Repositories:</strong> Each client project is hosted in strictly partitioned, private version-control repositories with branch protections, mandatory pull-request reviews, and multi-factor authentication (MFA).
            </li>
            <li>
              <strong>Data Masking &amp; Anonymization:</strong> Real client production databases are never cloned into local developer environments without automated data anonymization, synthetic data generation, or PII redaction.
            </li>
            <li>
              <strong>Secrets Management:</strong> API keys, server tokens, and certificates are managed via encrypted environment managers (such as AWS Secrets Manager, HashiCorp Vault, or Google Cloud Secret Manager) rather than hardcoded in source code.
            </li>
            <li>
              <strong>Post-Project Sanitization:</strong> Upon project completion and final handover, all temporary staging instances, developer local clones, and access keys are decommissioned according to certified data destruction standards.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "product-user-data",
      num: "03",
      category: "privacy",
      title: "Information Collected Across Software Products & Platforms",
      content: (
        <>
          <p>
            When organizations and end-users utilize Bright Future Soft proprietary software products or website portals, we process specific categories of information:
          </p>
          <ul>
            <li>
              <strong>Account &amp; Identity Information:</strong> Full name, organizational email address, corporate telephone number, company name, and job role used for account provisioning and role-based permissions.
            </li>
            <li>
              <strong>Authentication &amp; Security Data:</strong> Encrypted password hashes (Argon2 / bcrypt), session tokens, SSO assertions, and access timestamps.
            </li>
            <li>
              <strong>Telemetry &amp; Audit Logs:</strong> System event logs, API throughput, IP addresses, browser agents, and error stack traces recorded strictly for service reliability, load balancing, and threat prevention.
            </li>
            <li>
              <strong>Payment Data:</strong> Financial transactions are processed directly by certified Level 1 PCI-DSS payment gateways. BFS does not store full credit card numbers or security CVVs on our servers.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "isms-governance",
      num: "04",
      category: "isms",
      title: "ISMS Framework & Security Governance (ISO 27001)",
      content: (
        <>
          <p>
            Our Information Security Management System (ISMS) operates under direct oversight of the executive leadership and technical security leads. The ISMS governs all corporate infrastructure, client development environments, and cloud product deployments:
          </p>
          <div className="compliance-pillars-grid">
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <KeyRound className="w-5 h-5" />
              </div>
              <h4>Role-Based Access Control (RBAC)</h4>
              <p>Strict principle of least privilege. Engineers only receive access to repositories and staging servers required for their active sprint assignments.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <Lock className="w-5 h-5" />
              </div>
              <h4>Enterprise Encryption</h4>
              <p>All data in transit is protected using TLS 1.3 with modern cipher suites. Data at rest is encrypted using AES-256 across all databases and block storage.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <Server className="w-5 h-5" />
              </div>
              <h4>Isolated Cloud Perimeters</h4>
              <p>Dedicated Virtual Private Clouds (VPCs), Web Application Firewalls (WAF), automated DDoS mitigation, and continuous perimeter monitoring.</p>
            </div>
            <div className="compliance-pillar-card">
              <div className="compliance-pillar-icon">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4>Automated CI/CD Security</h4>
              <p>Static Application Security Testing (SAST), automated container vulnerability scans, and continuous secrets detection prior to any production deployment.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: "risk-assessment",
      num: "05",
      category: "isms",
      title: "Risk Assessment, Vulnerability Management & Patching",
      content: (
        <>
          <p>
            We maintain a dynamic, risk-based vulnerability management lifecycle:
          </p>
          <ul>
            <li>
              <strong>Continuous Dependency Auditing:</strong> Automated tools (including Dependabot, Snyk, and SonarQube) audit software libraries against Common Vulnerabilities and Exposures (CVE) databases.
            </li>
            <li>
              <strong>SLA on Security Patches:</strong> Critical security vulnerabilities are patched within 24 to 48 hours of public advisory release; high-severity patches within 7 business days.
            </li>
            <li>
              <strong>Penetration Testing:</strong> Proprietary software products undergo scheduled internal code audits and external third-party penetration tests.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "incident-response",
      num: "06",
      category: "isms",
      title: "Security Incident Response & Client Notification Protocol",
      content: (
        <>
          <p>
            Bright Future Soft maintains a formal <strong>Security Incident Response Plan (SIRP)</strong>:
          </p>
          <ul>
            <li>
              <strong>Detection &amp; Containment:</strong> Real-time monitoring and intrusion detection systems trigger immediate automated containment protocols.
            </li>
            <li>
              <strong>Client Notification SLA:</strong> In the event of a verified breach or unauthorized access affecting client systems or data, Bright Future Soft commits to notifying affected clients within <strong>48 hours</strong> of verification with preliminary remediation findings.
            </li>
            <li>
              <strong>Root Cause Analysis (RCA):</strong> A comprehensive post-incident analysis is prepared detailing corrective actions, patched attack vectors, and long-term security reinforcements.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "data-rights",
      num: "07",
      category: "privacy",
      title: "User Rights, GDPR Compliance & Data Portability",
      content: (
        <>
          <p>
            Under GDPR, CCPA, and applicable global privacy laws, data subjects whose personal data is processed by Bright Future Soft retain key rights:
          </p>
          <ul>
            <li><strong>Right to Access &amp; Portability:</strong> Request an export of your personal information in a structured, machine-readable format.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete profile records.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of personal records where there is no overriding statutory requirement for retention.</li>
            <li><strong>Right to Restrict or Object:</strong> Opt out of non-essential communications, analytics cookies, or promotional notices.</li>
          </ul>
          <p>
            To exercise your rights, contact our Data Protection Officer at <a href="mailto:privacy@brightfuturesoft.com" className="text-[#0a65b4] font-bold hover:underline">privacy@brightfuturesoft.com</a>.
          </p>
        </>
      )
    },
    {
      id: "employee-vetting",
      num: "08",
      category: "isms",
      title: "Human Resources Security & Staff Training",
      content: (
        <>
          <p>
            People are the first line of defense in our security posture:
          </p>
          <ul>
            <li>
              <strong>Pre-Employment Verification:</strong> Background checks, identity authentication, and reference verifications are completed before onboarding.
            </li>
            <li>
              <strong>Mandatory NDAs:</strong> All engineers, product designers, and operations staff execute comprehensive Non-Disclosure Agreements as a condition of employment.
            </li>
            <li>
              <strong>Ongoing Cybersecurity Training:</strong> Regular interactive training sessions covering social engineering, phishing defense, zero-trust hygiene, and secure coding practices.
            </li>
          </ul>
        </>
      )
    }
  ];

  const filteredSections = activeTab === "all" 
    ? sections 
    : sections.filter(s => s.category === activeTab);

  return (
    <div className="public-site legal-page">
      <MetaTitle
        title="Privacy & ISMS Policy — Bright Future Soft | ISO 27001 & SOC 2 Aligned"
        description="Review Bright Future Soft's Information Security Management System (ISMS) and Data Privacy Policy governing client software source code, project confidentiality, and cloud security."
        keywords="Bright Future Soft privacy policy, ISMS policy statement, ISO 27001 software company, SOC 2 compliance, client data security, software NDA"
        author="Bright Future Soft"
        ogTitle="Privacy & ISMS Policy Statement — Bright Future Soft"
        ogDescription="Learn how Bright Future Soft protects client code, proprietary databases, and enterprise data through our ISO 27001 aligned Information Security Management System."
        ogUrl="https://brightfuturesoft.com/policy"
      />

      {/* HERO SECTION */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">
            <ShieldCheck className="w-3.5 h-3.5" /> Security &amp; Data Governance
          </div>
          <h1 className="legal-hero-title">Privacy &amp; ISMS Policy Statement</h1>
          <p className="legal-hero-subtitle">
            Detailing our technical safeguards, confidentiality protocols, and Information Security Management System (ISMS) protecting client code and software products.
          </p>

          <div className="legal-meta-strip">
            <div className="legal-meta-item">
              <span>Security Version:</span> <strong>{version}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Audited:</span> <strong>{lastUpdated}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Frameworks:</span> <strong>ISO 27001 &amp; SOC 2 Aligned</strong>
            </div>
            <div className="legal-meta-item">
              <span>Data Protection Officer:</span> <strong>dpo@brightfuturesoft.com</strong>
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
              className="px-4 py-2 rounded-md text-xs md:text-sm font-bold bg-[#0a65b4] text-white shadow-xs"
            >
              Privacy &amp; ISMS Policy
            </Link>
            <Link
              to="/compliance"
              className="px-4 py-2 rounded-md text-xs md:text-sm font-semibold text-[#55667c] hover:text-[#0a65b4] hover:bg-[#f1f6fc] transition-colors"
            >
              SOC &amp; ISO Standards
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-[#728296] mr-2">Filter View:</span>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === "all" ? "bg-[#eef6fc] text-[#0a65b4]" : "text-[#55667c] hover:bg-slate-100"}`}
            >
              All Sections
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === "privacy" ? "bg-[#eef6fc] text-[#0a65b4]" : "text-[#55667c] hover:bg-slate-100"}`}
            >
              Privacy Focus
            </button>
            <button
              onClick={() => setActiveTab("isms")}
              className={`px-3 py-1 text-xs font-bold rounded ${activeTab === "isms" ? "bg-[#eef6fc] text-[#0a65b4]" : "text-[#55667c] hover:bg-slate-100"}`}
            >
              ISMS Security
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT LAYOUT */}
      <div className="legal-container">
        <div className="legal-layout">
          {/* Quick Jump Sidebar */}
          <aside className="legal-sidebar">
            <div className="legal-sidebar-title">Policy Sections</div>
            <ul className="legal-toc-list">
              {filteredSections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className="legal-toc-link">
                    {sec.num}. {sec.title}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-5 border-t border-[#edf2f7]">
              <div className="text-xs font-bold text-[#142235] mb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#0a65b4]" />
                NDA Verification
              </div>
              <p className="text-xs text-[#66758a] leading-relaxed mb-4">
                We sign bilateral NDAs before discussing your project architecture, database models, or proprietary code.
              </p>
              <button
                onClick={() => setSchedule(true)}
                className="w-full py-2.5 px-3 bg-[#eef6fc] hover:bg-[#ddebfa] text-[#0a65b4] font-bold text-xs rounded transition-colors text-center"
              >
                Request Security Briefing
              </button>
            </div>
          </aside>

          {/* Legal Main Content */}
          <main className="legal-main-content">
            {filteredSections.map((sec) => (
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
                <h4 className="text-base font-bold text-[#142235]">Require a Custom Data Protection Agreement (DPA)?</h4>
                <p className="text-xs text-[#66758a] mt-1">
                  Our compliance team provides custom GDPR Data Processing Agreements and vendor risk assessment documentation for enterprise clients.
                </p>
              </div>
              <a
                href="mailto:security@brightfuturesoft.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a65b4] text-white rounded-md text-xs font-bold hover:bg-[#084e8a] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" /> Contact Security Office
              </a>
            </div>
          </main>
        </div>
      </div>

      {schedule && <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />}
    </div>
  );
};

export default PrivacyISMSPolicy;
