const EmploymentTerms = () => {
      return (
            <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[80%] w-[95%]">
                  <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Employment Terms & Benefits</h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                              We believe in transparency and fair treatment for all our team members
                        </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Compensation */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                                />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Compensation</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• Competitive salary based on experience</li>
                                    <li>• Performance-based bonuses</li>
                                    <li>• Annual salary reviews</li>
                                    <li>• Festival Bonus</li>
                              </ul>
                        </div>

                        {/* Work Schedule */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Work Schedule</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• 2:00 PM to 10:00 PM (BD Time)</li>
                                    <li>• 5 days work week</li>
                                    <li>• Flexible break times</li>
                                    <li>• Remote work options</li>
                              </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Benefits</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• Health insurance coverage</li>
                                    <li>• Paid time off & holidays</li>
                                    <li>• Professional development fund</li>
                                    <li>• Team building activities</li>
                              </ul>
                        </div>

                        {/* Growth */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Career Growth</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• Mentorship programs</li>
                                    <li>• Skill development workshops</li>
                                    <li>• Clear promotion paths</li>
                                    <li>• Conference attendance support</li>
                              </ul>
                        </div>

                        {/* Work Environment */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-teal-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Work Environment</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• Collaborative team culture</li>
                                    <li>• Modern development tools</li>
                                    <li>• Open communication</li>
                                    <li>• Innovation encouraged</li>
                              </ul>
                        </div>

                        {/* Policies */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                              <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
                                          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={2}
                                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                          </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Policies</h3>
                              </div>
                              <ul className="space-y-2 text-gray-300">
                                    <li>• Equal opportunity employer</li>
                                    <li>• Anti-discrimination policy</li>
                                    <li>• Work-life balance focus</li>
                                    <li>• Confidentiality agreements</li>
                              </ul>
                        </div>
                  </div>
            </div>
      )
}

export default EmploymentTerms
