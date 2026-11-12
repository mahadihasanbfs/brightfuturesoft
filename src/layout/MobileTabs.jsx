import { useEffect, useState } from "react"
import { MAX_TABS } from "./useTabShortcuts"
import { NavLink } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, Pin, RotateCcw, SlidersHorizontal, X, LayoutGrid } from "lucide-react"

// Phone app shell: floating bottom tab bar + "All apps" bottom sheet where the person picks their own shortcuts.

const SHORT = {
      "/dashboard/home": "Home", "/dashboard/your-task": "Tasks", "/dashboard/client_meetings": "Meetings", "/dashboard/mail": "Mail",
      "/dashboard/attendance": "Attendance", "/dashboard/sales": "Sales", "/dashboard/issue-submit": "Issues", "/dashboard/notice": "Notice",
      "/dashboard/meeting_management": "Meeting", "/dashboard/my-payslips": "Payslips", "/dashboard/blog-management": "Blog",
      "/dashboard/job-management": "Jobs", "/dashboard/project-management": "Projects", "/dashboard/employee-management": "Team",
      "/dashboard/attendance-management": "Attend. Mgmt", "/dashboard/invoice": "Invoices", "/dashboard/contact-management": "Contacts",
      "/dashboard/subscribers": "Subscribers", "/dashboard/account": "Account",
}
const shortName = (item) => SHORT[item.path] || item.title

export function TabBar({ items, paths, sheetOpen, onMore, badge }) {
      const tabs = paths.map((p) => items.find((i) => i.path === p)).filter(Boolean)
      return (
            <nav className="dash-tabbar lg:hidden" aria-label="Shortcuts">
                  <div className="dash-tabbar-in">
                  {tabs.map((item) => (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) => `dash-tab ${isActive && !sheetOpen ? "is-active" : ""}`}>
                              <span className="dash-tab-icon">
                                    {item.icon}
                                    {badge?.(item)}
                              </span>
                              <span className="dash-tab-label">{shortName(item)}</span>
                        </NavLink>
                  ))}
                  <button type="button" className={`dash-tab ${sheetOpen ? "is-active" : ""}`} onClick={onMore} aria-label="All pages" aria-haspopup="dialog">
                        <span className="dash-tab-icon"><LayoutGrid /></span>
                        <span className="dash-tab-label">All</span>
                  </button>
            </div>
            </nav>
      )
}

export function AppSheet({ open, onClose, groups, paths, update, reset, isDefault, badge, user, theme, onToggleTheme, onLogout }) {
      const [editing, setEditing] = useState(false)

      useEffect(() => {
            if (!open) return undefined
            const onKey = (e) => { if (e.key === "Escape") { setEditing(false); onClose() } }
            document.addEventListener("keydown", onKey)
            return () => document.removeEventListener("keydown", onKey)
      }, [open, onClose])

      const close = () => { setEditing(false); onClose() }
      const all = groups.flatMap((g) => g.items)
      const pinned = paths.map((p) => all.find((i) => i.path === p)).filter(Boolean)
      const toggle = (path) => {
            if (paths.includes(path)) { if (paths.length > 1) update(paths.filter((p) => p !== path)) }
            else if (paths.length < MAX_TABS) update([...paths, path])
      }
      const move = (index, dir) => {
            const next = [...paths]
            const to = index + dir
            if (to < 0 || to >= next.length) return
            ;[next[index], next[to]] = [next[to], next[index]]
            update(next)
      }

      return (
            <div className={`dash-sheet-root lg:hidden ${open ? "is-open" : ""}`} aria-hidden={!open}>
                  <div className="dash-sheet-scrim" onClick={close} />
                  <section className="dash-sheet" role="dialog" aria-modal="true" aria-label="All pages">
                        <div className="dash-sheet-grab" aria-hidden="true" />
                        <header className="dash-sheet-head">
                              <div className="dash-sheet-user">
                                    <img src={user?.image || "https://randomuser.me/api/portraits/women/79.jpg"} alt="" />
                                    <div>
                                          <strong>{user?.name}</strong>
                                          <span>{user?.possition}</span>
                                    </div>
                              </div>
                              <div className="dash-sheet-actions">
                                    <button type="button" className={`dash-chip-btn ${editing ? "is-on" : ""}`} onClick={() => setEditing((v) => !v)}>
                                          {editing ? <Check size={15} /> : <SlidersHorizontal size={15} />}
                                          {editing ? "Done" : "Customize"}
                                    </button>
                                    <button type="button" className="dash-icon-btn" onClick={close} aria-label="Close"><X size={18} /></button>
                              </div>
                        </header>

                        <div className="dash-sheet-body">
                              {editing && (
                                    <div className="dash-edit-card">
                                          <div className="dash-edit-title">
                                                <span>Your bottom shortcuts</span>
                                                <em>{paths.length}/{MAX_TABS}</em>
                                          </div>
                                          <p>Tap a page below to pin or unpin it. Use the arrows to reorder.</p>
                                          <ol>
                                                {pinned.map((item, i) => (
                                                      <li key={item.path}>
                                                            <span className="dash-edit-icon">{item.icon}</span>
                                                            <span className="dash-edit-name">{shortName(item)}</span>
                                                            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${shortName(item)} left`}><ArrowLeft size={15} /></button>
                                                            <button type="button" onClick={() => move(i, 1)} disabled={i === pinned.length - 1} aria-label={`Move ${shortName(item)} right`}><ArrowRight size={15} /></button>
                                                      </li>
                                                ))}
                                          </ol>
                                          {!isDefault && (
                                                <button type="button" className="dash-reset" onClick={reset}><RotateCcw size={13} /> Reset to default</button>
                                          )}
                                    </div>
                              )}

                              {groups.map((group) => (
                                    <div key={group.label} className="dash-group">
                                          <h3>{group.label}</h3>
                                          <div className="dash-grid">
                                                {group.items.map((item) => {
                                                      const isPinned = paths.includes(item.path)
                                                      const full = !isPinned && paths.length >= MAX_TABS
                                                      const inner = (
                                                            <>
                                                                  <span className="dash-tile-icon">
                                                                        {item.icon}
                                                                        {!editing && badge?.(item)}
                                                                  </span>
                                                                  <span className="dash-tile-name">{shortName(item)}</span>
                                                                  {editing && (
                                                                        <span className={`dash-pin ${isPinned ? "is-on" : ""}`}>
                                                                              {isPinned ? <Check size={12} /> : <Pin size={12} />}
                                                                        </span>
                                                                  )}
                                                            </>
                                                      )
                                                      return editing ? (
                                                            <button key={item.path} type="button" className={`dash-tile ${isPinned ? "is-pinned" : ""} ${full ? "is-dim" : ""}`}
                                                                  onClick={() => toggle(item.path)} disabled={full} aria-pressed={isPinned}>
                                                                  {inner}
                                                            </button>
                                                      ) : (
                                                            <NavLink key={item.path} to={item.path} className={({ isActive }) => `dash-tile ${isActive ? "is-current" : ""}`} onClick={close}>
                                                                  {inner}
                                                            </NavLink>
                                                      )
                                                })}
                                          </div>
                                    </div>
                              ))}

                              {!editing && (
                                    <div className="dash-sheet-foot">
                                          <button type="button" onClick={onToggleTheme}>{theme === "light" ? "Dark mode" : "Light mode"}</button>
                                          <button type="button" className="is-danger" onClick={() => { close(); onLogout() }}>Log out</button>
                                    </div>
                              )}
                        </div>
                  </section>
            </div>
      )
}
