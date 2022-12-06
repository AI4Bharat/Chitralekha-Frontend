import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

//Themes
import { Box, Grid, ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import CustomButton from "../../../common/Button";
import MUIDataTable from "mui-datatables";
import VideoDialog from "../../../common/VideoDialog";
import CreateTaskDialog from "../../../common/CreateTaskDialog";
import DatasetStyle from "../../../styles/Dataset";

//APIs
import CreateNewTaskAPI from "../../../redux/actions/api/Project/CreateTask";
import APITransport from "../../../redux/actions/apitransport/apitransport";

const VideoList = ({ data }) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();

  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState({});
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);

  const handleVideoDialog = (item) => {
    setOpen(true);
    setCurrentVideoDetails(item);
  };

  useEffect(() => {
    const result = data.map((item) => {
      return [
        item.id,
        item.project_id,
        item.name,
        item.url,
        item.duration,
        <>
        <Box sx={{display: "flex"}}>
        {/* <Grid  item xs={12} sm={12} md={12} lg={6} xl={6}> */}
        <CustomButton
        className={classes.tableButton}
            label="View"
            onClick={() => handleVideoDialog(item)}
          />
           {/* </Grid> */}
           {/* <Grid  item xs={12} sm={12} md={12} lg={6} xl={6}> */}
          <CustomButton
           className={classes.tableButton}
            label="Create Task"
            onClick={() => {
              setOpenCreateTaskDialog(true);
              setCurrentVideoDetails(item);
            }}
          />
         {/* </Grid> */}
        </Box>
         
        </>,
      ];
    });

    setTableData(result);
  }, [data]);

  const createTaskHandler = (data) => {
    const apiObj = new CreateNewTaskAPI(data);
    dispatch(APITransport(apiObj));
    setOpenCreateTaskDialog(false);
  };

  const columns = [
    {
      name: "id",
      label: "Id",
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
      name: "projectId",
      label: "Project Id",
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
      name: "name",
      label: "Name",
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
      name: "url",
      label: "URL",
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
      name: "duration",
      label: "Duration",
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
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px", textAlign: "center" },
        }),
      },
    },
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
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={tableData} columns={columns} options={options} />
      </ThemeProvider>

      {open && (
        <VideoDialog
          open={open}
          handleClose={() => setOpen(false)}
          videoDetails={currentVideoDetails}
        />
      )}

      {openCreateTaskDialog && (
        <CreateTaskDialog
          open={openCreateTaskDialog}
          handleUserDialogClose={() => setOpenCreateTaskDialog(false)}
          createTaskHandler={createTaskHandler}
          videoDetails={currentVideoDetails}
        />
      )}
    </>
  );
};

export default VideoList;
