import express from "express";

const router = express.Router();

import moduleController from "./moduleController.js";
 
// Route: Insert or Update Module

router.post("/names", moduleController.insertOrUpdateModule);
 
export default router;

 