import React, { useState } from "react";
import EventHandlerModal from "../EventHandlerModal/EventHandlerModal";
import { updateField } from "../../context/FormBuilderContext/formAction";

const ColumnEditor = ({
  column,
  path,
  dispatch,
  removeColumn,
  eventHandler,
  fieldTypeData,
  fieldSource,
  fieldType,
  fieldOrder,
  fieldIcon,
  jsVal,
  spList,
  tableList,
  storedProcedures,
  spParamData,
  tableCol,
  showToast,
  fetchSpParams,
  fetchTableColumns,
}) => {
  const [tabIndex, sectionIndex, columnIndex] = path;
  const [showEventModal, setShowEventModal] = useState(false);
  // REMOVED local state - use the column prop directly
  const handleFieldChange = (key, value) => {
    console.log(
      `🔄 Field Change: [${tabIndex},${sectionIndex},${columnIndex}]`,
      { key, value }
    );

    dispatch(updateField(path, key, value));

    // 🚀 Trigger SP Params fetch when SP changes
    if (key === "spName" && value && fetchSpParams) {
      fetchSpParams(value, columnIndex);
    }

    // 🚀 Trigger Table Columns fetch when table changes
    if (key === "tableName" && value && fetchTableColumns) {
      fetchTableColumns(value, columnIndex);
    }
  };

  const addValidation = (path, validationId) => {
    dispatch(
      updateField(path, "validations", [
        ...(column.validations || []),
        validationId,
      ])
    );
  };

  const removeValidation = (path, index) => {
    dispatch(
      updateField(
        path,
        "validations",
        column.validations.filter((_, i) => i !== index)
      )
    );
  };

  // const handleAddEventHandler = (eventObj) => {
  //   dispatch(
  //     updateField(path, "eventHandlers", [
  //       ...(column.eventHandlers || []),
  //       eventObj,
  //     ])
  //   );
  // };

  // const handleRemoveEventHandler = (eventId) => {
  //   dispatch(
  //     updateField(
  //       path,
  //       "eventHandlers",
  //       (column.eventHandlers || []).filter((e) => e.id !== eventId)
  //     )
  //   );
  // };

  const handleAddEventHandlers = (events) => {
    dispatch(updateField(path, "eventHandlers", events)); // store events
    dispatch(updateField(path, "hasEvents", true)); // mark field as having events
  };

  const handleRemoveEventHandler = (id) => {
    dispatch(
      updateConfig((config) => {
        const updated = { ...config };
        const field = updated.tabs[path[0]].sections[path[1]].fields[path[2]];
        field.eventHandlers = field.eventHandlers.filter((e) => e.id !== id);
        field.hasEvents = field.eventHandlers.length > 0;
        return updated;
      })
    );
  };

  const handleClearAllEventHandlers = () => {
    dispatch(updateField(path, "eventHandlers", []));
    dispatch(updateField(path, "hasEvents", false));
  };

  return (
    <div className="bg-white p-4 border rounded mb-3 position-relative shadow-sm">
      <h6
        className="mb-3 border-bottom pb-2 d-flex align-items-center"
        style={{ color: "#070C37" }}
      >
        <i className={`fa ${column.fieldIconLovDetId} me-2`}></i>
        Field: {column.labelName || `Column ${columnIndex + 1}`}
      </h6>

      <button
        onClick={() =>
          dispatch(removeColumn(tabIndex, sectionIndex, columnIndex))
        }
        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle"
        title="Remove Column/Field"
      >
        <i className="fa fa-times"></i>
      </button>

      <div className="col-md-4">
        <label className="form-label fw-semibold">
          Field Type <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          value={column.fieldType || ""}
          onChange={(e) => handleFieldChange("fieldType", e.target.value)}
          required
        >
          {fieldTypeData &&
            fieldTypeData.map((eachItem) => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.name}
              </option>
            ))}
        </select>
      </div>

      {/* Row 1 - Required Fields */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">
            Field Source <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={column.fieldSourceLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldSourceLovDetId", e.target.value)
            }
            required
          >
            {fieldSource &&
              fieldSource.map((eachItem) => (
                <option key={eachItem.id} value={eachItem.id}>
                  {eachItem.name}
                </option>
              ))}
          </select>
        </div>

        {/* Field Source Specific Fields */}
        <div className="col-md-4">
          {column.fieldSourceLovDetId === "1" && (
            <>
              <label className="form-label fw-semibold">Stored Procedure</label>
              <select
                className="form-select"
                value={column.spName || ""}
                onChange={(e) => handleFieldChange("spName", e.target.value)}
              >
                {spList?.map((sp) => (
                  <option key={sp.id} value={sp.name}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {column.fieldSourceLovDetId === "2" && (
            <>
              <label className="form-label fw-semibold">Table Name</label>
              <select
                className="form-select"
                value={column.tableName || ""}
                onChange={(e) => handleFieldChange("tableName", e.target.value)}
              >
                {tableList?.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="col-md-4">
          {column.fieldSourceLovDetId === "1" && column.spName && (
            <>
              <label className="form-label fw-semibold">SP Param</label>
              <select
                className="form-select"
                value={column.spParam || ""}
                onChange={(e) => handleFieldChange("spParam", e.target.value)}
              >
                {(spParamData || []).map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {column.fieldSourceLovDetId === "2" && column.tableName && (
            <>
              <label className="form-label fw-semibold">Table Columns</label>
              <select
                className="form-select"
                value={column.tableColumns || ""}
                onChange={(e) =>
                  handleFieldChange("tableColumns", e.target.value)
                }
              >
                {(tableCol || []).map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Row 2 - Field Details */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Field Name</label>
          <input
            type="text"
            className="form-control"
            value={column.labelName || ""}
            onChange={(e) => handleFieldChange("labelName", e.target.value)}
            placeholder="Enter field name"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Placeholder</label>
          <input
            type="text"
            className="form-control"
            value={column.placeHolder || ""}
            onChange={(e) => handleFieldChange("placeHolder", e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">
            Field Order <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={column.fieldOrderLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldOrderLovDetId", e.target.value)
            }
            required
          >
            {fieldOrder &&
              fieldOrder.map((eachOrder) => (
                <option key={eachOrder.id} value={eachOrder.id}>
                  {eachOrder.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Field Icon */}
      <div className="row g-3 mb-2">
        <div className="col-md-4">
          <label className="form-label fw-semibold">Field Icon</label>
          <select
            className="form-select"
            value={column.fieldIconLovDetId || ""}
            onChange={(e) =>
              handleFieldChange("fieldIconLovDetId", e.target.value)
            }
          >
            {fieldIcon &&
              fieldIcon.map((eachIcon) => (
                <option key={eachIcon.id} value={eachIcon.id}>
                  {eachIcon.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Validations and Event Handlers */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Validations</label>
          <select
            className="form-select"
            value=""
            onChange={(e) => addValidation(path, Number(e.target.value))}
          >
            {jsVal?.map((eachJs) => (
              <option key={eachJs.id} value={eachJs.id}>
                {eachJs.name}
              </option>
            ))}
          </select>

          <div className="mt-2">
            {(column.validations || []).map((vId, index) => {
              const validationObj = jsVal?.find((i) => i.id === vId);
              const validationName = validationObj
                ? validationObj.name
                : `ID:${vId}`;
              return (
                <span
                  key={vId}
                  className="badge me-1 mb-1 text-white"
                  style={{
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    backgroundColor: "#070C37",
                  }}
                  onClick={() => removeValidation(path, index)}
                >
                  {validationName} <i className="fa fa-times ms-1"></i>
                </span>
              );
            })}
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex align-items-center mb-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={column.hasEvents || false}
                onChange={(e) =>
                  handleFieldChange("hasEvents", e.target.checked)
                }
                id={`event-checkbox-${column.column_id}`}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor={`event-checkbox-${column.column_id}`}
              >
                Event Handlers
              </label>
            </div>
            {(column.hasEvents || column.eventHandlers?.length > 0) && (
              <button
                className="btn btn-sm btn-outline-primary ms-2"
                style={{ borderColor: "#070C37", color: "#070C37" }}
                onClick={() => setShowEventModal(true)}
              >
                <i className="fa fa-cog me-1"></i> Manage Events
              </button>
            )}
          </div>

          {/* Event Handler Badges */}
          <div className="mt-1">
            {(column.eventHandlers || []).map((event) => (
              <span
                key={event.id}
                className="badge me-1 mb-1 text-white"
                style={{
                  fontSize: "0.75rem",
                  backgroundColor: "#070C37",
                }}
              >
                {event.eventName}: {event.functionName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Saving SP</label>
          <select
            className="form-select"
            value={column.storingSP || ""}
            onChange={(e) => handleFieldChange("storingSP", e.target.value)}
          >
            {storedProcedures &&
              storedProcedures.map((sp) => (
                <option key={sp.id} value={sp.name}>
                  {sp.name}
                </option>
              ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Created User</label>
          <input
            type="text"
            className="form-control"
            value={column.created_user || ""}
            onChange={(e) => handleFieldChange("created_user", e.target.value)}
            placeholder="Enter user name"
          />
        </div>
      </div>

      {/* Event Handler Modal */}
      <EventHandlerModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        eventHandlers={column.eventHandlers || []}
        onAddEventHandlers={handleAddEventHandlers}
        onRemoveEventHandler={handleRemoveEventHandler}
        eventHandler={eventHandler}
        path={[tabIndex, sectionIndex, columnIndex]}
      />
    </div>
  );
};

export default ColumnEditor;
