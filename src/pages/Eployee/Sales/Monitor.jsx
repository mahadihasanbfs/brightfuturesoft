import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CalendarX, Clock, MapPin, MapPinOff, PhoneOff, Snowflake, Users } from 'lucide-react';
import { Empty, Row, Stat, Table, Td, card } from '../Invoice/ui';
import { api } from './api';
import { bdt, fmtWhen, mapUrl, stageOf } from './constants';
import MapView from './MapView';

const REASONS = {
      overdue: { label: 'Overdue follow-up', tone: 'bg-red-500/15 text-red-300' },
      stale: { label: 'Gone cold (7d+)', tone: 'bg-sky-500/15 text-sky-300' },
      untouched: { label: 'Not contacted', tone: 'bg-amber-500/15 text-amber-300' },
      stuck: { label: 'Stuck in deal', tone: 'bg-orange-500/15 text-orange-300' },
      no_followup: { label: 'No follow-up set', tone: 'bg-gray-500/20 text-gray-300' },
};

const sinceLabel = (iso) => {
      const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
      return m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};

export default function Monitor({ admin, onOpen }) {
      const [reason, setReason] = useState('all');
      const { data, isPending, error } = useQuery({ queryKey: ['sales-monitor'], queryFn: () => api('/monitor'), refetchInterval: 60000 });
      const rows = useMemo(() => (data?.attention || []).filter((r) => reason === 'all' || r.reasons.includes(reason)), [data, reason]);
      const points = useMemo(() => (data?.points || []).map((p) => ({ lat: p.lat, lng: p.lng, label: `<b>${p.company.replace(/</g, '&lt;')}</b><br>${p.userName.replace(/</g, '&lt;')} · ${fmtWhen(p.at)}`, href: mapUrl(p) })), [data]);

      if (error) return <Empty>{error.message}</Empty>;
      if (isPending) return <Empty>Loading…</Empty>;
      const c = data.counts;

      return (
            <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
                        <Stat icon={CalendarX} label="Overdue follow-ups" value={c.overdue} tone={c.overdue ? 'text-red-400' : 'text-white'} />
                        <Stat icon={Snowflake} label="Gone cold" value={c.stale} tone={c.stale ? 'text-sky-400' : 'text-white'} hint="No activity for 7+ days" />
                        <Stat icon={PhoneOff} label="Not contacted" value={c.untouched} tone={c.untouched ? 'text-amber-400' : 'text-white'} hint="New for 2+ days, no visit" />
                        <Stat icon={AlertTriangle} label="Stuck deals" value={c.stuck} tone={c.stuck ? 'text-orange-400' : 'text-white'} hint="Proposal or negotiation, idle 5+ days" />
                        <Stat icon={MapPinOff} label="Visits without location" value={data.noGpsMonth} tone={data.noGpsMonth ? 'text-amber-400' : 'text-white'} hint={`of ${data.visitsMonth} this month`} />
                  </div>

                  <section className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                              <h3 className="font-semibold">Needs attention <span className="text-gray-500">({data.attentionTotal} of {data.openLeads} open leads)</span></h3>
                              <div className="flex flex-wrap gap-1.5">
                                    <button onClick={() => setReason('all')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${reason === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>All</button>
                                    {Object.entries(REASONS).map(([k, r]) => (
                                          <button key={k} onClick={() => setReason(k)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${reason === k ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{r.label} · {c[k]}</button>
                                    ))}
                              </div>
                        </div>
                        {rows.length === 0 ? <Empty>{data.attentionTotal ? 'No leads match this filter.' : 'Every open lead is on track.'}</Empty> : (
                              <Table head={['Lead', 'Stage', 'Value', 'Idle', 'Follow-up', 'Why', ...(admin ? ['Owner'] : [])]}>
                                    {rows.map((l) => (
                                          <Row key={l._id} onClick={() => onOpen(l._id)}>
                                                <Td><p className="font-medium">{l.company}</p><p className="text-xs text-gray-500">{l.contactName}{l.phone ? ` · ${l.phone}` : ''}</p></Td>
                                                <Td><span className={`font-semibold ${stageOf(l.stage).tone}`}>{stageOf(l.stage).label}</span></Td>
                                                <Td className="tabular-nums">{bdt(l.value)}</Td>
                                                <Td className={l.idleDays >= 7 ? 'font-semibold text-sky-300' : ''}>{l.idleDays}d</Td>
                                                <Td className={l.reasons.includes('overdue') ? 'font-semibold text-red-300' : ''}>{l.nextFollowUp || '-'}</Td>
                                                <Td><div className="flex flex-wrap gap-1">{l.reasons.map((r) => <span key={r} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${REASONS[r].tone}`}>{REASONS[r].label}</span>)}</div></Td>
                                                {admin && <Td>{l.ownerName}</Td>}
                                          </Row>
                                    ))}
                              </Table>
                        )}
                  </section>

                  <div className="grid gap-6 xl:grid-cols-3">
                        <section className="space-y-3 xl:col-span-2">
                              <h3 className="font-semibold">Where visits happened <span className="text-gray-500">(last 7 days)</span></h3>
                              {points.length === 0 ? <Empty>No visits with a location in the last 7 days.</Empty> : <MapView points={points} height={380} zoom={15} />}
                        </section>

                        <section className="space-y-3">
                              <h3 className="flex items-center gap-2 font-semibold"><Users size={16} /> {admin ? 'Field team' : 'Your recent visits'}</h3>
                              {data.field.length === 0 ? <Empty>No visits in the last 7 days.</Empty> : (
                                    <ul className="space-y-3">
                                          {data.field.map((u) => (
                                                <li key={u.userId} className={`${card} space-y-1.5 p-4`}>
                                                      <div className="flex items-center justify-between gap-2">
                                                            <p className="truncate font-semibold">{u.name}</p>
                                                            <span className="shrink-0 text-xs text-gray-400">{u.visitsToday} today · {u.visitsWeek} this week</span>
                                                      </div>
                                                      <p className="flex items-center gap-1.5 text-sm text-gray-300"><Clock size={13} className="shrink-0 text-gray-500" />Last: <b className="truncate">{u.lastVisit.company}</b> · {sinceLabel(u.lastVisit.at)}</p>
                                                      {u.lastVisit.gps
                                                            ? <a href={mapUrl(u.lastVisit.gps)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:underline"><MapPin size={12} />{u.lastVisit.gps.lat.toFixed(4)}, {u.lastVisit.gps.lng.toFixed(4)}{u.lastVisit.gps.accuracy ? ` ±${u.lastVisit.gps.accuracy}m` : ''}</a>
                                                            : <span className="inline-flex items-center gap-1.5 text-xs text-amber-300"><MapPinOff size={12} /> No location</span>}
                                                </li>
                                          ))}
                                    </ul>
                              )}
                        </section>
                  </div>
            </div>
      );
}
