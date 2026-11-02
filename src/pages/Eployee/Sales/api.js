import { base_url } from '../../../layout/Title';

export const api = async (path, { method = 'GET', body } = {}) => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${base_url}/sales${path}`, {
            method,
            headers: { 'content-type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body === undefined ? undefined : JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Request failed');
      return json.data;
};
