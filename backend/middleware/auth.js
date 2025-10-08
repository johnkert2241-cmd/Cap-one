import jwt from "jsonwebtoken";
import Contractor from "../models/Business.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.contractor = await Contractor.findById(decoded.id).select("-password");

    if (!req.contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Account not found" });
  }
};

export default auth;
