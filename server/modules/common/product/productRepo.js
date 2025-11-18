import pool from "../../../config/db.js";

const productRepo = {
  insertOrUpdateProduct: async (
    productId,
    productName,
    productDescription,
    projectId,
    createdUser,
    status,
    inactiveReason
  ) => {
    try {
      const query = `
        CALL LT_DC_DCS_SP_Insert_Update_PRODUCT(
          ?, ?, ?, ?, ?, ?, ?, @p_LogicApps_Result
        );
      `;

      // ✅ Execute Stored Procedure
      await pool.query(query, [
        productId,
        productName,
        productDescription,
        projectId,
        createdUser,
        status,
        inactiveReason,
      ]);

      // ✅ Fetch OUT parameter
      const [resultRows] = await pool.query(
        "SELECT @p_LogicApps_Result AS message;"
      );

      console.log("Stored Procedure Result:", resultRows);
      const message = resultRows?.[0]?.message || "Unknown response from SP";

      // ✅ Determine success/failure
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
        "❌ Repository Error (insertOrUpdateProduct):",
        err.message || err.sqlMessage
      );
      return {
        success: false,
        message: "Error inserting/updating product in repository.",
        error: err.message || err.sqlMessage,
      };
    }
  },
};

export default productRepo;
