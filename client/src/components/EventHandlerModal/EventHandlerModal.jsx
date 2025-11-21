import React, { useState, useEffect, useRef } from "react";

const EventHandlerModal = ({
  show,
  onClose,
  eventHandlers,
  onAddEventHandlers,
  onRemoveEventHandler,
  onClearAllEventHandlers,
  eventHandler,
}) => {
  const [eventRows, setEventRows] = useState([
    { eventId: "", functionName: "", functionNameError: "" },
  ]);
  const [globalError, setGlobalError] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current) {
      document.body.style.overflow = "hidden";
      modalRef.current.focus();
    } else {
      document.body.style.overflow = "unset";
      setGlobalError(""); // Clear global error when modal closes
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  const validateCamelCase = (text) => {
    if (!text) return true;
    const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
    return camelCaseRegex.test(text);
  };

  const handleAddRow = () => {
    setEventRows([
      ...eventRows,
      { eventId: "", functionName: "", functionNameError: "" },
    ]);
    setGlobalError(""); // Clear global error when adding new row
  };

  const handleRemoveRow = (index) => {
    if (eventRows.length > 1) {
      const updatedRows = eventRows.filter((_, i) => i !== index);
      setEventRows(updatedRows);
    }
    setGlobalError(""); // Clear global error when removing row
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...eventRows];
    updatedRows[index][field] = value;

    // Clear individual and global errors when user types
    if (field === "functionName") {
      updatedRows[index].functionNameError = "";
      setGlobalError("");

      // Validate function name for camelCase only when there's input
      if (value && !validateCamelCase(value)) {
        updatedRows[index].functionNameError = "Must be camelCase";
      }
    }

    setEventRows(updatedRows);
  };

  const handleSubmit = () => {
    // Clear previous global error
    setGlobalError("");

    // Check if any row has invalid function name
    const invalidRows = eventRows.filter((row) => row.functionNameError);
    if (invalidRows.length > 0) {
      setGlobalError("Please fix all function name errors before submitting.");
      return;
    }

    // Check if we have any valid events to submit
    const validEvents = eventRows.filter(
      (row) => row.eventId && row.functionName.trim() && !row.functionNameError
    );

    if (validEvents.length === 0) {
      setGlobalError(
        "Please add at least one valid event handler with both event and function name selected."
      );
      return;
    }

    const formattedEvents = validEvents.map((row, index) => {
      const eventObj = eventHandler.find((e) => e.id === row.eventId);
      return {
        id: `event-${Date.now()}-${index}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        eventId: row.eventId,
        eventName: eventObj ? eventObj.name : row.eventId,
        functionName: row.functionName.trim(),
        sectionName: `Event ${index + 1}`,
      };
    });

    if (formattedEvents.length > 0) {
      onAddEventHandlers(formattedEvents, eventRows);
      setEventRows([{ eventId: "", functionName: "", functionNameError: "" }]);
      setGlobalError("");
      onClose();
    }
  };

  const handleClearAll = () => {
    onClearAllEventHandlers();
    setEventRows([{ eventId: "", functionName: "", functionNameError: "" }]);
    setGlobalError("");
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const isFormValid = eventRows.some(
    (row) => row.eventId && row.functionName.trim() && !row.functionNameError
  );

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      className="modal show d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        overflowY: "auto",
        padding: "20px 0",
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="event-handler-modal-title"
    >
      <div
        className="modal-dialog modal-lg"
        style={{ margin: "auto", maxWidth: "95%" }}
      >
        <div
          className="modal-content"
          style={{ maxHeight: "90vh", overflow: "hidden" }}
        >
          <div
            className="modal-header text-white sticky-top"
            style={{ backgroundColor: "#070C37" }}
          >
            <h5 className="modal-title" id="event-handler-modal-title">
              Manage Event Handlers
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div
            className="modal-body"
            style={{ overflowY: "auto", maxHeight: "calc(90vh - 120px)" }}
          >
            {/* Global Error Message */}
            {globalError && (
              <div
                className="alert alert-danger alert-dismissible fade show mb-3"
                role="alert"
              >
                <i className="fa fa-exclamation-triangle me-2"></i>
                {globalError}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setGlobalError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Add Multiple Event Handlers */}
            <div className="mb-4 p-3 border rounded bg-light">
              <h6 className="mb-3">
                <i className="fa fa-plus-circle me-2 text-primary"></i>
                Add New Event Handlers
              </h6>

              {eventRows.map((row, index) => (
                <div key={index} className="row g-3 mb-3 align-items-start">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold">
                      Event Handler <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={row.eventId}
                      onChange={(e) =>
                        handleRowChange(index, "eventId", e.target.value)
                      }
                    >
                      <option value="">Select Event</option>
                      {eventHandler &&
                        eventHandler.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label fw-semibold">
                      Function Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        row.functionNameError ? "is-invalid" : ""
                      }`}
                      placeholder="handleClick, validateInput, etc."
                      value={row.functionName}
                      onChange={(e) =>
                        handleRowChange(index, "functionName", e.target.value)
                      }
                    />
                    {row.functionNameError && (
                      <div className="invalid-feedback d-block">
                        <small>
                          <i className="fa fa-exclamation-circle me-1"></i>
                          {row.functionNameError}
                        </small>
                      </div>
                    )}
                    <small className="form-text text-muted">
                      camelCase only: start with lowercase letter, no
                      spaces/special chars
                    </small>
                  </div>
                  <div className="col-md-2 d-flex align-items-end">
                    {eventRows.length > 1 && (
                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() => handleRemoveRow(index)}
                        style={{ height: "38px" }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleAddRow}
                >
                  <i className="fa fa-plus me-1"></i> Add Row
                </button>
                <div className="ms-auto d-flex gap-2 align-items-center">
                  <span className="text-muted small">
                    {
                      eventRows.filter(
                        (row) =>
                          row.eventId &&
                          row.functionName.trim() &&
                          !row.functionNameError
                      ).length
                    }{" "}
                    valid event(s)
                  </span>
                  <button
                    className="btn text-white"
                    style={{ backgroundColor: "#070C37" }}
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                  >
                    <i className="fa fa-check me-1"></i> Submit Events
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Event Handlers List */}
            <div className="border rounded">
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                <h6 className="mb-0">
                  <i className="fa fa-list me-2 text-primary"></i>
                  Current Event Handlers ({eventHandlers.length})
                </h6>
                {eventHandlers.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleClearAll}
                  >
                    <i className="fa fa-trash me-1"></i> Clear All
                  </button>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" width="30%">
                        Event Handler
                      </th>
                      <th scope="col" width="40%">
                        Function Name
                      </th>
                      <th scope="col" width="20%">
                        Section
                      </th>
                      <th scope="col" width="10%">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventHandlers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-4">
                          <i className="fa fa-inbox fa-2x mb-2 d-block"></i>
                          No event handlers added yet
                        </td>
                      </tr>
                    ) : (
                      eventHandlers.map((event) => (
                        <tr key={event.id}>
                          <td className="fw-semibold">
                            <i className="fa fa-bolt me-2 text-warning"></i>
                            {event.eventName}
                          </td>
                          <td>
                            <code className="text-primary bg-light px-2 py-1 rounded">
                              {event.functionName}
                            </code>
                          </td>
                          <td>
                            <span
                              className="badge text-white px-2 py-1"
                              style={{ backgroundColor: "#070C37" }}
                            >
                              {event.sectionName}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onRemoveEventHandler(event.id)}
                              title="Remove this event handler"
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className="fa fa-times me-1"></i> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHandlerModal;
