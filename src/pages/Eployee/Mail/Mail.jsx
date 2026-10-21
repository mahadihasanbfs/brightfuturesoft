import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Inbox, Send, Star, FileText, Trash2, ShieldAlert, Pencil, RefreshCw, Search, Mail as MailIcon, Unplug, Settings, Mails, CheckCheck, MailOpen, Check, X as XIcon } from 'lucide-react';
import { base_url } from '../../../layout/Title';
import { mail, parseAddress } from './mailApi';
import Avatar from './Avatar';
import MessageView from './MessageView';
import ComposeModal from './ComposeModal';
import SendSettingsModal from './SendSettingsModal';

const FOLDERS = [
      { id: 'all', label: 'All mail', icon: Mails },
      { id: 'inbox', label: 'Inbox', icon: Inbox },
      { id: 'starred', label: 'Starred', icon: Star },
      { id: 'sent', label: 'Sent', icon: Send },
      { id: 'drafts', label: 'Drafts', icon: FileText },
      { id: 'spam', label: 'Spam', icon: ShieldAlert },
      { id: 'trash', label: 'Trash', icon: Trash2 },
];

// Folders that can be filtered to unread and cleared with "Mark all as read".
const UNREAD_FOLDERS = ['inbox', 'all'];
const DARK_DIALOG = { theme: 'dark', background: '#111a2e', color: '#e5e7eb' };

const REASONS = {
      permissions_missing: 'Both permissions (read and send) are needed. Please try again and keep them ticked.',
      no_refresh_token: 'Google did not grant long-term access. Remove this app at myaccount.google.com/permissions, then connect again.',
      access_denied: 'Access was declined.',
      gmail_api_disabled: 'The Gmail API is not enabled in the Google Cloud project. Enable it (APIs & Services → Library → Gmail API → Enable), wait a minute, then try again.',
};

const shortDate = (ts) => {
      const d = new Date(ts);
      return d.toDateString() === new Date().toDateString()
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString([], { day: 'numeric', month: 'short' });
};

const GoogleG = () => (
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
);

function ConnectScreen({ status, onConnected }) {
      const [busy, setBusy] = useState(false);

      const connect = async () => {
            if (status && !status.configured) {
                  Swal.fire({ icon: 'info', title: 'Google credentials missing', text: 'Add the Google OAuth client ID and secret to CONFIG in portfolio-server/Modules/gmail_module.js, then restart the backend.', confirmButtonColor: '#0A65B4' });
                  return;
            }
            setBusy(true);
            // Open the window synchronously on the click so the browser does not treat it as a blocked popup.
            const popup = window.open('', 'gmail-connect', 'width=520,height=680,left=200,top=80');
            try {
                  const { url } = await mail.authUrl(Boolean(popup));
                  if (!popup) {
                        window.location.href = url; // popups blocked: fall back to a full-page redirect
                        return;
                  }
                  popup.location.href = url;

                  // Done when the popup reports back, or when the server shows the account linked
                  // (covers browsers that cut the popup's link to this page).
                  await new Promise((resolve) => {
                        const finish = () => { window.removeEventListener('message', onMessage); clearInterval(timer); resolve(); };
                        const onMessage = (e) => {
                              if (e.origin !== new URL(base_url).origin || e.data?.type !== 'gmail-oauth') return;
                              if (e.data.gmail !== 'connected') {
                                    Swal.fire({ icon: 'error', title: 'Gmail not connected', text: REASONS[e.data.reason] || `Something went wrong (${e.data.reason}). Please try again.`, confirmButtonColor: '#0A65B4' });
                              }
                              finish();
                        };
                        window.addEventListener('message', onMessage);
                        const started = Date.now();
                        const timer = setInterval(async () => {
                              const s = await mail.status().catch(() => null);
                              if (s?.connected || Date.now() - started > 180000) finish();
                        }, 2000);
                  });
                  onConnected();
            } catch (err) {
                  popup?.close();
                  Swal.fire({ icon: 'error', title: 'Cannot connect', text: err.message, confirmButtonColor: '#0A65B4' });
            } finally {
                  setBusy(false);
            }
      };

      return (
            <div className="mx-auto mt-24 max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">
                  <MailIcon className="mx-auto mb-4 text-blue-400" size={40} />
                  <h1 className="text-xl font-bold">Connect your Gmail</h1>
                  <p className="mt-2 text-sm text-gray-400">Read, send and reply to your Gmail right here. Only you can see your mailbox.</p>
                  <button
                        onClick={connect}
                        disabled={busy}
                        className="mx-auto mt-6 inline-flex items-center gap-3 rounded border border-[#747775] bg-white px-4 py-2.5 text-sm font-medium text-[#1f1f1f] shadow-sm transition hover:bg-gray-100 disabled:opacity-60"
                  >
                        <GoogleG />
                        {busy ? 'Waiting for Google…' : 'Sign in with Google'}
                  </button>
                  {status && !status.configured && (
                        <p className="mt-4 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-300">Not set up yet: the Google client ID and secret still need to be added on the server.</p>
                  )}
            </div>
      );
}

