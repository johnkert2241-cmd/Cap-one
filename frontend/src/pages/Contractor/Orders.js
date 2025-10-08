import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  // EDIT order with SweetAlert
  const handleEditOrder = async (order) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Order",
      html: `
        <input id="swal-customername" class="swal2-input" placeholder="Customer Name" value="${order.customername}" />
        <input id="swal-product" class="swal2-input" placeholder="Product" value="${order.product}" />
        <input id="swal-brand" class="swal2-input" placeholder="Brand" value="${order.brand}" />
        <input id="swal-service" class="swal2-input" placeholder="Service" value="${order.service}" />
        <input id="swal-phone1" class="swal2-input" placeholder="Phone Number" value="${order.phone1}" />
        <input id="swal-address1" class="swal2-input" placeholder="Address" value="${order.address1}" />
        <input id="swal-quantity" type="number" class="swal2-input" placeholder="Quantity" value="${order.quantity}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        return {
          customername: document.getElementById("swal-customername").value,
          product: document.getElementById("swal-product").value,
          brand: document.getElementById("swal-brand").value,
          service: document.getElementById("swal-service").value,
          phone1: document.getElementById("swal-phone1").value,
          address1: document.getElementById("swal-address1").value,
          quantity: document.getElementById("swal-quantity").value,
        };
      },
    });

    if (formValues) {
      try {
        const res = await axios.put(
          `http://localhost:5000/orders/${order._id}`,
          formValues
        );
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? res.data : o))
        );
        Swal.fire("Updated!", "Order has been updated.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to update order.", "error");
      }
    }
  };

  // 🔹 DELETE order with SweetAlert
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/orders/${id}`);
          setOrders((prev) => prev.filter((order) => order._id !== id));
          Swal.fire("Deleted!", "Order has been deleted.", "success");
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Failed to delete order.", "error");
        }
      }
    });
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-primary mb-4">Orders</h2>
      <div className="card shadow-sm rounded-3">
        <div className="card-body">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Service</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.customername}</td>
                    <td>{order.product}</td>
                    <td>{order.brand}</td>
                    <td>{order.service}</td>
                    <td>{order.phone1}</td>
                    <td>{order.address1}</td>
                    <td>{order.quantity}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(order._id)}
                      >
                        Delete
                      </button>
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
        </div>
      </div>
    </div>
  );
}

export default Orders;
