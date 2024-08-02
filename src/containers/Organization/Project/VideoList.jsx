import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { videoListColumns } from "config";
import { exportZip, getColumns, roles } from "utils";

//Themes
import { DatasetStyle } from "styles";
import { tableTheme } from "theme";

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
import {
  AlertComponent,
  CreateTaskDialog,
  DeleteDialog,
  ExportAllDialog,
  Loader,
  VideoDialog,
  VideoStatusTable,
} from "common";

//APIs
import {
  APITransport,
  BulkDownloadForVideoAPI,
  CreateNewTaskAPI,
  DeleteVideoAPI,
  FetchTranslationExportTypesAPI,
  setSnackBar,
} from "redux/actions";

const VideoList = ({ data, removeVideo }) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState([]);
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState(false);
  const [projectid, setprojectid] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [showCreateTaskBtn, setShowCreateTaskBtn] = useState(false);
  const [rows, setRows] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const [exportType, setExportType] = useState("srt");
  const [videoIdForDowload, setVideoIdForDowload] = useState("");
  const [videoName, setVideoName] = useState("");
  const [orgOwnerId, setOrgOwnerId] = useState("");

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const projectInfo = useSelector((state) => state.getProjectDetails.data);
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );
  const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);

  useEffect(() => {
    if (userData && userData.id) {
      const {
        organization: { organization_owners },
      } = userData;
  
      if (organization_owners && organization_owners?.length > 0) {
        const ownerIds = organization_owners.map(owner => owner.id);
        setOrgOwnerId(ownerIds);

        if (ownerIds.includes(userData.id)) {
          setIsUserOrgOwner(true);
        } else {
          setIsUserOrgOwner(false);
        }
      }
    }
  }, [userData]);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;

    if (!progress) {
      if (success) {
        switch (apiType) {
          case "DELETE_VIDEO":
            removeVideo();
            setOpenDialog(false);
            break;

          case "CREATE_NEW_TASk":
            if (isBulk) {
              dispatch(setSnackBar({ open: false }));
              setShowAlert(true);
              setAlertData(data);
            }
            break;

          case "BULK_VIDEO_DOWNLOAD":
            exportZip(data, "video", videoName);
            break;

          default:
            break;
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const handleVideoDialog = (item) => {
    setOpen(true);
    setCurrentVideoDetails([item]);
  };

  const handleDelete = async (id) => {
    const apiObj = new DeleteVideoAPI({ video_id: id });
    dispatch(APITransport(apiObj));
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

    const obj = new BulkDownloadForVideoAPI(videoIdForDowload, exportType);
    dispatch(APITransport(obj));
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
          isUserOrgOwner) && (
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
            isUserOrgOwner) && (
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
    dispatch(APITransport(apiObj));
    setOpenCreateTaskDialog(false);
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
          loading={apiStatus.loading}
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
          loading={apiStatus.loading}
        />
      )}

      {openDialog && (
        <DeleteDialog
          openDialog={openDialog}
          handleClose={() => setOpenDialog(false)}
          submit={() => handleDelete(projectid)}
          loading={apiStatus.loading}
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
