import { localMonth } from './format';

// Attendance rate ignores approved leave; punctuality is on-time days out of days attended.
export const metrics = (s) => {
      const attended = s.present + s.late;
      const expected = Math.max(s.workingDays - s.leave, 0);
      const attendance = expected ? Math.min(100, Math.round((attended / expected) * 100)) : null;
      const punctuality = attended ? Math.round((s.present / attended) * 100) : null;
      const avgHours = attended ? Math.round((s.workedMinutes / 60 / attended) * 10) / 10 : 0;
      const score = attendance === null ? null : Math.round(attendance * 0.6 + (punctuality ?? 0) * 0.4);
      return { attended, attendance, punctuality, avgHours, score };
};

export const grade = (score) =>
      score === null ? ['No data', 'text-gray-400'] : score >= 90 ? ['Excellent', 'text-emerald-400'] : score >= 75 ? ['Good', 'text-sky-400'] : score >= 50 ? ['Needs improvement', 'text-amber-400'] : ['Critical', 'text-red-400'];

export const lastMonths = (n) => {
      const [y, m] = localMonth().split('-').map(Number);
      return Array.from({ length: n }, (_, i) => new Date(Date.UTC(y, m - 1 - (n - 1 - i), 1)).toISOString().slice(0, 7));
};

export const monthLabel = (month) => new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', month: 'short' });

export const leaveDays = (from, to) => {
      let n = 0;
      for (let t = Date.parse(from); t <= Date.parse(to); t += 86400000) if (![5, 6].includes(new Date(t).getUTCDay())) n += 1;
      return n;
};
