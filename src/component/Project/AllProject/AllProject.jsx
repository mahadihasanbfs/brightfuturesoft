import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HiArrowSmallRight } from "react-icons/hi2";
import { base_url } from '../../../layout/Title';
import { CallSchedule } from '../../../pages/shared/Header/Header';

const AllProject = () => {
      const [schedule, setSchedule] = useState(false);
      const [searchValue, setSearchValue] = useState("all");

      const {
            data: project = [],
            isLoading,
      } = useQuery({
            queryKey: ["projects"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/project/get-project`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                        method: "GET",
                  });
                  const data = await res.json();
                  return data.data;
            },
      });

      const searchResults = useMemo(() => {
            if (searchValue === "all") return project;
            return project.filter((obj) =>
                  (obj.projectType || '').toLowerCase().includes(searchValue.toLowerCase())
            );
      }, [searchValue, project]);

      useEffect(() => {
            window.scrollTo(0, 0);

            document.title =
                  "Our Projects & Case Studies | Bright Future Soft";

            const description =
                  "Explore Bright Future Soft’s portfolio of enterprise ERP systems, SaaS platforms, high-performance web applications, and mobile apps engineered in Bangladesh.";

            let metaDescription = document.querySelector("meta[name='description']");
            if (!metaDescription) {
                  metaDescription = document.createElement("meta");
                  metaDescription.name = "description";
                  document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute("content", description);

            let canonical = document.querySelector("link[rel='canonical']");
            if (!canonical) {
                  canonical = document.createElement("link");
                  canonical.setAttribute("rel", "canonical");
                  document.head.appendChild(canonical);
            }
            canonical.setAttribute("href", window.location.href);
      }, []);

      const stripHtmlTags = (html) => {
            if (!html) return '';
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const unwantedTags = ['style', 'title', 'script'];
            unwantedTags.forEach(tag => {
                  const elements = doc.getElementsByTagName(tag);
                  while (elements.length) {
                        elements[0].parentNode.removeChild(elements[0]);
                  }
            });
            return doc.body.textContent || '';
      };

      const getProjectTypeLabel = (type) => {
            if (!type) return "Engineering Project";
            const lower = type.toLowerCase();
            if (lower.includes("app") || lower.includes("erp") || lower.includes("software")) return "Enterprise Software & ERP";
            if (lower.includes("web")) return "Web Platform & SaaS";
            if (lower.includes("ui") || lower.includes("design")) return "UI/UX & Product Design";
            return type;
      };

      const filterCategories = [
            { id: "all", label: "All Projects" },
            { id: "app", label: "Enterprise Software & ERP" },
            { id: "website", label: "Web Platforms & SaaS" },
            { id: "uiDesign", label: "UI/UX & Product Design" },
      ];

      return (
            <div className="all-project-bg">
                  {/* Hero Header */}
                  <section className="projects-page-hero px-4 sm:px-6 lg:px-8" aria-labelledby="projects-page-title">
                        <div className="mx-auto max-w-7xl">
                              <div className="projects-hero-wrap">
                                    <span className="site-eyebrow">Our Work &amp; Case Studies</span>
                                    <h1 id="projects-page-title" className="projects-hero-title">
                                          Engineering systems that power <br className="hidden sm:inline" />
                                          <span>ambitious businesses worldwide.</span>
                                    </h1>
                                    <p className="projects-hero-desc">
                                          Explore our portfolio of custom enterprise ERPs, cloud SaaS applications, cross-platform mobile apps, and custom digital systems built with performance, security, and scalability at their core.
                                    </p>

                                    <div className="projects-hero-trust">
                                          <span>✓</span> 50+ Production Deployments
                                          <span>•</span>
                                          <span>✓</span> 100% Code &amp; IP Ownership
                                          <span>•</span>
                                          <span>✓</span> Zero Proprietary Lock-In
                                    </div>
                              </div>
                        </div>
                  </section>

                  {/* Main Grid Container */}
                  <main className="px-4 pb-24 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                              {/* Filter Bar */}
                              <div className="projects-filter-wrap">
                                    <div className="projects-filter-pills" role="tablist" aria-label="Project categories">
                                          {filterCategories.map((cat) => (
                                                <button
                                                      key={cat.id}
                                                      type="button"
                                                      role="tab"
                                                      aria-selected={searchValue === cat.id}
                                                      onClick={() => setSearchValue(cat.id)}
                                                      className={`projects-filter-btn ${searchValue === cat.id ? 'is-active' : ''}`}
                                                >
                                                      {cat.label}
                                                </button>
                                          ))}
                                    </div>

                                    <div className="projects-count-badge">
                                          Showing {searchResults.length} {searchResults.length === 1 ? 'project' : 'projects'}
                                    </div>
                              </div>

                              {/* Grid */}
                              {isLoading ? (
                                    <div className="projects-grid">
                                          {Array.from({ length: 6 }).map((_, i) => (
                                                <div key={i} className="project-grid-card animate-pulse" aria-hidden="true">
                                                      <div className="h-52 bg-slate-100" />
                                                      <div className="p-6 space-y-3">
                                                            <div className="h-3 w-24 bg-slate-200 rounded" />
                                                            <div className="h-5 w-3/4 bg-slate-200 rounded" />
                                                            <div className="h-3 w-full bg-slate-100 rounded" />
                                                            <div className="h-3 w-2/3 bg-slate-100 rounded" />
                                                      </div>
                                                </div>
                                          ))}
                                    </div>
                              ) : searchResults.length > 0 ? (
                                    <div className="projects-grid">
                                          {searchResults.map((data) => (
                                                <Link
                                                      key={data._id}
                                                      to={`/project/${data?.url}`}
                                                      aria-label={`View project details for ${data?.project_name}`}
                                                      className="project-grid-card group"
                                                >
                                                      <div className="project-card-image-wrap">
                                                            <img
                                                                  loading="lazy"
                                                                  src={data?.image_url || "/default-image.jpg"}
                                                                  alt={data?.project_name || "Project screenshot"}
                                                                  className="project-card-image"
                                                                  onError={(e) => {
                                                                        e.currentTarget.onerror = null;
                                                                        e.currentTarget.src = "/default-image.jpg";
                                                                  }}
                                                            />
                                                      </div>
                                                      <div className="project-card-body">
                                                            <span className="project-card-tag">
                                                                  {getProjectTypeLabel(data?.projectType)}
                                                            </span>
                                                            <h2 className="project-card-title">
                                                                  {data?.project_name}
                                                            </h2>
                                                            <p className="project-card-desc">
                                                                  {stripHtmlTags(data?.description)?.slice(0, 140)}...
                                                            </p>
                                                            <div className="project-card-footer">
                                                                  <span className="project-card-link-text">
                                                                        View case study <HiArrowSmallRight aria-hidden="true" />
                                                                  </span>
                                                            </div>
                                                      </div>
                                                </Link>
                                          ))}
                                    </div>
                              ) : (
                                    <div className="text-center py-16 bg-white border border-[#e1e9f2] rounded p-8">
                                          <p className="text-base text-gray-600 mb-4">No projects found in this category.</p>
                                          <button
                                                type="button"
                                                onClick={() => setSearchValue("all")}
                                                className="site-outline-button"
                                          >
                                                View all projects
                                          </button>
                                    </div>
                              )}

                              {/* Consultation Banner */}
                              <div className="about-faq-cta mt-16">
                                    <span className="site-eyebrow">Start Your Project</span>
                                    <h3 className="text-2xl font-bold text-[#142235] mt-2 mb-3">
                                          Have an enterprise project or platform idea?
                                    </h3>
                                    <p className="text-[#66758A] max-w-xl mx-auto mb-6">
                                          Schedule a 30-minute discovery consultation with our technical team to discuss architecture, timeline, and budget.
                                    </p>
                                    <div className="about-faq-cta-actions">
                                          <button
                                          type="button"
                                          className="hero-primary-btn group"
                                          onClick={() => setSchedule(true)}
                                    >
                                          <span>Book an appointment</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                          <Link to="/contacts" className="site-outline-button">
                                                Send project requirements <span aria-hidden="true">→</span>
                                          </Link>
                                    </div>
                              </div>
                        </div>
                  </main>

                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </div>
      );
};

export default AllProject;
