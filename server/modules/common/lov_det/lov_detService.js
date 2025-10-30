import listOfValuesDetailsRepo from "./lov_detRepo.js";
const listOfValuesDetailsService = {
  insertOrUpdateListOfValuesDetails: async (lovDetailsData) => {
    try {
      const {
        lovDetId,
        lovId,
        lovDetName,
        lovDetDescription,
        createdUser,
        status,
        inactiveReason,
      } = lovDetailsData;
 
      const result = await listOfValuesDetailsRepo.insertOrUpdateListOfValuesDetails(
        lovDetId || 0,
        lovId,
        lovDetName,
        lovDetDescription || "",
        createdUser,
        status,
        inactiveReason || ""
      );
 
      return result;
    } catch (err) {
      console.error("❌ listOfValuesDetailsService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating ListOfValuesDetails in Service.",
        error: err.message,
      };
    }
  },
};
 
export default listOfValuesDetailsService;