import express from "express";
import dbConnectionController from "./dbConnectionController.js";

const router = express.Router();

// Route: Insert or Update Module

router.post("/names", dbConnectionController.insertOrUpdateDBConnection);

export default router;
