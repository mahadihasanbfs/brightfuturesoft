

import { useState } from "react"

const FAQ = () => {
      const [openIndex, setOpenIndex] = useState(null)

      const faqs = [
            {
                  question: "What is the application process?",
                  answer:
                        "Our application process consists of: 1) Online application submission, 2) Initial screening call, 3) Technical assessment, 4) Final interview with the team, 5) Reference check and offer. The entire process typically takes 1-2 weeks.",
            },
            {
                  question: "Do you hire remote developers?",
                  answer:
                        "Yes! We're a remote-first company. All our positions are fully remote, though we do have optional co-working spaces available. We believe in hiring the best talent regardless of location.",
            },
            {
                  question: "What are the working hours?",
                  answer:
                        "Our standard working hours are 2:00 PM to 10:00 PM Bangladesh Time. This allows for good overlap with international clients while maintaining work-life balance. We offer flexible break times within this schedule.",
            },
            {
                  question: "Do you provide training and mentorship?",
                  answer:
                        "We have a structured mentorship program where senior developers guide junior team members. We also provide access to online courses, workshops, and conference attendance to support your professional growth.",
            },
            {
                  question: "What technologies do you work with?",
                  answer:
                        "We primarily work with React.js, Next.js, React Native for frontend, Node.js and GraphQL for backend, and MongoDB/PostgreSQL for databases. We're always exploring new technologies and encourage learning.",
            },
            {
                  question: "How do you evaluate candidates?",
                  answer:
                        "We focus on practical skills over formal education. We evaluate based on: coding ability, problem-solving skills, communication, teamwork, and willingness to learn. Portfolio projects and real-world experience matter more than degrees.",
            },
            {
                  question: "What benefits do you offer?",
                  answer:
                        "We offer competitive salaries, health insurance, paid time off, professional development budget, performance bonuses, flexible working arrangements, and a supportive team environment focused on growth.",
            },
            {
                  question: "Can I apply if I'm a fresher?",
                  answer:
                        "Yes! While we prefer 1.5-3 years of experience, we welcome applications from talented freshers who can demonstrate their skills through projects, contributions, or self-learning. Passion and potential matter more than years of experience.",
            },
      ]

      const toggleFAQ = (index) => {
            setOpenIndex(openIndex === index ? null : index)
      }

      return (
            <div className="px-4 py-16 mx-auto max-w-4xl lg:px-8">
                  <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-400">
                              Got questions? We've got answers. Here are the most common questions about working with us.
                        </p>
                  </div>

                  <div className="space-y-4">
                        {faqs.map((faq, index) => (
                              <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                                    <button
                                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                                          onClick={() => toggleFAQ(index)}
                                    >
                                          <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                                          <svg
                                                className={`w-5 h-5 text-gray-400 transform transition-transform ${openIndex === index ? "rotate-180" : ""
                                                      }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                          >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                    </button>
                                    {openIndex === index && (
                                          <div className="px-6 pb-4">
                                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                          </div>
                                    )}
                              </div>
                        ))}
                  </div>

                  <div className="mt-12 text-center">
                        <p className="text-gray-400 mb-4">Still have questions?</p>
                        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
                              Contact Our HR Team
                        </button>
                  </div>
            </div>
      )
}

export default FAQ
