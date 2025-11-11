import pool from "../../../config/db.js";

const errorMessageRepo = {
  insertOrUpdateErrorMessage: async ({
    errorId,
    errorPrefixId,
    errorMsg,
    errorCode,
    createdUser,
    status,
    inactiveReason,
  }) => {
    try {
      const query = `
        CALL LT_DC_DCS_SP_Insert_Update_Err_Message(
          ?, ?, ?, ?, ?, ?, ?, @p_LogicApps_Result
        );
      `;

      await pool.query(query, [
        errorId,
        errorPrefixId,
        errorMsg,
        errorCode,
        createdUser,
        status,
        inactiveReason,
      ]);

      // ✅ Fetch OUT parameter
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );

      const message = resultRows?.[0]?.message || "Unknown response from SP";

      // ✅ Determine success/failure based on SP message
      const isError =
        message.toLowerCase().includes("error") ||
        message.toLowerCase().includes("duplicate") ||
        message.toLowerCase().includes("failed") ||
        message.toLowerCase().includes("invalid");

      return {
        success: !isError,
        message,
      };
    } catch (err) {
      console.error(
        "❌ Repository Error (insertOrUpdateErrorMessage):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating error message in repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};

export default errorMessageRepo;
