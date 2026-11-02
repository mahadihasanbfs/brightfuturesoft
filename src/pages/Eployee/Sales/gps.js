import { useCallback, useEffect, useRef, useState } from 'react';

const FINE = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
const COARSE = { enableHighAccuracy: false, timeout: 15000, maximumAge: 120000 };

const explain = (e) => {
      if (typeof window !== 'undefined' && !window.isSecureContext) return 'Location only works on HTTPS (or localhost). Open the site over https.';
      if (e.code === 1) return 'Location is blocked for this site. Click the lock icon next to the address, set Location to Allow, then press Refresh.';
      if (e.code === 2) return 'This device could not work out its location. Turn on Location Services (on Mac: System Settings → Privacy & Security → Location Services → your browser) and Wi-Fi, then press Refresh.';
      return 'Location is taking too long. Press Refresh, or move near a window.';
};

// Live device location. A quick approximate fix (Wi-Fi/network) shows straight away, then GPS keeps refining it.
// If GPS never answers (typical on laptops) the approximate fix is kept instead of failing.
// State is only set from position callbacks.
export function useLiveGps() {
      const supported = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
      const [state, setState] = useState(supported
            ? { status: 'locating', gps: null, error: '', updatedAt: null, approximate: false }
            : { status: 'error', gps: null, error: 'This device cannot share its location.', updatedAt: null, approximate: false });
      const watchId = useRef(null);
      const stop = useCallback(() => {
            if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
            watchId.current = null;
      }, []);

      const start = useCallback(() => {
            if (!navigator.geolocation) return;
            stop();
            const fix = (p, approximate) => setState({ status: 'ok', gps: { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }, error: '', updatedAt: Date.now(), approximate });
            const fail = (e) => setState((s) => (s.gps ? { ...s, status: 'ok', error: '' } : { ...s, status: 'error', error: explain(e) }));

            // 1. Quick approximate fix so the form is usable at once.
            navigator.geolocation.getCurrentPosition((p) => fix(p, true), fail, COARSE);

            // 2. Precise GPS; if it fails, fall back to watching the approximate position.
            watchId.current = navigator.geolocation.watchPosition(
                  (p) => fix(p, false),
                  (e) => {
                        if (e.code === 1) { fail(e); return; }
                        stop();
                        watchId.current = navigator.geolocation.watchPosition((p) => fix(p, true), fail, COARSE);
                  },
                  FINE
            );
      }, [stop]);

      useEffect(() => { start(); return stop; }, [start, stop]);

      const locate = () => { setState((s) => ({ ...s, status: s.gps ? 'ok' : 'locating', error: '' })); start(); };
      return { ...state, locate };
}

export const accuracyLabel = (m, approximate) => (m == null ? '' : approximate && m > 150 ? 'Approximate' : m <= 25 ? 'Excellent' : m <= 100 ? 'Good' : 'Weak');
