import pool from "../../../config/db.js";

const masterGridRepo = {
  bindMasterGrid: async (tableName, filter1, filter2, filter3, userId) => {
    try {
      const query = "CALL LT_DCS_SP_Bind_Master_Grid(?, ?, ?, ?, ?)";
      const [rows] = await pool.query(query, [
        tableName,
        filter1 || null,
        filter2 || null,
        filter3 || null,
        userId || null,
      ]);

      // MySQL stored procedures return an array of result sets; we take the first
      const gridData = rows?.[0] || [];

      return {
        success: true,
        data: gridData,
        message: "Master grid data fetched successfully",
      };
    } catch (err) {
      console.error(
        "❌ Repository Error (bindMasterGrid):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error fetching grid data from repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
  editBindMasterGrid: async (tableName, id) => {
    try {
      const query = "CALL LT_DCS_SP_Edit_Bind_Master_Grid(?, ?)";
      const [rows] = await pool.query(query, [tableName, id]);

      // MySQL stored procedures return an array of result sets; we take the first
      const editData = rows?.[0] || [];

      return {
        success: true,
        data: editData,
        message: "Edit bind master grid data fetched successfully",
      };
    } catch (err) {
      console.error(
        "❌ Repository Error (editBindMasterGrid):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error fetching edit bind master grid data from repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};

export default masterGridRepo;
