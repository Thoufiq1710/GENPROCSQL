import express from "express";
const router = express.Router();

import spToolGenerationRoutes from "../modules/mysqltool/spToolGeneration/spToolGenerationRoutes.js";
import spToolRoutes from "../modules/mysqltool/spGenerator/spTool.routes.js";

router.use("/sp-gen", spToolRoutes);
router.use("/sp-tool", spToolGenerationRoutes);

export default router;
