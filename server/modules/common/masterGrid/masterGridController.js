import masterGridService from "./masterGridService.js";

const masterGridController = {
  bindMasterGrid: async (req, res) => {
    try {
      // ✅ Accept both query params and JSON body
      const {
        tableName,
        filter1 = null,
        filter2 = null,
        filter3 = null,
        userId = null,
      } = req.params;

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
};

export default masterGridController;
