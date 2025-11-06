import projectService from "./projectService.js";
const projectController = {
  insertOrUpdateProject: async (req, res) => {
    try {
      const projectArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];

      for (const [index, proj] of projectArray.entries()) {
        const {
          projectId,
          projectName,
          languageId,
          createdUser,
          status,
          inactiveReason,
        } = proj;

        // ✅ Validation
        if (!projectName || !languageId) {
          errors.push({
            index,
            error: "Project Name, Language, and Status are required.",
            project: proj,
          });
          continue;
        }

        try {
          const result = await projectService.insertOrUpdateProject({
            projectId: projectId || 0,
            projectName: projectName.trim(),
            languageId,
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });

          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed.",
              project: proj,
            });
            continue;
          }

          results.push({ ...proj, dbMessage: result.message });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            project: proj,
          });
        }
      }

      // ✅ Final Response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All projects inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: projectArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedProjects: results,
        failedProjects: errors,
      });
    } catch (err) {
      console.error("❌ insertOrUpdateProject Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred during project insertion.",
        error: err.message,
      });
    }
  },
};

export default projectController;
