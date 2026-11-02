export const STAGES = [
      { id: 'new', label: 'New', tone: 'text-gray-300', color: '#9ca3af' },
      { id: 'contacted', label: 'Contacted', tone: 'text-sky-400', color: '#0ea5e9' },
      { id: 'meeting', label: 'Meeting', tone: 'text-violet-400', color: '#8b5cf6' },
      { id: 'proposal', label: 'Proposal', tone: 'text-amber-400', color: '#f59e0b' },
      { id: 'negotiation', label: 'Negotiation', tone: 'text-orange-400', color: '#f97316' },
      { id: 'won', label: 'Won', tone: 'text-emerald-400', color: '#10b981' },
      { id: 'lost', label: 'Lost', tone: 'text-red-400', color: '#ef4444' },
];
export const stageOf = (id) => STAGES.find((s) => s.id === id) || STAGES[0];

export const SOURCES = ['walk-in', 'referral', 'website', 'phone', 'event', 'social', 'other'];
export const OUTCOMES = ['Interested', 'Needs follow-up', 'Demo scheduled', 'Proposal requested', 'Not interested', 'Deal closed'];

export const bdt = (n) => `৳${Math.round(n || 0).toLocaleString('en-IN')}`;
export const fmtWhen = (iso) =>
      iso ? new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
export const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
export const mapUrl = (g) => `https://www.google.com/maps?q=${g.lat},${g.lng}`;
