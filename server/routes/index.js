import express from "express";
const router = express.Router();

import commonRoutes from "./commonRoutes.js";
import mysqlSPToolRoutes from "./mysqlSPToolRoutes.js";

router.use("/common", commonRoutes);

router.use("/mysql-tool", mysqlSPToolRoutes);

export default router;
