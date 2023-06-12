import { Box } from "@mui/material";
import Loader from "../common/Spinner";
import TableStyles from "../styles/tableStyles";

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

export const userReportDataParser = (dataInTable) => {
  const displayData = [];

  for (const item of dataInTable) {
    const [_, secondElement, ...rest] = item;

    const index = displayData.findIndex((arr) => {
      return arr[1] === secondElement;
    });

    if (index === -1) {
      displayData.push([_, secondElement, ...rest]);
    } else {
      for (let i = 0; i < rest.length; i++) {
        if (typeof rest[i] === "number") {
          displayData[index][i + 2] += rest[i];
        }
      }

      displayData[index][4] = +(
        (displayData[index][3] / displayData[index][2]) *
        100
      ).toFixed(2);

      displayData[index][5] = item[5];
    }
  }

  displayData.forEach((element) => {
    element.push("-");
  });

  return displayData;
};

export const transcriptLanguageReportDataParser = (dataInTable) => {
  const displayData = [];

  for (const item of dataInTable) {
    const [firstElement, ...rest] = item;

    const index = displayData.findIndex((arr) => {
      return arr[0] === firstElement;
    });

    if (index === -1) {
      displayData.push([firstElement, ...rest]);
    } else {
      for (let i = 0; i < rest.length; i++) {
        if (typeof rest[i] === "number") {
          displayData[index][i + 1] += rest[i];
        }
      }
    }
  }

  displayData.forEach((element) => {
    element.push("-");
  });

  return displayData;
};
