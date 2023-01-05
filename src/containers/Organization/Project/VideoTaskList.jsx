import React from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FetchVideoTaskListAPI from "../../../redux/actions/api/Project/FetchVideoTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import { Box } from "@mui/system";
import moment from "moment";

const VideoTaskList = (props) => {
  const dispatch = useDispatch();
  const { videoDetails } = props;

  const FetchVideoTaskList = () => {
    const apiObj = new FetchVideoTaskListAPI(videoDetails);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    FetchVideoTaskList();
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "user_email",
      label: "Assigned User",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    // {
    //   name: "description",
    //   label: "Description",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     align: "center",
    //     setCellHeaderProps: () => ({
    //       style: { height: "30px", fontSize: "16px", padding: "16px" },
    //     }),
    //   },
    // },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
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
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
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
