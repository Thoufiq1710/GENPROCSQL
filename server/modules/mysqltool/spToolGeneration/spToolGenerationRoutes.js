import express from "express";
import spToolGenerationController from "./spToolGenerationController.js";

const router = express.Router();

router.post("/", spToolGenerationController.insertOrUpdateSPTool);

export default router;
