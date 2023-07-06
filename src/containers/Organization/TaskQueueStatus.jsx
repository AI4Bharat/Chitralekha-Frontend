import React, { useState, useEffect } from "react";
import { getColumns, getOptions } from "utils";
import { taskQueueStatusColumns } from "config";

//Components
import MUIDataTable from "mui-datatables";
import { CustomizedSnackbars } from "common";

//APIs
import { FetchTaskQueueStatusAPI } from "redux/actions";

const TaskQueueStatus = () => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const fetchTaskQueueStatusList = async () => {
    setLoading(true);
    const apiObj = new FetchTaskQueueStatusAPI();

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();
    if (res.ok) {
      const result = resp.data.map((item, index) => {
        return [
          index + 1,
          item.task_id,
          item.video_id,
          item.submitter_name,
          item.org_name,
          item.video_duration,
        ];
      });

      setTableData(result);
      setLoading(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
    }
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  useEffect(() => {
    fetchTaskQueueStatusList();
    return () => setTableData([]);
  }, []);

  return (
    <div>
      <MUIDataTable
        title="Tasks Queue Status"
        data={tableData}
        columns={getColumns(taskQueueStatusColumns)}
        options={getOptions(loading)}
      />
      {renderSnackBar()}
    </div>
  );
};

export default TaskQueueStatus;
