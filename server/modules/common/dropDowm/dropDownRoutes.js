import express from "express";
import dropDownController from "./dropDownController.js";

const router = express.Router();

router.get("/:listName/:lovName", dropDownController.getLovDropdown);

export default router;
