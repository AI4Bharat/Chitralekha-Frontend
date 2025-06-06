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
import { Download } from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";
import { ColumnSelector } from "common";
import constants from "redux/constants";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register additional Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

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

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartField, setChartField] = useState('');
  const [comparisonMode, setComparisonMode] = useState('single'); // 'single' or 'users'
  const [comparisonMetrics, setComparisonMetrics] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userMetricType, setUserMetricType] = useState('task_count');

  const openSelector = Boolean(anchorEl);

  const apiStatus = useSelector((state) => state.apiStatus);
  const { reports: projectReportData, total_count } = useSelector(
    (state) => state.getProjectReports?.data
  );
  const SearchProject = useSelector((state) => state.searchList.data);

  const userMetrics = [
    { value: 'task_count', label: 'Assigned Tasks' },
    { value: 'completed_tasks', label: 'Completed Tasks' },
    { value: 'completion_index', label: 'Task Completion Index(%)' },
    { value: 'avg_completion_time', label: 'Avg. Completion Time (Hours)' },
    { value: 'word_count', label: 'Word Count' }
  ];

  const handleChangeReportsLevel = (event) => {
    setTableData([]);
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
  }, [projectReportData, languageLevelsStats]);

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
        {reportsLevel && !(
          (chartField === 'user_distribution' && comparisonMode === 'single') || 
          comparisonMode === 'users'
        ) && (
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
      rowsPerPageOptions: [10, 25, 50, 100, 1000],
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

  const prepareChartData = () => {
    if (comparisonMode === 'single') {
      prepareSimpleChartData();
    } else if (comparisonMode === 'users') {
      prepareUserComparisonData();
    }
  };

  const prepareSimpleChartData = () => {
    if (!chartField || !tableData.length || !columns.length) return;
    
    // Special handling for user distribution visualization
    if (chartField === 'user_distribution') {
      prepareUserDistributionChart();
      return;
    }
    
    // Original field-based chart preparation
    const fieldIndex = columns.findIndex(col => col.name === chartField);
    if (fieldIndex === -1) return;
    
    // Count occurrences or aggregate values
    const valueMap = {};
    tableData.forEach(row => {
      const value = String(row[fieldIndex] || 'N/A');
      valueMap[value] = (valueMap[value] || 0) + 1;
    });
    
    // Sort by count (descending) for better visualization
    const sortedEntries = Object.entries(valueMap)
      .sort(([, countA], [, countB]) => countB - countA);
    
    const labels = sortedEntries.map(([label]) => label);
    const data = sortedEntries.map(([, count]) => count);
    
    // Generate distinct colors using HSL for better contrast
    const backgroundColors = labels.map((_, index) => {
      const hue = (index * 137.5) % 360; // Golden ratio approximation for good distribution
      return `hsl(${hue}, 70%, 65%)`;
    });
    
    // Add slight transparency for better look
    const backgroundColorsWithOpacity = backgroundColors.map(color => {
      return color.replace('hsl', 'hsla').replace(')', ', 0.85)');
    });
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColorsWithOpacity,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 10
        },
      ],
    });
  };

  const prepareUserDistributionChart = () => {
    // Find user column index
    const userColumnIndex = columns.findIndex(col => 
      ['user', 'username', 'user_name', 'name', 'assigned_to'].some(term => 
        col.name.toLowerCase().includes(term)
      )
    );
    
    if (userColumnIndex === -1) {
      console.error("Could not find user column");
      return;
    }
    
    // Get task counts by user
    const userTaskCounts = {};
    
    tableData.forEach(row => {
      const user = String(row[userColumnIndex] || 'Unknown');
      
      if (!userTaskCounts[user]) {
        userTaskCounts[user] = 0;
      }
      
      // For basic task count, just increment by one for each row
      if (userMetricType === 'task_count') {
        userTaskCounts[user] += 1;
      } else {
        // For other metrics, try to find the corresponding column
        const metricColumnIndex = columns.findIndex(col => 
          col.name.toLowerCase().includes(userMetricType.toLowerCase()) ||
          col.label.toLowerCase().includes(userMetricType.toLowerCase())
        );
        
        if (metricColumnIndex !== -1) {
          const value = row[metricColumnIndex];
          const numValue = Number(value);
          
          if (!isNaN(numValue)) {
            userTaskCounts[user] += numValue;
          } else if (value && value !== '-' && value !== 'N/A') {
            // If not a number but has some meaningful value, count as 1
            userTaskCounts[user] += 1;
          }
        } else {
          // Try alternative approaches to find the metric
          // Check for completion metrics
          if (userMetricType === 'completed_tasks') {
            const statusIndex = columns.findIndex(col => 
              col.name.toLowerCase().includes('status') || 
              col.label.toLowerCase().includes('status')
            );
            
            if (statusIndex !== -1) {
              const status = String(row[statusIndex] || '').toLowerCase();
              if (status.includes('complete') || status === 'done' || status === 'finished') {
                userTaskCounts[user] += 1;
              }
            } else {
              // If no status column, just count rows as a fallback
              userTaskCounts[user] += 1;
            }
          } 
          // Check for completion index (percentage)
          else if (userMetricType === 'completion_index') {
            const completionIndex = columns.findIndex(col => 
              col.name.toLowerCase().includes('complete') || 
              col.label.toLowerCase().includes('complete') ||
              col.name.toLowerCase().includes('progress') || 
              col.label.toLowerCase().includes('progress')
            );
            
            if (completionIndex !== -1) {
              const value = row[completionIndex];
              // Try to extract percentage value
              const numMatch = String(value).match(/(\d+(\.\d+)?)%?/);
              if (numMatch && numMatch[1]) {
                const numValue = Number(numMatch[1]);
                if (!isNaN(numValue)) {
                  userTaskCounts[user] += numValue;
                }
              }
            }
          }
          // Handle time metrics
          else if (userMetricType === 'avg_completion_time') {
            const timeIndex = columns.findIndex(col => 
              col.name.toLowerCase().includes('time') || 
              col.label.toLowerCase().includes('time') ||
              col.name.toLowerCase().includes('duration') || 
              col.label.toLowerCase().includes('duration')
            );
            
            if (timeIndex !== -1) {
              const value = row[timeIndex];
              // Try to extract numeric time value
              const numMatch = String(value).match(/(\d+(\.\d+)?)/);
              if (numMatch && numMatch[1]) {
                const numValue = Number(numMatch[1]);
                if (!isNaN(numValue)) {
                  // Keep track of count and sum for average calculation
                  if (!userTaskCounts.counts) userTaskCounts.counts = {};
                  if (!userTaskCounts.counts[user]) userTaskCounts.counts[user] = 0;
                  userTaskCounts.counts[user]++;
                  userTaskCounts[user] += numValue;
                }
              }
            }
          }
          // Handle word count
          else if (userMetricType === 'word_count') {
            const wordCountIndex = columns.findIndex(col => 
              col.name.toLowerCase().includes('word') || 
              col.label.toLowerCase().includes('word') ||
              col.name.toLowerCase().includes('count') || 
              col.label.toLowerCase().includes('count')
            );
            
            if (wordCountIndex !== -1) {
              const value = row[wordCountIndex];
              const numValue = Number(value);
              if (!isNaN(numValue)) {
                userTaskCounts[user] += numValue;
              }
            }
          }
          else {
            // Default fallback: just count rows
            userTaskCounts[user] += 1;
          }
        }
      }
    });
    
    // Calculate averages for time-based metrics
    if (userMetricType === 'avg_completion_time' && userTaskCounts.counts) {
      Object.keys(userTaskCounts).forEach(user => {
        if (user !== 'counts' && userTaskCounts.counts[user]) {
          userTaskCounts[user] = userTaskCounts[user] / userTaskCounts.counts[user];
        }
      });
      delete userTaskCounts.counts;
    }
    
    // Sort by count (descending)
    const sortedUsers = Object.entries(userTaskCounts)
      .sort(([, countA], [, countB]) => countB - countA);
    
    const labels = sortedUsers.map(([user]) => user);
    const data = sortedUsers.map(([, count]) => count);
    
    // Generate distinct colors for each user
    const userColors = [
      '#4285f4', // Blue
      '#ea4335', // Red
      '#fbbc05', // Yellow
      '#34a853', // Green
      '#00acc1', // Cyan
      '#ab47bc', // Purple
      '#ff7043', // Orange
      '#9e9e9e', // Gray
      '#5c6bc0', // Indigo
      '#26a69a', // Teal
      '#ec407a', // Pink
      '#8d6e63', // Brown
    ];
    
    const backgroundColors = labels.map((_, index) => 
      userColors[index % userColors.length]
    );
    
    // Add slight transparency
    const backgroundColorsWithOpacity = backgroundColors.map(color => {
      const hexToRgba = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.85)`;
      };
      
      return color.startsWith('#') ? hexToRgba(color) : color;
    });
    
    setChartData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColorsWithOpacity,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 10
        },
      ],
    });
  };

  const prepareUserComparisonData = () => {
    if (!comparisonMetrics.length || !tableData.length || !columns.length) return;
    
    // Find users column index
    const userColumnIndex = columns.findIndex(col => 
      ['user', 'username', 'user_name', 'name', 'assigned_to'].some(term => 
        col.name.toLowerCase().includes(term)
      )
    );
    
    if (userColumnIndex === -1) {
      console.error("Could not find user column");
      return;
    }

    // Get data grouped by users
    const userMap = {};
    
    tableData.forEach(row => {
      const user = String(row[userColumnIndex] || 'Unknown');
      
      if (!userMap[user]) {
        userMap[user] = {};
        comparisonMetrics.forEach(metric => {
          userMap[user][metric] = 0;
        });
      }
      
      comparisonMetrics.forEach(metric => {
        const metricIndex = columns.findIndex(col => col.name === metric);
        if (metricIndex !== -1) {
          // Try to convert to number, if not possible just count occurrences
          const value = row[metricIndex];
          const numValue = Number(value);
          
          if (!isNaN(numValue)) {
            userMap[user][metric] += numValue;
          } else if (value && value !== '-' && value !== 'N/A') {
            userMap[user][metric] += 1;
          }
        }
      });
    });
    
    // Limit to top N users for better visualization
    const topN = 10;
    const users = Object.keys(userMap).slice(0, topN);
    
    // Set selected users if not already set
    if (selectedUsers.length === 0) {
      setSelectedUsers(users);
    }
    
    // Prepare datasets for each metric
    const datasets = comparisonMetrics.map((metric, index) => {
      const hue = (index * 137.5) % 360;
      const color = `hsla(${hue}, 80%, 60%, 0.8)`;
      
      return {
        label: columns.find(col => col.name === metric)?.label || metric,
        data: users.map(user => userMap[user][metric]),
        backgroundColor: color,
        borderColor: color.replace('0.8', '1'),
        borderWidth: 1,
      };
    });
    
    setChartData({
      type: 'bar',
      labels: users,
      datasets,
    });
  };

  useEffect(() => {
    if ((comparisonMode === 'single' && chartField && tableData.length > 0) || 
        (comparisonMode === 'users' && comparisonMetrics.length > 0 && tableData.length > 0)) {
      prepareChartData();
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [chartField, tableData, comparisonMode, comparisonMetrics, userMetricType]);

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
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {reportsLevel && columns.length > 0 && comparisonMode === 'single' && (
            <FormControl fullWidth>
              <InputLabel id="chart-field-label" sx={{ fontSize: "18px" }}>
                Visualize Field
              </InputLabel>
              <Select
                labelId="chart-field-label"
                value={chartField}
                onChange={(e) => setChartField(e.target.value)}
                label="Visualize Field"
                sx={{ textAlign: "start" }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="user_distribution">User Distribution</MenuItem>
              </Select>
            </FormControl>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          {reportsLevel && columns.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="visualization-mode-label" sx={{ fontSize: "18px" }}>
                Visualization Mode
              </InputLabel>
              <Select
                labelId="visualization-mode-label"
                value={comparisonMode}
                onChange={(e) => setComparisonMode(e.target.value)}
                label="Visualization Mode"
                sx={{ textAlign: "start" }}
              >
                <MenuItem value="single">Single Field</MenuItem>
                <MenuItem value="users">User Comparison</MenuItem>
              </Select>
            </FormControl>
          )}
        </Grid>
        
        {comparisonMode === 'users' && (
          <>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth>
                <InputLabel id="metric-select-label" sx={{ fontSize: "18px" }}>
                  Select Metrics
                </InputLabel>
                <Select
                  labelId="metric-select-label"
                  multiple
                  value={comparisonMetrics}
                  onChange={(e) => setComparisonMetrics(e.target.value)}
                  label="Select Metrics"
                  renderValue={(selected) => selected.map(id => 
                    columns.find(col => col.name === id)?.label
                  ).join(', ')}
                >
                  {columns.filter(col => 
                    col.options.display !== "exclude" && 
                    !['user', 'username', 'user_name', 'name'].includes(col.name.toLowerCase())
                  ).map((col) => (
                    <MenuItem key={col.name} value={col.name}>
                      {col.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        {chartField === 'user_distribution' && comparisonMode === 'single' && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth>
              <InputLabel id="user-metric-type-label" sx={{ fontSize: "18px" }}>
                User Metric
              </InputLabel>
              <Select
                labelId="user-metric-type-label"
                value={userMetricType}
                onChange={(e) => setUserMetricType(e.target.value)}
                label="User Metric"
                sx={{ textAlign: "start" }}
              >
                {userMetrics.map((metric) => (
                  <MenuItem key={metric.value} value={metric.value}>
                    {metric.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
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

      {comparisonMode === 'single' && chartData.labels && chartData.labels.length > 0 && (
        <>
          <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
            <Grid item xs={12}>
              <div style={{ 
                padding: 24, 
                borderRadius: 8, 
                boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
              }}>
                <h2 style={{ margin: '0 0 24px 0', color: '#333', fontWeight: 500 }}>
                  {chartField === 'user_distribution' ? 
                    `User Distribution: ${userMetrics.find(m => m.value === userMetricType)?.label || 'Task Count'}` : 
                    `Data Visualization: ${columns.find(col => col.name === chartField)?.label}`
                  }
                </h2>
                
                {/* Existing Pie Chart visualization */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={7}>
                    <div style={{ height: '400px', position: 'relative' }}>
                      <Pie 
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  const label = context.label || '';
                                  const value = context.parsed || 0;
                                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                  const percentage = Math.round((value / total) * 100);
                                  return `${label}: ${value} (${percentage}%)`;
                                }
                              },
                              padding: 12,
                              titleFont: { size: 14 },
                              bodyFont: { size: 14 }
                            }
                          },
                          elements: {
                            arc: {
                              borderWidth: 2,
                              borderColor: '#fff'
                            }
                          },
                          animation: {
                            animateRotate: true,
                            animateScale: true
                          }
                        }}
                      />
                    </div>
                  </Grid>
                  
                  <Grid item xs={12} md={5}>
                    <div style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <ChartLegendCard 
                        chartData={chartData} 
                        fieldName={chartField === 'user_distribution' ? 
                          `${userMetrics.find(m => m.value === userMetricType)?.label || 'Tasks'} by User` :
                          columns.find(col => col.name === chartField)?.label
                        }
                      />
                      
                      <div style={{
                        marginTop: 24,
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #eee'
                      }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: 16 }}>Summary Statistics</h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>
                          <strong>Total Items:</strong> {chartData.datasets[0].data.reduce((a, b) => a + b, 0)}
                        </p>
                        <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>
                          <strong>Categories:</strong> {chartData.labels.length}
                        </p>
                        <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>
                          <strong>Most Common:</strong> {chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))]}
                          {' '} ({Math.max(...chartData.datasets[0].data)})
                        </p>
                      </div>
                      
                      <Button 
                        variant="outlined"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `${columns.find(col => col.name === chartField)?.label}_chart.png`;
                          link.href = document.querySelector('canvas').toDataURL('image/png');
                          link.click();
                        }}
                        sx={{ alignSelf: 'flex-start', mt: 2 }}
                        startIcon={<Download />}
                      >
                        Download Chart
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <DataAnalysisSummary 
              chartData={chartData} 
              fieldName={chartField === 'user_distribution' ? 
                `User ${userMetrics.find(m => m.value === userMetricType)?.label || 'Task'} Distribution` :
                columns.find(col => col.name === chartField)?.label
              }
            />
          </Grid>
        </>
      )}

      {comparisonMode === 'users' && chartData.labels && chartData.labels.length > 0 && (
        <UserComparisonChart chartData={chartData} />
      )}
    </>
  );
};

const ChartLegendCard = ({ chartData, fieldName }) => {
  if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) return null;
  
  return (
    <div style={{ 
      marginTop: 16, 
      padding: 16, 
      borderRadius: 8, 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      backgroundColor: '#fff'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>{fieldName} Distribution</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {chartData.labels.map((label, index) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', minWidth: '120px' }}>
            <div style={{ 
              width: 16, 
              height: 16, 
              backgroundColor: chartData.datasets[0].backgroundColor[index],
              borderRadius: 4,
              marginRight: 8 
            }}></div>
            <div style={{ fontSize: 14 }}>
              <span>{label}</span>
              <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                {chartData.datasets[0].data[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DataAnalysisSummary = ({ chartData, fieldName }) => {
  if (!chartData.labels || !chartData.datasets || !chartData.datasets[0]) return null;
  
  const data = chartData.datasets[0].data;
  const total = data.reduce((a, b) => a + b, 0);
  const maxValue = Math.max(...data);
  const maxIndex = data.indexOf(maxValue);
  const maxLabel = chartData.labels[maxIndex];
  
  // Calculate percentages
  const percentages = data.map(value => ((value / total) * 100).toFixed(1));
  
  return (
    <div style={{ 
      marginTop: 20, 
      padding: '16px 20px', 
      borderRadius: 8, 
      backgroundColor: '#f5f8fa',
      border: '1px solid #e1e8ed'
    }}>
      <h3 style={{ marginTop: 0, color: '#14171a' }}>{fieldName} Analysis</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: 14, color: '#657786', margin: 0 }}>Total</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>{total}</p>
        </div>
        
        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: 14, color: '#657786', margin: 0 }}>Most Common</p>
          <p style={{ fontSize: 20, fontWeight: 'bold', margin: 0 }}>{maxLabel}</p>
          <p style={{ fontSize: 14, margin: '4px 0 0 0' }}>
            <strong>{maxValue} ({percentages[maxIndex]}%)</strong>
          </p>
        </div>
        
        <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 6, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: 14, color: '#657786', margin: 0 }}>Categories</p>
          <p style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>{chartData.labels.length}</p>
        </div>
      </div>
    </div>
  );
};

const UserComparisonChart = ({ chartData }) => {
  if (!chartData.labels || !chartData.datasets || !chartData.datasets.length === 0) return null;
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    barPercentage: 0.8,
  };

  return (
    <div style={{ 
      padding: 24, 
      borderRadius: 8, 
      boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      marginTop: 24
    }}>
      <h2 style={{ margin: '0 0 24px 0', color: '#333', fontWeight: 500 }}>
        User Comparison
      </h2>
      
      <div style={{ height: '500px', position: 'relative' }}>
        <Bar data={chartData} options={options} />
      </div>
      
      <div style={{ marginTop: 20 }}>
        <h3>Analysis</h3>
        <p>This chart compares different metrics across users. Higher values indicate greater activity or workload.</p>
        
        {chartData.datasets.map((dataset, index) => {
          const maxValue = Math.max(...dataset.data);
          const maxIndex = dataset.data.indexOf(maxValue);
          const maxUser = chartData.labels[maxIndex];
          
          const minValue = Math.min(...dataset.data.filter(val => val > 0));
          const minIndex = dataset.data.indexOf(minValue);
          const minUser = chartData.labels[minIndex];
          
          const total = dataset.data.reduce((sum, val) => sum + val, 0);
          const average = total / dataset.data.filter(val => val > 0).length;
          
          return (
            <div key={index} style={{ marginTop: 16, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 8px 0', color: dataset.borderColor }}>{dataset.label}</h4>
              <p style={{ margin: '4px 0', fontSize: 14 }}>
                <strong>Highest:</strong> {maxUser} ({maxValue})
              </p>
              <p style={{ margin: '4px 0', fontSize: 14 }}>
                <strong>Lowest:</strong> {minUser} ({minValue})
              </p>
              <p style={{ margin: '4px 0', fontSize: 14 }}>
                <strong>Average:</strong> {average.toFixed(1)}
              </p>
            </div>
          );
        })}
      </div>
      
      <Button 
        variant="outlined"
        onClick={() => {
          const canvas = document.querySelector('canvas');
          const link = document.createElement('a');
          link.download = `user_comparison_chart.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }}
        sx={{ mt: 2 }}
        startIcon={<Download />}
      >
        Download Chart
      </Button>
    </div>
  );
};

export default ProjectReport;