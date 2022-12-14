import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Themes
import {
  Box,
  Grid,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  IconButton,
  DialogContentText,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

//Components
import CustomButton from "../../../common/Button";
import MUIDataTable from "mui-datatables";
import VideoDialog from "../../../common/VideoDialog";
import CreateTaskDialog from "../../../common/CreateTaskDialog";
import DatasetStyle from "../../../styles/Dataset";
import CustomizedSnackbars from "../../../common/Snackbar";
import Search from "../../../common/Search";

//APIs
import CreateNewTaskAPI from "../../../redux/actions/api/Project/CreateTask";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import DeleteVideoAPI from "../../../redux/actions/api/Project/DeleteVideo";
import { roles } from "../../../utils/utils";

const VideoList = ({ data, removeVideo }) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();

  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState({});
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [projectid, setprojectid] = useState([]);
  const SearchProject = useSelector((state) => state.searchList.data);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

  const handleVideoDialog = (item) => {
    setOpen(true);
    setCurrentVideoDetails(item);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleok = async (id) => {
    setOpenDialog(false);
    const apiObj = new DeleteVideoAPI({ video_id: id });
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      removeVideo();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleDeleteVideo = (id) => {
    setOpenDialog(true);
    setprojectid(id);
  };

  const pageSearch = () => {
    return data.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.id.toString()?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (el.url?.toLowerCase().includes(SearchProject?.toLowerCase())) {
        return el;
      } else if (
        el.name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const result =
    data && data.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.id,
            item.project_id,
            item.name,
            item.url,
            item.duration,
            <>
              <Box sx={{ display: "flex" }}>
                {/* <Grid  item xs={12} sm={12} md={12} lg={6} xl={6}> */}

                <Tooltip title="View">
                  <IconButton>
                    <PreviewIcon
                      color="primary"
                      onClick={() => handleVideoDialog(item)}
                    />
                  </IconButton>
                </Tooltip>

                {roles.filter((role) => role.value === userData?.role)[0]
                  ?.permittedToCreateTask && (
                  <Tooltip title="Create Task">
                    <IconButton>
                      <NoteAddIcon
                        color="primary"
                        onClick={() => {
                          setOpenCreateTaskDialog(true);
                          setCurrentVideoDetails(item);
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}

                {roles.filter((role) => role.value === userData?.role)[0]
                  ?.permittedToDeleteVideoAudio && (
                  <Tooltip title="Delete">
                    <IconButton>
                      <DeleteIcon
                        color="error"
                        onClick={() => handleDeleteVideo(item.id)}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </>,
          ];
        })
      : [];

  //setTableData(result);

  const createTaskHandler = async (data) => {
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
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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

  const renderDialog = () => {
    return (
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure, you want to delete this video? All the associated
            tasks will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleClose} label="Cancel" />
          <CustomButton
            onClick={() => handleok(projectid)}
            label="Ok"
            autoFocus
          />
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      <Search />
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={result} columns={columns} options={options} />
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
      {renderDialog()}
    </>
  );
};

export default VideoList;
