import dbConnectionRepo from "./dbConnectionRepo.js";
const dbConnectionService = {
  insertOrUpdateDBConnection: async (dbConnectionData) => {
    try {
      const {
        dbConnectionId,
        dbName,
        serverName,
        userName,
        password,
        projectId,
        companyName,
        createdUser,
        status,
        inactiveReason,
      } = dbConnectionData;
 
      const result = await dbConnectionRepo.insertOrUpdateDBConnection(
        dbConnectionId,
        dbName,
        serverName,
        userName,
        password,
        projectId,
        companyName,
        createdUser,
        status,
        inactiveReason
      );
 
      return result;
    } catch (err) {
      console.error("❌ dbConnectionService Error:", err.message);
      return {
        success: false,
        message: "Error inserting/updating DB Connection in service.",
        error: err.message,
      };
    }
  },
};
 
export default dbConnectionService;