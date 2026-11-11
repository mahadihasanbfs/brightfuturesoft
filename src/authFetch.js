import { base_url } from './layout/Title';

// The server now checks the sign-in token on staff routes. Older screens only send a fixed `author` header,
// so attach the token to every request that goes to our own API unless the caller already set one.
export function installAuthFetch() {
      if (window.__authFetchInstalled) return;
      window.__authFetchInstalled = true;
      const original = window.fetch.bind(window);
      window.fetch = (input, init = {}) => {
            try {
                  const url = typeof input === 'string' ? input : input?.url;
                  const token = localStorage.getItem('token');
                  if (token && url && url.startsWith(base_url)) {
                        const headers = new Headers(init.headers || (typeof input === 'object' ? input.headers : undefined));
                        if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
                        return original(input, { ...init, headers });
                  }
            } catch { /* fall through to the plain request */ }
            return original(input, init);
      };
}
