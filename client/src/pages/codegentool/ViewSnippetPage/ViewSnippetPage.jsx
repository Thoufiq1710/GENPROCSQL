import { useState, useEffect } from "react";
import projectAPI from "../../api/Api";
import ViewSnippetTable from "../../components/ViewSnippetTable/ViewSnippetTable";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function ViewSnippetPage() {
  const [snippets, setSnippets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSnippet();
  }, []);

  const fetchSnippet = () => {
    projectAPI
      .getSnippet()
      .then((response) => {
        const formattedData = response.data.result.map((eachItem) => ({
          snippetId: eachItem.Snippet_ID,
          snippetName: eachItem.Snippet_Name,
          snippetCode: eachItem.Snippet,
          status: eachItem.Snippet_Status,
          inactiveReason: eachItem.Snippet_Inactive_Reason,
        }));
        setSnippets(formattedData);
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  const handleBack = () => {
    navigate("/snippet");
  };

  return (
    <div className="view-projects-page p-4">
      <div className="main-content">
        <ViewSnippetTable rows={snippets} />
        <Button onClick={handleBack} variant="danger">
          Back
        </Button>
      </div>
    </div>
  );
}

export default ViewSnippetPage;
