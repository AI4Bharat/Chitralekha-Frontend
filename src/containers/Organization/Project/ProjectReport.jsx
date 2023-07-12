import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { projectReportLevels, languagelevelStats } from "config";
import { getOptions, snakeToTitleCase } from "utils";
import { isArray } from "lodash";

//APIs
import { APITransport, FetchProjectReportsAPI } from "redux/actions";

//Themes
import { tableTheme } from "theme";
import { TableStyles } from "styles";

//Components
import MUIDataTable from "mui-datatables";
import {
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
  Button,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { ColumnSelector } from "common";


const ProjectReport = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = TableStyles();

  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [reportsLevel, setreportsLevel] = useState("");
  const [languageLevelsStats, setlanguageLevelStats] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState();

  const openSelector = Boolean(anchorEl);

  const apiStatus = useSelector((state) => state.apiStatus);
  const projectReportData = useSelector(
    (state) => state.getProjectReports?.data
  );
  const SearchProject = useSelector((state) => state.searchList.data);

  const handleChangeReportsLevel = (event) => {
    setreportsLevel(event.target.value);
    setlanguageLevelStats("");

    const apiObj = new FetchProjectReportsAPI(projectId, event.target.value);
    dispatch(APITransport(apiObj));
  };

  const handleChangelanguageLevelStats = (event) => {
    setlanguageLevelStats(event.target.value);
  };

  useEffect(() => {
    let rawData = [];

    if (reportsLevel.includes("Language")) {
      if (languageLevelsStats === "transcript_stats") {
        rawData = projectReportData.transcript_stats;
      } else if (languageLevelsStats === "translation_stats") {
        rawData = projectReportData.translation_stats;
      } else if (languageLevelsStats === "voiceover_stats") {
        rawData = projectReportData.voiceover_stats;
      } else {
        rawData = [];
      }
    } else {
      rawData = projectReportData;
    }

    createTableData(rawData);
    createReportColumns(rawData);

    // eslint-disable-next-line
  }, [projectReportData, languageLevelsStats, reportsLevel]);

  const createReportColumns = (rawData) => {
    let tempColumns = [];

    if (rawData.length > 0 && rawData[0]) {
      Object.entries(rawData[0]).forEach((el) => {
        tempColumns.push({
          name: el[0],
          label: snakeToTitleCase(el[1].label),
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: el[1].display ? "exclude" : "true",
            viewColumns: el[1].viewColumns === false ? el[1].viewColumns : true,
            setCellHeaderProps: () => ({
              className: classes.cellHeaderProps,
            }),
            setCellProps: () => ({ className: classes.cellProps }),
            customBodyRender: (value) => {
              if (isArray(value)) {
                value = value.join(", ");
              }
              return value === null ? "-" : value;
            },
          },
        });
      });
    }

    setColumns(tempColumns);
  };

  const createTableData = (rawData) => {
    if (rawData?.length > 0) {
      let result = [];

      let tableData = rawData.map((el) => {
        let elementArr = [];

        Object.values(el).filter(
          (valEle, index) => (elementArr[index] = valEle.value)
        );

        return elementArr;
      });

      result = tableData.filter((element) => {
        return element.some((valEle) =>
          valEle
            ?.toString()
            .toLowerCase()
            .includes(SearchProject?.toString().toLowerCase())
        );
      });

      setTableData(result);
    }
  };

  const renderToolBar = () => {
    return (
      <Button
        style={{ minWidth: "25px" }}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Tooltip title={"View Column"}>
          <ViewColumnIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
        </Tooltip>
      </Button>
    );
  };

  useEffect(() => {
    let option = getOptions(apiStatus.loading);

    option = {
      ...option,
      viewColumns: false,
      customToolbar: renderToolBar,
    };

    setOptions(option);

    // eslint-disable-next-line
  }, [apiStatus.progress]);

  const handleColumnSelection = (e) => {
    const selectedColumns = [...columns];

    selectedColumns.forEach((element) => {
      const {
        options: { display },
      } = element;

      if (element.name === e.target.name) {
        if (display === "false" || display === "exclude") {
          element.options.display = "true";
        } else {
          element.options.display = "false";
        }
      }
    });

    setColumns(selectedColumns);
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
        <MUIDataTable data={tableData} columns={columns} options={options} />
      </ThemeProvider>

      {openSelector && (
        <ColumnSelector
          anchorEl={anchorEl}
          open={openSelector}
          handleClose={() => setAnchorEl(null)}
          columns={columns}
          handleColumnSelection={handleColumnSelection}
        />
      )}
    </>
  );
};

export default ProjectReport;
