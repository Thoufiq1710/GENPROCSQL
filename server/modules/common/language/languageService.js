import languageRepo from "./languageRepo.js";

const languageService = {
  insertOrUpdateLanguage: async (languageData) => {
    try {
      // ✅ Call repository layer (where SP is executed)
      const result = await languageRepo.insertOrUpdateLanguage(languageData);

      return result;
    } catch (err) {
      console.error("❌ languageService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating language in Service.",
        error: err.message,
      };
    }
  },
};

export default languageService;
