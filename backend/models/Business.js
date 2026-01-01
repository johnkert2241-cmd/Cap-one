import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    address: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    profileImage: { type: String, default: null },       
    businessPermit: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
}, { timestamps: true });

export default mongoose.model("Contractor", businessSchema);
