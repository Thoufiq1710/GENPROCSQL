import languageService from "./languageService.js";

const languageController = {
  insertOrUpdateLanguage: async (req, res) => {
    try {
      // ✅ Accept both single object or array
      const languageArray = Array.isArray(req.body) ? req.body : [req.body];
      const results = [];
      const errors = [];
 
      for (const [index, lang] of languageArray.entries()) {
        const {
          languageId,
          languageName,
          createdUser,
          status,
          inactiveReason,
        } = lang;
 
        // ✅ Validation
        if (!languageName || !status) {
          errors.push({
            index,
            error: "Language Name and Status are required.",
            language: lang,
          });
          continue;
        }
 
        try {
          // ✅ Call service to execute SP
          const result = await languageService.insertOrUpdateLanguage({
            languageId: languageId || 0,
            languageName: languageName.trim(),
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });
 
          // ✅ Handle SP result (Success / Duplicate)
          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed",
              language: lang,
            });
            continue;
          }
 
          results.push({ ...lang, dbMessage: result.message });
        } catch (err) {
          errors.push({
            index,
            error: err.message,
            language: lang,
          });
        }
      }
 
      // ✅ Consolidated Response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All languages inserted/updated successfully."
            : "Partial success — some inserts failed.",
        summary: {
          total: languageArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedLanguages: results,
        failedLanguages: errors,
      });
    } catch (err) {
      console.error("❌ insertOrUpdateLanguage Controller Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error occurred during language insertion.",
        error: err.message,
      });
    }
  },
};

export default languageController;