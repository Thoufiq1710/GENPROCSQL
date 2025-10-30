import pool from "../../../config/db.js";
const moduleRepo = {
  insertOrUpdateModule: async (
    moduleId,
    projectId,
    moduleName,
    moduleDes,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query = `
        CALL LT_DC_DCS_SP_Insert_Update_DC_Module(?, ?, ?, ?, ?, ?, ?, @p_LogicApps_Result);
      `;
 
      // Execute the stored procedure
      await pool.query(query, [
        moduleId,
        projectId,
        moduleName,
        moduleDes,
        createdUser,
        status,
        inactiveReason,
      ]);
 
      // Fetch OUT parameter
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );
 
      const message = resultRows?.[0]?.message || "Unknown response";
      const isError = message.toLowerCase().includes("error");
 
      return { success: !isError, message };
    } catch (err) {
      console.error(
        "❌ Repository Error (insertOrUpdateModule):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating module in repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};
 
export default moduleRepo;