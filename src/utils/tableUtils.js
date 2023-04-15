import { Box } from "@mui/material";
import Loader from "../common/Spinner";
import TableStyles from "../styles/TableStyles";

export const getOptions = (loading) => {
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

  return options;
};

export const getColumns = (config) => {
  const classes = TableStyles();
  const columns = [];

  const options = {
    filter: false,
    sort: false,
    align: "center",
    setCellHeaderProps: () => ({
      className: classes.cellHeaderProps,
    }),
    customBodyRender: (value) => {
      return <Box>{value}</Box>;
    },
  };

  config.forEach((element) => {
    if (element.options) {
      element.options = {
        ...element.options,
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      };
    }

    columns.push({
      name: element.name,
      label: element.label,
      options: element.options ? element.options : options,
    });
  });

  return columns;
};
