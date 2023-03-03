import MUIDataTable from "mui-datatables";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import CustomizedSnackbars from "../../common/Snackbar";
import FetchTaskQueueStatusAPI from "../../redux/actions/api/Organization/FetchTaskQueueStatus";
import Loader from "../../common/Spinner";

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
      setTableData(resp.data);
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

  const options = {
    textLabels: {
      body: {
        noMatch: loading ? <Loader /> : "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: true,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: true,
    jumpToPage: true,
  };

  const columns = [
    {
      name: "task_id",
      label: "Task Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "submitter_name",
      label: "Submitter Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "org_name",
      label: "Organization Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
  ];

  return (
    <div>
      <MUIDataTable data={tableData} columns={columns} options={options} />
      {renderSnackBar()}
    </div>
  );
};

export default TaskQueueStatus;
