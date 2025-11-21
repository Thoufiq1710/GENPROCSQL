import "./ViewFieldTable.css";

import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ViewFieldTable({ rows }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/field");
  };
  return (
    <>
      <Table bordered hover className="table p-4">
        <thead className="table-header">
          <tr className="table-field-row">
            <th className="field-name">Element Name</th>
            <th className="field-name">Field Name</th>
            <th className="field-name">Field Status</th>
            <th className="field-name">Inactive Reason</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {rows.map((row, index) => {
            const elementRowClass =
              row.elementName === "Layers"
                ? " #ba0707ff"
                : row.elementName === "Component"
                ? "#08b877ff"
                : "#744200ff";
            return (
              <tr key={row.fTypeId} className="table-row">
                <td className="row-item" style={{ color: elementRowClass }}>
                  {row.elementName}
                </td>
                <td className="row-item">{row.fName}</td>
                <td className="row-item">
                  {row.fStatus === 1 ? "Active" : "Inactive"}
                </td>
                <td className="row-item">
                  {row.fInactiveReason === "" || row.fInactiveReason === null
                    ? "No Inactive Reason"
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button variant="danger" onClick={() => handleBack()}>
        Back
      </Button>
    </>
  );
}

export default ViewFieldTable;
