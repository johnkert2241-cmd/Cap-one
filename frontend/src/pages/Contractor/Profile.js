import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";


function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    fullname: "",
    email: "",
    address: "",
    phone: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Contractor not found",
        text: "Please try again!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    fetch("http://localhost:5000/business/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          const loadedData = {
            businessName: data.businessName || "",
            fullname: data.fullname || "",
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
          };
          setFormData(loadedData);
          setOriginalData(loadedData); // <--- store original data
          if (data.profileImage) {
            setProfileImage(`http://localhost:5000${data.profileImage}`);
            setOriginalImage(`http://localhost:5000${data.profileImage}`);
          }
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemoveImage = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:5000/business/profile/remove-image", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove sa UI
      setProfileImage(null);
      setSelectedImageFile(null);
      setOriginalImage(null);

      Swal.fire({
        icon: "success",
        text: "Profile image removed!",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error("Remove image error:", error);
    }
  };



  // Save updates
  const handleSave = () => {
    const token = localStorage.getItem("token");

    const formDataToSend = new FormData();
    formDataToSend.append("businessName", formData.businessName);
    formDataToSend.append("fullname", formData.fullname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);

    if (selectedImageFile) {
      formDataToSend.append("profileImage", selectedImageFile);
    }

    fetch("http://localhost:5000/business/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Profile updated successfully!",
        });
        setOriginalData(formData);
        if (data.profileImage) {
          setOriginalImage(`http://localhost:5000${data.profileImage}`);
        }
        setIsEditing(false);
      })
      .catch((err) => console.error("Update profile error:", err));
  };


  // Cancel edit
  const handleCancel = () => {
    setFormData(originalData);
    setProfileImage(originalImage);
    setIsEditing(false);
  };

  return (
    <div className="container-fluid my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "rgb(10, 88, 117)" }}>Profile</h2>
        <p
          className="bg-danger p-2 text-white rounded d-flex align-items-center gap-2"
          style={{
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#b02a37";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#212529";
          }}
          onClick={() => {
            Swal.fire({
              title: "Log out?",
              text: "Are you sure you want to logout?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Logout",
              cancelButtonText: "Cancel",
              reverseButtons: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#0A5875",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  text: "Logging out...",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                setTimeout(() => {
                  localStorage.removeItem("token");
                  window.location.href = "/BusinessLogin";
                }, 1000);
              }
            });
          }}
        >
          <FaSignOutAlt size={18} />
          Logout
        </p>
      </div>

      <div className="row">
        {/* Profile Image Section */}
        <div className="col-md-4 mb-4 ">
          <div className="card shadow-lg border-0 text-center position-relative">
            <div className="position-relative d-inline-block">
              <label
                htmlFor="fileInput"
                style={{ cursor: isEditing ? "pointer" : "default" }}
                className="d-inline-block position-relative"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-circle img-fluid"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <FaUserCircle
                    size={150}
                    color="#203a43"
                    className="border rounded-circle"
                    style={{ backgroundColor: "#fff", }}
                  />
                )}
              </label>

              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                disabled={!isEditing}
              />
              <div className= "mt-2">
                {isEditing && (
                  <label
                    htmlFor="fileInput"
                    className="rounded p-2"
                    style={{
                      cursor: "pointer", color: "#0A5875",
                      backgroundColor: "#e2e6ea",
                    }}>
                    Edit Profile
                  </label>
                )}
                {isEditing && profileImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="rounded p-2"
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="fw-bold mb-3 text-uppercase mt-2" style={{ color: "rgb(10, 88, 117)" }}>
              {formData.fullname}
            </div>
            <p className="bg-light p-3 text-secondary">Upload a new avatar, Larger image will be resized automatically.
              Maximum upload size is 1 MB
            </p>
          </div>
        </div>

        {/* Business Info Section */}
        <div className="col-md-8">
          <div className="card shadow-lg border-0 p-4">
            <h5>Business Information</h5>
            <form>
              <div className="mb-3">
                <label className="form-label">Business Name</label>

                <input
                  type="text"
                  name="businessName"
                  className="form-control"
                  value={formData.businessName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </form>

            {isEditing ? (
              <div className="d-flex">
                <button style={{background:"#0A5875", color:"#fff"}}onClick={handleSave}>
                  Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                style={{ background: "#0A5875", color: "#ffffff", padding: "8px" }}
                onClick={() => setIsEditing(true)}
              >
                Update Info
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
