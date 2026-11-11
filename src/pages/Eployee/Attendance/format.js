// The server works in Bangladesh time (UTC+6); show times the same way no matter where the browser is.
const TZ = 'Asia/Dhaka';

export const localDate = (d = new Date()) => new Date(d).toLocaleDateString('en-CA', { timeZone: TZ });
export const localMonth = (d = new Date()) => localDate(d).slice(0, 7);

export const fmtTime = (iso) =>
      iso ? new Date(iso).toLocaleTimeString('en-US', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }) : '-';

// HH:MM for <input type="time">
export const toHHMM = (iso) =>
      iso ? new Date(iso).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }) : '';

export const fmtHours = (min) => (min ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m` : '-');

export const fmtDay = (date) =>
      new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { timeZone: 'UTC', weekday: 'short', day: '2-digit', month: 'short' });

export const LEAVE_TYPES = ['casual', 'sick', 'annual', 'unpaid'];
