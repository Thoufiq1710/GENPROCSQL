import express from "express";
const router = express.Router();

import spToolGenerationRoutes from "../modules/mysqltool/spToolGeneration/spToolGenerationRoutes.js";

router.use("/sp-gen", spToolGenerationRoutes);

export default router;
