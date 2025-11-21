import db from "../../../config/db.js";
const pool = db.pool;
export const getFieldTypes = async () => {
  try {
    const query = "CALL GetFieldTypes()";
    const [result] = await pool.query(query);
    return result[0];
  } catch (err) {
    console.error("Repo Error:", err);
  }
};

export const insertFieldTypes = async (
  fieldTypeId,
  elementTypeId,
  fieldName,
  fStatus,
  fInactiveReason,
  cUser
) => {
  try {
    const query = "CALL LT_DCS_SP_INSERT_UPDATE_FIELD_TYPE(?,?,?,?,?,?)";
    const [result] = await pool.query(query, [
      fieldTypeId,
      elementTypeId,
      fieldName,
      fStatus,
      fInactiveReason,
      cUser,
    ]);
    return result;
  } catch (err) {
    console.error("Repo Error:", err);
  }
};

export default {
  getFieldTypes,
  insertFieldTypes
};
