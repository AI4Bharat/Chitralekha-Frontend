import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOptions } from "../../utils/tableUtils";
import { languagelevelStats, reportLevels } from "../../config/reportConfig";
import { snakeToTitleCase } from "../../utils/utils";

//Themes
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/tableStyles";

//Components
import {
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import MUIDataTable from "mui-datatables";

//APIs
import FetchOrganizationReportsAPI from "../../redux/actions/api/Organization/FetchOrganizationReports";
import APITransport from "../../redux/actions/apitransport/apitransport";

const OrganizationReport = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = TableStyles();

  const [projectreport, setProjectreport] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportsLevel, setreportsLevel] = useState("");
  const [languageLevelsStats, setlanguageLevelStats] = useState("");
  
  const apiStatus = useSelector((state) => state.apiStatus);
  const ReportData = useSelector((state) => state.getOrganizationReports?.data);

  const handleChangeReportsLevel = (event) => {
    setreportsLevel(event.target.value);
    const apiObj = new FetchOrganizationReportsAPI(id, event.target.value);
    dispatch(APITransport(apiObj));
  };

  const handleChangelanguageLevelStats = (event) => {
    setlanguageLevelStats(event.target.value);
  };
  const SearchProject = useSelector((state) => state.searchList.data);

  const pageSearch = () => {
    let result = [];
    let tableData = projectreport.map((el) => {
      let elementArr = [];
      Object.values(el).filter((valEle, index) => 
        elementArr[index] = valEle.value
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

  let fetchedItems;
  useEffect(() => {
    reportsLevel === "Language" && languageLevelsStats === "transcript_stats"
      ? (fetchedItems = ReportData.transcript_stats)
      : (fetchedItems = ReportData.translation_stats);

    setProjectreport(fetchedItems);
    OrgProjectreport();

    // eslint-disable-next-line
  }, [ReportData, languageLevelsStats, reportsLevel]);

  useEffect(() => {
    fetchedItems = ReportData;
    setProjectreport(fetchedItems);
    OrgProjectreport();
    
    // eslint-disable-next-line
  }, [ReportData]);

  const OrgProjectreport = () => {
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
              className: classes.cellHeaderProps
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
              sx={{ textAlign: "start" }}
            >
              {reportLevels.map((item, index) => (
                <MenuItem key={index} value={item.reportLevel}>{item.reportLevel}</MenuItem>
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
                label=" Select Project Stats"
                value={languageLevelsStats}
                onChange={handleChangelanguageLevelStats}
                sx={{ textAlign: "start" }}
              >
                {languagelevelStats.map((item, index) => (
                  <MenuItem key={index} value={item.value}>{item.lable}</MenuItem>
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
