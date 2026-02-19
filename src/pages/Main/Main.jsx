import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer/Footer";
import Header from "../shared/Header/Header";
import CopyrightBar from "../shared/CopyrightBar/CopyrightBar";
import { BsFillSendFill } from "react-icons/bs";

const Main = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [message, setMessage] = useState("");
      const [demoMessage, setDemoMessage] = useState("");
      const typingIntervalRef = useRef(null);
      const chatWindowRef = useRef(null);
      console.log(demoMessage);


      const toggleChat = () => {
            setIsOpen((prev) => !prev);
            if (!isOpen) {
                  startDemoChat();
            } else {
                  if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current);
                  }
                  // setDemoMessage("");
            }
      };

      const handleSendMessage = () => {
            if (message.trim()) {
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/8801792205520?text=${encodedMessage}`, "_blank");
                  setMessage("");
                  setIsOpen(false);
            }
      };

      const startDemoChat = () => {
            if (demoMessage === "Hello sir or mam! How can we help you?") return;
            const fullMessage = "Hello sir or mam! How can we help you?";
            let index = 0;
            let currentMessage = ""; // Local variable to avoid async issues


            setDemoMessage(""); // Clear previous message

            typingIntervalRef.current = setInterval(() => {
                  currentMessage += fullMessage.charAt(index); // Build message locally
                  setDemoMessage(currentMessage); // Update state once per iteration
                  index++;

                  if (index >= fullMessage.length) {
                        clearInterval(typingIntervalRef.current); // Stop when done
                  }
            }, 50);
      };




      useEffect(() => {
            return () => {
                  if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current);
                  }
            };
      }, []);

      useEffect(() => {
            if (chatWindowRef.current) {
                  chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
            }
      }, [demoMessage]);

      return (
            <div className="">
                  {/* WhatsApp Floating Chat */}
                  <div className="fixed bottom-[72px] right-4 z-50 ">
                        {isOpen && (
                              <div className="bg-[#f0f2f5] shadow-lg rounded-2xl overflow-hidden w-80 max-h-[500px] flex flex-col">
                                    <div className="bg-[#128C7E] text-white p-4 flex items-center">
                                          <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png?20220228223904"
                                                alt="WhatsApp"
                                                className="w-10 h-10 mr-3"
                                          />
                                          <div>
                                                <h3 className="font-bold">WhatsApp Chat</h3>
                                                <p className="text-xs opacity-75">Online</p>
                                          </div>
                                    </div>
                                    <div
                                          ref={chatWindowRef}
                                          className="flex-grow overflow-y-auto p-4 space-y-4"
                                          style={{ maxHeight: "300px" }}
                                    >
                                          {demoMessage && (
                                                <div className="bg-white rounded-lg p-3 inline-block max-w-[80%] shadow">
                                                      <p className="text-sm text-black">{demoMessage}</p>
                                                      <span className="text-xs text-gray-500 mt-1 block">
                                                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                      </span>
                                                </div>
                                          )}
                                    </div>
                                    <div className="p-4 bg-white border-t">
                                          <div className="flex items-center bg-[#f0f2f5] rounded-full overflow-hidden">
                                                <textarea
                                                      value={message}
                                                      onChange={(e) => setMessage(e.target.value)}
                                                      placeholder="Type a message"
                                                      className="flex-grow p-2 text-black border-none bg-transparent text-sm focus:outline-none resize-none"
                                                      rows={1}
                                                />
                                                <button
                                                      onClick={handleSendMessage}
                                                      className="bg-[#128C7E] text-white p-2 rounded-full hover:bg-[#075E54] transition"
                                                >
                                                      <BsFillSendFill />

                                                </button>
                                          </div>
                                    </div>
                              </div>
                        )}

                        {/* WhatsApp Logo Button */}

                  </div>
                  <button
                        onClick={toggleChat}
                        className="bg-[#25D366] fixed bottom-3 z-50 right-4 lg:w-14 lg:h-14 w-12 h-12 rounded-full shadow-lg flex justify-center items-center hover:bg-[#128C7E] transition"
                        aria-label="WhatsApp Chat"
                  >
                        <img
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png?20220228223904"
                              alt="WhatsApp"
                              className="w-6 h-6 lg:w-8 lg:h-8"
                        />
                  </button>


                  <div className="">
                        <Header />
                  </div>
                  <div className="pt-6"><Outlet /></div>
                  <Footer />
                  <CopyrightBar />
            </div>
      );
};

export default Main;
