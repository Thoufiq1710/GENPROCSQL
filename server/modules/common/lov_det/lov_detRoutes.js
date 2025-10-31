import express from "express";

const router = express.Router();

import lov_detController from "./lov_detController.js";

// Route: Insert or Update Module

router.post("/names", lov_detController.insertOrUpdateListOfValuesDetails);

export default router;
