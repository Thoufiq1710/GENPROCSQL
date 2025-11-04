import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const LanguagePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");

  const fields = [
    {
      name: "languageName",
      label: "Language Name",
      type: "text",
      required: true,
    },
    { name: "status", label: "Status", type: "checkbox" },
    { name: "inactiveReason", label: "Inactive Reason", type: "textarea" },
    {
      name: "createdUser",
      label: "Created User",
      type: "number",
      hidden: true,
    },
  ];

  const tabs = [
    {
      key: "master",
      label: "Master Grid",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "master",
    },
    {
      key: "insert",
      label: "Insert the Language",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "insert",
    },
  ];

  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({ ...r, languageId: 0 }));
      const res = await axiosClient.post("/common/language/names", payload);
      setServerResponse(res.data);
    } catch (err) {
      setServerResponse({
        success: false,
        message: err.response?.data?.message || "Error submitting form.",
      });
    } finally {
      setIsLoading(false);
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
          <TabMenu tabs={tabs} variant="tabs" defaultActiveKey="master" />

          <Row className="mt-4">
            <Col xs={12}>
              {activeTab === "insert" ? (
                <div className="form-area">
                  <FormGrid
                    title="Language Creation"
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

export default LanguagePage;
