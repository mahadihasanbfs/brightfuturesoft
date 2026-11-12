import { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import {
      X, Minus, Maximize2, Minimize2, Bold, Italic, Underline, Strikethrough, List, ListOrdered, Indent, Outdent,
      Quote, AlignLeft, AlignCenter, AlignRight, Paperclip, Link2, Smile, Trash2, Baseline, RemoveFormatting, Highlighter,
      CaseSensitive, Send, Loader2, AlertTriangle, KeyRound,
} from 'lucide-react';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import { mail, extractEmails, avatarColor, initials } from './mailApi';
import { confirmDialog } from '../../../Hook/confirmDialog';

const EMAIL_RE = /^[^\s,;<>@]+@[^\s,;<>@]+\.[^\s,;<>@]+$/;
const MAX_TOTAL = 20 * 1024 * 1024;
const FONTS = [['Sans Serif', 'Arial'], ['Serif', 'Georgia'], ['Fixed width', 'Courier New'], ['Wide', 'Verdana'], ['Narrow', 'Arial Narrow']];
const SIZES = [['Small', 2], ['Normal', 3], ['Large', 5], ['Huge', 6]];
const EMOJIS = ['😀', '😊', '😂', '😍', '🙏', '👍', '👏', '🎉', '🔥', '✅', '❤️', '😅', '🤝', '💡', '📎', '📅', '⭐', '🚀', '😉', '🙌'];
const DARK_DIALOG = { theme: 'dark', background: '#111a2e', color: '#e5e7eb' };

const escapeHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Plain text (with "> " quoted lines from replies) -> HTML for the editor.
const textToHtml = (text = '') => {
      const out = [];
      let quoted = [];
      const flush = () => {
            if (quoted.length) out.push(`<blockquote style="margin:0 0 0 .8ex;border-left:2px solid #64748b;padding-left:1ex">${quoted.join('<br>')}</blockquote>`);
            quoted = [];
      };
      for (const line of text.split('\n')) {
            if (line.startsWith('>')) quoted.push(escapeHtml(line.replace(/^>\s?/, '')) || '<br>');
            else { flush(); out.push(`<div>${escapeHtml(line) || '<br>'}</div>`); }
      }
      flush();
      return out.join('');
};

const toBase64 = (file) => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result).split(',')[1] || '');
      r.onerror = () => reject(new Error(`Could not read ${file.name}`));
      r.readAsDataURL(file);
});

const sizeLabel = (n) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

const keep = (e) => e.preventDefault(); // keep the editor selection when pressing a toolbar button

