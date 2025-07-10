import { Box, MenuItem, Select, TablePagination } from "@mui/material";
import Loader from "../common/Spinner";
import TableStyles from "../styles/tableStyles";
const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: {
          xs: "space-between",
          md: "flex-end"
        },
        alignItems: "center",
        padding: "10px",
        gap: {
          xs: "10px",
          md: "20px"
        },
      }}
    >

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => changePage(newPage)}
        onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
        sx={{
          "& .MuiTablePagination-actions": {
            marginLeft: "0px",
          },
          "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
            marginRight: "10px",
          },
        }}
      />

      {/* Jump to Page */}
      <div>
        <label style={{
          marginRight: "5px",
          fontSize: "0.83rem",
        }}>
          Jump to Page:
        </label>
        <Select
          value={page + 1}
          onChange={(e) => changePage(Number(e.target.value) - 1)}
          sx={{
            fontSize: "0.8rem",
            padding: "4px",
            height: "32px",
          }}
        >
          {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
            <MenuItem key={i} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Box>
  );
};

export const getOptions = (loading) => {
  console.log(loading);
  
  const options = {
    textLabels: {
      body: {
        noMatch: loading == true  ? <Loader /> : "No records",
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
    responsive: "vertical",

    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
  };

  return options;
};

export const getColumns = (config, displayColsData) => {
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
      if (displayColsData) {
        element.options.display = displayColsData[element["name"]];
      }
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
