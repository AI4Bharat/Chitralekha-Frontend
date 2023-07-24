import React, { useState, useEffect } from "react";
import {
  createVideoAlertColumns,
  csvAlertColumns,
  uploadAlertColumns,
  updateRoleAlertColumns,
} from "config";

//Styles
import { ProjectStyle } from "styles";
import { themeDefault } from "theme";

//Components
import {
  Alert,
  Box,
  Snackbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import MUIDataTable from "mui-datatables";

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

  const getMuiTheme = () =>
    createTheme({
      ...themeDefault,
      components: {
        ...themeDefault.components,
        MuiTableRow: {
          styleOverrides: {
            root: {
              backgroundColor: "rgba(254, 191, 44, 0.1)",
            },
          },
        },
      },
    });

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
          <ThemeProvider theme={getMuiTheme()}>
            <MUIDataTable data={tableData} columns={column} options={options} />
          </ThemeProvider>
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
