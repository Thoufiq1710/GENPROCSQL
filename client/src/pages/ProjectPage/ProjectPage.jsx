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

const ProjectPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("master");
  const [gridData, setGridData] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [toastData, setToastData] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);

  // Fetch Dropdown Data (Language List)
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

  // Fetch Project Master Grid
  const fetchMasterGrid = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(
        "/common/master-grid/DCS_M_PROJECT/null"
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
    fetchMasterGrid();
    fetchLanguages();
  }, []);

  console.log("Language Options:", languageOptions);
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
      const payload = rows.map((r) => ({
        ...r,
        projectId: editRow?.projectId || 0,
      }));

      const res = await axiosClient.post("/common/project/names", payload);
      const data = res.data;
      setServerResponse(data);

      if (data.success && !data.failedProjects?.length) {
        setToastData([
          {
            text: data.message || "Project saved successfully.",
            variant: "success",
          },
        ]);
        await fetchMasterGrid();
        setEditRow(null);
        setActiveTab("master");
        return;
      }

      if (data.failedProjects?.length > 0) {
        const summaryToast = {
          text: `${data.message} — Total: ${data.summary.total}, Inserted: ${data.summary.inserted}, Failed: ${data.summary.failed}`,
          variant: "warning",
        };

        const failedToasts = data.failedProjects.map((f) => ({
          text: `❌ ${f.project.projectName}: ${f.error}`,
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
          text: err.response?.data?.message || "Error submitting project data.",
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
      const id = rowData.PROJECT_ID;
      if (!id) {
        console.error("Invalid PROJECT_ID for editing:", rowData);
        return;
      }
      setIsLoading(true);

      const res = await axiosClient.get(
        `/common/master-grid/editbind/DCS_M_PROJECT/${id}`
      );

      if (res.data?.success && res.data?.data.length > 0) {
        const record = res.data.data[0];
        console.log("Fetched Edit Record:", record);
        const mappedRow = {
          projectId: record.PROJECT_ID || 0,
          projectName: record.PROJECT_NAME || "",
          languageId: record.Language_ID || "",
          inactiveReason: record.C2C_Inactive_Reason || "",
          status: record.C2C_Status === 1,
          createdUser: record.C2C_Cuser || 1,
          createdDate: record.C2C_Cdate || "",
        };

        console.log("Fetched Edit Data:", mappedRow);

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
                    title="Project Creation"
                    fields={fields}
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    serverResponse={serverResponse}
                    defaultValues={editRow}
                  />
                </div>
              ) : (
                <MasterGrid
                  title="Project Master Grid"
                  data={gridData}
                  isLoading={isLoading}
                  error={error}
                  moduleName="ProjectMaster"
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

export default ProjectPage;
