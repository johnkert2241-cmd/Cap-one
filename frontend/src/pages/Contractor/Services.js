import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { BsTrashFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import axios from "axios";

function AdminAddService() {

    const [businessName, setBusinessName] = useState("");
    const [image, setImage] = useState(null);
    const [services, setServices] = useState([]);
    const [editService, setEditService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [selectedAirconType, setSelectedAirconType] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [serviceTags, setServiceTags] = useState([]);
    const [serviceType, setServiceType] = useState("");
    const [removeImage, setRemoveImage] = useState(false);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/services", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setServices(res.data);
        } catch (err) {
            console.error("Failed to fetch services:", err);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/business/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBusinessName(res.data.businessName);

            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (editService) {
            const form = document.getElementById("serviceForm");
            if (form) {
                form["businessName"].value = editService.businessName || "";
                form["category"].value = editService.category || "";
                form["duration"].value = editService.duration || "";
                form["availability"].value = editService.availability || "";
                setImage(editService.image || null);
            }
            setServiceTags(editService.services || []);
            setServiceType(
                Array.isArray(editService.serviceType)
                    ? editService.serviceType.join(", ")
                    : ""
            );
            setRemoveImage(false);
        } else {
            const form = document.getElementById("serviceForm");
            if (form) form.reset();
            setImage(null);
            setServiceTags([]);
            setServiceType("");
        }
    }, [editService]);

    const handlePublishToggle = async (svcId) => {
        try {
            const res = await fetch(`http://localhost:5000/services/${svcId}/publish`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to toggle publish");

            Swal.fire({
                icon: "success",
                title: data.message,
            });

            setServices((prev) =>
                prev.map((s) =>
                    s._id === svcId ? { ...s, published: !s.published } : s
                )
            );
        } catch (err) {
            console.error("Publish error:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to update publish status",
                text: err.message,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newService = {
            businessName: businessName,
            category: formData.get("category"),
            services: serviceTags,
            serviceType: serviceType
                ? serviceType.split(",").map(s => s.trim()).filter(Boolean)
                : [],
            duration: formData.get("duration"),
            availability: formData.get("availability"),
            image: removeImage ? null : image || editService?.image,
        };

        try {
            let response;
            let result;

            if (editService && editService._id) {
                // Update existing
                response = await fetch(`http://localhost:5000/services/${editService._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(newService),
                });

                if (!response.ok) throw new Error("Failed to update service");
                result = await response.json();

                setServices((prev) =>
                    prev.map((svc) => (svc._id === editService._id ? result : svc))
                );

                Swal.fire({
                    icon: "success",
                    title: "<span style='color:#198754;'>Updated Successfully</span>",
                    text: "The service has been updated!"
                });
            } else {
                // Add new
                response = await fetch(`http://localhost:5000/services`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(newService),
                });

                if (!response.ok) throw new Error("Failed to save service");
                result = await response.json();

                setServices((prev) => [
                    ...prev,
                    {
                        ...result,
                        businessName: newService.businessName,
                        category: newService.category,
                        duration: newService.duration,
                        availability: newService.availability,
                        image: newService.image,
                    },
                ]);

                Swal.fire({
                    icon: "success",
                    title: "Service Added!",
                    confirmButtonColor: "#3085d6",
                });
            }

            setEditService(null);
            setImage(null);
            e.target.reset();
            setShowModal(false);
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({
                icon: "error",
                title: "Failed to save service",
                text: err.message,
            });
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This service will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:5000/services/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (!response.ok) throw new Error("Delete failed");

                    setServices((prev) => prev.filter((svc) => svc._id !== id));

                    Swal.fire({
                        title: "Deleted!",
                        text: "Service deleted successfully.",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                    });
                } catch (error) {
                    console.error("Error deleting service:", error);
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to delete service.",
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                    });
                }
            }
        });
    };

    const serviceOptions = {
        Aircon: ["Cleaning", "Installation", "Repair", "Check-up", "Recolation", "Maintenance",],
        Refrigeration: ["Repair", "Check-up",],
    };

    const showAirconTypeField = () => {
        return selectedService && !["Repair", "Check-up", "Recolation", "Maintenance"].includes(selectedService);
    };

    const airconTypes = [
        "Window Type",
        "Split Type",
        "Cassette Type",
        "Floor Mounted",
        "Ceiling Suspended",
    ];

    const handleEdit = (svc) => {
        setEditService(svc);

        setSelectedCategory(svc.category || "");
        setServiceTags(svc.services || []);
        setImage(svc.image || null);
        // reset add fields
        setSelectedService("");
        setSelectedAirconType("");
        setServicePrice("");

        setRemoveImage(false);
        setShowModal(true);
    };

    const handleCancel = () => {
        setEditService(null);
        setImage(null);
        setShowModal(false);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center py-4 mb-4 border-bottom">
                <h2 className="text-left title" style={{ color: "#0A5875" }}>Services</h2>
                <button
                    className="btn"
                    style={{ background: "#0A5875", color: "#fff" }}
                    onClick={() => {
                        setEditService(null);
                        setShowModal(true);
                    }}
                >
                    + Add Service
                </button>
            </div>

            {services.length > 0 && (
                <div className="py-3">
                    <div className="row overflow-auto" style={{ maxHeight: "82vh" }}>
                        {services.map((svc, index) => (
                            <div className="col-md-6 mb-4" key={index}>
                                <div className="card shadow border-0 h-100 rounded-3 overflow-hidden">
                                    <h5 className="card-title uppercase fw-bold" style={{ color: "#0A5875" }}>{svc.businessName}</h5>
                                    <div className="row g-0">
                                        <div className="col-md-5 d-flex align-items-center justify-content-center">
                                            {svc.image ? (
                                                <img
                                                    src={
                                                        svc.image.startsWith("data:image")
                                                            ? svc.image
                                                            : `http://localhost:5000/${svc.image}`
                                                    }
                                                    alt={svc.name}
                                                    className="img-fluid"
                                                    style={{
                                                        maxHeight: "230px",
                                                        objectFit: "cover",
                                                        width: "100%",
                                                    }}
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <i className="bi bi-box-seam fs-1 text-muted"></i>
                                                    <p className="small text-muted mt-2">No Image</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-7">
                                            <div className="card-body d-flex flex-column justify-content-between">
                                                <div className="">
                                                    <p className="mb-1 fw-bold uppercase fs-5" style={{ color: "#0A5875" }}>
                                                        {svc.category}
                                                    </p>
                                                    {svc.services?.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2 py-2">
                                                            {svc.services.map((item, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="badge d-flex align-items-center gap-2"
                                                                    style={{
                                                                        background: "#0A5875",
                                                                        color: "#fff",
                                                                        fontSize: "0.80rem"
                                                                    }}
                                                                >
                                                                    {item.service}
                                                                    {item.airconType ? ` – ${item.airconType}` : ""}
                                                                    <span
                                                                        className="ms-2 px-2 py-1 rounded"
                                                                        style={{ background: "rgba(255,255,255,0.2)" }}

                                                                    >
                                                                        ₱{item.price}
                                                                    </span>

                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {svc.serviceType?.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2 align-items-center fw-bold">
                                                            Serviced:
                                                            {svc.serviceType.map((type, index) => (

                                                                <span
                                                                    key={index}
                                                                    className="badge p-1"
                                                                    style={{
                                                                        background: "#0A5875",
                                                                        color: "#fff",
                                                                        fontSize: "0.80rem"
                                                                    }}
                                                                >
                                                                    {type}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <p className="fw-bold">Open: {svc.duration}</p>
                                                    <p className="fw-bold">Schedule: {svc.availability}</p>
                                                </div>

                                                <div className="d-flex justify-content-between mt-3">
                                                    <div>
                                                        <button className="edit me-2" onClick={() => handleEdit(svc)}>
                                                            Edit
                                                        </button>
                                                        <button className="delete" onClick={() => handleDelete(svc._id)}>
                                                            Delete
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <button
                                                            className={`btn btn-md ${svc.published ? "btn-danger" : "btn-success"
                                                                } text-white`}
                                                            onClick={() => handlePublishToggle(svc._id)}
                                                        >
                                                            {svc.published ? "Unpublish" : "Publish"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Modal show={showModal} onHide={handleCancel} size="lg">
                <Modal.Header className="btn-close-white btn-close-padding-y" closeButton style={{ background: "#0A5875" }}>
                    <Modal.Title className="text-light">{editService ? "Edit Service" : "Add New Service"}</Modal.Title>
                </Modal.Header>
                <form id="serviceForm" onSubmit={handleSubmit}>
                    <Modal.Body>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label">Business Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="businessName"
                                    value={businessName}
                                    readOnly
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    name="category"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedService("");
                                        setSelectedAirconType("");
                                        setServiceTags([]);
                                        setSelectedCategory(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Aircon">Aircon</option>
                                    <option value="Refrigeration">Refrigeration</option>
                                </select>
                            </div>

                            {selectedCategory && (
                                <>
                                    <div className="col-md-4">
                                        <label className="form-label">Service</label>
                                        <select
                                            className="form-select"
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                        >
                                            <option value="">Select Service</option>
                                            {serviceOptions[selectedCategory].map((srv, i) => (
                                                <option key={i} value={srv}>{srv}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedCategory === "Aircon" && showAirconTypeField() && (
                                        <div className="col-md-4">
                                            <label className="form-label">Type of Aircon</label>
                                            <select
                                                className="form-select"
                                                value={selectedAirconType}
                                                onChange={(e) => setSelectedAirconType(e.target.value)}
                                            >
                                                <option value="">Select Type</option>
                                                {airconTypes.map((type, i) => (
                                                    <option key={i} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div className="col-md-4">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="₱"
                                            value={servicePrice}
                                            onChange={(e) => setServicePrice(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-10">
                                        <button
                                            type="button"
                                            className="btn text-light"
                                            style={{ background: "#0A5875" }}
                                            onClick={() => {
                                                if (!selectedService || !servicePrice) return;
                                                if (selectedCategory === "Aircon" && showAirconTypeField() && !selectedAirconType) return;
                                                setServiceTags(prev => [
                                                    ...prev,
                                                    {
                                                        service: selectedService,
                                                        airconType: selectedCategory === "Aircon" ? (showAirconTypeField() ? selectedAirconType : null) : null,
                                                        price: servicePrice,
                                                    }
                                                ]);
                                                setSelectedService("");
                                                setSelectedAirconType("");
                                                setServicePrice("");
                                            }}>
                                            Add Service
                                        </button>
                                    </div>
                                </>
                            )}

                            {serviceTags.length > 0 && (
                                <div className="col-10 d-flex flex-wrap gap-2">
                                    {serviceTags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="badge d-flex align-items-center gap-2"
                                            style={{ background: "#0A5875", color: "#fff", fontSize: "13px" }}
                                        >
                                            {tag.service}
                                            {tag.airconType ? ` – ${tag.airconType}` : ""}
                                            {` - ₱${tag.price}`}
                                            <button
                                                type="button"
                                                style={{ background: "none" }}
                                                onClick={() =>

                                                    setServiceTags(prev =>
                                                        prev.filter((_, index) => index !== i)
                                                    )
                                                }
                                            >
                                                <TiDelete size={20} color="white" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="col-md-6">
                                <label className="form-label">Services (Use comma)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Cleaning, Installation, Repair, etc.."
                                    value={serviceType}
                                    onChange={(e) => setServiceType(e.target.value)}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Time open</label>
                                <input type="text"
                                    className="form-control"
                                    name="duration"
                                    placeholder="Ex. 7:00 AM - 5:00 PM"
                                    required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Schedule</label>
                                <input type="text"
                                    className="form-control"
                                    name="availability"
                                    placeholder="Ex. Mon - Sat"
                                    required />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">Service Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            <div className="w-50 h-50">
                                {image && (
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={image}
                                            alt="Preview"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "200px" }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                            title="Remove image"
                                            onClick={() => {
                                                setImage(null);
                                                setRemoveImage(true);
                                            }}
                                        >
                                            <BsTrashFill />
                                        </button>

                                    </div>
                                )}
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn text-light" style={{ background: "#0A5875", color: "fff" }}>
                            {editService ? "Save Changes" : "Add Service"}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}

export default AdminAddService;
