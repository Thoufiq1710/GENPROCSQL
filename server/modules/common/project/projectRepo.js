import pool from "../../../config/db.js";

const projectRepo = {
  insertOrUpdateProject: async (
    projectId,
    projectName,
    languageId,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query =
        "CALL LT_DC_DCS_SP_Insert_Update_PROJECT(?, ?, ?, ?, ?, ?, @p_LogicApps_Result);";

      // Execute stored procedure
      await pool.query(query, [
        projectId,
        projectName,
        languageId,
        createdUser,
        status,
        inactiveReason,
      ]);

      // Fetch OUT parameter
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );
      console.log("Stored Procedure Result:", resultRows);
      const message = resultRows?.[0]?.message || "Unknown response";

      const isError =
        message.toLowerCase().includes("error") ||
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("failed") ||
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("not found");

      return {
        success: !isError,
        message,
      };
    } catch (err) {
      console.error(
        "❌ Repository Error (insertOrUpdateProject):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating project in repo.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};

export default projectRepo;
