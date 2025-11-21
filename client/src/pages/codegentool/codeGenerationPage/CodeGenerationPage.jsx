import React, { useState, useEffect } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAlert,
  CSpinner,
  CBadge,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import projectAPI from "../../api/Api";
import LeftTabMenu from "../../components/LeftTabMenu/LeftTabMenu";
import "./CodeGenerationPage.css";

const CodeGenerationPage = ({ codeData }) => {
  const navigate = useNavigate();
  // const location = useLocation();

  // const demoGeneratedCode = location?.generatedCode;
  // console.log(demoGeneratedCode);
  console.log(codeData);

  const [formData, setFormData] = useState({});
  const [generatedCode, setGeneratedCode] = useState({
    repository: "",
    controller: "",
    route: "",
    model: "",
  });

  const [activeCodeTab, setActiveCodeTab] = useState("repository");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
      generateAllCode(location.state.formData);
    }
  }, [location]);

  const generateAllCode = async (formDataFromProps = null) => {
    const dataToUse = formDataFromProps || formData;

    if (!dataToUse.pageName) {
      setError(
        "No form configuration found. Please go back and save your form first."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Mock data - replace with actual DB fetch later
      const mockGeneratedCode = {
        repository: generateRepositoryCode(dataToUse),
        controller: generateControllerCode(dataToUse),
        route: generateRouteCode(dataToUse),
        model: generateModelCode(dataToUse),
      };

      setGeneratedCode(mockGeneratedCode);
      setActiveCodeTab("repository");
      setSuccess("Code generated successfully from form configuration!");
    } catch (error) {
      console.error("Error generating code:", error);
      setError("Failed to generate code from configuration");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to generate code based on form data
  const generateRepositoryCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Repository.js
const pool = require('../config/database');

class ${entityName}Repository {
  static async findAll() {
    const query = 'SELECT * FROM ${formData.pageName.toLowerCase()}';
    const [rows] = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM ${formData.pageName.toLowerCase()} WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(data) {
    const query = 'INSERT INTO ${formData.pageName.toLowerCase()} SET ?';
    const [result] = await pool.query(query, data);
    return result.insertId;
  }

  static async update(id, data) {
    const query = 'UPDATE ${formData.pageName.toLowerCase()} SET ? WHERE id = ?';
    const [result] = await pool.query(query, [data, id]);
    return result.affectedRows;
  }

  static async delete(id) {
    const query = 'DELETE FROM ${formData.pageName.toLowerCase()} WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows;
  }
}

module.exports = ${entityName}Repository;`;
  };

  const generateControllerCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Controller.js
const ${entityName}Service = require('../services/${entityName}Service');

class ${entityName}Controller {
  static async getAll(req, res) {
    try {
      const data = await ${entityName}Service.getAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await ${entityName}Service.getById(id);
      if (!data) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error fetching ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async create(req, res) {
    try {
      const newItem = await ${entityName}Service.create(req.body);
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error creating ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await ${entityName}Service.update(id, req.body);
      if (!updated) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, message: '${
        formData.pageName
      } updated successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error updating ${formData.pageName.toLowerCase()}' 
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ${entityName}Service.delete(id);
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: '${formData.pageName} not found' 
        });
      }
      res.json({ success: true, message: '${
        formData.pageName
      } deleted successfully' });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Error deleting ${formData.pageName.toLowerCase()}' 
      });
    }
  }
}

module.exports = ${entityName}Controller;`;
  };

  const generateRouteCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Routes.js
const express = require('express');
const router = express.Router();
const ${entityName}Controller = require('../controllers/${entityName}Controller');

// @route   GET /api/${formData.pageName.toLowerCase()}
// @desc    Get all ${formData.pageName.toLowerCase()}
// @access  Public
router.get('/', ${entityName}Controller.getAll);

// @route   GET /api/${formData.pageName.toLowerCase()}/:id
// @desc    Get ${formData.pageName.toLowerCase()} by ID
// @access  Public
router.get('/:id', ${entityName}Controller.getById);

// @route   POST /api/${formData.pageName.toLowerCase()}
// @desc    Create new ${formData.pageName.toLowerCase()}
// @access  Public
router.post('/', ${entityName}Controller.create);

// @route   PUT /api/${formData.pageName.toLowerCase()}/:id
// @desc    Update ${formData.pageName.toLowerCase()}
// @access  Public
router.put('/:id', ${entityName}Controller.update);

// @route   DELETE /api/${formData.pageName.toLowerCase()}/:id
// @desc    Delete ${formData.pageName.toLowerCase()}
// @access  Public
router.delete('/:id', ${entityName}Controller.delete);

module.exports = router;`;
  };

  const generateModelCode = (formData) => {
    const entityName = formData.pageName.replace(/\s+/g, "");
    return `// ${entityName}Model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${entityName} = sequelize.define('${entityName}', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: '${formData.pageName.toLowerCase()}',
  timestamps: false,
  underscored: true
});

module.exports = ${entityName};`;
  };

  const copyToClipboard = () => {
    const codeToCopy = generatedCode[activeCodeTab];
    navigator.clipboard.writeText(codeToCopy).then(() => {
      const originalSuccess = success;
      setSuccess("Code copied to clipboard!");
      setTimeout(() => setSuccess(originalSuccess), 2000);
    });
  };

  const downloadCode = () => {
    if (!generatedCode[activeCodeTab]) return;

    const element = document.createElement("a");
    const file = new Blob([generatedCode[activeCodeTab]], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.pageName}${
      activeCodeTab.charAt(0).toUpperCase() + activeCodeTab.slice(1)
    }.js`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContinue = () => {
    navigate("/dynamic-form", {
      state: {
        formData,
        generatedCode: true,
      },
    });
  };

  return (
    <div className="code-generation-page-container">
      {/* Sidebar */}
      <div className="sidebar-section">
        <LeftTabMenu />
      </div>

      {/* Main Content */}
      <div className="main-content-section">
        <CContainer fluid className="code-generation-page">
          <CRow>
            <CCol>
              <div className="page-header">
                <h2>Code Generation</h2>
                <div className="language-display">
                  <CBadge color="primary">
                    Form: {formData.pageName || "No form selected"}
                  </CBadge>
                </div>
              </div>

              {error && (
                <CAlert color="danger" dismissible onClose={() => setError("")}>
                  {error}
                </CAlert>
              )}

              {success && (
                <CAlert
                  color="success"
                  dismissible
                  onClose={() => setSuccess("")}
                >
                  {success}
                </CAlert>
              )}

              <CRow>
                {/* Code Type Selection Panel */}
                <CCol md={3}>
                  <CCard className="code-type-card">
                    <CCardHeader>
                      <h6 className="mb-0">Generated Files</h6>
                    </CCardHeader>
                    <CCardBody className="code-type-buttons">
                      <CButton
                        color={
                          activeCodeTab === "repository"
                            ? "primary"
                            : "secondary"
                        }
                        className="w-100 mb-2"
                        onClick={() => setActiveCodeTab("repository")}
                      >
                        <i className="fa fa-database me-2"></i>Repository
                      </CButton>
                      <CButton
                        color={
                          activeCodeTab === "controller"
                            ? "primary"
                            : "secondary"
                        }
                        className="w-100 mb-2"
                        onClick={() => setActiveCodeTab("controller")}
                      >
                        <i className="fa fa-cogs me-2"></i>Controller
                      </CButton>
                      <CButton
                        color={
                          activeCodeTab === "route" ? "primary" : "secondary"
                        }
                        className="w-100 mb-2"
                        onClick={() => setActiveCodeTab("route")}
                      >
                        <i className="fa fa-route me-2"></i>Routes
                      </CButton>
                      <CButton
                        color={
                          activeCodeTab === "model" ? "primary" : "secondary"
                        }
                        className="w-100 mb-2"
                        onClick={() => setActiveCodeTab("model")}
                      >
                        <i className="fa fa-table me-2"></i>Model
                      </CButton>
                    </CCardBody>
                  </CCard>
                </CCol>

                {/* Code Display Panel */}
                <CCol md={9}>
                  {generatedCode.repository ? (
                    <CCard className="code-display-card">
                      <CCardHeader className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0 text-capitalize">
                          {activeCodeTab} Code
                        </h5>
                        <CButton
                          color="outline-primary"
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          Copy Code
                        </CButton>
                      </CCardHeader>
                      <CCardBody>
                        <pre className="generated-code">
                          {generatedCode[activeCodeTab]}
                        </pre>

                        {/* Action Buttons */}
                        <div className="code-actions mt-3">
                          <CButton
                            color="success"
                            onClick={downloadCode}
                            className="me-2"
                          >
                            Download{" "}
                            {activeCodeTab.charAt(0).toUpperCase() +
                              activeCodeTab.slice(1)}
                          </CButton>
                          <CButton color="primary" onClick={handleContinue}>
                            Continue to Form Builder
                          </CButton>
                        </div>
                      </CCardBody>
                    </CCard>
                  ) : (
                    <CCard className="text-center placeholder-card">
                      <CCardBody className="py-5">
                        <div className="placeholder-icon">
                          <i className="fa fa-code fa-3x text-muted mb-3"></i>
                        </div>
                        <h4 className="text-muted">Ready to Generate Code</h4>
                        <p className="text-muted">
                          Click any button to generate the corresponding code
                          files.
                        </p>
                        <CButton
                          color="primary"
                          onClick={() => generateAllCode()}
                          className="mt-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <CSpinner size="sm" />
                          ) : (
                            "Generate All Code"
                          )}
                        </CButton>
                      </CCardBody>
                    </CCard>
                  )}
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default CodeGenerationPage;
