import React, { useRef, useState } from 'react';
import { MdFacebook, MdOutlineMail, MdPhone } from 'react-icons/md';
import { BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { base_url } from '../../../layout/Title';
import Swal from 'sweetalert2';
import JoditEditor from 'jodit-react';

const Contact = () => {
      const [loading, setLoading] = useState(false);

      const [value, setValue] = useState("");
      const [error, setError] = useState("");

      const validateEmailOrPhone = (input) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/; // supports international +880... or 01...

            if (!input) return "This field is required.";
            if (!emailRegex.test(input) && !phoneRegex.test(input)) {
                  return "Enter a valid email or phone number.";
            }
            return "";
      };

      const handleChange = (e) => {
            setValue(e.target.value);
            setError(""); // clear error while typing
      };

      const handleBlur = () => {
            const validationError = validateEmailOrPhone(value);
            setError(validationError);
      };
      // data

      const form = useRef();
      const sendEmail = async (e) => {
            e.preventDefault();
            const full_name = e.target.full_name.value;
            const message = e.target.message.value;
            const time_stamp = new Date().toISOString();
            const validationError = validateEmailOrPhone(value);
            if (validationError) {
                  setError(validationError);
                  return;
            }
            setLoading(true);
            try {
                  const response = await fetch(`${base_url}/contact/add-contact`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json', 'author': 'bright_future_soft' },
                        body: JSON.stringify({ full_name, email_or_phone: value, message, time_stamp, status: 'pending' }),
                  });
                  if (!response.ok) throw new Error('Unable to send your message. Please try again.');
                  await response.json();
                  form.current.reset();
                  setValue("");
                  Swal.fire({ title: 'Message sent', text: 'Thanks for reaching out. We’ll be in touch soon.', icon: 'success' });
            } catch {
                  Swal.fire({ title: 'Message not sent', text: 'Please try again in a moment or contact us by email.', icon: 'error' });
            } finally {
                  setLoading(false);
            }
      };

      return (

            <section className="contact-bg contact-section px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="contact-heading">

                  <div className="md:mx-auto max-w-7xl">
                        <div className="section-heading-row ">
                              <div><span className="site-eyebrow">Start a conversation</span><h2 id="contact-heading">Want to talk about<br /><span>your project?</span></h2></div>
                              <p>Tell us what you are working on. We’ll help you find a clear next step.</p>
                        </div>

                        <div className="contact-box contact-panel mt-12 text-white">
                              <div className="contact-layout">

                                    <div className="contact-details">
                                          <span className="contact-panel-label">Contact details</span>
                                          <h3>Let’s make<br />something useful.</h3>
                                          <p>Share your goals with us and our team will get back to you to discuss the best way forward.</p>
                                          <a className="contact-detail-link" href="mailto:info@brightfuturesoft.com"><MdOutlineMail aria-hidden="true" /><span><small>Email us</small>info@brightfuturesoft.com</span></a>
                                          <a className="contact-detail-link" href="tel:+8801792205520"><MdPhone aria-hidden="true" /><span><small>Call us</small>+880 1792-205520</span></a>
                                          <div className="contact-socials" aria-label="Social media">
                                                <a target="_blank" rel="noreferrer" href="https://www.facebook.com/brightfuturesoft" aria-label="Facebook"><MdFacebook /></a>
                                                <a target="_blank" rel="noreferrer" href="https://bd.linkedin.com/company/brightfuturesoft" aria-label="LinkedIn"><BsLinkedin /></a>
                                                <a target="_blank" rel="noreferrer" href="https://x.com/brightfuturebd" aria-label="X"><BsTwitter /></a>
                                                <a target="_blank" rel="noreferrer" href="https://www.instagram.com/brightfuturesoft" aria-label="Instagram"><BsInstagram /></a>
                                          </div>
                                    </div>
                                    <div className="contact-form-wrap">
                                          <form ref={form} onSubmit={sendEmail} className="contact-form form-bg capitalize">
                                                <h3>Your message</h3>
                                                <div className="relative bg-[#0b0a2238] border border-[#1795F0] rounded-lg mt-4">

                                                      <input required name="full_name" id='full_name' type="text" className="w-full p-2 rounded-lg outline-none text-white border-none bg-[#00000034]" placeholder="Enter your full name" />
                                                </div>

                                                <div className="relative bg-[#0b0a2238] border border-[#1795F0] rounded-lg mt-8">

                                                      <input
                                                            type="text"
                                                            id="email_or_phone"
                                                            name="email_or_phone"
                                                            value={value}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            required
                                                            className="w-full p-2 rounded-lg outline-none text-white border-none bg-[#00000034]"
                                                            placeholder="Enter your email or phone number"
                                                      />

                                                </div>
                                                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                                                <div className="relative bg-[#0b0a2238] border border-[#1795F0] rounded-lg mt-8">

                                                      {/* <textarea name="message" type="text" className="w-full p-2 h-[110px] rounded-lg outline-none text-white border-none bg-[#00000034] " placeholder="Enter your message" /> */}

                                                      <JoditEditor config={{
                                                            readonly: false,
                                                            theme: "default",
                                                            height: 200,
                                                            style: {
                                                                  backgroundColor: "#ffffff",
                                                                  color: "#17263a",
                                                            },
                                                            toolbarSticky: false,
                                                            toolbarAdaptive: false,
                                                            toolbarButtonSize: "small",
                                                            buttons: [
                                                                  "bold",
                                                                  "italic",
                                                                  "underline",
                                                                  "|",
                                                                  "ul",
                                                                  "ol",
                                                                  "|",
                                                                  "link",
                                                                  "|",
                                                                  "undo",
                                                                  "redo",
                                                                  "brush",
                                                                  "paragraph",
                                                            ],
                                                            uploader: {
                                                                  insertImageAsBase64URI: true,
                                                            },
                                                            removeButtons: ["source", "video", "fullsize", "about"],
                                                            placeholder: "Enter your message",
                                                      }}

                                                            name='message'
                                                      />

                                                </div>

                                                <button type="submit" className="mt-8 bg-[#1A2644] hover:bg-blue-500 text-white w-full p-3 rounded-lg" disabled={loading}>{!loading ? "Submit" : <div align="center" className=' justify-center'>
                                                      <div className="flex">
                                                            <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-[#1e3d8d] border-4"></div>
                                                            <div className="ml-2"> Processing... </div>
                                                      </div>
                                                </div>}
                                                </button>

                                          </form>
                                    </div>
                              </div>
                        </div>
                  </div>
            </section>
      );
};

export default Contact;
