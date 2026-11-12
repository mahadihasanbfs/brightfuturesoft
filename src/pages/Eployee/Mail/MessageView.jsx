import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { ArrowLeft, Reply, ReplyAll, Forward, Star, Trash2, MailOpen, Paperclip, ImageOff, Maximize2, Send } from 'lucide-react';
import { mail, parseAddress, buildReply, buildForward, quoteText, fullDate } from './mailApi';
import Avatar from './Avatar';

const sizeLabel = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

// Email HTML is untrusted: no scripts, no same-origin access, and remote images (tracking pixels) blocked until asked.
const frameDoc = (html, showImages) => `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${showImages ? 'https: http:' : ''}; style-src 'unsafe-inline'; font-src data:">
<base target="_blank"><style>body{margin:0;padding:20px;font-family:system-ui,sans-serif;font-size:14px;color:#111;background:#fff;word-wrap:break-word}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`;

const field = 'w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none';

const IconButton = ({ title, onClick, active, danger, children }) => (
      <button
            title={title}
            aria-label={title}
            onClick={onClick}
            className={`rounded-lg p-2 transition hover:bg-gray-800 ${active ? 'text-amber-400' : 'text-gray-400'} ${danger ? 'hover:text-red-400' : 'hover:text-white'}`}
      >
            {children}
      </button>
);

