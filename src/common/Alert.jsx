import React, { useState, useEffect } from "react";

//Styles
import { ProjectStyle } from "styles";

//Components
import { Alert, Box, Snackbar } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createVideoAlertColumns } from "config";
import { csvAlertColumns } from "config";
import { uploadAlertColumns } from "config";
import { updateRoleAlertColumns } from "config";

const AlertComponent = ({ open, message, report, onClose, columns }) => {
  const classes = ProjectStyle();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (report?.length) {
      setTableData(report);
    }
  }, [report]);

  const options = {
    pagination: false,
    fixedHeader: false,
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    search: false,
    sort: false,
    selectableRows: "none",
  };

  let column = [];
  switch (columns) {
    case "createVideoAlertColumns":
      column = createVideoAlertColumns(report);
      break;

    case "csvAlertColumns":
      column = csvAlertColumns();
      break;

    case "uploadAlertColumns":
      column = uploadAlertColumns(report);
      break;

    case "updateRoleAlertColumns":
      column = updateRoleAlertColumns(report);
      break;

    default:
      break;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        elevation={3}
        variant="standard"
        severity={"info"}
        onClose={onClose}
        sx={{
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 14px 2px rgba(20,6,6,0.52)!important",
        }}
      >
        <Box className={classes.message} style={{ color: "#03a9f4" }}>
          {message}
        </Box>

        {tableData.length ? (
          <MUIDataTable data={tableData} columns={column} options={options} />
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
