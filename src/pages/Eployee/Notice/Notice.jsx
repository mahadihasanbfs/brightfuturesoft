import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../context/UseContext/AuthProvider';
import JoditEditor from 'jodit-react';
import Swal from 'sweetalert2';
import { base_url } from '../../../layout/Title';
import useDashTheme from '../../../layout/useDashTheme';
import FitSheet, { NoticeSheet } from './NoticePad';
import { noticeRef } from './noticeRef';

const Notice = () => {
      const navigate = useNavigate();
      const { user } = useContext(AuthContext);
      const ceo = user?.designation === 'Chief Executive Officer';
      const [signature, setSignature] = useState('');
      useEffect(() => {
            if (!ceo) return;
            fetch(`${base_url}/notice/signature`).then(r => r.json()).then(r => setSignature(r?.data?.signature || '')).catch(() => {});
      }, [ceo]);
      const { theme } = useDashTheme();
      const [subject, setSubject] = useState('');
      const [body, setBody] = useState('');
      const [loading, setLoading] = useState(false);
      const [draftDate] = useState(() => Date.now());
      const [showPreview, setShowPreview] = useState(false); // phones: switch between writing and preview

      const config = useMemo(() => ({
            readonly: false,
            theme: theme === 'light' ? 'default' : 'dark',
            height: 320,
            toolbarSticky: false,
            toolbarAdaptive: false,
            toolbarButtonSize: 'small',
            buttons: ['bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', '|', 'paragraph', 'brush', '|', 'undo', 'redo'],
            uploader: { insertImageAsBase64URI: true },
            removeButtons: ['source', 'video', 'fullsize', 'about'],
            placeholder: 'Write the notice here...',
      }), [theme]);

      const submit = async (e) => {
            e.preventDefault();
            if (!subject.trim() || !body.replace(/<[^>]*>/g, '').trim()) {
                  Swal.fire('Add a headline and the notice text first', '', 'info');
                  return;
            }
            setLoading(true);
            try {
                  const res = await fetch(`${base_url}/notice/add-notice`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json', author: 'bright_future_soft' },
                        body: JSON.stringify({ subject: subject.trim(), body, notice_date: Date.now() }),
                  });
                  const data = await res.json();
                  if (data.success) {
                        Swal.fire(data.message, ceo ? ' ' : 'Employees will see it after the CEO approves it.', 'success');
                        navigate('/dashboard/notice');
                  } else {
                        Swal.fire(data.message, '', 'info');
                  }
            } catch {
                  Swal.fire('Could not publish the notice. Try again.', '', 'error');
            } finally {
                  setLoading(false);
            }
      };

      const field = 'w-full rounded-lg border border-gray-700 bg-gray-900 px-3.5 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none';

      return (
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                              <Link to="/dashboard/notice" className="text-sm font-medium text-gray-400 hover:text-blue-400">← All notices</Link>
                              <h1 className="mt-1 text-2xl font-bold text-white">New notice</h1>
                              <p className="text-sm text-gray-400">It is shown on the company pad exactly as you see it in the preview.</p>
                        </div>
                        <div className="flex rounded-lg border border-gray-700 bg-gray-800 p-1 lg:hidden" role="group" aria-label="Write or preview">
                              {[[false, 'Write'], [true, 'Preview']].map(([v, name]) => (
                                    <button key={name} type="button" aria-pressed={showPreview === v} onClick={() => setShowPreview(v)} className={`rounded-md px-4 py-1.5 text-sm font-medium ${showPreview === v ? 'bg-[#1c65b4] text-white' : 'text-gray-300'}`}>{name}</button>
                              ))}
                        </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
                        <form onSubmit={submit} className={`space-y-5 rounded-2xl border border-gray-700 bg-gray-800 p-5 sm:p-6 ${showPreview ? 'hidden lg:block' : ''}`}>
                              <div>
                                    <label htmlFor="notice-subject" className="mb-2 block text-sm font-semibold text-gray-200">Headline</label>
                                    <input id="notice-subject" required maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Office closed for Eid holidays" className={field} />
                              </div>
                              <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-200">Notice text</label>
                                    <div className="overflow-hidden rounded-lg border border-gray-700">
                                          <JoditEditor value="" config={config} onChange={setBody} />
                                    </div>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                    <p className="text-xs text-gray-400">Reference <span className="font-semibold text-gray-200">{noticeRef({ notice_date: draftDate })}</span> is set when you publish.{!ceo && <> It needs the <strong className="text-gray-200">CEO's approval</strong> before employees can see it.</>}</p>
                                    <button type="submit" disabled={loading} className="rounded-lg bg-[#1c65b4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50">{loading ? 'Sending…' : ceo ? 'Publish notice' : 'Send for CEO approval'}</button>
                              </div>
                        </form>

                        <aside className={`${showPreview ? '' : 'hidden'} lg:block`}>
                              <div className="lg:sticky lg:top-4">
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-400">Preview on company pad</p>
                                    <div className="rounded-2xl border border-gray-700 bg-gray-800 p-3 sm:p-4">
                                          <FitSheet>
                                                <NoticeSheet draft subject={subject} body={body} date={draftDate} reference={noticeRef({ notice_date: draftDate })} approval={ceo ? { name: user.name, date: draftDate, signature: signature } : null} />
                                          </FitSheet>
                                    </div>
                              </div>
                        </aside>
                  </div>
            </div>
      );
};

export default Notice;
