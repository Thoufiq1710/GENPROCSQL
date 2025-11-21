import React, { useState, useEffect } from "react";
import ColumnEditor from "../ColumnEditor/ColumnEditor";

const SectionEditor = React.memo(
  ({
    section,
    path,
    updateConfig,
    addColumn,
    removeColumn,
    removeSection,
    ...props
  }) => {
    const [tabIndex, sectionIndex] = path;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [sectionName, setSectionName] = useState(section.sectionType);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      setSectionName(section.sectionType);
    }, [section.sectionType]);

    const handleSectionNameChange = (e) => {
      const newName = e.target.value;
      setSectionName(newName);
      updateConfig((config) => {
        const newTabs = [...config.tabs];
        newTabs[tabIndex].sections[sectionIndex].sectionType = newName;
        return { ...config, tabs: newTabs };
      });
    };

    const handleAddColumn = () => {
      console.log("Adding column to tab:", tabIndex, "section:", sectionIndex);
      addColumn(tabIndex, sectionIndex);
    };

    const handleRemoveSection = () => {
      console.log("Removing section:", tabIndex, sectionIndex);
      removeSection(tabIndex, sectionIndex);
    };

    const generateColumnKey = (column, columnIndex) => {
      return `column-${tabIndex}-${sectionIndex}-${columnIndex}-${
        column.column_id ||
        `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }`;
    };

    return (
      <div className="card mb-4 border-primary shadow-sm">
        <div
          className="card-header text-white d-flex justify-content-between align-items-center p-3"
          style={{ backgroundColor: "#070C37" }}
        >
          <div className="d-flex align-items-center w-50">
            <button
              className="btn btn-sm btn-light me-2"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Expand section" : "Collapse section"}
              title={isCollapsed ? "Expand section" : "Collapse section"}
            >
              <i
                className={`fa ${
                  isCollapsed ? "fa-chevron-down" : "fa-chevron-up"
                }`}
                aria-hidden="true"
              ></i>
            </button>
            <i className="fa fa-layer-group me-2" aria-hidden="true"></i>
            <input
              type="text"
              value={sectionName}
              onChange={handleSectionNameChange}
              className="form-control form-control-sm me-3 fw-bold"
              placeholder="Section Name"
              id={`section-name-${tabIndex}-${sectionIndex}`}
              name={`section-name-${tabIndex}-${sectionIndex}`}
              aria-label="Section name"
              style={{
                color: "white",
                fontWeight: "bold",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
                e.target.style.border = "1px solid rgba(255,255,255,0.5)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.border = "1px solid rgba(255,255,255,0.3)";
              }}
            />
          </div>
          <div>
            <button
              onClick={handleAddColumn}
              className="btn btn-sm btn-light me-2"
              aria-label="Add field to section"
              title="Add field to section"
            >
              <i className="fa fa-plus me-1" aria-hidden="true"></i> Add Field
            </button>
            <button
              onClick={handleRemoveSection}
              className="btn btn-sm btn-outline-light"
              style={{
                transition: "all 0.3s ease",
                backgroundColor: isHovered ? "#dc3545" : "transparent",
                borderColor: isHovered ? "#dc3545" : "#fff",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label="Remove section"
              title="Remove section"
            >
              <i className="fa fa-trash-alt" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
          <div className="card-body bg-light">
            {section.fields &&
              section.fields.map((column, columnIndex) => (
                <ColumnEditor
                  key={generateColumnKey(column, columnIndex)}
                  column={column}
                  path={[tabIndex, sectionIndex, columnIndex]}
                  updateConfig={updateConfig}
                  removeColumn={removeColumn}
                  {...props}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
);

export default SectionEditor;
