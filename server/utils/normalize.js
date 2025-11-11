// utils/normalize.js
export default function normalize(value) {
  if (
    value === undefined ||
    value === null ||
    value === "null" ||
    value === "undefined" ||
    value === ""
  ) {
    return null; // ✅ Return true null
  }
  // ✅ Try to convert numeric values
  if (!isNaN(value)) {
    return Number(value);
  }
  return value;
}
