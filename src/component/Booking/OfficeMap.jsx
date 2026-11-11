import { useEffect, useState } from "react";
import { base_url } from "../../layout/Title";

// Illustrated location card for "Visit our office". It is drawn in the site's own style, not a map tile:
// the real navigation is the "Open in Maps" link, which the server has already validated.
const OfficeMap = ({ className = "", place }) => {
      const [fetched, setFetched] = useState(null);
      const office = place || fetched;
      const [copied, setCopied] = useState(false);

      useEffect(() => {
            if (place) return;
            let stale = false;
            fetch(`${base_url}/appointment/office`)
                  .then(r => r.json())
                  .then(r => { if (!stale && r.success) setFetched(r.data); })
                  .catch(() => {});
            return () => { stale = true; };
      }, [place]);

      const copy = async () => {
            try {
                  await navigator.clipboard.writeText(office.address);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
            } catch { /* clipboard blocked: the address is visible anyway */ }
      };

      if (!office) return <div className={`h-64 animate-pulse rounded-sm border border-[#E1E9F2] bg-[#F1F8FF] ${className}`} aria-hidden="true" />;

      return (
            <div className={`overflow-hidden rounded-sm border border-[#E1E9F2] bg-white ${className}`}>
                  <div className="relative">
                        <svg viewBox="0 0 600 260" className="block h-auto w-full" role="img" aria-label={`Illustrated location of ${office.name}: ${office.address}`}>
                              <rect width="600" height="260" fill="#EEF5FC" />
                              {/* city blocks */}
                              {[[20, 20, 110, 70], [150, 20, 90, 70], [20, 110, 110, 60], [150, 110, 90, 60], [20, 190, 110, 50], [150, 190, 90, 50],
                                    [330, 20, 100, 70], [450, 20, 130, 70], [330, 110, 100, 60], [450, 110, 130, 60], [330, 190, 100, 50], [450, 190, 130, 50]].map(([x, y, w, h], i) => (
                                          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={i % 5 === 2 ? "#DCEBF7" : "#F8FBFF"} stroke="#E1E9F2" />
                                    ))}
                              {/* park */}
                              <rect x="20" y="110" width="110" height="60" rx="3" fill="#E2F0EA" stroke="#D3E6DD" />
                              {/* water */}
                              <path d="M-10 238 C 120 205, 220 250, 330 222 S 520 190, 610 228 L 610 270 L -10 270 Z" fill="#CFE3F4" />
                              {/* roads */}
                              <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
                                    <path d="M0 100 H600" strokeWidth="14" />
                                    <path d="M0 180 H600" strokeWidth="10" />
                                    <path d="M140 0 V260" strokeWidth="10" />
                                    <path d="M250 0 V260" strokeWidth="12" />
                                    <path d="M440 0 V260" strokeWidth="10" />
                                    <path d="M250 100 L 600 20" strokeWidth="8" />
                              </g>
                              <g stroke="#D6E3F0" strokeWidth="1" strokeDasharray="6 8" fill="none">
                                    <path d="M0 100 H600" />
                                    <path d="M250 0 V260" />
                              </g>
                              {/* office pin */}
                              <g transform="translate(250 100)">
                                    <circle r="26" fill="#0A65B4" opacity="0.12" />
                                    <circle r="14" fill="#0A65B4" opacity="0.2" />
                                    <path d="M0 -4 C -16 -4 -22 -22 -22 -32 A22 22 0 1 1 22 -32 C22 -22 16 -4 0 -4 Z" transform="translate(0 -6)" fill="#0A65B4" />
                                    <circle cy="-44" r="8" fill="#fff" />
                                    <ellipse cy="4" rx="9" ry="3" fill="#142235" opacity="0.18" />
                              </g>
                        </svg>
                        <div className="absolute left-4 top-4 rounded-sm border border-[#E1E9F2] bg-white px-3 py-2 shadow-[0_12px_30px_-18px_rgba(10,101,180,0.5)]">
                              <p className="text-sm font-bold text-[#142235]">{office.name}</p>
                              <p className="text-xs text-[#66758A]">{office.address}</p>
                        </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E9F2] p-4">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-[#66758A]">
                              {office.link_reachable && <span className="text-[#0A65B4]" aria-hidden="true">✓</span>}
                              {office.link_reachable ? "Map link checked" : "Map link"}
                              {!office.exact_pin && <span className="text-[#8794A4]">· opens an address search</span>}
                        </p>
                        <div className="flex gap-2">
                              <button type="button" onClick={copy} className="rounded-sm border border-[#E1E9F2] bg-white px-3 py-2 text-xs font-semibold transition hover:border-[#0A65B4] hover:text-[#0A65B4]">{copied ? "Copied" : "Copy address"}</button>
                              <a href={office.map_url} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-[#0A65B4] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#084F8D]">Open in Maps →</a>
                        </div>
                  </div>
            </div>
      );
};

export default OfficeMap;
