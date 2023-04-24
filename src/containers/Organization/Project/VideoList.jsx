import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { roles } from "../../../utils/utils";
import { getColumns } from "../../../utils/tableUtils";
import { videoListColumns } from "../../../config/tableColumns";

//Themes
import DatasetStyle from "../../../styles/datasetStyle";
import tableTheme from "../../../theme/tableTheme";

//Icons
import FileDownload from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

//Components
import {
  Box,
  ThemeProvider,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import VideoDialog from "../../../common/VideoDialog";
import CreateTaskDialog from "../../../common/CreateTaskDialog";
import CustomizedSnackbars from "../../../common/Snackbar";
import Loader from "../../../common/Spinner";
import DeleteDialog from "../../../common/DeleteDialog";
import VideoStatusTable from "../../../common/VideoStatusTable";
import AlertComponent from "../../../common/Alert";

//APIs
import CreateNewTaskAPI from "../../../redux/actions/api/Project/CreateTask";
import DeleteVideoAPI from "../../../redux/actions/api/Project/DeleteVideo";
import ExportAllDialog from "../../../common/ExportAllDialog";
import FetchTranslationExportTypesAPI from "../../../redux/actions/api/Project/FetchTranslationExportTypes";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import BulkDownloadForVideoAPI from "../../../redux/actions/api/Project/BulkDownloadForVideo";

const VideoList = ({ data, removeVideo }) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

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
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportType, setExportType] = useState("srt");
  const [videoIdForDowload, setVideoIdForDowload] = useState("");
  const [videoName, setVideoName] = useState("");

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );

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

  useEffect(() => {
    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));

    // eslint-disable-next-line
  }, []);

  const handleDownloadAll = (item) => {
    setVideoName(item.name);
    setVideoIdForDowload(item.id);
    setOpenExportDialog(true);
  };

  const handleDownload = async () => {
    setOpenExportDialog(false);
    setLoading(true);

    const obj = new BulkDownloadForVideoAPI(videoIdForDowload, exportType);
    const res = await fetch(obj.apiEndPoint(), {
      method: "GET",
      headers: obj.getHeaders().headers,
    });
    const resp = await res.blob();
    if (res.ok) {
      //  const resp = await res.blob();
      const newBlob = new Blob([resp], { type: "application/zip" });

      const blobUrl = window.URL.createObjectURL(newBlob);

      const link = document.createElement("a");
      link.href = blobUrl;

      const date = new Date();
      const YYYYMMDD = date
        .toLocaleDateString("en-GB")
        .split("/")
        .reverse()
        .join("");

      const HHMMSS = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

      link.setAttribute(
        "download",
        `Chitralekha_Video_${videoName}_${YYYYMMDD}_${HHMMSS}.zip`
      );

      document.body.appendChild(link);

      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setLoading(false);
    } else {
      //const resp = await res.json();

      setLoading(false);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const result = data?.map((item, i) => {
    return [
      item.id,
      item.name,
      item.url,
      item.duration,
      item.status,
      item.description,
      <>
        <Box sx={{ display: "flex" }}>
          {/* <Grid  item xs={12} sm={12} md={12} lg={6} xl={6}> */}

          <Tooltip title="Download Related Tasks">
            <IconButton onClick={() => handleDownloadAll(item)}>
              <FileDownload color="primary" />
            </IconButton>
          </Tooltip>

          <Tooltip title="View">
            <IconButton onClick={() => handleVideoDialog(item)}>
              <PreviewIcon color="primary" />
            </IconButton>
          </Tooltip>

          {(projectInfo?.managers?.some((item) => item.id === userData.id) ||
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

          {(projectInfo.managers?.some((item) => item.id === userData.id) ||
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
  });

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

    if (res.ok) {
      setLoading(false);
      setOpenCreateTaskDialog(false);

      if (isBulk) {
        setShowAlert(true);
        setAlertData(resp);
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      }
    } else {
      setLoading(false);
      setOpenCreateTaskDialog(false);
      if (isBulk) {
        setShowAlert(true);
        setAlertData(resp);
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    }
  };

  const handleRowClick = (_currentRow, allRow) => {
    const temp = data.filter((_item, index) => {
      return allRow.find((element) => element.index === index);
    });

    let temp2 = [];
    allRow.forEach((element) => {
      temp2.push(element.dataIndex);
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

  const toolBarActions = [
    {
      title: "Bulk Task Creation",
      icon: <NoteAddIcon />,
      onClick: () => {
        setOpenCreateTaskDialog(true);
        setIsBulk(true);
      },
      style: { marginRight: "auto" },
    },
    // {
    //   title: "Bulk Delete",
    //   icon: <DeleteIcon />,
    //   onClick: () => {},
    //   style: { backgroundColor: "red", marginRight: "auto" },
    // },
  ];

  const renderToolBar = () => {
    return (
      <div style={{ display: "inline", verticalAlign: "middle" }}>
        {roles.filter((role) => role.value === userData?.role)[0]
          ?.permittedToCreateTask &&
          showCreateTaskBtn && (
            <Divider
              orientation="vertical"
              sx={{
                display: "inline",
                margin: "0 10px",
                borderColor: "rgba(0, 0, 0, 0.54)",
              }}
            />
          )}

        {roles.filter((role) => role.value === userData?.role)[0]
          ?.permittedToCreateTask &&
          showCreateTaskBtn &&
          toolBarActions.map((item, index) => {
            return (
              <Tooltip key={index} title={item.title} placement="bottom">
                <IconButton
                  className={classes.createTaskBtn}
                  onClick={item.onClick}
                  style={item.style}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            );
          })}
      </div>
    );
  };

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
    search: true,
    download: true,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: roles.filter((role) => role.value === userData?.role)[0]
      ?.showSelectCheckbox
      ? "multiple"
      : "none",

    jumpToPage: true,
    customToolbar: renderToolBar,
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
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={result}
          columns={getColumns(videoListColumns)}
          options={options}
        />
      </ThemeProvider>

      {openExportDialog && (
        <ExportAllDialog
          open={openExportDialog}
          handleClose={() => setOpenExportDialog(false)}
          exportOptions={translationExportTypes}
          exportType={exportType}
          handleExportRadioButton={setExportType}
          handleExport={() => handleDownload()}
          loading={loading}
        />
      )}

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
          onClose={() => setShowAlert(false)}
          message={alertData.message}
          report={alertData?.response?.detailed_report}
        />
      )}
    </>
  );
};

export default VideoList;
