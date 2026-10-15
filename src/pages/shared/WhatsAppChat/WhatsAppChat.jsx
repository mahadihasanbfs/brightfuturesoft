import React, { useState, useEffect, useRef } from "react";
import { BsWhatsapp, BsCheck2All } from "react-icons/bs";
import { IoSend, IoClose } from "react-icons/io5";
import logoImg from "../../../Assctes/logo.png";

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [hasOpened, setHasOpened] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef(null);
  const inputRef = useRef(null);
  const hasInteractedRef = useRef(false);
  const pendingSoundRef = useRef(false);

  const phoneNumber = "8801792205520"; // Official BFS WhatsApp number

  const quickPrompts = [
    { label: "💻 Custom Software", text: "Hi Bright Future Soft, I would like to discuss a custom software project." },
    { label: "📱 Mobile App", text: "Hello! I am looking to build a mobile application (iOS & Android)." },
    { label: "🏢 ERP & SaaS", text: "Hi, I need consultation on developing an ERP or SaaS system." },
    { label: "⚡ Hire Developers", text: "Hello, I am interested in hiring dedicated engineers for our team." }
  ];

  // Sound chime with dual engine (WAV file + Web Audio API fallback)
  const playChime = () => {
    let played = false;
    try {
      const audio = new Audio("/whatsapp-notification.wav");
      audio.volume = 0.5;
      const promise = audio.play();
      if (promise !== undefined) {
        promise
          .then(() => { played = true; })
          .catch(() => { playWebAudioChime(); });
      }
    } catch {
      playWebAudioChime();
    }
    if (!played) playWebAudioChime();
  };

  const playWebAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;
      const playTone = (freq, offset, duration, gainLevel) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(gainLevel, now + offset + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + duration);
      };
      playTone(659.25, 0, 0.18, 0.25);
      playTone(880.0, 0.1, 0.25, 0.3);
      setTimeout(() => {
        if (ctx.state !== "closed") ctx.close().catch(() => {});
      }, 500);
    } catch {
      // Autoplay fallback safe
    }
  };

  // Pre-unlock audio on first touch/interaction
  useEffect(() => {
    const unlock = () => {
      hasInteractedRef.current = true;
      if (pendingSoundRef.current) {
        pendingSoundRef.current = false;
        playChime();
      }
    };
    window.addEventListener("click", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("scroll", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Show tooltip after 3.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasOpened) {
        setShowTooltip(true);
        if (hasInteractedRef.current) {
          playChime();
        } else {
          pendingSoundRef.current = true;
          playChime();
        }
      }
    }, 3200);
    return () => clearTimeout(timer);
  }, [hasOpened]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setHasOpened(true);
      pendingSoundRef.current = false;
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    setShowTooltip(false);
    setHasOpened(true);
    pendingSoundRef.current = false;
  };

  const handleSendMessage = (textToSend = message) => {
    const finalText = textToSend.trim() || "Hi Bright Future Soft, I would like to inquire about your software development services.";
    const encoded = encodeURIComponent(finalText);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank", "noopener,noreferrer");
    setMessage("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectPrompt = (promptText) => {
    setMessage(promptText);
    inputRef.current?.focus();
  };

  return (
    <div ref={widgetRef} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans select-none print:hidden">
      {/* =========================================================================
          1. CLEAN & COMPACT CHAT POPUP (Mobile & Laptop Friendly)
          ========================================================================= */}
      {isOpen && (
        <div 
          className="mb-3 w-[300px] sm:w-[330px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/90 flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95"
          style={{ maxHeight: "min(460px, 80vh)" }}
        >
          {/* Header */}
          <div className="bg-[#075E54] text-white px-3.5 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={logoImg}
                    alt="BFS Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border border-[#075E54]"></span>
              </div>
              <div>
                <h3 className="font-semibold text-xs tracking-tight text-white leading-tight">
                  Bright Future Soft
                </h3>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                  Online • Replies quickly
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-white/15 text-white/90 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <IoClose className="text-lg" />
            </button>
          </div>

          {/* Simple Chat Body */}
          <div className="p-3.5 bg-[#f4f6f8] overflow-y-auto space-y-3 flex-grow" style={{ minHeight: "180px", maxHeight: "250px" }}>
            {/* Incoming Message Bubble */}
            <div className="bg-white rounded-xl rounded-tl-xs p-3 shadow-2xs border border-slate-100 text-left">
              <p className="text-xs text-[#142235] leading-relaxed">
                Hello! 👋 Welcome to <strong>Bright Future Soft</strong>.
              </p>
              <p className="text-[11.5px] text-[#55667c] mt-1 leading-snug">
                How can we help with your software project? Click a topic or write us below:
              </p>
              <div className="flex items-center justify-end gap-1 mt-1.5 text-[9.5px] text-slate-400">
                <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                <BsCheck2All className="text-[#53bdeb] text-xs" />
              </div>
            </div>

            {/* Compact Quick Topic Pills */}
            <div className="pt-1">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1.5 px-0.5">
                Quick Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectPrompt(prompt.text)}
                    className="text-[11px] font-medium text-[#142235] bg-white hover:bg-emerald-50 hover:text-[#075E54] hover:border-emerald-300 px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-2xs transition-all active:scale-95"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-100">
            <div className="flex items-center gap-1.5 bg-[#f4f6f8] rounded-xl px-2.5 py-1 border border-slate-200 focus-within:border-[#075E54] focus-within:bg-white transition-all">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-grow p-1 text-xs text-[#142235] placeholder:text-slate-400 border-none bg-transparent focus:outline-none resize-none leading-relaxed"
                rows={1}
                style={{ maxHeight: "60px" }}
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="w-7 h-7 rounded-lg bg-[#25D366] hover:bg-[#1ebd5a] active:scale-90 text-white flex items-center justify-center transition-all flex-shrink-0 shadow-2xs"
                aria-label="Send message"
                title="Send via WhatsApp"
              >
                <IoSend className="text-xs ml-0.5" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
              <span>Direct WhatsApp Chat</span>
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="text-[#075E54] hover:underline font-semibold"
              >
                Open App →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. MINIMALIST TEASER TOOLTIP (Small, Elegant Speech Bubble)
          ========================================================================= */}
      {!isOpen && showTooltip && (
        <div 
          onClick={toggleChat}
          className="absolute bottom-16 right-0 mb-1 w-64 bg-white p-3 rounded-xl shadow-lg border border-slate-200/90 text-left cursor-pointer transition-all animate-in fade-in slide-in-from-bottom-2 group hover:border-[#25D366]/70"
        >
          {/* Subtle bottom pointer towards button */}
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r border-b border-slate-200/90 rotate-45 group-hover:border-[#25D366]/70 transition-colors"></div>

          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
              </span>
              <p className="text-xs font-semibold text-[#142235]">Need help with your project?</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-600 text-xs p-0.5 leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-[#55667c] mt-1 leading-snug">
            Chat directly with our software engineers on WhatsApp.
          </p>

          <div className="mt-2 text-[10.5px] font-bold text-[#075E54] flex items-center gap-1 group-hover:underline">
            <BsWhatsapp className="text-[11px]" /> Start Chat →
          </div>
        </div>
      )}

      {/* =========================================================================
          3. COMPACT FLOATING TRIGGER BUTTON (50px, Clean & Responsive)
          ========================================================================= */}
      <button
        onClick={toggleChat}
        className={`relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 ${
          isOpen
            ? "bg-[#142235] text-white rotate-90 scale-95"
            : "bg-[#25D366] hover:bg-[#20ba5a] text-white hover:scale-105 active:scale-95"
        }`}
        aria-label="Toggle WhatsApp Chat"
      >
        {isOpen ? (
          <IoClose className="text-xl sm:text-2xl" />
        ) : (
          <>
            <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-25 group-hover:opacity-40 animate-pulse -z-10"></span>
            <BsWhatsapp className="text-2xl sm:text-3xl text-white drop-shadow-xs" />

            {!hasOpened && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs">
                1
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppChat;
