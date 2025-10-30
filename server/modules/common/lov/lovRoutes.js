import express from "express";

const router = express.Router();

import lovController from "./lovController.js";
 
// Route: Insert or Update Module

router.post("/names", lovController.insertOrUpdateModule);
 
export default router;