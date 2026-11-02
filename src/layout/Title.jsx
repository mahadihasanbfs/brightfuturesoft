import { useEffect } from 'react';

const DEFAULT_IMAGE = "https://brightfuturesoft.com/og-default.jpg";

// Writes the page's SEO tags straight into <head> and puts the previous values back when the page unmounts.
// (react-helmet 6 does not reliably apply tags under React 19, e.g. when a page's props change after data loads.)
const applyHead = (config) => {
      const restore = [];

      const meta = (attr, key, value) => {
            if (value === undefined || value === null || value === '') return;
            const found = [...document.head.querySelectorAll(`meta[${attr}="${key}"]`)];
            const els = found.length ? found : (() => {
                  const el = document.createElement('meta');
                  el.setAttribute(attr, key);
                  document.head.appendChild(el);
                  restore.push(() => el.remove());
                  return [el];
            })();
            els.forEach((el) => {
                  const before = el.getAttribute('content');
                  el.setAttribute('content', String(value));
                  if (before !== null) restore.push(() => el.setAttribute('content', before));
            });
      };

      const link = (rel, href) => {
            if (!href) return;
            const found = [...document.head.querySelectorAll(`link[rel="${rel}"]`)];
            const els = found.length ? found : (() => {
                  const el = document.createElement('link');
                  el.setAttribute('rel', rel);
                  document.head.appendChild(el);
                  restore.push(() => el.remove());
                  return [el];
            })();
            els.forEach((el) => {
                  const before = el.getAttribute('href');
                  el.setAttribute('href', href);
                  if (before !== null) restore.push(() => el.setAttribute('href', before));
            });
      };

      const previousTitle = document.title;
      document.title = config.title;
      restore.push(() => { document.title = previousTitle; });

      meta('name', 'description', config.description);
      meta('name', 'keywords', config.keywords);
      meta('name', 'author', config.author);
      meta('name', 'robots', config.robots);

      meta('property', 'og:site_name', 'Bright Future Soft');
      meta('property', 'og:locale', 'en_US');
      meta('property', 'og:title', config.shareTitle);
      meta('property', 'og:description', config.shareDescription);
      meta('property', 'og:image', config.image);
      meta('property', 'og:image:alt', config.imageAlt);
      meta('property', 'og:url', config.url);
      meta('property', 'og:type', config.type);

      meta('name', 'twitter:card', 'summary_large_image');
      meta('name', 'twitter:title', config.shareTitle);
      meta('name', 'twitter:description', config.shareDescription);
      meta('name', 'twitter:image', config.image);
      meta('name', 'twitter:image:alt', config.imageAlt);

      link('canonical', config.url);
      meta('property', 'article:published_time', config.publishedTime);
      meta('property', 'article:modified_time', config.modifiedTime);

      if (config.schema) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.dataset.pageSchema = 'true';
            script.textContent = JSON.stringify(config.schema);
            document.head.appendChild(script);
            restore.push(() => script.remove());
      }

      return () => restore.reverse().forEach((undo) => undo());
};

// Optional props beyond the originals:
//   fullTitle       use `title` exactly as given (no "Bright Future Soft |" prefix)
//   type            og:type, e.g. "article" (default "website")
//   robots          e.g. "noindex, follow"
//   publishedTime / modifiedTime   ISO dates, only written when you pass them
//   imageAlt        alt text for the share image
const MetaTitle = ({
      title, description, keywords, author, ogTitle, ogDescription, ogImage, ogUrl, schema,
      fullTitle = false, type = "website", robots, publishedTime, modifiedTime, imageAlt,
}) => {
      const schemaKey = schema ? JSON.stringify(schema) : '';

      useEffect(() => {
            const shareTitle = ogTitle || title;
            return applyHead({
                  title: fullTitle ? title : `Bright Future Soft | ${title}`,
                  description: description || "Default description for Bright Future Soft",
                  keywords: keywords || "software, development, technology, services",
                  author: author || "Bright Future Soft",
                  robots,
                  shareTitle,
                  shareDescription: ogDescription || description,
                  image: ogImage || DEFAULT_IMAGE,
                  imageAlt: imageAlt || shareTitle,
                  url: ogUrl || window.location.href,
                  type,
                  publishedTime,
                  modifiedTime,
                  schema: schemaKey ? JSON.parse(schemaKey) : null,
            });
      }, [title, description, keywords, author, ogTitle, ogDescription, ogImage, ogUrl, schemaKey, fullTitle, type, robots, publishedTime, modifiedTime, imageAlt]);

      return null;
};

export default MetaTitle;



export const base_url = 'https://sever.brightfuturesoft.com/api/v1'
