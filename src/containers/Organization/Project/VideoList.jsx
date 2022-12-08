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
import CustomizedSnackbars from "../../../common/Snackbar";

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
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

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

  const createTaskHandler = async(data) => {
    const apiObj = new CreateNewTaskAPI(data);
   // dispatch(APITransport(apiObj));
    setOpenCreateTaskDialog(false);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  };

  const columns = [
    {
      name: "id",
      label: "Video Id",
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
      label: "Video Name",
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
      label: "Actions",
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
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
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
       {renderSnackBar()}
    </>
  );
};

export default VideoList;
