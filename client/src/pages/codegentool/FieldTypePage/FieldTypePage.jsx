import React, { useEffect, useState } from "react";
import LeftTabMenu from "../../../components/LeftTabMenu/LeftTabMenu";
import { Container, Row, Col, Button, Table, Form } from "react-bootstrap";
import axiosClient from "../../../api/axiosClient";   // ⭐ FIXED HERE
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import TabMenu from "../../../components/Tabs/TabMenu";
import Toaster from "../../../components/Toaster/Toaster";
import "../../../Pages/Style.css";


  const FieldTypePage = () => {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const [elementType, setElementType] = useState([]);
  const [toastData, setToastData] = useState([]);
  const [activeTab, setActiveTab] = useState("master");
  const navigate = useNavigate();

  // Fetch dropdown data
  useEffect(() => {
    fetchElementType();
  }, []);

  const fetchElementType = async () => {
    try {
      const res = await axiosClient.get("/lov/ELEMENT_TYPE");  // ⭐ FIXED API CALL

      const formatted = res.data.result.map((item) => ({
        id: item.Id,
        name: item.Name,
      }));

      setElementType(formatted);
    } catch (error) {
      console.error(error);
      setToastData([
        { text: "Failed to load element types.", variant: "danger" },
      ]);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNO: idCounter,
        fieldTypeId: null,
        elementTypeId: 0,
        fieldName: "",
        fStatus: "1",
        fInactiveReason: null,
        cUser: "admin",
      },
    ]);
    setIdCounter(idCounter + 1);
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleSubmit = () => {
    axiosClient
      .post("/field-types/insert", rows)  // ⭐ FIXED API CALL
      .then((res) => {
        const msg = `Added: ${res.data.addedCount}, Failed: ${res.data.failedCount}`;
        setToastData([{ text: msg, variant: "success" }]);
      })
      .catch(() => {
        setToastData([
          { text: "Error submitting field types!", variant: "danger" },
        ]);
      });

    setRows([]);
  };

  const handleViewField = () => navigate("/view-field");

  const tabs = [
    {
      key: "master",
      label: "Field Type Master",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "master",
    },
    {
      key: "insert",
      label: "Create Field Type",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "insert",
    },
  ];

  return (
    <div className="master-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <LeftTabMenu />
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Header />

        <Container fluid className="py-4">
          <TabMenu tabs={tabs} variant="tabs" defaultActiveKey="master" />

          <Row className="mt-4">
            <Col xs={12}>
              {/* Insert Section */}
              {activeTab === "insert" ? (
                <div className="project-form-container">
                  <div className="project-form-header">
                    <h3 className="project-page-heading">Field Type Creation</h3>
                    <Button
                      onClick={handleAddRow}
                      className="create-project-btn"
                    >
                      Add Field
                    </Button>
                  </div>

                  {/* Field Type Table */}
                  <Table bordered hover className="table mt-4">
                    <thead className="table-header">
                      <tr className="table-field-row">
                        <th>S.No</th>
                        <th>Element Type</th>
                        <th>Field Name</th>
                        <th>Status</th>
                        {rows.some((r) => r.fStatus === "0") && (
                          <th>Inactive Reason</th>
                        )}
                      </tr>
                    </thead>

                    <tbody className="table-body">
                      {rows.map((row, index) => (
                        <tr key={row.sNO}>
                          <td>{row.sNO}</td>

                          <td>
                            <Form.Select
                              value={row.elementTypeId}
                              onChange={(e) =>
                                handleChange(index, "elementTypeId", e.target.value)
                              }
                            >
                              <option value="0">Select Element Type</option>
                              {elementType.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </Form.Select>
                          </td>

                          <td>
                            <Form.Control
                              type="text"
                              value={row.fieldName}
                              onChange={(e) =>
                                handleChange(index, "fieldName", e.target.value)
                              }
                            />
                          </td>

                          <td>
                            <Form.Check
                              type="switch"
                              id={`status-switch-${index}`}
                              label={row.fStatus === "1" ? "Active" : "In-Active"}
                              checked={row.fStatus === "1"}
                              onChange={(e) =>
                                handleChange(index, "fStatus", e.target.checked ? "1" : "0")
                              }
                            />
                          </td>

                          {row.fStatus === "0" && (
                            <td>
                              <Form.Control
                                as="textarea"
                                placeholder="Enter inactive reason"
                                value={row.fInactiveReason || ""}
                                onChange={(e) =>
                                  handleChange(index, "fInactiveReason", e.target.value)
                                }
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="project-btn-container mt-4">
                    <Button onClick={handleSubmit} className="submit-btn">
                      Submit
                    </Button>

                    <Button
                      onClick={handleViewField}
                      className="view-project-btn"
                    >
                      View Stored Data
                    </Button>
                  </div>
                </div>
              ) : (
                <h4>Master Grid will come here (if needed)</h4>
              )}
            </Col>
          </Row>
        </Container>

        <Toaster toastData={toastData} setToastData={setToastData} />
      </main>
    </div>
  );
};

export default FieldTypePage;
