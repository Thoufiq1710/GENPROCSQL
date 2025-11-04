import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const LovPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");

  // ✅ LOV Form Fields
  const fields = [
    {
      name: "lovName",
      label: "LOV Name",
      type: "text",
      required: true,
    },
    {
      name: "lovDescription",
      label: "LOV Description",
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
      label: "Insert LOV",
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
        lovId: 0, // new record
      }));

      const res = await axiosClient.post("/common/lov/names", payload);
      setServerResponse(res.data);
    } catch (err) {
      setServerResponse({
        success: false,
        message: err.response?.data?.message || "Error submitting LOV data.",
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
                    title="LOV Creation"
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

export default LovPage;
