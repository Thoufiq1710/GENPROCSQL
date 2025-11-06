import masterGridRepo from "./masterGridRepo.js";

const masterGridService = {
  bindMasterGrid: async (params) => {
    try {
      const { tableName, filter1, filter2, filter3, userId } = params;

      //  Call Repository
      const result = await masterGridRepo.bindMasterGrid(
        tableName,
        filter1,
        filter2,
        filter3,
        userId
      );

      return result;
    } catch (err) {
      console.error(" Service Error (bindMasterGrid):", err.message);
      return {
        success: false,
        message: "Error processing master grid in service layer.",
        error: err.message,
      };
    }
  },
};

export default masterGridService;
