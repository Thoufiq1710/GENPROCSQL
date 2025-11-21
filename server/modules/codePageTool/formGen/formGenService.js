const fs = require("fs");
const handleBarJs = require("handlebars");
const path = require("path");

// services/formGenService.js
const formGenRepository = require("./formGenRepository");

// Form Gen Utils
const formGenUtils = require("../../../src/utils/codeGenUtils");

const formGenService = {
  saveFormGen: async (session, formData) => {
    try {
    } catch (error) {}
    const result = await formGenRepository.saveFormGen(formData);

    return {
      success: result.success,
      message: result.message,
      formId: result.formId || null,
    };
  },
  getFormGenById: async (formId) => {
    try {
      if (!formId) return { success: false, error: "formId missing" };
      const formDetails = await formGenRepository.getFormGenById(formId);
      // only set session if save succeeded and we have a formId
      if (!formDetails || !formDetails.result) {
        return { success: false, error: "Form not found" };
      }
      const jsonData = formDetails.result.FormJson;
      if (typeof jsonData === "string") {
        try {
          jsonData = JSON.parse(jsonData);
        } catch (err) {
          console.warn("FormJson parse warning:", err);
          // if parse fails, return raw
        }
      }

      if (!jsonData) return { success: false, error: "Form JSON missing" };

      const transformData = (jsonData) => {
        return {
          ...jsonData,
          Tabs: jsonData.Tabs.map((tab, tabIndex) => ({
            tabIndex: tabIndex,
            ...tab,
            Sections: tab.Sections.map((section, sectionIndex) => ({
              sectionIndex: sectionIndex,
              ...section,
              Fields: section.Fields.map((field, fieldIndex) => ({
                fieldIndex: fieldIndex,
                ...field,
              })),
            })),
          })),
        };
      };
      const finalFormDetails = transformData(jsonData);

      return { success: true, result: finalFormDetails };
    } catch (error) {
      console.error("Error in Service Layer: ", error);
      return { success: false, error: "Error in Service Layer" };
    }
  },
  generateCode: async (data) => {
    try {
      // const templatePath = path.join(__dirname, "formTemplate.hbs");

      // Read file, not just reference its path
      // const templateContent = fs.readFileSync(templatePath, "utf-8");

      // Compile properly
      // const template = handleBarJs.compile(templateContent);

      // Comparison operator
      handleBarJs.registerHelper("eq", function (a, b) {
        return a === b;
      });

      // handleBarJs pascalCase
      handleBarJs.registerHelper("pascalCase", function (str) {
        if (!str) return "";
        return str
          .toString()
          .replace(/[-_\s]+(.)?/g, (match, chr) =>
            chr ? chr.toUpperCase() : ""
          )
          .replace(/^(.)/, (chr) => chr.toUpperCase());
      });
      // handleBarJs camelCase
      handleBarJs.registerHelper("camelCase", function (str) {
        if (!str) return "";
        return str
          .toString()
          .replace(/[-_\s]+(.)?/g, (match, chr) =>
            chr ? chr.toUpperCase() : ""
          )
          .replace(/^(.)/, (chr) => chr.toLowerCase());
      });

      // handleBarJs dashCase
      handleBarJs.registerHelper("dashCase", function (str) {
        if (!str) return "";
        return str
          .toString()
          .trim()
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/[\s_]+/g, "-")
          .toLowerCase();
      });

      // Handlebars expects raw "result", not service wrapper
      const payload = data.result;

      // console.log(payload);
      // fetch language id dynamically using project id from json
      const languageId = await formGenRepository.getLanguageIdByProjectId(
        payload.ProjectID
      );
      let generatedCode = {};
      let finalOutput = "";
      for (const tab of payload.Tabs) {
        for (const section of tab.Sections) {
          for (const field of section.Fields) {
            if (
              field.spName &&
              field.spName !== "null" &&
              field.spName.trim() !== ""
            ) {
              field.spParams = await formGenUtils.getSpParams(field.spName); // Adding spParams containing the params of spName
            } else {
              field.spParams = [];
            }
            // Extracting template from DB using fieldTypeId and languageId via ProjectId
            const snippetRows =
              await formGenRepository.getSnippetsByElementAndLanguage(
                field.fieldTypeId,
                53, // Element ID (layers)
                languageId
              );
            for (const snippet of snippetRows) {
              const template = handleBarJs.compile(snippet.snippet);
              const output = template(field);

              const layer = snippet.layer_name;

              if (!generatedCode[layer]) {
                generatedCode[layer] = "";
              }

              generatedCode[layer] += output + "\n\n";
            }
            // Extracting just the code template
            const snippetTemplate = snippetRows?.[0]?.Snippet || "";
            // Using handleBarJs compiling the code snippet into template
            const template = handleBarJs.compile(snippetTemplate);
            // Passing the payload from recievedFormData(using formReducer) as parameters
            const output = template(field);
            // Updating the final output using finalOutput
            finalOutput += output + "\n\n";
          }
        }
      }

      let testCode = "";
      for (const tab of payload.Tabs) {
        for (const section of tab.Sections) {
          for (const field of section.Fields) {
            // console.log(field); // To check data of individual field or columns
            // Generate component code
            // const output = template(field);
            // Updating the final output using finalOutput
            // testCode += output + "\n\n";
          }
        }
      }

      // Testing the template by writing the content to the specific path
      const outputPath = path.join(__dirname, "GeneratedForm.js");
      fs.writeFileSync(outputPath, finalOutput);

      console.log("✅ React Form Generated →", outputPath);

      return generatedCode; // Let controller respond with download or view later
    } catch (error) {
      console.error("❌ Code Generation Failed:", error);
      throw error;
    }
  },
};

module.exports = formGenService;
