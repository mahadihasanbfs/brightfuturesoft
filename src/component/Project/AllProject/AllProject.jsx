import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProjectCart from '../ProjectCart/ProjectCart';
import MetaTitle, { base_url } from '../../../layout/Title';
import moduleName from '../../../Assctes/logo.png';
import { useQuery } from '@tanstack/react-query';

const AllProject = () => {

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
                  })
                  const data = await res.json()
                  return data.data
            },
      })


      // const stickyTopSpace = 50;
      const [searchValue, setSearchValue] = useState("all");

      const searchResults = useMemo(() => {
            if (searchValue === "all") return project;
            return project.filter((obj) => (obj.projectType || '').toLowerCase().includes(searchValue.toLowerCase()));
      }, [searchValue, project]);


     useEffect(() => {
      window.scrollTo(0, 0);

      document.title =
            "Bright Future Soft | Our Projects ";

      const description =
            "Explore Bright Future Soft’s portfolio of ERP systems, SaaS platforms, web applications, mobile apps, and UI/UX design projects delivered for startups, SMEs, and enterprises in Bangladesh.";

      const keywords =
            "Software Projects Bangladesh, ERP Projects, SaaS Portfolio, Web Development Portfolio, Mobile App Projects, UI UX Design Projects, Bright Future Soft";

      // Meta Description
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Meta Keywords
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
            metaKeywords = document.createElement("meta");
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);

      // OG Title
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
            ogTitle = document.createElement("meta");
            ogTitle.setAttribute("property", "og:title");
            document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute(
            "content",
            "Our Projects - Bright Future Soft"
      );

      // OG Description
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
            ogDesc = document.createElement("meta");
            ogDesc.setAttribute("property", "og:description");
            document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);

      // OG Image (Logo or Banner)
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
            ogImage = document.createElement("meta");
            ogImage.setAttribute("property", "og:image");
            document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", "https://yourdomain.com/logo.png");

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);

}, []);
      const stripHtmlTags = (html) => {
            // Create a new DOM parser
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // Remove unwanted elements (style, title, etc.)
            const unwantedTags = ['style', 'title'];
            unwantedTags.forEach(tag => {
                  const elements = doc.getElementsByTagName(tag);
                  while (elements.length) {
                        elements[0].parentNode.removeChild(elements[0]);
                  }
            });

            // Get plain text from the document body
            return doc.body.textContent || '';
      };



      return (
            <div className="md:py-20 all-project-bg ">

                  <div className="px-1 pt-1 pb-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[80%] w-[95%] mt-5">
                        <div className="p-banner px-4 py-[110px]" align="center">
                              <h1 className='text-4xl font-bold text-white'>Our Projects</h1>
                              <p className='text-sm'>Do you have an any project idea ?</p>
                              <br /><br />

                              <div className='w-48'>
                                    <Link
                                          className="group flex items-center justify-center gap-4  border border-indigo-600 bg-indigo-600 px-10 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                          to='/contacts'
                                    >
                                          <span
                                                className="font-medium text-white transition-colors group-hover:text-indigo-600 group-active:text-indigo-500"
                                          >
                                                Contract Us
                                          </span>


                                    </Link>
                              </div>
                        </div>
                        <div className="flex justify-between mt-8 border-b border-[#ffffff2f] pb-3">
                              {/* <h4 className="font-bold whitespace-nowrap text-lg text-blue-500">All Projects</h4> */}
                              <ul className="flex whitespace-nowrap gap-8 overflow-x-auto  md:w-full items-center px-4">
                                    <li>
                                          <button onClick={() => setSearchValue("all")} className={`duration-200 cursor-pointer capitalize hover:text-blue-500 ${searchValue == 'all' ? 'text-blue-500' : 'text-gray-300'}`}>All Projects</button>
                                    </li>
                                    <li>
                                          <button onClick={() => setSearchValue("website")} className={`duration-200 cursor-pointer capitalize hover:text-blue-500 ${searchValue == 'website' ? 'text-blue-500' : 'text-gray-300'}`}>website</button>
                                    </li>
                                    <li>
                                          <button onClick={() => setSearchValue("app")} className={`duration-200 cursor-pointer capitalize hover:text-blue-500 ${searchValue == 'app' ? 'text-blue-500' : "text-gray-300"}`}>Software</button>
                                    </li>
                                    <li>
                                          <button onClick={() => setSearchValue("uiDesign")} className={`duration-200 cursor-pointer capitalize hover:text-blue-500 ${searchValue == 'uiDesign' ? 'text-blue-500' : 'text-gray-300'}`}>UI/UX design</button>
                                    </li>
                              </ul>
                        </div>
                        <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-col-1 gap-10 mt-10'>

                              {
                                    isLoading
                                          ? Array.from({ length: 6 }).map((_, i) => (
                                                <div
                                                      key={i}
                                                      className="overflow-hidden rounded-lg h-96 bg-gray-900 "
                                                >
                                                      <div className="flex flex-col justify-center w-full h-full px-8 py-4 backdrop-blur-sm bg-gray-800/20">
                                                            <div className="mt-20 h-6 w-2/3 bg-gray-400 rounded mb-4"></div>
                                                            <div className="mt-2 h-4 w-full bg-gray-400 rounded"></div>
                                                      </div>
                                                </div>
                                          ))
                                          : searchResults?.map(data =>
                                                <Link key={data._id} to={`/project/${data?.url}`}
                                                      className="overflow-hidden bg-cover rounded-lg cursor-pointer h-96 group"
                                                      style={{
                                                            backgroundImage:
                                                                  `url(${data?.image_url})`
                                                      }}
                                                >
                                                      <div className="flex flex-col justify-center w-full h-full px-8 py-4 transition-opacity duration-700 opacity-0 backdrop-blur-xs bg-gray-800/70 group-hover:opacity-100">
                                                            <h2 className="mt-20 text-xl font-semibold text-white capitalize">
                                                                  {data?.project_name}
                                                            </h2>
                                                            <div className="mt-2  tracking-wider text-gray-400 ">
                                                                  {stripHtmlTags(data?.description)?.slice(0, 100)}...{' '}<Link className="text-white" to={`/project/${data?.url}`}> More</Link>
                                                            </div>
                                                      </div>
                                                </Link>


                                          )
                              }

                        </div>
                  </div>
            </div>
      );
};

export default AllProject;
