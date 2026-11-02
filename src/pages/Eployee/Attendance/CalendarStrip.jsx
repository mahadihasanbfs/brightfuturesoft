import { fmtDay } from './format';
import { card } from '../Invoice/ui';

const DOT = {
      present: 'bg-emerald-500/80 text-white',
      late: 'bg-amber-500/80 text-white',
      leave: 'bg-sky-500/80 text-white',
      absent: 'bg-red-500/80 text-white',
      not_in: 'bg-red-500/40 text-red-100',
      weekend: 'bg-white/5 text-gray-600',
      upcoming: 'bg-white/[0.03] text-gray-600',
};

export default function CalendarStrip({ days }) {
      return (
            <div className={`${card} p-5`}>
                  <div className="flex flex-wrap gap-1.5">
                        {days.map((d) => (
                              <div
                                    key={d.date}
                                    title={`${fmtDay(d.date)} · ${d.status === 'not_in' ? 'not in yet' : d.status}`}
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${DOT[d.status] || DOT.upcoming}`}
                              >
                                    {Number(d.date.slice(8))}
                              </div>
                        ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        {[['present', 'Present'], ['late', 'Late'], ['leave', 'Leave'], ['absent', 'Absent'], ['weekend', 'Weekend']].map(([k, label]) => (
                              <span key={k} className="inline-flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded ${DOT[k].split(' ')[0]}`} />{label}</span>
                        ))}
                  </div>
            </div>
      );
}

