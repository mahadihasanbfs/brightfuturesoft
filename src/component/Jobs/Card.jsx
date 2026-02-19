import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ data }) => {

      return (
            <div className=''>


                  <div className=''>
                        <div className='lg:grid grid-cols-3 text-white justify-center border border-gray-500 items-center py-6 px-6 rounded'>
                              <h1 className='text-2xl  pl-8'>{data.job_position}</h1>
                              <div className='flex gap-4 justify-start pl-8 mt-4 md:mt-0 md:pl-0 md:justify-end '>
                                    <p>{data.job_type}</p>
                                    <span className='font-extrabold'>-</span>
                                    <p>{data.workplace}</p>
                              </div>
                              <div className='flex pl-8 md:pl-0 lg:justify-end mt-4 md:mt-0'>
                                    <Link

                                          className="group rounded flex items-center justify-center gap-4 w-40 border border-[#1c65b4] bg-[#1c65b4] px-10 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                          to={data._id}
                                    >
                                          <span
                                                className="font-medium text-white transition-colors text-center group-hover:text-[#1c65b4] group-active:text-indigo-500"
                                          >
                                                Apply
                                          </span>


                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default JobCard;