const Tool = ({ title, onClick, active, children }) => (
      <button
            type="button" title={title} aria-label={title} onMouseDown={keep} onClick={onClick}
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${active ? 'bg-blue-500/20 text-blue-300' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
      >
            {children}
      </button>
);

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-white/10" />;

function RecipientInput({ label, chips, setChips, right, autoFocus }) {
      const [text, setText] = useState('');
      const commit = (raw = text) => {
            const parts = raw.split(/[,;\s]+/).filter(Boolean);
            if (parts.length) setChips([...chips, ...parts.filter((p) => !chips.includes(p))]);
            setText('');
      };
      return (
            <div className="flex items-start gap-3 border-b border-white/5 px-5 py-2 text-sm">
                  <span className="w-12 shrink-0 pt-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">{label}</span>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                        {chips.map((c) => {
                              const valid = EMAIL_RE.test(c);
                              return (
                                    <span key={c} className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-2 text-xs ${valid ? 'border-white/10 bg-white/5 text-gray-200' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>
                                          <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white ${valid ? avatarColor(c) : 'bg-red-600'}`}>{valid ? initials(c) : '!'}</span>
                                          {c}
                                          <button type="button" onClick={() => setChips(chips.filter((x) => x !== c))} aria-label={`Remove ${c}`} className="text-gray-500 hover:text-white"><X size={12} /></button>
                                    </span>
                              );
                        })}
                        <input
                              autoFocus={autoFocus}
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                              onKeyDown={(e) => {
                                    if (['Enter', ',', ';', ' ', 'Tab'].includes(e.key) && text.trim()) { e.preventDefault(); commit(); }
                                    else if (e.key === 'Backspace' && !text && chips.length) setChips(chips.slice(0, -1));
                              }}
                              onBlur={() => text.trim() && commit()}
                              onPaste={(e) => { const t = e.clipboardData.getData('text'); if (/[,;\s]/.test(t.trim())) { e.preventDefault(); commit(t); } }}
                              className="min-w-[8rem] flex-1 bg-transparent py-1.5 text-gray-100 outline-none focus:!shadow-none focus-visible:!outline-none"
                              aria-label={label}
                        />
                  </div>
                  {right}
            </div>
      );
}

// initial: { to, cc, bcc, subject, text, threadId, inReplyTo, references } (replies and forwards pre-fill these).
export default function ComposeModal({ initial = {}, fromEmail, sendConfigured = true, onOpenSettings, onClose, onSent }) {
      const { user } = useContext(AuthContext);
      const editor = useRef(null);
      const fileInput = useRef(null);
      const savedRange = useRef(null);
      const [view, setView] = useState('normal'); // normal | min | max
      const [to, setTo] = useState(() => extractEmails(initial.to || ''));
      const [cc, setCc] = useState(() => extractEmails(initial.cc || ''));
      const [bcc, setBcc] = useState(() => extractEmails(initial.bcc || ''));
      const [showCc, setShowCc] = useState(Boolean(initial.cc));
      const [showBcc, setShowBcc] = useState(false);
      const [subject, setSubject] = useState(initial.subject || '');
      const [files, setFiles] = useState([]);
      const [showTools, setShowTools] = useState(true);
      const [showEmoji, setShowEmoji] = useState(false);
      const [linkUrl, setLinkUrl] = useState(null);
      const [fmt, setFmt] = useState({});
      const [sending, setSending] = useState(false);
      const [error, setError] = useState('');

      // Fill the editor once; put the caret at the top so a reply is typed above the quoted message.
      useEffect(() => {
            const el = editor.current;
            el.innerHTML = initial.text ? textToHtml(initial.text.replace(/^\n+/, '\n')) : '';
            if (initial.text) {
                  const range = document.createRange();
                  range.setStart(el, 0);
                  range.collapse(true);
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(range);
                  el.focus();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // Track the selection inside the editor: toolbar state, and the range to restore when a popover steals focus.
      useEffect(() => {
            const onSelection = () => {
                  const sel = window.getSelection();
                  if (!sel.rangeCount || !editor.current?.contains(sel.anchorNode)) return;
                  savedRange.current = sel.getRangeAt(0).cloneRange();
                  setFmt({
                        bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'),
                        underline: document.queryCommandState('underline'), strike: document.queryCommandState('strikeThrough'),
                  });
            };
            document.addEventListener('selectionchange', onSelection);
            return () => document.removeEventListener('selectionchange', onSelection);
      }, []);

      const exec = (cmd, value) => {
            editor.current.focus();
            if (savedRange.current) {
                  const sel = window.getSelection();
                  sel.removeAllRanges();
                  sel.addRange(savedRange.current);
            }
            document.execCommand(cmd, false, value);
      };

      const hasContent = () => Boolean(editor.current?.innerText.trim() || subject || to.length || files.length);

      const close = async () => {
            if (hasContent()) {
                  const isConfirmed = await confirmDialog({ title: 'Discard this draft?', message: 'What you have written will be lost.', confirmText: 'Discard', tone: 'danger' });
                  if (!isConfirmed) return;
            }
            onClose();
      };

      const addFiles = (list) => {
            const incoming = [...list];
            if ([...files, ...incoming].reduce((t, f) => t + f.size, 0) > MAX_TOTAL) { setError('Attachments are limited to 20 MB in total.'); return; }
            if (files.length + incoming.length > 10) { setError('At most 10 attachments.'); return; }
            setError('');
            setFiles([...files, ...incoming]);
      };

      const applyLink = () => {
            let url = (linkUrl || '').trim();
            if (url) {
                  if (!/^(https?:|mailto:)/i.test(url)) url = `https://${url}`;
                  exec('createLink', url);
            }
            setLinkUrl(null);
      };

      const send = async () => {
            setError('');
            const all = [...to, ...cc, ...bcc];
            if (!to.length) return setError('Add at least one recipient.');
            const bad = all.find((a) => !EMAIL_RE.test(a));
            if (bad) return setError(`"${bad}" is not a valid email address.`);
            const text = editor.current.innerText.trim();
            if (!text && !files.length) return setError('Write a message first.');
            if (!subject.trim()) {
                  const isConfirmed = await confirmDialog({ title: 'Send without a subject?', message: 'The message will go out with no subject line.', confirmText: 'Send anyway', tone: 'warning' });
                  if (!isConfirmed) return;
            }
            setSending(true);
            try {
                  const attachments = await Promise.all(files.map(async (f) => ({ filename: f.name, mimeType: f.type || 'application/octet-stream', data: await toBase64(f) })));
                  await mail.send({
                        to: to.join(', '), cc: cc.join(', '), bcc: bcc.join(', '), subject,
                        html: `<div style="font-family:Arial,sans-serif;font-size:14px">${editor.current.innerHTML}</div>`,
                        text, attachments,
                        threadId: initial.threadId, inReplyTo: initial.inReplyTo, references: initial.references,
                  });
                  onSent();
            } catch (err) {
                  setError(err.message);
            } finally {
                  setSending(false);
            }
      };

      const shell =
            view === 'max' ? 'inset-0 sm:inset-10 sm:rounded-2xl' :
            view === 'min' ? 'bottom-0 right-0 w-full sm:right-6 sm:w-80 rounded-t-xl' :
            'inset-0 sm:inset-auto sm:bottom-0 sm:right-6 sm:h-[min(640px,92vh)] sm:w-[min(640px,calc(100vw-3rem))] sm:rounded-t-2xl';

      return (
            <>
                  <style>{'@keyframes composeIn{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}'}</style>
                  {view === 'max' && <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setView('normal')} />}
                  <div
                        role="dialog" aria-label="New message"
                        style={{ animation: 'composeIn .18s ease-out' }}
                        className={`fixed z-50 flex flex-col overflow-hidden bg-[#0e1526] text-gray-100 shadow-[0_24px_70px_rgba(0,0,0,.65)] ring-1 ring-white/10 ${shell}`}
                  >
                        {/* Title bar */}
                        <div className="flex shrink-0 cursor-pointer items-center justify-between border-b border-white/5 bg-[#131c33] px-5 py-3" onClick={() => view === 'min' && setView('normal')}>
                              <span className="truncate text-sm font-semibold text-gray-100">{subject.trim() || 'New message'}</span>
                              <span className="flex items-center gap-0.5 text-gray-400" onClick={(e) => e.stopPropagation()}>
                                    <button type="button" title="Minimize" aria-label="Minimize" onClick={() => setView(view === 'min' ? 'normal' : 'min')} className="rounded-lg p-1.5 transition hover:bg-white/10 hover:text-white"><Minus size={15} /></button>
                                    <button type="button" title={view === 'max' ? 'Exit full screen' : 'Full screen'} aria-label="Full screen" onClick={() => setView(view === 'max' ? 'normal' : 'max')} className="hidden rounded-lg p-1.5 transition hover:bg-white/10 hover:text-white sm:block">{view === 'max' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                                    <button type="button" title="Close" aria-label="Close" onClick={close} className="rounded-lg p-1.5 transition hover:bg-red-500/20 hover:text-red-300"><X size={16} /></button>
                              </span>
                        </div>

                        <div className={`${view === 'min' ? 'hidden' : 'flex'} min-h-0 flex-1 flex-col`}>
                              {!sendConfigured && (
                                    <div className="flex shrink-0 items-center gap-3 border-b border-amber-500/20 bg-amber-500/10 px-5 py-2.5 text-xs text-amber-200">
                                          <KeyRound size={15} className="shrink-0" />
                                          <span className="flex-1">Add your Resend API key to send mail.</span>
                                          <button type="button" onClick={onOpenSettings} className="rounded-md bg-amber-500/20 px-2.5 py-1 font-semibold text-amber-100 transition hover:bg-amber-500/30">Open settings</button>
                                    </div>
                              )}

                              {/* Header fields */}
                              <div className="flex items-center gap-3 border-b border-white/5 px-5 py-2.5 text-sm">
                                    <span className="w-12 shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">From</span>
                                    <span className="flex min-w-0 items-center gap-2">
                                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ${avatarColor(fromEmail || user?.name)}`}>{initials(user?.name || '')}</span>
                                          <span className="truncate text-gray-200">{user?.name} <span className="text-gray-500">&lt;{fromEmail || 'your address'}&gt;</span></span>
                                    </span>
                              </div>
                              <RecipientInput
                                    label="To" chips={to} setChips={setTo} autoFocus={!initial.to}
                                    right={<span className="shrink-0 space-x-1 pt-1 text-xs">
                                          {!showCc && <button type="button" onClick={() => setShowCc(true)} className="rounded-md px-2 py-1 text-gray-400 transition hover:bg-white/10 hover:text-white">Cc</button>}
                                          {!showBcc && <button type="button" onClick={() => setShowBcc(true)} className="rounded-md px-2 py-1 text-gray-400 transition hover:bg-white/10 hover:text-white">Bcc</button>}
                                    </span>}
                              />
                              {showCc && <RecipientInput label="Cc" chips={cc} setChips={setCc} />}
                              {showBcc && <RecipientInput label="Bcc" chips={bcc} setChips={setBcc} />}
                              <input
                                    value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject"
                                    className="shrink-0 border-b border-white/5 bg-transparent px-5 py-3 text-[15px] font-medium text-gray-100 outline-none placeholder:font-normal placeholder:text-gray-500 focus:!border-white/5 focus:!shadow-none focus-visible:!outline-none"
                              />

                              {/* Editor */}
                              <div
                                    ref={editor}
                                    contentEditable
                                    suppressContentEditableWarning
                                    role="textbox"
                                    aria-label="Message body"
                                    data-placeholder="Write your message…"
                                    onPaste={(e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); }}
                                    onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); send(); } }}
                                    className="min-h-[8rem] flex-1 overflow-y-auto px-5 py-4 text-[15px] leading-relaxed text-gray-100 caret-blue-400 outline-none focus-visible:!outline-none empty:before:pointer-events-none empty:before:text-gray-600 empty:before:content-[attr(data-placeholder)] [&_a]:text-blue-400 [&_a]:underline [&_blockquote]:text-gray-400 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                              />

                              {files.length > 0 && (
                                    <div className="flex shrink-0 flex-wrap gap-2 border-t border-white/5 px-5 py-3">
                                          {files.map((f, i) => (
                                                <span key={`${f.name}${i}`} className="inline-flex max-w-[16rem] items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-1.5 pl-2.5 pr-1.5 text-xs text-gray-200">
                                                      <Paperclip size={13} className="shrink-0 text-gray-400" />
                                                      <span className="truncate">{f.name}</span>
                                                      <span className="shrink-0 text-gray-500">{sizeLabel(f.size)}</span>
                                                      <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} aria-label={`Remove ${f.name}`} className="rounded p-0.5 text-gray-500 hover:bg-white/10 hover:text-white"><X size={12} /></button>
                                                </span>
                                          ))}
                                    </div>
                              )}

                              {error && (
                                    <div className="mx-5 mb-2 flex shrink-0 items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                                          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {error}
                                    </div>
                              )}

                              {linkUrl !== null && (
                                    <div className="mx-5 mb-2 flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
                                          <Link2 size={15} className="ml-1 shrink-0 text-gray-400" />
                                          <input autoFocus value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') setLinkUrl(null); }} placeholder="Paste a link, e.g. https://example.com" className="flex-1 bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500 focus:!shadow-none focus-visible:!outline-none" />
                                          <button type="button" onClick={applyLink} className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500">Apply</button>
                                          <button type="button" onClick={() => setLinkUrl(null)} className="px-1 text-xs text-gray-400 hover:text-white">Cancel</button>
                                    </div>
                              )}

                              {/* Formatting toolbar: one scrollable row */}
                              {showTools && (
                                    <div className="mx-4 mb-2 flex shrink-0 items-center gap-0.5 overflow-x-auto rounded-xl border border-white/10 bg-white/5 px-2 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                          <select title="Font" aria-label="Font" onChange={(e) => exec('fontName', e.target.value)} defaultValue="Arial" className="h-8 max-w-[6.5rem] shrink-0 cursor-pointer rounded-lg bg-transparent px-1.5 text-xs text-gray-300 outline-none hover:bg-white/10 [&>option]:bg-[#131c33]">
                                                {FONTS.map(([l, v]) => <option key={v} value={v}>{l}</option>)}
                                          </select>
                                          <select title="Size" aria-label="Size" onChange={(e) => exec('fontSize', e.target.value)} defaultValue="3" className="h-8 shrink-0 cursor-pointer rounded-lg bg-transparent px-1.5 text-xs text-gray-300 outline-none hover:bg-white/10 [&>option]:bg-[#131c33]">
                                                {SIZES.map(([l, v]) => <option key={v} value={v}>{l}</option>)}
                                          </select>
                                          <Divider />
                                          <Tool title="Bold (Ctrl+B)" active={fmt.bold} onClick={() => exec('bold')}><Bold size={15} /></Tool>
                                          <Tool title="Italic (Ctrl+I)" active={fmt.italic} onClick={() => exec('italic')}><Italic size={15} /></Tool>
                                          <Tool title="Underline (Ctrl+U)" active={fmt.underline} onClick={() => exec('underline')}><Underline size={15} /></Tool>
                                          <Tool title="Strikethrough" active={fmt.strike} onClick={() => exec('strikeThrough')}><Strikethrough size={15} /></Tool>
                                          <label title="Text colour" className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white" onMouseDown={keep}>
                                                <Baseline size={16} />
                                                <input type="color" defaultValue="#000000" onChange={(e) => exec('foreColor', e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                                          </label>
                                          <label title="Highlight colour" className="relative inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white" onMouseDown={keep}>
                                                <Highlighter size={15} />
                                                <input type="color" defaultValue="#fff59d" onChange={(e) => exec('hiliteColor', e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                                          </label>
                                          <Divider />
                                          <Tool title="Align left" onClick={() => exec('justifyLeft')}><AlignLeft size={15} /></Tool>
                                          <Tool title="Align centre" onClick={() => exec('justifyCenter')}><AlignCenter size={15} /></Tool>
                                          <Tool title="Align right" onClick={() => exec('justifyRight')}><AlignRight size={15} /></Tool>
                                          <Divider />
                                          <Tool title="Numbered list" onClick={() => exec('insertOrderedList')}><ListOrdered size={15} /></Tool>
                                          <Tool title="Bulleted list" onClick={() => exec('insertUnorderedList')}><List size={15} /></Tool>
                                          <Tool title="Decrease indent" onClick={() => exec('outdent')}><Outdent size={15} /></Tool>
                                          <Tool title="Increase indent" onClick={() => exec('indent')}><Indent size={15} /></Tool>
                                          <Tool title="Quote" onClick={() => exec('formatBlock', 'blockquote')}><Quote size={15} /></Tool>
                                          <Tool title="Remove formatting" onClick={() => exec('removeFormat')}><RemoveFormatting size={15} /></Tool>
                                    </div>
                              )}

                              {/* Action bar */}
                              <div className="relative flex shrink-0 items-center gap-1 border-t border-white/5 px-4 py-3">
                                    <button
                                          type="button" onClick={send} disabled={sending}
                                          className="mr-2 inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 active:scale-[.98] disabled:opacity-60"
                                    >
                                          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                                          {sending ? 'Sending…' : 'Send'}
                                          {!sending && <kbd className="ml-1 hidden rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-100 sm:inline">⌘↵</kbd>}
                                    </button>
                                    <Tool title="Formatting options" active={showTools} onClick={() => setShowTools(!showTools)}><CaseSensitive size={19} /></Tool>
                                    <Tool title="Attach files" onClick={() => fileInput.current.click()}><Paperclip size={17} /></Tool>
                                    <input ref={fileInput} type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                                    <Tool title="Insert link" active={linkUrl !== null} onClick={() => setLinkUrl('')}><Link2 size={17} /></Tool>
                                    <Tool title="Insert emoji" active={showEmoji} onClick={() => setShowEmoji(!showEmoji)}><Smile size={17} /></Tool>
                                    {showEmoji && (
                                          <div className="absolute bottom-14 left-36 z-10 grid w-60 grid-cols-5 gap-1 rounded-xl border border-white/10 bg-[#131c33] p-2 shadow-2xl">
                                                {EMOJIS.map((em) => (
                                                      <button key={em} type="button" onMouseDown={keep} onClick={() => { exec('insertText', em); setShowEmoji(false); }} className="rounded-lg p-1.5 text-lg transition hover:bg-white/10">{em}</button>
                                                ))}
                                          </div>
                                    )}
                                    <button type="button" title="Discard draft" aria-label="Discard draft" onClick={close} className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-500/15 hover:text-red-300"><Trash2 size={17} /></button>
                              </div>
                        </div>
                  </div>
            </>
      );
}
