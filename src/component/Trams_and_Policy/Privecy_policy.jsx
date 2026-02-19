import { useState } from "react"
import mahadi from '../../Assctes/teamMember/mahadi.jpg';
import hadi from '../../Assctes/teamMember/mohotasimhadi.jpeg';
import maruf from '../../Assctes/teamMember/mahady.png'
import { CallSchedule } from "../../pages/shared/Header/Header";


const PrivacyISMSPolicy = () => {
      const [activeTab, setActiveTab] = useState("privacy")
      const [schedule, setSchedule] = useState(false)

      return (
            <section className="py-10 bg-gradient-to-b from-gray-900 to-gray-800 sm:pt-16 lg:pt-24">
                  <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                        <section className="py-12  text-gray-100 min-h-screen">
                              <div className="">
                                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                          <div className="text-center border-b border-gray-700 p-6">
                                                <h1 className="text-3xl font-bold text-blue-400">Privacy Policy & ISMS Policy Statement</h1>
                                                <p className="mt-2 text-gray-400">
                                                      Our commitment to protecting your privacy and ensuring information security
                                                </p>
                                          </div>

                                          <div className="flex border-b border-gray-700">
                                                <button
                                                      onClick={() => setActiveTab("privacy")}
                                                      className={`flex-1 py-3 px-4 text-center font-semibold ${activeTab === "privacy" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                            }`}
                                                >
                                                      {/* <Eye className="inline-block w-5 h-5 mr-2" /> */}
                                                      Privacy and Policies
                                                </button>
                                                <button
                                                      onClick={() => setActiveTab("isms")}
                                                      className={`flex-1 py-3 px-4 text-center font-semibold ${activeTab === "isms" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                            }`}
                                                >
                                                      {/* <Shield className="inline-block w-5 h-5 mr-2" /> */}
                                                      ISMS Policy
                                                </button>
                                          </div>

                                          <div className="p-6">
                                                <div className=" pr-4 space-y-8">
                                                      {(activeTab === "privacy" ? privacyData : ismsData).map((item, index) => (
                                                            <div key={index} className="border-b border-gray-700 pb-6 last:border-b-0">
                                                                  <h2 className="text-xl font-semibold text-blue-400 mb-3">{item.title}</h2>
                                                                  <div className="text-gray-300 text-sm leading-relaxed">{item.content}</div>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    </div>

                              </div>
                              <div className=" mt-8 overflow-hidden text-center bg-gray-300 sm:mt-12 rounded-xl">
                                    <div className="px-6 py-12 sm:p-12">
                                          <div className="max-w-sm mx-auto">
                                                <div className="relative z-0 flex items-center justify-center -space-x-2 ">
                                                      <img
                                                            className="relative z-10 inline-block rounded-full w-14 h-14 ring-4 ring-gray-100"
                                                            src={hadi}
                                                            alt=""
                                                      />
                                                      <img
                                                            className="relative z-30 inline-block w-16 h-16 rounded-full ring-4 ring-gray-100"
                                                            src={mahadi}
                                                            alt=""
                                                      />
                                                      <img
                                                            className="relative z-10 inline-block rounded-full w-14 h-14 ring-4 ring-gray-100 object-cover"
                                                            src="https://sever.brightfuturesoft.com/api/v2/image/6992cacb2a443b2a8e29a55d"
                                                            alt=""
                                                      />
                                                </div>

                                                <h3 className="mt-6 text-2xl font-semibold text-gray-900">Still have questions?</h3>
                                                <p className="mt-2 text-base font-normal text-gray-600">
                                                      Can't find the answer you're looking for? Please chat with our friendly team.
                                                </p>
                                                <div className="mt-6">
                                                      <button
                                                            onClick={() => setSchedule(true)}
                                                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                                                            role="button"
                                                      >
                                                            Start free for consultancy
                                                      </button>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </section>
                  </div>


                  {schedule && <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />}
            </section>
      )
}

const privacyData = [
      {
            title: "Information We Collect",
            content:
                  "We collect personal information that you provide directly to us, such as your name, email address, and usage data when you use our services. This may include information you provide when you register for an account, subscribe to our services, or contact our support team. We also automatically collect certain information about your device and how you interact with our services, including IP address, browser type, and pages visited.",
      },
      {
            title: "How We Use Your Information",
            content:
                  "We use your information to provide and improve our services, communicate with you, and comply with legal obligations. This includes using your data to personalize your experience, process transactions, send you important notices, and analyze how our services are used. We may also use your information for marketing purposes, but you can opt out of these communications at any time.",
      },
      {
            title: "Data Sharing and Disclosure",
            content:
                  "We may share your information with third-party service providers who perform services on our behalf, subject to confidentiality agreements. These service providers are only authorized to use your personal information as necessary to provide services to us. We may also disclose your information if required by law, in response to legal process, or to protect our rights, privacy, safety, or property.",
      },
      {
            title: "Your Rights and Choices",
            content:
                  "You have the right to access, correct, or delete your personal information. You can also opt out of certain data processing activities. To exercise these rights, please contact our Data Protection Officer. Please note that some of these rights may be limited where we have compelling legitimate grounds or legal obligations to continue processing your personal data.",
      },
      {
            title: "Data Security",
            content:
                  "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure. This includes encryption of data in transit and at rest, regular security assessments, and strict access controls. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.",
      },
      {
            title: "Changes to This Policy",
            content:
                  "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this policy. We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our services after we post any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.",
      },
]

const ismsData = [
      {
            title: "Scope of the ISMS",
            content:
                  "Our Information Security Management System (ISMS) covers all aspects of our organization, including our cloud-based software solutions and internal operations. This encompasses all information assets, technologies, processes, and people involved in the development, delivery, and support of our services. The ISMS is designed to ensure the confidentiality, integrity, and availability of information across our entire organization.",
      },
      {
            title: "Information Security Objectives",
            content:
                  "We are committed to ensuring the confidentiality, integrity, and availability of all physical and electronic information assets of the organization to ensure business continuity. Our key objectives include: protecting customer data from unauthorized access or disclosure, maintaining the integrity of our software development processes, ensuring the availability of our services, and continuously improving our security posture in response to evolving threats.",
      },
      {
            title: "Risk Assessment and Treatment",
            content:
                  "We conduct regular risk assessments and implement appropriate controls to mitigate identified risks to our information assets. This process involves identifying potential threats and vulnerabilities, assessing their potential impact and likelihood, and implementing controls based on industry best practices and standards such as ISO 27001. We regularly review and update our risk assessment to address new and emerging threats.",
      },
      {
            title: "Security Awareness and Training",
            content:
                  "All employees undergo regular security awareness training to ensure they understand their responsibilities in maintaining information security. This training covers topics such as password security, phishing awareness, data handling procedures, and incident reporting. We also provide specialized training for employees in roles with elevated access or responsibilities related to information security.",
      },
      {
            title: "Incident Management",
            content:
                  "We have established procedures for identifying, reporting, and responding to information security incidents promptly and effectively. Our incident response team is trained to handle various types of security incidents, including data breaches, system outages, and malware infections. We regularly test and update our incident response plans to ensure their effectiveness.",
      },
      {
            title: "Compliance",
            content:
                  "We are committed to complying with all relevant legal, regulatory, and contractual requirements related to information security. This includes data protection laws, industry-specific regulations, and contractual obligations to our clients. We regularly review our compliance status and engage in independent audits to verify our adherence to these requirements. We also maintain certifications and attestations relevant to our industry to demonstrate our commitment to information security.",
      },
]

export default PrivacyISMSPolicy
