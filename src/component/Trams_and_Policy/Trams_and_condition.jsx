

import { useState } from "react"
import Contact from "../Contact/Contact/Contact"
import { CallSchedule } from "../../pages/shared/Header/Header"
import mahadi from '../../Assctes/teamMember/mahadi.jpg';
import hadi from '../../Assctes/teamMember/mohotasimhadi.jpeg';
import maruf from '../../Assctes/teamMember/mahady.png'
// import { ChevronDown, Mail } from "lucide-react"

const TermsAndConditions = () => {
      const [openSection, setOpenSection] = useState(null)
      const [schedule, setSchedule] = useState(false)

      const toggleSection = (index) => {
            setOpenSection(openSection === index ? null : index)
      }

      return (
            <section className="py-10 bg-gradient-to-b from-gray-900 to-gray-800 sm:pt-16 lg:pt-24">
                  <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                        <section className="">
                              <div className="">
                                    <div className="border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                                          <div className="text-center border-b border-gray-700 p-6">
                                                <h1 className="text-3xl font-bold text-blue-400">Welcome to Bright Future Soft</h1>
                                                <p className="mt-2 text-gray-400">
                                                      These Terms and Conditions govern your access to and use of our software and related services.
                                                </p>
                                          </div>
                                          <div className="p-6">
                                                <div className=" pr-4 space-y-4">
                                                      {termsData.map((item, index) => (
                                                            <div key={index} className="border-b border-gray-700 pb-4">
                                                                  <button
                                                                        onClick={() => toggleSection(index)}
                                                                        className="flex justify-between items-center w-full text-left text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                                  >
                                                                        {item.title}

                                                                        {/* <ChevronDown

                                                            /> */}
                                                                  </button>
                                                                  {(
                                                                        <div className="mt-2 text-gray-300 text-sm leading-relaxed">{item.content}</div>
                                                                  )}
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

const termsData = [
      {
            title: "Delivery Time",
            content:
                  "Bright Future Soft's software solutions are cloud-based and delivered electronically upon completing your subscription and payment. You will receive immediate access to the software upon confirmation. A system-generated email will be sent with login credentials and an electronic purchase invoice.",
      },
      {
            title: "Return Policy",
            content:
                  "Due to the digital nature of the product, we do not offer returns. However, a free 14-day trial is available for evaluation before purchasing a subscription.",
      },
      {
            title: "Refund and Termination Policy",
            content:
                  "We do not offer refunds. Subscriptions can be canceled anytime, with no refunds for unused periods. The 14-day free trial allows users to assess the software beforehand.",
      },
      {
            title: "After-Sales Service",
            content:
                  "We are committed to excellent after-sales service, offering user guides, tutorials, FAQs, and email support for technical issues.",
      },
      {
            title: "Subscriptions",
            content:
                  "Our software operates on a monthly subscription model with various plans. Subscriptions automatically renew unless canceled before the current period ends.",
      },
      {
            title: "Payment",
            content:
                  "Subscription fees are payable in USD via international credit cards. Payments are charged automatically at the start of the subscription period. Prices exclude taxes, which are the user's responsibility.",
      },
      {
            title: "Personal Information and Privacy",
            content:
                  "Users must maintain the confidentiality of their credentials. Bright Future Soft is not liable for unauthorized account access or related damages.",
      },
      {
            title: "Complaints",
            content:
                  "Complaints received will be forwarded to the user's primary email. A response is required within 10 days to avoid disclosure of contact information to the complainant.",
      },
      {
            title: "Inactive User Accounts Policy",
            content:
                  "Unpaid accounts inactive for 120 days may be terminated with prior notice. Data associated with terminated accounts will be deleted.",
      },
      {
            title: "Disclaimer of Warranties",
            content: "Services are provided 'as-is' without warranties. Users assume all risks related to software use.",
      },
      {
            title: "Limitation of Liability",
            content:
                  "Bright Future Soft is not liable for indirect, incidental, or consequential damages arising from software use.",
      },
      {
            title: "Modification of Terms of Service",
            content: "We may update these Terms with at least 30 days' notice for significant changes.",
      },
]

export default TermsAndConditions
