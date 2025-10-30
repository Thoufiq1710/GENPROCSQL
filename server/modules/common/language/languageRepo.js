import pool from "../../../config/db.js";

const languageRepo = {
  insertOrUpdateLanguage: async (
    languageId,
    languageName,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query =
        "CALL LT_DC_DCS_SP_Insert_Update_Language(?, ?, ?, ?, ?, @p_LogicApps_Result);";
 
      // Execute the stored procedure
      await pool.query(query, [
        languageId,
        languageName,
        createdUser,
        status,
        inactiveReason,
      ]);
 
      // Fetch the OUT parameter value
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );
      const message = resultRows?.[0]?.message || "Unknown response";
 
      // Determine success based on the message
      const isError = message.toLowerCase().includes("error");
 
      return {
        success: !isError,
        message,
      };
    } catch (err) {
      console.error(
        "Repository Error (insertOrUpdateLanguage):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating language in repo.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};

export default languageRepo;