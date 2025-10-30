import moduleRepo from "./moduleRepo.js";
const moduleService = {
  insertOrUpdateModule: async (moduleData) => {
    try {
      const {
        moduleId,
        projectId,
        moduleName,
        moduleDes,
        createdUser,
        status,
        inactiveReason,
      } = moduleData;
 
      // Call repository layer (SP execution)
      const result = await moduleRepo.insertOrUpdateModule(
        moduleId,
        projectId,
        moduleName,
        moduleDes,
        createdUser,
        status,
        inactiveReason
      );
 
      return result;
    } catch (err) {
      console.error("❌ moduleService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating module in Service.",
        error: err.message,
      };
    }
  },
};
 
export default moduleService;