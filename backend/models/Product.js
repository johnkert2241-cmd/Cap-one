import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    contractorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contractor",
        required: true
    }, // contractor
    category: String,
    brand: String,
    type: String,
    details: String,
    price: Number,
    image: { data: String, contentType: String, },
    published: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
