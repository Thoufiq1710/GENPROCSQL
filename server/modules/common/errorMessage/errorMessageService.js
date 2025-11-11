import errorMessageRepo from "./errorMessageRepo.js";

const errorMessageService = {
  insertOrUpdateErrorMessage: async (errorData) => {
    try {
      const result = await errorMessageRepo.insertOrUpdateErrorMessage(
        errorData
      );
      return result;
    } catch (err) {
      console.error("❌ errorMessageService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating error message in service.",
        error: err.message,
      };
    }
  },
};

export default errorMessageService;
