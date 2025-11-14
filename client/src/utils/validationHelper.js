/**
 * Simple cache to skip validating unchanged rows.
 * Keyed by rowIndex and fieldName → last known value.
 */
const validationCache = new Map();

/**
 * Validate a single field.
 */
export const validateField = (field, value, row = {}) => {
  if (field.hidden) return null;

  // 1️⃣ Required check
  if (field.required) {
    const isEmpty =
      value === "" ||
      value === null ||
      value === undefined ||
      (typeof value === "string" && !value.trim()) ||
      (field.type === "select" && (value === 0 || value === "0"));

    if (isEmpty) return `${field.label} is required`;
  }

  // 2️⃣ Custom validation
  if (typeof field.validate === "function") {
    const result = field.validate(value, row);
    if (result !== true) return result || `${field.label} is invalid`;
  }

  return null;
};

/**
 * Validate all rows — optimized for large grids.
 */
export const validateAllRows = (rows, fields) => {
  if (!Array.isArray(rows) || !Array.isArray(fields)) return [];

  const activeFields = fields.filter((f) => !f.hidden);
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    for (let j = 0; j < activeFields.length; j++) {
      const field = activeFields[j];
      const key = `${i}-${field.name}`;
      const value = row[field.name];

      // 🧠 Skip if cached value unchanged
      const last = validationCache.get(key);
      if (last && last.value === value && last.rowSnapshot === row) {
        if (last.error)
          errors.push({ row: i, field: field.name, message: last.error });
        continue;
      }

      // ⚡ Run validation
      const errorMsg = validateField(field, value, row);

      // Update cache
      validationCache.set(key, { value, rowSnapshot: row, error: errorMsg });

      if (errorMsg) {
        errors.push({ row: i, field: field.name, message: errorMsg });
      }
    }
  }

  return errors;
};

/**
 * Clears the internal validation cache — call when rows/fields change dramatically.
 */
export const clearValidationCache = () => {
  validationCache.clear();
};
