import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import MasterGrid from "../../components/MasterGrid/MasterGrid";
import FormGrid from "../../components/FormGrid/FormGrid";
import Toaster from "../../components/Toaster/Toaster";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const LovPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);

  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(
        "/common/master-grid/DCS_M_LIST_OF_VALUES"
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setGridData(res.data.data);
      } else {
        setError("Invalid response format.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch LOV master grid data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterGrid();
  }, []);

  //  LOV Form Fields
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

  // Tabs Configuration
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

  // Submit Handler
  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({
        ...r,
        lovId: editRow?.lovId || 0, // new or edit
      }));

      const res = await axiosClient.post("/common/lov/names", payload);
      const data = res.data;
      setServerResponse(data);

      if (data.success && !data.failedLOVs?.length) {
        setToastData([
          {
            text: data.message || "LOV saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      if (data.failedLOVs?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };

        const failedToasts = data.failedLOVs.map((f) => ({
          text: `❌ ${f.lov.lovName}: ${f.error}`,
          variant: "danger",
        }));

        setToastData([summaryToast, ...failedToasts]);
        return;
      }

      setToastData([
        { text: data.message || "Unexpected response.", variant: "warning" },
      ]);
    } catch (err) {
      console.error(err);
      setToastData([
        {
          text: err.response?.data?.message || "Error submitting LOV form.",
          variant: "danger",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Edit Handler
  const handleEdit = (rowData) => {
    const mappedRow = {
      lovId: rowData.LOV_ID || 0,
      lovName: rowData.LOV_NAME || "",
      lovDescription: rowData.LOV_DESCRIPTION || "",
      inactiveReason: rowData.C2C_Inactive_Reason || "",
      status: rowData.C2C_Status === 1,
      createdUser: rowData.Created_By || 1,
      createdDate: rowData.Created_Date || "",
    };

    setEditRow(mappedRow);
    setActiveTab("insert");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="LOV Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="LovMaster"
                  onEdit={handleEdit}
                />
              )}
            </Col>
          </Row>
        </Container>
        <Toaster toastData={toastData} setToastData={setToastData} />
      </main>
    </div>
  );
};

export default LovPage;
