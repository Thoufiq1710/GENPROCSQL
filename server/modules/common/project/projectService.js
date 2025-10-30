import projectRepo from "./projectRepo.js";
const projectService = {
  insertOrUpdateProject: async (projectData) => {
    try {
      const {
        projectId,
        projectName,
        languageId,
        createdUser,
        status,
        inactiveReason,
      } = projectData;
 
      const result = await projectRepo.insertOrUpdateProject(
        projectId,
        projectName,
        languageId,
        createdUser,
        status,
        inactiveReason
      );
 
      return result;
    } catch (err) {
      console.error("❌ projectService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating project in Service.",
        error: err.message,
      };
    }
  },
};
 
export default projectService;