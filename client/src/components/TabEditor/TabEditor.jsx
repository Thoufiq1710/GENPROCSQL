import React, { useState, useEffect } from "react";
import SectionEditor from "../SectionEditor/SectionEditor";
import {
  updateConfig,
  updateField,
  removeTab,
} from "../../context/FormBuilderContext/formAction";

const TabEditor = React.memo(
  ({
    tab,
    tabIndex,
    dispatch,
    addSection,
    removeSection,
    addColumn,
    removeColumn,
    ...props
  }) => {
    const [tabName, setTabName] = useState(tab.tabName);
    const [tabIcon, setTabIcon] = useState(tab.tabIcon);

    // Sync with prop changes
    useEffect(() => {
      setTabName(tab.tabName);
      setTabIcon(tab.tabIcon);
    }, [tab.tabName, tab.tabIcon]);

    const handleTabNameChange = (value) => {
      setTabName(value);
      dispatch(
        updateConfig((config) => {
          const newTabs = [...config.tabs];
          newTabs[tabIndex].tabName = value;
          return { ...config, tabs: newTabs };
        })
      );
    };

    const handleTabIconChange = (value) => {
      setTabIcon(value);
      dispatch(
        updateConfig((config) => {
          const newTabs = [...config.tabs];
          newTabs[tabIndex].tabIcon = value;
          return { ...config, tabs: newTabs };
        })
      );
    };

    const tabColorClass =
      tabIndex % 2 === 0 ? "border-primary" : "border-success";

    return (
      <div className={`card shadow-lg mb-4 ${tabColorClass}`}>
        <div
          className="card-header text-white p-3 d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: "#070C37",
            background:
              tabIndex % 2 === 0
                ? "linear-gradient(135deg, #070C37, #070C37)"
                : "linear-gradient(135deg, #070C37, #070C37)",
          }}
        >
          <h4 className="mb-0">
            <i className={`fa ${tabIcon} me-3`}></i> Tab #{tabIndex + 1}:{" "}
            {tabName}
          </h4>
          <button
            onClick={() => dispatch(removeTab(tabIndex))}
            className="btn btn-sm btn-light text-danger shadow-sm"
          >
            <i className="fa fa-trash-alt me-1"></i> Remove Tab
          </button>
        </div>

        <div className="card-body">
          <div className="row mb-4 g-3 p-3 border rounded bg-white shadow-sm">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tab Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={tabName}
                onChange={(e) => handleTabNameChange(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tab Icon <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={tabIcon || ""}
                onChange={(e) => handleTabIconChange(e.target.value)}
                required
              >
                {props.iconData &&
                  props.iconData.map((iconName) => (
                    <option key={iconName.id} value={iconName.id}>
                      {iconName.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {tab && (
            <>
              {tab.sections.map((section, sectionIndex) => (
                <SectionEditor
                  key={section.sectionIndex}
                  section={section}
                  path={[tabIndex, sectionIndex]}
                  dispatch={dispatch}
                  updateConfig={updateConfig}
                  updateField={updateField}
                  addColumn={addColumn}
                  removeColumn={removeColumn}
                  removeSection={removeSection}
                  {...props}
                />
              ))}
            </>
          )}

          <button
            onClick={() => dispatch(addSection(tabIndex))}
            className="btn shadow-sm text-white"
            style={{ backgroundColor: "#070C37" }}
          >
            <i className="fa fa-plus me-2"></i> Add Section
          </button>
        </div>
      </div>
    );
  }
);

export default TabEditor;
