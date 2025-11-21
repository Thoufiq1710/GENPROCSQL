import React from "react";
import { Card } from "react-bootstrap";

export default function TabHeader({ tab, index, activeTab, setActiveTab }) {
  return (
    <Card
      className={`p-2 mb-2 ${index === activeTab ? "bg-primary text-white" : ""}`}
      onClick={() => setActiveTab(index)}
      style={{ cursor: "pointer" }}
    >
      <strong>{tab.name}</strong>
      <div className="small">{tab.icon}</div>
    </Card>
  );
}
