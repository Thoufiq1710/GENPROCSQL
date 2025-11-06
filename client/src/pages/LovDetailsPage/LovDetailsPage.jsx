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

const LovDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);
  const [lovOptions, setLovOptions] = useState([]);

  // ✅ Fetch Dropdown Data (LOV List)
  const fetchLovs = async () => {
    try {
      const res = await axiosClient.get("/common/drop-down/LOV/NULL");
      if (res.data?.result && Array.isArray(res.data.result)) {
        const formatted = res.data.result.map((item) => ({
          label: item.Name,
          value: item.Id,
        }));
        setLovOptions(formatted);
      } else {
        console.warn("Invalid response structure:", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch LOV dropdown:", err);
    }
  };

  // ✅ Fetch Master Grid Data
  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(
        "/common/master-grid/DCS_M_LIST_OF_VALUES_DETAILS"
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setGridData(res.data.data);
      } else {
        setError("Invalid response format.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch LOV Details master grid data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLovs();
    fetchMasterGrid();
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
        lovDetId: editRow?.lovDetId || 0, // update or insert
      }));

      const res = await axiosClient.post("/common/lov_det/names", payload);
      const data = res.data;
      setServerResponse(data);

      if (data.success && !data.failedLovDetails?.length) {
        setToastData([
          {
            text: data.message || "LOV Detail saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      if (data.failedLovDetails?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };

        const failedToasts = data.failedLovDetails.map((f) => ({
          text: `❌ ${f.lovDetail.lovDetName}: ${f.error}`,
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
          text:
            err.response?.data?.message || "Error submitting LOV Detail form.",
          variant: "danger",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Edit
  const handleEdit = (rowData) => {
    const mappedRow = {
      lovDetId: rowData.LOV_DET_ID || 0,
      lovId: rowData.LOV_ID || "",
      lovDetName: rowData.LOV_DET_NAME || "",
      lovDetDescription: rowData.LOV_DET_DESCP || "",
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
                    title="LOV Details Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="LOV  Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="LovDetailsMaster"
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

export default LovDetailsPage;
