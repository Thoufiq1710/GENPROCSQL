import moduleService from "./moduleService.js";
const moduleController = {
  insertOrUpdateModule: async (req, res) => {
    try {
      // Accept both single object or array
      const moduleArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, mod] of moduleArray.entries()) {
        const {
          moduleId,
          projectId,
          moduleName,
          moduleDes,
          createdUser,
          status,
          inactiveReason,
        } = mod;

        // Basic validation
        if (!moduleName || !projectId) {
          errors.push({
            index,
            error: "Project ID, Module Name, and Status are required.",
            module: mod,
          });
          continue;
        }

        try {
          const result = await moduleService.insertOrUpdateModule({
            moduleId: moduleId || 0,
            projectId,
            moduleName: moduleName.trim(),
            moduleDes: moduleDes || "",
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });

          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed",
              module: mod,
            });
            continue;
          }

          results.push({ ...mod, dbMessage: result.message });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            module: mod,
          });
        }
      }

      // Final consolidated response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All modules inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: moduleArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedModules: results,
        failedModules: errors,
      });
    } catch (err) {
      console.error("❌ insertOrUpdateModule Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred during module insertion.",
        error: err.message,
      });
    }
  },
};

export default moduleController;
