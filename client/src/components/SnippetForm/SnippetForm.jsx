import SnippetTable from "../SnippetTable/SnippetTable";
import { Button } from "react-bootstrap";
import projectAPI from "../../api/axiosClient.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
function SnippetForm() {
  const [fieldTypeData, setFieldTypeData] = useState([]);
  const [elementData, setElementData] = useState([]);
  const [rows, setRows] = useState({
    snippetId: null,
    elementTypeId: 0,
    fieldTypeId: 0,
    languageId: 0,
    snippetName: "",
    snippet: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchElementTypes();
  }, []);

  const fetchElementTypes = async () => {
    try {
      await projectAPI.getLovDropdown("ELEMENT_TYPE", null).then((response) => {
        const formattedFields = response.data.result.map((field) => ({
          id: field.Id,
          name: field.Name,
        }));
        setElementData(formattedFields);
      });
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Update row immediately
    setRows((prev) => ({ ...prev, [name]: value }));

    // 🚀 Dependent dropdown trigger
    if (name === "elementTypeId") {
      try {
        const res = await projectAPI.getLovDropdown(
          "FIELD_TYPE_BY_ELEMENT",
          value
        );

        // Formatted Data
        const formattedData = res.data.result.map((eachItem) => ({
          id: eachItem.Id,
          name: eachItem.Name,
        }));

        // Update the Field Type Dropdown Data
        setFieldTypeData(formattedData);

        // Reset fieldTypeId AFTER data refresh
        setRows((prev) => ({ ...prev, fieldTypeId: 0 }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    projectAPI
      .insertSnippet(rows)
      .then((response) => {
        console.log("Response:", response.data);
        alert(
          `snippet added: ${response.data.addedCount}, Failed: ${response.data.failedCount}`
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("An error occurred while submitting the projects.");
      });
    setRows({
      snippetId: null,
      elementTypeId: 0,
      fieldTypeId: 0,
      languageId: 0,
      snippetName: "",
      snippet: "",
    });
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className="project-page-heading">Snippet Creation</h3>
      </div>

      <SnippetTable
        rows={rows}
        onChange={(e) => handleChange(e)}
        fieldTypeData={fieldTypeData}
        elementData={elementData}
      />

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className="submit-btn">
          Submit
        </Button>
        <Button
          className="view-project-btn"
          onClick={() => navigate("/view-snippet")}
        >
          View Stored Data
        </Button>
      </div>
    </div>
  );
}

export default SnippetForm;
