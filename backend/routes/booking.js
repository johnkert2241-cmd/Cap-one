import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// Get all bookings for specific user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
