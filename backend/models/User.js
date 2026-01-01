import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    profileImage: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
