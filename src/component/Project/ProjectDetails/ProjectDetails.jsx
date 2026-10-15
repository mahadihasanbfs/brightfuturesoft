import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HiArrowSmallRight, HiArrowLeft } from "react-icons/hi2";
import { base_url } from "../../../layout/Title";
import { CallSchedule } from "../../../pages/shared/Header/Header";

const ProjectDetails = () => {
      const [schedule, setSchedule] = useState(false);
      const { id } = useParams();

      const { data: project = {}, isLoading } = useQuery({
            queryKey: ["project_data", id],
            enabled: !!id,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            retry: 2,
            queryFn: async ({ signal }) => {
                  const res = await fetch(
                        `${base_url}/project/get-project-by-id?project_id=${id}`,
                        {
                              method: "GET",
                              headers: {
                                    "content-type": "application/json",
                                    author: "bright_future_soft",
                              },
                              signal,
                        },
                  );
                  if (!res.ok) throw new Error("Failed to fetch project");
                  const data = await res.json();
                  return data.data;
            },
      });

      const liveUrl =
            project?.live_url ||
            project?.live_link ||
            project?.project_url ||
            project?.website_url ||
            project?.preview_url;

      useEffect(() => {
            window.scrollTo(0, 0);
      }, [id]);

      useEffect(() => {
            if (!project?.project_name) return;

            document.title = `${project.project_name} | Case Study | Bright Future Soft`;

            const description =
                  project?.short_description ||
                  "Detailed case study and technical breakdown by Bright Future Soft.";

            let metaDescription = document.querySelector("meta[name='description']");
            if (metaDescription) {
                  metaDescription.setAttribute("content", description);
            } else {
                  const meta = document.createElement("meta");
                  meta.name = "description";
                  meta.content = description;
                  document.head.appendChild(meta);
            }

            let ogTitle = document.querySelector("meta[property='og:title']");
            if (ogTitle) {
                  ogTitle.setAttribute("content", `${project.project_name} — Bright Future Soft`);
            }

            if (project?.image_url) {
                  let ogImage = document.querySelector("meta[property='og:image']");
                  if (ogImage) {
                        ogImage.setAttribute("content", project.image_url);
                  }
            }
      }, [project]);

      const cleanContent = (html) => {
            if (!html) return "";
            try {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, "text/html");

                  // Format all links: ensure target="_blank", rel="noopener noreferrer", and add link class
                  const links = doc.querySelectorAll("a");
                  links.forEach((a) => {
                        a.setAttribute("target", "_blank");
                        a.setAttribute("rel", "noopener noreferrer");
                        a.classList.add("project-desc-link");
                  });

                  // Strip conflicting inline styles that break light design system
                  const allElements = doc.querySelectorAll("*");
                  allElements.forEach((el) => {
                        if (el.style) {
                              el.style.removeProperty("color");
                              el.style.removeProperty("background-color");
                              el.style.removeProperty("background");
                              el.style.removeProperty("font-family");
                        }
                  });

                  return doc.body.innerHTML;
            } catch {
                  return html
                        .replace(/background-color\s*:\s*[^;"]+;?/g, "")
                        .replace(/background\s*:\s*[^;"]+;?/g, "")
                        .replace(/color\s*:\s*[^;"]+;?/g, "")
                        .replace(/font-family\s*:\s*[^;"]+;?/g, "");
            }
      };

      const { data: teamMembers = [] } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(`${base_url}/auth/all`, {
                        headers: {
                              "content-type": "application/json",
                              author: "bright_future_soft",
                        },
                  });
                  const { data } = await res.json();
                  return data
                        .filter((user) => user.slot != null)
                        .sort((a, b) => {
                              if (a.slot === b.slot) {
                                    return a.name.localeCompare(b.name);
                              }
                              return Number(a.slot) - Number(b.slot);
                        });
            },
      });

      return (
            <div className="project-details-page mx-4 md:mx-0 ">
                  <div className="mx-auto max-w-7xl">

                        {isLoading ? (
                              <div className="space-y-6 animate-pulse" aria-hidden="true">
                                    <div className="h-4 w-32 bg-slate-200 rounded" />
                                    <div className="h-10 w-3/4 bg-slate-200 rounded" />
                                    <div className="h-5 w-1/2 bg-slate-100 rounded" />
                                    <div className="h-96 w-full bg-slate-100 rounded-lg" />
                              </div>
                        ) : (
                              <>
                                    {/* Header & Meta */}
                                    <header className="project-details-header">
                                          <span className="site-eyebrow">
                                                {project?.projectType || "Enterprise System"}
                                          </span>
                                          <h1 className="project-details-title">
                                                {project?.project_name}
                                          </h1>

                                          <div className="project-meta-strip">
                                                <div className="project-meta-item">
                                                      <span>Timeline:</span>
                                                      <strong>{project?.date || "Completed"}</strong>
                                                </div>
                                                <div className="project-meta-item">
                                                      <span>Engagement:</span>
                                                      <strong>Dedicated Agile Pod</strong>
                                                </div>
                                                <div className="project-meta-item">
                                                      <span>IP Transfer:</span>
                                                      <strong>100% Client Ownership</strong>
                                                </div>
                                               
                                          </div>

                                          {liveUrl && (
                                                <div className="mt-4">
                                                      <a
                                                            href={liveUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hero-primary inline-flex items-center gap-2 text-xs font-semibold px-4 py-2"
                                                      >
                                                            Visit Live System <span aria-hidden="true">↗</span>
                                                      </a>
                                                </div>
                                          )}
                                    </header>

                                    {/* Featured Image */}
                                    <div className="project-featured-image-box">
                                          <img
                                                src={project?.image_url || "/default-image.jpg"}
                                                alt={project?.project_name ? `${project.project_name} product preview` : "Project screenshot"}
                                                className="project-featured-image"
                                                onError={(e) => {
                                                      e.currentTarget.onerror = null;
                                                      e.currentTarget.src = "/default-image.jpg";
                                                }}
                                          />
                                    </div>

                                    {/* Content Grid */}
                                    <div className="project-details-grid">
                                          {/* Main Column */}
                                          <article className="project-article-body">
                                                <div
                                                      dangerouslySetInnerHTML={{
                                                            __html: cleanContent(project?.description),
                                                      }}
                                                />
                                          </article>

                                          {/* Sidebar */}
                                          <aside className="project-sidebar" aria-label="Project details and specifications">
                                                {/* Tech Stack Card */}
                                                {project?.technologies && project.technologies.length > 0 && (
                                                      <div className="project-sidebar-card">
                                                            <h3 className="project-sidebar-title">Technologies Used</h3>
                                                            <div className="project-tech-list">
                                                                  {project.technologies.map((tech, idx) => (
                                                                        <div key={tech?.name || idx} className="project-tech-pill">
                                                                              <img
                                                                                    src={tech?.imageUrl ?? tech?.img ?? "/default-tech.png"}
                                                                                    alt=""
                                                                                    aria-hidden="true"
                                                                                    onError={(e) => {
                                                                                          e.currentTarget.onerror = null;
                                                                                          e.currentTarget.src = "/default-tech.png";
                                                                                    }}
                                                                              />
                                                                              <span>{tech?.name}</span>
                                                                        </div>
                                                                  ))}
                                                            </div>
                                                      </div>
                                                )}

                                                {/* Specifications Card */}
                                                <div className="project-sidebar-card">
                                                      <h3 className="project-sidebar-title">Engineering Specs</h3>
                                                      <div className="project-specs-list">
                                                            <div className="project-spec-row">
                                                                  <span className="project-spec-key">Architecture</span>
                                                                  <span className="project-spec-val">Cloud-Native</span>
                                                            </div>
                                                           
                                                            <div className="project-spec-row">
                                                                  <span className="project-spec-key">Source Code</span>
                                                                  <span className="project-spec-val">100% Client Owned</span>
                                                            </div>
                                                            <div className="project-spec-row">
                                                                  <span className="project-spec-key">SLA Maintenance</span>
                                                                  <span className="project-spec-val">Active Support</span>
                                                            </div>
                                                            {liveUrl && (
                                                                  <div className="project-spec-row">
                                                                        <span className="project-spec-key">Live Link</span>
                                                                        <span className="project-spec-val">
                                                                              <a
                                                                                    href={liveUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-[#0a65b4] hover:underline font-semibold inline-flex items-center gap-1"
                                                                              >
                                                                                    Visit <span aria-hidden="true">↗</span>
                                                                              </a>
                                                                        </span>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </div>

                                                {/* CTA Card */}
                                                <div className="project-sidebar-card bg-[#f8fbfe] border-[#cbdbee]">
                                                      <h3 className="text-base font-bold text-[#142235] mb-2">
                                                            Need a similar solution?
                                                      </h3>
                                                      <p className="text-xs text-[#66758A] leading-relaxed mb-4">
                                                            Our engineering architects can help design, build, and deploy an enterprise platform tailored to your workflows.
                                                      </p>
                                                      {/* <button
                                                            type="button"
                                                            onClick={() => setSchedule(true)}
                                                            className="hero-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 mb-2"
                                                      >
                                                            Schedule a consultation
                                                            <HiArrowSmallRight aria-hidden="true" />
                                                      </button> */}

                                                          <button
                                          type="button"
                                          className="hero-primary-btn group w-full mb-2"
                                          onClick={() => setSchedule(true)}
                                    >
                                          <span>Book an appointment</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>

                                                      <Link
                                                            to="/contacts"
                                                            className="px-4 py-2.5 border border-[#bfd0e0]  font-semibold text-[13px] font-weight: 650; transition: .2s ease; w-full mx-auto text-xs py-2.5 text-center block"
                                                      >
                                                            Send project brief
                                                      </Link>
                                                </div>
                                          </aside>
                                    </div>

                                    {/* Bottom Consultation Banner */}
                                    <div className="about-faq-cta mt-16">
                                          <div className="flex items-center justify-center -space-x-2 mb-3">
                                                {teamMembers.slice(0, 3).map((member) => (
                                                      <img
                                                            key={member._id}
                                                            className="relative inline-block h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                            src={member.image}
                                                            alt={member.name || "Engineering team member"}
                                                            loading="lazy"
                                                      />
                                                ))}
                                                {teamMembers.length > 3 && (
                                                      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0a65b4] text-xs font-semibold text-white ring-2 ring-white">
                                                            +{teamMembers.length - 3}
                                                      </div>
                                                )}
                                          </div>
                                          <h3 className="text-2xl font-bold text-[#142235] mt-2 mb-2">
                                                Have questions about our engineering capabilities?
                                          </h3>
                                          <p className="text-[#66758A] max-w-xl mx-auto mb-6">
                                                Talk directly with our development team in Dhaka to discuss technical architecture, feasibility, and timelines.
                                          </p>
                                          <div className="about-faq-cta-actions">
                                                {/* <button
                                                      type="button"
                                                      onClick={() => setSchedule(true)}
                                                      className="hero-primary group inline-flex items-center gap-2 px-4 py-2.5 border border-[#bfd0e0]  font-semibold text-[13px] font-weight: 650; transition: .2s ease; text-xs py-2.5 text-center"
                                                >
                                                      Schedule a consultation
                                                      <HiArrowSmallRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                                </button> */}

                                                 <button
                                          type="button"
                                          className="hero-primary-btn group"
                                          onClick={() => setSchedule(true)}
                                    >
                                          <span>Schedule a consultation</span>
                                          <HiArrowSmallRight className="text-lg transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </button>
                                                <Link to="/contacts" className="site-outline-button">
                                                      Contact our team <span aria-hidden="true">→</span>
                                                </Link>
                                          </div>
                                    </div>
                              </>
                        )}
                  </div>

                  {schedule && (
                        <CallSchedule isModalOpen={schedule} setModalOpen={setSchedule} />
                  )}
            </div>
      );
};

export default ProjectDetails;
