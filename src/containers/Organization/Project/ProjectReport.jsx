import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { snakeToTitleCase } from "../../../utils/utils";
import {
  languagelevelStats,
  projectReportLevels,
} from "../../../config/reportConfig";

//APIs
import FetchProjectReports from "../../../redux/actions/api/Project/FetchProjectReports";
import APITransport from "../../../redux/actions/apitransport/apitransport";

//Themes
import tableTheme from "../../../theme/tableTheme";
import TableStyles from "../../../styles/tableStyles";

//Components
import MUIDataTable from "mui-datatables";
import Loader from "../../../common/Spinner";
import {
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

const ProjectReport = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = TableStyles();

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
    if (reportsLevel === "Language") {
      if (languageLevelsStats === "transcript_stats") {
        fetchedItems = ProjectReportData.transcript_stats;
      } else if (languageLevelsStats === "translation_stats") {
        fetchedItems = ProjectReportData.translation_stats;
      } else if (languageLevelsStats === "voiceover_stats") {
        fetchedItems = ProjectReportData.voiceover_stats;
      }
    }

    setProjectreport(fetchedItems);
    Projectreport();

    // eslint-disable-next-line
  }, [ProjectReportData, languageLevelsStats, reportsLevel]);

  useEffect(() => {
    fetchedItems = ProjectReportData;

    setProjectreport(fetchedItems);
    Projectreport();

    // eslint-disable-next-line
  }, [ProjectReportData]);

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

  const Projectreport = () => {
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
            // setCellProps: () => ({ style: { height: "40px" } }),
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
  };

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns, columns]);

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
    // customToolbar: renderToolBar,
  };

  return (
    <>
      <Grid container columnSpacing={3} rowSpacing={2} mb={2}>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "18px" }}>
              Select Report Type
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Select Reports Level"
              value={reportsLevel}
              onChange={handleChangeReportsLevel}
              sx={{ textAlign: "start" }}
            >
              {projectReportLevels.map((item, index) => (
                <MenuItem key={index} value={item.reportLevel}>
                  {item.reportLevel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {reportsLevel === "Language" && (
            <FormControl fullWidth>
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
                sx={{ textAlign: "start" }}
              >
                {languagelevelStats.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.lable}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>
      </Grid>

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={pageSearch()} columns={columns} options={options} />
      </ThemeProvider>
    </>
  );
};

export default ProjectReport;
