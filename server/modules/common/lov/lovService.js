import lovRepo from "./lovRepo.js";
const lovService = {
  insertOrUpdateLov: async (lovData) => {
    try {
      const {
        lovId,
        lovName,
        lovDescription,
        createdUser,
        status,
        inactiveReason,
      } = lovData;
 
      const result = await lovRepo.insertOrUpdateLov(
        lovId,
        lovName,
        lovDescription,
        createdUser,
        status,
        inactiveReason
      );
 
      return result;
    } catch (err) {
      console.error("❌ lovService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating LOV in Service.",
        error: err.message,
      };
    }
  },
};
 
export default lovService;