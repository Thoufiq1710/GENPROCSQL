import React, { useState, useEffect } from "react";
import axiosClient from "../../../api/axiosClient";
import Header from "../../../components/Header/Header";
import LeftTabMenu from "../../../components/LeftTabMenu/LeftTabMenu";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import Select from "react-select";
import "./Style.css";

const GenPage = () => {
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);

  const [form, setForm] = useState({
    projectId: "",
    moduleId: "",
    productId: "",
    spName: "",
    spDescription: "",
    authorName: "",
    tableName: "",
    userVar: "",
    scopeVar: "",
    scopeIdentity: true,
    errMsg: true,
    status: true,
    inactiveReason: "",
    user: 1,
    columns: [],
  });

  const emptyColumnRow = {
    Insert_Update_SP_Insert_Columns: [],
    Insert_Update_SP_Update_Columns: [],
    Insert_Update_SP_Record_Count_Columns: [],
    Insert_Update_SP_Convert_Date_Columns: [],
    Insert_Update_SP_Where_Columns: [],
    Insert_Update_SP_Prefix_Columns: [],
  };

  // ========================
  // FETCH OPTIONS
  // ========================
  const fetchProjects = async () => {
    const res = await axiosClient.get("/common/drop-down/PROJECT/NULL");
    setProjects(res.data.result.map((p) => ({ value: p.Id, label: p.Name })));
  };

  const fetchModules = async (projectId) => {
    const res = await axiosClient.get(`/common/drop-down/MODULE/${projectId}`);
    setModules(res.data.result.map((m) => ({ value: m.Id, label: m.Name })));
  };

  const fetchProducts = async (projectId) => {
    const res = await axiosClient.get(`/common/drop-down/PRODUCT/${projectId}`);
    setProducts(res.data.result.map((p) => ({ value: p.Id, label: p.Name })));
  };

  const fetchTables = async () => {
    const res = await axiosClient.get("/common/drop-down/TABLE_LIST/null");
    setTables(res.data.result.map((t) => ({ value: t.Name, label: t.Name })));
  };

  const fetchColumns = async (tableName) => {
    const res = await axiosClient.get(
      `/common/drop-down/TABLE_COLS/${tableName}`
    );

    const colOptions = res.data.result
      .filter((c) => c.Id !== 0)
      .map((c) => ({
        value: c.Name,
        label: c.Name,
      }));

    setColumns(colOptions);
  };

  useEffect(() => {
    fetchProjects();
    fetchTables();
  }, []);

  // ========================
  // SELECT HANDLER
  // ========================
  const handleSelectChange = (name, selected) => {
    const value = selected ? selected.value : "";
    setForm({ ...form, [name]: value });

    if (name === "projectId") {
      fetchModules(value);
      fetchProducts(value);
    }

    if (name === "tableName") {
      fetchColumns(value);
    }
  };

  // ========================
  // COLUMN HANDLERS
  // ========================
  const addColumnRow = () => {
    setForm({ ...form, columns: [...form.columns, { ...emptyColumnRow }] });
  };

  const removeColumnRow = (index) => {
    const newRows = [...form.columns];
    newRows.splice(index, 1);
    setForm({ ...form, columns: newRows });
  };

  // FIXED VERSION — receives selected objects directly
  const handleColumnChange = (index, field, selected) => {
    const updated = [...form.columns];
    updated[index][field] = selected ? selected.map((s) => s.value) : [];
    setForm({ ...form, columns: updated });
  };

  // ========================
  // SUBMIT
  // ========================
  const handleSubmit = async () => {
    const payload = {
      spGenDetailsId: 0,
      spName: form.spName,
      spDescription: form.spDescription,
      moduleName: modules.find((m) => m.value === form.moduleId)?.label || "",
      productName:
        products.find((p) => p.value === form.productId)?.label || "",
      authorName: form.authorName,
      tableName: form.tableName,
      columns: form.columns,
      userVar: form.userVar,
      scopeIdentity: form.scopeIdentity,
      errMsg: form.errMsg,
      scopeVar: form.scopeVar,
      status: true,
      inactiveReason: "",
      user: 1,
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      await axiosClient.post("/mysql-tool/sp-gen/", payload);
      alert("SP Generated Successfully!");
    } catch (err) {
      console.error(err);
      alert("Error generating SP!");
    }
  };

  return (
    <div className="master-page">
      <aside className="sidebar">
        <LeftTabMenu />
      </aside>

      <main className="main-content">
        <Header />

        <Container fluid className="py-4">
          <Card className="p-4 shadow-sm rounded">
            <h4 className="mb-4">SP Generator</h4>

            {/* TOP ROW */}
            <Row className="mb-3">
              <Col md={3}>
                <Form.Label>Project</Form.Label>
                <Select
                  options={projects}
                  value={projects.find((p) => p.value === form.projectId)}
                  onChange={(s) => handleSelectChange("projectId", s)}
                />
              </Col>

              <Col md={3}>
                <Form.Label>Module</Form.Label>
                <Select
                  options={modules}
                  value={modules.find((m) => m.value === form.moduleId)}
                  onChange={(s) => handleSelectChange("moduleId", s)}
                />
              </Col>

              <Col md={3}>
                <Form.Label>Product</Form.Label>
                <Select
                  options={products}
                  value={products.find((p) => p.value === form.productId)}
                  onChange={(s) => handleSelectChange("productId", s)}
                />
              </Col>
            </Row>

            {/* DETAILS */}
            <Row className="mb-4">
              <Col md={3}>
                <Form.Label>Procedure Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.spName}
                  onChange={(e) => setForm({ ...form, spName: e.target.value })}
                />
              </Col>

              <Col md={3}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.spDescription}
                  onChange={(e) =>
                    setForm({ ...form, spDescription: e.target.value })
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={form.authorName}
                  onChange={(e) =>
                    setForm({ ...form, authorName: e.target.value })
                  }
                />
              </Col>
            </Row>

            {/* TABLE */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Select Table</Form.Label>
                <Select
                  options={tables}
                  value={tables.find((t) => t.value === form.tableName)}
                  onChange={(s) => handleSelectChange("tableName", s)}
                />
              </Col>
            </Row>

            {/* COLUMN BUILDER */}
            <h5 className="mt-4 mb-2">Column Mapping</h5>

            {form.columns.map((row, index) => (
              <Card key={index} className="p-3 mb-3 border">
                <Row>
                  {/* INSERT */}
                  <Col md={4}>
                    <Form.Label>Insert Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Insert_Columns?.includes(col.value)
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Insert_Columns",
                          selected
                        )
                      }
                    />
                  </Col>

                  {/* UPDATE */}
                  <Col md={4}>
                    <Form.Label>Update Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Update_Columns?.includes(col.value)
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Update_Columns",
                          selected
                        )
                      }
                    />
                  </Col>

                  {/* RECORD COUNT */}
                  <Col md={4}>
                    <Form.Label>Record Count Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Record_Count_Columns?.includes(
                          col.value
                        )
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Record_Count_Columns",
                          selected
                        )
                      }
                    />
                  </Col>
                </Row>

                <Row className="mt-2">
                  {/* DATE */}
                  <Col md={4}>
                    <Form.Label>Date Convert Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Convert_Date_Columns?.includes(
                          col.value
                        )
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Convert_Date_Columns",
                          selected
                        )
                      }
                    />
                  </Col>

                  {/* WHERE */}
                  <Col md={4}>
                    <Form.Label>Where Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Where_Columns?.includes(col.value)
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Where_Columns",
                          selected
                        )
                      }
                    />
                  </Col>

                  {/* PREFIX */}
                  <Col md={4}>
                    <Form.Label>Prefix Columns</Form.Label>
                    <Select
                      isMulti
                      options={columns}
                      value={columns.filter((col) =>
                        row.Insert_Update_SP_Prefix_Columns?.includes(col.value)
                      )}
                      onChange={(selected) =>
                        handleColumnChange(
                          index,
                          "Insert_Update_SP_Prefix_Columns",
                          selected
                        )
                      }
                    />
                  </Col>
                </Row>

                <Button
                  variant="danger"
                  size="sm"
                  className="mt-3"
                  onClick={() => removeColumnRow(index)}
                >
                  Remove Row
                </Button>
              </Card>
            ))}

            <Button variant="secondary" onClick={addColumnRow}>
              + Add Column Row
            </Button>

            <Row className="mt-4">
              <Col md={3}>
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
          </Card>
        </Container>
      </main>
    </div>
  );
};

export default GenPage;
