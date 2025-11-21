
import React from "react";
import { useNavigate } from 'react-router-dom';
import FormBuilder from "../../components/FormBuilder/FormBuilder";
import "./DynamicFormPage.css";

function DynamicFormPage() {
    // Get the navigate function from the router
    const navigate = useNavigate();
    
    // Pass the router's navigate function as a prop to FormBuilder
    return (
        <div className="dynamic-form-page container py-4">
            <h3 className="mb-3">FORM BUILDER</h3>
            <FormBuilder navigate={navigate} /> 
        </div>
    );
}

export default DynamicFormPage;
