import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { X, Eye, EyeOff, CheckCircle2, ExternalLink } from 'lucide-react';
import { mail } from './mailApi';
import { confirmDialog } from '../../../Hook/confirmDialog';

const Row = ({ label, value }) => (
      <div className="flex items-center justify-between border-b border-gray-800 py-2 text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-mono text-gray-200">{value}</span>
      </div>
);

export default function SendSettingsModal({ onClose, onChanged }) {
      const { data, refetch, isLoading, error } = useQuery({ queryKey: ['gmail-settings'], queryFn: mail.settings });
      const [key, setKey] = useState('');
      const [show, setShow] = useState(false);
      const [saving, setSaving] = useState(false);
      const [message, setMessage] = useState({ type: '', text: '' });

      const save = async (e) => {
            e.preventDefault();
            setSaving(true);
            setMessage({ type: '', text: '' });
            try {
                  await mail.saveSettings(key.trim());
                  setKey('');
                  setMessage({ type: 'ok', text: 'API key verified and saved. You can send mail now.' });
                  await refetch();
                  onChanged();
            } catch (err) {
                  setMessage({ type: 'error', text: err.message });
            } finally {
                  setSaving(false);
            }
      };

      const remove = async () => {
            const isConfirmed = await confirmDialog({ title: 'Remove your API key?', message: 'You will not be able to send mail until you add one again.', confirmText: 'Remove', tone: 'danger' });
            if (!isConfirmed) return;
            await mail.removeSettings();
            await refetch();
            onChanged();
      };

      return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
                  <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 text-white">
                        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                              <h2 className="text-lg font-semibold">Sending settings</h2>
                              <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-5 p-6">
                              {isLoading && <p className="text-sm text-gray-400">Loading…</p>}
                              {error && <p className="text-sm text-red-400">{error.message}</p>}
                              {data && (
                                    <>
                                          <p className="text-sm text-gray-400">
                                                Mail is sent through Resend SMTP. The server details are the same for everyone; you only add your own API key.
                                          </p>
                                          <div>
                                                <Row label="Host" value={data.smtp.host} />
                                                <Row label="Port" value={data.smtp.port} />
                                                <Row label="User" value={data.smtp.user} />
                                                <Row label="Sends as" value={data.sendFrom} />
                                          </div>

                                          {data.hasKey && (
                                                <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                                                      <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> API key saved <span className="font-mono text-emerald-200">{data.keyHint}</span></span>
                                                      <button onClick={remove} className="text-xs text-red-300 hover:text-red-200">Remove</button>
                                                </div>
                                          )}

                                          <form onSubmit={save} className="space-y-3">
                                                <label className="block">
                                                      <span className="mb-1 block text-xs font-medium text-gray-400">Password (Resend API key)</span>
                                                      <div className="relative">
                                                            <input
                                                                  required
                                                                  type={show ? 'text' : 'password'}
                                                                  autoComplete="off"
                                                                  value={key}
                                                                  onChange={(e) => setKey(e.target.value)}
                                                                  placeholder={data.hasKey ? 'Enter a new key to replace it' : 're_xxxxxxxxxxxxxxxx'}
                                                                  className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-3 pr-10 font-mono text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                                                            />
                                                            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide key' : 'Show key'} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                                      </div>
                                                </label>
                                                {message.text && <p className={`rounded-lg px-3 py-2 text-sm ${message.type === 'ok' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>{message.text}</p>}
                                                <div className="flex items-center justify-between">
                                                      <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">Get a key at resend.com <ExternalLink size={12} /></a>
                                                      <button disabled={saving || !key.trim()} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50">{saving ? 'Verifying…' : 'Verify & save'}</button>
                                                </div>
                                          </form>
                                          <p className="text-xs text-gray-500">Your key is stored encrypted and is never shown again. The domain of <b>{data.sendFrom}</b> must be verified in your Resend account.</p>
                                    </>
                              )}
                        </div>
                  </div>
            </div>
      );
}
