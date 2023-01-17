import React, { useState } from "react";
import { useSelector } from "react-redux";

//Themes
import { Box, ThemeProvider, Tooltip, IconButton, Button } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

//Components
import MUIDataTable from "mui-datatables";
import VideoDialog from "../../../common/VideoDialog";
import CreateTaskDialog from "../../../common/CreateTaskDialog";
import DatasetStyle from "../../../styles/Dataset";
import CustomizedSnackbars from "../../../common/Snackbar";
import Search from "../../../common/Search";
import Loader from "../../../common/Spinner";

//APIs
import CreateNewTaskAPI from "../../../redux/actions/api/Project/CreateTask";
import DeleteVideoAPI from "../../../redux/actions/api/Project/DeleteVideo";
import { roles } from "../../../utils/utils";
import DeleteDialog from "../../../common/DeleteDialog";
import VideoStatusTable from "../../../common/VideoStatusTable";
import AlertComponent from "../../../common/Alert";

const VideoList = ({ data, removeVideo }) => {
  const classes = DatasetStyle();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState([]);
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [projectid, setprojectid] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [showCreateTaskBtn, setShowCreateTaskBtn] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [alertType, setAlertType] = useState("");

  const SearchProject = useSelector((state) => state.searchList.data);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  
  const handleVideoDialog = (item) => {
    setOpen(true);
    setCurrentVideoDetails([item]);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleok = async (id) => {
    setLoading(true);
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
      setLoading(false);
      setOpenDialog(false);
      removeVideo();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
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
            item.name,
            item.url,
            item.duration,
            item.status,
            <>
              <Box sx={{ display: "flex" }}>
                {/* <Grid  item xs={12} sm={12} md={12} lg={6} xl={6}> */}

                <Tooltip title="View">
                  <IconButton onClick={() => handleVideoDialog(item)}>
                    <PreviewIcon color="primary" />
                  </IconButton>
                </Tooltip>

                {(projectInfo.managers.some((item) => item.id === userData.id) ||
                userData.role === "ORG_OWNER") && (
                  <Tooltip title="Create Task">
                    <IconButton
                      onClick={() => {
                        setOpenCreateTaskDialog(true);
                        setCurrentVideoDetails(item);
                        setIsBulk(false);
                      }}
                    >
                      <NoteAddIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )}

                {(projectInfo.managers.some((item) => item.id === userData.id) ||
                userData.role === "ORG_OWNER") && (
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteVideo(item.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </>,
          ];
        })
      : [];

  const createTaskHandler = async (data) => {
    const apiObj = new CreateNewTaskAPI(data);
    // dispatch(APITransport(apiObj));
    setLoading(true);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    console.log(resp);
    if (res.ok) {
      setShowAlert(true);
      setAlertData(resp);
      setLoading(false);
      setOpenCreateTaskDialog(false);
      setAlertType("pass");
    } else {
      setShowAlert(true);
      setAlertData(resp);
      setLoading(false);
      setOpenCreateTaskDialog(false);
      setAlertType("fail");
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
      name: "status",
      label: "Status",
      options: {
        display: "exclude",
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

  const handleRowClick = (_currentRow, allRow) => {
    const temp = data.filter((_item, index) => {
      return allRow.find((element) => element.index === index);
    });

    let temp2 = [];
    allRow.forEach((element) => {
      temp2.push(element.index);
    });

    setRows(temp2);
    setCurrentVideoDetails(temp);
    setShowCreateTaskBtn(!!temp.length);
  };

  const expandableTableHeader = [
    "Language Pair",
    "Created At",
    "Current Owner",
    "Status",
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
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: roles.filter((role) => role.value === userData?.role)[0]
      ?.showSelectCheckbox
      ? "multiple"
      : "none",
    search: false,
    jumpToPage: true,
    selectToolbarPlacement: "none",
    onRowSelectionChange: (currentRow, allRow) => {
      handleRowClick(currentRow, allRow);
    },
    rowsSelected: rows,
    expandableRows: true,
    renderExpandableRow: (rowData) => {
      return (
        <VideoStatusTable headers={expandableTableHeader} status={rowData[4]} />
      );
    },
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {roles.filter((role) => role.value === userData?.role)[0]
          ?.permittedToCreateTask &&
          showCreateTaskBtn && (
            <Button
              variant="contained"
              className={classes.createTaskBtn}
              onClick={() => {
                setOpenCreateTaskDialog(true);
                setIsBulk(true);
              }}
            >
              Create Task
            </Button>
          )}

        <Box sx={{ marginLeft: "auto" }}>
          <Search />
        </Box>
      </Box>

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
          isBulk={isBulk}
          loading={loading}
        />
      )}
      {renderSnackBar()}

      {openDialog && (
        <DeleteDialog
          openDialog={openDialog}
          handleClose={() => handleClose()}
          submit={() => handleok(projectid)}
          loading={loading}
          message={`Are you sure, you want to delete this video? All the associated tasks, will be deleted.`}
        />
      )}

      {showAlert && (
        <AlertComponent
          open={showAlert}
          data={alertData}
          onClose={() => setShowAlert(false)}
          alertType={alertType}
        />
      )}
    </>
  );
};

export default VideoList;
