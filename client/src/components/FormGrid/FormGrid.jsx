import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Table,
  Button,
  Form,
  Card,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons"; // 🗑️ Optional Bootstrap icon
import "./FormGrid.css";

const FormGrid = ({ title, fields, onSubmit, isLoading, serverResponse }) => {
  const [rows, setRows] = useState([]);

  // 🧩 Helper to create an empty row
  const createEmptyRow = () => {
    return Object.fromEntries(
      fields.map((f) => {
        switch (f.name) {
          case "status":
            return [f.name, true];
          case "createdUser":
            return [f.name, 1];
          default:
            return [f.name, f.type === "checkbox" ? false : ""];
        }
      })
    );
  };

  //  Initialize the first empty row
  useEffect(() => {
    if (fields?.length > 0) setRows([createEmptyRow()]);
  }, [fields]);

  // ➕ Add Row
  const handleAddRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  // ✏️ Handle Field Change
  const handleChange = (index, fieldName, value) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [fieldName]: value } : row))
    );
  };

  // ❌ Remove Row
  const handleRemoveRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Submit
  // ✅ Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // --- Basic validation check ---
    for (const [rowIndex, row] of rows.entries()) {
      for (const f of fields) {
        if (f.required && !row[f.name]?.toString().trim()) {
          alert(`Please fill "${f.label}" in row ${rowIndex + 1}.`);
          return; // stop submission
        }
      }
    }

    onSubmit?.(rows);
  };

  const showInactiveColumn = rows.some((r) => r.status === false);

  if (!fields?.length)
    return <Alert variant="warning">No field definitions found.</Alert>;

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card.Body className="p-4">
            {/* Header Section */}
            <div className="d-flex justify-content-end mb-4">
              <Button variant="primary" onClick={handleAddRow} size="sm">
                + Add Row
              </Button>
            </div>

            {/* Form Section */}
            <Form onSubmit={handleSubmit}>
              <div className="table-responsive">
                <Table bordered hover className="align-middle text-center">
                  <thead className="table-primary">
                    <tr>
                      <th style={{ width: "70px" }}>S.No</th>
                      {fields.map(
                        (f, i) =>
                          !f.hidden &&
                          (f.name !== "inactiveReason" ||
                            showInactiveColumn) && (
                            <th key={i} className="text-nowrap">
                              {f.label}
                            </th>
                          )
                      )}
                      <th style={{ width: "100px" }}>Action</th>{" "}
                      {/* 🗑️ New Column */}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{i + 1}</td>
                        {fields.map(
                          (f, j) =>
                            !f.hidden &&
                            (f.name !== "inactiveReason" ||
                              showInactiveColumn) && (
                              <td key={j}>
                                {/* Switch */}
                                {f.name === "status" ? (
                                  <Form.Check
                                    type="switch"
                                    id={`status-${i}`}
                                    label={row[f.name] ? "Active" : "Inactive"}
                                    checked={!!row[f.name]}
                                    onChange={(e) =>
                                      handleChange(i, f.name, e.target.checked)
                                    }
                                  />
                                ) : f.type === "select" ? (
                                  // Dropdown
                                  <Form.Select
                                    value={row[f.name]}
                                    onChange={(e) =>
                                      handleChange(i, f.name, e.target.value)
                                    }
                                    required={f.required}
                                  >
                                    {(f.options || []).map((opt, idx) => (
                                      <option
                                        key={`${f.name}-${idx}`}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </option>
                                    ))}
                                  </Form.Select>
                                ) : f.type === "textarea" ? (
                                  // Textarea
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={row[f.name]}
                                    onChange={(e) =>
                                      handleChange(i, f.name, e.target.value)
                                    }
                                    disabled={
                                      f.name === "inactiveReason" && row.status
                                    }
                                  />
                                ) : (
                                  // Text/number input
                                  <Form.Control
                                    type={f.type}
                                    value={row[f.name]}
                                    required={f.required}
                                    onChange={(e) =>
                                      handleChange(i, f.name, e.target.value)
                                    }
                                  />
                                )}
                              </td>
                            )
                        )}

                        {/* 🗑️ Remove Button */}
                        <td>
                          <Button
                            variant="light"
                            size="sm"
                            className="border-0"
                            onClick={() => handleRemoveRow(i)}
                            disabled={rows.length === 1}
                            title="Delete Row"
                          >
                            <Trash className="text-dark" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Submit Section */}
              <div className="d-flex justify-content-end mt-3">
                <Button
                  type="submit"
                  variant="success"
                  className="px-4"
                  disabled={isLoading || rows.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </Form>

            {/* Server response */}
            {serverResponse && (
              <Alert
                className="mt-4"
                variant={serverResponse.success ? "success" : "danger"}
              >
                {serverResponse.message}
              </Alert>
            )}
          </Card.Body>
        </Col>
      </Row>
    </Container>
  );
};

// ✅ Prop Validation
FormGrid.propTypes = {
  title: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      hidden: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.any,
        })
      ),
      fetchOptions: PropTypes.func,
    })
  ).isRequired,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  serverResponse: PropTypes.shape({
    success: PropTypes.bool,
    message: PropTypes.string,
  }),
};

FormGrid.defaultProps = {
  title: "",
  onSubmit: () => {},
  isLoading: false,
  serverResponse: null,
};

export default FormGrid;
