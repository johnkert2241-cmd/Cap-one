import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
      required: true,
    },
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: String, required: true },
    availability: { type: String, required: true },
    services: { type: Array, default: [], required: true, },
    serviceType: {
      type: [String],
      default: [],
    },
    published: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