export default function WebMail() {
      const qc = useQueryClient();
      const [params, setParams] = useSearchParams();
      const [folder, setFolder] = useState('inbox');
      const [search, setSearch] = useState('');
      const [q, setQ] = useState('');
      const [selected, setSelected] = useState(null);
      const [compose, setCompose] = useState(null);
      const [view, setView] = useState('unread'); // unread | all (inbox and All mail only)
      const [checked, setChecked] = useState([]);
      const [marking, setMarking] = useState(false);
      const [showSettings, setShowSettings] = useState(false);

      const { data: status, isLoading: statusLoading, error: statusError } = useQuery({ queryKey: ['gmail-status'], queryFn: mail.status });
      const connected = Boolean(status?.connected);

      // Result of the Google redirect.
      useEffect(() => {
            const result = params.get('gmail');
            if (!result) return;
            if (result === 'connected') Swal.fire({ icon: 'success', title: 'Gmail connected', timer: 1600, showConfirmButton: false });
            else Swal.fire({ icon: 'error', title: 'Gmail not connected', text: REASONS[params.get('reason')] || `Something went wrong (${params.get('reason')}). Please try again.`, confirmButtonColor: '#0A65B4' });
            qc.invalidateQueries({ queryKey: ['gmail-status'] });
            setParams({}, { replace: true });
      }, [params, qc, setParams]);

      const filterable = UNREAD_FOLDERS.includes(folder);
      const onlyUnread = filterable && view === 'unread' && !q;

      const list = useInfiniteQuery({
            queryKey: ['gmail-list', folder, q, onlyUnread],
            queryFn: ({ pageParam }) => mail.list({ folder, q, pageToken: pageParam, unread: onlyUnread }),
            initialPageParam: undefined,
            getNextPageParam: (last) => last.nextPageToken || undefined,
            enabled: connected,
            refetchInterval: 60000,
      });
      const { data: unread } = useQuery({ queryKey: ['gmail-unread'], queryFn: mail.unread, enabled: connected, refetchInterval: 60000 });
      const messages = list.data?.pages.flatMap((p) => p.messages) || [];

      const refreshLists = () => {
            qc.invalidateQueries({ queryKey: ['gmail-list'] });
            qc.invalidateQueries({ queryKey: ['gmail-unread'] });
            qc.invalidateQueries({ queryKey: ['gmail-msg'] });
      };

      const disconnect = async () => {
            const { isConfirmed } = await Swal.fire({ icon: 'question', title: `Disconnect ${status?.email}?`, text: 'You can reconnect any time.', showCancelButton: true, confirmButtonText: 'Disconnect' });
            if (!isConfirmed) return;
            await mail.disconnect();
            setSelected(null);
            qc.invalidateQueries({ queryKey: ['gmail-status'] });
      };

      const changeFolder = (id) => { setFolder(id); setSelected(null); setChecked([]); };

      // Reading a message clears its unread state in place, so it does not vanish from the Unread list while open.
      const markReadLocal = (id) => {
            qc.setQueriesData({ queryKey: ['gmail-list'] }, (old) => old && ({
                  ...old,
                  pages: old.pages.map((p) => ({ ...p, messages: p.messages.map((m) => (m.id === id ? { ...m, unread: false } : m)) })),
            }));
            qc.invalidateQueries({ queryKey: ['gmail-unread'] });
      };

      const toggleCheck = (e, id) => {
            e.stopPropagation();
            setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
      };
      const allChecked = messages.length > 0 && checked.length === messages.length;
      const selectable = folder !== 'sent';

      const bulk = async (patch, label) => {
            setMarking(true);
            try {
                  await mail.batch(checked, patch);
                  setChecked([]);
                  if (checked.includes(selected) && (patch.trash || (patch.read === true && onlyUnread))) setSelected(null);
                  refreshLists();
                  Swal.fire({ ...DARK_DIALOG, icon: 'success', title: label, timer: 1100, showConfirmButton: false });
            } catch (err) {
                  Swal.fire({ ...DARK_DIALOG, icon: 'error', title: 'Error', text: err.message });
            } finally {
                  setMarking(false);
            }
      };

      const markAllRead = async () => {
            const name = FOLDERS.find((f) => f.id === folder)?.label;
            const { isConfirmed } = await Swal.fire({
                  ...DARK_DIALOG, icon: 'question', title: 'Mark all as read?',
                  text: `Every unread message in ${name} will be marked as read, not only the ones on screen.`,
                  showCancelButton: true, confirmButtonText: 'Mark all as read', confirmButtonColor: '#2563eb',
            });
            if (!isConfirmed) return;
            setMarking(true);
            try {
                  const r = await mail.markAllRead(folder);
                  setChecked([]);
                  refreshLists();
                  Swal.fire({ ...DARK_DIALOG, icon: 'success', title: `${r.count} marked as read`, text: r.more ? 'There are more. Run it again to continue.' : undefined, timer: r.more ? undefined : 1400, showConfirmButton: Boolean(r.more) });
            } catch (err) {
                  Swal.fire({ ...DARK_DIALOG, icon: 'error', title: 'Error', text: err.message });
            } finally {
                  setMarking(false);
            }
      };

      const toggleStar = async (e, m) => {
            e.stopPropagation();
            await mail.modify(m.id, { starred: !m.starred }).catch(() => {});
            refreshLists();
      };

      if (statusLoading) return <main className="min-h-screen bg-gray-950 p-8 text-gray-400">Loading…</main>;
      if (statusError) return <main className="min-h-screen bg-gray-950 p-8 text-red-400">{statusError.message}</main>;
      if (!connected) return <main className="min-h-screen bg-gray-950 p-4 text-white"><ConnectScreen status={status} onConnected={() => qc.invalidateQueries({ queryKey: ['gmail-status'] })} /></main>;

      return (
            <main className="flex h-screen overflow-hidden bg-gray-950 text-white">
                  <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-800 bg-gray-900/60 p-4 lg:flex">
                        <button onClick={() => setCompose({})} className="mb-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"><Pencil size={16} /> Compose</button>
                        <nav className="space-y-1">
                              {FOLDERS.map(({ id, label, icon: Icon }) => (
                                    <button key={id} onClick={() => changeFolder(id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${folder === id ? 'bg-blue-600/15 font-medium text-blue-300' : 'text-gray-300 hover:bg-gray-800'}`}>
                                          <span className="flex items-center gap-3"><Icon size={17} /> {label}</span>
                                          {id === 'inbox' && unread?.inbox > 0 && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">{unread.inbox > 999 ? '999+' : unread.inbox}</span>}
                                    </button>
                              ))}
                        </nav>
                        <div className="mt-auto border-t border-gray-800 pt-4 text-xs text-gray-500">
                              <p className="truncate font-medium text-gray-300" title={status?.sendFrom}>{status?.sendFrom}</p>
                              <p className="truncate" title={`Company mail is read through ${status?.email}`}>via {status?.email}</p>
                              <button onClick={() => setShowSettings(true)} className={`mt-2 flex items-center gap-1 ${status?.sendConfigured ? 'text-gray-400 hover:text-white' : 'text-amber-400 hover:text-amber-300'}`}><Settings size={12} /> Sending settings{!status?.sendConfigured && ' · key needed'}</button>
                              <button onClick={disconnect} className="mt-1 inline-flex items-center gap-1 text-gray-400 hover:text-red-400"><Unplug size={12} /> Disconnect</button>
                        </div>
                  </aside>

                  <section className={`${selected ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-gray-800 md:w-96`}>
                        <div className="flex items-center gap-2 border-b border-gray-800 p-3 lg:hidden">
                              <select value={folder} onChange={(e) => changeFolder(e.target.value)} className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-2 text-sm">
                                    {FOLDERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                              </select>
                              <button onClick={() => setShowSettings(true)} title="Sending settings" aria-label="Sending settings" className="ml-auto rounded-lg border border-gray-700 p-2 text-gray-300"><Settings size={16} /></button>
                              <button onClick={() => setCompose({})} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium"><Pencil size={14} /> Compose</button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setQ(search.trim()); setSelected(null); }} className="flex gap-2 border-b border-gray-800 p-3">
                              <div className="relative flex-1">
                                    <Search size={15} className="absolute left-3 top-3 text-gray-500" />
                                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search mail" className="w-full rounded-xl border border-gray-700 bg-gray-900 py-2.5 pl-9 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none" />
                              </div>
                              <button type="button" title="Refresh" onClick={refreshLists} className="rounded-xl border border-gray-700 px-3 text-gray-400 transition hover:bg-gray-800 hover:text-white"><RefreshCw size={15} className={list.isFetching ? 'animate-spin' : ''} /></button>
                        </form>
                        {selectable && (
                              <div className="flex min-h-[3rem] items-center gap-2 border-b border-gray-800 px-3 py-2">
                                    <button
                                          onClick={() => setChecked(allChecked ? [] : messages.map((m) => m.id))}
                                          title={allChecked ? 'Clear selection' : 'Select all loaded messages'}
                                          aria-label="Select all"
                                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${allChecked ? 'border-blue-500 bg-blue-600 text-white' : checked.length ? 'border-blue-500 bg-blue-600/40 text-white' : 'border-gray-600 text-transparent hover:border-gray-400'}`}
                                    >
                                          <Check size={13} strokeWidth={3} />
                                    </button>
                                    {checked.length > 0 ? (
                                          <>
                                                <span className="mr-auto text-sm font-medium text-gray-200">{checked.length} selected</span>
                                                <button disabled={marking} onClick={() => bulk({ read: true }, 'Marked as read')} title="Mark as read" aria-label="Mark as read" className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:opacity-50"><MailOpen size={16} /></button>
                                                <button disabled={marking} onClick={() => bulk({ read: false }, 'Marked as unread')} title="Mark as unread" aria-label="Mark as unread" className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:opacity-50"><MailIcon size={16} /></button>
                                                <button disabled={marking} onClick={() => bulk({ starred: true }, 'Starred')} title="Star" aria-label="Star" className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-amber-300 disabled:opacity-50"><Star size={16} /></button>
                                                <button disabled={marking} onClick={() => bulk({ trash: true }, 'Moved to trash')} title="Delete" aria-label="Delete" className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800 hover:text-red-400 disabled:opacity-50"><Trash2 size={16} /></button>
                                                <button onClick={() => setChecked([])} title="Clear selection" aria-label="Clear selection" className="rounded-lg p-2 text-gray-500 transition hover:text-white"><XIcon size={16} /></button>
                                          </>
                                    ) : (
                                          <>
                                                {filterable ? (
                                                      <div className="flex rounded-lg bg-gray-900 p-0.5 text-sm">
                                                            {[['unread', `Unread${folder === 'inbox' && unread?.inbox > 0 ? ` · ${unread.inbox > 999 ? '999+' : unread.inbox}` : ''}`], ['all', 'All']].map(([id, label]) => (
                                                                  <button key={id} onClick={() => setView(id)} className={`rounded-md px-3 py-1 transition ${view === id ? 'bg-gray-700 font-medium text-white' : 'text-gray-400 hover:text-white'}`}>{label}</button>
                                                            ))}
                                                      </div>
                                                ) : <span className="text-sm font-medium text-gray-300">{FOLDERS.find((f) => f.id === folder)?.label}</span>}
                                                {filterable && (
                                                      <button disabled={marking || !(unread?.inbox > 0)} onClick={markAllRead} className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-300 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent">
                                                            <CheckCheck size={15} /> {marking ? 'Working…' : 'Mark all as read'}
                                                      </button>
                                                )}
                                          </>
                                    )}
                              </div>
                        )}
                        {q && <p className="border-b border-gray-800 px-4 py-2 text-xs text-gray-400">Results for “{q}” <button onClick={() => { setQ(''); setSearch(''); }} className="ml-2 text-blue-400">Clear</button></p>}
                        <div className="min-h-0 flex-1 overflow-y-auto">
                              {list.isLoading && <p className="p-6 text-sm text-gray-400">Loading…</p>}
                              {list.error && <p className="p-6 text-sm text-red-400">{list.error.message}</p>}
                              {!list.isLoading && !list.error && messages.length === 0 && (
                                    onlyUnread ? (
                                          <div className="flex flex-col items-center gap-3 p-12 text-center">
                                                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"><CheckCheck size={26} /></span>
                                                <p className="font-medium text-gray-200">You're all caught up</p>
                                                <p className="text-sm text-gray-500">No unread mail.</p>
                                                <button onClick={() => setView('all')} className="mt-1 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white">View all mail</button>
                                          </div>
                                    ) : <p className="p-10 text-center text-sm text-gray-500">{folder === 'sent' ? 'Mail you send from here will appear in this folder.' : `No messages to @${status?.companyDomain || 'company'} addresses here.`}</p>
                              )}
                              {messages.map((m) => {
                                    const who = parseAddress(folder === 'sent' || folder === 'drafts' ? m.to : m.from);
                                    return (
                                          <div key={m.id} onClick={() => setSelected(m.id)} className={`group relative flex cursor-pointer gap-3 border-b border-gray-800/70 px-4 py-3.5 transition hover:bg-gray-900 ${checked.includes(m.id) ? 'bg-blue-600/15' : selected === m.id ? 'bg-blue-600/10' : ''}`}>
                                                {selected === m.id && <span className="absolute inset-y-0 left-0 w-0.5 bg-blue-500" />}
                                                <div className="relative h-10 w-10 shrink-0">
                                                      <div className={selectable && (checked.includes(m.id) || checked.length) ? 'invisible' : selectable ? 'group-hover:invisible' : ''}><Avatar name={who.name} email={who.email} /></div>
                                                      {selectable && (
                                                            <button
                                                                  onClick={(e) => toggleCheck(e, m.id)}
                                                                  aria-label={checked.includes(m.id) ? 'Deselect message' : 'Select message'}
                                                                  className={`absolute inset-0 flex items-center justify-center rounded-full border-2 transition ${checked.includes(m.id) ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-600 bg-gray-900 text-transparent hover:border-blue-400'} ${checked.length || checked.includes(m.id) ? 'visible' : 'invisible group-hover:visible'}`}
                                                            >
                                                                  <Check size={18} strokeWidth={3} />
                                                            </button>
                                                      )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                      <div className="flex items-baseline justify-between gap-2">
                                                            <span className={`truncate text-sm ${m.unread ? 'font-bold text-white' : 'text-gray-300'}`}>{who.name || '(unknown)'}</span>
                                                            <span className={`shrink-0 text-xs ${m.unread ? 'font-semibold text-blue-300' : 'text-gray-500'}`}>{shortDate(m.timestamp)}</span>
                                                      </div>
                                                      <p className="truncate text-xs text-blue-300/80" title={who.email}>{who.email}</p>
                                                      <p className={`truncate text-sm ${m.unread ? 'font-semibold text-gray-100' : 'text-gray-400'}`}>{m.subject}</p>
                                                      <div className="flex items-center gap-2">
                                                            <p className="min-w-0 flex-1 truncate text-xs text-gray-500">{m.snippet}</p>
                                                            <button onClick={(e) => toggleStar(e, m)} title={m.starred ? 'Remove star' : 'Star'} aria-label="Toggle star" className={`shrink-0 transition ${m.starred ? 'text-amber-400' : 'text-transparent group-hover:text-gray-600 hover:!text-amber-400'}`}><Star size={14} fill={m.starred ? 'currentColor' : 'none'} /></button>
                                                      </div>
                                                </div>
                                                {m.unread && <span className="absolute right-3 top-9 h-2 w-2 rounded-full bg-blue-500" />}
                                          </div>
                                    );
                              })}
                              {list.hasNextPage && (
                                    <button onClick={() => list.fetchNextPage()} disabled={list.isFetchingNextPage} className="w-full py-4 text-sm text-blue-400 transition hover:bg-gray-900">{list.isFetchingNextPage ? 'Loading…' : 'Load more'}</button>
                              )}
                        </div>
                  </section>

                  <section className={`${selected ? 'block' : 'hidden md:block'} min-w-0 flex-1`}>
                        {selected ? (
                              <MessageView
                                    key={selected}
                                    id={selected}
                                    ownEmail={[status?.sendFrom, status?.email]}
                                    onBack={() => setSelected(null)}
                                    onForward={(draft) => setCompose(draft)}
                                    onExpandReply={(draft) => setCompose(draft)}
                                    onChanged={refreshLists}
                                    onRead={markReadLocal}
                                    onGone={() => setSelected(null)}
                              />
                        ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-600">
                                    <MailIcon size={44} />
                                    <p className="text-sm">Select a message to read</p>
                              </div>
                        )}
                  </section>

                  {compose && <ComposeModal initial={compose} fromEmail={status?.sendFrom} sendConfigured={status?.sendConfigured} onOpenSettings={() => setShowSettings(true)} onClose={() => setCompose(null)} onSent={() => { setCompose(null); refreshLists(); Swal.fire({ icon: 'success', title: 'Sent', timer: 1200, showConfirmButton: false }); }} />}

                  {showSettings && <SendSettingsModal onClose={() => setShowSettings(false)} onChanged={() => qc.invalidateQueries({ queryKey: ['gmail-status'] })} />}
            </main>
      );
}
