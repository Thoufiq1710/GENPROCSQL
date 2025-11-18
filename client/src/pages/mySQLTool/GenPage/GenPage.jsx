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
    description: "",
    author: "",
    tableName: "",
    pageNo: "",
    logo: false,
    exportType: "",
    columnGrid: [],
    procedureName: "",
  });

  // ========================
  // DROPDOWN FETCH
  // ========================
  const fetchProjects = async () => {
    const res = await axiosClient.get("/common/drop-down/PROJECT/NULL");
    const options = res.data.result.map((p) => ({
      value: p.Id,
      label: p.Name,
    }));
    setProjects(options);
  };
  console.log(form.tableName);
  const fetchModules = async (projectId) => {
    const res = await axiosClient.get(`/common/drop-down/MODULE/${projectId}`);
    const options = res.data.result.map((m) => ({
      value: m.Id,
      label: m.Name,
    }));
    setModules(options);
  };

  const fetchProducts = async (projectId) => {
    const res = await axiosClient.get(`/common/drop-down/PRODUCT/${projectId}`);
    const options = res.data.result.map((p) => ({
      value: p.Id,
      label: p.Name,
    }));
    setProducts(options);
  };

  const fetchTables = async () => {
    const res = await axiosClient.get("/common/drop-down/TABLE_LIST/null");
    const options = res.data.result.map((t) => ({
      value: t.Name,
      label: t.Name,
    }));
    setTables(options);
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
  // HANDLE CHANGE
  // ========================
  const handleSelectChange = (name, selected) => {
    let value = selected ? selected.value : "";

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
  // GENERATE ACTION
  // ========================
  const handleGenerate = () => {
    console.log("Generating with:", form);
    alert("Generated Successfully!");
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
                  onChange={(selected) =>
                    handleSelectChange("projectId", selected)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label>Module</Form.Label>
                <Select
                  options={modules}
                  value={modules.find((m) => m.value === form.moduleId)}
                  onChange={(selected) =>
                    handleSelectChange("moduleId", selected)
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label>Product</Form.Label>
                <Select
                  options={products}
                  value={products.find((p) => p.value === form.productId)}
                  onChange={(selected) =>
                    handleSelectChange("productId", selected)
                  }
                />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={3}>
                <Form.Label>Procedure Name</Form.Label>
                <Form.Control
                  type="text"
                  name="procedureName"
                  value={form.procedureName}
                  onChange={(e) =>
                    setForm({ ...form, procedureName: e.target.value })
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="custom-textarea"
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Col>

              <Col md={3}>
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                />
              </Col>
            </Row>

            {/* TABLE SELECTION */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Select Table</Form.Label>
                <Select
                  options={tables}
                  value={tables.find((t) => t.value === form.tableName)}
                  onChange={(selected) =>
                    handleSelectChange("tableName", selected)
                  }
                />
              </Col>
            </Row>

            {/* COLUMN MULTI SELECT */}
            <Row className="mt-4">
              <Form.Label>Columns</Form.Label>
              <Select
                isMulti
                name="columnGrid"
                options={columns}
                value={columns.filter((c) => form.columnGrid.includes(c.value))}
                onChange={(selected) =>
                  setForm({
                    ...form,
                    columnGrid: selected.map((s) => s.value),
                  })
                }
              />
            </Row>

            <Row className="mt-4">
              <Col md={3}>
                <Button variant="primary" onClick={handleGenerate}>
                  Generate
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
