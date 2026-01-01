import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { Modal, Form } from "react-bootstrap";

function ServicesRequest() {

  const [services, setServices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    customername: "",
    phone: "",
    address: "",
    choosecategory: "",
    chooseservice: "",
    servicedate: "",
    status: "Pending",
  });

  // Delete service
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Service will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:5000/servicesRequest/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setServices(services.filter((service) => service._id !== id));
          Swal.fire("Deleted!", "The request has been deleted.", "success");
        } catch (err) {
          console.error("Delete failed", err);
          Swal.fire("Error!", "Failed to delete service.", "error");
        }
      }
    });
  };

  // Open edit modal
  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      customername: service.customername,
      phone: service.phone,
      address: service.address,
      choosecategory: service.choosecategory,
      chooseservice: service.chooseservice,
      servicedate: new Date(service.servicedate).toISOString().split("T")[0],
    });
    setShowEditModal(true);
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/servicesRequest/${selectedService._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setServices(
        services.map((s) =>
          s._id === selectedService._id ? { ...s, ...formData } : s
        )
      );
      setShowEditModal(false);
      Swal.fire("Updated!", "Service request updated successfully.", "success");
    } catch (err) {
      console.error("Update failed", err);
      Swal.fire("Error!", "Failed to update service.", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/servicesRequest/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setServices((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );

      Swal.fire("Updated!", "Service status has been updated.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update service status.", "error");
    }
  };


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/servicesRequest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  return (

    <div className="container-fluid py-4">
      <h2 className="fw-bold py-3" style={{ color: "#306295" }} >Service Requests</h2>
      <table className="contractortable table table-hover align-middle">
        <thead>
          <tr>
            <th>#</th>
            <th>Firstname</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Product</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {services.length > 0 ? (
            services.map((s, i) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td>{s.customername}</td>
                <td>{s.phone}</td>
                <td className="uppercase">{s.address}</td>
                <td className="uppercase">{s.choosecategory}</td>
                <td className="uppercase">{s.chooseservice}</td>
                <td>{new Date(s.servicedate).toLocaleDateString()}</td>
                <td className="align-middle">
                  <select
                    value={s.status || "Pending"}
                    onChange={(e) => updateStatus(s._id, e.target.value)}
                    className="form-select"
                    style={{ width: "120px" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Disapproved">Disapproved</option>
                  </select>
                </td>

                <td>
                  <button
                    style={{ background: "#2E6DA4", color: "#ffffff" }}
                    onClick={() => handleEdit(s)}
                  >
                    <BsPencilSquare size="25" />
                  </button>

                  <button
                    style={{ background: "#D9534F", color: "#ffffff" }}
                    onClick={() => handleDelete(s._id)}
                  >
                    <BsTrash size="25" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center text-muted">
                No service requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="text-white btn-close-white" style={{ backgroundColor: "#306295" }}>
          <Modal.Title>Edit Service Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="customername"
                value={formData.customername}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Product</Form.Label>
              <Form.Control
                name="choosecategory"
                value={formData.choosecategory}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Service</Form.Label>
              <Form.Control
                name="chooseservice"
                value={formData.chooseservice}
                onChange={handleChange}
              />
            </Form.Group>
       
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="servicedate"
                value={formData.servicedate}
                onChange={handleChange}
              />
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </button>
          <button style={{ backgroundColor: "#306295", color: "#fff" }} onClick={handleSave}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ServicesRequest;
