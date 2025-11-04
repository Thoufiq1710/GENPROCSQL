import React from "react";
import PropTypes from "prop-types";
import { Nav } from "react-bootstrap";
import "./TabMenu.css";

/**
 * Dynamic Tab Menu Component
 * @param {Array} tabs - Array of tab objects [{key, label, onClick, active}]
 * @param {string} variant - Bootstrap tab style (e.g. "tabs" or "pills")
 * @param {string} defaultActiveKey - Default active tab key
 */
const TabMenu = ({ tabs, variant, defaultActiveKey }) => {
  return (
    <Nav
      variant={variant}
      defaultActiveKey={defaultActiveKey}
      className="custom-tab-menu"
    >
      {tabs.map((tab) => (
        <Nav.Item key={tab.key}>
          <Nav.Link
            eventKey={tab.key}
            active={tab.active}
            onClick={() => tab.onClick?.(tab.key)}
          >
            {tab.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

TabMenu.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      active: PropTypes.bool,
    })
  ).isRequired,
  variant: PropTypes.oneOf(["tabs", "pills"]),
  defaultActiveKey: PropTypes.string,
};

TabMenu.defaultProps = {
  variant: "tabs",
  defaultActiveKey: "",
};

export default TabMenu;
