import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const LovDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [lovOptions, setLovOptions] = useState([]);

  // ✅ Fetch Dropdown Data (LOV List)
  useEffect(() => {
    const fetchLovs = async () => {
      try {
        const res = await axiosClient.get("/common/drop-down/LOV/NULL");
        if (res.data?.result && Array.isArray(res.data.result)) {
          const formatted = res.data.result.map((item) => ({
            label: item.Name,
            value: item.Id,
          }));
          setLovOptions(formatted);
          console.log("Fetched LOV options:", formatted);
        } else {
          console.warn("Invalid response structure:", res.data);
        }
      } catch (err) {
        console.error("Failed to fetch LOV dropdown:", err);
      }
    };
    fetchLovs();
  }, []);

  // ✅ LOV Details Form Fields
  const fields = [
    {
      name: "lovId",
      label: "LOV",
      type: "select",
      required: true,
      options: lovOptions,
    },
    {
      name: "lovDetName",
      label: "LOV Detail Name",
      type: "text",
      required: true,
    },
    {
      name: "lovDetDescription",
      label: "LOV Detail Description",
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
      label: "Insert LOV Detail",
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
        lovDetId: 0,
      }));

      const res = await axiosClient.post("/common/lov_det/names", payload);
      setServerResponse(res.data);
    } catch (err) {
      setServerResponse({
        success: false,
        message:
          err.response?.data?.message || "Error submitting LOV detail data.",
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
                    title="LOV Details Creation"
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

export default LovDetailsPage;
