import { HiArrowSmallRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const ProjectCart = ({ allProjectData, stickyTopSpace }) => {
      const { id, name, pic, description, technology = [] } = allProjectData;

      return (
            <article
                  className="sticky mx-auto mt-8 w-[98%] overflow-hidden rounded-md border border-sky-900/80 bg-[#0b1d30] transition duration-200 hover:border-sky-400/60 hover:shadow-xl hover:shadow-slate-950/25 md:w-[90%]"
                  style={{ top: stickyTopSpace }}
            >
                  <div className="grid md:grid-cols-[minmax(220px,0.8fr)_1.2fr]">
                        <div className="overflow-hidden bg-slate-900">
                              <img loading="lazy" src={pic} alt={name} className="h-56 w-full object-cover md:h-full md:min-h-64" />
                        </div>
                        <div className="flex flex-col p-5 sm:p-7">
                              <h2 className="text-xl font-semibold text-white sm:text-2xl">{name}</h2>
                              <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technology used</p>
                                    <ul className="mt-2 flex flex-wrap gap-2">
                                          {technology.map((techData) => (
                                                <li key={techData.id} className="rounded-sm border border-sky-300/30 bg-sky-300/[0.08] px-3 py-1 text-xs text-sky-100">
                                                      {techData.name}
                                                </li>
                                          ))}
                                    </ul>
                              </div>
                              <p className="mt-4 flex-1 pb-6 text-sm leading-6 text-slate-400">{description}</p>
                              <Link to={`/project/${id}`} className="inline-flex w-fit items-center gap-2 rounded-md bg-[#0A65B4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1478cc]">
                                    Details <HiArrowSmallRight aria-hidden="true" />
                              </Link>
                        </div>
                  </div>
            </article>
      );
};

export default ProjectCart;
