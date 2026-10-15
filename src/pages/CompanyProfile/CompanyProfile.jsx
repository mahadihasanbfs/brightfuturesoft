import { FiDownload, FiExternalLink } from "react-icons/fi";

const profilePdf = "/company-profile.pdf";

const CompanyProfile = () => (
      <main className="min-h-screen bg-slate-950 px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
            <section className="mx-auto max-w-7xl">
                  <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">BrightFuturesoft</p>
                              <h1 className="text-3xl font-bold sm:text-4xl">Company Profile</h1>
                              <p className="mt-2 max-w-2xl text-slate-300">Learn more about our company, services, and work.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                              <a href={profilePdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 font-medium transition hover:border-sky-400 hover:text-sky-300">
                                    <FiExternalLink aria-hidden="true" /> Open PDF
                              </a>
                              <a href={profilePdf} download="BrightFuturesoft-Company-Profile.pdf" className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 font-medium transition hover:bg-sky-500">
                                    <FiDownload aria-hidden="true" /> Download
                              </a>
                        </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-slate-700 bg-white shadow-2xl">
                        <iframe
                              src={`${profilePdf}#view=FitH`}
                              title="BrightFuturesoft Company Profile PDF"
                              className="h-[72vh] min-h-[520px] w-full"
                        />
                  </div>
                  <p className="mt-3 text-sm text-slate-400">If the PDF does not appear in your browser, use Open PDF or Download.</p>
            </section>
      </main>
);

export default CompanyProfile;
