import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./LeftTabMenu.css";

function LeftTabMenu() {
  const location = useLocation();

  const menuItems = [
    { path: "/language", icon: "🌐", label: "Language" },
    { path: "/project", icon: "📁", label: "Project" },
    { path: "/module", icon: "🧩", label: "Module" },
    { path: "/dbconnect", icon: "🗄️", label: "Db Connection" },
    { path: "/lov", icon: "📋", label: "List of Values" },
    { path: "/lov-det", icon: "🔍", label: "List of Values Details" },
    { path: "/err-msg", icon: "❗", label: "Error Messages" },
    { path: "/product", icon: "📦", label: "Product" },
    { path: "/gen-page", icon: "⚙️", label: "Gen Page" },
  ];

  return (
    <aside className="left-tab-menu">
      {/* Header */}
      <div className="menu-header">
        <div className="menu-title">⚡ CodeGen Pro</div>
      </div>

      {/* Menu List */}
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default LeftTabMenu;
