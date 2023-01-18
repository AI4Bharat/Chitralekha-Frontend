import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Themes
import {
  ThemeProvider,
  Tooltip,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import Search from "../../../common/Search";

//Components
import MUIDataTable from "mui-datatables";
import Loader from "../../../common/Spinner";
import FetchProjectReports from "../../../redux/actions/api/Project/FetchProjectReports";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { snakeToTitleCase } from "../../../utils/utils";

const reportLevels = [{ reportLevel: "User" }, { reportLevel: "Language" }];

const languagelevelStats = [
  { lable: "Transcript", value: "transcript_stats" },
  { lable: "Translation", value: "translation_stats" },
];

const ProjectReport = ({}) => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [projectreport, setProjectreport] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportsLevel, setreportsLevel] = useState("");
  const [languageLevelsStats, setlanguageLevelStats] = useState("");

  const apiStatus = useSelector((state) => state.apiStatus);
  const ProjectReportData = useSelector(
    (state) => state.getProjectReports?.data
  );
  const SearchProject = useSelector((state) => state.searchList.data);

  const handleChangeReportsLevel = (event) => {
    setreportsLevel(event.target.value);
    const apiObj = new FetchProjectReports(projectId, event.target.value);
    dispatch(APITransport(apiObj));
  };

  const handleChangelanguageLevelStats = (event) => {
    setlanguageLevelStats(event.target.value);
  };
  let fetchedItems;
  useEffect(() => {

    reportsLevel === "Language" && languageLevelsStats === "transcript_stats"
      ? (fetchedItems = ProjectReportData.transcript_stats)
      : (fetchedItems = ProjectReportData.translation_stats);

    setProjectreport(fetchedItems);
    Projectreport();
  }, [ProjectReportData, languageLevelsStats, reportsLevel]);

  useEffect(() => {

    fetchedItems = ProjectReportData;

    setProjectreport(fetchedItems);
    Projectreport();
  }, [ProjectReportData]);

  const pageSearch = () => {
    return projectreport.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        Object.values(el).toString().toLowerCase().includes(SearchProject.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const Projectreport = () => {
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
  };

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
      <Grid container columnSpacing={3} rowSpacing={2} mb={2}>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "18px" }}>
              Select Report Type
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Reports Level"
              value={reportsLevel}
              onChange={handleChangeReportsLevel}
              sx={{textAlign:"start"}}
            >
              {reportLevels.map((item) => (
                <MenuItem value={item.reportLevel}>{item.reportLevel}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {reportsLevel === "Language" && (
            <FormControl fullWidth size="small">
              <InputLabel
                id="demo-simple-select-label"
                sx={{ fontSize: "18px" }}
              >
                Select Task Type
              </InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Task Stats"
                value={languageLevelsStats}
                onChange={handleChangelanguageLevelStats}
                sx={{textAlign:"start"}}
              >
                {languagelevelStats.map((item) => (
                  <MenuItem value={item.value}>{item.lable}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}></Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {/* <Search /> */}
        </Grid>
      </Grid>

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={pageSearch()}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </>
  );
};

export default ProjectReport;
