import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, TriangleAlert } from 'lucide-react';
import { Empty, input, card } from '../Invoice/ui';
import { api } from './api';
import { fmtWhen, mapUrl } from './constants';

const RANGES = [[1, 'Today'], [7, '7 days'], [30, '30 days']];

export default function Visits({ admin, onOpen }) {
      const [days, setDays] = useState(7);
      const [q, setQ] = useState('');
      const { data: visits = [], isPending, error } = useQuery({
            queryKey: ['sales-visits', days],
            queryFn: () => api(`/visits?from=${new Date(Date.now() - (days - 1) * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })}`),
      });
      const shown = visits.filter((v) => !q.trim() || `${v.company} ${v.userName} ${v.purpose}`.toLowerCase().includes(q.trim().toLowerCase()));
      return (
            <section className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                        <input className={`${input} sm:max-w-xs`} placeholder={admin ? 'Search company, person, purpose…' : 'Search company, purpose…'} value={q} onChange={(e) => setQ(e.target.value)} />
                        <div className="flex gap-1.5">
                              {RANGES.map(([d, label]) => <button key={d} onClick={() => setDays(d)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${days === d ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{label}</button>)}
                        </div>
                  </div>
                  {error ? <Empty>{error.message}</Empty> : isPending ? <Empty>Loading…</Empty> : shown.length === 0 ? <Empty>No visits in this period.</Empty> : (
                        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                              {shown.map((v) => (
                                    <article key={v._id} className={`${card} space-y-3 p-4`}>
                                          <div className="flex items-start justify-between gap-3">
                                                <button onClick={() => onOpen(v.leadId)} className="min-w-0 text-left"><p className="truncate font-semibold hover:text-blue-300">{v.company}</p><p className="truncate text-xs text-gray-400">{v.purpose || 'Visit'}{v.outcome ? ` · ${v.outcome}` : ''}</p></button>
                                                <span className="shrink-0 text-xs text-gray-400">{fmtWhen(v.at)}</span>
                                          </div>
                                          {v.notes && <p className="line-clamp-3 text-sm text-gray-300">{v.notes}</p>}
                                          {v.photos?.length > 0 && <div className="flex gap-2">{v.photos.slice(0, 4).map((p) => <a key={p} href={p} target="_blank" rel="noreferrer"><img src={p} alt="Visit" loading="lazy" className="h-16 w-16 rounded-lg object-cover" /></a>)}</div>}
                                          <div className="flex items-center justify-between text-xs">
                                                {admin && <span className="text-gray-400">{v.userName}</span>}
                                                {v.gps ? <a href={mapUrl(v.gps)} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-emerald-300 hover:underline"><MapPin size={12} />{v.gps.lat.toFixed(4)}, {v.gps.lng.toFixed(4)}{v.gps.accuracy ? ` ±${v.gps.accuracy}m` : ''}</a> : <span className="ml-auto inline-flex items-center gap-1 text-amber-300"><TriangleAlert size={12} /> No location</span>}
                                          </div>
                                    </article>
                              ))}
                        </div>
                  )}
            </section>
      );
}
