// Link-preview HTML for social crawlers. Pages with no image of their own show the site banner (/og-default.jpg).
//
// The site is a single-page app: WhatsApp, Facebook, X, LinkedIn, Telegram and friends do not run JavaScript, so
// they only ever saw the static tags in index.html. vercel.json sends *only those crawlers* here; real visitors
// (and Googlebot, which renders JS itself) still get the normal app.
//
// For each URL this builds the right title / description / image from the live data (blog, project, job) or from the
// table of static pages below, and caches the result at Vercel's edge so repeat shares are instant.

const API = 'https://sever.brightfuturesoft.com/api/v1';
const SITE_NAME = 'Bright Future Soft';
const FETCH_TIMEOUT_MS = 2500; // crawlers give up quickly; fall back to defaults rather than hang
const MEMORY_TTL_MS = 5 * 60 * 1000;

// Banner used wherever a page has no image of its own (home, about, careers, jobs...).
const DEFAULT_IMAGE_PATH = '/og-default.jpg';

const DEFAULT_TITLE = "Bright Future Soft | Bangladesh's Leading Software & IT Solutions Company";
const DEFAULT_DESCRIPTION =
      'Bright Future Soft delivers world-class web, mobile, ERP, CRM, AI and custom software solutions for businesses in Bangladesh and beyond.';

// Static pages: exact path -> [title, description].
const PAGES = {
      '/': [DEFAULT_TITLE, DEFAULT_DESCRIPTION],
      '/about': ['About Us | Bright Future Soft', 'Meet Bright Future Soft: a Bangladesh software company building web, mobile, ERP, CRM and AI products for startups, SMEs and enterprises.'],
      '/company-profile': ['Company Profile | Bright Future Soft', 'Download the Bright Future Soft company profile: our services, technology, projects and the team behind them.'],
      '/service': ['Our Services | Bright Future Soft', 'Web development, mobile apps, UI/UX design, ERP, CRM, AI and cloud services from Bright Future Soft.'],
      '/technology': ['Technologies We Use | Bright Future Soft', 'The modern technology stack Bright Future Soft uses to build fast, secure and scalable software.'],
      '/review': ['Client Reviews | Bright Future Soft', 'See what clients say about working with Bright Future Soft.'],
      '/join-with-us': ['Join With Us | Bright Future Soft', 'Work with the Bright Future Soft team. Explore how to join us.'],
      '/project': ['Our Projects | Bright Future Soft', 'Explore software projects delivered by Bright Future Soft: web platforms, mobile apps, ERP and CRM systems.'],
      '/all_project': ['All Projects | Bright Future Soft', 'Browse every software project delivered by Bright Future Soft.'],
      '/careers': ['Careers | Bright Future Soft', 'Open positions at Bright Future Soft. Build your career with a growing Bangladesh software company.'],
      '/contacts': ['Contact Us | Bright Future Soft', 'Talk to Bright Future Soft about your next software project. Call, email or send us a message.'],
      '/book': ['Book an Appointment | Free Consultation, Demo & Workshops | Bright Future Soft', 'Book a free consultation, live application demo, project discovery workshop, technical review or support session with the Bright Future Soft team. Pick a time online in under a minute.'],
      '/blog': ['Blog | Bright Future Soft', 'Articles on software development, design, cloud and business technology from the Bright Future Soft team.'],
      '/trams-and-conditions': ['Terms and Conditions | Bright Future Soft', 'The terms and conditions for using Bright Future Soft services.'],
      '/terms': ['Terms of Service | Bright Future Soft', 'The terms of service for Bright Future Soft.'],
      '/policy': ['Policy | Bright Future Soft', 'Bright Future Soft company policies.'],
      '/privacy': ['Privacy Policy | Bright Future Soft', 'How Bright Future Soft collects, uses and protects your information.'],
      '/compliance': ['Compliance | Bright Future Soft', 'Bright Future Soft compliance and security practices.'],
      '/soc-iso-compliance': ['SOC and ISO Compliance | Bright Future Soft', 'Bright Future Soft SOC and ISO compliance information.'],
};

