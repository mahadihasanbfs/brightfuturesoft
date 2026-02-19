import React, { useState } from 'react';
import Link_Button from '../../shared/Link_Button';
import DeleteModal from '../../../Hook/DeleteModal';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { base_url } from '../../../layout/Title';
import { Link } from 'react-router-dom';
import JoditEditor from 'jodit-react';

const JobManagement = () => {

      const { data: job_data = [], refetch, isLoading } = useQuery({
            queryKey: ["job_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/job-post/all-job`,
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





      const [deleteId, setDeletId] = useState("");
      const [deletePopUp, setDeletePopUp] = useState(false);
      const [isDelete, setIsDelete] = useState(false);
      const [edit_job, setEditJob] = useState(false);

      const delete_meeting = (id) => {
            setDeletePopUp(true);
            setDeletId(id);
      };

      if (isDelete) {
            fetch(`${base_url}/job-post/delete-job?job_post_id=${deleteId}`, {
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  method: 'DELETE'
            }).then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              Swal.fire(data.message, ' ', 'success')
                              refetch()
                              setIsDelete(false);
                              setDeletId("");
                        }
                        else {
                              Swal.fire(data.message, '', 'info')
                        }
                  })

      }



      const jobForm = (e) => {
            e.preventDefault();
            const form = e.target;
            const job_position = form.job_position.value
            const job_type = form.job_type.value
            const workplace = form.workplace.value
            const vacancy = form.vacancy.value
            const description = form.description.value
            const last_date = form.last_date.value
            const jobData = {
                  job_position,
                  job_type,
                  workplace,
                  vacancy,
                  description,
                  dateline: last_date
            }

            fetch(`${base_url}/job-post/update-job?job_post_id=${edit_job._id}`, {
                  method: 'PUT',
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(jobData),
            })
                  .then((res) => res.json())
                  .then((data) => {
                        Swal.fire('Job Post Update Successfully', ' ', 'success')
                        form.reset()
                        setEditJob(false)
                        refetch()

                  })

      }




      return (
            <div>
                  <div class="py-12  sm:py-16 lg:py-12">
                        <div class="px-4  sm:px-6 lg:px-8">
                              <Link_Button name={'Add New Job Post'} url={'/dashboard/job-management/new'} />
                              <div class=" ">
                                    <div class="overflow-hidden rounded-xl">
                                          <div class="py-6">
                                                <div class="sm:flex sm:items-start sm:justify-between ">
                                                      <div>
                                                            <p class="text-lg font-bold text-gray-100">Job Post Management</p>
                                                            <p class="mt-1 text-sm font-medium text-gray-500">Here is all job information</p>
                                                      </div>


                                                </div>

                                          </div>

                                          <div className="h-0 w-0">
                                                {" "}
                                                <DeleteModal
                                                      setOpenModal={setDeletePopUp}
                                                      OpenModal={deletePopUp}
                                                      setIsDelete={setIsDelete}
                                                />
                                          </div>

                                          {isLoading ? (
                                                // Skeleton Loader
                                                <div className="">
                                                      <div className="flow-root mt-8">
                                                            <div className="-my-5 divide-y divide-gray-200 overflow-x-auto">
                                                                  <table className="min-w-full divide-y divide-gray-700 overflow-x-auto">
                                                                        <thead className="bg-gray-800">
                                                                              <tr>
                                                                                    {['Job Position', 'Job Type', 'Workplace', 'Vacancy', 'Deadline', 'Application', 'Actions'].map((head) => (
                                                                                          <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">{head}</th>
                                                                                    ))}
                                                                              </tr>
                                                                        </thead>
                                                                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                                                                              {[...Array(5)].map((_, i) => (
                                                                                    <tr key={i} className="py-2 divide-y divide-gray-800">
                                                                                          {[...Array(7)].map((_, idx) => (
                                                                                                <td key={idx} className="px-6 py-4">
                                                                                                      <div className="h-4 bg-gray-700 rounded w-4/5"></div>
                                                                                                </td>
                                                                                          ))}
                                                                                    </tr>
                                                                              ))}
                                                                        </tbody>
                                                                  </table>
                                                            </div>
                                                      </div>
                                                </div>
                                          ) : (
                                                <div className="flow-root mt-8">
                                                      <div className="divide-y divide-gray-200 overflow-x-auto">
                                                            <table className="min-w-full divide-y divide-gray-700 overflow-x-auto">
                                                                  <thead className="bg-gray-800">
                                                                        <tr>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Job Position</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Job Type</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Workplace</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Vacancy</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Deadline</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Application</th>
                                                                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                                                        </tr>
                                                                  </thead>
                                                                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                                                                        {job_data?.map((job) => (
                                                                              <tr key={job._id} className="py-2 divide-y divide-gray-800">
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100">{job?.job_position}</td>
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100">{job?.job_type}</td>
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-100">{job?.workplace}</td>
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{job?.vacancy}</td>
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{new Date(job?.dateline).toDateString()}</td>
                                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                                                                                          <Link
                                                                                                to={`/dashboard/job-management/apply_list?job_post_id=${job._id}`}
                                                                                                title="See Applications"
                                                                                                className="text-sm font-medium text-blue-400 transition-all duration-200 hover:text-blue-500"
                                                                                          >
                                                                                                Application List: {job.application_count ?? 0}
                                                                                          </Link>
                                                                                    </td>
                                                                                    <td className="px-6 py-4  text-sm text-gray-100">
                                                                                          <div className="flex gap-3 items-center">
                                                                                                <button
                                                                                                      onClick={() => setEditJob(job)}
                                                                                                      type="button"
                                                                                                      className="inline-flex whitespace-nowrap items-center justify-center px-4 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-[#1c65b4] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
                                                                                                >
                                                                                                      Edit
                                                                                                </button>
                                                                                                <button
                                                                                                      onClick={() => delete_meeting(job._id)}
                                                                                                      type="button"
                                                                                                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold leading-5 text-white transition-all duration-200 bg-red-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-red-700"
                                                                                                >
                                                                                                      Delete
                                                                                                </button>
                                                                                          </div>
                                                                                    </td>
                                                                              </tr>
                                                                        ))}
                                                                  </tbody>
                                                            </table>

                                                            {/* Edit Modal */}
                                                            {edit_job && (
                                                                  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
                                                                        <div className="bg-gray-900 border border-gray-700 text-white rounded-lg shadow-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                              <form onSubmit={jobForm} className="w-full">
                                                                                    <div className="flex justify-between items-center mb-4">
                                                                                          <h1 className="text-2xl font-bold text-white">Edit Job Post</h1>
                                                                                          <div className=''>
                                                                                                <button
                                                                                                      type="button"
                                                                                                      onClick={() => setEditJob(false)}
                                                                                                      className="text-white text-2xl font-bold hover:text-red-500 border border-gray-700 px-2 rounded hover:bg-gray-500"
                                                                                                >
                                                                                                      &times;
                                                                                                </button>
                                                                                          </div>
                                                                                    </div>

                                                                                    <input
                                                                                          defaultValue={edit_job?.job_position}
                                                                                          className="w-full my-2 rounded p-2 border border-gray-700  bg-gray-900"
                                                                                          name="job_position"
                                                                                          placeholder="Job Position"
                                                                                          type="text"
                                                                                    />
                                                                                    <input
                                                                                          value={edit_job?.job_type}
                                                                                          className="w-full my-2 rounded p-2 border border-gray-700 bg-gray-900"
                                                                                          name="job_type"
                                                                                          placeholder="Job Type"
                                                                                          type="text"
                                                                                          onChange={() => { }} // Needed if controlled
                                                                                    />
                                                                                    <input
                                                                                          value={edit_job?.workplace}
                                                                                          className="w-full my-2 rounded p-2 border border-gray-700 bg-gray-900"
                                                                                          name="workplace"
                                                                                          placeholder="Workplace Type"
                                                                                          type="text"
                                                                                          onChange={() => { }} // Needed if controlled
                                                                                    />
                                                                                    <input
                                                                                          value={edit_job?.vacancy}
                                                                                          className="w-full my-2 rounded p-2 border border-gray-700 bg-gray-900"
                                                                                          name="vacancy"
                                                                                          placeholder="Vacancy"
                                                                                          type="text"
                                                                                          onChange={() => { }} // Needed if controlled
                                                                                    />
                                                                                    <input
                                                                                          value={edit_job?.dateline}
                                                                                          className="w-full my-2 rounded p-2 border border-gray-700 bg-gray-900"
                                                                                          name="last_date"
                                                                                          placeholder="Last Date"
                                                                                          type="date"
                                                                                          onChange={() => { }} // Needed if controlled
                                                                                    />

                                                                                    <div className="my-4">
                                                                                          <JoditEditor
                                                                                                config={{
                                                                                                      readonly: false,
                                                                                                      theme: "dark",
                                                                                                      height: 200,
                                                                                                      style: {
                                                                                                            backgroundColor: "#1f2937",
                                                                                                            color: "#ffffff",
                                                                                                      },
                                                                                                      toolbarSticky: false,
                                                                                                      toolbarAdaptive: false,
                                                                                                      toolbarButtonSize: "small",
                                                                                                      buttons: [
                                                                                                            "bold",
                                                                                                            "italic",
                                                                                                            "underline",
                                                                                                            "|",
                                                                                                            "ul",
                                                                                                            "ol",
                                                                                                            "|",
                                                                                                            "link",
                                                                                                            "|",
                                                                                                            "undo",
                                                                                                            "redo",
                                                                                                            "brush",
                                                                                                            "paragraph",
                                                                                                      ],
                                                                                                      uploader: {
                                                                                                            insertImageAsBase64URI: true,
                                                                                                      },
                                                                                                      removeButtons: ["source", "video", "fullsize", "about"],
                                                                                                }}
                                                                                                value={edit_job?.description}
                                                                                                name="description"
                                                                                                className="rounded bg-dark text-white jodit-editor"
                                                                                          />
                                                                                    </div>

                                                                                    <button
                                                                                          type="submit"
                                                                                          className="group flex items-center justify-center gap-4 w-full border border-[#1c65b4] bg-[#1c65b4] px-10 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"
                                                                                    >
                                                                                          <span className="font-medium text-white group-hover:text-[#1c65b4] group-active:text-[#1c65b4]">
                                                                                                Submit
                                                                                          </span>
                                                                                    </button>
                                                                              </form>
                                                                        </div>
                                                                  </div>
                                                            )}
                                                      </div>
                                                </div>
                                          )}






                                    </div>
                              </div>

                        </div>
                  </div>
            </div>
      );
};


export default JobManagement;
