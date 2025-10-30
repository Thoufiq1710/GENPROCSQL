import lovService from "./lovService.js";
const lovController = {
  insertOrUpdateLov: async (req, res) => {
    try {
      // ✅ Support both array or single object
      const lovArray = Array.isArray(req.body) ? req.body : [req.body];
 
      const results = [];
      const errors = [];
 
      for (const [index, lov] of lovArray.entries()) {
        const {
          lovId,
          lovName,
          lovDescription,
          createdUser,
          status,
          inactiveReason,
        } = lov;
 
        // ✅ Basic validation
        if (!lovName || !status) {
          errors.push({
            index,
            error: "LOV Name and Status are required.",
            lov,
          });
          continue;
        }
 
        try {
          // ✅ Call service
          const result = await lovService.insertOrUpdateLov({
            lovId: lovId || 0,
            lovName: lovName.trim(),
            lovDescription: lovDescription || "",
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });
 
          // ✅ Handle SP result
          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed",
              lov,
            });
            continue;
          }
 
          results.push({ ...lov, dbMessage: result.message });
        } catch (err) {
          errors.push({ index, error: err.message, lov });
        }
      }
 
      // ✅ Final response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All LOVs inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: lovArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedLOVs: results,
        failedLOVs: errors,
      });
    } catch (err) {
      console.error("❌ insertOrUpdateLov Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred during LOV insertion.",
        error: err.message,
      });
    }
  },
};
 
export default lovController;