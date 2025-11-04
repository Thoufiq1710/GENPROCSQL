import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const ProjectPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [languageOptions, setLanguageOptions] = useState([]);

  // ✅ Fetch Dropdown Data (Language List)
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await axiosClient.get("/common/drop-down/LANGUAGE/NULL");
        if (res.data?.result && Array.isArray(res.data.result)) {
          const formatted = res.data.result.map((item) => ({
            label: item.Name,
            value: item.Id,
          }));
          setLanguageOptions(formatted);
          console.log("Fetched language options:", formatted);
        } else {
          console.warn("Invalid response structure:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch dropdown list:", err);
      }
    };
    fetchLanguages();
  }, []);

  // ✅ Project Form Fields
  const fields = [
    {
      name: "projectName",
      label: "Project Name",
      type: "text",
      required: true,
    },
    {
      name: "languageId",
      label: "Language",
      type: "select",
      required: true,
      options: languageOptions,
    },
    { name: "status", label: "Status", type: "checkbox", required: true },
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
      label: "Insert the Project",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "insert",
    },
  ];

  // ✅ Submit Handler
  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({ ...r, projectId: 0 }));
      const res = await axiosClient.post("/common/project/names", payload);
      setServerResponse(res.data);
    } catch (err) {
      setServerResponse({
        success: false,
        message:
          err.response?.data?.message || "Error submitting project data.",
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
                    title="Project Creation"
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

export default ProjectPage;
