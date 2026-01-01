import express from "express";
import Contractor from "../models/Business.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import fs from "fs";
import auth from "../middleware/auth.js";
import upload from "../uploads.js";


const router = express.Router();

router.get("/profile", auth, (req, res) => {
    res.json(req.contractor);
});

// Signup Route
router.post("/", upload.single("businessPermit"), async (req, res) => {
    try {

        const { businessName, address, fullname, email, phone, password } = req.body;

        const existing = await Contractor.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const newBusiness = new Contractor({
            businessName,
            address,
            fullname,
            email,
            phone,
            password: hashedPassword,
            verificationToken,
            isApproved: false,
            isVerified: false,
            businessPermit: req.file
                ? `/uploads/${req.file.filename}`
                : null,
        });

        await newBusiness.save();

        // send email with verification link
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const verifyUrl = `http://localhost:5000/business/verify/${verificationToken}`;

        await transporter.sendMail({
            from: `"AircolingPH ADMIN" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Please verify your email",
            html: `
        <h2>Hello, ${businessName}</h2>
        <p>Thanks for registering your business. Please click below to verify your email:</p>
        <a href="${verifyUrl}" 
           style="background:#3085d6; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
           Verify Email
        </a>
      `
        });

        res.status(201).json({ message: "Signup successful! Please check your email to verify your account." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/verify/:token", async (req, res) => {
    try {
        const business = await Contractor.findOne({ verificationToken: req.params.token });
        if (!business) return res.status(400).json({ message: "Invalid or expired token" });

        business.isVerified = true;
        business.verificationToken = null; // clear token
        await business.save();

        res.send(`
            <div style="text-align:center;">
              <h2 style="color:green; font-family:Arial, sans-serif;">
                ✅ Email verified successfully! Just wait for your business to be approved.
              </h2>
            </div>
          `);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const contractor = await Contractor.findOne({ email });

        if (!contractor) {
            return res.status(400).json({ message: "Account not found this email" });
        }

        if (!contractor.isVerified) {
            return res.status(400).json({ message: "Please verify your email first" });
        }

        if (!contractor.isApproved) {
            return res.status(400).json({ message: "Your account is not approved yet by admin." });
        }

        const isMatch = await bcrypt.compare(password, contractor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Check your email and password" });
        }

        // create JWT token
        const token = jwt.sign(
            { id: contractor._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            contractor: {
                id: contractor._id,
                businessName: contractor.businessName,
                email: contractor.email,
                address: contractor.address,
                phone: contractor.phone,
            },
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/profile", auth, upload.single("profileImage"), async (req, res) => {
    try {
        const contractor = req.contractor;
        const { businessName, email, address, phone } = req.body;

        if (businessName) contractor.businessName = businessName;
        if (email) contractor.email = email;
        if (address) contractor.address = address;
        if (phone) contractor.phone = phone;

        if (req.file) {
            if (contractor.profileImage) {
                const oldImage = contractor.profileImage.replace("/uploads/", "");
                const oldPath = `uploads/${oldImage}`;

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            contractor.profileImage = `/uploads/${req.file.filename}`;
        }

        await contractor.save();

        res.json({
            message: "Profile updated successfully",
            profileImage: contractor.profileImage,
        });

    } catch (err) {
        console.error("Update profile error:", err);
        res.status(500).json({ message: err.message });
    }
});

router.put("/profile/remove-image", auth, async (req, res) => {
    try {
        const contractor = req.contractor;

        // Check if may existing image
        if (contractor.profileImage) {
            const oldImage = contractor.profileImage.replace("/uploads/", "");
            const oldPath = `uploads/${oldImage}`;

            // Delete from folder
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            // Remove from database
            contractor.profileImage = null;
            await contractor.save();
        }

        res.json({ message: "Profile image removed successfully" });

    } catch (err) {
        console.error("Image remove error:", err);
        res.status(500).json({ message: "Server error" });
    }
});




export default router;
