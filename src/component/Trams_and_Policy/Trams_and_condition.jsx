import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaTitle from "../../layout/Title";
import { 
  FileText, ShieldCheck, Award, Calendar, 
  CheckCircle2, ArrowRight, ExternalLink, HelpCircle, Mail
} from "lucide-react";
import { CallSchedule } from "../../pages/shared/Header/Header";

const TermsAndConditions = () => {
  const [schedule, setSchedule] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "October 2026";
  const effectiveDate = "January 1, 2024";

  const sections = [
    {
      id: "scope-acceptance",
      num: "01",
      title: "Preamble & Scope of Agreement",
      content: (
        <>
          <p>
            Welcome to <strong>Bright Future Soft</strong> ("BFS", "Company", "we", "our", or "us"). Bright Future Soft is a premier software engineering firm incorporated in Bangladesh, providing custom enterprise software development services to global clients, as well as developing, licensing, and hosting proprietary commercial software products (including SaaS platforms, ERP systems, CRM suites, and intelligent AI tools).
          </p>
          <p>
            These Terms &amp; Conditions ("Terms") constitute a legally binding agreement between Bright Future Soft and the client, organization, or individual ("Client", "Subscriber", "User", or "you") accessing our services, commissioning custom development, or subscribing to our software products.
          </p>
          <div className="legal-callout-box">
            <h4>Dual Operational Scope</h4>
            <p>
              These Terms cover two distinct service streams: <strong>(1) Custom Client Software Engineering</strong> performed under Statements of Work (SOWs), and <strong>(2) Proprietary Software Products &amp; SaaS Platforms</strong> provided on a subscription or licensed basis.
            </p>
          </div>
        </>
      )
    },
    {
      id: "custom-development",
      num: "02",
      title: "Client Custom Software Engineering Services",
      content: (
        <>
          <p>
            When Bright Future Soft provides bespoke software engineering, architecture, cloud setup, or integration services for a client, the specific project deliverables, timelines, milestones, and costs are set forth in mutually agreed <strong>Statements of Work (SOW)</strong> or Master Services Agreements (MSA).
          </p>
          <h3>Milestones, Acceptance &amp; Sign-off</h3>
          <ul>
            <li>
              <strong>Sprint &amp; Milestone Deliveries:</strong> Work is delivered in agreed agile sprints or phase milestones. Clients are given an inspection and User Acceptance Testing (UAT) window (typically 7 to 10 business days) to review deliveries against the agreed specifications.
            </li>
            <li>
              <strong>Acceptance Protocol:</strong> If no written feedback or defect reports are submitted within the acceptance window, deliverables are deemed accepted.
            </li>
            <li>
              <strong>Change Requests (Scope Adjustments):</strong> If the client requests modifications, new features, or architectural alterations outside the agreed SOW, BFS will provide a formal Change Request (CR) document detailing impact on timelines and costs prior to implementation.
            </li>
          </ul>

          <h3>Source Code Handover &amp; Intellectual Property Transfer</h3>
          <p>
            Upon receipt of 100% full and final payment for the custom software development project:
          </p>
          <ul>
            <li>
              <strong>Client IP Ownership:</strong> Bright Future Soft irrevocably transfers and assigns to the client all proprietary rights, title, copyright, and interest in the unique bespoke software, source code, database structures, UI designs, and business workflows created specifically for the client.
            </li>
            <li>
              <strong>Repository &amp; Asset Handover:</strong> We provide full repository access (e.g., GitHub, GitLab), administrative credentials, deployment scripts, architecture documentation, and cloud resource handovers.
            </li>
            <li>
              <strong>BFS Background Technology:</strong> BFS retains ownership of pre-existing development frameworks, standard utility libraries, and developer tools incorporated into the work, granting the client a perpetual, royalty-free, irrevocable, worldwide license to use and modify them as part of their delivered software.
            </li>
          </ul>

          <h3>Post-Launch Bug-Fix Warranty</h3>
          <p>
            Custom software projects include a standard <strong>30 to 60-day post-deployment warranty</strong> during which BFS fixes reproducible software defects or bugs arising from original scope specifications at zero additional charge. Ongoing feature updates, OS migrations, or third-party API changes are covered under separate Maintenance Service Level Agreements (SLAs).
          </p>
        </>
      )
    },
    {
      id: "software-products",
      num: "03",
      title: "Proprietary Software Products & SaaS Licensing",
      content: (
        <>
          <p>
            For customers subscribing to Bright Future Soft's proprietary software products (such as our ERP modules, CRM solutions, POS suites, or AI tools):
          </p>
          <ul>
            <li>
              <strong>Subscription License:</strong> BFS grants you a non-exclusive, non-transferable, revocable right to access and use the software in accordance with your chosen subscription tier and purchased user seats.
            </li>
            <li>
              <strong>Uptime &amp; Service Availability:</strong> We target a <strong>99.9% service uptime</strong> for our cloud-hosted SaaS products, excluding scheduled maintenance windows announced in advance.
            </li>
            <li>
              <strong>Acceptable Use:</strong> Users agree not to reverse engineer, decompile, resell, white-label without authorization, or perform unauthorized security penetration tests against BFS production infrastructure.
            </li>
            <li>
              <strong>Subscription Renewal &amp; Cancellation:</strong> Subscriptions renew automatically at the end of each billing cycle (monthly or annually) unless canceled prior to renewal. Upon cancellation, data export assistance is provided for up to 30 days before secure account decommissioning.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "commercial-payments",
      num: "04",
      title: "Fees, Invoicing & Commercial Terms",
      content: (
        <>
          <p>
            All fees are quoted in USD, BDT, or EUR as indicated on official project proposals, formal contracts, or digital invoices.
          </p>
          <ul>
            <li>
              <strong>Custom Development Payments:</strong> Typically structured around an initial project kickoff deposit, followed by milestone progress payments tied to verified deliverables, and a final sign-off milestone.
            </li>
            <li>
              <strong>Payment Methods:</strong> We accept international bank wire transfers (SWIFT), corporate credit cards, ACH, and approved regional payment gateways.
            </li>
            <li>
              <strong>Taxes &amp; Duties:</strong> Unless stated otherwise, prices are exclusive of local VAT, withholding taxes, or governmental duties applicable in the client's jurisdiction, which remain the client's responsibility.
            </li>
            <li>
              <strong>Late Payments:</strong> Invoices overdue by more than 15 business days may lead to temporary suspension of active engineering sprints or deployment pipelines after formal notification.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "confidentiality-data",
      num: "05",
      title: "Confidentiality & Non-Disclosure (NDA)",
      content: (
        <>
          <p>
            Mutual confidentiality is fundamental to our enterprise engineering relationships. Both Bright Future Soft and the Client agree to hold in strict confidence all proprietary data, business processes, source code, trade secrets, financial records, and client customer data.
          </p>
          <ul>
            <li>
              <strong>Non-Disclosure Execution:</strong> BFS routinely executes bilateral Non-Disclosure Agreements (NDAs) prior to receiving proprietary client code, API access, or sensitive database schematics.
            </li>
            <li>
              <strong>Developer Vetting:</strong> All BFS employees, software engineers, and QA specialists work under binding confidentiality clauses, background clearances, and strict role-based access controls.
            </li>
            <li>
              <strong>Staging &amp; Test Data Sanitization:</strong> Client production databases must never be imported into local development environments without prior anonymization and data masking.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "warranties-liability",
      num: "06",
      title: "Warranties, Disclaimers & Limitation of Liability",
      content: (
        <>
          <p>
            Bright Future Soft warrants that custom software services will be performed with professional diligence, industry-standard craftsmanship, and in accordance with agreed specifications.
          </p>
          <div className="legal-callout-box">
            <h4>Limitation of Indirect Damages</h4>
            <p>
              To the maximum extent permitted by applicable law, neither party shall be liable for indirect, incidental, punitive, or consequential damages (including loss of prospective business profits, loss of anticipated revenue, or third-party cloud service disruptions). Bright Future Soft's total aggregate liability arising out of any specific custom project or subscription shall not exceed the total amount actually paid by the client under the applicable Statement of Work during the preceding 6 months.
            </p>
          </div>
        </>
      )
    },
    {
      id: "termination",
      num: "07",
      title: "Project Termination & Orderly Exit Procedure",
      content: (
        <>
          <p>
            Either party may terminate an active services contract upon 30 days written notice if the other party breaches material terms and fails to cure such breach within 15 days of notice.
          </p>
          <ul>
            <li>
              <strong>Work-in-Progress Settlement:</strong> In the event of early termination, the client pays for all verified milestone hours or completed sprint deliverables up to the termination date.
            </li>
            <li>
              <strong>Orderly Handover:</strong> Upon settlement, BFS delivers all completed source code, documentation, assets, and cloud configurations created up to the effective termination date.
            </li>
          </ul>
        </>
      )
    },
    {
      id: "governing-law",
      num: "08",
      title: "Governing Law & Dispute Resolution",
      content: (
        <>
          <p>
            These Terms and any project SOWs are governed by and construed in accordance with the laws of <strong>Bangladesh</strong> and internationally recognized commercial dispute standards.
          </p>
          <p>
            In the event of any disagreement or dispute, both parties commit to engaging in good-faith executive consultations for a minimum of 30 days before initiating formal arbitration or legal proceedings in Dhaka, Bangladesh or mutually agreed neutral international arbitration bodies.
          </p>
        </>
      )
    }
  ];

  return (
    <div className="public-site legal-page">
      <MetaTitle
        title="Terms & Conditions — Bright Future Soft | Enterprise Software Engineering"
        description="Official terms of service governing Bright Future Soft's custom software development services, client SOWs, IP source code ownership, and proprietary software products."
        keywords="Bright Future Soft terms, software development terms, custom software contract, SaaS terms, client IP ownership, software SLA"
        author="Bright Future Soft"
        ogTitle="Terms & Conditions — Bright Future Soft"
        ogDescription="Review the terms governing client custom software development, source code ownership transfer, and proprietary SaaS platforms at Bright Future Soft."
        ogUrl="https://brightfuturesoft.com/trams-and-conditions"
      />

      {/* HERO SECTION */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <div className="legal-hero-eyebrow">
            <FileText className="w-3.5 h-3.5" /> Legal &amp; Commercial Terms
          </div>
          <h1 className="legal-hero-title">Terms &amp; Conditions of Service</h1>
          <p className="legal-hero-subtitle">
            Governing our custom software engineering partnerships, client intellectual property transfers, and proprietary software products.
          </p>

          <div className="legal-meta-strip">
            <div className="legal-meta-item">
              <span>Last Revised:</span> <strong>{lastUpdated}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Effective Since:</span> <strong>{effectiveDate}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Entity:</span> <strong>Bright Future Soft Ltd.</strong>
            </div>
            <div className="legal-meta-item">
              <span>Applicability:</span> <strong>Custom Development &amp; SaaS Products</strong>
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
              className="px-4 py-2 rounded-md text-xs md:text-sm font-bold bg-[#0a65b4] text-white shadow-xs"
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
              className="px-4 py-2 rounded-md text-xs md:text-sm font-semibold text-[#55667c] hover:text-[#0a65b4] hover:bg-[#f1f6fc] transition-colors"
            >
              SOC &amp; ISO Standards
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#728296]">
            <span>Need legal assistance?</span>
            <a
              href="mailto:legal@brightfuturesoft.com"
              className="font-bold text-[#0a65b4] hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> legal@brightfuturesoft.com
            </a>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT LAYOUT */}
      <div className="legal-container">
        <div className="legal-layout">
          {/* Quick Jump Sidebar */}
          <aside className="legal-sidebar">
            <div className="legal-sidebar-title">Table of Contents</div>
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
                <ShieldCheck className="w-4 h-4 text-[#0a65b4]" />
                Client IP Commitment
              </div>
              <p className="text-xs text-[#66758a] leading-relaxed mb-4">
                100% of custom code, designs, and database architectures developed for your project belong exclusively to your business.
              </p>
              <button
                onClick={() => setSchedule(true)}
                className="w-full py-2.5 px-3 bg-[#eef6fc] hover:bg-[#ddebfa] text-[#0a65b4] font-bold text-xs rounded transition-colors text-center"
              >
                Schedule Contract Consultation
              </button>
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
                <h4 className="text-base font-bold text-[#142235]">Have Questions Regarding Contracts or IP?</h4>
                <p className="text-xs text-[#66758a] mt-1">
                  Our commercial team is available to review custom MSAs, non-disclosure agreements, and service level agreements.
                </p>
              </div>
              <a
                href="mailto:legal@brightfuturesoft.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a65b4] text-white rounded-md text-xs font-bold hover:bg-[#084e8a] transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" /> Contact Legal Counsel
              </a>
            </div>
          </main>
        </div>
      </div>

      {schedule && <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />}
    </div>
  );
};

export default TermsAndConditions;
