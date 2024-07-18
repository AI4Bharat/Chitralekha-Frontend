import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { projectReportLevels, languagelevelStats } from "config";
import { getOptions, snakeToTitleCase } from "utils";
import { isArray } from "lodash";

//APIs
import {
  APITransport,
  DownloadProjectReportsAPI,
  FetchProjectReportsAPI,
} from "redux/actions";

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
import MailIcon from "@mui/icons-material/Mail";
import { ColumnSelector } from "common";
import constants from "redux/constants";
import { Download } from "@mui/icons-material";

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

  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  const openSelector = Boolean(anchorEl);

  const apiStatus = useSelector((state) => state.apiStatus);
  const { reports: projectReportData, total_count } = useSelector(
    (state) => state.getProjectReports?.data
  );
  const SearchProject = useSelector((state) => state.searchList.data);

  const handleChangeReportsLevel = (event) => {
    setreportsLevel(event.target.value);
    setlanguageLevelStats("");
    setOffset(0);
    if (event.target.value === "Language") return;
    const apiObj = new FetchProjectReportsAPI(
      projectId,
      event.target.value,
      limit,
      offset + 1
    );
    dispatch(APITransport(apiObj));
  };

  const handleChangelanguageLevelStats = (event) => {
    setlanguageLevelStats(event.target.value);
    setOffset(0);
    const apiObj = new FetchProjectReportsAPI(
      projectId,
      reportsLevel,
      limit,
      offset + 1,
      event.target.value
    );
    dispatch(APITransport(apiObj));
  };

  const handleDownloadReport = async () => {
    const apiObj = new DownloadProjectReportsAPI(projectId, reportsLevel);
    dispatch(APITransport(apiObj));
  };

  const handleDownloadReportCsv = () => {
    var header = '';
    columns.forEach((item) => {
      header += item.label + ","
    })
    var data = tableData.map((item) => {
      var row = item;
      return row.join(",");
    }).join("\n");
    const blob = new Blob([header.slice(0,-1)+'\n'+data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reports_"+Date.now()+".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    return () => {
      setTableData([]);
      dispatch({ type: constants.GET_PROJECT_REPORTS, payload: [] });
    };
  }, [dispatch]);

  useEffect(() => {
    if (reportsLevel === "") return;

    const apiObj = new FetchProjectReportsAPI(
      projectId,
      reportsLevel,
      limit,
      offset + 1,
      languageLevelsStats
    );
    dispatch(APITransport(apiObj));
  }, [offset]);

  useEffect(() => {
    setOffset(0);
  }, [limit]);

  useEffect(() => {
    let rawData = [];
    rawData = projectReportData;
    createTableData(rawData);
    createReportColumns(rawData);

    // eslint-disable-next-line
  }, [projectReportData, languageLevelsStats, reportsLevel]);

  const createReportColumns = (rawData) => {
    let tempColumns = [];

    if (rawData?.length > 0 && rawData[0]) {
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
      <>
        <Button
          style={{ minWidth: "25px" }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Tooltip title={"View Column"}>
            <ViewColumnIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
          </Tooltip>
        </Button>
        {reportsLevel && (
          <Button
            style={{ minWidth: "25px" }}
            onClick={() => handleDownloadReport()}
          >
            <Tooltip title={"Email Report"}>
              <MailIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
            </Tooltip>
          </Button>
        )}
        {reportsLevel && tableData?.length > 0 && (
          <Button
            style={{ minWidth: "25px" }}
            onClick={() => handleDownloadReportCsv()}
          >
            <Tooltip title={"Download CSV"}>
              <Download sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
            </Tooltip>
          </Button>
        )}
      </>
    );
  };

  useEffect(() => {
    let option = getOptions(apiStatus.loading);

    option = {
      ...option,
      download: false,
      viewColumns: false,
      serverSide: true,
      page: offset,
      rowsPerPage: limit,
      count: total_count,
      customToolbar: renderToolBar,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            setOffset(tableState.page);
            break;
          case "changeRowsPerPage":
            setLimit(tableState.rowsPerPage);
            break;
          default:
        }
      },
    };

    setOptions(option);

    // eslint-disable-next-line
  }, [apiStatus.progress, tableData]);

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
