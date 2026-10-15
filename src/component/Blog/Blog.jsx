import { useEffect, useState, useMemo } from 'react';
import { 
      HiMagnifyingGlass, 
      HiXMark, 
      HiClock, 
      HiArrowSmallRight, 
      HiSparkles,
      HiCalendarDays
} from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import BlogCart from './BlogCart/BlogCart';
import { base_url } from '../../layout/Title';
import moduleName from '../../Assctes/logo.png';
import { CallSchedule } from '../../pages/shared/Header/Header';

const Blog = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedCategory, setSelectedCategory] = useState("all");
      const [schedule, setSchedule] = useState(false);

      // Caching: use dedicated queryKey ["public_blogs"] with 15 min staleTime
      const {
            data: blogs = [],
            isLoading,
      } = useQuery({
            queryKey: ["public_blogs"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/blog/get-blog`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        method: "GET",
                  });
                  const json = await res.json();
                  return json?.data || [];
            },
            staleTime: 1000 * 60 * 15, // 15 minutes fresh cache
            cacheTime: 1000 * 60 * 60, // 1 hour memory persistence
            refetchOnWindowFocus: false,
      });

      useEffect(() => {
            window.scrollTo(0, 0);

            // SEO Metadata
            document.title = "Engineering Blog & Tech Insights | Bright Future Soft";

            const description = "Discover software engineering best practices, cloud architecture patterns, microservices, mobile app development, and tech leadership from Bright Future Soft.";
            const keywords = "Software Engineering Blog, Web Development, Cloud Architecture, Microservices, DevOps, Flutter, React, Next.js, Bright Future Soft";

            // Meta Description
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                  metaDesc = document.createElement("meta");
                  metaDesc.name = "description";
                  document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", description);

            // Meta Keywords
            let metaKeywords = document.querySelector("meta[name='keywords']");
            if (!metaKeywords) {
                  metaKeywords = document.createElement("meta");
                  metaKeywords.name = "keywords";
                  document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute("content", keywords);

            // Canonical Link
            const canonicalUrl = "https://brightfuturesoft.com/blog";
            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                  canonical = document.createElement("link");
                  canonical.setAttribute("rel", "canonical");
                  document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", canonicalUrl);

            // OG Title
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (!ogTitle) {
                  ogTitle = document.createElement("meta");
                  ogTitle.setAttribute("property", "og:title");
                  document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute("content", "Engineering Blog & Tech Insights | Bright Future Soft");

            // OG Description
            let ogDesc = document.querySelector("meta[property='og:description']");
            if (!ogDesc) {
                  ogDesc = document.createElement("meta");
                  ogDesc.setAttribute("property", "og:description");
                  document.head.appendChild(ogDesc);
            }
            ogDesc.setAttribute("content", description);

            // OG Image
            let ogImage = document.querySelector("meta[property='og:image']");
            if (!ogImage) {
                  ogImage = document.createElement("meta");
                  ogImage.setAttribute("property", "og:image");
                  document.head.appendChild(ogImage);
            }
            ogImage.setAttribute("content", moduleName);

            // Schema.org Structured Data (Blog + ItemList)
            const schemaData = {
                  "@context": "https://schema.org",
                  "@graph": [
                        {
                              "@type": "Blog",
                              "@id": "https://brightfuturesoft.com/blog",
                              "url": "https://brightfuturesoft.com/blog",
                              "name": "Bright Future Soft Engineering Blog",
                              "description": description,
                              "publisher": {
                                    "@type": "Organization",
                                    "name": "Bright Future Soft",
                                    "url": "https://brightfuturesoft.com",
                                    "logo": "https://brightfuturesoft.com/assets/logo.png"
                              }
                        },
                        {
                              "@type": "ItemList",
                              "name": "Latest Engineering Articles",
                              "itemListElement": (blogs || []).slice(0, 10).map((article, idx) => ({
                                    "@type": "ListItem",
                                    "position": idx + 1,
                                    "item": {
                                          "@type": "BlogPosting",
                                          "headline": article.title,
                                          "url": `https://brightfuturesoft.com/blog/${article.url}`,
                                          "datePublished": article.date,
                                          "image": article.img,
                                          "description": article.meta_description?.slice(0, 150)
                                    }
                              }))
                        }
                  ]
            };

            let scriptTag = document.getElementById("blogs-page-schema-jsonld");
            if (!scriptTag) {
                  scriptTag = document.createElement("script");
                  scriptTag.id = "blogs-page-schema-jsonld";
                  scriptTag.type = "application/ld+json";
                  document.head.appendChild(scriptTag);
            }
            scriptTag.text = JSON.stringify(schemaData);

            return () => {
                  const tag = document.getElementById("blogs-page-schema-jsonld");
                  if (tag) tag.remove();
            };
      }, [blogs]);

      // Category extraction from articles
      const categories = useMemo(() => {
            const list = ["all"];
            blogs.forEach(b => {
                  if (b.meta_tag) {
                        const tags = b.meta_tag.split(",").map(t => t.trim());
                        tags.forEach(t => {
                              if (t && !list.includes(t.toLowerCase()) && list.length < 8) {
                                    list.push(t);
                              }
                        });
                  }
            });
            return list;
      }, [blogs]);

      // Filtered articles
      const filteredBlogs = useMemo(() => {
            return blogs.filter(b => {
                  const matchesSearch = searchTerm.trim() === "" ||
                        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.meta_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.meta_tag?.toLowerCase().includes(searchTerm.toLowerCase());

                  const matchesCategory = selectedCategory === "all" ||
                        (b.meta_tag && b.meta_tag.toLowerCase().includes(selectedCategory.toLowerCase()));

                  return matchesSearch && matchesCategory;
            });
      }, [blogs, searchTerm, selectedCategory]);

      // Featured first article (when no active search/category filter)
      const featuredArticle = useMemo(() => {
            if (searchTerm === "" && selectedCategory === "all" && filteredBlogs.length > 0) {
                  return filteredBlogs[0];
            }
            return null;
      }, [filteredBlogs, searchTerm, selectedCategory]);

      // Remaining articles for the grid
      const gridArticles = useMemo(() => {
            if (featuredArticle) {
                  return filteredBlogs.slice(1);
            }
            return filteredBlogs;
      }, [filteredBlogs, featuredArticle]);

      return (
            <main className="mx-4 md:mx-0">
                  {/* Header / Hero Section */}
                  <header className="max-w-7xl mx-auto py-20 text-center">
                        <div className="blogs-hero-inner">
                              <span className="site-eyebrow">Engineering Insights & Research</span>
                              <h1 className="blogs-hero-title">
                                    Software Architecture, Cloud & <span>Engineering Insights</span>
                              </h1>
                              <p className="blogs-hero-subtitle">
                                    In-depth case studies, architectural benchmarks, modern web patterns, and leadership perspectives authored by the engineering team at Bright Future Soft.
                              </p>
                        </div>
                  </header>

                  {/* Search and Category Filter Bar */}
                  <div className="max-w-7xl mx-auto">
                        <div className="blogs-filter-box">
                              <div className="blogs-search-row">
                                    <div className="blogs-search-input-wrap">
                                          <HiMagnifyingGlass className="blogs-search-icon" aria-hidden="true" />
                                          <input
                                                type="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search articles by title, topic, or technology..."
                                                className="blogs-search-input"
                                                aria-label="Search blog articles"
                                          />
                                          {searchTerm && (
                                                <button
                                                      type="button"
                                                      onClick={() => setSearchTerm("")}
                                                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                                                      aria-label="Clear search input"
                                                >
                                                      <HiXMark className="w-5 h-5" />
                                                </button>
                                          )}
                                    </div>
                              </div>

                              {categories.length > 1 && (
                                    <div className="blogs-category-pills" aria-label="Filter by category">
                                          {categories.map((cat, idx) => (
                                                <button
                                                      key={idx}
                                                      type="button"
                                                      onClick={() => setSelectedCategory(cat)}
                                                      className={`blogs-cat-btn ${selectedCategory === cat ? "active" : ""}`}
                                                >
                                                      {cat === "all" ? "All Articles" : cat}
                                                </button>
                                          ))}
                                    </div>
                              )}
                        </div>
                  </div>

                  {/* Main Articles Content Area */}
                  <div className="max-w-7xl mx-auto mt-8">
                        {isLoading ? (
                              /* Skeleton Loading State */
                              <div className="blogs-grid">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                          <article key={i} className="animate-pulse bg-white border border-[#e1e9f2] rounded-md overflow-hidden">
                                                <div className="aspect-[16/10] w-full bg-slate-200"></div>
                                                <div className="p-6 space-y-3">
                                                      <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                                                      <div className="h-5 w-4/5 bg-slate-200 rounded"></div>
                                                      <div className="h-3 w-full bg-slate-100 rounded"></div>
                                                      <div className="h-3 w-2/3 bg-slate-100 rounded"></div>
                                                </div>
                                          </article>
                                    ))}
                              </div>
                        ) : filteredBlogs.length === 0 ? (
                              /* Empty Search State */
                              <div className="blogs-empty-state">
                                    <div className="blogs-empty-icon" aria-hidden="true">
                                          <HiMagnifyingGlass />
                                    </div>
                                    <h3>No Articles Found</h3>
                                    <p>
                                          We couldn't find any articles matching "{searchTerm}". Try searching with different keywords or reset your category filter.
                                    </p>
                                    <button
                                          type="button"
                                          onClick={() => {
                                                setSearchTerm("");
                                                setSelectedCategory("all");
                                          }}
                                          className="service-btn-primary"
                                    >
                                          Reset Filters
                                    </button>
                              </div>
                        ) : (
                              <>
                                    {/* Featured First Article Showcase */}
                                    {featuredArticle && (
                                          <Link
                                                to={`/blog/${featuredArticle.url}`}
                                                className="blogs-featured-card"
                                                aria-label={`Featured: ${featuredArticle.title}`}
                                          >
                                                <div className="blogs-featured-media">
                                                      <img
                                                            src={featuredArticle.img}
                                                            alt={`${featuredArticle.title} - Featured Article`}
                                                            loading="eager"
                                                            onError={(e) => {
                                                                  e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80";
                                                            }}
                                                      />
                                                </div>
                                                <div className="blogs-featured-body">
                                                      <span className="blogs-featured-badge">
                                                            <HiSparkles aria-hidden="true" />
                                                            <span>Featured Article</span>
                                                      </span>
                                                      <h2 className="blogs-featured-title">
                                                            {featuredArticle.title}
                                                      </h2>
                                                      <p className="blogs-featured-excerpt">
                                                            {featuredArticle.meta_description?.slice(0, 220)}...
                                                      </p>
                                                      <div className="blogs-featured-meta">
                                                            <span>
                                                                  <HiCalendarDays aria-hidden="true" />
                                                                  {featuredArticle.date ? new Date(featuredArticle.date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                  }) : "Recently Published"}
                                                            </span>
                                                            <span>
                                                                  <HiClock aria-hidden="true" />
                                                                  5 min read
                                                            </span>
                                                      </div>
                                                      <div className="blogs-featured-action">
                                                            <span>Read Complete Article</span>
                                                            <HiArrowSmallRight aria-hidden="true" />
                                                      </div>
                                                </div>
                                          </Link>
                                    )}

                                    {/* Articles Grid */}
                                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e1e9f2]">
                                          <h2 className="text-xl font-bold text-[#142235]">
                                                {selectedCategory === "all" ? "All Published Articles" : `${selectedCategory} Articles`}
                                          </h2>
                                          <span className="text-xs font-semibold text-[#728296]">
                                                Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
                                          </span>
                                    </div>

                                    <div className="blogs-grid">
                                          {gridArticles.map(article => (
                                                <BlogCart key={article._id || article.url} bData={article} />
                                          ))}
                                    </div>
                              </>
                        )}

                        {/* Consultation Strip */}
                        <div className="service-consultation-strip mt-16">
                              <h3>Want to build something extraordinary?</h3>
                              <p>
                                    Our senior engineers and software architects are ready to help you plan, design, and develop scalable digital products.
                              </p>
                              <button
                                    type="button"
                                    onClick={() => setSchedule(true)}
                                    className="service-consultation-btn"
                              >
                                    <HiCalendarDays className="text-xl" aria-hidden="true" />
                                    <span>Schedule a Technical Consultation</span>
                              </button>
                        </div>
                  </div>

                  {/* Consultation Booking Modal */}
                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </main>
      );
};

export default Blog;
