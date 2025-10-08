import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

import Swal from 'sweetalert2'
import axios from "axios";

import Header from "../components/Home/Header";
import Navmain from "../components/Home/Navmain";
import Faq from "../components/Home/Faq";
import Footer from "../components/Home/FooterContact";
import About from "../components/Home/AboutUs";



const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Home() {
  const [, setOrders] = useState([]);
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showServiceModal, setShowServiceModal] = useState(false);

  // PURCHASE DATA
  const [orderData, setOrderData] = useState({
    customername: "",
    product: "",
    brand: "",
    service: "",
    phone1: "",
    address1: "",
    quantity: 1,
    date: ""
  });

  // SERVICES DATA
  const [serviceData, setServiceData] = useState({
    firstname: "",
    lastname: "",
    phone2: "",
    address2: "",
    product: "",
    services: "",
    details: "",
    date: ""
  });

  const handleOpenServiceModal = (product) => {
    setSelectedProduct(product);
    setShowServiceModal(true);
  };

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/publish`);
        setProducts(res.data.filter((p) => p.published));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // scroll to section
  useEffect(() => {
    if (location.hash) {
      const section = document.querySelector(location.hash);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // filter products
  const filteredProducts = products.filter((p) =>
    query
      ? [p.brand, p.category, p.type, p.details].some((field) =>
        field?.toLowerCase().includes(query.toLowerCase())
      )
      : true
  );

  // HANDLE ERROR NO USER
  const handlePurchaseClick = (product) => {
    // No user 
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        text: "You need to login before purchasing.",
      }).then(() => navigate("/login"));
      return;
    }

    // when users logged in
    setSelectedProduct(product);

    setOrderData({
      userId: user._id || user.id,
      customername: user.fullname || "",
      product: product.type,
      brand: product.brand,
      service: product.category,
      phone1: user.phone || "",
      address1: user.address || "",
      quantity: 1,
      date: ""
    });
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!orderData.customername) newErrors.customername = "Customer name is required";
    if (!orderData.phone1) newErrors.phone1 = "Phone number is required";
    if (!orderData.address1) newErrors.address1 = "Address is required";
    if (!orderData.date) newErrors.date = "Date is required";
    if (!orderData.quantity) newErrors.quantity = "Quantity must be greater than 0";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        html: Object.values(newErrors).map(err => `<p>${err}</p>`).join(""),
      });
      return false;
    }
    return true;
  };

  // ORDER PURCHASE
  const handleConfirmPurchase = async () => {
    try {
      if (!validateForm()) return;

      // FOR ORDER
      const newOrder = {
        ...orderData,
        date: orderData.date || new Date().toISOString(), // standardized date format
        userId: user._id || user.id,
      };

      const res = await axios.post("http://localhost:5000/orders", newOrder);

      Swal.fire({
        icon: "success",
        title: "Order Submitted!",
        text: "Your order has been placed successfully.",
      });

      setShowModal(false);
      setSelectedProduct(null);

      setOrders((prev) => [res.data, ...prev]);
      // handle Error
      setOrderData({
        customername: "",
        product: "",
        brand: "",
        service: "",
        phone1: "",
        address1: "",
        quantity: 1,
        date: ""
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: err.response?.data?.error || "Something went wrong. Please try again.",
      });
    }
  };

  // handle service form input
  const handleServiceChange = (e) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  // load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);


  // handle service submit
  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        text: "You need to login before purchasing.",
      }).then(() => navigate("/login"));
      return;
    }

    // Validate required fields
    const { firstname, lastname, phone2, address2, product, services, details } = serviceData;

    if (!firstname || !lastname || !phone2 || !address2 || !product || !services || !details) {
      alert("Please fill all required fields.");
      return;
    }

    // FOR SERVICE
    const newService = {
      ...serviceData,
      userId: user._id || user.id,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:5000/services", newService);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Service request submitted!",
      });

      // Reset form
      setServiceData({
        firstname: "",
        lastname: "",
        phone2: "",
        address2: "",
        product: "",
        services: "",
        details: "",
        date: "",
      });

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to submit service request.");
    }
  };


  return (
    <div className="home">
      <Header />
      <div className="home-page">
        <Navmain query={query} setQuery={setQuery} />
      </div>

      {/* PRODUCTS CAROUSEL */}
      <div className="bg-light py-5">
        <div className="container">
          {filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map((product, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="carduser card h-100 shadow-sm">
                    <img
                      src={`data:${product.image.contentType};base64,${product.image.data}`}
                      className="card-img-top"
                      alt={product.type}
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <p className="fw-bold fs-4 text-info">{product.category}</p>
                      <p className="card-text fw-bold">{product.brand}</p>
                      <p className="card-title ">{product.type}</p>
                      <p className="card-details">{product.details}</p>
                      <p className="card-details fs-5 fw-bold text-success">₱ {(product.price).toLocaleString()}</p>
                      <button className="btn btn-success text-light"
                        variant="primary"
                        onClick={() => handlePurchaseClick(product)}
                      >
                        Purchase
                      </button>

                      {product.offerService === "Yes" && (
                        <button
                          className="btn btn-primary flex-fill"
                          onClick={() => handleOpenServiceModal(product)}
                        >
                          Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center fw-bold">No products available</p>
          )}
        </div>
      </div>

      {/* PURCHASE MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title>
            Purchase Form {selectedProduct ? `` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  name="customername"
                  className={`form-control ${errors.customername ? "is-invalid" : ""}`}
                  value={orderData.customername}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  required
                />
                {errors.customername && <div className="invalid-feedback">{errors.customername}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Product</label>
                <input
                  type="text"
                  name="product"
                  className={`form-control ${errors.product ? "is-invalid" : ""}`}
                  value={orderData.product}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })

                  }
                  disabled
                />
                {errors.product && <div className="invalid-feedback">{errors.product}</div>}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone1"
                  className={`form-control ${errors.phone1 ? "is-invalid" : ""}`}
                  value={orderData.phone1}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  required
                />
                {errors.phone1 && <div className="invalid-feedback">{errors.phone1}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Service</label>
                <input
                  type="text"
                  name="service"
                  className={`form-control ${errors.service ? "is-invalid" : ""}`}
                  value={orderData.service}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address1"
                  className={`form-control ${errors.address1 ? "is-invalid" : ""}`}
                  value={orderData.address1}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  required
                />
                {errors.address1 && <div className="invalid-feedback">{errors.address1}</div>}

              </div>
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              <div className="col-md-6 mb-3">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className={`form-control ${errors.brand ? "is-invalid" : ""}`}
                  value={orderData.brand}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  disabled
                />

              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                  value={orderData.quantity}
                  min={1}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      quantity: e.target.value === "" ? "" : Math.max(1, Number(e.target.value))
                    })
                  }
                  onBlur={() =>
                    setOrderData({
                      ...orderData,
                      quantity: orderData.quantity === "" ? 1 : orderData.quantity
                    })
                  }
                  required
                />
                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}

              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  value={orderData.date}
                  onChange={(e) =>
                    setOrderData({ ...orderData, [e.target.name]: e.target.value })
                  }
                  required
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>
            </div>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="bg-secondary text-light" variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="bg-success text-light" variant="primary" onClick={handleConfirmPurchase}>
            Confirm Purchase
          </button>
        </Modal.Footer>
      </Modal>

      {/* SERVICE MODAL */}
      <Modal
        show={showServiceModal}
        onHide={() => setShowServiceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title>Book a Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleServiceSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={serviceData.firstname}
                  onChange={handleServiceChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={serviceData.lastname}
                  onChange={handleServiceChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone2"
                  className="form-control"
                  value={serviceData.phone2}
                  onChange={handleServiceChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address2"
                  className="form-control"
                  value={serviceData.address2}
                  onChange={handleServiceChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Product</label>
                <input
                  type="text"
                  name="product"
                  className="form-control"
                  value={serviceData.product}
                  onChange={handleServiceChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Service Type</label>
                <select
                  name="services"
                  className="form-select"
                  value={serviceData.services}
                  onChange={handleServiceChange}
                  required
                >
                  <option value="">-- Select Service --</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Repair">Repair</option>
                  <option value="Installation">Installation</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Details</label>
              <textarea
                name="details"
                className="form-control"
                rows="3"
                value={serviceData.details}
                onChange={handleServiceChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Preferred Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={serviceData.date}
                onChange={handleServiceChange}
                required
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowServiceModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleServiceSubmit}>
            Submit Request
          </button>
        </Modal.Footer>
      </Modal>
      <div id="About" className="about">
        <About />
      </div>
      <div id="faq" className="faq">
        <Faq />
      </div>
      <div id="Contact" className="footer">
        <Footer />
      </div>
      <div className="text-center p-3 bg-temporary">
        <span>Copyright © 2025 | Developed by RMT</span>
      </div>
    </div>
  );
}

export default Home;
