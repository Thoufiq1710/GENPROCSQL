import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const ModulePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [projectOptions, setProjectOptions] = useState([]);

  // ✅ Fetch Project List for Dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosClient.get("/common/drop-down/PROJECT/NULL");
        if (res.data?.result && Array.isArray(res.data.result)) {
          const formatted = res.data.result.map((item) => ({
            label: item.Name,
            value: item.Id,
          }));
          setProjectOptions(formatted);
          console.log("Fetched project options:", formatted);
        } else {
          console.warn("Invalid response structure:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch project list:", err);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Module Form Fields
  const fields = [
    {
      name: "projectId",
      label: "Project",
      type: "select",
      required: true,
      options: projectOptions,
    },
    {
      name: "moduleName",
      label: "Module Name",
      type: "text",
      required: true,
    },
    {
      name: "moduleDes",
      label: "Module Description",
      type: "textarea",
      required: false,
    },
    {
      name: "status",
      label: "Status",
      type: "checkbox",
      required: true,
    },
    {
      name: "inactiveReason",
      label: "Inactive Reason",
      type: "textarea",
      required: false,
    },
    {
      name: "createdUser",
      label: "Created User",
      type: "number",
      hidden: true,
    },
  ];

  // ✅ Tabs Configuration
  const tabs = [
    {
      key: "master",
      label: "Master Grid",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "master",
    },
    {
      key: "insert",
      label: "Insert Module",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "insert",
    },
  ];

  // ✅ Submit Handler
  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({
        ...r,
        moduleId: 0, // required by your API
      }));
      const res = await axiosClient.post("/common/module/names", payload);
      console.log("Module submit response:", res.data);
      setServerResponse(res.data);
    } catch (err) {
      console.error("Error submitting module data:", err);
      setServerResponse({
        success: false,
        message:
          err.response?.data?.message ||
          "Error submitting module data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="master-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <LeftTabMenu />
      </aside>

      {/* Main Area */}
      <main className="main-content">
        <Header />

        <Container fluid className="py-4">
          {/* Tabs */}
          <TabMenu tabs={tabs} variant="tabs" defaultActiveKey="master" />

          {/* Grid / Form */}
          <Row className="mt-4">
            <Col xs={12}>
              {activeTab === "insert" ? (
                <div className="form-area">
                  <FormGrid
                    title="Module Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                  />
                </div>
              ) : (
                <div className="empty-grid">
                  Master Grid will be displayed here.
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default ModulePage;
