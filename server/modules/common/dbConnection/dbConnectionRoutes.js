import express from "express";

const router = express.Router();

import dbConnectionController from "./dbConnectionController.js";
 
// Route: Insert or Update Module

router.post("/names", dbConnectionController.insertOrUpdateDBConnection);
 
export default router;