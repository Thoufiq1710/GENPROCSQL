import express from "express";
const router = express.Router();
import projectController from "./projectController.js";    
 
// ✅ POST - Insert or Update Project
router.post("/names", projectController.insertOrUpdateProject);
 
export default router;