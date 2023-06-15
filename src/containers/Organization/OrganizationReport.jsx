import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOptions,
  transcriptLanguageReportDataParser,
  // transcriptLanguageReportDataParser,
  userReportDataParser,
} from "../../utils/tableUtils";
import { languagelevelStats, reportLevels } from "../../config/reportConfig";
import { snakeToTitleCase } from "../../utils/utils";
import { isArray } from "lodash";

//Themes
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/tableStyles";
import ProjectStyle from "../../styles/projectStyle";

//Components
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
import MUIDataTable from "mui-datatables";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

//APIs
import FetchOrganizationReportsAPI from "../../redux/actions/api/Organization/FetchOrganizationReports";
import APITransport from "../../redux/actions/apitransport/apitransport";
import ColumnSelector from "../../common/ColumnSelector";

const OrganizationReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = TableStyles();
  const projectClasses = ProjectStyle();

  const [columns, setColumns] = useState([]);
  const [reportsLevel, setReportsLevel] = useState("");
  const [languageLevelsStats, setlanguageLevelStats] = useState("");
  const [options, setOptions] = useState();
  const [tableData, setTableData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [originalTableData, setOriginalTableData] = useState([]);

  const openSelector = Boolean(anchorEl);

  const apiStatus = useSelector((state) => state.apiStatus);
  const reportData = useSelector((state) => state.getOrganizationReports?.data);
  const SearchProject = useSelector((state) => state.searchList.data);

  const handleChangeReportsLevel = (event) => {
    setReportsLevel(event.target.value);
    setlanguageLevelStats("");

    const temp = reportLevels.filter(
      (item) => item.reportLevel === event.target.value
    );

    const apiObj = new FetchOrganizationReportsAPI(id, temp[0].endPoint);
    dispatch(APITransport(apiObj));
  };

  const handleChangelanguageLevelStats = (event) => {
    setlanguageLevelStats(event.target.value);
  };

  useEffect(() => {
    let rawData = [];

    if (reportsLevel.includes("Language")) {
      if (languageLevelsStats === "transcript_stats") {
        rawData = reportData.transcript_stats;
      } else if (languageLevelsStats === "translation_stats") {
        rawData = reportData.translation_stats;
      } else {
        rawData = [];
      }
    } else {
      rawData = reportData;
    }

    createTableData(rawData);
    OrgProjectReport(rawData);

    // eslint-disable-next-line
  }, [reportData, languageLevelsStats, reportsLevel]);

  const OrgProjectReport = (rawData) => {
    let tempColumns = [];
    let tempSelected = [];

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
              return value === null ? (
                "-"
              ) : el[0] === "video_name" ? (
                <Tooltip title={value}>
                  <div className={projectClasses.reportVideoName}>{value}</div>
                </Tooltip>
              ) : (
                value
              );
            },
          },
        });
        tempSelected.push(el[0]);
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
      setOriginalTableData(result);
    }
  };

  const handleTableChange = (columnName, data, tableName) => {
    setOriginalTableData(data);
    if (tableName === "User" && columnName === "project") {
      const displayData = userReportDataParser(data);
      setTableData(displayData);
    }

    if (tableName === "Project Language" && columnName === "language") {
      const displayData = transcriptLanguageReportDataParser(data);
      setTableData(displayData);
    }
  };

  const handleColumnSelection = (e) => {
    const selectedColumns = [...columns];

    selectedColumns.forEach((element) => {
      const {
        options: { display },
      } = element;

      if (element.name === e.target.name) {
        if (display === "false" || display === "exclude") {
          element.options.display = "true";
          if (e.target.name === "project") {
            createTableData(reportData);
          } else if (e.target.name === "language") {
            createTableData(reportData.transcript_stats);
          } else {
            setTableData(originalTableData);
          }
        } else {
          element.options.display = "false";
          handleTableChange(e.target.name, tableData, reportsLevel);
        }
      }
    });

    setColumns(selectedColumns);
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
    let option = getOptions(apiStatus.progress);

    option = {
      ...option,
      viewColumns: false,
      customToolbar: renderToolBar,
    };

    setOptions(option);

    // eslint-disable-next-line
  }, [apiStatus.progress]);

  return (
    <>
      <Grid container columnSpacing={3} rowSpacing={2} mb={2}>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth>
            <InputLabel id="selectReportTypeLabel" sx={{ fontSize: "18px" }}>
              Select Report Type
            </InputLabel>

            <Select
              labelId="selectReportTypeLabel"
              id="demo-simple-select"
              label="Select Report Type"
              value={reportsLevel}
              onChange={handleChangeReportsLevel}
              sx={{ textAlign: "start" }}
            >
              {reportLevels.map((item, index) => (
                <MenuItem key={index} value={item.reportLevel}>
                  {item.reportLevel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {reportsLevel.includes("Language") && (
            <FormControl fullWidth>
              <InputLabel id="SelectTaskTypeLabel" sx={{ fontSize: "18px" }}>
                Select Task Type
              </InputLabel>

              <Select
                labelId="SelectTaskTypeLabel"
                id="demo-simple-select"
                label="Select Task Type"
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
        <MUIDataTable
          title=""
          data={tableData}
          columns={columns}
          options={options}
        />
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
export default OrganizationReport;
