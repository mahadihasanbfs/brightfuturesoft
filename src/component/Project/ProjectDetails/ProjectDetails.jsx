import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import MetaTitle, { base_url } from "../../../layout/Title";
import mahadi from "../../../Assctes/teamMember/mahadi.jpg";
import hadi from "../../../Assctes/teamMember/mohotasimhadi.jpeg";

import { useQuery } from "@tanstack/react-query";

const ProjectDetails = () => {
      const [schedule, setSchedule] = useState(false);
      const { id } = useParams();

      const { data: project = {}, isLoading } = useQuery({
            queryKey: ["project_data", id],
            enabled: !!id,
            staleTime: 1000 * 60 * 5, // 5 minutes
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

      useEffect(() => {
            window.scrollTo(0, 0);
      }, []);

      useEffect(() => {
            if (!project?.project_name) return;

            // Title Change
            document.title = `${project.project_name} | Bright Future Soft`;

            // Meta Description
            const metaDescription = document.querySelector("meta[name='description']");
            if (metaDescription) {
                  metaDescription.setAttribute(
                        "content",
                        project?.short_description ||
                        project?.description?.slice(0, 160) ||
                        "Project details by Bright Future Soft",
                  );
            } else {
                  const meta = document.createElement("meta");
                  meta.name = "description";
                  meta.content =
                        project?.short_description ||
                        project?.description?.slice(0, 160) ||
                        "Project details by Bright Future Soft";
                  document.head.appendChild(meta);
            }

            // Open Graph Title
            const ogTitle = document.querySelector("meta[property='og:title']");
            if (ogTitle) {
                  ogTitle.setAttribute("content", project.project_name);
            } else {
                  const meta = document.createElement("meta");
                  meta.setAttribute("property", "og:title");
                  meta.content = project.project_name;
                  document.head.appendChild(meta);
            }

            // Open Graph Image
            if (project?.image_url) {
                  const ogImage = document.querySelector("meta[property='og:image']");
                  if (ogImage) {
                        ogImage.setAttribute("content", project.image_url);
                  } else {
                        const meta = document.createElement("meta");
                        meta.setAttribute("property", "og:image");
                        meta.content = project.image_url;
                        document.head.appendChild(meta);
                  }
            }
      }, [project]);

      const cleanContent = (html) => {
            if (!html) return "";
            return html
                  .replace(/background-color\s*:\s*[^;"]+;?/g, "") // ইনলাইন ব্যাকগ্রাউন্ড কালার মুছবে
                  .replace(/background\s*:\s*[^;"]+;?/g, "") // সব ধরণের ব্যাকগ্রাউন্ড মুছবে
                  .replace(/color\s*:\s*[^;"]+;?/g, ""); // ইনলাইন টেক্সট কালার মুছবে (যাতে BFS ডার্ক মোডে লেখা দেখা যায়)
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
                                    return a.name.localeCompare(b.name); // duplicate hole name diye sort
                              }
                              return Number(a.slot) - Number(b.slot);
                        });
            },
      });

      return (
            <div className="bg-[#1b2030] text-[#8a8a8a] px-2  py-[100px]">
                  {isLoading && <SkeletonLoader />}
                  {!isLoading && (
                        <section className="px-4  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 ">
                              <div className="">
                                    <div className="">
                                          <div className="max-w-4xl">
                                                <h1 className="text-4xl font-bold text-gray-100 sm:text-5xl">
                                                      {project?.project_name}
                                                </h1>
                                                <p className="mt-6 text-base font-medium text-gray-300">
                                                      Publish Date: {project?.date}
                                                </p>
                                          </div>

                                          <div className="mt-8">
                                                <div className="p-2 bg-[#2f4056a1] rounded-xl">
                                                      <img
                                                            loading="lazy"
                                                            decoding="async"
                                                            src={project?.image_url || "/default-image.jpg"}
                                                            alt={
                                                                  project?.project_name
                                                                        ? `${project.project_name} — Project`
                                                                        : "Project image"
                                                            }
                                                            className="rounded-xl"
                                                            onError={(e) => {
                                                                  e.currentTarget.onerror = null;
                                                                  e.currentTarget.src = "/default-image.jpg";
                                                            }}
                                                      />
                                                </div>
                                          </div>

                                          <div className="mt-4 sm:mt-16 flex flex-col-reverse gap-4 lg:grid lg:grid-cols-12 lg:gap-x-16 xl:gap-x-24">
                                                <aside className="lg:col-span-4 lg:order-last lg:self-start lg:sticky lg:top-24">
                                                      <div className="overflow-hidden bg-[#ffffff3d] border border-gray-200 border-opacity-30 rounded">
                                                            <div className="px-4 py-5 sm:p-6">
                                                                  <h4 className="text-xs font-bold tracking-widest text-gray-200 uppercase">
                                                                        We use Technology here
                                                                  </h4>

                                                                  <ul className="mt-8 space-y-5">
                                                                        {project?.technologies?.map((technology) => (
                                                                              <li
                                                                                    key={technology?.name || technology?.id}
                                                                                    className="flex items-center space-x-3"
                                                                              >
                                                                                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5  ">
                                                                                          <img
                                                                                                src={
                                                                                                      technology?.imageUrl ??
                                                                                                      technology?.img ??
                                                                                                      "/default-tech.png"
                                                                                                }
                                                                                                alt={technology?.name || "technology"}
                                                                                                className="w-5 h-5 object-contain"
                                                                                                onError={(e) => {
                                                                                                      e.currentTarget.onerror = null;
                                                                                                      e.currentTarget.src = "/default-tech.png";
                                                                                                }}
                                                                                          />
                                                                                    </div>
                                                                                    <span className="flex text-base font-bold text-gray-300 capitalize ">
                                                                                          {technology?.name}
                                                                                    </span>
                                                                              </li>
                                                                        ))}
                                                                  </ul>
                                                            </div>
                                                      </div>
                                                </aside>
                                                {/* <article className="prose custom-article lg:prose-lg lg:col-span-8 prose-blockquote:lg:text-xl prose-blockquote:lg:leading-9 prose-blockquote:not-italic prose-blockquote:border-none prose-blockquote:text-lg prose-blockquote:leading-8 prose-blockquote:p-0 prose-blockquote:lg:p-0 prose-blockquote:font-medium prose-blockquote:text-gray-900" dangerouslySetInnerHTML={{
                                                __html: project?.description || '',
                                          }} >

                                          </article> */}
                                                <div
                                                      className="prose custom-article lg:prose-lg lg:col-span-8 prose-blockquote:lg:text-xl prose-blockquote:lg:leading-9 prose-blockquote:not-italic prose-blockquote:border-none
    [&_h1]:text-3xl [&_h1]:font-black [&_h1]:mb-6 [&_h1]:text-white
    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-white
    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:text-white
    [&_p]:text-slate-400 [&_p]:leading-relaxed [&_p]:mb-4
    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2
    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2
    [&_li]:marker:text-[#1c65b4] [&_li]:pl-2
    [&_strong]:text-white [&_strong]:font-bold
    [&_a]:text-[#1c65b4] [&_a]:underline"
                                                      dangerouslySetInnerHTML={{
                                                            __html: cleanContent(project?.description),
                                                      }}
                                                />
                                          </div>
                                    </div>
                              </div>

                              <div className="px-4 mt-6  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8  bg-gray-300 rounded-md">
                                    <div className="   text-center ">
                                          <div className=" py-12 ">
                                                <div className=" mx-auto">
                                                      <div className="relative z-0 flex items-center justify-center -space-x-2 ">
                                                            {teamMembers.slice(0, 3).map((member, index) => (
                                                                  <img
                                                                        key={member._id}
                                                                        className={`relative inline-block object-cover rounded-full w-14 h-14 ring-4 ring-gray-100 transition-all duration-300 ${index === 2 ? "opacity-90" : "opacity-100"
                                                                              }`}
                                                                        src={member.image}
                                                                        alt=""
                                                                  />
                                                            ))}

                                                            {teamMembers.length > 3 && (
                                                                  <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gray-400 text-white text-sm font-semibold ring-4 ring-gray-100 opacity-70 backdrop-blur-sm">
                                                                        +{teamMembers.length - 3}
                                                                  </div>
                                                            )}
                                                      </div>

                                                      <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                                                            Contact with us?
                                                      </h3>
                                                      <p className="mt-2 text-base font-normal text-gray-600">
                                                            Do you have any interest to contact us? We are here to help
                                                            you.
                                                      </p>
                                                      <div className="mt-6">
                                                            <button
                                                                  onClick={() => setSchedule(true)}
                                                                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                                                                  role="button"
                                                            >
                                                                  Schedule a call
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>

                              {schedule && (
                                    <CallSchedule setModalOpen={setSchedule} isModalOpen={schedule} />
                              )}
                        </section>
                  )}
            </div>
      );
};

export default ProjectDetails;

const CallSchedule = ({ isModalOpen, setModalOpen }) => {
      if (!isModalOpen) return null; // Modal won't render if it's closed

      return (
            <div className="fixed inset-0 z-50 flex items-center h-screen pt-20 justify-center bg-black bg-opacity-70">
                  <div className="relative mx-6 w-full max-w-4xl  p-4 bg-white rounded-lg shadow-lg">
                        <iframe
                              src="https://calendly.com/brightfuturesoft-bd"
                              title="Calendly Schedule"
                              className="w-full h-[80vh]  rounded-lg    "
                        />

                        <button
                              onClick={() => setModalOpen(false)}
                              className="absolute top-3 bg-[#2463eb] hover:bg-[#315bb6]  size-10 rounded-full right-3 flex justify-center items-center text-gray-100 hover:text-gray-300"
                        >
                              <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="lucide lucide-x"
                              >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                              </svg>
                        </button>
                  </div>
            </div>
      );
};

const SkeletonLoader = () => (
      <div className="px-4  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 ">
            <div className="h-10 bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-5 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-60 bg-gray-700 rounded mb-6"></div>
            <div className="h-5 bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="h-5 bg-gray-600 rounded w-1/4"></div>
      </div>
);

const ImageSkeleton = () => (
      <div className="w-full h-[250px] bg-gray-700 animate-pulse rounded-xl"></div>
);
