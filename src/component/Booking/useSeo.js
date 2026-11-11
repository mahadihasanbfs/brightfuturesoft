import { useEffect } from "react";

const SITE = "https://www.brightfuturesoft.com";
const ORG = {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Bright Future Soft",
      url: SITE,
      logo: `${SITE}/logo.png`,
};

// Sets the document head for a page (title, description, canonical, Open Graph, Twitter, JSON-LD)
// and restores what was there before when the page unmounts. Googlebot renders JS, so this covers
// search; link-preview crawlers that do not run JS are served by api/seo.js instead.
export default function useSeo({ title, description, path, image, jsonLd }) {
      const jsonKey = JSON.stringify(jsonLd || null);
      useEffect(() => {
            const url = `${SITE}${path}`;
            const img = image.startsWith("http") ? image : `${SITE}${image}`;
            const undo = [];

            const setMeta = (attr, key, value) => {
                  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
                  const created = !el;
                  if (created) {
                        el = document.createElement("meta");
                        el.setAttribute(attr, key);
                        document.head.appendChild(el);
                  }
                  const prev = el.getAttribute("content");
                  el.setAttribute("content", value);
                  undo.push(() => (created ? el.remove() : el.setAttribute("content", prev ?? "")));
            };

            const prevTitle = document.title;
            document.title = title;
            undo.push(() => { document.title = prevTitle; });

            let canonical = document.head.querySelector('link[rel="canonical"]');
            const createdCanonical = !canonical;
            if (createdCanonical) {
                  canonical = document.createElement("link");
                  canonical.rel = "canonical";
                  document.head.appendChild(canonical);
            }
            const prevCanonical = canonical.getAttribute("href");
            canonical.setAttribute("href", url);
            undo.push(() => (createdCanonical ? canonical.remove() : canonical.setAttribute("href", prevCanonical ?? "")));

            setMeta("name", "description", description);
            setMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
            setMeta("property", "og:title", title);
            setMeta("property", "og:description", description);
            setMeta("property", "og:url", url);
            setMeta("property", "og:type", "website");
            setMeta("property", "og:image", img);
            setMeta("property", "og:image:width", "1200");
            setMeta("property", "og:image:height", "630");
            setMeta("property", "og:image:alt", title);
            setMeta("name", "twitter:card", "summary_large_image");
            setMeta("name", "twitter:title", title);
            setMeta("name", "twitter:description", description);
            setMeta("name", "twitter:image", img);
            setMeta("name", "twitter:image:alt", title);

            if (jsonKey !== "null") {
                  const script = document.createElement("script");
                  script.type = "application/ld+json";
                  script.dataset.seo = "booking";
                  script.textContent = jsonKey;
                  document.head.appendChild(script);
                  undo.push(() => script.remove());
            }

            return () => undo.reverse().forEach(fn => fn());
      }, [title, description, path, image, jsonKey]);
}

export const buildBookingJsonLd = (types, type) => {
      const page = type ? `${SITE}/book?type=${type.id}` : `${SITE}/book`;
      const crumbs = [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Book an appointment", item: `${SITE}/book` },
            ...(type ? [{ "@type": "ListItem", position: 3, name: type.name, item: page }] : []),
      ];
      const service = t => ({
            "@type": "Service",
            name: t.name,
            description: t.description,
            provider: { "@id": ORG["@id"] },
            areaServed: "Worldwide",
            url: `${SITE}/book?type=${t.id}`,
            potentialAction: {
                  "@type": "ReserveAction",
                  name: `Book a ${t.name}`,
                  target: { "@type": "EntryPoint", urlTemplate: `${SITE}/book?type=${t.id}`, actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"] },
                  result: { "@type": "Reservation", name: `${t.name} (${t.duration} minutes)` },
            },
      });
      return {
            "@context": "https://schema.org",
            "@graph": [
                  ORG,
                  { "@type": "BreadcrumbList", itemListElement: crumbs },
                  { "@type": "WebPage", "@id": `${page}#webpage`, url: page, inLanguage: "en" },
                  ...(type ? [service(type)] : types.length ? [{ "@type": "ItemList", name: "Appointment types", itemListElement: types.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: service(t) })) }] : []),
            ],
      };
};
