import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Themes
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/tableStyles";

//Components
import MUIDataTable from "mui-datatables";
import Loader from "../../common/Spinner";
import FetchAdminLevelReportsAPI from "../../redux/actions/api/Admin/AdminLevelReport";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { snakeToTitleCase } from "../../utils/utils";

const AdminLevelReport = () => {
  const dispatch = useDispatch();
  const classes = TableStyles();

  const [projectreport, setProjectreport] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const apiStatus = useSelector((state) => state.apiStatus);
  const AdminReportData = useSelector((state) => state.getAdminReports?.data);
  const SearchProject = useSelector((state) => state.searchList.data);

  useEffect(() => {
    const apiObj = new FetchAdminLevelReportsAPI();
    dispatch(APITransport(apiObj));
    // eslint-disable-next-line
  }, []);

  const pageSearch = () => {
    let result = [];
    let tableData = projectreport.map((el) => {
      let elementArr = [];
      Object.values(el).filter(
        (valEle, index) => (elementArr[index] = valEle.value)
      );
      return elementArr;
    });

    result = tableData.filter((ele, index) => {
      return ele.some((valEle) =>
        valEle
          ?.toString()
          .toLowerCase()
          .includes(SearchProject?.toString().toLowerCase())
      );
    });

    return result;
  };

  useEffect(() => {
    let fetchedItems = AdminReportData;

    setProjectreport(fetchedItems);
    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems?.length > 0 && fetchedItems[0]) {
      Object.entries(fetchedItems[0]).forEach((el, i) => {
        tempColumns.push({
          name: el[0],
          label: snakeToTitleCase(el[1].label),
          options: {
            filter: false,
            sort: false,
            align: "center",
            setCellHeaderProps: () => ({
              className: classes.cellHeaderProps,
            }),
            setCellProps: () => ({ className: classes.cellProps }),
            customBodyRender: (value) => {
              return value === null ? "-" : value;
            },
          },
        });
        tempSelected.push(el[0]);
      });
    } else {
      setProjectreport([]);
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);

    // eslint-disable-next-line
  }, [AdminReportData]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);

    // eslint-disable-next-line
  }, [selectedColumns]);

  const options = {
    textLabels: {
      body: {
        noMatch: apiStatus.progress ? <Loader /> : "No records",
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

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={pageSearch()} columns={columns} options={options} />
      </ThemeProvider>
    </>
  );
};

export default AdminLevelReport;
