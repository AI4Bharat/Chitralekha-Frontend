import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Themes
import { ThemeProvider, Grid, Box } from "@mui/material";
import tableTheme from "../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import Loader from "../../common/Spinner";
import FetchAdminLevelReportsAPI from "../../redux/actions/api/Admin/AdminLevelReport";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { snakeToTitleCase } from "../../utils/utils";
import Search from "../../common/Search";
import DatasetStyle from "../../styles/Dataset";

const AdminLevelReport = ({}) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [projectreport, setProjectreport] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  const apiStatus = useSelector((state) => state.apiStatus);
  const AdminReportData = useSelector((state) => state.getAdminReports?.data);
  const SearchProject = useSelector((state) => state.searchList.data);

  useEffect(() => {
    const apiObj = new FetchAdminLevelReportsAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const pageSearch = () => {
    return projectreport.filter((el) => {
      console.log(el, "elelel");
      if (SearchProject == "") {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_projects
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_videos
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_translation_tasks
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_transcription_tasks
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_transcription_tasks_completed
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.num_translation_tasks_completed
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  useEffect(() => {
    let fetchedItems = AdminReportData;

    setProjectreport(fetchedItems);
    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems?.length > 0 && fetchedItems[0]) {
      Object.keys(fetchedItems[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: false,
            sort: false,
            align: "center",
            customBodyRender: (value) => {
              return value === null ? "-" : value;
            },
          },
        });
        tempSelected.push(key);
      });
    } else {
      setProjectreport([]);
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);
  }, [AdminReportData]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns]);

  const renderToolBar = () => {
    return (
      <Box sx={{ position: "absolute", right: "107px", bottom: "2px" }}>
        <Search />
      </Box>
    );
  };

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
    search: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
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
