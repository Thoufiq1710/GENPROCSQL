// routes/formGenRoutes.js
const express = require("express");
const router = express.Router();
const formGenController = require("../formGen/formGenController");

router.post("/save", formGenController.saveFormGen);
router.get("/get", formGenController.getFormGenById);
router.post("/gen", formGenController.generateCode);

module.exports = router;
