import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchVideoTaskListAPI from "../../../redux/actions/api/Project/FetchVideoTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { Box } from "@mui/system";
import moment from "moment";
import Loader from "../../../common/Spinner";
import TableStyles from "../../../styles/TableStyles";

const VideoTaskList = (props) => {
  const dispatch = useDispatch();
  const { videoDetails } = props;
  const classes = TableStyles();

  const apiStatus = useSelector((state) => state.apiStatus);

  const FetchVideoTaskList = () => {
    const apiObj = new FetchVideoTaskListAPI(videoDetails);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    FetchVideoTaskList();
    // eslint-disable-next-line
  }, []);

  const videotaskList = useSelector((state) => state.getVideoTaskList.data);

  const columns = [
    {
      name: "task_type",
      label: "Task Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "user",
      label: "Assigned User",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
        customBodyRender: (value) => {
          return <Box>{`${value.first_name} ${value.last_name}`}</Box>;
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
        customBodyRender: (value) => {
          return <Box>{moment(value).format("DD/MM/YYYY HH:mm:ss")}</Box>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
        align: "center",

        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "src_language_label",
      label: "Source Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "target_language_label",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
    {
      name: "priority",
      label: "Priority",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
      },
    },
  ];

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
  };

  return (
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable
        title="Task List"
        data={videotaskList}
        columns={columns}
        options={options}
      />
    </ThemeProvider>
  );
};

export default VideoTaskList;
