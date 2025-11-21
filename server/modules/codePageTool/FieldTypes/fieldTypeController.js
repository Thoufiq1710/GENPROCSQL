import fieldTypeService from "./fieldTypeService.js";

export const getFieldTypes = async (req, res) => {
  try {
    const result = await fieldTypeService.getFieldTypes();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const insertFieldTypes = async (req, res) => {
  try {
    const fieldArray = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const [index, field] of fieldArray.entries()) {
      const {
        fieldTypeId,
        elementTypeId,
        fieldName,
        fStatus,
        fInactiveReason,
        cUser,
      } = field;

      if (!fieldName || !fStatus) {
        errors.push({ index, error: "All fields are required", field });
        continue;
      }

      try {
        const dbResult = await fieldTypeService.insertFieldTypes(
          fieldTypeId,
          elementTypeId,
          fieldName,
          fStatus,
          fInactiveReason,
          cUser
        );

        if (!dbResult || dbResult.affectedRows === 0) {
          errors.push({ index, error: "Duplicate Error", field });
          continue;
        }

        results.push({ ...field, dbResult });
      } catch (serviceErr) {
        errors.push({ index, error: serviceErr.message, field });
      }
    }

    res.status(201).json({
      message: "Processing completed",
      addedCount: results.length,
      failedCount: errors.length,
      addedFields: results,
      failedFields: errors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
