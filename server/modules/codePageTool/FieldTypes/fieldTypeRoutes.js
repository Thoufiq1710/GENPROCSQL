import express from "express";
const router = express.Router();
import {
  getFieldTypes,
  insertFieldTypes
} from "./fieldTypeController.js";


router.get("/getFieldTypes", getFieldTypes);
router.post("/add-field-type", insertFieldTypes);

export default router;
