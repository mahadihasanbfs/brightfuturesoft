import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { base_url } from '../../../layout/Title';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { AuthContext } from '../../../context/UseContext/AuthProvider';


const Add_Meting = () => {
      const { user } = useContext(AuthContext);
      const [selectedUsers, setSelectedUsers] = useState([{
            name: user?.name,
            email: user?.email,
            image: user?.image
      }]);
      const [duration, setDuration] = useState(60); //
      const [upload, setUpload] = useState(false)
      const [uploading, set_uploading] = useState(false)

      const { data: all_users = [], refetch, isLoading } = useQuery({
            queryKey: ["all_users"],
            queryFn: async () => {
                  const res = await fetch(
                        `${base_url}/auth/all?email=${user?.email}`,
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





      const navigate = useNavigate()



      const meeting = (e) => {
            e.preventDefault();
            set_uploading(true)
            const form = e.target;
            const title = form.title.value;
            const agenda = form.agenda.value;
            const date = form.date.value;
            const link = form.link.value;
            const data = {
                  title,
                  agenda,
                  date,
                  duration,
                  link,
                  selectedUsers,
                  status: 'pending',

            };

            console.log(data);
            fetch(`${base_url}/meeting/add-meeting`, {
                  method: 'POST',
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(data)
            })
                  .then(res => res.json())
                  .then(data => {
                        console.log(data);
                        set_uploading(false)
                        if (data.success) {
                              Swal.fire('Meeting Schedule Publish Successfully', ' ', 'success')
                              form.reset()
                              navigate('/dashboard/meeting_management')
                        }
                  })
      }



      const options = all_users.map(user => ({
            value: user?.email,
            image: user?.image,
            label: user?.name
      }));

      const handleChange = selectedOptions => {
            const formattedSelections = selectedOptions.map(option => ({
                  name: option.label,
                  email: option.value,
                  image: option.image
            }));
            setSelectedUsers(formattedSelections);
      };

      const formatOptionLabel = ({ label, image }) => (
            <div className="flex items-center">
                  <img
                        src={image} // User image URL
                        alt={label}
                        className="w-8 h-8 rounded-full mr-2 bg-gray-900 text-white"
                  />
                  <span>{label}</span>
            </div>
      );

      const customSingleValue = ({ data }) => (
            <div className="flex items-center">
                  <img
                        src={data.image} // User image URL
                        alt={data.label}
                        className="w-8 h-8 rounded-full bg-gray-900 text-white mr-2"
                  />
            </div>
      );

      const customStyles = {
            container: (provided) => ({
                  ...provided,
                  width: '100%',
                  backgroundColor: '#1a202c', // Tailwind `bg-gray-900` color
            }),
            control: (provided) => ({
                  ...provided,
                  backgroundColor: '#1a202c', // Tailwind `bg-gray-900` color
                  border: '1px solid #4a5568', // Optional: Border color for better visibility
                  boxShadow: 'none', // Remove default shadow
                  '&:hover': {
                        border: '1px solid #4a5568', // Optional: Border color on hover
                  }
            }),
            menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#1a202c', // Tailwind `bg-gray-900` color
            }),
            option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#4a5568' : '#1a202c', // Tailwind `bg-gray-900` color
                  color: '#ffffff', // White text
            }),
            singleValue: (provided) => ({
                  ...provided,
                  color: '#ffffff', // White text for selected value
            }),
            placeholder: (provided) => ({
                  ...provided,
                  color: '#ffffff', // White placeholder text
            }),
      };



      return (
            <div>
                  <div className='py-20 flex justify-center px-1  sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 md:w-[80%] w-[95%] mt-5'>
                        <form onSubmit={meeting} className='w-10/12'>
                              <h1 className='text-2xl font-bold text-center text-white py-8'>Upload New Meeting Schedule</h1>

                              <input className='w-full p-2 my-2 rounded border border-gray-600 focus:border-gray-100   bg-gray-900  text-white' name='title' placeholder='Input meeting title' type="text" />
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
                                    name="agenda"
                                    className="jodit-editor"
                              />

                              {/* <textarea name="agenda" className='w-full my-2 rounded bg-gray-900  text-white' id="" placeholder='Describe here meeting agenda'></textarea> */}
                              <input className='w-full my-2 rounded border-gray-600 border p-2  text-gray-100/60' name='date' placeholder='Select date and time' type="datetime-local" />
                              <input
                                    className="w-full my-2 rounded bg-gray-900 border border-gray-600 p-2  text-white"
                                    name="timeline"
                                    placeholder="Meeting Duration"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={10}
                                    step={10}
                              />

                              <input className='w-full my-2 p-2 rounded bg-gray-900 border  border-gray-600 focus:border-gray-100  text-white' name='link' placeholder='Provide here meeting link' type="text" />
                              <Select
                                    className='w-full my-2 rounded bg-gray-900 border border-gray-600 focus:border-gray-100  text-white'
                                    isMulti
                                    options={options}
                                    value={selectedUsers.map(user => ({
                                          value: user?.email,
                                          label: user?.name,
                                          image: user?.image
                                    }))}
                                    styles={customStyles}
                                    onChange={handleChange}
                                    formatOptionLabel={formatOptionLabel}
                                    components={{ SingleValue: customSingleValue }}
                                    placeholder="Select users who have permission"
                              />

                              <br />
                              <button
                                    type='submit'
                                    className="group flex items-center justify-center gap-4 w-full border border-indigo-600 bg-indigo-600 px-10 py-3 transition-colors hover:bg-transparent focus:outline-none focus:ring"

                              >
                                    <span
                                          className="font-medium text-white transition-colors text-center group-hover:text-indigo-600 group-active:text-indigo-500"
                                    >
                                          {uploading ? 'Uploading...' : 'Add Meeting'}
                                    </span>


                              </button>
                        </form>
                  </div>
            </div>
      );
};

export default Add_Meting;
