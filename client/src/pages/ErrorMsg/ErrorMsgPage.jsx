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

const ErrorMsgPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);

  // ✅ Fetch Master Grid
  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(
        "/common/master-grid/DCS_M_ERR_MESSAGE/null"
      );
      if (Array.isArray(res.data)) {
        setGridData(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setGridData(res.data.data);
      } else {
        setError("Invalid response format.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch error message data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterGrid();
  }, []);

  // ✅ Form Fields
  const fields = [
    // { name: "errorPrefixId", label: "Error Prefix ID", type: "text" },
    { name: "errorMsg", label: "Error Message", type: "text", required: true },
    { name: "errorCode", label: "Error Code", type: "text", required: true },
    {
      name: "createdUser",
      label: "Created User",
      type: "number",
      hidden: true,
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
  ];

  // ✅ Tabs
  const tabs = [
    {
      key: "master",
      label: "Master Grid",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "master",
    },
    {
      key: "insert",
      label: "Insert Error Message",
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
        errorPrefixId: null,
        errorId: editRow?.errorId || 0,
      }));

      const res = await axiosClient.post("/common/error-msg", payload);
      const data = res.data;
      setServerResponse(data);

      // ✅ Complete Success
      if (data.success && !data.failedErrors?.length) {
        setToastData([
          {
            text: data.message || "Error messages saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      // ✅ Partial Success
      if (data.failedErrors?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };

        const failedToasts = data.failedErrors.map((f) => ({
          text: `❌ ${f.data.errorMsg}: ${f.error}`,
          variant: "danger",
        }));

        const addedToasts =
          data.addedErrors?.map((a) => ({
            text: `✅ ${a.errorMsg}: ${a.dbMessage || "Added successfully."}`,
            variant: "success",
          })) || [];

        setToastData([summaryToast, ...addedToasts, ...failedToasts]);
        return;
      }

      // ✅ Unexpected response
      setToastData([
        { text: data.message || "Unexpected response.", variant: "warning" },
      ]);
    } catch (err) {
      console.error(err);
      setToastData([
        {
          text:
            err.response?.data?.message ||
            "Error submitting error message data.",
          variant: "danger",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Edit Handler
  const handleEdit = async (rowData) => {
    try {
      const id = rowData.ERROR_ID;
      if (!id) {
        console.error("Invalid ERROR_ID for editing:", rowData);
        return;
      }
      setIsLoading(true);

      const res = await axiosClient.get(
        `/common/master-grid/editbind/DCS_M_ERR_MESSAGE/${id}`
      );

      if (res.data?.success && res.data?.data.length > 0) {
        const record = res.data.data[0];

        const mappedRow = {
          errorId: record.ERROR_ID || 0,
          errorPrefixId: record.ERROR_PREFIX_ID || "",
          errorMsg: record.ERROR_MSG || "",
          errorCode: record.ERROR_CODE || "",
          inactiveReason: record.C2C_Inactive_Reason || "",
          status: record.C2C_Status === 1,
          createdUser: record.C2C_Cuser || 1,
          createdDate: record.C2C_Cdate || "",
        };

        setEditRow(mappedRow);
        setActiveTab("insert");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("No data found for the selected project record.");
      }
    } catch (error) {
      console.error("Edit fetch failed:", err);
      setError("Failed to fetch record for editing.");
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
                    title="Error Message Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="Error Message Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="ErrorMsgMaster"
                  onEdit={handleEdit}
                />
              )}
            </Col>
          </Row>
        </Container>

        {/* Toast Notifications */}
        <Toaster toastData={toastData} setToastData={setToastData} />
      </main>
    </div>
  );
};

export default ErrorMsgPage;
