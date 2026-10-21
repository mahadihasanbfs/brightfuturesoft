import { base_url } from '../../../layout/Title';

export const api = async (path, { method = 'GET', body } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/accounts${path}`, {
            method,
            headers: {
                  'content-type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401) {
            throw new Error('Session expired. Please sign out and sign in again.');
      }
      if (!res.ok || json.success === false) {
            throw new Error(json.message || 'Request failed');
      }
      return json.data;
};

export const qs = (params) => {
      const q = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'all')
      ).toString();
      return q ? `?${q}` : '';
};
