import pool from "../../../config/database.js";
const listOfValuesDetailsRepo = {
  insertOrUpdateListOfValuesDetails: async (
    lovDetId,
    lovId,
    lovDetName,
    lovDetDescription,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query = `
        CALL LT_DC_DCS_SP_Insert_Update_ListOfValuesDetails(
          ?, ?, ?, ?, ?, ?, ?, @p_LogicApps_Result
        );
      `;
 
      // Execute the stored procedure
      await pool.query(query, [
        lovDetId,
        lovId,
        lovDetName,
        lovDetDescription,
        createdUser,
        status,
        inactiveReason,
      ]);
 
      // Get the OUT parameter value
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );
 
      const message = resultRows?.[0]?.message || "Unknown response";
      const isError = message.toLowerCase().includes("error");
 
      return {
        success: !isError,
        message,
      };
    } catch (err) {
      console.error(
        "Repository Error (insertOrUpdateListOfValuesDetails):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating ListOfValuesDetails in repo.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};
 
export default listOfValuesDetailsRepo;