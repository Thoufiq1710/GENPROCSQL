import React from "react";
import { Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

/**
 * A reusable full-screen or inline loading spinner component.
 * Uses Bootstrap for styling and supports props for easy customization.
 */
const LoadingIndicator = ({
  message = "Please wait, loading data...",
  variant = "primary",
  fullScreen = true,
  overlay = true,
}) => {
  return (
    <div
      style={{
        position: overlay ? "fixed" : "relative",
        top: overlay ? 0 : "auto",
        left: overlay ? 0 : "auto",
        width: overlay ? "100%" : "auto",
        height: fullScreen ? "100vh" : "200px",
        background: overlay ? "rgba(255, 255, 255, 0.85)" : "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: overlay ? 9999 : "auto",
        backdropFilter: overlay ? "blur(2px)" : "none",
      }}
    >
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        style={{ width: "4rem", height: "4rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>

      <h5 className={`mt-3 text-${variant} fw-bold`}>{message}</h5>
    </div>
  );
};

LoadingIndicator.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.string,
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
};

export default LoadingIndicator;
