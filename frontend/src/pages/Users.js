import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import Swal from 'sweetalert2';
import axios from "axios";

import { FaMapMarkerAlt, FaBars, FaTimes, FaUserTie, FaRegUser } from "react-icons/fa";
import { LiaHomeSolid } from "react-icons/lia";
import { MdOutlineListAlt } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function CustomerProfile() {

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    address: "",
    age: "",
    phone: "",
    profileImage: null,
  });

  // GET SERVICE
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // only user
    if (storedUser) setUser(JSON.parse(storedUser)); {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        fullname: parsedUser.fullname || "",
        email: parsedUser.email || "",
        address: parsedUser.address || "",
        age: parsedUser.age || "",
        phone: parsedUser.phone || "",
        profileImage: parsedUser.profileImage || null,
      });
    }
  }, []);

  // Fetch Orders
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    setLoadingOrders(true);

    axios
      .get(`${API_URL}/orders`, { params: { userId: user._id || user.id } })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingOrders(false));
  }, [user]);


  // Fetch Bookings 
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    setLoadingBookings(true);

    axios
      .get(`${API_URL}/booking`, { params: { userId: user._id || user.id } })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingBookings(false));
  }, [user]);


  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // PROFILE EDIT
  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (!user._id && !user.id) {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "User not found, please login again!",
        });
        return;
      }


      const userId = user._id || user.id;

      const res = await axios.put(
        `${API_URL}/users/${userId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(res.data);
      setFormData(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully!",
      });

      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile. Please try again.");
    }
  };


  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && user) setFormData({ ...formData, profileImage: file });
  };

  if (!user) return <p className="text-center py-5">Loading...</p>;

  return (
    <div className="profile-container">
      {/* Sidebar */}
      <div className={`sidebarUser py-5 ${menuOpen ? "open" : ""}`}>
        <Link to="/Home">
          <LiaHomeSolid size={25} />
        </Link>
        <FaUserTie
          size={25}
          className={`icon ${activeView === "profile" ? "active" : ""}`}
          onClick={() => setActiveView("profile")}
        />
        <MdOutlineListAlt
          size={25}
          className={`icon ${activeView === "orders" ? "active" : ""}`}
          onClick={() => setActiveView("orders")}
        />
      </div>

      {/* Hamburger Toggle */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Main Content */}
      <div className="main-contentuser">
        {activeView === "profile" && (
          <>
            <h2>Profile</h2>
            <div className="profile-card">

              {user?.profileImage ? (
                <img
                  src={`${API_URL}${user.profileImage}`}
                  alt="Profile"
                  className="profile-image rounded-circle"
                  onClick={() => fileInputRef.current.click()}
                  style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
                />
              ) : (
                <FaRegUser
                  size={60}
                  className="default-user-icon cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                />
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

              {editMode ? (
                <div className="profile-edit">
                  <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Full Name" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                  <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                  <button onClick={handleSave} className="btn btn-success mt-2">Save</button>
                  <button onClick={() => setEditMode(false)} className="btn btn-secondary mt-2">Cancel</button>
                </div>
              ) : (
                <div className="profile-info">
                  <h3 className="uppercase text-primary">{user.fullname}</h3>
                  <p>{user.email}</p>
                  <p className="location text-primary"><FaMapMarkerAlt /> {user.address}</p>
                  <p>Age: {user.age}</p>
                  <p>Phone: {user.phone}</p>
                  <button onClick={() => setEditMode(true)} className="btn btn-outline-primary mt-2">Edit Profile</button>
                </div>
              )}
            </div>
          </>
        )}

        {activeView === "orders" && (
          <>
            <h2>My Orders & Bookings</h2>

            {/* Orders Table */}
            <div className="Order table-section">
              <h4>Orders</h4>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Qty</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr><td colSpan="6" className="text-center">Loading orders...</td></tr>
                  ) : orders.length > 0 ? (
                    orders.map((o, idx) => (
                      <tr key={o._id}>
                        <td>{o._id || idx + 1}</td>
                        <td>{o.product}</td>
                        <td>{o.brand}</td>
                        <td>{o.quantity}</td>
                        <td>{o.date ? new Date(o.date).toLocaleDateString() : "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bookings Table */}
            <div className="Booking table-section">
              <h4>Bookings</h4>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Product</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingBookings ? (
                    <tr>
                      <td colSpan="5" className="text-center">Loading bookings...</td>
                    </tr>
                  ) : bookings.length > 0 ? (
                    bookings.map((s) => (
                      <tr key={s._id}>
                        <td>{s._id}</td>
                        <td>{s.product}</td>
                        <td>{s.services}</td>
                        <td>{s.date ? new Date(s.date).toLocaleDateString() : "N/A"}</td>
                        <td>{s.status || "Pending"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
