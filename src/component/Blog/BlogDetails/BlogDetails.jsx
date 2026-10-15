import { useEffect, useState, useMemo } from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
      HiChevronRight, 
      HiCalendarDays, 
      HiClock, 
      HiShare, 
      HiLink, 
      HiCheck,
      HiArrowSmallRight,
      HiArrowSmallLeft,
      HiLightBulb,
      HiListBullet,
      HiShieldCheck
} from "react-icons/hi2";
import { FaXTwitter, FaLinkedinIn, FaFacebookF } from "react-icons/fa6";

import { base_url } from '../../../layout/Title';
import { CallSchedule } from '../../../pages/shared/Header/Header';
import BlogCart from '../BlogCart/BlogCart';

const BlogDetails = () => {
      const { id } = useParams();
      const loaderData = useLoaderData();
      const [schedule, setSchedule] = useState(false);
      const [copied, setCopied] = useState(false);
      const [scrollProgress, setScrollProgress] = useState(0);
      const [activeSection, setActiveSection] = useState("");

      // Reading progress bar calculation
      useEffect(() => {
            const handleScroll = () => {
                  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                  if (totalHeight > 0) {
                        const currentProgress = (window.scrollY / totalHeight) * 100;
                        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
                  }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
      }, []);

      // Caching: Fetch or reuse single blog from cache
      const { data: blogResponse } = useQuery({
            queryKey: ["blog_detail", id],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/blog/get-blog-by-id?blog_id=${id}`);
                  if (!res.ok) throw new Error("Failed to load article");
                  return res.json();
            },
            initialData: loaderData,
            staleTime: 1000 * 60 * 15, // 15 mins fresh cache
      });

      const blogInfo = blogResponse?.data || loaderData?.data;

      // Caching: Reuse cached public blogs list for sidebar, related articles, and prev/next links
      const { data: allBlogs = [] } = useQuery({
            queryKey: ["public_blogs"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/blog/get-blog`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  });
                  const json = await res.json();
                  return json?.data || [];
            },
            staleTime: 1000 * 60 * 15,
            cacheTime: 1000 * 60 * 60,
      });

      // Team members for consultation CTA
      const { data: teamMembers = [] } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  try {
                        const res = await fetch(`${base_url}/auth/all`, {
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                        });
                        const { data } = await res.json();
                        return (data || [])
                              .filter(user => user.slot != null)
                              .sort((a, b) => {
                                    if (a.slot === b.slot) {
                                          return a.name.localeCompare(b.name);
                                    }
                                    return Number(a.slot) - Number(b.slot);
                              });
                  } catch (e) {
                        return [];
                  }
            },
      });

      // Processed HTML & Table of Contents extraction
      const { processedHtml, tableOfContents } = useMemo(() => {
            if (!blogInfo?.message) return { processedHtml: "", tableOfContents: [] };

            let cleaned = blogInfo.message
                  .replace(/background-color\s*:\s*[^;"]+;?/gi, "")
                  .replace(/background\s*:\s*[^;"]+;?/gi, "")
                  .replace(/color\s*:\s*[^;"]+;?/gi, "");

            const doc = new DOMParser().parseFromString(cleaned, 'text/html');
            const headings = doc.querySelectorAll('h2, h3');
            const toc = [];

            headings.forEach((heading, idx) => {
                  const text = heading.textContent?.trim() || "";
                  if (text.length > 0) {
                        const slug = heading.id || `section-${idx}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`;
                        heading.id = slug;
                        toc.push({
                              id: slug,
                              text: text,
                              level: heading.tagName.toLowerCase()
                        });
                  }
            });

            return {
                  processedHtml: doc.body.innerHTML,
                  tableOfContents: toc
            };
      }, [blogInfo?.message]);

      // Calculate estimated reading time
      const textToCount = (blogInfo?.meta_description || blogInfo?.message || "").replace(/<[^>]*>/g, '');
      const wordCount = textToCount.split(/\s+/).filter(Boolean).length;
      const readingMinutes = Math.max(2, Math.ceil(wordCount / 180));

      // Category extraction
      const category = blogInfo?.meta_tag && blogInfo.meta_tag.length > 0
            ? (blogInfo.meta_tag.includes(",") ? blogInfo.meta_tag.split(",")[0].trim() : blogInfo.meta_tag.trim())
            : "Engineering";

      // Article tags list
      const articleTags = useMemo(() => {
            if (!blogInfo?.meta_tag) return [];
            return blogInfo.meta_tag
                  .split(",")
                  .map(t => t.trim())
                  .filter(t => t.length > 0);
      }, [blogInfo?.meta_tag]);

      // Formatted date
      const displayDate = blogInfo?.date ? new Date(blogInfo.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
      }) : "Recently Published";

      const canonicalUrl = window.location.href;

      // Next & Previous post calculation
      const { prevArticle, nextArticle } = useMemo(() => {
            if (!allBlogs || allBlogs.length <= 1) return { prevArticle: null, nextArticle: null };
            const currentIndex = allBlogs.findIndex(b => b.url === blogInfo?.url || b._id === blogInfo?._id);
            if (currentIndex === -1) return { prevArticle: null, nextArticle: null };
            const prev = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
            const next = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;
            return { prevArticle: prev, nextArticle: next };
      }, [allBlogs, blogInfo]);

      // Share helpers
      const handleCopyLink = () => {
            if (navigator.clipboard) {
                  navigator.clipboard.writeText(canonicalUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
            }
      };

      const handleShare = () => {
            if (navigator.share) {
                  navigator.share({
                        title: blogInfo?.title,
                        text: blogInfo?.meta_description?.slice(0, 100),
                        url: canonicalUrl,
                  }).catch(() => {});
            } else {
                  handleCopyLink();
            }
      };

      // SEO & Social Preview Meta tags
      useEffect(() => {
            window.scrollTo(0, 0);

            if (!blogInfo?.title) return;

            // Document Title
            document.title = `${blogInfo.title} | Bright Future Soft Blog`;

            // Plain text description
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = blogInfo.message || "";
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const description = blogInfo.meta_description || plainText.slice(0, 160) || "Engineering insights by Bright Future Soft.";

            // Meta Description
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                  metaDesc = document.createElement("meta");
                  metaDesc.name = "description";
                  document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", description);

            // Canonical Link
            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                  canonical = document.createElement("link");
                  canonical.setAttribute("rel", "canonical");
                  document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", canonicalUrl);

            // OG Type
            let ogType = document.querySelector("meta[property='og:type']");
            if (!ogType) {
                  ogType = document.createElement("meta");
                  ogType.setAttribute("property", "og:type");
                  document.head.appendChild(ogType);
            }
            ogType.setAttribute("content", "article");

            // OG Title
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                  ogTitle = document.createElement("meta");
                  ogTitle.setAttribute("property", "og:title");
                  document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute("content", blogInfo.title);

            // OG Description
            let ogDesc = document.querySelector("meta[property='og:description']");
            if (!ogDesc) {
                  ogDesc = document.createElement("meta");
                  ogDesc.setAttribute("property", "og:description");
                  document.head.appendChild(ogDesc);
            }
            ogDesc.setAttribute("content", description);

            // OG Image
            if (blogInfo.img) {
                  let ogImage = document.querySelector("meta[property='og:image']");
                  if (!ogImage) {
                        ogImage = document.createElement("meta");
                        ogImage.setAttribute("property", "og:image");
                        document.head.appendChild(ogImage);
                  }
                  ogImage.setAttribute("content", blogInfo.img);
            }

            // Twitter Card
            let twCard = document.querySelector("meta[name='twitter:card']");
            if (!twCard) {
                  twCard = document.createElement("meta");
                  twCard.setAttribute("name", "twitter:card");
                  document.head.appendChild(twCard);
            }
            twCard.setAttribute("content", "summary_large_image");

            // Schema.org Structured Data
            const schemaData = {
                  "@context": "https://schema.org",
                  "@graph": [
                        {
                              "@type": "BreadcrumbList",
                              "itemListElement": [
                                    {
                                          "@type": "ListItem",
                                          "position": 1,
                                          "name": "Home",
                                          "item": "https://brightfuturesoft.com"
                                    },
                                    {
                                          "@type": "ListItem",
                                          "position": 2,
                                          "name": "Blog",
                                          "item": "https://brightfuturesoft.com/blog"
                                    },
                                    {
                                          "@type": "ListItem",
                                          "position": 3,
                                          "name": blogInfo.title,
                                          "item": canonicalUrl
                                    }
                              ]
                        },
                        {
                              "@type": "BlogPosting",
                              "@id": canonicalUrl,
                              "headline": blogInfo.title,
                              "description": description,
                              "image": blogInfo.img ? [blogInfo.img] : [],
                              "datePublished": blogInfo.date || new Date().toISOString(),
                              "author": {
                                    "@type": "Organization",
                                    "name": "Bright Future Soft Engineering Team",
                                    "url": "https://brightfuturesoft.com"
                              },
                              "publisher": {
                                    "@type": "Organization",
                                    "name": "Bright Future Soft",
                                    "url": "https://brightfuturesoft.com",
                                    "logo": {
                                          "@type": "ImageObject",
                                          "url": "https://brightfuturesoft.com/assets/logo.png"
                                    }
                              },
                              "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": canonicalUrl
                              }
                        }
                  ]
            };

            let scriptTag = document.getElementById("blog-details-schema-jsonld");
            if (!scriptTag) {
                  scriptTag = document.createElement("script");
                  scriptTag.id = "blog-details-schema-jsonld";
                  scriptTag.type = "application/ld+json";
                  document.head.appendChild(scriptTag);
            }
            scriptTag.text = JSON.stringify(schemaData);

            return () => {
                  const tag = document.getElementById("blog-details-schema-jsonld");
                  if (tag) tag.remove();
            };
      }, [blogInfo]);

      if (!blogInfo) {
            return (
                  <main className="blog-details-page py-24 px-4 text-center">
                        <div className="max-w-md mx-auto bg-white p-10 rounded-lg border border-[#e1e9f2] shadow-sm">
                              <span className="site-eyebrow">Article</span>
                              <h1 className="text-2xl font-bold text-[#142235] mt-3">Article Not Found</h1>
                              <p className="text-sm text-[#55667c] mt-2 mb-6">
                                    The article you are trying to view might have been moved or removed.
                              </p>
                              <Link to="/blog" className="service-btn-primary">
                                    Back to All Articles
                              </Link>
                        </div>
                  </main>
            );
      }

      // Filter recent/more blogs for sidebar and related section
      const otherBlogs = allBlogs.filter(b => b.url !== blogInfo.url && b._id !== blogInfo._id);
      const recentSidebarBlogs = otherBlogs.slice(0, 4);
      const relatedBlogs = otherBlogs.slice(0, 3);

      return (
            <main className="">
                  {/* Reading Progress Indicator */}
                  <div
                        className="blog-reading-progress-bar"
                        style={{ width: `${scrollProgress}%` }}
                        aria-hidden="true"
                  />

                 
                  {/* Article Header */}
                  <header className="blog-details-header px-4 sm:px-6 lg:px-8 mt-20">
                        <div className="mx-auto max-w-7xl ">
                              <span className="blog-details-topic-pill">{category}</span>
                              <h1 className="blog-details-h1">{blogInfo.title}</h1>

                              {/* Author and Publishing Metadata Bar */}
                              <div className="blog-details-meta-bar">
                                    {/* <div className="blog-author-meta">
                                          <div className="blog-author-avatar" aria-hidden="true">
                                                BFS
                                          </div>
                                          <div>
                                                <div className="blog-author-name flex items-center gap-1.5">
                                                      <span>{blogInfo.publisher?.name || "Bright Future Soft Engineering"}</span>
                                                      <HiShieldCheck className="text-[#0a65b4] text-base" title="Verified Engineering Squad" />
                                                </div>
                                                <div className="blog-publish-date flex items-center gap-3">
                                                      <span className="flex items-center gap-1">
                                                            <HiCalendarDays aria-hidden="true" />
                                                            {displayDate}
                                                      </span>
                                                      <span>•</span>
                                                      <span className="flex items-center gap-1">
                                                            <HiClock aria-hidden="true" />
                                                            {readingMinutes} min read
                                                      </span>
                                                </div>
                                          </div>
                                    </div> */}

                                    {/* Social Share Tools */}
                                    <div className="blog-share-tools" aria-label="Share this article">
                                          <a
                                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogInfo.title)}&url=${encodeURIComponent(canonicalUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="blog-share-btn"
                                                aria-label="Share on X (Twitter)"
                                                title="Share on X"
                                          >
                                                <FaXTwitter />
                                          </a>
                                          <a
                                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="blog-share-btn"
                                                aria-label="Share on LinkedIn"
                                                title="Share on LinkedIn"
                                          >
                                                <FaLinkedinIn />
                                          </a>
                                          <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="blog-share-btn"
                                                aria-label="Share on Facebook"
                                                title="Share on Facebook"
                                          >
                                                <FaFacebookF />
                                          </a>
                                          <button
                                                type="button"
                                                onClick={handleCopyLink}
                                                className="blog-share-btn"
                                                aria-label="Copy article link"
                                                title="Copy link"
                                          >
                                                {copied ? <HiCheck className="text-emerald-600" /> : <HiLink />}
                                          </button>
                                          <button
                                                type="button"
                                                onClick={handleShare}
                                                className="blog-share-btn"
                                                aria-label="Native share"
                                                title="Share"
                                          >
                                                <HiShare />
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </header>

                  {/* Main Article & Sidebar Layout */}
                  <div className="px-4 sm:px-6 lg:px-8 mt-4">
                        <div className="blog-details-layout mx-0 sm:mx-auto max-w-7xl">
                              {/* Left Article Main Content Column */}
                              <article className="min-w-0">
                                    {/* Featured Cover Image */}
                                    {blogInfo.img && (
                                          <div className="blog-article-hero-media">
                                                <img
                                                      src={blogInfo.img}
                                                      alt={`${blogInfo.title} cover`}
                                                      loading="eager"
                                                      onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80";
                                                      }}
                                                />
                                          </div>
                                    )}

                                    {/* Executive Key Takeaways Callout Box */}
                                    {blogInfo.meta_description && (
                                          <div className="blog-key-takeaways">
                                                <div className="blog-takeaways-head">
                                                      <HiLightBulb aria-hidden="true" />
                                                      <span>Executive Summary & Key Takeaway</span>
                                                </div>
                                                <p className="blog-takeaways-body">
                                                      {blogInfo.meta_description}
                                                </p>
                                          </div>
                                    )}

                                    {/* Rich Text Formatted Article Content */}
                                    <div
                                          className="blog-article-content"
                                          dangerouslySetInnerHTML={{
                                                __html: processedHtml,
                                          }}
                                    />

                                    {/* Article Tags Row */}
                                    {articleTags.length > 0 && (
                                          <div className="blog-tags-wrap" aria-label="Article tags">
                                                <span className="blog-tag-label">Tags:</span>
                                                {articleTags.map((tag, idx) => (
                                                      <span key={idx} className="blog-tag-pill">
                                                            #{tag}
                                                      </span>
                                                ))}
                                          </div>
                                    )}

                                    {/* Author Signature Card */}
                                    {/* <div className="blog-author-signature-card">
                                          <div className="blog-signature-avatar" aria-hidden="true">
                                                BFS
                                          </div>
                                          <div className="blog-signature-content">
                                                <div className="blog-signature-badge">
                                                      <HiShieldCheck />
                                                      <span>Engineering Editorial</span>
                                                </div>
                                                <h4 className="blog-signature-name">
                                                      {blogInfo.publisher?.name || "Bright Future Soft Engineering"}
                                                </h4>
                                                <p className="blog-signature-bio">
                                                      We engineer robust software products, high-concurrency cloud architectures, and multiplatform applications. Have questions about scaling your digital platform? Reach out to our engineering squad.
                                                </p>
                                          </div>
                                    </div> */}

                                    {/* Next & Previous Post Navigation */}
                                    {(prevArticle || nextArticle) && (
                                          <nav className="blog-nav-prev-next" aria-label="Article navigation">
                                                {prevArticle ? (
                                                      <Link to={`/blog/${prevArticle.url}`} className="blog-nav-card prev">
                                                            <span className="blog-nav-direction">
                                                                  <HiArrowSmallLeft aria-hidden="true" />
                                                                  <span>Previous Article</span>
                                                            </span>
                                                            <h5 className="blog-nav-title">{prevArticle.title}</h5>
                                                      </Link>
                                                ) : <div />}

                                                {nextArticle && (
                                                      <Link to={`/blog/${nextArticle.url}`} className="blog-nav-card next">
                                                            <span className="blog-nav-direction">
                                                                  <span>Next Article</span>
                                                                  <HiArrowSmallRight aria-hidden="true" />
                                                            </span>
                                                            <h5 className="blog-nav-title">{nextArticle.title}</h5>
                                                      </Link>
                                                )}
                                          </nav>
                                    )}
                              </article>

                              {/* Right Sticky Sidebar */}
                              <aside className="blog-sidebar">
                                    {/* Dynamic Table of Contents (when article has headings) */}
                                    {tableOfContents.length > 1 && (
                                          <div className="blog-toc-box">
                                                <div className="blog-toc-title">
                                                      <HiListBullet />
                                                      <span>Table of Contents</span>
                                                </div>
                                                <ul className="blog-toc-list">
                                                      {tableOfContents.map((item, idx) => (
                                                            <li key={idx} className={`blog-toc-item level-${item.level}`}>
                                                                  <a
                                                                        href={`#${item.id}`}
                                                                        className={`blog-toc-link ${activeSection === item.id ? "active" : ""}`}
                                                                        onClick={(e) => {
                                                                              e.preventDefault();
                                                                              const element = document.getElementById(item.id);
                                                                              if (element) {
                                                                                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                                                                                    setActiveSection(item.id);
                                                                              }
                                                                        }}
                                                                  >
                                                                        {item.text}
                                                                  </a>
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                    )}

                                    {/* Company / Author Info Box */}
                                    <div className="blog-sidebar-box">
                                          <span className="site-eyebrow text-xs">Published By</span>
                                          <h4 className="text-lg font-bold text-[#142235] mt-2 mb-2">
                                                Bright Future Soft
                                          </h4>
                                          <p className="text-sm text-[#55667c] leading-relaxed mb-4">
                                                We engineer enterprise web applications, cross-platform mobile apps, ERP systems, and cloud infrastructure with predictable velocity and 100% IP ownership.
                                          </p>
                                          <button
                                                type="button"
                                                onClick={() => setSchedule(true)}
                                                className="service-btn-primary w-full text-center"
                                          >
                                                Book Engineering Call
                                          </button>
                                    </div>

                                    {/* Trending & Recent Articles */}
                                    {recentSidebarBlogs.length > 0 && (
                                          <div className="blog-sidebar-box">
                                                <h4 className="blog-sidebar-title">Recent Articles</h4>
                                                <ul className="blog-sidebar-recent-list">
                                                      {recentSidebarBlogs.map((b) => (
                                                            <li key={b._id || b.url} className="blog-sidebar-recent-item">
                                                                  <Link to={`/blog/${b.url}`}>
                                                                        <img
                                                                              src={b.img}
                                                                              alt={b.title}
                                                                              className="blog-sidebar-recent-thumb"
                                                                              loading="lazy"
                                                                              onError={(e) => {
                                                                                    e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=60";
                                                                              }}
                                                                        />
                                                                        <div className="blog-sidebar-recent-content">
                                                                              <h5>{b.title}</h5>
                                                                              <span className="blog-sidebar-recent-date">
                                                                                    {b.date ? new Date(b.date).toLocaleDateString('en-US', {
                                                                                          month: 'short',
                                                                                          day: 'numeric'
                                                                                    }) : "Recent"}
                                                                              </span>
                                                                        </div>
                                                                  </Link>
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                    )}

                                    {/* Share Box */}
                                    <div className="blog-sidebar-box">
                                          <h4 className="blog-sidebar-title">Spread The Word</h4>
                                          <p className="text-xs text-[#55667c] mb-3">
                                                Found this article helpful? Share it with colleagues or engineering peers.
                                          </p>
                                          <div className="flex gap-2">
                                                <a
                                                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogInfo.title)}&url=${encodeURIComponent(canonicalUrl)}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="blog-share-btn flex-1"
                                                      title="Share on X"
                                                >
                                                      <FaXTwitter />
                                                </a>
                                                <a
                                                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="blog-share-btn flex-1"
                                                      title="Share on LinkedIn"
                                                >
                                                      <FaLinkedinIn />
                                                </a>
                                                <button
                                                      type="button"
                                                      onClick={handleCopyLink}
                                                      className="blog-share-btn flex-1"
                                                      title="Copy link"
                                                >
                                                      {copied ? <HiCheck className="text-emerald-600" /> : <HiLink />}
                                                </button>
                                          </div>
                                          {copied && (
                                                <span className="text-xs text-emerald-600 font-semibold mt-2 block text-center">
                                                      Link copied to clipboard!
                                                </span>
                                          )}
                                    </div>
                              </aside>
                        </div>
                  </div>

                  {/* Related Articles Section */}
                  {relatedBlogs.length > 0 && (
                        <section className="py-12 mx-auto max-w-7xl " aria-labelledby="related-articles-heading">
                              <div className="flex mx-4 md:mx-0 flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#e1e9f2]">
                                    <div>
                                          <span className="site-eyebrow">Continue Reading</span>
                                          <h2 id="related-articles-heading" className="text-2xl font-bold text-[#142235] mt-1">
                                                Related Engineering Articles
                                          </h2>
                                    </div>
                                    <Link to="/blog" className="text-xs font-bold text-[#0a65b4] hover:underline mt-2 sm:mt-0 flex items-center gap-1">
                                          <span>Explore All Insights</span>
                                          <HiArrowSmallRight aria-hidden="true" />
                                    </Link>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-4 md:mx-0">
                                    {relatedBlogs.map((b) => (
                                          <BlogCart key={b._id || b.url} bData={b} />
                                    ))}
                              </div>
                        </section>
                  )}

                  {/* Consultation CTA Strip */}
                  <div className="max-w-4xl mx-auto px-4 pb-20">
                        <div className="public-contact-cta rounded-lg p-8 sm:p-12 text-center">
                              {teamMembers.length > 0 && (
                                    <div className="relative z-0 flex items-center justify-center -space-x-2 mb-4">
                                          {teamMembers.slice(0, 3).map((member, index) => (
                                                <img
                                                      key={member._id || index}
                                                      className={`relative inline-block object-cover rounded-full w-12 h-12 ring-4 ring-white shadow-sm transition-all duration-300 ${
                                                            index === 2 ? "opacity-90" : "opacity-100"
                                                      }`}
                                                      src={member.image}
                                                      alt={member.name || "Engineering Team Member"}
                                                />
                                          ))}
                                          {teamMembers.length > 3 && (
                                                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#0a65b4] text-white text-xs font-bold ring-4 ring-white shadow-sm">
                                                      +{teamMembers.length - 3}
                                                </div>
                                          )}
                                    </div>
                              )}

                              <h3 className="text-2xl font-bold text-[#142235]">
                                    Have questions about modernizing your technology stack?
                              </h3>
                              <p className="mt-2 text-sm text-[#55667c] max-w-xl mx-auto">
                                    Our software architects help technology leaders evaluate architectural trade-offs, scope custom software builds, and build resilient systems.
                              </p>
                              <div className="mt-6">
                                    <button
                                          type="button"
                                          onClick={() => setSchedule(true)}
                                          className="service-btn-primary"
                                    >
                                          <HiCalendarDays className="text-lg" aria-hidden="true" />
                                          <span>Schedule a Free Technical Consultation</span>
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Consultation Modal */}
                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </main>
      );
};

export default BlogDetails;
