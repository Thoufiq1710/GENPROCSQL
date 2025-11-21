// controllers/formGenController.js
const formGenService = require("../formGen/formGenService");

const formGenController = {
  saveFormGen: async (req, res) => {
    try {
      const formData = req.body;
      const response = await formGenService.saveFormGen(req.session, formData);

      if (response.success) {
        // IMPORTANT: store formId in session
        req.session.formId = response.formId;
        req.session.save(); // ensure it writes to store
      }
      res.status(200).json(response);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  getFormGenById: async (req, res) => {
    try {
      const formId = req.session.formId || req.query.formId;

      const result = await formGenService.getFormGenById(formId);

      res.status(200).json(result);
    } catch (err) {
      console.error("Error: ", err);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
  generateCode: async (req, res) => {
    try {
      // const formId = req.session.formId || req.query.formId ;
      // const data = await formGenService.getFormGenById(formId);
      const formData = req.body;
      console.log(formData.data);

      if (!formData || Object.keys(formData).length === 0) {
        return res
          .status(400)
          .json({ error: "No form data provided in request body" });
      }

      const code = await formGenService.generateCode(formData.data);
      res.status(200).json({ message: code });
    } catch (error) {
      res.status(500).json({ error: error });
      console.error(error);
    }
  },
};

module.exports = formGenController;
