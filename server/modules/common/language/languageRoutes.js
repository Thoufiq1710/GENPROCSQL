import express from "express";
const router = express.Router();
import languageController from "./languageController.js";
 
// Insert or Update Language(s)
router.post("/names", languageController.insertOrUpdateLanguage);
 
 
export default router;