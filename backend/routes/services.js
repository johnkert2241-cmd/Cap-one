import express from "express";
import Service from "../models/Services.js";
import auth from "../middleware/auth.js";

const router = express.Router();

//  CREATE SERVICE
router.post("/", auth, async (req, res) => {
  try {
    const newService = new Service({
      ...req.body,
      contractorId: req.contractor._id,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(500).json({ error: "Failed to save service" });
  }
});

// GET ALL SERVICES
router.get("/", auth, async (req, res) => {
  try {
    const services = await Service.find({ contractorId: req.contractor._id })
      .populate("contractorId", "address");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

//  GET SINGLE SERVICE
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    console.error("Error getting service:", err);
    res.status(500).json({ error: "Failed to get service" });
  }
});

// UPDATE SERVICE
router.put("/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      contractorId: req.contractor._id,
    });

    if (!service) {
      return res.status(403).json({ error: "Not authorized" });
    }

    Object.assign(service, req.body);
    await service.save();

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to update service" });
  }
});


//  DELETE SERVICE
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Service.findOneAndDelete({
      _id: req.params.id,
      contractorId: req.contractor._id,
    });

    if (!deleted) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

// PUBLISH / UNPUBLISH SERVICE
router.put("/:id/publish", auth, async (req, res) => {
  const service = await Service.findOne({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!service) {
    return res.status(403).json({ error: "Not authorized" });
  }

  service.published = !service.published;
  await service.save();

  res.json({
    message: `Service ${service.published ? "published" : "unpublished"} successfully`,
    service,
  });
});


// Publish (for homepage)
router.get("/publish/list", async (req, res) => {
  try {
    const publishedServices = await Service.find({ published: true })
    .populate("contractorId", "address");
    res.json(publishedServices);
  } catch (err) {
    console.error("Error fetching published services:", err);
    res.status(500).json({ error: "Failed to fetch published services" });
  }
});

export default router;
