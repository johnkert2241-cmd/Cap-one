import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password, address, age, phone } = req.body;

        if (!fullname || !email || !password || !address || !age || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullname, email, password: hashedPassword, address, age, phone });
        await newUser.save();

        res.status(201).json({ message: "Registered Successfully" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error, try again later" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "No account found with this email address" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Login failed. Check your email and password." });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || "secret123",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                address: user.address,
                age: user.age,
                phone: user.phone,   
                profileImage: user.profileImage, 
                token,
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

export default router