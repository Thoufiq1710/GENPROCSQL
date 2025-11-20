// spTool.service.js

import repo from "./spTool.repo.js";

export async function getSPMetadata(id) {
  const rows = await repo.getSPMetadata(id);
  if (!rows || rows.length === 0) return null;

  const parent = {
    id: rows[0].Insert_Update_SP_Gen_Details_Id,
    name: rows[0].Insert_Update_SP_Name,
    description: rows[0].Insert_Update_SP_Description,
    module: rows[0].Insert_Update_SP_Module_Name,
    product: rows[0].Insert_Update_SP_Product_Name,
    author: rows[0].Insert_Update_SP_Author_Name,
    table: rows[0].Insert_Update_SP_Table_Name,
    userVar: rows[0].Insert_Update_SP_User_Var,
    scopeIdentity: rows[0].Insert_Update_SP_Scope_Identity,
    errMsg: rows[0].Insert_Update_SP_Err_Msg,
    scopeVar: rows[0].Insert_Update_SP_Scope_Var,
    date: rows[0].C2C_Cdate,
  };

  const columns = rows.map((r) => ({
    Insert: r.Insert_Update_SP_Insert_Columns,
    Update: r.Insert_Update_SP_Update_Columns,
    Where: r.Insert_Update_SP_Where_Columns,
    ConvertDate: r.Insert_Update_SP_Convert_Date_Columns,
    RecordCount: r.Insert_Update_SP_Record_Count_Columns,
    Prefix: r.Insert_Update_SP_Prefix_Columns,
  }));

  return { parent, columns };
}
