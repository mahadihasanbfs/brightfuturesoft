import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { base_url } from '../../layout/Title';
import { Link, useParams } from 'react-router-dom';
import uploadImage from '../../Hook/ImageUpload';
import Swal from 'sweetalert2';
import { country_code } from './country_code';
import Select from 'react-select';
import { Badge, Briefcase, Building2, CalendarDays, ChevronDown, MapPin, Users } from 'lucide-react';
import JoditEditor from 'jodit-react';




const ViewDetails = () => {

      const { id } = useParams();

      const [apply, setApply] = useState(false)

      const [selectedCode, setSelectedCode] = useState(country_code[0]);



      const handleCountryChange = (selectedOption) => {
            setSelectedCode(selectedOption);
      };

      const { data: job_data = [] } = useQuery({
            queryKey: ["job_data"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/job-post/get-job-by-id?job_post_id=${id}`,
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

      ;

      const [upload, setUpload] = useState(false)
      const [resume, setResume] = useState('')
      const [name, setName] = useState('')
      const upload_resume = async (e) => {

            const file = e.target.files[0]
            console.log(file);
            setResume(false)
            setUpload(true)
            const image = await uploadImage(file)
            setName(file.name)
            setResume(image)
            setUpload(false)


      }

      const apply_job_post = (e) => {
            e.preventDefault()
            setApply(true)
            const form = e.target
            const full_name = form.full_name.value
            const email_address = form.email_address.value
            const phone_number = selectedCode.value + form.phone_number.value
            const salary_expectation = form.salary_expectation.value
            const experience_in_years = form.experience_in_years.value
            const job_post_id = id
            const why = form.why.value

            if (!resume.length) {
                  Swal.fire('Please upload your resume before applying.', '', 'warning');
                  setApply(false);
                  return; // stop function execution
            }



            const data = {
                  full_name,
                  email_address,
                  phone_number,
                  resume,
                  salary_expectation,
                  experience_in_years,
                  job_post_id,
                  why
            }

            console.log(data);

            fetch(`${base_url}/job-post/apply-job`, {
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  method: 'POST',
                  body: JSON.stringify(data)
            }).then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              Swal.fire(data.message, ' ', 'success')
                              setApply(false)
                        }
                        else {
                              Swal.fire(data.message, '', 'info')
                        }
                  })

      }

      const customSelectStyles = {
            container: (provided) => ({
                  ...provided,
            }),
            control: (provided) => ({
                  ...provided,
                  border: 'none',
                  boxShadow: 'none',
                  backgroundColor: 'white',
            }),
            dropdownIndicator: (provided) => ({
                  ...provided,
                  display: 'none', // Hide dropdown arrow
            }),
            indicatorSeparator: (provided) => ({
                  ...provided,
                  display: 'none', // Hide separator line
            }),
            placeholder: (provided) => ({
                  ...provided,
                  margin: 0,
            }),
            valueContainer: (provided) => ({
                  ...provided,
            }),
            singleValue: (provided) => ({
                  ...provided,
                  margin: 0,
                  padding: 0,
            }),
            menu: (provided) => ({
                  ...provided,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }),
            option: (provided) => ({
                  ...provided,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
            }),
      };

      const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
            })
      }

      const getWorkplaceIcon = (workplace) => {
            switch (workplace?.toLowerCase()) {
                  case "remote":
                        return <MapPin className="w-4 h-4" />
                  case "onsite":
                        return <Building2 className="w-4 h-4" />
                  case "hybrid":
                        return <Briefcase className="w-4 h-4" />
                  default:
                        return <MapPin className="w-4 h-4" />
            }
      }





      return (
            <div>
                  <section className="py-12 bg-gray-900 sm:py-16 lg:py-20">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                              <div className="max-w-3xl mx-auto xl:max-w-7xl mt-4">
                                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg">
                                          <div className=" px-4 py-12 sm:px-6 lg:px-8">
                                                <div className="space-y-6">
                                                      <div>
                                                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">Job Position: {job_data.job_position}</h1>
                                                            <p className="mt-4 text-lg text-gray-300">
                                                                  Bright Future Soft is a Bangladesh based software company dedicated to building intelligent and impactful digital solutions. Founded with a vision to empower businesses through technology, we have grown into a team of skilled developers, designers, and thinkers who are passionate about innovation and quality.

                                                            </p>
                                                      </div>

                                                      {/* Job Meta Information */}
                                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                                                            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                                                                  <Briefcase className="w-5 h-5 text-blue-400" />
                                                                  <div>
                                                                        <p className="text-sm text-gray-300">Job Type</p>
                                                                        {/* <Badge>{job_data.job_type}</Badge> */}
                                                                        <p className="font-semibold">{job_data.job_type}</p>
                                                                  </div>
                                                            </div>

                                                            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                                                                  {getWorkplaceIcon(job_data.workplace)}
                                                                  <div>
                                                                        <p className="text-sm text-gray-300">Workplace</p>
                                                                        <p className="font-semibold">{job_data.workplace}</p>
                                                                  </div>
                                                            </div>

                                                            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                                                                  <Users className="w-5 h-5 text-green-400" />
                                                                  <div>
                                                                        <p className="text-sm text-gray-300">Vacancies</p>
                                                                        <p className="font-semibold">{job_data.vacancy} positions</p>
                                                                  </div>
                                                            </div>

                                                            <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                                                                  <CalendarDays className="w-5 h-5 text-red-400" />
                                                                  <div>
                                                                        <p className="text-sm text-gray-300">Deadline</p>
                                                                        <p className="font-semibold text-sm">{formatDate(job_data.dateline)}</p>
                                                                  </div>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>


                                    <div className='px-4 sm:px-6 lg:px-8 mt-2'>
                                          <div className=" ">
                                                <div

                                                      className="text-white prose prose-invert max-w-none"
                                                      dangerouslySetInnerHTML={{
                                                            __html: job_data?.description,
                                                      }}
                                                />
                                          </div>
                                          {/* <p className="text-xl  font-bold text-white mt-7 sm:text-xl xl:text-xl font-pj">
                                                Applications Deadline: {new Date(job_data.dateline).toDateString()}
                                          </p> */}
                                          <div class="sm:col-span-2 mt-4">
                                                <button
                                                      disabled={(() => {
                                                            const deadline = new Date(job_data.dateline + "T23:59:59");
                                                            return new Date() > deadline;
                                                      })()}
                                                      onClick={() => setApply(true)}
                                                      type="button"
                                                      class="inline-flex disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center w-full px-6 py-4 text-sm font-bold text-black transition-all duration-200 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-100 hover:bg-gray-300"
                                                >
                                                      {new Date(job_data.dateline) > new Date() ? "APPLY FOR THIS POSITION" : "Deadline Passed"}
                                                </button>
                                          </div>
                                    </div>


                                    {apply && <section class="py-20">
                                          <div className={apply ? "flex" : "hidden"}>
                                                <div className={`fixed  z-50 top-0 left-0 flex h-full min-h-screen w-full items-center justify-center bg-gray-900/60 px-4 py-5  ${apply ? "block" : "hidden"
                                                      }`}>
                                                      <form onSubmit={apply_job_post} class="">
                                                            <div class="max-h-screen my-10">

                                                                  <div className="mt-6 overflow-hidden  max-w-4xl mx-auto rounded-lg shadow md:mt-10 text-white">

                                                                        <div className="w-full max-w-[800px]  rounded-[20px] mt-4 text-start bg-gray-900 border border-gray-700 relative pb-10 px-8 md:px-[30px]">

                                                                              <div className="flex items-center justify-between border-b border-gray-700 pb-2"> <button type='button'
                                                                                    onClick={() => {
                                                                                          setApply(false)
                                                                                          setName(false)
                                                                                          setResume(false)
                                                                                    }}
                                                                                    className='hover:bg-red-600 border absolute top-3 right-2 text-white cursor-pointer ml-3 bg-red-500 rounded-full w-8 h-8 flex justify-center items-center'>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                                              </button>
                                                                                    <p class="pt-6 text-base font-bold  text-gray-100">  🚀 Apply For This Position</p>
                                                                              </div>

                                                                              <div className='overflow-y-auto  h-[60vh]'>
                                                                                    <div >

                                                                                          <div class="grid grid-cols-1 mt-6 sm:grid-cols-2 gap-x-6 gap-y-5 ">
                                                                                                <div>
                                                                                                      <label for=""> Full Name </label>
                                                                                                      <div class="block mt-2 w-full p-0.5  text-sm font-normal text-gray-100 placeholder-gray-300 bg-gray-900 border  rounded-md caret-gray-900 focus:ring-gray-900  border-gray-700">
                                                                                                            <input required type="text" name="full_name" id="" placeholder="Mr. John Doe" class="w-full px-4 py-3 border-none" />
                                                                                                      </div>
                                                                                                </div>


                                                                                                <div>
                                                                                                      <label >Phone Number </label>
                                                                                                      <div className="flex mt-2 w-full bg-gray-900 border border-gray-700 rounded-md ">
                                                                                                            <DarkSelect
                                                                                                                  options={country_code}
                                                                                                                  value={selectedCode}
                                                                                                                  onChange={handleCountryChange}
                                                                                                                  styles={customSelectStyles}
                                                                                                                  isSearchable={true}
                                                                                                            />
                                                                                                            <input
                                                                                                                  type="text"
                                                                                                                  name="phone_number"
                                                                                                                  required
                                                                                                                  className="flex-1 px-4 py-2 border-none rounded-r-md"
                                                                                                                  placeholder="Enter phone number"
                                                                                                            />
                                                                                                      </div>
                                                                                                </div>

                                                                                                <div class="sm:col-span-2">
                                                                                                      <label for=""> Email address </label>
                                                                                                      <div class="block mt-2 w-full p-0.5  text-sm font-normal text-gray-900 placeholder-gray-500 bg-gray-900 border  border-gray-700 rounded-md caret-gray-900 focus:ring-gray-900 ">
                                                                                                            <input required type="text" name="email_address" id="" placeholder="" class="w-full px-4 py-3 border-none" />
                                                                                                      </div>
                                                                                                </div>
                                                                                                <div>
                                                                                                      <label for=""> Salary Expectation </label>
                                                                                                      <div class="block mt-2 w-full p-0.5  text-sm font-normal text-gray-900 placeholder-gray-500 bg-gray-900 border  rounded-md caret-gray-900 focus:ring-gray-900 border-gray-700 ">
                                                                                                            <input required type="text" name="salary_expectation" id="" placeholder="" class="w-full px-4 py-3 border-none" />
                                                                                                      </div>
                                                                                                </div>

                                                                                                <div>
                                                                                                      <label for=""> Work Experience in Years
                                                                                                      </label>
                                                                                                      <div class="block mt-2 w-full p-0.5  text-sm font-normal text-gray-900 placeholder-gray-500 bg-gray-900 border  rounded-md caret-gray-900 focus:ring-gray-900 border-gray-700 ">
                                                                                                            <input required type="text" name="experience_in_years" id="" placeholder="" class="w-full px-4 py-3 border-none" />
                                                                                                      </div>
                                                                                                </div>

                                                                                                <div class="bg-gray-700 max-w-4xl rounded-xl sm:col-span-2">
                                                                                                      <div class="p-4 ">
                                                                                                            <div class="sm:flex sm:items-center sm:justify-between">
                                                                                                                  <div class="flex items-center flex-1">
                                                                                                                        <div class="inline-flex items-center justify-center flex-shrink-0 bg-gray-400 rounded-full w-9 h-9 text-gray-50">
                                                                                                                              {resume ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg> :
                                                                                                                                    <>
                                                                                                                                          {upload ? <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin dark:border-violet-600">

                                                                                                                                          </div>


                                                                                                                                                : <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                                                                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                                                                                                </svg>}
                                                                                                                                    </>}
                                                                                                                        </div>
                                                                                                                        <Link to={resume ? resume : '#'} target={resume ? '_blank' : '_self'} class="ml-3 text-base font-normal text-gray-100">{name ? name : 'Upload Your Resume (Max 1 MB) '} </Link>
                                                                                                                  </div>

                                                                                                                  <div className="mt-4 sm:mt-0">
                                                                                                                        <label
                                                                                                                              htmlFor="file-upload"
                                                                                                                              className="inline-flex  cursor-pointer items-center px-4 py-2 text-sm font-bold text-gray-600 transition-all duration-200 border  rounded-md bg-gray-50 hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:text-gray-900 focus:ring-offset-2 focus:ring-gray-500"
                                                                                                                        >
                                                                                                                              {resume ? 'Uploaded' : 'Upload'}
                                                                                                                        </label>
                                                                                                                        <input

                                                                                                                              onChange={upload_resume}
                                                                                                                              id="file-upload"
                                                                                                                              type="file"
                                                                                                                              accept='image/*,application/pdf'
                                                                                                                              // accept=".pdf"
                                                                                                                              className="hidden"
                                                                                                                        />
                                                                                                                  </div>

                                                                                                            </div>
                                                                                                      </div>
                                                                                                </div>

                                                                                                <div class="sm:col-span-2">
                                                                                                      <label for="">Why do you think you are perfect for this position? </label>
                                                                                                      <div className='mt-2'>
                                                                                                            <JoditEditor config={{
                                                                                                                  readonly: false,
                                                                                                                  theme: "dark",
                                                                                                                  height: 150,
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
                                                                                                                  placeholder: "Why do you think you are perfect for this position?",
                                                                                                            }}

                                                                                                                  name='why'
                                                                                                            />
                                                                                                            {/* <textarea required type="text" name="why" id="" placeholder="" class="w-full px-4 py-3 border-none" /> */}
                                                                                                      </div>


                                                                                                </div>




                                                                                          </div>

                                                                                    </div>
                                                                              </div>
                                                                              <div class="sm:col-span-2 mt-4">
                                                                                    <button
                                                                                          type="submit"
                                                                                          class="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white transition-all duration-200 bg-[#1c65b4] border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                                                                                    >
                                                                                          APPLY FOR THIS POSITION
                                                                                    </button>
                                                                              </div>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </form>
                                                </div>

                                          </div>
                                    </section>}

                              </div>
                        </div>
                  </section>

            </div>
      );
};

export default ViewDetails;



const DarkSelect = ({
      options = [],
      value,
      onChange,
      placeholder = "Select option",
}) => {
      const [open, setOpen] = useState(false);
      const [search, setSearch] = useState("");
      const selectRef = useRef(null);

      // Close when clicking outside
      useEffect(() => {
            const handleClickOutside = (event) => {
                  if (selectRef.current && !selectRef.current.contains(event.target)) {
                        setOpen(false);
                  }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

      const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
      );

      return (
            <div className="relative w-full" ref={selectRef}>
                  {/* Select Button */}
                  <div
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-between px-4 py-3
                   bg-gray-800 rounded-l-md
                   text-white cursor-pointer
                   hover:border-indigo-500
                   focus-within:ring-2 focus-within:ring-indigo-500 text-xs
                   transition"
                  >
                        <span className={value ? "text-white" : "text-gray-400" + " text-xs"}>
                              {value ? value.label : placeholder}
                        </span>

                        <ChevronDown
                              className={`md:w-5 md:h-5 hidden md:block  transition-transform duration-200 ${open ? "rotate-180 text-indigo-400" : "text-gray-400"
                                    }`}
                        />
                  </div>

                  {/* Dropdown */}
                  {open && (
                        <div
                              className="absolute z-50 mt-1 w-full rounded
                     bg-gray-900 border border-gray-700
                     shadow-2xl overflow-hidden"
                        >
                              {/* Search Input */}
                              <div className=" border-b border-gray-700">
                                    <input
                                          type="text"
                                          placeholder="Search..."
                                          value={search}
                                          onChange={(e) => setSearch(e.target.value)}
                                          className="w-full px-3 py-2
                         bg-gray-800 text-white
                         placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                              </div>

                              {/* Options */}
                              <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 text-xs">
                                    {filteredOptions.length > 0 ? (
                                          filteredOptions.map((option, index) => (
                                                <div
                                                      key={index}
                                                      onClick={() => {
                                                            onChange(option);
                                                            setOpen(false);
                                                            setSearch("");
                                                      }}
                                                      className={`p-2 cursor-pointer transition rounded mx-2 my-1
                    ${value?.value === option.value
                                                                  ? "bg-[#1c65b4] text-white"
                                                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                                            }`}
                                                >
                                                      {option.label}
                                                </div>
                                          ))
                                    ) : (
                                          <div className="px-4 py-3 text-gray-500 text-sm">
                                                No results found
                                          </div>
                                    )}
                              </div>
                        </div>
                  )}
            </div>
      );
}
