// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone2: { type: String, required: true },
  address2: { type: String, required: true }, 
  product: { type: String, required: true },
  services: { type: String, required: true },
  details: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, default: "Pending" }  
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
