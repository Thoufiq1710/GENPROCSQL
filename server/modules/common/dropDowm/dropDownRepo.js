import pool from "../../../config/db.js";

const dropDownRepo = {
  getLovDropdown: async (listName, lovName) => {
    try {
      const query = "CALL LT_DC_DCS_SP_BIND_DROPDOWN(?,?)";
      const [rows] = await pool.query(query, [listName, lovName]);
      return rows[0];
    } catch (error) {
        console.log("error in repo:",error);
      throw error;
    }
  },
};
export default dropDownRepo;
