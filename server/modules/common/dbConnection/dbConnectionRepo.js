import pool from "../../../config/db.js";
const dbConnectionRepo = {
  insertOrUpdateDBConnection: async (
    dbConnectionId,
    dbName,
    serverName,
    userName,
    password,
    projectId,
    companyName,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query = `
        CALL LT_DC_DCS_SP_Insert_Update_DB_Connection(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @p_LogicApps_Result);
      `;
 
      // Execute SP
      await pool.query(query, [
        dbConnectionId,
        dbName,
        serverName,
        userName,
        password,
        projectId,
        companyName,
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
        "❌ Repository Error (insertOrUpdateDBConnection):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating DB Connection in repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};
 
export default dbConnectionRepo;