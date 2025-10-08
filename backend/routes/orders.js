// server/routes/orders.js
import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.json(savedOrder); // importante: ibalik yung bagong order
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all orders 
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT 
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
