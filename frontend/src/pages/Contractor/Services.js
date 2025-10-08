import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"
import axios from "axios";

function Services() {
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // fetch all services
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get('http://localhost:5000/services');
            setServices(res.data);
        } catch (err) {
            console.error("Failed to fetch services", err);
        }
    };

    const handleView = (service) => {
        setCurrentService(service);
        setShowModal(true);
    };

    // DELETE SERVICE
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This service will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/services/${id}`);
                    setServices(services.filter((s) => s._id !== id));

                    Swal.fire("Deleted!", "The service has been deleted.", "success");
                } catch (err) {
                    console.error("Delete failed", err);
                    Swal.fire("Error!", "Failed to delete service.", "error");
                }
            }
        });
    };

    return (
        <div className="container-fluid  py-4">
            <h2 className="fw-bold text-primary mb-4">Services</h2>
            <div className="card">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Product</th>
                                <th>Service</th>
                                <th>Details</th>
                                <th>Date</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.length > 0 ? (
                                services.map((s, i) => (
                                    <tr key={s._id}>
                                        <td>{i + 1}</td>
                                        <td>{s.firstname}</td>
                                        <td>{s.lastname}</td>
                                        <td>{s.phone2}</td>
                                        <td>{s.address2}</td>
                                        <td>{s.product}</td>
                                        <td>{s.services}</td>
                                        <th>{s.details}</th>
                                        <td>{s.date ? new Date(s.date).toISOString().split("T")[0] : "N/A"}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => handleView(s)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(s._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center text-muted">
                                        No services found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && currentService && (
                <div
                    className="custom-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="custom-modal-dialog"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                    >
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">Service Details</h5>
                            <button
                                type="button"
                                className="custom-close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            <p className="border-bottom"><strong>Name:</strong> {currentService.firstname} {currentService.lastname}</p>
                            <p className="border-bottom"><strong>Phone:</strong> {currentService.phone2}</p>
                            <p className="border-bottom"><strong>Address:</strong> {currentService.address2}</p>
                            <p className="border-bottom"><strong>Product:</strong> {currentService.product}</p>
                            <p className="border-bottom"><strong>Service:</strong> {currentService.services}</p>
                            <p className="border-bottom"><strong>Details:</strong> {currentService.details}</p>
                            <p className="border-bottom"> <strong>Date:</strong> {new Date(currentService.date).toISOString()[0]}</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Services;
