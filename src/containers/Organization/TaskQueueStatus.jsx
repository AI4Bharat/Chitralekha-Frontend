import React, { useState, useEffect }  from "react";
import { getOptions } from "../../utils/tableUtils";

//Components
import MUIDataTable from "mui-datatables";
import CustomizedSnackbars from "../../common/Snackbar";

//APIs
import FetchTaskQueueStatusAPI from "../../redux/actions/api/Organization/FetchTaskQueueStatus";

//Styles
import TableStyles from "../../styles/TableStyles";

const TaskQueueStatus = () => {
  const classes = TableStyles();

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

  const columns = [
    {
      name: "S. No",
      label: "Seq. No.",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "task_id",
      label: "Task Id",
      options: {
        display: false,
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "video_id",
      label: "Video Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "submitter_name",
      label: "Submitter",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "org_name",
      label: "Organization",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
    {
      name: "video_duration",
      label: "Video Duration",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps
        }),
      },
    },
  ];

  return (
    <div>
      <MUIDataTable
        title="Tasks Queue Status"
        data={tableData}
        columns={columns}
        options={getOptions(loading)}
      />
      {renderSnackBar()}
    </div>
  );
};

export default TaskQueueStatus;
