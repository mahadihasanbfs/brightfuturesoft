import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Cards/Card';
import Title, { base_url } from '../../../layout/Title';
import { useQuery } from '@tanstack/react-query';

const Project = () => {

      const { data: project = [], refetch, isLoading } = useQuery({
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
            <div className='px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8'>

                  <h1 className="text-xl  font-bold relative after:absolute after:left-0 after:right-0 after:bottom-[-18px] after:w-[60px] after:rounded-full after:h-[6px] after:bg-[#0095ff] after:mx-auto text-center text-white">Our <span className="shadow-tx">Projects</span></h1>

                  <div className=" mt-20 grid lg:grid-cols-3 md:grid-cols-2 grid-col-1 gap-8 ">
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
                  <div className="flex items-center justify-center">
                        <Link to="/all_project" className='mx-auto border border-[#005eff] px-5 py-2 duration-200 hover:text-[#64beff] hover:bg-[#005eff4b] mt-14 rounded-lg text-[#2b79ff] md:shadow shadow-blue-700'>See more</Link>
                  </div>
            </div>
      );
};

export default Project;


const SkeletonCard = () => (
      <div className="relative overflow-hidden bg-gray-800/60 rounded-lg cursor-wait h-96 group">
            <div className="absolute inset-0 transition-opacity duration-700 opacity-0 backdrop-blur-sm bg-gray-800/60 group-hover:opacity-100">
                  <div className="flex flex-col justify-center w-full h-full px-8 py-4">
                        <div className="mt-20 h-6 bg-gray-800/40 rounded-md w-3/4 "></div>
                        <div className="mt-2 space-y-2">
                              <div className="h-4 bg-gray-800/40 rounded-md "></div>
                              <div className="h-4 bg-gray-800/40 rounded-md "></div>
                              <div className="h-4 bg-gray-800/40 rounded-md w-2/3"></div>
                        </div>
                  </div>
            </div>
      </div>
)
