import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOptions } from "../../utils/tableUtils";
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
} from "@mui/material";
import MUIDataTable from "mui-datatables";

//APIs
import FetchOrganizationReportsAPI from "../../redux/actions/api/Organization/FetchOrganizationReports";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { useRef } from "react";

const OrganizationReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = TableStyles();
  const projectClasses = ProjectStyle();

  const [projectReport, setProjectReport] = useState([]);
  const [columns, setColumns] = useState([]);
  const [reportsLevel, setReportsLevel] = useState("");
  const [languageLevelsStats, setlanguageLevelStats] = useState("");

  const apiStatus = useSelector((state) => state.apiStatus);
  const reportData = useSelector((state) => state.getOrganizationReports?.data);

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
  const SearchProject = useSelector((state) => state.searchList.data);

  const pageSearch = () => {
    let result = [];
    let tableData = projectReport.map((el) => {
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

  let fetchedItems = useRef(null);
  useEffect(() => {
    reportsLevel.includes("Language") &&
    languageLevelsStats === "transcript_stats"
      ? (fetchedItems.current = reportData.transcript_stats)
      : (fetchedItems.current = reportData.translation_stats);

    setProjectReport(fetchedItems.current);
    OrgProjectReport();

    // eslint-disable-next-line
  }, [reportData, languageLevelsStats, reportsLevel]);

  useEffect(() => {
    fetchedItems.current = reportData;
    setProjectReport(fetchedItems.current);
    OrgProjectReport();

    // eslint-disable-next-line
  }, [reportData]);

  const OrgProjectReport = () => {
    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems.current?.length > 0 && fetchedItems.current[0]) {
      Object.entries(fetchedItems.current[0]).forEach((el) => {
        tempColumns.push({
          name: el[0],
          label: snakeToTitleCase(el[1].label),
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: el[1].display ? "exclude" : "true",
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
    } else {
      setProjectReport([]);
    }
    setColumns(tempColumns);
  };

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
          data={pageSearch()}
          columns={columns}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>
    </>
  );
};

export default OrganizationReport;
