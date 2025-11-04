import dropDownRepo from "./dropDownRepo.js";

const dropDownService = {
  getLovDropdown: async (listName, lovName) => {
    try {
      const result = await dropDownRepo.getLovDropdown(listName, lovName);
      return result;
    } catch (error) {
      console.log("error in service:", error);
      throw error;
    }
  },
};

export default dropDownService;
