import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone2: { type: String, required: true },
    address2: { type: String, required: true },
    product: { type: String, required: true },
    services: { type: String, required: true },
    details: { type: String, required: true },
    cleaningType: { type: String, required: false },
    maintenanceDate: { type: String, required: false },
    date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);
