export const BASE_CURRENCY = 'BDT';

export const CURRENCIES = {
      BDT: '৳', USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$',
      AED: 'AED', SAR: 'SAR', SGD: 'S$', MYR: 'RM', INR: '₹', JPY: '¥',
};

export const money = (n, currency = BASE_CURRENCY) =>
      `${CURRENCIES[currency] || currency} ${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const fmtDate = (d) =>
      d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const thisMonth = () => todayISO().slice(0, 7);

export const monthLabel = (m) =>
      m ? new Date(`${m}-01`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '-';

export const addDays = (iso, days) => {
      const d = new Date(iso);
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
};
