import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { Modal, Form } from "react-bootstrap";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);

  const [formValues, setFormValues] = useState({
    customername: "",
    product: "",
    brand: "",
    service: "",
    phone2: "",
    address2: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This order will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        try {
          await axios.delete(`http://localhost:5000/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}`, },
          });
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire("Deleted!", "Order has been deleted.", "success");
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to delete order.", "error");
        }
      }
    });
  };

  // Open edit modal
  const handleEditOrder = (order) => {
    setEditOrder(order);
    setFormValues({
      customername: order.customername || "",
      service: order.service || "",
      brand: order.brand || "",
      product: order.product || "",
      phone2: order.phone2 || "",
      address2: order.address2 || "",
      quantity: order.quantity || "",
      time: formatTimeForInput(order.time),
      date: order.date ? new Date(order.date).toISOString().split("T")[0] : "",
    });
  };

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Save changes
  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/orders/${editOrder._id}`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === editOrder._id ? res.data : o))
      );

      // Close modal
      setEditOrder(null);

      Swal.fire("Updated!", "Order has been updated successfully.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order.", "error");
    }
  };

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data : o))
      );

      Swal.fire("Updated!", "Order status has been updated.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };


  const formatTimeForInput = (time) => {
    if (!time) return "";
    let [hour, minute] = time.split(":").map(Number);
    hour = hour.toString().padStart(2, "0");
    minute = minute.toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  return (

    <div className="container-fluid py-4 ">
      <h2 className="fw-bold py-3" style={{ color: "#306295" }}>Orders</h2>
      <table className="contractortable table table-hover align-middle ">
        <thead>
          <tr className="">
            <th>#</th>
            <th>Name</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Product Type</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.customername}</td>
                <td>{order.service}</td>
                <td>{order.brand}</td>
                <td>{order.product}</td>
                <td>{order.phone2}</td>
                <td>{order.address2}</td>
                <td>{order.quantity}</td>
                <td>₱ {order.totalPrice?.toLocaleString()}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>{formatTimeForInput(order.time)}</td>
                <td>
                  <button
                    style={{ background: "#2E6DA4", color: "#ffffff" }}
                    onClick={() => handleEditOrder(order)}
                  >
                    <BsPencilSquare size="25" />
                  </button>
                  <button
                    style={{ background: "#D9534F", color: "#ffffff" }}
                    onClick={() => handleDelete(order._id)}
                  >
                    <BsTrash size="25" />
                  </button>
                </td>
                <td>
                  <select
                    value={order.status || "Processing"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={`form-select fw-bold text-center status-${order.status?.toLowerCase()}`}
                    style={{ width: "160px" }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Ready to Ship">Ready to Ship</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center text-muted">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== EDIT MODAL ===== */}
      <Modal show={!!editOrder} onHide={() => setEditOrder(null)} size="lg" centered>
        <Modal.Header closeButton className="btn-close-white" style={{ backgroundColor: "#306295", color: "#ffffff" }}>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    name="customername"
                    value={formValues.customername}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Product</Form.Label>
                  <Form.Control
                    className="uppercase"
                    name="product"
                    value={formValues.service}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Brand</Form.Label>
                  <Form.Control
                    name="brand"
                    value={formValues.brand}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Service Type</Form.Label>
                  <Form.Control
                    className="uppercase"
                    name="product"
                    value={formValues.product}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>


            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    name="phone"
                    value={formValues.phone2}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    className="uppercase"
                    name="address"
                    value={formValues.address2}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    value={formValues.quantity}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    className="uppercase"
                    type="time"
                    name="time"
                    value={formValues.time}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formValues.date}
                onChange={handleChange}
              />
            </Form.Group>

          </Form>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setEditOrder(null)}>
            Cancel
          </button>
          <button style={{ backgroundColor: "#306295", color: "#fff" }} onClick={handleSaveChanges}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Orders;
