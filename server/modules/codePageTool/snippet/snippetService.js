const snippetRepository = require("./snippetRepository");

const snippetService = {
  getSnippet: async (snippetId) => {
    try {
      const result = await snippetRepository.getSnippet(snippetId);
      return result;
    } catch (error) {
      console.error("Error in snippetService getSnippet: ", error);
    }
  },
};

module.exports = snippetService;
