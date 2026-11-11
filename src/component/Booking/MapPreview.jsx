// Preview of a shared map link, drawn in the site's own style: map tiles are washed out into a quiet blue
// backdrop, and everything that matters (pin, area ring, label, link) is ours. Needs the coordinates the
// server read from the link. Tiles and data: © OpenStreetMap contributors (credit shown on the card).
const ZOOM = 16;

const tileXY = (lat, lng, z) => {
      const n = 2 ** z;
      const x = ((lng + 180) / 360) * n;
      const rad = (lat * Math.PI) / 180;
      const y = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
      return { x, y };
};

const coord = (v, pos, neg) => `${Math.abs(v).toFixed(5)}° ${v >= 0 ? pos : neg}`;

const MapPreview = ({ lat, lng, name, address, mapUrl, verified, note, className = "" }) => {
      const { x, y } = tileXY(lat, lng, ZOOM);
      const xi = Math.floor(x), yi = Math.floor(y);
      const fx = x - xi, fy = y - yi;
      const tiles = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) tiles.push([dx + 1, dy + 1, xi + dx, yi + dy]);

      return (
            <figure className={`m-0 overflow-hidden rounded-sm border border-[#E1E9F2] bg-white text-left shadow-[0_18px_40px_-26px_rgba(10,101,180,0.45)] ${className}`}>
                  <div className="relative h-72 overflow-hidden bg-[#DCEAF8]" role="img" aria-label={`Map preview${name ? ` of ${name}` : ""}${address ? `, ${address}` : ""}`}>
                        {/* 3x3 tile grid, shifted so the shared point sits in the middle. Washed out so roads stay readable and labels fade to texture. */}
                        <div className="absolute h-[768px] w-[768px]" style={{ left: `calc(50% - ${256 + fx * 256}px)`, top: `calc(50% - ${256 + fy * 256}px)` }}>
                              {tiles.map(([cx, cy, tx, ty]) => (
                                    <img
                                          key={`${tx}-${ty}`}
                                          src={`https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`}
                                          alt=""
                                          width={256}
                                          height={256}
                                          loading="lazy"
                                          draggable={false}
                                          className="absolute select-none"
                                          style={{ left: cx * 256, top: cy * 256, filter: "grayscale(1) contrast(0.5) brightness(1.32) blur(0.5px)", mixBlendMode: "multiply" }}
                                    />
                              ))}
                        </div>
                        {/* brand tint + soft edge fade */}
                        <div className="pointer-events-none absolute inset-0 bg-[#0A65B4]/[0.07]" />
                        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0) 45%, rgba(241,248,255,0.85) 100%)" }} />

                        {/* area ring, radar pulses and pointer. The pointer tip sits exactly on the shared coordinates. */}
                        <style>{`
                              @keyframes bfs-drop { 0% { transform: translate(-50%, -260%); opacity: 0 } 60% { transform: translate(-50%, -92%); opacity: 1 } 80% { transform: translate(-50%, -108%) } 100% { transform: translate(-50%, -100%) } }
                              @keyframes bfs-radar { 0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.55 } 100% { transform: translate(-50%, -50%) scale(1); opacity: 0 } }
                              @media (prefers-reduced-motion: reduce) { .bfs-pin, .bfs-radar { animation: none !important } .bfs-pin { transform: translate(-50%, -100%) !important } .bfs-radar { display: none } }
                        `}</style>
                        <span className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0A65B4]/25 bg-[#0A65B4]/[0.08]" aria-hidden="true" />
                        {[0, 0.9].map(d => (
                              <span key={d} className="bfs-radar pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 rounded-full border-2 border-[#0A65B4]/60" style={{ animation: `bfs-radar 2.2s ease-out ${d}s infinite`, transform: "translate(-50%, -50%) scale(0.2)" }} aria-hidden="true" />
                        ))}
                        <span className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-8 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#0A2C4D]/35 blur-[2px]" aria-hidden="true" />
                        <svg viewBox="0 0 56 72" className="bfs-pin pointer-events-none absolute left-1/2 top-1/2 h-[72px] w-[56px] drop-shadow-[0_6px_6px_rgba(10,44,77,0.3)]" style={{ transform: "translate(-50%, -100%)", animation: "bfs-drop 0.7s cubic-bezier(.3,.9,.4,1) both" }} aria-hidden="true">
                              <defs>
                                    <linearGradient id="bfsPin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2A8BE0" /><stop offset="0.55" stopColor="#0A65B4" /><stop offset="1" stopColor="#084F8D" /></linearGradient>
                              </defs>
                              <path d="M28 70 C 14 52 3 41 3 26 A25 25 0 1 1 53 26 C53 41 42 52 28 70 Z" fill="url(#bfsPin)" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
                              <circle cx="28" cy="26" r="14" fill="#fff" />
                              {/* building mark */}
                              <g fill="none" stroke="#0A65B4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 34V20l7-4 7 4v14" /><path d="M19 34h18" /><path d="M25.5 34v-6h5v6" /></g>
                              <path d="M12 14 C 16 7 24 4 31 5" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>

                        {/* label card */}
                        <div className="absolute left-3 top-3 flex max-w-[78%] items-start gap-3 rounded-sm border border-[#E1E9F2] bg-white/95 px-3.5 py-3 shadow-[0_14px_30px_-18px_rgba(10,101,180,0.55)] backdrop-blur-sm">
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-[#F1F8FF] text-[#0A65B4]" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                              </span>
                              <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0A65B4]">We visit this place</p>
                                    <p className="truncate text-sm font-bold text-[#142235]">{name || "Meeting location"}</p>
                                    {address && <p className="truncate text-xs text-[#66758A]">{address}</p>}
                              </div>
                        </div>

                        <figcaption className="absolute bottom-1 right-1.5 bg-white/85 px-1.5 text-[10px] text-[#66758A]">© OpenStreetMap contributors</figcaption>
                  </div>
                  <div className="space-y-3 border-t border-[#E1E9F2] p-4">
                        <p className="text-sm leading-relaxed text-[#142235]">{note || "Our team will meet you at this location at the booked time. Please check that the pin is exactly where we should arrive."}</p>
                        <dl className="grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
                              <div><dt className="font-semibold uppercase tracking-wider text-[#8794A4]">Place</dt><dd className="mt-0.5 font-medium text-[#142235]">{name || "Meeting location"}</dd></div>
                              {address && <div><dt className="font-semibold uppercase tracking-wider text-[#8794A4]">Address</dt><dd className="mt-0.5 font-medium text-[#142235]">{address}</dd></div>}
                              <div><dt className="font-semibold uppercase tracking-wider text-[#8794A4]">Coordinates</dt><dd className="mt-0.5 font-mono font-medium text-[#142235]">{coord(lat, "N", "S")}, {coord(lng, "E", "W")}</dd></div>
                        </dl>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E9F2] bg-[#F7FAFF] px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-medium text-[#66758A]">
                              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${verified ? "bg-[#F1F8FF] text-[#0A65B4]" : "bg-[#EEF1F5] text-[#8794A4]"}`} aria-hidden="true">{verified ? "✓" : "i"}</span>
                              {verified ? "Map link checked and working" : "Map link"}
                        </p>
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-[#0A65B4] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#084F8D]">Open in Maps →</a>
                  </div>
            </figure>
      );
};

export default MapPreview;
