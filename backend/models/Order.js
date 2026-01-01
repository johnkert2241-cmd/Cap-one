import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    contractorId: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
    customername: String,
    product: String,
    brand: String,
    service: String,
    phone2: String,
    address2: String,
    quantity: Number,
    time: String,
    totalPrice: { type: Number, required: true },
    date: String,
    status: {
      type: String,
      default: "Processing",
  }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
