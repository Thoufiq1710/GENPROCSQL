export const hiddenColumns = {
  LovMaster: ["LOV_ID", "Created_Date", "Created_By", "C2C_Status"],
  ProjectMaster: [
    "PROJECT_ID",
    "Language_ID",
    "Created_By",
    "C2C_Status",
    "Created_Date",
  ],
  LanguageMaster: ["Language_ID", "Created_Date", "Created_By", "C2C_Status"],
  ModuleMaster: [
    "MODULE_ID",
    "PROJECT_ID",
    "Created_Date",
    "Created_By",
    "C2C_Status",
  ],
  DbConnectionMaster: [
    "PROJECT_ID",
    "DB_CONNECTION_ID",
    "Created_Date",
    "Created_By",
    "C2C_Status",
  ],
  LovDetailsMaster: ["LOV_DET_ID", "Created_Date", "Created_By", "C2C_Status"],
  ErrorMsgMaster: [
    "ERROR_ID",
    "ERROR_PREFIX_ID",
    "Created_Date",
    "Created_By",
    "C2C_Status",
  ],
  ProductMaster: ["Product_ID", "Created_Date", "Created_By", "C2C_Status"],
};
