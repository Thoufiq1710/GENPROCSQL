import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Toaster from "../Toaster/Toaster";
import ColumnEditor from "../ColumnEditor/ColumnEditor";
import "./FormBuilder.css";
import projectAPI from "../../api/Api";

export default function FormBuilder() {
  const [idCounter, setIdCounter] = useState(1);
  const [columns, setColumns] = useState([]);
  console.log(columns);
  // Tab UseState
  const [activeTabId, setActiveTabId] = useState(0);
  const [activeTabName, setActiveTabName] = useState("");
  const [activeTabState, setActiveTabState] = useState(true);
  // Toaster
  const [toastQueue, setToastQueue] = useState([]);
  const [currentToast, setCurrentToast] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [successHighlightedRows, setSuccessHighlightedRows] = useState([]);
  const [errorHighlightedRows, setErrorHighlightedRows] = useState([]);
  // Dropdown Bind List
  const [fieldSource, setFieldSource] = useState([]);
  const [fieldSize, setFieldSize] = useState([]);
  const [fieldIcon, setFieldIcon] = useState([]);
  const [fieldOrder, setFieldOrder] = useState([]);
  const [jsVal, setJsVal] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [iconData, setIconData] = useState([]);
  const [spList, setSpList] = useState([]);
  const [spParamData, setSpParamData] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [tableCol, setTableCol] = useState([]);
  const [fieldType, setFieldType] = useState([]);
  const [storedProcedures, setStoredProcedures] = useState([]);
  const [eventHandler, setEventHandler] = useState([]);

  const [showTabForm, setShowTabForm] = useState(false);

  // Post Data
  const [tabData, setTabData] = useState({
    tabId: null,
    projectId: 0,
    pageId: 0,
    tabName: "",
    tabImageId: 0,
    createdUser: "",
  });
  // const [columnData, setColumnData] = useState({
  //   tabId: 0,
  //   fieldSourceId: 0,
  //   fieldTypeId: 0,
  //   spName: null,
  //   spParam: null,
  //   tableName: null,
  //   tableColumns: null,
  //   customName: null,
  //   fieldName: "",
  //   fieldSizeId: 0,
  //   fieldIconId: 0,
  //   placeholder: "",
  //   fieldOrderId: 0,
  //   storedProcedure: "",
  //   validation: [],
  //   eventHandler: 0,
  //   cUser: "",
  // });
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabSubmitClicked, setTabSubmitClicked] = useState(false);

  // useEffect(() => {
  //   if (!showToast && toastQueue.length > 0) {
  //     const nextToast = toastQueue[0];
  //     setCurrentToast(nextToast);
  //     setShowToast(true);

  //     const timer = setTimeout(() => {
  //       setShowToast(false);
  //       setToastQueue((prev) => prev.slice(1));
  //     }, 2500);

  //     return () => clearTimeout(timer);
  //   }
  // }, [toastQueue, showToast]);

  useEffect(() => {
    // Update all existing columns with new tabId
    if (activeTabId) {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tabId: activeTabId,
        }))
      );
    }

    // Dropdown bind SP's
    fetchFieldSrcData();
    fetchFieldSizeData();
    fetchFieldIconData();
    fetchFieldOrderData();
    fetchJsValData();
    fetchProjectData();
    fetchPageData();
    fetchIconData();
    fetchTabData();
    fetchSpListData();
    fetchTableListData();
    fetchFieldTypeData();
    fetchStoringSPData();
    fetchEventHandlerData();
  }, [activeTabId]);

  const pushToast = (messages, variant = "danger") => {
    const formatted = Array.isArray(messages)
      ? messages.map((m) => ({ text: m, variant }))
      : [{ text: messages, variant }];
    if (toastQueue.length > 2) {
      setToastQueue((prev) => prev.slice(1));
    }
    setToastQueue((prev) => [...prev, ...formatted]);
  };

  const fetchFieldSrcData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_source")
        .then((res) => {
          const formattedData = res.data.result.map((eachSrc) => ({
            id: eachSrc.Id,
            name: eachSrc.Name,
          }));
          setFieldSource(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFieldSizeData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_size")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldSize(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldIconData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_icon")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldIcon(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldOrderData = async () => {
    try {
      await projectAPI
        .getLovDropdown("LIST_OF_VALUES_DETAILS", "field_order")
        .then((res) => {
          const formattedData = res.data.result.map((eachSize) => ({
            id: eachSize.Id,
            name: eachSize.Name,
          }));
          setFieldOrder(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchJsValData = async () => {
    try {
      await projectAPI.getLovDropdown("JS_VALIDATIONS", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setJsVal(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProjectData = async () => {
    try {
      await projectAPI.getLovDropdown("PROJECT_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setProjectData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPageData = async () => {
    try {
      await projectAPI.getLovDropdown("PAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setPageData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchIconData = async () => {
    try {
      await projectAPI.getLovDropdown("TAB_IMAGE_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setIconData(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTabData = async () => {
    try {
      await projectAPI.getLovDropdown("TAB_TABLE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setTabs(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSpListData = async () => {
    try {
      await projectAPI.getLovDropdown("SP_LIST", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setSpList(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTableListData = async () => {
    try {
      await projectAPI.getLovDropdown("TABLE_LIST", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setTableList(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFieldTypeData = async () => {
    try {
      await projectAPI.getLovDropdown("FIELD_TYPE", null).then((res) => {
        const formattedData = res.data.result.map((eachSize) => ({
          id: eachSize.Id,
          name: eachSize.Name,
        }));
        setFieldType(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchStoringSPData = async () => {
    try {
      await projectAPI.getLovDropdown("STORING_SP", null).then((res) => {
        const formattedData = res.data.result.map((eachSrc) => ({
          id: eachSrc.Id,
          name: eachSrc.Name,
        }));
        setStoredProcedures(formattedData);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEventHandlerData = async () => {
    try {
      await projectAPI
        .getLovDropdown("FORM_EVENT_HANDLER", null)
        .then((res) => {
          const formattedData = res.data.result.map((eachSrc) => ({
            id: eachSrc.Id,
            name: eachSrc.Name,
          }));
          setEventHandler(formattedData);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTabClick = () => setShowTabForm(true);

  const handleSubmitTab = async () => {
    setTabSubmitClicked(true);
    await projectAPI
      .insertTabDet(tabData)
      .then((res) => {
        const err = res.data.failedTab.map((eachItem) => eachItem.err);
        const successMsg = res.data.message;
        if (err[0]) {
          alert(`Error: ${err}`);
        }
        alert(`Success: ${successMsg}`);
      })
      .catch((error) => {
        console.error(error);
      });
    if (!tabData.tabName.trim()) return;
    const newTab = {
      id: Date.now(),
      tabName: tabData.tabName,
      tabImageId: tabData.tabImageId,
      columns: [],
      submittedColumns: [],
    };
    // await projectAPI.insertLanguage();
    setTabs([...tabs, newTab]);
    setTabData({ tabName: "", tabImageId: "" });
    setShowTabForm(false);
    setTabSubmitClicked(false);
    setActiveTab(tabs.length);
  };

  // const handleRemoveTab = (id) => {
  //   setTabs(tabs.filter((t) => t.id !== id));
  //   setActiveTab(null);
  // };

  const addColumn = () => {
    if (!activeTabId) {
      setActiveTabState(false);
    }
    setColumns((prev) => [
      ...prev,
      {
        sNo: idCounter,
        tabId: activeTabId,
        fieldSourceId: 0,
        fieldTypeId: 0,
        spName: null,
        spParam: null,
        tableName: null,
        tableColumns: null,
        customName: null,
        fieldName: "",
        fieldSizeId: 0,
        fieldIconId: 0,
        placeholder: "",
        fieldOrderId: 0,
        storedProcedure: "",
        validation: [],
        eventHandler: 0,
        cUser: "",
      },
    ]);
    setIdCounter(idCounter + 1);
    // const newCol = {
    //   id: Date.now(),
    //   fieldSource: "",
    //   spName: "",
    //   spParameter: "",
    //   tableName: "",
    //   tableColumn: "",
    //   customName: "",
    //   customText: "",
    //   fieldName: "",
    //   validation: [],
    //   fieldIcon: "",
    //   placeholder: "",
    //   fieldOrder: "",
    //   storedProcedure: "",
    // };
    // const updated = [...tabs];
    // console.log(updated);
    // updated[activeTab].columns.push(newCol);
    // setTabs(updated);
  };
  const handleChange = async (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    if (field === "spName") {
      try {
        const res = await projectAPI.getLovDropdown("SP_PARAMS", value);
        const formattedParams = res.data.result.map((each) => ({
          id: each.Id,
          name: each.Name,
        }));
        setSpParamData((prev) => ({
          ...prev,
          [index]: formattedParams, // store params for that column only
        }));

        updatedColumns[index].spParam = ""; // reset old param
        updatedColumns[index].tableName = null;
        updatedColumns[index].tableCol = null;
        updatedColumns[index].customName = null;
      } catch (error) {
        console.error("Error fetching SP Params:", error);
        setSpParamData((prev) => ({ ...prev, [index]: [] }));
      }
    } else if (field === "tableName") {
      try {
        const res = await projectAPI.getLovDropdown("TABLE_COLS", value);
        const formattedParams = res.data.result.map((each) => ({
          id: each.Id,
          name: each.Name,
        }));
        setTableCol((prev) => ({
          ...prev,
          [index]: formattedParams, // store params for that column only
        }));

        updatedColumns[index].tableCol = null;
        updatedColumns[index].spName = null;
        updatedColumns[index].spParam = null;
        updatedColumns[index].customName = null; // reset old param
      } catch (error) {
        console.error("Error fetching Table Columns:", error);
        setTableCol((prev) => ({ ...prev, [index]: [] }));
      }
    }

    setColumns(updatedColumns);
  };

  const updateColumn = (index, updates) => {
    const updated = [...tabs];
    updated[activeTab].columns[index] = {
      ...updated[activeTab].columns[index],
      ...updates,
    };
    setTabs(updated);
  };
  const removeColumn = (index) => {
    setColumns((prevColumns) => prevColumns.filter((_, idx) => idx !== index));
  };
  // ✅ Move submitted column back to edit
  const backToEdit = (index) => {
    const updated = [...tabs];
    const col = updated[activeTab].submittedColumns[index];
    updated[activeTab].columns.push(col);
    updated[activeTab].submittedColumns.splice(index, 1);
    setTabs(updated);
  };

  // Tab dropdown click
  const handleTabClick = (e) => {
    setTabSubmitClicked(true);
    const tabId = parseInt(e.target.value);
    setActiveTabId(tabId);
    const selectedIndex = e.target.selectedIndex;
    const tabName = e.target.options[selectedIndex].text;
    setActiveTabName(tabName);
    // setColumnData({ ...columnData, tabId: e.target.value });
    if (!tabData.tabName.trim()) return;
    const newTab = {
      id: Date.now(),
      tabName: tabData.tabName,
      tabImageId: tabData.tabImageId,
      columns: [],
      submittedColumns: [],
    };

    // await projectAPI.insertLanguage();
    setTabs([...tabs, newTab]);
    setTabData({ tabName: "", tabImageId: "" });
    setShowTabForm(false);
    setTabSubmitClicked(false);
    setActiveTab(tabs.length);
  };
  const handleSubmitAddForm = async (e) => {
    e.preventDefault();
    const payload = columns.map((col) => ({
      ...col,
      validationIds:
        col.validationIds && col.validationIds.length > 0
          ? JSON.stringify(col.validationIds) // ✅ stringify ONLY this field
          : null,
    }));

    try {
      const res = await projectAPI.insertAddFormDet(payload);
      console.log(res.data);
      const { addedArray = [], failedArray = [] } = res.data;

      // 🌿 Success rows
      if (addedArray.length > 0) {
        const successIndexes = addedArray.map((item) => item.index);
        setSuccessHighlightedRows((prev) => [...prev, ...successIndexes]);
        pushToast(
          addedArray.map(
            (item) => item.message || "Column added successfully ✅"
          ),
          "success"
        );

        // remove success highlight after animation
        setTimeout(() => {
          setSuccessHighlightedRows((prev) =>
            prev.filter((i) => !successIndexes.includes(i))
          );
        }, 1000);
      }

      // ❌ Failed rows
      if (failedArray.length > 0) {
        const failedIndexes = failedArray.map((item) => item.index);
        setErrorHighlightedRows((prev) => [...prev, ...failedIndexes]);
        pushToast(
          failedArray.map(
            (item) => item.error || "Failed to save this field ❌"
          ),
          "danger"
        );

        // remove failure highlight after animation
        setTimeout(() => {
          setErrorHighlightedRows((prev) =>
            prev.filter((i) => !failedIndexes.includes(i))
          );
        }, 1500);
      }

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: for smooth scrolling
    });
    setShowToast(true);
  };
  return (
    <Container className="py-4">
      {!showTabForm && (
        <Button className="mb-5" variant="primary" onClick={handleAddTabClick}>
          + Add Tab
        </Button>
      )}

      {showTabForm && (
        <Card className="p-3 mb-4 shadow-sm mt-3">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Project Name</Form.Label>
                <Form.Select
                  value={tabData.projectId}
                  onChange={(e) =>
                    setTabData({ ...tabData, projectId: e.target.value })
                  }
                >
                  {projectData.map((eachProject) => (
                    <option value={eachProject.id} key={eachProject.id}>
                      {eachProject.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Page Name</Form.Label>
                <Form.Select
                  value={tabData.pageId}
                  onChange={(e) =>
                    setTabData({ ...tabData, pageId: e.target.value })
                  }
                >
                  {pageData.map((eachPage) => (
                    <option value={eachPage.id} key={eachPage.id}>
                      {eachPage.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Tab Name"
                  value={tabData.tabName}
                  onChange={(e) =>
                    setTabData({ ...tabData, tabName: e.target.value })
                  }
                />
                {tabSubmitClicked && !tabData.tabName.trim() && (
                  <div style={{ color: "red", fontSize: "0.85rem" }}>
                    * Tab Name is required
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tab Icon</Form.Label>
                <Form.Select
                  value={tabData.tabImageId}
                  onChange={(e) =>
                    setTabData({ ...tabData, tabImageId: e.target.value })
                  }
                >
                  {iconData.map((eachIcon) => (
                    <option value={eachIcon.id} key={eachIcon.id}>
                      {eachIcon.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Created User</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Created User"
                  value={tabData.createdUser}
                  onChange={(e) =>
                    setTabData({ ...tabData, createdUser: e.target.value })
                  }
                />
                {tabSubmitClicked && !tabData.createdUser.trim() && (
                  <div style={{ color: "red", fontSize: "0.85rem" }}>
                    * Created User is required
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              <Button variant="success" onClick={handleSubmitTab}>
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      )}
      <Row>
        {activeTabState ? null : (
          <h6 className="text-danger">*Tab Should Be Selected</h6>
        )}
      </Row>
      <Row>
        {/* Tabs List */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tab Name</Form.Label>
            <Form.Select
              value={activeTabId || 0}
              onChange={
                (e) => handleTabClick(e)
                // setTabData({ ...tabData, tabImageId: e.target.value })
              }
            >
              {tabs.map((eachTab) => (
                <option value={eachTab.id} key={eachTab.id}>
                  {eachTab.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* {tabs.slice(1, tabs.length).map((tab, i) => (
            <Card
              key={tab.id}
              className={`p-3 mb-3 shadow-sm ${
                activeTab === i ? "border-primary" : ""
              }`}
              onClick={() => setActiveTab(i)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className={`me-2 ${tab.icon}`}></i>
                  <strong>{tab.name}</strong>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTab(tab.id);
                  }}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))} */}
        </Col>

        {/* Active Tab Columns */}
        <Col md={9}>
          <Card className="p-3 mb-3 shadow-sm d-flex flex-column justify-content-between align-items-center">
            <Card className="container-fluid border-0 d-flex flex-row justify-content-between align-items-center">
              <h5 className="m-0">Columns</h5>
              <Button variant="success" size="sm" onClick={addColumn}>
                + Add Column
              </Button>
            </Card>
            <Card className="container-fluid mt-3 mb-3 border-0">
              <h5 className="text-secondary">Selected Tab: {activeTabName}</h5>
            </Card>

            {columns.length === 0 ? null : (
              <ColumnEditor
                columns={columns}
                onChange={handleChange}
                fieldType={fieldType}
                fieldSource={fieldSource}
                fieldSize={fieldSize}
                fieldOrder={fieldOrder}
                fieldIcon={fieldIcon}
                jsVal={jsVal}
                spParamData={spParamData}
                tableCol={tableCol}
                updateColumn={updateColumn}
                removeColumn={removeColumn}
                successHighlightedRows={successHighlightedRows}
                errorHighlightedRows={errorHighlightedRows}
                lists={{
                  spList,
                  tableList,
                  storedProcedures,
                  eventHandler,
                }}
              />
            )}
            <Button
              variant="primary"
              size="md"
              className="container-fluid mt-3"
              onClick={(e) => handleSubmitAddForm(e)}
            >
              Submit
            </Button>
          </Card>
        </Col>
      </Row>
      <Toaster
        toastData={toastQueue}
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </Container>
  );
}
