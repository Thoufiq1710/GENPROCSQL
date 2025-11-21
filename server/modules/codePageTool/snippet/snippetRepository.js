const pool = require("../../../src/config/dbConfig");

const snippetRepository = {
  getSnippet: async (snippetId) => {
    try {
      const query = "CALL SP_GET_SNIPPET(?)";
      const [rows] = await pool.query(query, [snippetId]);
      return rows[0];
    } catch (error) {
      console.error("Error in getSnippet:", error);
    }
  },
};

module.exports = snippetRepository;
