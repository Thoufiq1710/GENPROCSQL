import dropDownService from "./dropDownService.js";

const dropDownController = {
  getLovDropdown: async (req, res) => {
    try {
      const { listName, lovName } = req.params;
      const result = await dropDownService.getLovDropdown(listName, lovName);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default dropDownController;
