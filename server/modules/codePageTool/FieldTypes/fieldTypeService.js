import fieldTypeRepository from "./fieldTypeRepository.js";

export const getFieldTypes = async () => {
  return await fieldTypeRepo.getFieldTypes();
};

export const insertFieldTypes = async (
  fieldTypeId,
  elementTypeId,
  fieldName,
  fStatus,
  fInactiveReason,
  cUser
) => {
  return await fieldTypeRepository.insertFieldTypes(
    fieldTypeId,
    elementTypeId,
    fieldName,
    fStatus,
    fInactiveReason,
    cUser
  );
};
