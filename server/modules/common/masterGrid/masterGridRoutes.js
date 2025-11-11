import express from "express";
const router = express.Router();
import masterGridController from "./masterGridController.js";

router.get("/:tableName/:filter1", masterGridController.bindMasterGrid);
router.get("/editbind/:tableName/:id", masterGridController.editBindMasterGrid);

export default router;
   