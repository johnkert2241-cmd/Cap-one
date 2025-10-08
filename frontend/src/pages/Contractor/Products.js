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
  const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
  const [productToPublish, setProductToPublish] = useState(null);

  const [newProduct, setNewProduct] = useState({
    brand: "",
    type: "",
    details: "",
    price: "",
    image: null,
    category: "Aircon",
    offerService: "",
  });

  const products = activeTab === "Aircon" ? airconProducts : refrigeratorProducts;

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
  // Fetch products pag component mounted
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
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
      !newProduct.type.trim() || !newProduct.offerService.trim() ||
      !newProduct.details.trim() || !newProduct.price.toString().trim() ||
      !newProduct.image) {
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
      formData.append("offerService", newProduct.offerService);
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
        const modalEl = document.getElementById("addProductModal");
        const modal = Modal.getOrCreateInstance(modalEl);
        modal.hide();
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
      });

      // Reset form
      setNewProduct({ category: activeTab, brand: "", type: "", details: "", price: "", offerService: "", image: null, });

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
        title: "Updated Successfully",
        text: "The product has been updated!",
        showConfirmButton: false,
        timer: 1500
      });

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
            showConfirmButton: false,
            timer: 1500
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

  // Handle publish
  const confirmPublish = (product) => {
    setProductToPublish(product);
    setShowPublishConfirmation(true);
  };

  const handlePublish = async () => {
    if (!productToPublish) return;
    try {
      await axios.put(`http://localhost:5000/products/${productToPublish._id}/publish`, { published: true });
      Swal.fire({ icon: "success", title: "Published!", text: "Product is now visible to users." });
      fetchProducts(); // refresh from backend
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Failed!", text: "Could not publish product." });
    } finally {
      setShowPublishConfirmation(false);
      setProductToPublish(null);
    }
  };

  const handleCancelPublish = () => {
    setShowPublishConfirmation(false);
    setProductToPublish(null);
  };


  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Products</h2>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link fw-semibold ${activeTab === "Aircon" ? "active" : ""}`} onClick={() => setActiveTab("Aircon")}>Aircon</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link fw-semibold ${activeTab === "Refrigerator" ? "active" : ""}`} onClick={() => setActiveTab("Refrigerator")}>Refrigerator</button>
        </li>
      </ul>

      {/* Products Grid */}
      <div className="row">
        {products.map((product) => (
          <div className="col-md-6 mb-4" key={product._id}>
            <div className="card shadow-lg border-0 h-100 rounded-3 overflow-hidden">
              <div className="row g-0">
                <div className="col-md-5 d-flex align-items-center justify-content-center bg-light">
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

                        <button className="btn btn-success btn-sm me-2"
                          onClick={() => handleSave(product._id, editValues)}>Save</button>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => setEditingProduct(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title fw-bold text-dark">{product.brand}</h5>
                        <p className="fw-semibold text-secondary mb-1">{product.type}</p>
                        <p className="card-text small text-muted">{product.details}</p>
                        <p className="text-success fw-bold fs-5">₱ {(product.price).toLocaleString()}</p>
                        <div className="d-flex justify-content-between">
                          <div>
                            <button className="btn btn-sm btn-outline-warning me-2 shadow-sm"
                              onClick={() => handleEdit(product)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger shadow-sm"
                              onClick={() => handleDelete(product._id)}>Delete</button>
                          </div>
                          <div>
                            {!product.published && (
                              <button className="btn btn-sm btn-success shadow-sm ms-2"
                                onClick={() => confirmPublish(product)}>Publish</button>
                            )}
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
          <div className="card shadow-lg border-0 h-100 d-flex align-items-center justify-content-center bg-light rounded-3">
            <button className="btn btn-outline-secondary btn-lg px-4 py-3 shadow-sm" data-bs-toggle="modal" data-bs-target="#addProductModal">+ Add {activeTab}</button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <div className="modal fade" id="addProductModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Add New Product</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select name="category" className="form-select" value={newProduct.category} onChange={handleInputChange}>
                  <option value="Aircon">Aircon</option>
                  <option value="Refrigerator">Refrigerator</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input type="text" name="brand" className="form-control" value={newProduct.brand} onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <input type="text" name="type" className="form-control" value={newProduct.type} onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Details</label>
                <textarea name="details" className="form-control" rows="3" value={newProduct.details} onChange={handleInputChange}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" name="price" className="form-control" value={newProduct.price} onChange={handleInputChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Do you offer a service?</label>
                <select
                  name="offerService"
                  className="form-select"
                  value={newProduct.offerService || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
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
              <button type="button" className="btn btn-primary" onClick={handleAddProduct}>Save</button>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      {showPublishConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" aria-hidden="true" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Publish</h5>
                <button type="button" className="btn-close" onClick={handleCancelPublish}></button>
              </div>
              <div className="modal-body">Are you sure you want to publish this product?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelPublish}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handlePublish}>Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
