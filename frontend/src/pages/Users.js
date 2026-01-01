import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import Swal from 'sweetalert2';
import axios from "axios";
import { PiMapPinLine } from "react-icons/pi";
import { IoIosMail, IoMdCall, IoIosPin } from "react-icons/io";
import { FaBars, FaTimes, FaEdit } from "react-icons/fa";
import { FaUser, FaShippingFast } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function CustomerProfile() {

  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("buyorders");
  const [editMode, setEditMode] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [publishedProducts, setPublishedProducts] = useState([]);
  const [publishedServices, setPublishedServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);


  const [orderData, setOrderData] = useState({
    customername: "",
    product: "",
    phone2: "",
    address2: "",
    service: "",
    brand: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
    time: "",
    totalPrice: 0,
  });

  const [serviceForm, setServiceForm] = useState({
    customername: "",
    phone: "",
    address: "",
    choosecategory: "",
    servicetype: "",
    serviceprice: "",
    servicedate: new Date().toISOString().split("T")[0],
    servicetime: "",
  });


  const shippingFee = 58;
  const computedTotal = (orderData.totalPrice || 0) + shippingFee;

  const handleServiceNow = (service) => {
    setSelectedService(service);

    setServiceForm({
      customername: user?.fullname || "",
      phone: user?.phone || "",
      address: user?.address || "",
      choosecategory: service.category || "",
      servicedate: new Date().toISOString().split("T")[0],
      servicetime: "12:00",
    });

    setShowServiceModal(true);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);

    setOrderData({
      customername: user?.fullname || "",
      phone2: user?.phone || "",
      address2: user?.address || "",
      product: product.type,
      brand: product.brand,
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      totalPrice: product.price,
      time: "12:00",
      service: product.category || "",
    });
    setShowOrderModal(true);
  };

  const handleConfirmPurchase = async () => {
    try {
      if (!selectedProduct) return;

      const userId = user._id || user.id;

      const order = {
        contractorId: selectedProduct.contractorId,
        customername: orderData.customername,
        product: orderData.product,
        brand: orderData.brand,
        service: orderData.service,
        phone2: orderData.phone2,
        address2: orderData.address2,
        quantity: orderData.quantity,
        totalPrice: orderData.totalPrice,
        time: orderData.time,
        date: orderData.date,
        status: "Processing",
      };

      await axios.post(
        "http://localhost:5000/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: `Your order for ${orderData.product} has been placed.`,
      });

      setShowOrderModal(false);

      setOrderData({
        customername: "",
        product: "",
        brand: "",
        service: "",
        phone2: "",
        address2: "",
        quantity: 1,
        totalPrice: 0,
        date: "",
        time: "",
        userId: userId,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to place order. Please try again.",
      });
    }
  };

  const handleServiceSubmit = async () => {
    try {
      if (!selectedService) return;

      // Ensure userId is defined
      const userId = user?._id || user?.id;
      if (!userId) {
        Swal.fire("Error", "User not found!", "error");
        return;
      }

      const service = {
        userId: userId,
        contractorId: selectedService.contractorId,
        customername: serviceForm.customername,
        phone: serviceForm.phone,
        address: serviceForm.address,
        choosecategory: serviceForm.choosecategory,
        servicedate: serviceForm.servicedate,
        servicetime: serviceForm.servicetime,
        status: "Pending",
      };

      await axios.post(
        "http://localhost:5000/servicesRequest",
        service,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Service Booked!",
        text: `Your service request for has been placed.`,
      });

      setShowServiceModal(false);
      // Reset form
      setServiceForm({
        customername: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
        servicedate: new Date().toISOString().split("T")[0],
        servicetime: "",
      });

    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to place service request. Please try again.",
      });
    }
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    address: "",
    age: "",
    phone: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchPublishedProducts();
    fetchAllServices();
  }, []);

  const fetchPublishedProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/products/publish`);
      setPublishedProducts(res.data);
    } catch (err) {
      console.log("Error loading published products");
    }
  };

  // fetch services
  const fetchAllServices = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/services/publish/list`);
      setPublishedServices(res.data);
    } catch (err) {
      console.log("Error loading published services");
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);

    if (view === "buyorders") {
      fetchPublishedProducts();
    }

    if (view === "buyservice") {
      fetchAllServices();
    }
  };

  // GET SERVICE
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

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
      .get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          userId: user._id || user.id,
        },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
      })
      .finally(() => setLoadingOrders(false));
  }, [user]);

  // Fetch Bookings 
  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);

        const { data } = await axios.get(
          "http://localhost:5000/servicesRequest",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              userId: user._id || user.id,
            },
          }
        );

        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
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

    <div className="profile-container bg-light m-0 p-0">
      {/* Navigation */}
      <div className={`sidebarUser py-3 sticky-top ${menuOpen ? "open" : ""}`} style={{ background: "#0a5875" }}>
        <ul className="sidebarList justify-content-center">
          <li
            className={`ligntext text-uppercase cursor-pointer${activeView === "buyorders" ? "active" : ""}`}
            onClick={() => handleViewChange("buyorders")}
          >
            Buy Products
          </li>

          <li
            className={`ligntext text-uppercase ${activeView === "buyservice" ? "active" : ""}`}
            onClick={() => handleViewChange("buyservice")}
          >
            Book Service
          </li>

          <li className="nav-item dropdown dropdown-toggle ligntext transparent"
            data-bs-toggle="dropdown"
          >
            {user.fullname}'S ACCOUNT
            <ul className="dropdown-menu">
              <li>
                <p
                  className={`dropdown-item ${activeView === "profile"}`}
                  onClick={() => handleViewChange("profile")}
                  style={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                  <FaUser size={20} className="me-2" />
                  My Profile
                </p>
              </li>
              <li>
                <p
                  className={`dropdown-item ${activeView === "orders"}`}
                  onClick={() => handleViewChange("orders")}
                  style={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                  <FaShippingFast size={20} className="me-2" />
                  My Orders & Bookings
                </p>
              </li>

              <li>
                <p
                  className={`dropdown-item ${activeView === "logout"}`}
                  onClick={() => handleViewChange("logout")}
                  style={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                  <TbLogout2 size={20} className="me-2" />
                  Logout
                </p>
              </li>
            </ul>

          </li>
        </ul>
      </div>


      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Profile */}
      <div className="main-contentuser">
        {activeView === "profile" && (
          <div className="py-5">
            <h3 className="fw-bold mb-4" style={{ color: "#0a5875" }}>Profile</h3>
            <div className="card shadow-md border-0" style={{ background: "#0a5875" }}>
              <div className="d-flex align-items-center mb-3">
                <div className="position-relative me-3">
                  <img
                    src={
                      previewImage
                        ? previewImage
                        : user?.profileImage
                          ? `${API_URL}${user.profileImage}`
                          : "https://via.placeholder.com/100?text=User"
                    }
                    alt="Profile"
                    className="rounded-circle border border-2 border-light shadow-sm "
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: editMode ? "pointer" : "default",
                      transition: "0.3s ease",
                    }}
                    onClick={() => {
                      if (editMode) fileInputRef.current.click();
                    }}
                  />
                  <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPreviewImage(reader.result);
                        reader.readAsDataURL(file);
                        handleImageChange(e);
                      }
                    }}
                  />
                  {editMode && (
                    <button
                      className="position-absolute bg-temporary rounded-circle"
                      style={{ bottom: "0", right: "0" }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-white fs-5 fw-bold" style={{ marginRight: "10", color: "#0a5875" }}>{user.fullname}</p>
                  <p className="text-white"><IoIosMail size={25} /> {user.email}</p>
                  <p className="text-white"><IoMdCall size={25} /> {user.phone}</p>
                  <p className="text-white"><IoIosPin size={25} />{user.address}</p>
                </div>


              </div>
              {/* Edit Mode */}
              {editMode ? (
                <div className="profile-edit">
                  <div className="row g-3">
                    <div className="col-md-5">
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-5">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="text-start mt-4">
                    <button
                      onClick={handleSave}
                      style={{ background: "#2E6DA4", color: "#ffffff" }}>
                      Save
                    </button>
                    <button onClick={() => {
                      setEditMode(false); setPreviewImage(null);
                    }}
                      style={{ background: "#D9534F", color: "#ffffff" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-start">
                  <button
                    onClick={() => setEditMode(true)}
                    style={{ background: "#2E6DA4", color: "#ffffff" }}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Recent Orders & Services */}
            <div className="mt-5">
              <h4 className="fw-bold mb-3" style={{ color: "#0a5875" }}>Recent Orders</h4>
              <div className="row">
                {loadingOrders ? (
                  <p className="text-center">Loading recent orders...</p>
                ) : orders.length > 0 ? (
                  orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="col-md-4 mb-3">
                      <div className="card shadow-md h-100" style={{ background: "#0a5875" }}>
                        <div className="card-body">
                          <h5 className="card-title fw-bold" style={{ color: "#F0F8FF" }}>Order ID: "{order._id}"</h5>
                          <h6 style={{ color: "#F0F8FF" }}>{order.product}</h6>
                          <p className="mb-1" style={{ color: "#F0F8FF" }}>Brand: {order.brand}</p>
                          <p className=" mb-1" style={{ color: "#F0F8FF" }}>Qty: {order.quantity}</p>
                          <p className="mb-1" style={{ color: "#F0F8FF" }}> Price:₱ {order.totalPrice.toLocaleString()}</p>
                          <p className="text-secondart" style={{ color: "#F0F8FF" }}>
                            Date: {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No recent orders found</p>
                )}
              </div>

              <h4 className="fw-bold mt-4 mb-3" style={{ color: "#0a5875" }}>Recent Services</h4>
              <div className="row">
                {loadingBookings ? (
                  <p className="text-center">Loading recent services...</p>
                ) : bookings.length > 0 ? (
                  bookings.slice(0, 3).map((service) => (
                    <div key={service._id} className="col-md-4 mb-3">
                      <div className="card shadow-md h-100" style={{ background: "#0a5875" }}>
                        <div className="card-body" >
                          <h5 className="card-title fw-bold" style={{ color: "#F0F8FF" }}>Order ID: "{service._id}"</h5>
                          <h6 className="card-title" style={{ color: "#F0F8FF" }}>Service: {service.services}</h6>
                          <p className="card-text mb-1" style={{ color: "#F0F8FF" }}>Product: {service.serviceproduct}</p>
                          <p className="card-text mb-1" style={{ color: "#F0F8FF" }}>Status: {service.status || "Pending"}</p>
                          <p style={{ color: "#F0F8FF" }}>
                            Date: {service.servicedate ? new Date(service.servicedate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No recent services found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Published Products */}
        {activeView === "buyorders" && (
          <div className="container py-3">
            <h3 className="fw-bold py-2 border-bottom" style={{ color: "#0a5875" }}>Products</h3>
            {publishedProducts.length > 0 ? (
              <div className="row">
                {publishedProducts.map((product, index) => (
                  <div key={index} className="col-md-4 mb-4 py-3">
                    <div className="carduser card">
                      <h5 className="card-title fw-bold" style={{ color: "#0a5875" }}>
                        {product.contractorId?.businessName}
                      </h5>
                      <p className="text-dark mb-5"><PiMapPinLine size={19} style={{ color: "#0a5875" }} /> {product.contractorId?.address}</p>
                      <img
                        src={`data:${product.image.contentType};base64,${product.image.data}`}
                        className="fixed-img-container"
                        alt=""
                        style={{
                          width: "100%",
                          height: "210px",
                          overflow: "hidden",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer"
                        }}
                        onClick={() => openModal(product.image)}
                      />

                      <div className="card-body">
                        <h3 className="fw-bold" style={{ color: "#0a5875" }}>{product.category}</h3>
                        <p className="card-text fs-6 fw-bold uppercase" style={{ color: "#0a5875" }}>{product.brand}</p>
                        <p className="card-title fw-bold text-uppercase">{product.type}</p>
                        <p className="card-details fw-bold text-secondary ">{product.details}</p>
                        <p className="fs-5 fw-bold" style={{ color: "#0a5875" }}>
                          ₱ {product.price.toLocaleString()}
                        </p>
                        <button
                          type="button"
                          className="btn buy-btn w-100"
                          onClick={() => handleBuyNow(product)}
                          style={{ background: "#0a5875", color: "#ffffff" }}
                        >
                          Buy Now
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary">No published products available</p>
            )}

          </div>
        )}

        {showOrderModal && selectedProduct && (
          <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg" centered>
            <Modal.Header closeButton className="text-light btn-close-white" style={{ background: "#0a5875" }}>
              <Modal.Title>Order Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Customer Name</label>
                    <input type="text" className="form-control" value={orderData.customername}
                      onChange={(e) => setOrderData({ ...orderData, customername: e.target.value })} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product Type</label>
                    <input type="text" className="form-control uppercase" value={orderData.product}
                      onChange={(e) => setOrderData({ ...orderData, product: e.target.value })} disabled />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input type="text" className="form-control uppercase"
                      value={orderData.phone2}
                      onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Product</label>
                    <input type="text" className="form-control uppercase" value={orderData.service}
                      onChange={(e) => setOrderData({ ...orderData, service: e.target.value })} disabled />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control uppercase"
                      value={orderData.address2}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Brand</label>
                    <input type="text" className="form-control uppercase" value={orderData.brand} disabled />
                  </div>
                </div>

                <div className="row border-bottom">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={orderData.quantity}
                      min={1}
                      onChange={(e) =>
                        setOrderData({
                          ...orderData,
                          quantity: Math.max(1, Number(e.target.value)),
                          totalPrice: selectedProduct.price * Math.max(1, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={orderData.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setOrderData({ ...orderData, date: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={orderData.time}
                      onChange={(e) => setOrderData({ ...orderData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="text-start mb-3 ">
                  <img
                    src={`data:${selectedProduct.image.contentType};base64,${selectedProduct.image.data}`}
                    alt={selectedProduct.type}
                    className="img-fluid rounded mb-2 mt-3"
                    style={{ maxHeight: "200px", objectFit: "contain" }}

                  />

                  <div className="d-block justify-content-between">
                    <p className="text-dark fs-5 ">Order Details</p>
                    <p className="text-muted" >(Only Cash on delivery)</p>
                    <p className="text-dark d-flex justify-content-between">
                      Subtotal: ({orderData.quantity} items)
                      <p className="fw-bold">
                        ₱ {orderData.totalPrice?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </p>
                    </p>

                    <p className="d-flex justify-content-between">
                      Shipping Fee:
                      <p className="fw-bold">₱ {shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
                    </p>

                    <p className="text-end fw-bold fs-5" style={{ color: "#0a5875" }}>
                      Total: ₱ {computedTotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn bg-secondary text-light"
                onClick={() => setShowOrderModal(false)}>CANCEL</button>
              <button className="btn text-light" onClick={handleConfirmPurchase}
                style={{ background: "#0a5875" }}>PLACE ORDER NOW
              </button>
            </Modal.Footer>
          </Modal>
        )}

        {modalOpen && (
          <div className="modal" style={{
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000
          }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {selectedImage && (
                    <img
                      src={`data:${selectedImage.contentType};base64,${selectedImage.data}`}
                      alt="Product"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Published Services */}
        {activeView === "buyservice" && (
          <div className="container py-3">
            <h3 className="fw-bold py-2 border-bottom" style={{ color: "#0a5875" }}>Book Service</h3>
            {publishedServices.length > 0 ? (
              <div className="row">
                {publishedServices.map((service, index) => (
                  <div key={index} className="col-md-6 mb-4 py-3">
                    <div className="service-card card shadow rounded-3 ">
                      <p style={{ color: "#0a5875" }}><PiMapPinLine size={19} />
                        {service.contractorId?.address}
                      </p>
                      <h5 className="card-title fw-bold fs-5 " style={{ color: "#0a5875" }}>
                        {service.businessName}
                      </h5>

                      <div className="row g-0 py-2">
                        <div className="col-md-5 d-flex align-items-center justify-content-center">
                          {service.image ? (
                            <img
                              src={
                                service.image.startsWith("data:image")
                                  ? service.image
                                  : `http://localhost:5000/${service.image}`
                              }
                              alt="businesname"
                              className="img-fluid"
                              style={{ maxHeight: "230px", objectFit: "cover", width: "100%" }}
                            />
                          ) : (
                            <div className="text-center">
                              <i className="bi bi-box-seam fs-1 text-muted"></i>
                              <p className="small text-muted mt-2">No Image</p>
                            </div>
                          )}
                        </div>
                        {/* Text section */}
                        <div className="col-md-7">
                          <div className="card-body">
                            <p className="mb-1 fw-bold fs-5" style={{ color: "#0a5875" }}>{service.category}</p>
                            {service.serviceType?.length > 0 && (
                              <div className="d-flex flex-wrap gap-2 py-2">
                                {service.serviceType.map((type, index) => (
                                  <span
                                    key={index}
                                    className="badge"
                                    style={{
                                      background: "#0a5875",
                                      color: "#fff",
                                      fontSize: "0.80rem",
                                      padding: "5px 10px"
                                    }}
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p>Open: {service.duration}</p>
                            <p>Schedule: {service.availability}</p>
                            <button
                              type="button"
                              className="btn buy-service w-100 mt-3"
                              onClick={() => handleServiceNow(service)}
                              style={{ background: "#0a5875", color: "#ffffff" }}
                            >
                              Service Now
                            </button>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-secondary">No published services available</p>
            )}
          </div>
        )}

        {showServiceModal && selectedService && (
          <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} size="lg" centered>
            <Modal.Header closeButton className="text-light btn-close-white" style={{ background: "#0a5875" }}>
              <Modal.Title>Service Booking Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Customer Name</label>
                  <input className="form-control" value={serviceForm.customername} disabled />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" value={serviceForm.phone} disabled />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Address</label>
                  <input className="form-control" value={serviceForm.address} disabled />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    value={serviceForm.choosecategory}
                    disabled
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={serviceForm.servicedate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setServiceForm({ ...serviceForm, servicedate: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={serviceForm.servicetime}
                    onChange={(e) => setServiceForm({ ...serviceForm, servicetime: e.target.value })}
                    required
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn bg-secondary text-light" onClick={() => setShowServiceModal(false)}>
                CANCEL
              </button>

              <button
                className="btn text-light"
                style={{ background: "#0a5875" }}
                onClick={() => handleServiceSubmit()}
              >
                BOOK SERVICE NOW
              </button>
            </Modal.Footer>
          </Modal>
        )}

        {activeView === "orders" && (
          <>
            <h3 className="fw-bold" style={{ color: "#0a5875" }}>Orders & Bookings</h3>
            <div className="Order table-section">
              <h4 style={{ color: "#0a5875" }}>Orders</h4>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
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
                        <td>₱ {o.totalPrice?.toLocaleString()}</td>
                        <td>{o.date ? new Date(o.date).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <span className={`status-badge ${o.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {o.status || "Processing"}
                          </span>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="text-center">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bookings Table */}
            <div className="Service Booking table-section">
              <h4 style={{ color: "#0a5875" }}>Service Bookings</h4>
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
                        <td>{s.choosecategory}</td>
                        <td>{s.chooseservice}</td>
                        <td>{s.servicedate ? new Date(s.servicedate).toLocaleDateString() : "N/A"}</td>
                        <td className="border-bottom">
                          <span
                            className={`status-badge ${s.status?.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {s.status || "Pending"}
                          </span>
                        </td>
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
    </div >
  );
};

export default CustomerProfile;
