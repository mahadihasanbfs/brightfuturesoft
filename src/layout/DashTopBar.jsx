import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base_url } from "./Title";
import { mail } from "../pages/Eployee/Mail/mailApi";

// Closes a dropdown on outside click or Escape.
const useDismiss = (open, setOpen) => {
      const ref = useRef(null);
      useEffect(() => {
            if (!open) return undefined;
            const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
            const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
            document.addEventListener("mousedown", onDown);
            document.addEventListener("keydown", onKey);
            return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
      }, [open, setOpen]);
      return ref;
};

const Icon = ({ d, className = "h-5 w-5" }) => (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
);
const ICONS = {
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
      bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
      globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
      chevron: '<path d="m6 9 6 6 6-6"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
      logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
      mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
      check: '<path d="m5 12 5 5 9-10"/>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};

const iconBtn = "relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition hover:bg-gray-700 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

export default function DashTopBar({ title, user, theme, onToggleTheme, onOpenMenu, onLogout, pages, canOpen, isCeo }) {
      const navigate = useNavigate();

      /* ---------- notifications ---------- */
      const { data: gStatus } = useQuery({ queryKey: ["gmail-status"], queryFn: mail.status, retry: false, staleTime: 60000 });
      const { data: unread } = useQuery({ queryKey: ["gmail-unread"], queryFn: mail.unread, enabled: Boolean(gStatus?.connected), retry: false, refetchInterval: 60000 });
      const mailCount = gStatus?.connected ? unread?.inbox || 0 : 0;

      const { data: notices = [] } = useQuery({
            queryKey: ["notice_data"],
            enabled: Boolean(isCeo),
            queryFn: async () => { const r = await (await fetch(`${base_url}/notice/get-notice`)).json(); return Array.isArray(r.data) ? r.data : []; },
      });
      const pendingNotices = isCeo ? notices.filter((n) => n.status === "pending").length : 0;

      const canAppointments = canOpen("/dashboard/client_meetings");
      const { data: appts = [] } = useQuery({
            queryKey: ["appointments"],
            enabled: canAppointments,
            queryFn: async () => { const r = await (await fetch(`${base_url}/appointment/list`)).json(); return Array.isArray(r.data) ? r.data.filter((a) => a.status !== "cancelled") : []; },
      });
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
      const apptsToday = canAppointments ? appts.filter((a) => a.status === "confirmed" && new Date(a.start_time) >= todayStart && new Date(a.start_time) < new Date(todayStart.getTime() + 86400000)).length : 0;

      const canTasks = canOpen("/dashboard/your-task");
      const { data: myTasks = [] } = useQuery({
            queryKey: ["tasks", "home-mine"],
            enabled: canTasks,
            queryFn: async () => { const r = await (await fetch(`${base_url}/task/get-task?scope=mine`)).json(); return Array.isArray(r.data) ? r.data : []; },
      });
      const overdue = canTasks ? myTasks.filter((t) => t.column !== "done" && t.deadline && new Date(t.deadline) < new Date()).length : 0;

      const alerts = [
            mailCount > 0 && { key: "mail", icon: ICONS.mail, text: `${mailCount} unread email${mailCount === 1 ? "" : "s"}`, to: "/dashboard/mail", tone: "blue" },
            pendingNotices > 0 && { key: "notice", icon: ICONS.check, text: `${pendingNotices} notice${pendingNotices === 1 ? "" : "s"} waiting for your approval`, to: "/dashboard/notice", tone: "amber" },
            overdue > 0 && { key: "tasks", icon: ICONS.clock, text: `${overdue} overdue task${overdue === 1 ? "" : "s"}`, to: "/dashboard/your-task", tone: "rose" },
            apptsToday > 0 && { key: "appts", icon: ICONS.calendar, text: `${apptsToday} appointment${apptsToday === 1 ? "" : "s"} today`, to: "/dashboard/client_meetings", tone: "blue" },
      ].filter(Boolean);
      const total = mailCount + pendingNotices + overdue + apptsToday;
      const [bellOpen, setBellOpen] = useState(false);
      const bellRef = useDismiss(bellOpen, setBellOpen);

      /* ---------- page search ("/" to focus) ---------- */
      const [q, setQ] = useState("");
      const [searchOpen, setSearchOpen] = useState(false);
      const [active, setActive] = useState(0);
      const searchRef = useDismiss(searchOpen, setSearchOpen);
      const inputRef = useRef(null);
      const results = useMemo(() => {
            const needle = q.trim().toLowerCase();
            return pages.filter((p) => !needle || p.title.toLowerCase().includes(needle)).slice(0, 8);
      }, [pages, q]);
      useEffect(() => {
            const onKey = (e) => {
                  const tag = (e.target.tagName || "").toLowerCase();
                  if (e.key === "/" && !["input", "textarea", "select"].includes(tag) && !e.target.isContentEditable) { e.preventDefault(); inputRef.current?.focus(); }
            };
            document.addEventListener("keydown", onKey);
            return () => document.removeEventListener("keydown", onKey);
      }, []);
      const go = (p) => { if (!p) return; setQ(""); setSearchOpen(false); inputRef.current?.blur(); navigate(p.path); };
      const onSearchKey = (e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setSearchOpen(true); setActive((i) => Math.min(i + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
      };

      /* ---------- user menu ---------- */
      const [userOpen, setUserOpen] = useState(false);
      const userRef = useDismiss(userOpen, setUserOpen);
      const initials = String(user?.name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
      const light = theme === "light";
      const tone = { blue: "bg-blue-500/15 text-blue-400", amber: "bg-amber-500/15 text-amber-400", rose: "bg-rose-500/15 text-rose-400" };

      return (
            <header className="relative z-30 flex h-16 shrink-0 items-center gap-3 border-b border-gray-700 bg-gray-900 px-3 sm:px-5">
                  {/* left: menu (mobile) + page title */}
                  <button onClick={onOpenMenu} aria-label="Open menu" className={`${iconBtn} lg:hidden`}><Icon d={ICONS.menu} /></button>
                  <div className="min-w-0 lg:w-56">
                        <nav aria-label="Breadcrumb" className="hidden text-[11px] font-medium text-gray-500 sm:block">
                              <Link to="/dashboard/home" className="hover:text-blue-400">Dashboard</Link>
                              {title && title !== "Dashboard" && <><span className="mx-1.5" aria-hidden="true">/</span><span className="text-gray-400">{title}</span></>}
                        </nav>
                        <h1 className="truncate text-base font-bold leading-tight text-white sm:text-lg">{title || "Dashboard"}</h1>
                  </div>

                  {/* centre: page search */}
                  <div ref={searchRef} className="relative mx-auto hidden w-full max-w-md md:block">
                        <label htmlFor="dash-search" className="sr-only">Search dashboard pages</label>
                        <Icon d={ICONS.search} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                              id="dash-search"
                              ref={inputRef}
                              value={q}
                              onChange={(e) => { setQ(e.target.value); setSearchOpen(true); setActive(0); }}
                              onFocus={() => setSearchOpen(true)}
                              onKeyDown={onSearchKey}
                              placeholder="Search pages…"
                              autoComplete="off"
                              role="combobox"
                              aria-expanded={searchOpen}
                              aria-controls="dash-search-list"
                              className="h-9 w-full rounded-lg border border-gray-700 bg-gray-800 pl-9 pr-10 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                        />
                        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-600 px-1.5 text-[10px] font-semibold text-gray-400">/</kbd>
                        {searchOpen && (
                              <ul id="dash-search-list" role="listbox" className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-1.5 shadow-2xl">
                                    {results.length === 0 ? <li className="px-3 py-2 text-sm text-gray-400">No pages match “{q}”.</li> : results.map((p, i) => (
                                          <li key={p.path} role="option" aria-selected={i === active}>
                                                <button onMouseEnter={() => setActive(i)} onClick={() => go(p)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${i === active ? "bg-blue-500/15 text-gray-100" : "text-gray-300"}`}>
                                                      <span className="opacity-70">{p.icon}</span>{p.title}
                                                </button>
                                          </li>
                                    ))}
                              </ul>
                        )}
                  </div>

                  {/* right: actions */}
                  <div className="ml-auto flex items-center gap-2 md:ml-0">
                        <a href="/" target="_blank" rel="noopener noreferrer" title="View website" aria-label="View website (opens in a new tab)" className={`${iconBtn} hidden sm:flex`}><Icon d={ICONS.globe} /></a>

                        <div ref={bellRef} className="relative">
                              <button onClick={() => setBellOpen((v) => !v)} aria-expanded={bellOpen} aria-haspopup="menu" aria-label={total ? `Notifications, ${total} need attention` : "Notifications"} className={iconBtn}>
                                    <Icon d={ICONS.bell} />
                                    {total > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{total > 99 ? "99+" : total}</span>}
                              </button>
                              {bellOpen && (
                                    <div role="menu" className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
                                          <p className="border-b border-gray-700 px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Needs your attention</p>
                                          {alerts.length === 0 ? (
                                                <p className="px-4 py-6 text-center text-sm text-gray-400">You are all caught up.</p>
                                          ) : alerts.map((a) => (
                                                <Link key={a.key} to={a.to} role="menuitem" onClick={() => setBellOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 transition hover:bg-gray-700/60">
                                                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone[a.tone]}`}><Icon d={a.icon} className="h-4 w-4" /></span>
                                                      {a.text}
                                                </Link>
                                          ))}
                                    </div>
                              )}
                        </div>

                        <button onClick={onToggleTheme} role="switch" aria-checked={light} aria-label={light ? "Switch to dark mode" : "Switch to light mode"} title={light ? "Switch to dark mode" : "Switch to light mode"} className={iconBtn}>
                              <Icon d={light ? ICONS.sun : ICONS.moon} />
                        </button>

                        <div ref={userRef} className="relative">
                              <button onClick={() => setUserOpen((v) => !v)} aria-expanded={userOpen} aria-haspopup="menu" className="flex items-center gap-2.5 rounded-lg border border-gray-700 bg-gray-800 py-1 pl-1 pr-2 transition hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:pr-3">
                                    <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#1c65b4] text-[11px] font-bold text-white">
                                          {user?.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials}
                                    </span>
                                    <span className="hidden min-w-0 text-left sm:block">
                                          <span className="block max-w-[9rem] truncate text-xs font-semibold leading-tight text-white">{user?.name}</span>
                                          <span className="block max-w-[9rem] truncate text-[10px] leading-tight text-gray-400">{user?.designation}</span>
                                    </span>
                                    <Icon d={ICONS.chevron} className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />
                              </button>
                              {userOpen && (
                                    <div role="menu" className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
                                          <div className="border-b border-gray-700 px-4 py-3">
                                                <p className="truncate text-sm font-bold text-white">{user?.name}</p>
                                                <p className="truncate text-xs text-gray-400">{user?.email}</p>
                                                {user?.designation && <p className="mt-1 text-[11px] font-semibold text-blue-400">{user.designation}</p>}
                                          </div>
                                          {canOpen("/dashboard/account") && <Link to="/dashboard/account" role="menuitem" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 transition hover:bg-gray-700/60"><Icon d={ICONS.user} className="h-4 w-4" />My account</Link>}
                                          <a href="/" target="_blank" rel="noopener noreferrer" role="menuitem" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-200 transition hover:bg-gray-700/60"><Icon d={ICONS.globe} className="h-4 w-4" />View website</a>
                                          <button role="menuitem" onClick={() => { setUserOpen(false); onLogout(); }} className="flex w-full items-center gap-3 border-t border-gray-700 px-4 py-2.5 text-left text-sm text-rose-400 transition hover:bg-gray-700/60"><Icon d={ICONS.logout} className="h-4 w-4" />Sign out</button>
                                    </div>
                              )}
                        </div>
                  </div>
            </header>
      );
}
