import express from "express";
const router = express.Router();

import commonRoutes from "./commonRoutes.js";
import mysqlSPToolRoutes from "./mysqlSPToolRoutes.js";
import codegenRoutes from "./codegenRoutes.js";

// Correct path based on your folder structure
import {
    getFieldTypes,
    insertFieldTypes
} from "../modules/codePageTool/FieldTypes/fieldTypeController.js";

router.get("/getFieldTypes", getFieldTypes);

router.post("/add-field-type", insertFieldTypes);

router.use("/codegen-tool", codegenRoutes);

router.use("/common", commonRoutes);

router.use("/mysql-tool", mysqlSPToolRoutes);

export default router;
