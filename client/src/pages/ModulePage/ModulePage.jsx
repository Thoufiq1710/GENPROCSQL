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

const ModulePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);

  //  Fetch Project List for Dropdown
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

  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/common/master-grid/DCS_M_MODULE");
      if (res.data?.success && Array.isArray(res.data.data)) {
        setGridData(res.data.data);
      } else {
        setError("Invalid response format from master grid.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch master grid data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterGrid();
    fetchProjects();
  }, []);

  // Module Form Fields
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

  //  Tabs Configuration
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

  //  Submit Handler
  const handleFormSubmit = async (rows) => {
    setIsLoading(true);
    setServerResponse(null);
    try {
      const payload = rows.map((r) => ({
        ...r,
        moduleId: editRow?.moduleId || 0, // update if editing
      }));

      const res = await axiosClient.post("/common/module/names", payload);
      const data = res.data;
      setServerResponse(data);

      if (data.success && !data.failedModules?.length) {
        setToastData([
          {
            text: data.message || "Module saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      if (data.failedModules?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };
        const failedToasts = data.failedModules.map((f) => ({
          text: `❌ ${f.module.moduleName}: ${f.error}`,
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
      moduleId: rowData.MODULE_ID || 0,
      moduleName: rowData.MODULE_NAME,
      moduleDes: rowData.MODULE_DES || "",
      projectId: rowData.PROJECT_ID || "",
      inactiveReason: rowData.C2C_Inactive_Reason || "",
      status: rowData.C2C_Status === 1,
      createdBy: rowData.Created_By || 1,
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
                    title="Module Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="Module Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="ModuleMaster"
                  onEdit={handleEdit}
                />
              )}
            </Col>
          </Row>
        </Container>

        {/*  Toaster for notifications */}
        <Toaster toastData={toastData} setToastData={setToastData} />
      </main>
    </div>
  );
};

export default ModulePage;
