import React from "react";
import { Table, Form } from "react-bootstrap";
import "./LanguageTable.css";

function LanguageTable({ rows, onChange }) {
  return (
    <Table bordered hover className="table">
      <thead className="table-header">
        <tr className="table-field-row">
          <th className="field-name">S.no</th>
          <th className="field-name">Language Name</th>
          <th className="field-name">Language Status</th>
          {rows.some((row) => row.lStatus === "inactive") && (
            <th className="field-name">Inactive Reason</th>
          )}
        </tr>
      </thead>
      <tbody className="table-body">
        {rows.map((row, index) => (
          <tr key={row.sNO}>
            <td>{row.sNO}</td>
            <td>
              <Form.Control
                type="text"
                value={row.lName}
                name="lName"
                onChange={(e) => onChange(index, "lName", e.target.value)}
              />
            </td>
            <td>
              <Form.Check
                type="switch"
                id={`status-switch-${index}`}
                label={row.lStatus === "active" ? "active" : "inactive"}
                checked={row.lStatus === "active"}
                onChange={(e) =>
                  onChange(
                    index,
                    "lStatus",
                    e.target.checked ? "active" : "inactive"
                  )
                }
              />
            </td>
            {row.lStatus === "inactive" && (
              <td>
                <Form.Control
                  as="textarea"
                  placeholder="Enter inactive reason"
                  value={row.lInactiveReason || ""}
                  name="lInactiveReason"
                  onChange={(e) =>
                    onChange(index, "lInactiveReason", e.target.value)
                  }
                  className="inactive-textarea"
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default LanguageTable;