// Inline reply under the message: the thread headers are set so Gmail keeps it in the same conversation.
function ReplyBox({ draft, onClose, onSent, onExpand }) {
      const [form, setForm] = useState({ ...draft, body: '' });
      const [showCc, setShowCc] = useState(Boolean(draft.cc));
      const [showQuote, setShowQuote] = useState(false);
      const [sending, setSending] = useState(false);
      const [error, setError] = useState('');
      const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

      const submit = async (e) => {
            e.preventDefault();
            setSending(true);
            setError('');
            try {
                  const { body, quote, ...rest } = form;
                  await mail.send({ ...rest, text: `${body.trim()}${quote}` });
                  onSent();
            } catch (err) {
                  setError(err.message);
            } finally {
                  setSending(false);
            }
      };

      return (
            <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-700 bg-gray-900/60 p-4">
                  <div className="flex items-center gap-2 text-sm">
                        <span className="w-12 shrink-0 text-gray-500">To</span>
                        <input required className={field} value={form.to} onChange={set('to')} />
                        {!showCc && <button type="button" onClick={() => setShowCc(true)} className="whitespace-nowrap text-xs text-blue-400 hover:text-blue-300">Cc</button>}
                  </div>
                  {showCc && (
                        <div className="flex items-center gap-2 text-sm">
                              <span className="w-12 shrink-0 text-gray-500">Cc</span>
                              <input className={field} value={form.cc} onChange={set('cc')} />
                        </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                        <span className="w-12 shrink-0 text-gray-500">Subject</span>
                        <input className={field} value={form.subject} onChange={set('subject')} />
                  </div>
                  <textarea autoFocus required rows={6} className={field} placeholder="Write your reply…" value={form.body} onChange={set('body')} />
                  <button type="button" onClick={() => setShowQuote(!showQuote)} className="rounded bg-gray-800 px-2 py-0.5 text-xs text-gray-400 hover:text-white" title="The original message is quoted below your reply">
                        {showQuote ? 'Hide quoted message' : '••• Show quoted message'}
                  </button>
                  {showQuote && <pre className="max-h-40 overflow-auto whitespace-pre-wrap border-l-2 border-gray-700 pl-3 font-sans text-xs text-gray-500">{form.quote.trim()}</pre>}
                  {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
                  <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                              <button disabled={sending} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
                                    <Send size={14} /> {sending ? 'Sending…' : 'Send'}
                              </button>
                              <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white">Discard</button>
                        </div>
                        <button type="button" title="Open in full editor" onClick={() => onExpand({ ...form, text: `${form.body}${form.quote}` })} className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"><Maximize2 size={16} /></button>
                  </div>
            </form>
      );
}

export default function MessageView({ id, ownEmail, onBack, onForward, onExpandReply, onChanged, onRead, onGone }) {
      const [showImages, setShowImages] = useState(false);
      const [draft, setDraft] = useState(null);
      const { data: msg, isLoading, error } = useQuery({ queryKey: ['gmail-msg', id], queryFn: () => mail.get(id) });

      // Opening a message marks it read.
      useEffect(() => {
            if (msg?.unread) mail.modify(id, { read: true }).then(() => onRead(id)).catch(() => {});
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [msg?.id]);

      useEffect(() => { setShowImages(false); setDraft(null); }, [id]);

      const backBar = (
            <button onClick={onBack} className="m-3 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white md:hidden"><ArrowLeft size={16} /> Back</button>
      );
      if (isLoading) return <div>{backBar}<p className="p-8 text-gray-400">Loading…</p></div>;
      if (error) return <div>{backBar}<p className="p-8 text-red-400">{error.message}</p></div>;

      const from = parseAddress(msg.from);
      const act = (fn, then) => async () => {
            try { await fn(); then(); } catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0A65B4' }); }
      };
      const download = async (att) => {
            const blob = await mail.attachment(id, att);
            const url = URL.createObjectURL(blob);
            Object.assign(document.createElement('a'), { href: url, download: att.filename }).click();
            URL.revokeObjectURL(url);
      };
      const startReply = (all) => setDraft({ ...buildReply(msg, ownEmail, all), quote: quoteText(msg) });
      const pill = 'ml-pill inline-flex items-center gap-2 px-4 py-2 text-sm';

      return (
            <div className="ml-reader flex h-full flex-col">
                  {backBar}
                  <header className="border-b border-gray-800 px-6 py-5">
                        <div className="flex items-start justify-between gap-4">
                              <h2 className="text-xl font-semibold leading-snug">{msg.subject}</h2>
                              <div className="flex shrink-0 items-center">
                                    <IconButton title={msg.starred ? 'Remove star' : 'Star'} active={msg.starred} onClick={act(() => mail.modify(id, { starred: !msg.starred }), onChanged)}><Star size={18} fill={msg.starred ? 'currentColor' : 'none'} /></IconButton>
                                    <IconButton title="Mark as unread" onClick={act(() => mail.modify(id, { read: false }), () => { onChanged(); onGone(); })}><MailOpen size={18} /></IconButton>
                                    <IconButton title="Move to trash" danger onClick={act(() => mail.trash(id), () => { onChanged(); onGone(); })}><Trash2 size={18} /></IconButton>
                              </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                              <Avatar name={from.name} email={from.email} />
                              <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold">{from.name}</p>
                                    <p className="ml-link break-all text-sm">{from.email}</p>
                                    <p className="truncate text-xs text-gray-500" title={msg.to}>to {msg.to}{msg.cc ? ` · cc ${msg.cc}` : ''}</p>
                              </div>
                              <time className="ml-auto shrink-0 text-xs text-gray-500">{fullDate(msg.date)}</time>
                        </div>
                  </header>

                  {msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 border-b border-gray-800 px-6 py-3">
                              {msg.attachments.map((a, i) => a.id ? (
                                    <button key={a.id} onClick={() => download(a)} className="ml-att inline-flex items-center gap-2 px-3 py-1.5 text-xs">
                                          <Paperclip size={14} /> {a.filename} <span className="text-gray-500">{sizeLabel(a.size)}</span>
                                    </button>
                              ) : (
                                    <span key={i} className="inline-flex items-center gap-2 rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-500">
                                          <Paperclip size={14} /> {a.filename} <span>{sizeLabel(a.size)}</span>
                                    </span>
                              ))}
                        </div>
                  )}

                  <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="p-4">
                              {msg.html ? (
                                    <div className="overflow-hidden rounded-xl bg-white">
                                          {!showImages && /<img/i.test(msg.html) && (
                                                <button onClick={() => setShowImages(true)} className="m-3 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200">
                                                      <ImageOff size={14} /> Remote images blocked. Load images
                                                </button>
                                          )}
                                          <iframe title="Message" sandbox="allow-popups allow-popups-to-escape-sandbox" srcDoc={frameDoc(msg.html, showImages)} className="h-[55vh] w-full bg-white" />
                                    </div>
                              ) : (
                                    <pre className="ml-text whitespace-pre-wrap rounded-xl p-5 font-sans text-sm leading-relaxed">{msg.text || '(empty message)'}</pre>
                              )}
                        </div>

                        <div className="px-4 pb-6">
                              {draft ? (
                                    <ReplyBox
                                          key={draft.inReplyTo + draft.to}
                                          draft={draft}
                                          onClose={() => setDraft(null)}
                                          onExpand={(d) => { setDraft(null); onExpandReply(d); }}
                                          onSent={() => { setDraft(null); onChanged(); Swal.fire({ icon: 'success', title: 'Reply sent', timer: 1400, showConfirmButton: false }); }}
                                    />
                              ) : (
                                    <div className="flex flex-wrap gap-3">
                                          <button onClick={() => startReply(false)} className={pill}><Reply size={16} /> Reply</button>
                                          <button onClick={() => startReply(true)} className={pill}><ReplyAll size={16} /> Reply all</button>
                                          <button onClick={() => onForward(buildForward(msg))} className={pill}><Forward size={16} /> Forward</button>
                                    </div>
                              )}
                        </div>
                  </div>
            </div>
      );
}
