import React from "react";
import { ToastContainer, Toast } from "react-bootstrap";

function Toaster({ toastData, setToastData }) {
  const handleClose = (index) => {
    // Remove closed toast from array
    setToastData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ToastContainer position="top-end" className="p-3">
      {toastData.map((toast, index) => (
        <Toast
          key={index}
          show={true}
          onClose={() => handleClose(index)}
          bg={toast.variant}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-white">{toast.text}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default Toaster;
