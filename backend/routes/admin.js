import express from "express";
import Contractor from "../models/Business.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Approve Business

router.get("/pending", async (req, res) => {
  try {
    const businesses = await Contractor.find({ isApproved: false });
    res.json(businesses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/approve/:id", async (req, res) => {
  try {
    const business = await Contractor.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    business.isApproved = true;
    await business.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS  // your gmail app password
      }
    });

    await transporter.sendMail({
      from: `"AircolingPH ADMIN" <no-reply@aircolingph.com>`,
      to: business.email,
      subject: "Your Business Registration is Approved!",
      html: `
        <h2>Congratulations ${business.businessName}!</h2>
        <p>Your business account has been approved. You can now login using the link below:</p>
        <a href="http://localhost:3000/BusinessLogin" 
           style="background:#3085d6; color:white; padding:10px 25px; text-decoration:none; border-radius:5px;">
           Login to Dashboard
        </a>
      `
    });

    res.json({ message: "Business approved and email sent!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/reject/:id", async (req, res) => {
  try {
    await Contractor.findByIdAndDelete(req.params.id);
    res.json({ message: "Business request rejected and removed." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
