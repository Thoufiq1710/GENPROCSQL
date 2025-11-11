import express from "express";
import errorMessageController from "./errorMessageController.js";

const router = express.Router();

// ✅ Insert or Update Error Message(s)
router.post("/", errorMessageController.insertOrUpdateErrorMessage);

export default router;
