
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customername: { type: String, required: true },
  product: { type: String, required: true },
  phone1: { type: String, required: true },
  service: { type: String, required: true },
  address1: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  brand: { type: String, required: true },
  date: { type: Date, default: Date.now },
},{ timestamps: true });

export default mongoose.model("Order", orderSchema);
