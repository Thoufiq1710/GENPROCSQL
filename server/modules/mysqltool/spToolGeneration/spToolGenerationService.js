import spToolGenerationRepo from "./spToolGenerationRepo.js";

const spToolGenerationService = {
  insertOrUpdateSPTool: async (data) => {
    try {
      const result = await spToolGenerationRepo.insertOrUpdateSPTool(data);
      return result;
    } catch (err) {
      console.error("❌ Service Error:", err.message);
      return {
        success: false,
        message: "Service Layer Error",
        error: err.message,
      };
    }
  },
};

export default spToolGenerationService;
