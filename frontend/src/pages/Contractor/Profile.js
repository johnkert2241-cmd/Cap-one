import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'


function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    address: "",
    phone: "",
  });

  // Fetch Profile Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Contractor not found",
        text: "Please try again!",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    fetch("http://localhost:5000/business/profile", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          // invalid token
          localStorage.removeItem("token");
          window.location.href = "/";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setFormData({
            businessName: data.businessName || "",
            email: data.email || "",
            address: data.address || "",
            phone: data.phone || "",
          });
        }
      })
      .catch((err) => console.error("Fetch profile error:", err));
  }, []);

  //  Image Upload Preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  //  Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Save Updates (PUT request)
  const handleSave = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/business/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch((err) => console.error("Update profile error:", err));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Profile</h2>
      </div>

      <div className="row">
        {/* Logo Upload Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-lg border-0 text-center p-3">
            <div className="mb-3">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile Logo"
                  className="rounded-circle img-fluid"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light border rounded-circle"
                  style={{ width: "150px", height: "150px", margin: "0 auto" }}
                >
                  <span className="text-muted">No Logo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Business Information Section */}
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
              <button
                className="btn btn-sm btn-success p-2"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary p-2"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
