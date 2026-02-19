import { useState, useContext } from "react";

import { base_url } from "../../../layout/Title";
import uploadImage from "../../../Hook/ImageUpload";
import { AuthContext } from "../../../context/UseContext/AuthProvider";

const UpdateProfileForm = ({ user }) => {
      const { setUser } = useContext(AuthContext);
      const [isLoading, setIsLoading] = useState(false);
      const [message, setMessage] = useState({ type: "", text: "" });
      const [formData, setFormData] = useState({
            name: user?.name || "",
            email: user?.email || "",
            designation: user?.designation || "",
            image: null, // will store the new File if selected
            phone: user?.phone || "",
            linkedin: user?.linkedin || "",
            dob: user?.dob || "",
      });
      const [previewImage, setPreviewImage] = useState(user?.image || null);

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
      };

      const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  setFormData((prev) => ({ ...prev, image: file }));

                  const reader = new FileReader();
                  reader.onloadend = () => {
                        setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
            }
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            setMessage({ type: "", text: "" });

            try {
                  let imageUrl = user?.image || ""; // Default to existing image

                  // If a new image is selected, upload it
                  if (formData.image) {
                        imageUrl = await uploadImage(formData.image);
                  }

                  const data = {
                        name: formData.name,
                        email: formData.email,
                        designation: formData.designation,
                        image: imageUrl,
                        phone: formData.phone,
                        linkedin: formData.linkedin,
                        dob: formData.dob,
                  };

                  fetch(`${base_url}/auth/update-user-data?user_id=${user?._id}`, {
                        method: "PUT",
                        headers: {
                              "Content-Type": "application/json",
                              author: "bright_future_soft",
                        },
                        body: JSON.stringify(data),
                  })
                        .then((res) => res.json())
                        .then((data) => {
                              if (data.success) {
                                    localStorage.setItem('data', JSON.stringify(data.user));
                                    setUser(data.user)
                                    setMessage({
                                          type: "success",
                                          text: "Profile updated successfully!",
                                    });
                              }
                        });
            } catch (error) {
                  console.error("Update failed:", error);
                  setMessage({
                        type: "error",
                        text: error.message || "Failed to update profile. Please try again.",
                  });
            } finally {
                  setIsLoading(false);
            }
      };

      return (
            <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Update Profile</h2>

                  {message.text && (
                        <div
                              className={`p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                        >
                              {message.text}
                        </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                              <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mb-4">
                                          {previewImage ? (
                                                <img
                                                      src={previewImage || "/placeholder.svg"}
                                                      alt="Profile preview"
                                                      className="w-full h-full object-cover"
                                                />
                                          ) : (
                                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                                                      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                          )}
                                    </div>

                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm transition-colors">
                                          Change Photo
                                          <input type="file" accept='image/*,application/pdf' className="hidden" onChange={handleImageChange} />
                                    </label>
                              </div>
                        </div>

                        <div className="md:w-2/3 space-y-4">
                              <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
                                          Full Name
                                    </label>
                                    <input
                                          type="text"
                                          id="name"
                                          name="name"
                                          value={formData.name}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
                                          Email Address
                                    </label>
                                    <input
                                          type="email"
                                          id="email"
                                          name="email"
                                          value={formData.email}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>

                              <div>
                                    <label htmlFor="designation" className="block text-sm font-medium text-gray-100 mb-1">
                                          Designation
                                    </label>
                                    <input
                                          type="text"
                                          id="designation"
                                          name="designation"
                                          value={formData.designation}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>
                              <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-100 mb-1">
                                          Linkedin
                                    </label>
                                    <input
                                          type="text"
                                          id="linkedin"
                                          name="linkedin"
                                          value={formData.linkedin}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>
                              <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-1">
                                          Phone
                                    </label>
                                    <input
                                          type="text"
                                          id="phone"
                                          name="phone"
                                          value={formData.phone}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>
                              <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-100 mb-1">
                                          Date of Birth
                                    </label>
                                    <input
                                          type="date"
                                          id="dob"
                                          name="dob"
                                          value={formData.dob}
                                          onChange={handleChange}
                                          className="w-full px-3 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                              </div>
                        </div>
                  </div>

                  <div className="flex justify-end">
                        <button
                              type="submit"
                              disabled={isLoading}
                              className="bg-[#1c65b4] hover:bg-[#0875e9] text-white py-2 px-6 rounded-md font-medium transition-colors disabled:opacity-50"
                        >
                              {isLoading ? "Updating..." : "Update Profile"}
                        </button>
                  </div>
            </form>
      );
};

export default UpdateProfileForm;
