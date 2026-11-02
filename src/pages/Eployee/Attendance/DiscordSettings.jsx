import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Send, TriangleAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url } from '../../../layout/Title';
import { Empty, Field, btnGhost, btnPrimary, card, input, toastError } from '../Invoice/ui';

const api = async (path, { method = 'GET', body } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/discord${path}`, {
            method,
            headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Request failed');
      return json.data;
};

const Toggle = ({ checked, onChange, label, hint }) => (
      <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            <span><span className="block text-sm font-medium text-gray-100">{label}</span>{hint && <span className="block text-xs text-gray-500">{hint}</span>}</span>
      </label>
);

// Connect a Discord channel: daily attendance/leave/sales report, plus instant leave notices.
export default function DiscordSettings() {
      const qc = useQueryClient();
      const { data: s, isPending, error } = useQuery({ queryKey: ['discord-settings'], queryFn: () => api('/settings') });
      const [webhook, setWebhook] = useState('');
      const refresh = (data) => qc.setQueryData(['discord-settings'], data);
      const save = useMutation({ mutationFn: (body) => api('/settings', { method: 'PUT', body }), onSuccess: (d) => { refresh(d); setWebhook(''); }, onError: toastError });
      const test = useMutation({ mutationFn: () => api('/test', { method: 'POST' }), onSuccess: () => Swal.fire({ icon: 'success', title: 'Test message sent', text: 'Check your Discord channel.', confirmButtonColor: '#0A65B4' }), onError: toastError });
      const sendNow = useMutation({
            mutationFn: () => api('/send-now', { method: 'POST' }),
            onSuccess: () => { qc.invalidateQueries({ queryKey: ['discord-settings'] }); Swal.fire({ icon: 'success', title: "Today's report sent", confirmButtonColor: '#0A65B4' }); },
            onError: toastError,
      });

      if (error) return <Empty>{error.message}</Empty>;
      if (isPending) return <Empty>Loading…</Empty>;
      const patch = (body) => save.mutate(body);

      return (
            <section className="grid gap-6 xl:grid-cols-2">
                  <div className={`${card} space-y-5 p-6`}>
                        <div>
                              <h3 className="font-semibold">Discord channel</h3>
                              <p className="mt-1 text-sm text-gray-400">In Discord: channel settings → Integrations → Webhooks → New Webhook → Copy Webhook URL. Paste it here.</p>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); if (webhook.trim()) patch({ webhookUrl: webhook }); }} className="space-y-3">
                              <Field label="Webhook URL">
                                    <input className={input} type="password" autoComplete="off" placeholder={s.hasWebhook ? `Connected: ${s.webhookMasked}` : 'https://discord.com/api/webhooks/…'} value={webhook} onChange={(e) => setWebhook(e.target.value)} />
                              </Field>
                              <div className="flex flex-wrap gap-2">
                                    <button className={btnPrimary} disabled={!webhook.trim() || save.isPending}>{s.hasWebhook ? 'Replace webhook' : 'Connect'}</button>
                                    {s.hasWebhook && <button type="button" className={btnGhost} disabled={test.isPending} onClick={() => test.mutate()}><Send size={14} /> {test.isPending ? 'Sending…' : 'Send test message'}</button>}
                                    {s.hasWebhook && <button type="button" className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/15" onClick={() => patch({ clearWebhook: true })}>Disconnect</button>}
                              </div>
                        </form>
                        <p className="text-xs text-gray-500">The webhook link lets anyone who has it post to your channel. It is stored on the server and never shown again after you save it.</p>
                  </div>

                  <div className={`${card} space-y-5 p-6 ${s.hasWebhook ? '' : 'opacity-50'}`}>
                        <h3 className="font-semibold">Daily report</h3>
                        <fieldset disabled={!s.hasWebhook || save.isPending} className="space-y-4">
                              <Toggle checked={s.enabled} onChange={(v) => patch({ enabled: v })} label="Send a report to Discord every working day" hint="Skips Friday and Saturday." />
                              <Field label="Send at (Bangladesh time)">
                                    <input type="time" className={`${input} !w-auto`} value={s.time} onChange={(e) => patch({ time: e.target.value })} />
                              </Field>
                              <div className="space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Include</p>
                                    <Toggle checked={s.sections.attendance} onChange={(v) => patch({ sections: { ...s.sections, attendance: v } })} label="Attendance" hint="Present, late, on leave and no check-in, with names." />
                                    <Toggle checked={s.sections.leave} onChange={(v) => patch({ sections: { ...s.sections, leave: v } })} label="Leave" hint="Waiting for approval, and decided today." />
                                    <Toggle checked={s.sections.sales} onChange={(v) => patch({ sections: { ...s.sections, sales: v } })} label="Software sales" hint="Visits, deals won and follow-ups due." />
                              </div>
                              <Toggle checked={s.checkoutReports} onChange={(v) => patch({ checkoutReports: v })} label="Post each daily report when someone checks out" hint="Name, in and out times, hours worked and the report they wrote, sent the moment they check out." />
                              <Toggle checked={s.leaveEvents} onChange={(v) => patch({ leaveEvents: v })} label="Instant leave notices" hint="Post right away when someone requests leave and when it is approved or rejected." />
                        </fieldset>
                        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                              <button className={btnGhost} disabled={!s.hasWebhook || sendNow.isPending} onClick={() => sendNow.mutate()}>{sendNow.isPending ? 'Sending…' : "Send today's report now"}</button>
                              {s.lastSentDate && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300"><CheckCircle2 size={13} /> Last report: {s.lastSentDate}</span>}
                        </div>
                        {s.lastError && <p className="flex items-start gap-2 text-xs text-amber-300"><TriangleAlert size={13} className="mt-0.5 shrink-0" /> Last problem: {s.lastError}</p>}
                  </div>
            </section>
      );
}
