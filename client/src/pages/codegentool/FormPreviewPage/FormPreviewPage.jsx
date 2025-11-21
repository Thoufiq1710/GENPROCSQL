import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../../context/FormBuilderContext/FormContext";
import projectAPI from "../../api/Api";
import Toast from "../../components/Toaster/Toaster";
import TabEditor from "../../components/TabEditor/TabEditor";
import CodeGenerationPage from "../codeGenerationPage/CodeGenerationPage";
import {
  formReducer,
  initialState,
} from "../../context/FormBuilderContext/formReducer";
import {
  updateConfig,
  addTab,
  removeTab,
  addSection,
  removeSection,
  addColumn,
  removeColumn,
  updateToast,
  setFormGenData,
  setLoading,
  setDropdownData,
  setSpParamData,
  setTableCol,
  setShowJson,
} from "../../context/FormBuilderContext/formAction";
import { useState } from "react";

// --- Main Component ---
const FormPreviewPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useFormData();

  const [generatedCode, setGeneratedCode] = useState(null);
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  console.log(generatedCode);

  // Extract state for easier access
  const {
    config,
    toasts,
    isLoading,
    dropdownData,
    spParamData,
    tableCol,
    showJson,
    retrivedFormGenData,
  } = state;

  console.log(generatedCode);

  useEffect(() => {
    if (retrivedFormGenData && Object.keys(retrivedFormGenData).length > 0) {
      console.log("✅ Data loaded:", retrivedFormGenData.data.result);
    } else {
      console.log("⚠️ No data found yet");
    }
  }, [retrivedFormGenData]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    const newToast = { id, message, type };
    const updatedToasts = [...toasts, newToast];
    dispatch(updateToast(updatedToasts));

    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    const updatedToasts = toasts.filter((toast) => toast.id !== id);
    dispatch(updateToast(updatedToasts));
  };
  useEffect(() => {
    const isModuleEnabled = !!config.projectId;
    if (!config.projectId) {
      dispatch(updateConfig((prevConfig) => ({ ...prevConfig, moduleId: "" })));
    }
  }, [config.projectId]);

  useEffect(() => {
    const fetchAllData = async () => {
      dispatch(setLoading(true));
      try {
        await Promise.all([
          fetchFieldSrcData(),
          fetchFieldIconData(),
          fetchFieldOrderData(),
          fetchJsValData(),
          fetchProjectData(),
          fetchIconData(),
          fetchSpListData(),
          fetchTableListData(),
          fetchFieldTypeData(),
          fetchStoringSPData(),
          fetchEventHandlerData(),
          fetchLayoutData(),
          fetchProductData(),
        ]);
        showToast("All data loaded successfully", "success");
      } catch (error) {
        console.error("Error loading data:", error);
        showToast("Error loading some data. Using fallback values.", "warning");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAllData();
  }, []);

  // API fetch functions
  const fetchFieldSrcData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_source"
      );
      const formattedData = res.data.result.map((eachSrc) => ({
        id: eachSrc.Id,
        name: eachSrc.Name,
      }));
      dispatch(setDropdownData({ fieldSource: formattedData }));
    } catch (error) {
      console.error("Error fetching field source:", error);
    }
  };

  const fetchFieldIconData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_icon"
      );
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ fieldIcon: formattedData }));
    } catch (error) {
      console.error("Error fetching field icon:", error);
      dispatch(
        setDropdownData({
          fieldIcon: [
            { id: "1", name: "fa-user" },
            { id: "2", name: "fa-cog" },
          ],
        })
      );
    }
  };

  const fetchFieldOrderData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "LIST_OF_VALUES_DETAILS",
        "field_order"
      );
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ fieldOrder: formattedData }));
    } catch (error) {
      console.error("Error fetching field order:", error);
      dispatch(
        setDropdownData({
          fieldOrder: [
            { id: "1", name: "1" },
            { id: "2", name: "2" },
            { id: "3", name: "3" },
          ],
        })
      );
    }
  };

  const fetchJsValData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("JS_VALIDATIONS", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ jsVal: formattedData }));
    } catch (error) {
      console.error("Error fetching JS validations:", error);
      dispatch(
        setDropdownData({
          jsVal: [
            { id: "1", name: "Required" },
            { id: "2", name: "Email" },
          ],
        })
      );
    }
  };

  const fetchProjectData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("PROJECT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ projectData: formattedData }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      dispatch(
        setDropdownData({
          projectData: [
            { id: "1", name: "Project Alpha" },
            { id: "2", name: "Project Beta" },
          ],
        })
      );
    }
  };

  const fetchIconData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("TAB_IMAGE_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ iconData: formattedData }));
    } catch (error) {
      console.error("Error fetching icons:", error);
      dispatch(
        setDropdownData({
          iconData: [
            { id: "1", name: "fa-user" },
            { id: "2", name: "fa-cog" },
          ],
        })
      );
    }
  };

  const fetchSpListData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("SP_LIST", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ spList: formattedData }));
    } catch (error) {
      console.error("Error fetching SP list:", error);
      dispatch(
        setDropdownData({
          spList: [
            { id: "1", name: "sp_getUsers" },
            { id: "2", name: "sp_getProducts" },
          ],
        })
      );
    }
  };

  const fetchTableListData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("TABLE_LIST", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ tableList: formattedData }));
    } catch (error) {
      console.error("Error fetching table list:", error);
      dispatch(
        setDropdownData({
          tableList: [
            { id: "1", name: "Users" },
            { id: "2", name: "Products" },
          ],
        })
      );
    }
  };

  const fetchFieldTypeData = async () => {
    try {
      const res = await projectAPI.getLovDropdown(
        "FIELD_TYPE_COMPONENT_ONLY",
        null
      );
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ fieldTypeData: formattedData }));
    } catch (error) {
      console.error("Error fetching field types:", error);
      dispatch(
        setDropdownData({
          fieldTypeData: [
            { id: "1", name: "Text Input" },
            { id: "2", name: "Number Input" },
          ],
        })
      );
    }
  };

  const fetchStoringSPData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("STORING_SP", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ storedProcedures: formattedData }));
    } catch (error) {
      console.error("Error fetching storing SP:", error);
      dispatch(
        setDropdownData({
          storedProcedures: [
            { id: "1", name: "sp_saveUser" },
            { id: "2", name: "sp_saveProduct" },
          ],
        })
      );
    }
  };

  const fetchEventHandlerData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("FORM_EVENT_HANDLER", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ eventHandler: formattedData }));
    } catch (error) {
      console.error("Error fetching event handlers:", error);
      dispatch(
        setDropdownData({
          eventHandler: [
            { id: "1", name: "onChange" },
            { id: "2", name: "onClick" },
          ],
        })
      );
    }
  };

  const fetchLayoutData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("LAYOUT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ layout: formattedData }));
    } catch (error) {
      console.error("Error fetching layouts:", error);
      dispatch(
        setDropdownData({
          layout: [
            { id: "1", name: "Single Column" },
            { id: "2", name: "Two Column" },
          ],
        })
      );
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await projectAPI.getLovDropdown("PRODUCT_TABLE", null);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ productData: formattedData }));
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch(
        setDropdownData({
          productData: [
            { id: "1", name: "Product A" },
            { id: "2", name: "Product B" },
          ],
        })
      );
    }
  };

  const fetchSpParams = async (spName) => {
    try {
      const res = await projectAPI.getLovDropdown("SP_PARAMS", spName);
      const formattedParams = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setSpParamData(formattedParams));
    } catch (error) {
      console.error("Error fetching SP Params data: ", error);
      showToast("Error fetching stored procedure parameters", "error");
    }
  };

  const fetchTableColumns = async (tableName) => {
    try {
      const res = await projectAPI.getLovDropdown("TABLE_COLS", tableName);
      const formattedParams = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setTableCol(formattedParams));
    } catch (error) {
      console.error("Error fetching Table Columns data: ", error);
      showToast("Error fetching table columns", "error");
    }
  };
  const fetchModuleData = async (projectId) => {
    try {
      const res = await projectAPI.getLovDropdown("MODULE_TABLE", projectId);
      const formattedData = res.data.result.map((each) => ({
        id: each.Id,
        name: each.Name,
      }));
      dispatch(setDropdownData({ moduleData: formattedData }));
    } catch (error) {
      console.error("Error fetching modules:", error);
      dispatch(
        setDropdownData({
          moduleData: [
            { id: "1", name: "Core Module" },
            { id: "2", name: "Admin Module" },
          ],
        })
      );
    }
  };

  // Data processing before storing the data inside form generation table
  const processConfigForSave = (config) => {
    const newConfig = { ...config };

    newConfig.tabs = newConfig.tabs.map((tab) => ({
      ...tab,
      sections: tab.sections.map((sec) => ({
        ...sec,
        fields: sec.fields.map((field) => ({
          ...field,

          // ✅ Convert validations to [{ jsId }]
          validations: (field.validations || []).map((vId) => ({
            jsId: vId,
          })),

          // ✅ Keep event handlers structure: [{ eventId, functionName }]
          eventHandlers: (field.eventHandlers || []).map((ev) => ({
            eventId: ev.eventId,
            functionName: ev.functionName,
          })),
        })),
      })),
    }));

    return newConfig;
  };

  const handleSubmitConfig = async (e) => {
    e.preventDefault();
    // Data before storing them on the DB *finalPayload*
    const finalPayload = processConfigForSave(config);
    // Validation
    if (
      !config.projectId ||
      !config.moduleId ||
      !config.productId ||
      !config.layoutId ||
      !config.pageName
    ) {
      showToast("Please fill all required fields in Project Setup", "error");
      return;
    }

    if (config.tabs.length === 0) {
      showToast("Please add at least one tab", "error");
      return;
    }

    for (let tab of config.tabs) {
      if (!tab.tabName || !tab.tabIcon) {
        showToast("Please fill all required fields in tabs", "error");
        return;
      }
    }

    try {
      await projectAPI
        .insertFormGen(finalPayload)
        .then(async (res) => {
          console.log(res.data);
          showToast("Configuration saved successfully!", "success");

          const formResponse = await projectAPI.viewFormGenList();
          dispatch(setFormGenData(formResponse));
          // You might want to add a new action for this
          console.log("Fetched Form Data:", formResponse.data);
        })
        .catch((err) => {
          console.error(err);
          showToast("Error saving configuration", "error");
        });
    } catch (error) {
      showToast("Error saving configuration", "error");
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
      >
        <div className="text-center text-white">
          <div className="spinner-border mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading Form Builder...</h4>
        </div>
      </div>
    );
  }

  const isModuleEnabled = !!config.projectId;
  const handleGeneratedCode = (e) => {
    e.preventDefault();
    try {
      projectAPI.codeGen(retrivedFormGenData).then((res) => {
        setGeneratedCode(res.data.message);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      />

      {/* Toast Container */}
      <Toast messages={toasts} removeToast={removeToast} />

      <div
        className="min-vh-100 p-3"
        style={{ background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" }}
      >
        <nav
          className="navbar navbar-dark sticky-top shadow-lg mb-4 rounded-3 p-2"
          style={{ backgroundColor: "#070C37" }}
        >
          <div className="container-fluid">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline-light me-3"
            >
              <i className="fa fa-chevron-left me-1"></i> Back
            </button>
            <span className="navbar-brand h1 mb-0 text-white">
              <i className="fa fa-magic me-2"></i>Dynamic Form Generator V2
            </span>
            <div className="d-flex">
              <button
                onClick={() => dispatch(setShowJson(!showJson))}
                className="btn btn-outline-light me-2"
              >
                <i
                  className={`fa ${showJson ? "fa-eye-slash" : "fa-eye"} me-1`}
                ></i>
                {showJson ? "Hide Config" : "Show JSON"}
              </button>
              <button
                onClick={handleSubmitConfig}
                className="btn btn-outline-light text-white shadow-sm"
                style={{ backgroundColor: "#070C37" }}
              >
                <i className="fa fa-save me-1"></i> Save Configuration
              </button>
              <button
                onClick={(e) => {
                  handleGeneratedCode(e);
                  setShowGeneratedCode(true);
                  // navigate("/code-generation", { state: { generatedCode } });
                }}
                className="btn btn-outline-light ms-2"
                disabled={!config.pageName || config.tabs.length === 0}
              >
                <i className="fa fa-code me-1"></i> Generate Code
              </button>
            </div>
          </div>
        </nav>
        {showGeneratedCode ? (
          <CodeGenerationPage codeData={generatedCode} />
        ) : (
          <>
            {/* --- Project Setup Details --- */}
            <div className="card mb-4 shadow-lg border-0">
              <div
                className="card-header text-white fw-bold p-3"
                style={{ backgroundColor: "#070C37" }}
              >
                <i className="fa fa-cog me-2"></i>Project Setup Details
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Project ID <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={config.projectId}
                      onChange={(e) => {
                        const selectedProjectId = e.target.value;

                        // 1. Update project in config state
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            projectId: selectedProjectId,
                            moduleId: "", // clear selected module
                          }))
                        );

                        // 2. Fetch modules for selected project
                        if (selectedProjectId) {
                          fetchModuleData(selectedProjectId);
                        }
                      }}
                      required
                    >
                      {dropdownData.projectData.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Module ID <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${
                        !isModuleEnabled ? "bg-light text-muted" : ""
                      }`}
                      value={config.moduleId}
                      onChange={(e) =>
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            moduleId: e.target.value,
                          }))
                        )
                      }
                      disabled={!isModuleEnabled}
                      required
                    >
                      {isModuleEnabled &&
                        dropdownData.moduleData.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Product ID <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={config.productId}
                      onChange={(e) =>
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            productId: e.target.value,
                          }))
                        )
                      }
                      required
                    >
                      {dropdownData.productData.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">
                      Layout ID <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={config.layoutId}
                      onChange={(e) =>
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            layoutId: e.target.value,
                          }))
                        )
                      }
                      required
                    >
                      {dropdownData.layout.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">
                      Page Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={config.pageName}
                      onChange={(e) =>
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            pageName: e.target.value,
                          }))
                        )
                      }
                      placeholder="Enter page name"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Purpose</label>
                    <textarea
                      className="form-control"
                      value={config.purpose}
                      onChange={(e) =>
                        dispatch(
                          updateConfig((prevConfig) => ({
                            ...prevConfig,
                            purpose: e.target.value,
                          }))
                        )
                      }
                      placeholder="Describe the purpose of this form..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Tabs Section --- */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-dark fw-light">
                <i className="fa fa-layer-group me-2"></i>Form Tabs (
                {config.tabs.length})
              </h3>
              <button
                onClick={() => dispatch(addTab())}
                className="btn btn-lg shadow text-white"
                style={{ backgroundColor: "#070C37" }}
              >
                <i className="fa fa-plus me-2"></i> Add Tab
              </button>
            </div>

            {config.tabs.map((tab, tabIndex) => (
              <TabEditor
                key={tab.tab_id || tabIndex}
                tab={tab}
                tabIndex={tabIndex}
                dispatch={dispatch}
                addSection={addSection}
                removeSection={removeSection}
                addColumn={addColumn}
                removeColumn={removeColumn}
                removeTab={removeTab}
                fieldSource={dropdownData.fieldSource}
                fieldTypeData={dropdownData.fieldTypeData}
                fieldOrder={dropdownData.fieldOrder}
                fieldIcon={dropdownData.fieldIcon}
                jsVal={dropdownData.jsVal}
                spList={dropdownData.spList}
                tableList={dropdownData.tableList}
                storedProcedures={dropdownData.storedProcedures}
                eventHandler={dropdownData.eventHandler}
                iconData={dropdownData.iconData}
                spParamData={spParamData}
                tableCol={tableCol}
                showToast={showToast}
                fetchSpParams={fetchSpParams}
                fetchTableColumns={fetchTableColumns}
              />
            ))}

            {config.tabs.length === 0 && (
              <div className="text-center py-5 bg-white rounded shadow">
                <i className="fa fa-inbox fa-3x text-muted mb-3"></i>
                <h4 className="text-muted">No tabs added yet</h4>
                <p className="text-muted">
                  Click the "Add Tab" button to get started
                </p>
              </div>
            )}

            {showJson && (
              <div className="mt-5">
                <h3 className="text-dark border-bottom pb-2">
                  <i className="fa fa-code me-2"></i>Final JSON Output
                </h3>
                <pre
                  className="bg-dark text-white p-4 rounded shadow-lg overflow-auto"
                  style={{ maxHeight: "500px" }}
                >
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default FormPreviewPage;
