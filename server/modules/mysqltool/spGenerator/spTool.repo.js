import pool from "../../../config/db.js";

const repo = {
  async getSPMetadata(id) {
    const sql = `
      SELECT 
          d.*,
          c.*
      FROM DCS_M_INSERT_UPDATE_SP_GEN_DETAILS d
      LEFT JOIN DCS_L_INSERT_UPDATE_SP_GEN_COLUMNS_DETAILS c
          ON c.Insert_Update_SP_Gen_Details_Id = d.Insert_Update_SP_Gen_Details_Id
      WHERE d.Insert_Update_SP_Gen_Details_Id = ?
      ORDER BY c.Insert_Update_SP_Gen_Columns_Details_Id;
    `;

    const [rows] = await pool.query(sql, [id]);
    console.log("Repository fetched rows:", rows);
    return rows;
  },
};

export default repo;
