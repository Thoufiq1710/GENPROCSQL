import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import projectAPI from "../../api/axiosClient.jsx";


function SnippetTable({
  rows,
  onChange,
  fieldTypeData,
  elementData,
}) {
  const [language, setLanguage] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      await projectAPI.getLangauge().then((response) => {
        const formattedLanguages = response.data.map((lang) => ({
          lId: lang.id,
          lName: lang.name,
          lStatus: lang.status,
          lInactiveReason: lang.inactive_reason,
        }));
        setLanguage(formattedLanguages);
      });
    } catch (err) {
      console.error("Error fetching languages:", err);
    }
  };

  return (
    <Form.Group className="p-2">

      {/* ELEMENT TYPE */}
      <Form.Label htmlFor="fieldType">Select Element Type</Form.Label>
      <Form.Select
        id="fieldType"
        value={rows.elementTypeId}
        name="elementTypeId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        <option value="0">-- Select Element Type --</option>

        {elementData.map((eachField) => (
          <option key={eachField.id} value={eachField.id}>
            {eachField.name}
          </option>
        ))}
      </Form.Select>

      {/* FIELD TYPE */}
      <Form.Label>Select Field Type</Form.Label>
      <Form.Select
        value={rows.fieldTypeId}
        name="fieldTypeId"
        onChange={onChange}
        disabled={!rows.elementTypeId || rows.elementTypeId === "0"}
        className="mb-3"
      >
        {!rows.elementTypeId || rows.elementTypeId === "0" ? (
          <option value="0">-- Select Element Type First --</option>
        ) : null}

        {fieldTypeData.map((eachField) => (
          <option key={eachField.id} value={eachField.id}>
            {eachField.name}
          </option>
        ))}
      </Form.Select>

      {/* LANGUAGE */}
      <Form.Label htmlFor="langName">Select Language</Form.Label>
      <Form.Select
        id="langName"
        value={rows.languageId}
        name="languageId"
        onChange={(e) => onChange(e)}
        className="mb-3"
      >
        <option value="0">-- Select Language --</option>

        {language.map((eachLang) => (
          <option key={eachLang.lId} value={eachLang.lId}>
            {eachLang.lName}
          </option>
        ))}
      </Form.Select>

      {/* SNIPPET NAME */}
      <Form.Label htmlFor="snipName">Snippet Name</Form.Label>
      <Form.Control
        id="snipName"
        type="text"
        value={rows.snippetName}
        name="snippetName"
        onChange={(e) => onChange(e)}
        className="mb-3"
      />

      {/* SNIPPET CONTENT */}
      <Form.Label htmlFor="snippet">Snippet</Form.Label>
      <Form.Control
        id="snippet"
        as="textarea"
        placeholder="Enter Snippet"
        value={rows.snippet || ""}
        name="snippet"
        onChange={(e) => onChange(e)}
        className="mb-3"
      />
    </Form.Group>
  );
}

export default SnippetTable;
