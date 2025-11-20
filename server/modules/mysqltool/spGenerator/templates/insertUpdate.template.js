export function generateInsertUpdateSP(metadata) {
  const { parent, columns } = metadata;

  // ---------- Utils ----------
  const parse = (val) => {
    if (!val) return [];
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return val
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  };

  const detectType = (col) => {
    const c = col.toLowerCase();
    if (c.endsWith("_id") || c.endsWith("_no") || c.includes("cuser"))
      return "INT";
    if (c.includes("date") || c.endsWith("_dt") || c.includes("c2c_cdate"))
      return "DATE";
    if (c.includes("status")) return "TINYINT(1)";
    return "VARCHAR(255)";
  };

  // ---------- Extract Metadata ----------
  const block = columns?.[0] || {};

  const insertCols = parse(block.Insert);
  const updateCols = parse(block.Update);
  const whereCols = parse(block.Where);
  const dateCols = parse(block.ConvertDate);
  const countCols = parse(block.RecordCount);
  const prefixCols = parse(block.Prefix);

  const allParams = [
    ...insertCols,
    ...updateCols,
    ...whereCols,
    ...prefixCols,
    ...dateCols,
  ];

  const uniqueParams = [...new Set(allParams)];

  // ---------- Build Procedure Parts ----------
  const spParams = uniqueParams
    .map((c) => `IN p_${c} ${detectType(c)}`)
    .join(",\n    ");

  const insertPlaceholders = insertCols.map((c) => `p_${c}`).join(", ");

  const updateSet = updateCols.map((c) => `${c} = p_${c}`).join(", ");

  const whereCond = whereCols.map((c) => `${c} = p_${c}`).join(" AND ");

  const dateConvertBlock = dateCols
    .map((c) => `SET ${c} = STR_TO_DATE(p_${c}, '%Y-%m-%d');`)
    .join("\n    ");

  const recordCountBlock = countCols.length
    ? `SELECT COUNT(*) INTO vCount 
    FROM ${parent.table} 
    WHERE ${countCols.map((c) => `${c} = p_${c}`).join(" AND ")};`
    : "";

  // ---------- Final SP Template ----------
  return `
DELIMITER $$

CREATE PROCEDURE ${parent.name} (
    ${spParams}
)
BEGIN
    -- =================================================================================================================
    -- Company: LogicAppsMI                 Description: ${parent.description}          Product name:${parent.product}
    -- Module name: ${parent.module}        Date: ${parent.date}                   Author name: ${parent.author}
    -- ===============================================================================================================

    DECLARE vCount INT DEFAULT 0;

    -- Convert date columns
    ${dateConvertBlock}

    -- Record count
    ${recordCountBlock}

    IF vCount = 0 THEN

        -- INSERT
        INSERT INTO ${parent.table} (
            ${insertCols.join(", ")}
        ) VALUES (
            ${insertPlaceholders}
        );

        ${parent.scopeIdentity ? "SET @NewId = LAST_INSERT_ID();" : ""}

    ELSE

        -- UPDATE
        UPDATE ${parent.table}
        SET ${updateSet}
        WHERE ${whereCond};

    END IF;

END$$

DELIMITER ;
`.trim();
}
