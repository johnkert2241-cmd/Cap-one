import express from "express";
import auth from "../middleware/auth.js";
import ServiceRequest from "../models/ServicesRequest.js";

const router = express.Router();


router.post("/", auth, async (req, res) => {
  try {
    const service = new ServiceRequest({
      ...req.body,
    });

    const saved = await service.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Failed to save service request" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      contractorId: req.contractor._id,
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

router.put("/:id", auth, async (req, res) => {
  const service = await ServiceRequest.findOne({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!service) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  Object.assign(service, req.body);
  await service.save();

  res.json(service);
});

router.delete("/:id", auth, async (req, res) => {
  const service = await ServiceRequest.findOneAndDelete({
    _id: req.params.id,
    contractorId: req.contractor._id,
  });

  if (!service) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  res.json({ message: "Request deleted" });
});


export default router;
