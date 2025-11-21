import React, {useState} from 'react'
import { Button } from "react-bootstrap";
import projectAPI from '../../api/Api';
import './LanguageForm.css'
import { useNavigate } from "react-router-dom";
import LanguageTable from '../LanguageTable/LanguageTable';

function LanguageForm() {
  const [rows, setRows] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  const navigate = useNavigate();

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        sNO: idCounter,
        lName: "",
        lStatus: "active",
        lInactiveReason: null,
      },
    ]);
    setIdCounter(idCounter + 1);
  };

  console.log(rows);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = () => {
    projectAPI.insertLanguage(rows).then((response) => {
      console.log("Response:", response.data);
      alert(`Projects added: ${response.data.addedCount}, Failed: ${response.data.failedCount}`);
    }).catch((error) => {
      console.error("There was an error!", error);
      alert("An error occurred while submitting the projects.");
    });
    setRows([]);
  };
  const handleViewLanguage = () => {
    navigate('/view-languages')
  }
  return (
    <div className="project-form-container mt-4">
      <div className="project-form-header">
        <h3 className='project-page-heading'>Language Creation</h3>
        <Button onClick={handleAddRow} className='create-project-btn'>Add Language</Button>
      </div>

      <LanguageTable rows={rows} onChange={handleChange}/>

      <div className="project-btn-container">
        <Button onClick={handleSubmit} className='submit-btn'>
          Submit
        </Button>
        <Button className='view-project-btn' onClick={() => handleViewLanguage()}>
          View Stored Data
        </Button>
      </div>
    </div>
  )
}

export default LanguageForm
