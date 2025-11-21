import { useEffect } from "react";
import projectAPI from "../../api/Api";
import ViewFieldTable from "../../components/ViewFieldTable/ViewFieldTable";
import { useState } from "react";

function ViewFieldPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchFieldTypes();
  }, []);
  const fetchFieldTypes = async () => {
    try {
      await projectAPI.getFieldTypes().then((res) => {
        const formatData = res.data.map((eachData) => ({
          fTypeId: eachData.FIELD_TYPE_ID,
          fName: eachData.FIELD_NAME,
          elementName: eachData.element_name,
          fStatus: eachData.status,
          fInactiveReason: eachData.inactive_reason,
        }));
        setRows(formatData);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <ViewFieldTable rows={rows} />
    </div>
  );
}

export default ViewFieldPage;