// Service pages: id -> [name, description]. Each has its own image at /og/services/<id>.jpg.
const SERVICES = {
      'ui-ux-design': ["UI/UX Design", "Human-centric interface design, design systems, and rapid clickable prototyping in Figma that turn complex user flows into intuitive digital products."],
      'web-development': ["Web Development", "High-performance, SEO-optimized web applications and scalable enterprise portals engineered with React, Next.js, TypeScript, and robust microservices."],
      'app-development': ["App Development", "Native and cross-platform iOS and Android applications built with Flutter and React Native delivering fluid 60fps performance and offline-first persistence."],
      'custom-software-development': ["Custom Software Development", "Purpose-built enterprise platforms, automated business workflows, and distributed backend systems tailored precisely to your company's operational model."],
      'it-consulting': ["IT Consulting", "Strategic technology roadmap consulting, cloud architecture audits, cybersecurity governance, and digital transformation roadmaps for ambitious leadership teams."],
      'data-analytics': ["Data Analytics & BI", "Actionable business intelligence, executive dashboards, predictive modeling, and automated data pipelines that transform raw operational logs into decisions."],
      'devops-ci-cd': ["DevOps and CI/CD", "Automated deployment pipelines, Docker containerization, Kubernetes orchestration, and cloud infrastructure as code (IaC) for zero-downtime releases."],
      'support-maintenance': ["Support And Maintenance", "Proactive 24/7 system monitoring, SLA-backed bug resolution, continuous security patching, and database optimization ensuring uninterrupted operations."],
      'e-commerce-solutions': ["E-commerce Solutions", "High-converting digital storefronts, custom headless checkouts, ERP inventory synchronization, and multi-currency global payment gateway integrations."],
      'erp-systems': ["ERP Systems", "Centralized enterprise resource planning covering multi-warehouse inventory, double-entry financial accounting, supply chain logistics, and HR payroll."],
      'legacy-system-modernization': ["Legacy System Modernization", "Systematic transformation of outdated monolithic codebases into cloud-native microservices with zero operational downtime and total data integrity."],
      'crm-solutions': ["CRM Solutions", "Bespoke customer relationship platforms featuring automated lead routing, omni-channel communication, pipeline forecasting, and client portals."],
};

/* ---------- helpers ---------- */

const escapeHtml = (v) =>
      String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const ENTITIES = { '&nbsp;': ' ', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&lt;': '<', '&gt;': '>', '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”' };

const plainText = (html, max = 200) => {
      const text = String(html ?? '')
            .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&(nbsp|amp|quot|#39|lt|gt|rsquo|lsquo|ldquo|rdquo);/g, (m) => ENTITIES[m] ?? m)
            .replace(/\s+/g, ' ')
            .trim();
      if (text.length <= max) return text;
      const cut = text.slice(0, max);
      return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30))}…`;
};

const safeDecode = (v) => {
      try {
            return decodeURIComponent(v);
      } catch {
            return v;
      }
};

const titleCase = (slug) =>
      safeDecode(slug).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());

const memory = new Map();

// Resolves to { data } when found, { notFound: true } when the API says it does not exist, and
// { failed: true } when the API could not be reached in time (so a slow API never marks a real page as missing).
const getJson = async (url) => {
      const hit = memory.get(url);
      if (hit && Date.now() - hit.at < MEMORY_TTL_MS) return hit.result;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      try {
            const res = await fetch(url, { signal: controller.signal, headers: { accept: 'application/json' } });
            let result;
            if (res.status === 404) result = { notFound: true };
            else if (!res.ok) return { failed: true };
            else {
                  const json = await res.json();
                  result = json?.data ? { data: json.data } : { notFound: true };
            }
            memory.set(url, { at: Date.now(), result });
            return result;
      } catch {
            return { failed: true };
      } finally {
            clearTimeout(timer);
      }
};

/* ---------- per-page metadata ---------- */

// Returns { title, description, image?, type?, notFound?, degraded? } for a path, using live data where the page has any.
const resolve = async (path, query = {}) => {
      const parts = path.split('/').filter(Boolean);
      const [section, slug] = parts;
      const isDetail = Boolean(slug) && parts.length === 2;
      const missing = { title: `Page not found | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, notFound: true };
      const fallback = PAGES[`/${parts.join('/')}`] || PAGES['/'];
      const degraded = { title: fallback[0], description: fallback[1], degraded: true };

      if (section === 'book' && parts.length === 1) {
            const base = PAGES['/book'];
            const out = { title: base[0], description: base[1], image: '/og/book.jpg' };
            const wanted = String(query.type || '');
            if (!/^[a-z-]{1,40}$/.test(wanted)) return out;
            const r = await getJson(`${API}/appointment/types`);
            const type = (Array.isArray(r.data) ? r.data : []).find((t) => t.id === wanted);
            if (!type) return out;
            return {
                  title: `Book a ${type.name} (${type.duration} min) | ${SITE_NAME}`,
                  description: plainText(`${type.description} ${type.duration}-minute session. Choose a time online and get confirmed instantly.`),
                  image: '/og/book.jpg',
            };
      }

      if (section === 'blog' && isDetail) {
            const r = await getJson(`${API}/blog/get-blog-by-id?blog_id=${encodeURIComponent(safeDecode(slug))}`);
            if (r.notFound) return missing;
            if (r.failed) return degraded;
            const blog = r.data;
            return {
                  title: `${blog.meta_tag || blog.title} | ${SITE_NAME}`,
                  description: plainText(blog.meta_description || blog.message),
                  image: blog.img,
                  type: 'article',
                  published: blog.date,
            };
      }

      if ((section === 'project' || section === 'all_project') && isDetail) {
            const r = await getJson(`${API}/project/get-project-by-id?project_id=${encodeURIComponent(safeDecode(slug))}`);
            if (r.notFound) return missing;
            if (r.failed) return degraded;
            const project = r.data;
            return {
                  title: `${project.meta_tag || project.project_name} | ${SITE_NAME}`,
                  description: plainText(project.meta_description || project.description),
                  image: project.image_url,
            };
      }

      if (section === 'careers' && isDetail) {
            if (!/^[0-9a-f]{24}$/i.test(slug)) return missing;
            const r = await getJson(`${API}/job-post/get-job-by-id?job_post_id=${slug}`);
            if (r.notFound) return missing;
            if (r.failed) return degraded;
            const job = r.data;
            const facts = [job.job_type, job.workplace].filter(Boolean).join(' \u00b7 ');
            const closed = job.dateline && Date.now() > new Date(`${job.dateline}T23:59:59+06:00`).getTime();
            const deadline = job.dateline ? (closed ? ' Applications closed.' : ` Apply by ${job.dateline}.`) : '';
            return {
                  title: `${job.job_position} \u2013 ${closed ? 'Position Closed' : "We're Hiring"} | ${SITE_NAME}`,
                  description: plainText(`${facts ? `${facts}. ` : ''}${plainText(job.description, 150)}${deadline}`, 200),
                  // Jobs have no picture of their own, so they show the site banner.
            };
      }

      if (section === 'careers' && parts.length === 1) {
            const r = await getJson(`${API}/job-post/all-job`);
            const open = (Array.isArray(r.data) ? r.data : []).filter(
                  (j) => !j.dateline || Date.now() <= new Date(`${j.dateline}T23:59:59+06:00`).getTime()
            );
            const base = PAGES['/careers'];
            return {
                  title: open.length ? `Careers: ${open.length} Open Position${open.length > 1 ? 's' : ''} | ${SITE_NAME}` : base[0],
                  description: open.length
                        ? plainText(`Now hiring: ${open.slice(0, 4).map((j) => j.job_position).join(', ')}. Join Bright Future Soft, a growing Bangladesh software company.`, 200)
                        : base[1],
            };
      }

      if ((section === 'service' || section === 'why-us') && isDetail) {
            const known = SERVICES[safeDecode(slug)];
            if (section === 'service' && !known) return { title: `${titleCase(slug)} | ${SITE_NAME}`, description: `${titleCase(slug)} services from ${SITE_NAME}. ${DEFAULT_DESCRIPTION}` };
            const [name, description] = known || [titleCase(slug), DEFAULT_DESCRIPTION];
            return {
                  title: `${name} | ${SITE_NAME}`,
                  description: plainText(description),
                  image: known ? `/og/services/${safeDecode(slug)}.jpg` : undefined,
            };
      }

      const page = PAGES[`/${parts.join('/')}`];
      return page ? { title: page[0], description: page[1] } : { title: PAGES['/'][0], description: PAGES['/'][1] };
};

