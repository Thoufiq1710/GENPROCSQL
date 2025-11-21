import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ViewSnippetTable = ({ rows }) => {
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  console.log(selectedSnippet);
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Snippet</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.snippetId}>
              <td>{item.snippetName}</td>
              <td>{item.status}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setSelectedSnippet(item)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup modal */}
      <Modal
        show={!!selectedSnippet}
        onHide={() => setSelectedSnippet(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSnippet?.snippetName} Snippet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre className="bg-light p-3 rounded text-dark overflow-auto">
            <code>{selectedSnippet?.snippetCode}</code>
          </pre>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewSnippetTable;
