import { useEffect, useState } from "react"
import MetaTitle, { base_url } from "../../layout/Title"
import moduleName from "../../Assctes/logo.png"
import JobCard from "./Card"
import News_Letter from "../Testimonials/Testimonials/News_Letter"

const Job = () => {
      const [jobList, setJobList] = useState([])
      const [loading, setLoading] = useState(true)
      const [error, setError] = useState(null)

      useEffect(() => {
            window.scrollTo(0, 0)
      }, [])

      useEffect(() => {
            const fetchJobs = async () => {
                  try {
                        setLoading(true)
                        const response = await fetch(`${base_url}/job-post/all-job`)
                        if (!response.ok) {
                              throw new Error("Failed to fetch jobs")
                        }
                        const data = await response.json()
                        setJobList(data.data || [])
                  } catch (err) {
                        setError(err.message)
                  } finally {
                        setLoading(false)
                  }
            }

            fetchJobs()
      }, [])

      // Build JSON-LD structured data for organization and job postings
      const organizationSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Bright Future Soft",
            "url": "https://www.brightfuturesoft.com",
            "logo": "https://www.brightfuturesoft.com/logo.png"
      }

      const jobPostings = jobList && jobList.length > 0 ? jobList.map((job) => {
            return {
                  "@type": "JobPosting",
                  "title": job?.job_title || job?.title || "Job Opening at Bright Future Soft",
                  "description": job?.short_description || job?.description || "Join Bright Future Soft and work on innovative projects.",
                  "datePosted": job?.createdAt || job?.date || new Date().toISOString(),
                  "employmentType": job?.employment_type || job?.employmentType || "FULL_TIME",
                  "hiringOrganization": {
                        "@type": "Organization",
                        "name": "Bright Future Soft",
                        "sameAs": "https://www.brightfuturesoft.com"
                  },
                  "jobLocation": {
                        "@type": "Place",
                        "address": {
                              "@type": "PostalAddress",
                              "addressLocality": job?.location || "Dhaka",
                              "addressCountry": job?.country || "BD"
                        }
                  }
            }
      }) : []

      const schema = {
            "@context": "https://schema.org",
            "@graph": [organizationSchema, ...jobPostings]
      }

      return (
            <div className="min-h-screen bg-gray-900">
                  <MetaTitle
                        title="Careers — Join Bright Future Soft | Software Jobs in Bangladesh"
                        description="Explore curated job openings at Bright Future Soft — a leading software company in Bangladesh. Apply to work on web, mobile, AI and enterprise solutions. Competitive salaries, remote options, and a growth-oriented culture."
                        keywords="Bright Future Soft careers, software jobs Bangladesh, web developer jobs, mobile developer jobs, AI jobs, remote software jobs"
                        author="Bright Future Soft"
                        ogTitle="Careers at Bright Future Soft — We're hiring top tech talent"
                        ogDescription="Explore open positions at Bright Future Soft. Work on impactful products, flexible work options, and career growth in software development, AI, and cloud solutions."
                        ogImage={moduleName}
                        ogUrl="https://www.brightfuturesoft.com/careers"
                        schema={schema}
                  />

                  {/* Hero Section */}
                  <div className="relative overflow-hidden bg-gray-900">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20"></div>
                        <div className="relative px-4 py-20 mx-auto max-w-7xl lg:px-8">
                              {/* Background Text */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-5">
                                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white whitespace-nowrap">CAREERS</h1>
                              </div>

                              {/* Main Content */}
                              <div className="relative z-10 text-center">
                                    <div className="mb-8">
                                          <span className="inline-block px-4 py-2 text-sm font-semibold text-purple-300 bg-purple-900/30 rounded-full border border-purple-500/30">
                                                🚀 We're Hiring
                                          </span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                          Build Your
                                          <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                                Bright Future
                                          </span>
                                    </h1>

                                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                                          Join a team that values talent, dedication, and growth. We don't just hire degrees or experience – we hire
                                          passion and potential.
                                    </p>


                              </div>
                        </div>
                  </div>

                  {/* Jobs Section */}
                  <div className="px-4 py-16 mx-auto max-w-7xl lg:px-8">
                        <div className="text-center mb-12">
                              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Open Positions</h2>
                              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                    Discover exciting opportunities to grow your career with us
                              </p>
                        </div>

                        {/* Loading State */}
                        {loading && (
                              <div className="flex flex-col gap-4">
                                    <div className=''>
                                          <div className='lg:grid grid-cols-3 text-white justify-center border border-gray-500 items-center py-6 px-6 rounded'>
                                                <div className='h-8 bg-gray-700 rounded w-2/3 pl-8'></div>
                                                <div className='flex gap-4 justify-start pl-8 mt-4 md:mt-0 md:pl-0 md:justify-end '>
                                                      <div className='h-6 bg-gray-700 rounded w-24'></div>
                                                      <span className='font-extrabold text-gray-700'>-</span>
                                                      <div className='h-6 bg-gray-700 rounded w-24'></div>
                                                </div>
                                                <div className='flex pl-8 md:pl-0 lg:justify-end mt-4 md:mt-0'>
                                                      <div className="rounded w-40 h-12 bg-gray-700"></div>
                                                </div>
                                          </div>
                                    </div>
                                    <div className=''>
                                          <div className='lg:grid grid-cols-3 text-white justify-center border border-gray-500 items-center py-6 px-6 rounded'>
                                                <div className='h-8 bg-gray-700 rounded w-2/3 pl-8'></div>
                                                <div className='flex gap-4 justify-start pl-8 mt-4 md:mt-0 md:pl-0 md:justify-end '>
                                                      <div className='h-6 bg-gray-700 rounded w-24'></div>
                                                      <span className='font-extrabold text-gray-700'>-</span>
                                                      <div className='h-6 bg-gray-700 rounded w-24'></div>
                                                </div>
                                                <div className='flex pl-8 md:pl-0 lg:justify-end mt-4 md:mt-0'>
                                                      <div className="rounded w-40 h-12 bg-gray-700"></div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        )}

                        {/* Error State */}
                        {error && (
                              <div className="text-center py-20">
                                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
                                          <div className="text-red-400 text-lg font-semibold mb-2">Unable to load positions</div>
                                          <div className="text-red-300 text-sm">{error}</div>
                                    </div>
                              </div>
                        )}

                        {/* Jobs Grid */}
                        {!loading && !error && (
                              <>
                                    {jobList.length > 0 ? (
                                          <div className="space-y-8">
                                                {jobList.map((job, index) => (
                                                      <JobCard key={job._id || index} data={job} />
                                                ))}
                                          </div>
                                    ) : (
                                          <div className="text-center py-20">
                                                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                                                      <div className="text-6xl mb-4">🚀</div>
                                                      <h3 className="text-xl font-semibold text-white mb-2">No Open Positions</h3>
                                                      <p className="text-gray-400">
                                                            We're not actively hiring right now, but we're always interested in connecting with talented
                                                            individuals.
                                                      </p>
                                                      <button className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                                                            Join Our Talent Pool
                                                      </button>
                                                </div>
                                          </div>
                                    )}
                              </>
                        )}
                  </div>


                  <News_Letter />
            </div>
      )
}

export default Job
