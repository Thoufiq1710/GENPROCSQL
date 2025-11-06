import express from "express";
const router = express.Router();
import masterGridController from "./masterGridController.js";

router.get("/:tableName", masterGridController.bindMasterGrid);

export default router;
