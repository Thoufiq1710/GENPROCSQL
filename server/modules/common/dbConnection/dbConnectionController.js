import dbConnectionService from "./dbConnectionService.js";

const dbConnectionController = {
  insertOrUpdateDBConnection: async (req, res) => {
    try {
      // Accept both single object or array input
      const dbConnectionArray = Array.isArray(req.body)
        ? req.body
        : [req.body];
      const results = [];
      const errors = [];
 
      for (const [index, conn] of dbConnectionArray.entries()) {
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
        } = conn;
 
        // ✅ Basic validation
        if (!dbName || !serverName || !userName || !projectId || !status) {
          errors.push({
            index,
            error:
              "DB Name, Server Name, User Name, Project ID, and Status are required.",
            connection: conn,
          });
          continue;
        }
 
        try {
          // ✅ Call service to execute SP
          const result = await dbConnectionService.insertOrUpdateDBConnection({
            dbConnectionId: dbConnectionId || 0,
            dbName: dbName.trim(),
            serverName: serverName.trim(),
            userName: userName.trim(),
            password: password || "",
            projectId,
            companyName: companyName || "",
            createdUser,
            status,
            inactiveReason: inactiveReason || "",
          });
 
          // ✅ Handle SP result (Success / Duplicate / Failure)
          if (!result || !result.success) {
            errors.push({
              index,
              error: result?.message || "SP execution failed",
              connection: conn,
            });
            continue;
          }
 
          results.push({ ...conn, dbMessage: result.message });
        } catch (err) {
          errors.push({ index, error: err.message, connection: conn });
        }
      }
 
      // ✅ Final Consolidated Response
      res.status(errors.length ? 207 : 201).json({
        success: errors.length === 0,
        message:
          errors.length === 0
            ? "All DB Connections inserted/updated successfully."
            : "Partial success — some operations failed.",
        summary: {
          total: dbConnectionArray.length,
          inserted: results.length,
          failed: errors.length,
        },
        addedConnections: results,
        failedConnections: errors,
      });
    } catch (err) {
      console.error(
        "❌ insertOrUpdateDBConnection Controller Error:",
        err.message
      );
      res.status(500).json({
        success: false,
        message: "Server error occurred during DB Connection insertion.",
        error: err.message,
      });
    }
  },
};
 
export default dbConnectionController;