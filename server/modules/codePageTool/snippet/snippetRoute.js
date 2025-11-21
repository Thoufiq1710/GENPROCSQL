const snippetController = require("./snippetContoller");
const express = require("express");
const router = express.Router();

// Define route to get snippet by ID
router.get("/", snippetController.getSnippet);

module.exports = router;
