import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Cards/Card';
import { base_url } from '../../../layout/Title';
import { useQuery } from '@tanstack/react-query';

const Project = () => {

      const { data: project = [], isLoading } = useQuery({
            queryKey: ["project_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/project/get-project`,
                        {
                              headers: {
                                    'content-type': 'application/json',
                                    'author': 'bright_future_soft'
                              },
                              method: 'GET',
                        }
                  );
                  const data = await res.json();
                  return data.data;
            },
      });
      const stickyTopSpace = 50;

      useEffect(() => {
            window.scrollTo(0, 0);
      }, []);



      return (
            <section className="projects-section work-bg px-4 py-20 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="projects-heading">
            <div className='mx-auto max-w-7xl'>

                  <div className="section-heading-row">
                        <div><span className="site-eyebrow">Selected work</span><h2 id="projects-heading">Ideas made<br /><span>real in the world.</span></h2></div>
                        <p>A selection of digital products and platforms we have helped bring to life.</p>
                  </div>

                  <div className="mt-12 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
                        {
                              isLoading ?
                                    Array(3).fill(null).map((_, index) => (
                                          <SkeletonCard key={index} />
                                    ))
                                    :
                                    project.length && project?.slice(0, 3).map((prj, index) => (
                                          <Card key={prj._id} data={prj} stickyTopSpace={stickyTopSpace * (index + 1)} />
                                    ))
                        }

                  </div>
                  <div className="mt-10 flex items-center justify-center">
                        <Link to="/all_project" className='site-outline-button'>Explore all projects <span aria-hidden="true">↗</span></Link>
                  </div>
            </div>
            </section>
      );
};

export default Project;


const SkeletonCard = () => (
      <div className="project-card cursor-wait" aria-hidden="true">
            <div className="h-52 animate-pulse bg-slate-100" />
            <div className="space-y-3 p-5">
                  <div className="h-3 w-24 animate-pulse bg-slate-100" />
                  <div className="h-5 w-3/4 animate-pulse bg-slate-100" />
                  <div className="h-3 w-full animate-pulse bg-slate-100" />
                  <div className="h-3 w-2/3 animate-pulse bg-slate-100" />
            </div>
      </div>
)
