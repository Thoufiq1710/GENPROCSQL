import express from "express";
const router = express.Router();

import commonRoutes from "./commonRoutes.js";

router.use("/common", commonRoutes);

export default router;