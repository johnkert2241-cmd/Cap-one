import mongoose from "mongoose";

const servicesRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contractorId: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
    customername: String,
    phone: String,
    address: String,
    service: String,
    choosecategory: String,
    chooseservice: String,
    servicedate: String,
    servicetime: String,
    status: {
      type: String,
      default: "Pending",
    }
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", servicesRequestSchema);
