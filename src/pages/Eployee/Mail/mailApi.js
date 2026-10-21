import { base_url } from '../../../layout/Title';

const request = async (path, { method = 'GET', body, raw = false } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/mail/gmail${path}`, {
            method,
            headers: {
                  'content-type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (raw) {
            if (!res.ok) throw new Error('Download failed');
            return res.blob();
      }
      const json = await res.json().catch(() => ({}));
      if (res.status === 401 && !path.startsWith('/messages')) {
            throw new Error('Session expired. Please sign out and sign in again.');
      }
      if (!res.ok || json.success === false) {
            const err = new Error(json.message || 'Request failed');
            err.status = res.status;
            throw err;
      }
      return json.data;
};

export const mail = {
      status: () => request('/status'),
      authUrl: (popup = false) => request(`/auth-url${popup ? '?popup=1' : ''}`),
      disconnect: () => request('/disconnect', { method: 'DELETE' }),
      unread: () => request('/unread'),
      settings: () => request('/settings'),
      saveSettings: (resendKey) => request('/settings', { method: 'PUT', body: { resendKey } }),
      removeSettings: () => request('/settings', { method: 'DELETE' }),
      list: ({ folder, q, pageToken, unread }) => {
            const p = new URLSearchParams({ folder });
            if (unread) p.set('unread', '1');
            if (q) p.set('q', q);
            if (pageToken) p.set('pageToken', pageToken);
            return request(`/messages?${p}`);
      },
      batch: (ids, patch) => request('/batch', { method: 'POST', body: { ids, ...patch } }),
      markAllRead: (folder) => request('/mark-all-read', { method: 'POST', body: { folder } }),
      get: (id) => request(`/messages/${id}`),
      send: (body) => request('/messages', { method: 'POST', body }),
      modify: (id, body) => request(`/messages/${id}`, { method: 'PUT', body }),
      trash: (id) => request(`/messages/${id}`, { method: 'DELETE' }),
      attachment: (id, att) => request(`/messages/${id}/attachments/${att.id}?name=${encodeURIComponent(att.filename)}`, { raw: true }),
};

// "Name <a@b.com>" -> { name, email }
export const parseAddress = (value = '') => {
      const m = value.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
      return m ? { name: m[1].trim() || m[2], email: m[2] } : { name: value.trim(), email: value.trim() };
};

// Every email address in a header like `A <a@x.com>, b@y.com`.
export const extractEmails = (value = '') =>
      [...value.matchAll(/<([^>]+)>|([^\s,;<>"]+@[^\s,;<>"]+)/g)].map((m) => (m[1] || m[2]).trim());

export const initials = (name = '') =>
      name.replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

const AVATAR_COLORS = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600', 'bg-cyan-600', 'bg-fuchsia-600', 'bg-teal-600'];
export const avatarColor = (seed = '') => AVATAR_COLORS[[...seed].reduce((t, c) => t + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

export const fullDate = (value) => {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? value : d.toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// The original message as a "> " quote under the reply.
export const quoteText = (msg) =>
      `\n\nOn ${fullDate(msg.date)}, ${msg.from} wrote:\n${(msg.text || msg.snippet || '').split('\n').map((l) => `> ${l}`).join('\n')}`;

// Reply to the sender (or, for a message I sent, to its recipients). `all` also keeps everyone else on the thread in Cc.
export const buildReply = (msg, ownEmail, all = false) => {
      const mine = [].concat(ownEmail || []).filter(Boolean).map((e) => e.toLowerCase());
      const sender = parseAddress(msg.replyTo || msg.from).email;
      const sentByMe = mine.includes(sender.toLowerCase());
      const primary = sentByMe ? extractEmails(msg.to) : [sender];
      const others = all
            ? [...extractEmails(msg.to), ...extractEmails(msg.cc)].filter((e) => !mine.includes(e.toLowerCase()) && !primary.map((p) => p.toLowerCase()).includes(e.toLowerCase()))
            : [];
      return {
            to: primary.join(', '),
            cc: [...new Set(others)].join(', '),
            subject: /^re:/i.test(msg.subject) ? msg.subject : `Re: ${msg.subject}`,
            threadId: msg.threadId,
            inReplyTo: msg.messageId,
            references: `${msg.references || ''} ${msg.messageId || ''}`.trim(),
        };
};

export const buildForward = (msg) => ({
      subject: /^fwd:/i.test(msg.subject) ? msg.subject : `Fwd: ${msg.subject}`,
      text: `\n\n---------- Forwarded message ----------\nFrom: ${msg.from}\nDate: ${fullDate(msg.date)}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.text || msg.snippet || ''}`,
});
