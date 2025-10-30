import express from "express";

const router = express.Router();

import dbConnectionController from "./dbConnectionController";
 
// Route: Insert or Update Module

router.post("/names", dbConnectionController.insertOrUpdateModule);
 
export default router;