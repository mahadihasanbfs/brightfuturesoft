import JoditEditor from 'jodit-react';
import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import uploadImage from '../../Hook/ImageUpload';
import { base_url } from '../../layout/Title';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/UseContext/AuthProvider';

const dataUriToFile = async (src, i) => {
      const blob = await (await fetch(src)).blob();
      const ext = (blob.type.split('/')[1] || 'png').split('+')[0];
      return new File([blob], `blog-image-${Date.now()}-${i}.${ext}`, { type: blob.type });
};

const replaceInlineImages = async (html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const imgs = [...doc.querySelectorAll('img[src^="data:image"]')];
      if (!imgs.length) return html;

      const uploaded = new Map(); // same image pasted twice is uploaded once
      for (const [i, img] of imgs.entries()) {
            const src = img.getAttribute('src');
            if (!uploaded.has(src)) {
                  const url = await uploadImage(await dataUriToFile(src, i));
                  if (!url) throw new Error('Image upload failed, post was not published.');
                  uploaded.set(src, url);
            }
            img.setAttribute('src', uploaded.get(src));
      }
      return doc.body.innerHTML;
};

const AdminBlogForm = () => {
      const { user } = useContext(AuthContext);

      const [previewUrl, setPreviewUrl] = useState(null);
      const [fileName, setFileName] = useState('');
      const [loading, setLoading] = useState(false)

      // Edit mode: /dashboard/blog-management/edit/:url
      const { url: editUrl } = useParams();
      const isEdit = Boolean(editUrl);
      const [blog, setBlog] = useState(null);
      const [loadingBlog, setLoadingBlog] = useState(isEdit);

      useEffect(() => {
            if (!isEdit) return;
            fetch(`${base_url}/blog/get-blog-by-id?blog_id=${encodeURIComponent(editUrl)}`)
                  .then(res => res.json())
                  .then(data => {
                        if (data.success) {
                              setBlog(data.data);
                              setPreviewUrl(data.data.img || null);
                        } else {
                              Swal.fire('Blog not found', data.message || '', 'error');
                        }
                  })
                  .catch(err => Swal.fire('Failed to load blog', err.message, 'error'))
                  .finally(() => setLoadingBlog(false));
      }, [editUrl, isEdit]);

      const handleFileChange = (event) => {
            const file = event.target.files[0];

            if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                        setPreviewUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                  setFileName(file.name);
            }
      };

      const navigate = useNavigate()

      const dataSubmit = async (event) => {
            setLoading(true)
            event.preventDefault()
            const form = event.target
            const title = form.title.value
            const image = form.photo.files[0]
            const meta_tag = title
            let message = form.message.value
            let photo = '';
            if (image) {
                  photo = await uploadImage(image);
                  if (!photo) {
                        setLoading(false)
                        return
                  }
            }
            // The editor embeds pasted/dropped images as base64, which bloats the post. Upload each one
            // through the single-file endpoint and swap the data URI for the hosted URL.
            try {
                  message = await replaceInlineImages(message);
            } catch (err) {
                  setLoading(false)
                  Swal.fire('Failed to upload an image in the post', err.message, 'error')
                  return
            }
            const formatTitleToURL = (title) => {
                  return title
                        ?.toLowerCase()
                        .replace(/\s+/g, '_')
            };

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

            const plainTextMessage = stripHtmlTags(message);

            // Edit keeps the original url (existing links stay valid), publisher, date and image unless a new one was picked.
            const payload = isEdit ? {
                  title,
                  message,
                  meta_tag,
                  meta_description: plainTextMessage,
                  img: photo || blog.img,
            } : {
                  title,
                  message,
                  meta_tag,
                  meta_description: plainTextMessage,
                  img: photo,
                  url: formatTitleToURL(title),
                  publisher: user,
                  date: new Date().toDateString()
            }

            fetch(isEdit ? `${base_url}/blog/update-blog?blog_id=${blog._id}` : `${base_url}/blog/add-blog`, {
                  method: isEdit ? 'PUT' : 'POST',
                  headers: {
                        'content-type': 'application/json',
                        'author': 'bright_future_soft'
                  },
                  body: JSON.stringify(payload)
            })
                  .then(res => res.json())
                  .then(data => {
                        setLoading(false)
                        if (data.success) {
                              Swal.fire(isEdit ? 'Blog Updated Successfully' : 'Blog Published Successfully', ' ', 'success')
                              form.reset()
                              navigate('/dashboard/blog-management')
                        } else {
                              Swal.fire(isEdit ? 'Failed to update blog' : 'Failed to publish blog', data.message || '', 'error')
                        }
                  })
                  .catch(err => {
                        setLoading(false)
                        Swal.fire(isEdit ? 'Failed to update blog' : 'Failed to publish blog', err.message, 'error')
                  })


      }


      return (
            <div className='py-20 bg-gray-900 text-white '>
                  <div className=' mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8'>

                        <h1 className='text-2xl font-bold mt-10 text-center'>{isEdit ? 'Edit blog' : 'Publish a blog for you and next'}</h1>
                        {loadingBlog ? <p className='text-center mt-10'>Loading blog...</p> : (isEdit && !blog) ? null :
                        <div className='p-10 border-2 rounded-xl m-10' >
                              <form onSubmit={dataSubmit} className="space-y-4 text-black">
                                    <div>
                                          <label className="sr-only" htmlFor="title">
                                                Title
                                          </label>
                                          <input required
                                                className="w-full rounded-lg bg-gray-800 border text-white border-gray-200 p-3 text-sm"
                                                placeholder="Title"
                                                defaultValue={blog?.title}
                                                type="text"
                                                id="title"
                                                name='title'
                                          />
                                    </div>
                                    <div>

                                          <label
                                                htmlFor="dropzone-file"
                                                className="flex flex-col items-center w-full  p-5 mx-auto mt-2 text-center bg-gray-900 border-2 border-gray-700 border-dashed cursor-pointer  rounded-xl"
                                          >
                                                {previewUrl ? <img src={previewUrl} alt="File Preview" className="mt-2 w-8 h-8" /> :
                                                      <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="w-8 h-8 text-gray-500 dark:text-gray-400"
                                                      >
                                                            <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                            />
                                                      </svg>
                                                }
                                                <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                                                      {fileName ? fileName : ' Upload Picture'}
                                                </h2>
                                                <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                                                      Upload Your Photo Only.
                                                </p>
                                                <input required={!isEdit}
                                                      id="dropzone-file"
                                                      type="file"
                                                      accept='image/*,application/pdf'
                                                      name='photo'
                                                      className="hidden"
                                                      onChange={handleFileChange}
                                                />
                                          </label>

                                          {/* Display the file preview */}

                                    </div>

                                    <div>

                                          <JoditEditor value={blog?.message || ''} config={{
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
                                               
                                                uploader: {
                                                      insertImageAsBase64URI: true,
                                                },
                                                removeButtons: ["source", "video", "fullsize", "about"],
                                          }}
                                                name='message'
                                                id="message" rows={20} className='rounded  h-[510px] t jodit-editor' />
                                    </div>
                                    <div className="mt-4">
                                          <button
                                                type="submit"
                                                className="inline-block w-full rounded-lg bg-[#1c65b4] px-5 py-3 font-medium text-white sm:w-auto"
                                          >
                                                {loading ? 'Loading..' : isEdit ? 'Update Blog' : 'Publish Blog'}
                                          </button>
                                    </div>
                              </form>

                        </div>}
                  </div>
            </div>
      );
};

export default AdminBlogForm;
