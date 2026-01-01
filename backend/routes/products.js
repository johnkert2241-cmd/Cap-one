import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST add new product
router.post("/add", auth, upload.single("image"), async (req, res) => {
    try {
        const { category, brand, type, details, price, } = req.body;
        if (!req.file) throw new Error("Image required");

        const product = new Product({
            brand,
            type,
            details,
            price,
            category,
            contractorId: req.contractor._id,
            image: {
                data: req.file.buffer.toString("base64"),
                contentType: req.file.mimetype,
            },
        });

        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// GET all products
router.get("/product", auth, async (req, res) => {
    try {
        const products = await Product.find({ contractorId: req.contractor._id })
            .populate("contractorId", "address businessName");

        const formatted = products.map((p) => ({
            ...p._doc,
            image: p.image ? {
                data: p.image.data,
                contentType: p.image.contentType
            } : null
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// GET PRODUCT PUBLISH
router.get("/publish", async (req, res) => {
    try {
        const publishedProducts = await Product.find({ published: true })
            .populate("contractorId", "businessName address");;
        res.json(publishedProducts);
    } catch (err) {
        console.error("Fetch published products error:", err);
        res.status(500).json({ message: "Failed to fetch published products" });
    }
});



// PUT update product
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const updateData = {
            brand: req.body.brand,
            type: req.body.type,
            details: req.body.details,
            price: Number(req.body.price),
            category: req.body.category,

        };
        // Only update image if new file is uploaded
        if (req.file) {
            updateData.image = {
                data: req.file.buffer.toString("base64"),
                contentType: req.file.mimetype,
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct)
            return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not update product" });
    }
});

// DELETE product
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not delete product" });
    }
});

// publish product
router.put("/:id/publish", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        product.published = !product.published;
        await product.save();

        res.json({
            message: `Product ${product.published ? "published" : "unpublished"} successfully`,
            product,
        });
    } catch (err) {
        console.error("Publish error:", err);
        res.status(500).json({ message: "Failed to toggle publish" });
    }
});




export default router;
