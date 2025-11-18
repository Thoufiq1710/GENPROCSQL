import express from "express";
const router = express.Router();
import productController from "./productController.js";

// ✅ POST - Insert or Update Product(s)
router.post("/names", productController.insertOrUpdateProduct);

export default router;
