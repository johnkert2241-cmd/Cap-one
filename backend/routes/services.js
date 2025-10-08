import express from "express";
import Service from "../models/Services.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// Create service request
router.post("/", async (req, res) => {
  try {

    const newService = new Service(req.body);
    await newService.save();


    const userId = req.body.userId || req.body._id;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const newBooking = new Booking({
      userId: req.body.userId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone2: req.body.phone2,
      address2: req.body.address2,
      product: req.body.product,
      services: req.body.services,
      details: req.body.details,
      date: req.body.date,
    });
    await newBooking.save();

    res.status(201).json({
      message: "Service & Booking saved successfully",
      service: newService,
      booking: newBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all services (filtered by firstname if provided)
router.get("/", async (req, res) => {
  try {
    const { firstname } = req.query;
    const filter = firstname ? { firstname } : {};
    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single service
router.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  try {
    // 1. Delete the service
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    // 2. Delete the booking that matches userId + details
    await Booking.deleteMany({ serviceId: req.params.id });

    res.json({ message: "Service and related booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
