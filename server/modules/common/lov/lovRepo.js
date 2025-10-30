import pool from "../../../config/database.js";
const lovRepo = {
  insertOrUpdateLov: async (
    lovId,
    lovName,
    lovDescription,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      // ✅ Call the stored procedure
      const query = `CALL LT_DC_DCS_SP_Insert_Update_ListOfValues(?, ?, ?, ?, ?, ?, @p_LogicApps_Result);`;
 
      await pool.query(query, [
        lovId,
        lovName,
        lovDescription,
        createdUser,
        status,
        inactiveReason,
      ]);
 
      // ✅ Get OUT parameter
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );
 
      const message = resultRows?.[0]?.message || "Unknown response";
 
      // ✅ Determine success based on message
      const isError = message.toLowerCase().includes("error");
 
      return { success: !isError, message };
    } catch (err) {
      console.error(
        "❌ Repository Error (insertOrUpdateLov):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating LOV in repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};
 
export default lovRepo;