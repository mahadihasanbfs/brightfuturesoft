// "How this meeting works + how to prepare" for online and phone bookings.
// mode: { title, summary, tips[] } from the server; prepare: the appointment type's own checklist.
const Check = () => (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[#0A65B4]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
);

const field = "w-full rounded-sm border border-[#E1E9F2] bg-white px-3.5 py-3 text-sm text-[#142235] placeholder-[#8794A4] focus:border-[#0A65B4] focus:outline-none focus:ring-2 focus:ring-[#0A65B4]/20";

// Optional inputs: onPhone/onAgenda make the panel editable (booking form); without them it is read-only text.
const MeetingPrep = ({ mode, prepare = [], kind, phone, onPhone, agenda, onAgenda, className = "" }) => {
      if (!mode) return null;
      const items = [...prepare, ...(mode.tips || [])];
      const editable = Boolean(onPhone || onAgenda);
      return (
            <section className={`rounded-sm border border-[#E1E9F2] bg-white text-left ${className}`} aria-label="Meeting preparation">
                  <div className="flex items-start gap-3 border-b border-[#E1E9F2] bg-[#F7FAFF] p-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#F1F8FF] text-[#0A65B4]" aria-hidden="true">
                              {kind === "phone" ? (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
                              ) : (
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></svg>
                              )}
                        </span>
                        <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A65B4]">Meeting preparation</p>
                              <p className="text-sm font-bold text-[#142235]">{mode.title}</p>
                              <p className="mt-1 text-sm leading-relaxed text-[#66758A]">{mode.summary}</p>
                              {kind === "phone" && !onPhone && phone && (
                                    <p className="mt-2 text-sm font-semibold text-[#142235]">We will call: {phone}</p>
                              )}
                        </div>
                  </div>
                  {editable && (
                        <div className="space-y-4 p-4">
                              {kind === "phone" && onPhone && (
                                    <div>
                                          <label htmlFor="prep-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#66758A]">Phone number to call *</label>
                                          <input id="prep-phone" type="tel" required maxLength={40} className={field} placeholder="+880 1XXX-XXXXXX" value={phone} onChange={e => onPhone(e.target.value)} />
                                          <p className="mt-1.5 text-xs text-[#66758A]">Include the country code. We call this number at the booked time.</p>
                                    </div>
                              )}
                              {onAgenda && (
                                    <div>
                                          <label htmlFor="prep-agenda" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#66758A]">Meeting agenda *</label>
                                          <textarea id="prep-agenda" rows={3} required maxLength={1000} className={field} placeholder="What should we cover, and what will you prepare or share?" value={agenda} onChange={e => onAgenda(e.target.value)} />
                                    </div>
                              )}
                        </div>
                  )}
                  {items.length > 0 && (
                        editable ? (
                              // On the form the checklist is optional reading: collapsed so it never gets in the way.
                              <details className="group border-t border-[#E1E9F2]">
                                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#66758A] hover:text-[#0A65B4]">
                                          What to prepare
                                          <span className="text-base transition group-open:rotate-90" aria-hidden="true">›</span>
                                    </summary>
                                    <ul className="space-y-2 px-4 pb-4">
                                          {items.map(i => (
                                                <li key={i} className="flex gap-2.5 text-sm leading-snug text-[#142235]"><Check />{i}</li>
                                          ))}
                                    </ul>
                              </details>
                        ) : (
                              <div className="p-4">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#8794A4]">How to prepare</p>
                                    <ul className="space-y-2">
                                          {items.map(i => (
                                                <li key={i} className="flex gap-2.5 text-sm leading-snug text-[#142235]"><Check />{i}</li>
                                          ))}
                                    </ul>
                              </div>
                        )
                  )}
            </section>
      );
};

export default MeetingPrep;
