import listOfValuesDetailsService from "./lov_detService.js";
const listOfValuesDetailsController = {
  insertOrUpdateListOfValuesDetails: async (req, res) => {
    try {
      // ✅ Accept single object or array
      const lovDetailsArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, item] of lovDetailsArray.entries()) {
        const {
          lovDetId,
          lovId,
          lovDetName,
          lovDetDescription,
          createdUser,
          status,
          inactiveReason,
        } = item;

        // ✅ Validation
        if (!lovId || !lovDetName) {
          errors.push({
            index,
            error: "LOV ID, Detail Name, and Status are required.",
            record: item,
          });
          continue;
        }

        try {
          const result =
            await listOfValuesDetailsService.insertOrUpdateListOfValuesDetails({
              lovDetId: lovDetId || 0,
              lovId,
              lovDetName: lovDetName.trim(),
              lovDetDescription: lovDetDescription || "",
              createdUser,
              status,
              inactiveReason: inactiveReason || "",
            });

          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed",
              record: item,
            });
            continue;
          }

          results.push({ ...item, dbMessage: result.message });
        } catch (err) {
          errors.push({ index, error: err.message, record: item });
        }
      }

      // ✅ Consolidated Response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All ListOfValuesDetails inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: lovDetailsArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedDetails: results,
        failedDetails: errors,
      });
    } catch (err) {
      console.error(
        "❌ insertOrUpdateListOfValuesDetails Controller Error:",
        err.message
      );
      res.status(500).json({
        success: false,
        message:
          "Server error occurred during ListOfValuesDetails insertion/update.",
        error: err.message,
      });
    }
  },
};

export default listOfValuesDetailsController;
