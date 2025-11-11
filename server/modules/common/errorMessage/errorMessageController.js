import errorMessageService from "./errorMessageService.js";

const errorMessageController = {
  insertOrUpdateErrorMessage: async (req, res) => {
    try {
      if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
        return res.status(400).json({
          success: false,
          message: "Request body cannot be empty.",
        });
      }

      // ✅ Accept single object or array
      const errorArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, errItem] of errorArray.entries()) {
        const {
          errorId,
          errorPrefixId,
          errorMsg,
          errorCode,
          createdUser,
          status,
          inactiveReason,
        } = errItem;

        // ✅ Validation
        if (!errorMsg || !errorCode) {
          errors.push({
            index,
            error: "Error Prefix ID, Message, and Code are required.",
            data: errItem,
          });
          continue;
        }

        try {
          // ✅ Call Service Layer (executes SP)
          const result = await errorMessageService.insertOrUpdateErrorMessage({
            errorId: errorId || 0,
            errorPrefixId,
            errorMsg: errorMsg.trim(),
            errorCode: errorCode.trim(),
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });

          // ✅ Handle SP result
          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed.",
              data: errItem,
            });
            continue;
          }

          results.push({ ...errItem, dbMessage: result.message });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            data: errItem,
          });
        }
      }

      // ✅ Consolidated response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All error messages inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: errorArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedErrors: results,
        failedErrors: errors,
      });
    } catch (err) {
      console.error(
        "❌ insertOrUpdateErrorMessage Controller Error:",
        err.message
      );
      res.status(500).json({
        success: false,
        message: "Server error occurred during error message insertion.",
        error: err.message,
      });
    }
  },
};

export default errorMessageController;
