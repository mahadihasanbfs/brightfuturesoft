import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Plain Leaflet map with circle markers (no marker images needed). `points`: [{ lat, lng, label, href }].
// OpenStreetMap tiles are fetched from tile.openstreetmap.org, which sees the area being viewed.
export default function MapView({ points, height = 320, zoom = 16, live = false }) {
      const box = useRef(null);
      const map = useRef(null);
      const layer = useRef(null);

      useEffect(() => {
            map.current = L.map(box.current, { zoomControl: true, attributionControl: true }).setView([23.78, 90.4], 11);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map.current);
            layer.current = L.layerGroup().addTo(map.current);
            return () => { map.current.remove(); map.current = null; };
      }, []);

      useEffect(() => {
            if (!map.current) return;
            layer.current.clearLayers();
            const markers = points.map((p) => {
                  const m = L.circleMarker([p.lat, p.lng], { radius: live ? 9 : 7, color: '#fff', weight: 2, fillColor: live ? '#10b981' : '#3b82f6', fillOpacity: 1 }).addTo(layer.current);
                  if (p.label) m.bindPopup(p.href ? `${p.label}<br><a href="${p.href}" target="_blank" rel="noreferrer">Open in Google Maps</a>` : p.label);
                  return m;
            });
            if (!markers.length) return;
            if (markers.length === 1) map.current.setView([points[0].lat, points[0].lng], zoom);
            else map.current.fitBounds(L.featureGroup(markers).getBounds().pad(0.2), { maxZoom: 16 });
      }, [points, zoom, live]);

      return <div ref={box} style={{ height }} className="z-0 w-full overflow-hidden rounded-xl border border-white/10" />;
}