/* ---------- response ---------- */

const render = ({ title, description, image, type = 'website', published, notFound }, url, origin) => {
      const img = image && /^https?:\/\//i.test(image) ? image : `${origin}${image && image.startsWith('/') ? image : DEFAULT_IMAGE_PATH}`;
      const t = escapeHtml(title);
      const d = escapeHtml(description);
      return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">${notFound ? '\n<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${escapeHtml(url)}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${escapeHtml(url)}">
<meta property="og:image" content="${escapeHtml(img)}">
<meta property="og:image:alt" content="${t}">
<meta property="og:locale" content="en_US">${published ? `\n<meta property="article:published_time" content="${escapeHtml(published)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${escapeHtml(img)}">
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
<p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
</body>
</html>`;
};

export default async function handler(req, res) {
      const raw = String(req.query?.path || '/');
      // Only ever our own paths; drop anything that is not a clean path.
      const path = raw.startsWith('/') ? raw.split('?')[0] : '/';
      const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'www.brightfuturesoft.com');
      // Behind Vercel or a tunnel the proxy says which scheme the crawler used; plain localhost is http.
      const proto = String(req.headers['x-forwarded-proto'] || (/^(localhost|127\.)/.test(host) ? 'http' : 'https')).split(',')[0];
      const origin = `${proto}://${host}`;

      const query = { type: req.query?.type };
      const meta = await resolve(path, query);
      const canonicalQuery = path === '/book' && /^[a-z-]{1,40}$/.test(String(query.type || '')) && !meta.notFound ? `?type=${query.type}` : '';

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      // Edge-cache per URL: the first share builds it, later shares are served instantly; stale copies refresh in the background.
      // A degraded answer (API unreachable) is only cached briefly so the real preview replaces it quickly.
      res.setHeader('Cache-Control', meta.degraded ? 'public, s-maxage=60' : 'public, s-maxage=3600, stale-while-revalidate=86400');
      res.status(meta.notFound ? 404 : 200).send(render(meta, `${origin}${encodeURI(safeDecode(path))}${canonicalQuery}`, origin));
}
