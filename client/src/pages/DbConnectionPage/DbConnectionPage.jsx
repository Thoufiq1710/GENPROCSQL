import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import Header from "../../components/Header/Header";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import TabMenu from "../../components/Tabs/TabMenu";
import FormGrid from "../../components/FormGrid/FormGrid";
import MasterGrid from "../../components/MasterGrid/MasterGrid";
import Toaster from "../../components/Toaster/Toaster";
import { Container, Row, Col } from "react-bootstrap";
import "../Style.css";

const DbConnectionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  //  Fetch Dropdown Data (Project List)
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
      console.error("Failed to fetch project dropdown:", err);
    }
  };

  //  Fetch Master Grid Data
  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(
        "/common/master-grid/DCS_M_DB_CONNECTION"
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setGridData(res.data.data);
      } else {
        setError("Invalid response format.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch master grid data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMasterGrid();
  }, []);

  //  DB Connection Form Fields
  const fields = [
    {
      name: "dbName",
      label: "Database Name",
      type: "text",
      required: true,
    },
    {
      name: "serverName",
      label: "Server Name",
      type: "text",
      required: true,
    },
    {
      name: "userName",
      label: "Username",
      type: "text",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
    },
    {
      name: "projectId",
      label: "Project",
      type: "select",
      required: true,
      options: projectOptions,
    },
    {
      name: "companyName",
      label: "Company Name",
      type: "text",
      required: true,
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
      label: "Insert DB Connection",
      onClick: (key) => setActiveTab(key),
      active: activeTab === "insert",
    },
  ];

  //  Submit Handler
  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({
        ...r,
        dbConnectionId: editRow?.dbConnectionId || 0,
      }));

      const res = await axiosClient.post("/common/dbConnection/names", payload);
      const data = res.data;
      setServerResponse(data);

      if (data.success && !data.failedConnections?.length) {
        setToastData([
          {
            text: data.message || "DB Connection saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      if (data.failedConnections?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };

        const failedToasts = data.failedConnections.map((f) => ({
          text: `❌ ${f.dbConnection.dbName}: ${f.error}`,
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
          text: err.response?.data?.message || "Error submitting form.",
          variant: "danger",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  //  Edit Handler
  const handleEdit = (rowData) => {
    const mappedRow = {
      dbConnectionId: rowData.DB_CONNECTION_ID || 0,
      dbName: rowData.DB_NAME || "",
      serverName: rowData.SERVER_NAME || "",
      userName: rowData.USER_NAME || "",
      password: rowData.PASSWORD || "",
      projectId: rowData.PROJECT_ID || "",
      companyName: rowData.COMPANY_NAME || "",
      status: rowData.C2C_Status === 1,
      inactiveReason: rowData.C2C_Inactive_Reason || "",
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
                    title="DB Connection Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="DB Connection Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="DbConnectionMaster"
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

export default DbConnectionPage;
