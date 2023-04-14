import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import CustomButton from "../../common/Button";
import { Link } from "react-router-dom";
import TableStyles from "../../styles/TableStyles";

const ProjectList = ({ data }) => {
  const classes = TableStyles();

  const columns = [
    {
      name: "id",
      label: "Project Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "title",
      label: "Project Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "type",
      label: "Project Type",
      options: {
        filter: false,
        sort: false,
        align: "center",

        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "mode",
      label: "Project Mode",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
        customBodyRender: (_value, tableMeta) => {
          return (
            <Link
              to={`/projects/${tableMeta.rowData[0]}`}
              style={{ textDecoration: "none" }}
            >
              <CustomButton
                sx={{ borderRadius: 2, marginRight: 2 }}
                label="View"
              />
            </Link>
          );
        },
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
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
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable data={data} columns={columns} options={options} />
    </ThemeProvider>
  );
};

export default ProjectList;
