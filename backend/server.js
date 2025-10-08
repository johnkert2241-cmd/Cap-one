import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import businessRoutes from "./routes/business.js";
import productsRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import servicesRoutes from "./routes/services.js";
import bookingRoutes from './routes/booking.js'


import adminRoutes from './routes/admin.js'


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/business", businessRoutes);
app.use("/booking", bookingRoutes);

app.use("/products", productsRoutes);
app.use("/orders", orderRoutes);
app.use("/services", servicesRoutes);

app.use("/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => console.error("Connection error:", err));
