import React, { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import Swal from "sweetalert2";

function BusinessRegistered() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null); // for editing
  const [showModal, setShowModal] = useState(false);

  // Fetch approved businesses
  useEffect(() => {
    fetch("http://localhost:5000/admin/approved")
      .then((res) => res.json())
      .then((data) => setBusinesses(data))
      .catch((err) => console.error("Error fetching businesses:", err));
  }, []);

  //  Handle Edit
  const handleEdit = (biz) => {
    setSelectedBusiness(biz);
    setShowModal(true);
  };

  //  Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the business.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/admin/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", data.message, "success");
        setBusinesses((prev) => prev.filter((b) => b._id !== id));
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  //  Handle Save after edit
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/admin/update/${selectedBusiness._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedBusiness),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Business updated successfully!", "success");
        setBusinesses((prev) =>
          prev.map((b) => (b._id === selectedBusiness._id ? selectedBusiness : b))
        );
        setShowModal(false);
      } else {
        Swal.fire("Error", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update business.", "error");
    }
  };

  return (
    <div className="Registered-container">
      <h3 className="fw-bold text-start py-4" 
      style={{ color: "#0A5875" }} >Business Registered</h3>

      <table className="table-register">
        <thead>
          <tr>
            <th>ID</th>
            <th>Business Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {businesses.length > 0 ? (
            businesses.map((biz, index) => (
              <tr key={biz._id}>
                <td>{index + 1}</td>
                <td>{biz.businessName}</td>
                <td>{biz.email}</td>
                <td>{biz.phone}</td>
                <td>{biz.address}</td>
                <td>
                  <button style={{ background: "#0A5875", color: "#ffffff" }}
                    onClick={() => handleEdit(biz)}><BsPencilSquare size="25" />
                  </button>
                  <button style={{ background: "#D9534F", color: "#ffffff" }}
                    onClick={() => handleDelete(biz._id)}><BsTrash size="25" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No approved businesses yet.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔹 Edit Modal */}
      {showModal && selectedBusiness && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0 rounded-3">
              <div className="modal-header text-white" style={{ backgroundColor: "#306295" }}>
                <h5 className="modal-title">Edit Business</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBusiness.businessName}
                    onChange={(e) =>
                      setSelectedBusiness({
                        ...selectedBusiness,
                        businessName: e.target.value,
                      })
                    }
                    placeholder="Enter business name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={selectedBusiness.email}
                    onChange={(e) =>
                      setSelectedBusiness({
                        ...selectedBusiness,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBusiness.address}
                    onChange={(e) =>
                      setSelectedBusiness({
                        ...selectedBusiness,
                        address: e.target.value,
                      })
                    }
                    placeholder="Enter address"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedBusiness.phone}
                    onChange={(e) =>
                      setSelectedBusiness({
                        ...selectedBusiness,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="modal-footer d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{ backgroundColor: "#306295", color: "#ffffff" }}
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BusinessRegistered;
