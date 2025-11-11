import masterGridService from "./masterGridService.js";
import normalize from "../../../utils/normalize.js";

const masterGridController = {
  bindMasterGrid: async (req, res) => {
    try {
      // ✅ Accept both query params and JSON body
      const tableName = req.params.tableName;
      const filter1 = normalize(req.params.filter1);
      const filter2 = normalize(req.params.filter2);
      const filter3 = normalize(req.params.filter3);
      const userId = normalize(req.params.userId);

      // Validation
      if (!tableName || tableName.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Table name is required.",
        });
      }

      // Call Service
      const result = await masterGridService.bindMasterGrid({
        tableName,
        filter1,
        filter2,
        filter3,
        userId,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }

      // Success Response
      res.status(200).json({
        success: true,
        message: result.message,
        totalRecords: result.data.length,
        data: result.data,
      });
    } catch (err) {
      console.error("❌ Controller Error (bindMasterGrid):", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred while fetching master grid.",
        error: err.message,
      });
    }
  },
  editBindMasterGrid: async (req, res) => {
    try {
      // ✅ Accept both query params and JSON body
      const { tableName, id = null } = req.params;

      // Validation
      if (!tableName || tableName.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Table name is required.",
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Record ID is required.",
        });
      }

      // Call Service
      const result = await masterGridService.editBindMasterGrid({
        tableName,
        id,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error,
        });
      }

      // Success Response
      res.status(200).json({
        success: true,
        message: result.message,
        totalRecords: result.data.length,
        data: result.data,
      });
    } catch (err) {
      console.error("❌ Controller Error (editBindMasterGrid):", err.message);
      res.status(500).json({
        success: false,
        message:
          "Server error occurred while fetching edit bind master grid data.",
        error: err.message,
      });
    }
  },
};

export default masterGridController;
