// const { getSnippet } = require("./snippetRepository"); *we can import them in two ways destructuring the function*
const snippetService = require("./snippetService"); // *or The object itself*

const snippetController = {
  getSnippet: async (req, res) => {
    try {
      let snippetId = req.params.snippetId;
      snippetId =
        snippetId && snippetId !== "null" ? parseInt(snippetId, 10) : null;
      const result = await snippetService.getSnippet(snippetId);
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      console.error("Error in snippetController getSnippet: ", error);
    }
  },
};

module.exports = snippetController;
