import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import projectAPI from "../../api/Api";
import { useNavigate } from "react-router-dom";
import FieldTypeTable from "../FieldTypeTable/FieldTypeTable";

function FieldTypeForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const [elementType, setElementType] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLanguageData();
  }, []);

  const fetchLanguageData = async () => {
    try {
      await projectAPI.getLovDropdown("ELEMENT_TYPE", null).then((res) => {
        const formattedData = res.data.result.map((eachItem) => ({
          id: eachItem.Id,
          name: eachItem.Name,
        }));
        setElementType(formattedData);
      });
    } catch (error) {
      console.error("Error while fetching language dropdown: ", error);
    }
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNO: idCounter,
        fieldTypeId: null,
        elementTypeId: 0,
        fieldName: "",
        fStatus: "1",
        fInactiveReason: null,
        cUser: "admin",
      },
    ]);
    setIdCounter(idCounter + 1);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    projectAPI
      .insertFieldTypes(rows)
      .then((response) => {
        console.log("Response:", response.data);
        alert(
          `Projects added: ${response.data.addedCount}, Failed: ${response.data.failedCount}`
        );
      })
      .catch((error) => {
        console.error("There was an error!", error);
        alert("An error occurred while submitting the projects.");
      });
    setRows([]);
  };
  const handleViewField = () => {
    navigate("/view-field");
  };
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className="project-page-heading">Field Creation</h3>
        <Button onClick={handleAddRow} className="create-project-btn">
          Add Field
        </Button>
      </div>

      <FieldTypeTable
        rows={rows}
        onChange={handleChange}
        elementType={elementType}
      />

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className="submit-btn">
          Submit
        </Button>
        <Button className="view-project-btn" onClick={() => handleViewField()}>
          View Stored Data
        </Button>
      </div>
    </div>
  );
}

export default FieldTypeForm;
