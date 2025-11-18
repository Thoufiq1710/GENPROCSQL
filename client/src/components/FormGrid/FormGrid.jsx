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
import Select from "react-select";

const FormGrid = ({
  title,
  fields,
  onSubmit,
  isLoading,
  serverResponse,
  defaultValues,
}) => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState([]);

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
            if (f.type === "select") {
              // Set first option or 0 as default
              const firstValue =
                f.options?.[0]?.value !== undefined ? f.options[0].value : 0;
              return [f.name, firstValue];
            }
            return [f.name, f.type === "checkbox" ? false : ""];
        }
      })
    );
  };

  //  Initialize the first empty row
  useEffect(() => {
    if (fields?.length > 0) {
      if (defaultValues) setRows([defaultValues]); // ✅ prefill edit values
      else setRows([createEmptyRow()]);
    }
  }, [fields, defaultValues]);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = [];

    rows.forEach((row, rowIndex) => {
      fields.forEach((f) => {
        if (f.required && !f.hidden) {
          const value = row[f.name];
          let isInvalid = false;

          if (f.type === "select") {
            isInvalid =
              value === 0 ||
              value === "" ||
              value === null ||
              value === undefined;
          } else {
            isInvalid =
              value === "" ||
              value === null ||
              (typeof value === "string" && !value.trim());
          }

          if (isInvalid) {
            newErrors.push({ row: rowIndex, field: f.name });
          }
        }
      });
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      alert("Please fill all required fields before submitting.");
      return;
    }

    setErrors([]);
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
                                  <Select
                                    options={f.options || []}
                                    value={
                                      (f.options || []).find(
                                        (opt) =>
                                          String(opt.value) ===
                                          String(row[f.name] ?? 0)
                                      ) || (f.options ? f.options[0] : null)
                                    }
                                    onChange={(selected) =>
                                      handleChange(
                                        i,
                                        f.name,
                                        selected ? selected.value : 0
                                      )
                                    }
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        minHeight: 38,
                                        fontSize: "0.9rem",
                                        borderColor: errors.some(
                                          (err) =>
                                            err.row === i &&
                                            err.field === f.name
                                        )
                                          ? "red"
                                          : state.isFocused
                                          ? "#4f9dff"
                                          : "#ced4da",
                                        boxShadow: state.isFocused
                                          ? "0 0 0 0.2rem rgba(79,157,255,0.25)"
                                          : "none",
                                        "&:hover": {
                                          borderColor: errors.some(
                                            (err) =>
                                              err.row === i &&
                                              err.field === f.name
                                          )
                                            ? "red"
                                            : "#4f9dff",
                                        },
                                        width: "100%",
                                      }), 
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                        fontSize: "1rem",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 99999,
                                        fontSize: "1rem",
                                        width: "max-content", // ✅ adjust to longest option
                                        minWidth: "100%",
                                      }),
                                      menuList: (base) => ({
                                        ...base,
                                        maxHeight: 180,
                                        fontSize: "1rem",
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        fontSize: "0.9rem",
                                      }),
                                    }}
                                  />
                                ) : f.type === "textarea" ? (
                                  // Textarea
                                  <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={row[f.name]}
                                    onChange={(e) =>
                                      handleChange(i, f.name, e.target.value)
                                    }
                                    style={{
                                      borderColor: errors.some(
                                        (err) =>
                                          err.row === i && err.field === f.name
                                      )
                                        ? "red"
                                        : undefined,
                                    }}
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
  defaultValues: PropTypes.object, // ✅ for edit functionality
};

FormGrid.defaultProps = {
  title: "",
  onSubmit: () => {},
  isLoading: false,
  serverResponse: null,
};

export default FormGrid;
