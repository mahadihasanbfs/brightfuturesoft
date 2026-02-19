import React, { useContext, useRef, useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiAlertCircle } from "react-icons/fi";
import Swal from 'sweetalert2';
import uploadImage from '../../../Hook/ImageUpload';
import { base_url } from '../../../layout/Title';
import { ArrowRight, Briefcase, Calendar, Camera, Linkedin, Lock, Mail, ShieldCheck, User } from 'lucide-react';
const SignUp = () => {
      const navigate = useNavigate();
      const location = useLocation();

      let from = location?.state?.from?.pathname || "/";
      const [imagePreview, setImagePreview] = useState(null);
      const fileInputRef = useRef(null);

      const handleImageChange = (e) => {
            const file = e.target.files?.[0];
            if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                        setImagePreview(reader.result);
                  };
                  reader.readAsDataURL(file);
            }
      };

      const handleSignUp = async (e) => {
            e.preventDefault();

            const form = e.target;
            const name = form.name.value;
            const email = form.email.value;
            const password = form.password.value;
            const designation = form?.designation.value;
            const possition = form?.possition.value;
            const salary = form?.salary.value;
            const phone = form?.phone.value;
            const linkedin = form?.linkedin.value;
            const dob = form?.dob.value;




            try {
                  const image = await uploadImage(form.img_url.files[0]);

                  const data = {
                        name,
                        email,
                        password,
                        designation,
                        possition,
                        salary,
                        image,
                        phone,
                        linkedin,
                        dob,
                  };



                  const response = await fetch(`${base_url}/auth/sign-up`, {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                  });

                  const result = await response.json();

                  if (response.ok) {
                        Swal.fire(result.message, '', 'success');
                        navigate('/sign_in');
                  } else {

                        Swal.fire(result.message, '', 'warning');
                  }
            } catch (error) {

                  Swal.fire('Failed to sign up', '', 'error');
            }
      };



      return (
            <div className=" py-20">

                  <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 max-w-4xl mx-auto px-4 py-12">
                        <div className="w-full">
                              {/* Header */}
                              <div className="text-center mb-10">
                                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Create Account</h1>
                                    <p className="text-slate-400 text-lg">Join thousands of professionals on Elite HR</p>
                              </div>


                              <form onSubmit={handleSignUp} className="space-y-8 mt-4">

                                    {/* Image Upload - Modern Circular Style */}
                                    <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                          <div className="relative group">
                                                <div className="w-28 h-28 rounded-full bg-white ring-4 ring-white shadow-xl overflow-hidden flex items-center justify-center border border-slate-200">
                                                      {imagePreview ? (
                                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                      ) : (
                                                            <div className="text-center">
                                                                  <User className="w-10 h-10 text-slate-300 mx-auto" />
                                                            </div>
                                                      )}
                                                </div>
                                                <button
                                                      type="button"
                                                      onClick={() => fileInputRef.current?.click()}
                                                      className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-indigo-700 hover:scale-110 transition-all active:scale-95"
                                                >
                                                      <Camera className="w-4 h-4" />
                                                </button>
                                                <input
                                                      type="file"
                                                      ref={fileInputRef}
                                                      name="img_url"
                                                      accept='image/*,application/pdf'
                                                      className="hidden"
                                                      accept="image/*"
                                                      onChange={handleImageChange}
                                                      required
                                                />
                                          </div>
                                          <div>
                                                <h3 className="text-base font-bold text-slate-800">Professional Photo</h3>
                                                <p className="text-sm text-slate-500 mt-1">Recommended square image, max 5MB.</p>
                                                <button
                                                      type="button"
                                                      onClick={() => fileInputRef.current?.click()}
                                                      className="text-indigo-600 text-sm font-bold mt-2 hover:underline"
                                                >
                                                      Upload new photo
                                                </button>
                                          </div>
                                    </div>

                                    {/* Input Fields Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                                          {/* Full Name */}
                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Full Name</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="name"
                                                            type="text"
                                                            required
                                                            placeholder="FULL NAME"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200 focus:ring-2"
                                                      />
                                                </div>
                                          </div>

                                          {/* Email */}
                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Email Address</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="email"
                                                            type="email"
                                                            required
                                                            placeholder="info@brightfuturesoft.com"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>

                                          {/* Phone */}
                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Designation</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="designation"
                                                            type="text"
                                                            required
                                                            placeholder="Sr. Account Manager"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>




                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Position Level</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <ShieldCheck className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <select
                                                            name="possition"
                                                            required
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200 appearance-none"
                                                      >
                                                            <option value="">Select Level</option>
                                                            <option value="manager">Manager</option>
                                                            <option value="employee">Employee</option>
                                                      </select>
                                                </div>
                                          </div>

                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Salary</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="salary"
                                                            type="text"
                                                            required
                                                            placeholder="20000"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>

                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Phone Number</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="phone"
                                                            type="text"
                                                            required
                                                            placeholder="+8801234567890"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>

                                          {/* LinkedIn */}
                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">LinkedIn URL</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Linkedin className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="linkedin"
                                                            type="url"
                                                            required
                                                            placeholder="https://linkedin.com/in/user"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>

                                          {/* Date of Birth */}
                                          <div className="space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Date of Birth</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="dob"
                                                            type="date"
                                                            required
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>

                                          {/* Password */}
                                          <div className="md:col-span-2 space-y-2">
                                                <label className="text-[0.85rem] font-bold text-slate-100 px-1 uppercase tracking-wider">Security Password</label>
                                                <div className="relative group">
                                                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                                      </div>
                                                      <input
                                                            name="password"
                                                            type="password"
                                                            required
                                                            placeholder="••••••••••••"
                                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all ring-1 ring-slate-200"
                                                      />
                                                </div>
                                          </div>
                                    </div>

                                    <div className="pt-6">
                                          <button
                                                type="submit"
                                                // disabled={status === FormStatus.SUBMITTING}
                                                className="w-full bg-slate-900 text-white font-bold py-5 px-8 rounded-[1.25rem] hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 group"
                                          >
                                                {/* {status === FormStatus.SUBMITTING ? (
                                                <>
                                                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                                                      <span>Initializing Profile...</span>
                                                </>
                                          ) : (

                                          )} */}
                                                <>
                                                      <span>Create My Account</span>
                                                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                          </button>

                                          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                                                <ShieldCheck className="w-4 h-4" />
                                                <p className="text-xs font-medium">Your data is encrypted and secured by Elite HR Standards.</p>
                                          </div>
                                    </div>
                              </form>
                        </div>
                  </div >
            </div >
      );
};

export default SignUp;
