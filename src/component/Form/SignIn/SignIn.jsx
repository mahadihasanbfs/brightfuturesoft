import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import logo from '../../../Assctes/logo.png';
import { base_url } from '../../../layout/Title';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import { 
      HiOutlineEnvelope, 
      HiOutlineLockClosed, 
      HiOutlineEye, 
      HiOutlineEyeSlash,
      HiOutlineShieldCheck,
      HiOutlineArrowRight,
      HiOutlineBuildingOffice2,
      HiCheck
} from "react-icons/hi2";

const SignIn = () => {
      const location = useLocation();
      const { user, setUser } = useContext(AuthContext);
      const navigate = useNavigate();

      let from = location.state?.from?.pathname || "/dashboard/home";
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [showPassword, setShowPassword] = useState(false);

      const handleSignIn = (e) => {
            e.preventDefault();
            setError('');
            const form = e.target;
            const email = form.email.value.trim();
            const password = form.password.value;
            const terms = form.terms.checked;

            if (!terms) {
                  Swal.fire({
                        title: 'Terms Agreement Required',
                        text: 'Please accept the Terms & Conditions and Privacy Policy to sign in.',
                        icon: 'info',
                        confirmButtonColor: '#0A65B4'
                  });
                  return;
            }

            setLoading(true);
            const data = { email, password };

            fetch(`${base_url}/auth/sign-in`, {
                  method: 'POST',
                  headers: {
                        'Content-Type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(data),
            })
                  .then((res) => res.json())
                  .then((data) => {
                        if (data.user) {
                              Swal.fire({
                                    title: 'Welcome Back!',
                                    text: data.message || `Signed in as ${data.user.name || 'Employee'}`,
                                    icon: 'success',
                                    confirmButtonColor: '#0A65B4',
                                    timer: 1800,
                                    showConfirmButton: false
                              });
                              localStorage.setItem('data', JSON.stringify(data.user));
                              setUser(data.user);
                              navigate(from);
                        } else {
                              setError(data.message || 'Invalid corporate credentials.');
                              Swal.fire({
                                    title: 'Sign In Failed',
                                    text: data.message || 'Please verify your email and password.',
                                    icon: 'error',
                                    confirmButtonColor: '#0A65B4'
                              });
                        }
                  })
                  .catch((err) => {
                        console.error('Sign-in error:', err);
                        setError('Connection to authentication service failed. Please try again.');
                        Swal.fire({
                              title: 'Network Error',
                              text: 'Unable to reach the server. Please check your internet connection.',
                              icon: 'error',
                              confirmButtonColor: '#0A65B4'
                        });
                  })
                  .finally(() => {
                        setLoading(false);
                  });
      };

      return (
            <div className="min-h-[calc(100vh-120px)] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                  <div className="w-full max-w-7xl bg-white rounded-3xl border border-[#E1E9F2] shadow-[0_20px_50px_rgba(20,34,53,0.06)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
                        
                        {/* Left Column: Sign In Form */}
                        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                              {/* Eyebrow badge */}
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0A65B4]/10 text-[#0A65B4] text-[11px] font-bold tracking-wide uppercase self-start mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A65B4] animate-pulse" />
                                    <span>Employee &amp; Member Portal</span>
                              </div>

                              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142235] tracking-tight leading-tight">
                                    Welcome back to Bright Future Soft
                              </h1>
                              <p className="mt-2 text-sm text-[#66758A] leading-relaxed">
                                    Enter your corporate email and password to access your internal workspace, tasks, and reports.
                              </p>

                              {/* Error Banner */}
                              {error && (
                                    <div className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                                          <span className="w-2 h-2 rounded-full bg-red-500" />
                                          <span>{error}</span>
                                    </div>
                              )}

                              <form onSubmit={handleSignIn} className="mt-7 space-y-4">
                                    {/* Email Field */}
                                    <div>
                                          <label htmlFor="signin-email" className="block text-xs font-bold text-[#142235] mb-1.5 uppercase tracking-wide">
                                                Corporate Email
                                          </label>
                                          <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                      <HiOutlineEnvelope className="text-base" />
                                                </div>
                                                <input
                                                      id="signin-email"
                                                      type="email"
                                                      name="email"
                                                      required
                                                      placeholder="name@brightfuturesoft.com"
                                                      className="block w-full py-3 pl-11 pr-4 text-sm text-[#142235] placeholder:text-slate-400 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A65B4] focus:ring-4 focus:ring-[#0A65B4]/10 transition-all font-normal"
                                                />
                                          </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                          <div className="flex items-center justify-between mb-1.5">
                                                <label htmlFor="signin-password" className="block text-xs font-bold text-[#142235] uppercase tracking-wide">
                                                      Password
                                                </label>
                                                <Link
                                                      to="/forget-password"
                                                      className="text-xs font-semibold text-[#0A65B4] hover:underline transition-colors"
                                                >
                                                      Forgot Password?
                                                </Link>
                                          </div>
                                          <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                      <HiOutlineLockClosed className="text-base" />
                                                </div>
                                                <input
                                                      id="signin-password"
                                                      type={showPassword ? "text" : "password"}
                                                      name="password"
                                                      required
                                                      placeholder="••••••••••••"
                                                      className="block w-full py-3 pl-11 pr-11 text-sm text-[#142235] placeholder:text-slate-400 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A65B4] focus:ring-4 focus:ring-[#0A65B4]/10 transition-all font-normal"
                                                />
                                                <button
                                                      type="button"
                                                      onClick={() => setShowPassword(!showPassword)}
                                                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                      aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                      {showPassword ? (
                                                            <HiOutlineEyeSlash className="text-base" />
                                                      ) : (
                                                            <HiOutlineEye className="text-base" />
                                                      )}
                                                </button>
                                          </div>
                                    </div>

                                    {/* Terms Checkbox */}
                                    <div className="pt-1 flex items-start gap-2.5">
                                          <div className="flex items-center h-5">
                                                <input
                                                      id="terms"
                                                      name="terms"
                                                      type="checkbox"
                                                      defaultChecked={true}
                                                      className="w-4 h-4 rounded text-[#0A65B4] border-slate-300 focus:ring-[#0A65B4] cursor-pointer"
                                                />
                                          </div>
                                          <label htmlFor="terms" className="text-xs text-[#66758A] leading-snug cursor-pointer select-none">
                                                I agree to Bright Future Soft's{" "}
                                                <Link to="/terms" target="_blank" className="text-[#0A65B4] font-semibold hover:underline">
                                                      Terms &amp; Conditions
                                                </Link>{" "}
                                                and{" "}
                                                <Link to="/policy" target="_blank" className="text-[#0A65B4] font-semibold hover:underline">
                                                      Privacy Policy
                                                </Link>.
                                          </label>
                                    </div>

                                    {/* Submit Action */}
                                    <div className="pt-2">
                                          <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-2 bg-[#0A65B4] hover:bg-[#084F8D] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none text-white font-semibold py-3.5 px-6 rounded-xl shadow-xs transition-all text-sm"
                                          >
                                                {loading ? (
                                                      <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                            </svg>
                                                            <span>Verifying credentials...</span>
                                                      </>
                                                ) : (
                                                      <>
                                                            <span>Sign in to Workspace</span>
                                                            <HiOutlineArrowRight className="text-sm" />
                                                      </>
                                                )}
                                          </button>
                                    </div>
                              </form>

                              {/* Support Footer */}
                              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span>Need account access?</span>
                                    <a
                                          href="mailto:contact@brightfuturesoft.com"
                                          className="font-bold text-[#0A65B4] hover:underline"
                                    >
                                          Contact Administrator
                                    </a>
                              </div>
                        </div>

                        {/* Right Column: Corporate Branding & Value Prop */}
                        <div 
                              className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#f8fbff] via-[#f1f8ff] to-[#e6f1fc] border-l border-[#E1E9F2] relative overflow-hidden"
                              style={{
                                    backgroundImage: `linear-gradient(rgb(10 44 77 / 2.5%) 1px, transparent 1px), linear-gradient(90deg, rgb(10 44 77 / 2.5%) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                              }}
                        >
                              {/* Top Logo Pill */}
                              <div>
                                    <div className="inline-flex items-center gap-3 p-2 pr-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-2xs">
                                          <img
                                                src={logo}
                                                alt="Bright Future Soft Logo"
                                                className="h-8 w-auto object-contain"
                                          />
                                          <div>
                                                <h3 className="text-xs font-bold text-[#142235] leading-tight">
                                                      Bright Future Soft
                                                </h3>
                                                <p className="text-[10px] text-slate-500 font-medium">
                                                      Enterprise Software Engineering
                                                </p>
                                          </div>
                                    </div>

                                    {/* Quote / Mission */}
                                    <blockquote className="mt-12 text-[#142235]">
                                          <p className="text-lg font-bold tracking-tight leading-snug">
                                                “Envisioning the future, building scalable software with predictable agility and zero compromise on security.”
                                          </p>
                                    </blockquote>
                              </div>

                              {/* Enterprise Trust Highlights */}
                              <div className="space-y-3 my-8">
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                                          <HiOutlineShieldCheck className="text-lg text-[#0A65B4] flex-shrink-0 mt-0.5" />
                                          <div>
                                                <h4 className="text-xs font-bold text-[#142235]">End-to-End ISMS Compliant</h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5">Encrypted internal channels &amp; SOC 2 aligned access protocols.</p>
                                          </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
                                          <HiOutlineBuildingOffice2 className="text-lg text-[#0A65B4] flex-shrink-0 mt-0.5" />
                                          <div>
                                                <h4 className="text-xs font-bold text-[#142235]">Role-Based Employee Workspace</h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5">Centralized sprint management, task pipelines, and client notices.</p>
                                          </div>
                                    </div>
                              </div>

                              {/* Bottom Footer Assurance */}
                              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                    <span>Authorized Access Only</span>
                                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Active
                                    </span>
                              </div>
                        </div>

                  </div>
            </div>
      );
};

export default SignIn;
