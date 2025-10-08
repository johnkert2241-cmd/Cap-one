import express from "express";
import upload from "../uploads.js";
import User from "../models/User.js";

const router = express.Router();

router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullname, email, address, age, phone } = req.body;
    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (address) updateData.address = address;
    if (age) updateData.age = age;
    if (phone) updateData.phone = phone;

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, // depends on front end
      { $set: updateData },
      { new: true }
    );


    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
