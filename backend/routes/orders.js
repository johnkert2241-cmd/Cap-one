// server/routes/orders.js
import express from "express";
import auth from "../middleware/auth.js";
import Order from "../models/Order.js";

const router = express.Router();

// Create a new order
router.post("/", auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
    });

    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders 
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      contractorId: req.contractor._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EDIT 
router.put("/:id", auth, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!order) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(order, req.body);
  await order.save();
  res.json(order);
});


// Delete order
router.delete("/:id", auth, async (req, res) => {
  const order = await Order.findOneAndDelete({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!order) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json({ message: "Order deleted successfully" });
});

router.put("/:id/status", auth, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!order) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  order.status = req.body.status;
  await order.save();

  res.json(order);
});


export default router;
