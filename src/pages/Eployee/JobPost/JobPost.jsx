import JoditEditor from 'jodit-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { base_url } from '../../../layout/Title';

const JobPost = () => {
      const [loading, set_loading] = useState(false)

      const jobForm = (e) => {
            e.preventDefault();
            set_loading(true)
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

            fetch(`${base_url}/job-post/add-job`, {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(jobData),
            })
                  .then((res) => res.json())
                  .then(() => {
                        Swal.fire('Job Post Publish Successfully', ' ', 'success')
                        form.reset()
                        set_loading(false)

                  })

      }

      return (
            <div className='py-20 flex justify-center px-1 text-gray-300  mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[80%] w-[95%] mt-5'>
                  <form onSubmit={jobForm} className='w-10/12'>
                        <h1 className='text-2xl font-bold text-center text-white py-8'>Upload Job Post</h1>
                        <label htmlFor="job_position" className='block  mb-2'>Job Position</label>
                        <input className='w-full my-2 p-2 border border-gray-700 rounded text-white bg-gray-800' name='job_position' placeholder='Job Position' type="text" />
                        <label htmlFor="job_type" className='block  mb-2'>Job Type</label>
                        <input className='w-full my-2 rounded text-white p-2 border border-gray-700 bg-gray-800' name='job_type' placeholder='Job type' type="text" />
                        <label htmlFor="workplace" className='block  mt-2'>Workplace</label>
                        <input className='w-full my-2 rounded text-white p-2 border border-gray-700 bg-gray-800' name='workplace' placeholder='Workplace type' type="text" />
                        <label htmlFor="vacancy" className='block  mt-2'>Vacancy</label>
                        <input className='w-full my-2 rounded text-white p-2 border border-gray-700 bg-gray-800' name='vacancy' placeholder='Vacancy' type="text" />
                        <label htmlFor="last_date" className='block  mt-2'>Deadline</label>
                        <input className='w-full my-2 rounded text-white p-2 border border-gray-700 bg-gray-800' name='last_date' placeholder='Deadline' type="date" />
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
                              name='description' className='rounded  jodit-editor' />
                        <br />
                        <br />
                        <button
                              type='submit'
                              disabled={loading}
                              className="group flex items-center justify-center gap-4 w-full border border-[#1c65b4] bg-[#1c65b4] px-10 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"

                        >
                              <span
                                    className="font-medium text-white transition-colors text-center group-hover:text-[#1c65b4] group-active:text-[#1c65b4]"
                              >
                                    {loading ? "Uploading..." : "Upload Job Post"}
                              </span>


                        </button>
                  </form>
            </div>
      );
};

export default JobPost;
