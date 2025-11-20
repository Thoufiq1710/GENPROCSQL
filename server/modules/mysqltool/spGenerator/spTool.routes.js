import express from "express";
import { generateSP } from "./spTool.controller.js";

const router = express.Router();

router.get("/:id", generateSP);

export default router;
