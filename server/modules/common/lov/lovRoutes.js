import express from "express";

const router = express.Router();

import lovController from "./lovController.js";

// Route: Insert or Update Module

router.post("/names", lovController.insertOrUpdateLov);
<<<<<<< HEAD
 
export default router;
=======

export default router;
>>>>>>> 108eb895945b4117d5718eb04886ee5ef56eda18
