export function highlightSQL(sql) {
  if (!sql) return "";

  let highlighted = sql;

  // Highlight SQL keywords (purple)
  highlighted = highlighted.replace(
    /\b(CREATE|PROCEDURE|BEGIN|END|DECLARE|SET|SELECT|FROM|WHERE|INTO|INT|DATE|VARCHAR|COUNT|DELIMITER)\b/g,
    `<span class="keyword">$1</span>`
  );

  // Highlight datatypes (orange/yellow)
  highlighted = highlighted.replace(
    /\b(INT|DATE|VARCHAR\(\d+\)|VARCHAR)\b/g,
    `<span class="datatype">$1</span>`
  );

  // Highlight params & variables (blue)
  highlighted = highlighted.replace(
    /\b(p_[a-zA-Z0-9_]+|v_[a-zA-Z0-9_]+)\b/g,
    `<span class="variable">$1</span>`
  );

  // Highlight comments (-- comment)
  highlighted = highlighted.replace(
    /(--.*)/g,
    `<span class="comment">$1</span>`
  );

  return highlighted;
}
