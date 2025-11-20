import spToolGenerationService from "./spToolGenerationService.js";

const spToolGenerationController = {
  insertOrUpdateSPTool: async (req, res) => {
    try {
      const dataArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, item] of dataArray.entries()) {
        const {
          spGenDetailsId,
          spName,
          spDescription,
          moduleName,
          productName,
          authorName,
          tableName,
          columns, // JSON Array
          userVar,
          scopeIdentity,
          errMsg,
          scopeVar,
          status,
          inactiveReason,
          user,
        } = item;

        // Validation
        if (!spName || !tableName) {
          errors.push({
            index,
            error: "SP Name and Table Name are required.",
            payload: item,
          });
          continue;
        }

        try {
          const result = await spToolGenerationService.insertOrUpdateSPTool({
            spGenDetailsId: spGenDetailsId || 0,
            spName: spName.trim(),
            spDescription,
            moduleName,
            productName,
            authorName,
            tableName,
            columns: Array.isArray(columns) ? columns : [],
            userVar,
            scopeIdentity,
            errMsg,
            scopeVar,
            status,
            inactiveReason,
            user,
          });

          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP Execution Failed",
              payload: item,
            });
            continue;
          }

          results.push({
            ...item,
            dbMessage: result.message,
            insertedId: result.insertedId,
          });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            payload: item,
          });
        }
      }

      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All SP Tool Details inserted/updated successfully."
            : "Partial Success — some items failed.",
        summary: {
          total: dataArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        added: results,
        failed: errors,
      });
    } catch (err) {
      console.error("❌ Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error during SP Tool insertion.",
        error: err.message,
      });
    }
  },
};

export default spToolGenerationController;  
