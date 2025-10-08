import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    address: { type: String, required: true },
    postalcode: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    isApproved: { type: Boolean, default: false }, // by admin
    isVerified: { type: Boolean, default: false }, // by email
    verificationToken: { type: String }, // email token
}, { timestamps: true });

export default mongoose.model("Contractor", businessSchema);