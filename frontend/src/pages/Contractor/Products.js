import React, { useState, useEffect } from "react";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

function Products() {

  const [activeTab, setActiveTab] = useState("Aircon");
  const [editValues, setEditValues] = useState({});
  const [airconProducts, setAirconProducts] = useState([])
  const [refrigeratorProducts, setRefrigeratorProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    brand: "",
    type: "",
    details: "",
    price: "",
    address: "",
    image: null,
    category: "Aircon",
  });

  const products = activeTab === "Aircon" ? airconProducts : refrigeratorProducts;

  useEffect(() => {
    setNewProduct((prev) => ({
      ...prev,
      category: activeTab,
    }));
  }, [activeTab]);


  // Fetch products mula sa backend
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/products/product", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = res.data.map((p) => ({
        ...p,
        price: p.price !== undefined && p.price !== null ? Number(p.price) : 0,
      }));
      setAirconProducts(data.filter((p) => p.category === "Aircon"));
      setRefrigeratorProducts(data.filter((p) => p.category === "Refrigerator"));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  // Add product
  const handleAddProduct = async () => {
    if (!newProduct.category.trim() || !newProduct.brand.trim() ||
      !newProduct.type.trim() || !newProduct.details.trim()
      || !newProduct.price.toString().trim() || !newProduct.image) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill out all fields before saving.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", newProduct.category);
      formData.append("brand", newProduct.brand);
      formData.append("type", newProduct.type);
      formData.append("details", newProduct.details);
      formData.append("price", Number(newProduct.price) || 0);
      formData.append("image", newProduct.image);

      const contractorId = localStorage.getItem("contractorId");
      formData.append("contractorId", contractorId);

      const { data: addedProduct } = await axios.post(
        "http://localhost:5000/products/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (addedProduct.category === "Aircon") {
        setAirconProducts((prev) => {
          const newState = [...prev, addedProduct];
          localStorage.setItem("airconProducts", JSON.stringify(newState));
          return newState;
        });
      } else {
        setRefrigeratorProducts((prev) => {
          const newState = [...prev, addedProduct];
          localStorage.setItem("refrigeratorProducts", JSON.stringify(newState));
          return newState;
        });
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product has been added successfully.",
      }).then(() => {

        // Reset form
        setNewProduct({
          category: activeTab,
          brand: "",
          type: "",
          details: "",
          price: "",
          image: null,
        });

        const modalEl = document.getElementById("addProductModal");
        const modal = Modal.getOrCreateInstance(modalEl);
        modal.hide();

        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
      });

      fetchProducts();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Invalid",
        text: err.response?.data?.message || "Failed to save product",
      });
    }
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditValues({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: name === "price" ? Number(value) || 0 : value,
    });
  };

  const handleSave = async (id, updatedProduct) => {
    try {
      const formData = new FormData();
      formData.append("brand", updatedProduct.brand);
      formData.append("type", updatedProduct.type);
      formData.append("details", updatedProduct.details);
      formData.append("price", updatedProduct.price);
      formData.append("category", updatedProduct.category);

      const res = await axios.put(
        `http://localhost:5000/products/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "<span style='color:#198754;'>Updated Successfully</span>",
        text: "The product has been updated!",
      });

      setEditingProduct();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update product."
      });
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios.delete(`http://localhost:5000/products/${id}`);
          Swal.fire({
            icon: "success",
            title: "Product has been deleted!",
          });

          // agad tanggalin sa state
          if (activeTab === "Aircon") {
            setAirconProducts((prev) => prev.filter((p) => p._id !== id));
          } else {
            setRefrigeratorProducts((prev) => prev.filter((p) => p._id !== id));
          }
          fetchProducts();
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  return (

    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4 border-bottom">
        <h2 className="fw-bold" style={{ color: "#0A5875" }}>Products</h2>
        {/* Tabs */}

        <div className="ms-auto">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button className={`nav-link fw-semibold  ${activeTab === "Aircon" ? "active" : ""}`} onClick={() => setActiveTab("Aircon")}>Aircon</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link fw-semibold ${activeTab === "Refrigerator" ? "active" : ""}`} onClick={() => setActiveTab("Refrigerator")}>Refrigerator</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Products Grid */}
      <div className="row py-3 overflow-auto" style={{ maxHeight: "82vh", }}>
        {products.map((product) => (
          <div className="col-md-6 mb-4" key={product._id}>
            <div className="card shadow border-0 h-100 rounded-3 overflow-hidden">
              <h5 className="card-title fw-bold uppercase" style={{ color: "#0A5875" }}>
                {product.contractorId?.businessName}
              </h5>
              <div className="row g-0">
                <div className="col-md-5 d-flex align-items-center justify-content-center">
                  {product.image?.data ? (
                    <img
                      src={`data:${product.image.contentType};base64,${product.image.data}`}
                      alt={product.brand}
                      className="img-fluid"
                      style={{ maxHeight: "230px", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-box-seam fs-1 text-muted"></i>
                      <p className="small text-muted mt-2">No Image</p>
                    </div>
                  )}
                </div>
                <div className="col-md-7">
                  <div className="card-body">
                    {editingProduct === product._id ? (
                      <>
                        <input
                          name="brand"
                          className="form-control mb-2"
                          value={editValues.brand}
                          onChange={handleEditChange} />

                        <input
                          name="type"
                          className="form-control mb-2"
                          value={editValues.type}
                          onChange={handleEditChange} />

                        <textarea
                          name="details"
                          className="form-control mb-2"
                          value={editValues.details}
                          onChange={handleEditChange} />

                        <input
                          type="number"
                          name="price"
                          className="form-control mb-2"
                          value={editValues.price}
                          onChange={handleEditChange} />

                        <button className="btn me-2" style={{ background: "#0A5875", color: "#fff" }}
                          onClick={() => handleSave(product._id, editValues)}>Save</button>
                        <button className="btn btn-secondary"
                          onClick={() => setEditingProduct(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title fw-bold uppercase" style={{ color: "#0A5875" }}>{product.brand}</h5>
                        <p className="mb-1 uppercase">{product.type}</p>
                        <p className="card-text small text-muted">{product.details}</p>
                        <p className="fw-bold fs-5" style={{ color: "#0A5875" }}>₱ {(product.price).toLocaleString()}</p>
                        <div className="d-flex justify-content-between">
                          <div>
                            <button className="edit me-2"
                              onClick={() => handleEdit(product)}>Edit</button>
                            <button className="delete"
                              onClick={() => handleDelete(product._id)}>Delete</button>
                          </div>
                          <div>
                            <button
                              className={`btn btn-md ${product.published ? "btn-danger" : "btn-success"} text-white shadow-sm ms-2`}
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://localhost:5000/products/${product._id}/publish`, {
                                    method: "PUT",
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data.message || "Failed to toggle publish");

                                  Swal.fire({
                                    icon: "success",
                                    title: data.message,
                                    showConfirmButton: false,
                                    timer: 1500,
                                  });

                                  fetchProducts();
                                } catch (err) {
                                  console.error("Publish error:", err);
                                  Swal.fire({
                                    icon: "error",
                                    title: "Failed",
                                    text: "Could not update publish status",
                                  });
                                }
                              }}
                            >
                              {product.published ? "Unpublish" : "Publish"}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Product Card */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow p-3 mb-5 bg-body rounded h-100 d-flex align-items-center justify-content-center rounded-3">
            <button
              className="fs-4 py-2 productsmodal"
              data-bs-toggle="modal"
              data-bs-target="#addProductModal"
            >
              + Add {activeTab}
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ background: "#0A5875", color: "#fff" }}>
              <label className="modal-title fs-4">Add New Product</label>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  value={activeTab}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input type="text" name="brand" className="form-control" onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <input type="text" name="type" className="form-control" onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Details</label>
                <textarea name="details" className="form-control" rows="3" onChange={handleInputChange}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" name="price" className="form-control" onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Upload Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                {newProduct.image && (
                  <img
                    src={newProduct.image instanceof File ? URL.createObjectURL(newProduct.image) : newProduct.image}
                    alt="Preview"
                    className="img-fluid mt-3 rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn" style={{ background: "#0A5875", color: "#fff" }} onClick={handleAddProduct}>Add Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
