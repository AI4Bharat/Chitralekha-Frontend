import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { roles } from "../../../utils/utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";

//Themes
import tableTheme from "../../../theme/tableTheme";
import DatasetStyle from "../../../styles/Dataset";

//Components
import {
  ThemeProvider,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Tooltip,
  IconButton,
  Button,
  DialogTitle,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import CustomButton from "../../../common/Button";
import CustomizedSnackbars from "../../../common/Snackbar";
import Search from "../../../common/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import UpdateBulkTaskDialog from "../../../common/UpdateBulkTaskDialog";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import Loader from "../../../common/Spinner";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PreviewDialog from "../../../common/PreviewDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";

//Apis
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import DeleteTaskAPI from "../../../redux/actions/api/Project/DeleteTask";
import ComparisionTableAPI from "../../../redux/actions/api/Project/ComparisonTable";
import exportTranscriptionAPI from "../../../redux/actions/api/Project/ExportTranscrip";
import EditBulkTaskDetailAPI from "../../../redux/actions/api/Project/EditBulkTaskDetails";
import EditTaskDetailAPI from "../../../redux/actions/api/Project/EditTaskDetails";
import exportTranslationAPI from "../../../redux/actions/api/Project/ExportTranslation";
import CompareTranscriptionSource from "../../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../../redux/actions/api/Project/SetComparisonTableData";
import clearComparisonTable from "../../../redux/actions/api/Project/ClearComparisonTable";
import FetchpreviewTaskAPI from "../../../redux/actions/api/Project/FetchPreviewTask";
import DeleteDialog from "../../../common/DeleteDialog";

const Transcription = ["srt", "vtt", "txt", "ytt"];
const Translation = ["srt", "vtt", "txt"];

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const location = useLocation();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [tasktype, setTasktype] = useState();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [exportTranscription, setExportTranscription] = useState("srt");
  const [exportTranslation, setexportTranslation] = useState("srt");
  const [taskdata, setTaskdata] = useState();
  const [deleteTaskid, setDeleteTaskid] = useState();
  const [showEditTaskBtn, setShowEditTaskBtn] = useState(false);
  const [rows, setRows] = useState([]);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);
  const [currentSelectedTasks, setCurrentSelectedTask] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [Previewdata, setPreviewdata] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteResponse, setDeleteResponse] = useState([]);

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const orgId = userData?.organization?.id;

  const FetchTaskList = () => {
    
    console.log("userData ----- ", userData);
    if (location.pathname === "/task-list") {
      const apiObj = new FetchTaskListAPI(orgId, true);
      dispatch(APITransport(apiObj));
    } else {
      const apiObj = new FetchTaskListAPI(projectId);
      dispatch(APITransport(apiObj));
    }
  };

  useEffect(()=>{
    if(orgId){
      FetchTaskList();
    }
  }, [orgId])

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId"); 
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);
  const SearchProject = useSelector((state) => state.searchList.data);
  // const PreviewTask = useSelector((state) => state.getPreviewTask.data);
  const projectInfo = useSelector((state) => state.getProjectDetails.data);

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenPreviewDialog(false);
  };

  const handleClickOpen = (id, tasttype) => {
    setOpen(true);
    setTaskdata(id);
    setTasktype(tasttype);
  };
  const handleok = async () => {
    const apiObj = new exportTranscriptionAPI(taskdata, exportTranscription);
    //dispatch(APITransport(apiObj));
    setOpen(false);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.blob();
    if (res.ok) {
      const task = taskList.filter((task) => task.id === taskdata)[0];
      const newBlob = new Blob([resp]);
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
        `Chitralekha_Video${task.video}_${YYYYMMDD}_${HHMMSS}_${task.src_language}.${exportTranscription}`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // clean up Url
      window.URL.revokeObjectURL(blobUrl);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleokTranslation = async () => {
    const apiObj = new exportTranslationAPI(taskdata, exportTranslation);
    //dispatch(APITransport(apiObj));
    setOpen(false);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.blob();
    if (res.ok) {
      const newBlob = new Blob([resp]);
      const blobUrl = window.URL.createObjectURL(newBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${taskdata}.${exportTranslation}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleClickRadioButton = (e) => {
    setExportTranscription(e.target.value);
  };
  const handleClickRadioButtonTranslation = (e) => {
    setexportTranslation(e.target.value);
  };

  const onTranslationTaskTypeSubmit = async (id, rsp_data) => {
    const payloadData = {
      type: Object.keys(rsp_data.payloads)[0],
      payload: {
        payload: rsp_data.payloads[Object.keys(rsp_data.payloads)[0]]?.payload,
      },
    };
    const comparisonTableObj = new ComparisionTableAPI(id, payloadData);
    dispatch(APITransport(comparisonTableObj));

    navigate(`/task/${id}/translate`);
  };

  const getTranscriptionSourceComparison = (id, source, isSubmitCall) => {
    const sourceTypeList = source.map((el) => {
      return el.toUpperCase().split(" ").join("_");
    });
    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    localStorage.setItem("sourceTypeList", JSON.stringify(sourceTypeList));
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      if (res.ok) {
        dispatch(setComparisonTable(rsp_data));
        if (isSubmitCall) {
          // --------------------- if task type is translation, submit translation with trg lang ------------- //
          await onTranslationTaskTypeSubmit(id, rsp_data);
        }
      } else {
        console.log("failed");
      }
    });
  };

  const handledeletetask = async (id, flag) => {
    setDeleteTaskid(id);
  };

  const handlePreviewTask = async (id, Task_type, Targetlanguage) => {
    setOpenPreviewDialog(true);
    const taskObj = new FetchpreviewTaskAPI(id, Task_type, Targetlanguage);
    //dispatch(APITransport(taskObj));
    const res = await fetch(taskObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(taskObj.getBody()),
      headers: taskObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setPreviewdata(resp);
    } else {
      setOpenPreviewDialog(false);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

    setLoading(true);
    const apiObj = new DeleteTaskAPI(id, flag);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "DELETE",
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
      setOpenDialog(false);
      setLoading(false);
      FetchTaskList();
    } else {
      setOpenDialog(true);
      setDeleteMsg(resp.message);
      setDeleteResponse(resp.response);
      setLoading(false);
    }
  };

  const handlePreviewTask = async (id, Task_type, Targetlanguage) => {
    setOpenPreviewDialog(true);
    const taskObj = new FetchpreviewTaskAPI(id, Task_type, Targetlanguage);
    //dispatch(APITransport(taskObj));
    const res = await fetch(taskObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(taskObj.getBody()),
      headers: taskObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setPreviewdata(resp);
    } else {
      setOpenPreviewDialog(false);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const renderViewButton = (tableData) => {
    return (
      tableData.rowData[9] === "SELECTED_SOURCE" &&
      tableData.rowData[1] !== "TRANSCRIPTION_REVIEW" &&
      tableData.rowData[1] !== "TRANSLATION_REVIEW" && (
        <Tooltip title="View">
          <IconButton
            onClick={() => {
              setOpenViewTaskDialog(true);
              setCurrentTaskDetails(tableData.rowData);
            }}
            disabled={!tableData.rowData[12]}
            color="primary"
          >
            <PreviewIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const renderExportButton = (tableData) => {
    return (
      tableData.rowData[9] === "COMPLETE" && (
        <Tooltip title="Export">
          <IconButton
            onClick={() =>
              handleClickOpen(tableData.rowData[0], tableData.rowData[1])
            }
            disabled={!tableData.rowData[12]}
            color="primary"
          >
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const renderEditButton = (tableData) => {
    return (
      (((tableData.rowData[9] === "SELECTED_SOURCE" ||
        tableData.rowData[9] === "INPROGRESS") &&
        (tableData.rowData[1] === "TRANSCRIPTION_EDIT" ||
          tableData.rowData[1] === "TRANSLATION_EDIT")) ||
        (tableData.rowData[9] !== "COMPLETE" &&
          (tableData.rowData[1] === "TRANSCRIPTION_REVIEW" ||
            tableData.rowData[1] === "TRANSLATION_REVIEW"))) && (
        <Tooltip title="Edit">
          <IconButton
            disabled={!tableData.rowData[12]}
            onClick={() => {
              if (
                tableData.rowData[1] === "TRANSCRIPTION_EDIT" ||
                tableData.rowData[1] === "TRANSCRIPTION_REVIEW"
              ) {
                navigate(`/task/${tableData.rowData[0]}/transcript`);
              } else {
                navigate(`/task/${tableData.rowData[0]}/translate`);
              }
            }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const renderDeleteButton = (tableData) => {
    return (
      <Tooltip title="Delete">
        <IconButton
          onClick={() => handledeletetask(tableData.rowData[0], false)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderUpdateTaskButton = (tableData) => {
    return (
      <Tooltip title="Edit Task Details">
        <IconButton
          onClick={() => {
            setSelectedTaskId(tableData.rowData[0]);
            setOpenEditTaskDialog(true);
            setIsBulk(false);
          }}
        >
          <AppRegistrationIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderPreviewButton = (tableData) => {
    return (
      tableData.rowData[9] === "COMPLETE" && (
        <Tooltip title="Preview">
          <IconButton
            onClick={() =>
              handlePreviewTask(
                tableData.rowData[11],
                tableData.rowData[1],
                tableData.rowData[7]
              )
            }
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const pageSearch = () => {
    return taskList.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.id.toString()?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.task_type?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.video_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.src_language?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.target_language?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.status?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const result =
    taskList && taskList.length > 0
      ? pageSearch().map((item, i) => {
        return [
          item.id,
          item.task_type,
          item.task_type_label,
          item.video_name,
          moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
          item.src_language,
          item.src_language_label,
          item.target_language,
          item.target_language_label,
          item.status,
          item.user,
          item.video,
          item.user?.username,
          item.project_name,
          item.is_active,
        ];
      })
      : [];
  const columns = [
    {
      name: "id",
      label: "#",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: "exclude",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
      },
    },
    {
      name: "task_type_label",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "task_type",
      label: "Task Type",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "video_name",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "src_language_label",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "src_language",
      label: "Source Language",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "target_language_label",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "target_language",
      label: "Target Language",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color: tableMeta.rowData[12] ? "" : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "user",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "is_active",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "username",
      label: "Assignee",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color:
                  tableMeta.rowData[11]
                    ? ""
                    : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
      },
    },
    {
      name: "project_name",
      label: "Project Name",
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box
              style={{
                color:
                  tableMeta.rowData[11]
                    ? ""
                    : "grey",
              }}
            >
              {value}
            </Box>
          );
        },
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
        customBodyRender: (value, tableMeta) => {
          return (
            <Box sx={{ display: "flex" }}>
              {(projectInfo.managers.some((item) => item.id === userData.id) ||
                userData.role === "ORG_OWNER") &&
                renderUpdateTaskButton(tableMeta)}

              {userData.id === tableMeta.rowData[10].id &&
                renderViewButton(tableMeta)}

              {userData.id === tableMeta.rowData[10].id &&
                renderEditButton(tableMeta)}

              {renderExportButton(tableMeta)}

              {renderPreviewButton(tableMeta)}

              {(projectInfo.managers.some((item) => item.id === userData.id) ||
                userData.role === "ORG_OWNER") &&
                renderDeleteButton(tableMeta)}
            </Box>
          );
        },
      },
    },
  ];

  const handleRowClick = (_currentRow, allRow) => {
    const temp = taskList.filter((_item, index) => {
      return allRow.find((element) => element.index === index);
    });

    let temp2 = [];
    allRow.forEach((element) => {
      temp2.push(element.index);
    });

    setCurrentSelectedTask(temp);
    setRows(temp2);
    setShowEditTaskBtn(!!temp.length);
  };

  const renderToolBar = () => {
    return (
      <Box className={classes.searchStyle}>
        <Search />
      </Box>
    );
  };

  const options = {
    textLabels: {
      body: {
        noMatch: apiStatus.progress ? <Loader /> : "No tasks assigned to you",
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
    selectableRows: roles.filter((role) => role.value === userData?.role)[0]
      ?.showSelectCheckbox
      ? "multiple"
      : "none",
    search: false,
    jumpToPage: true,
    selectToolbarPlacement: "none",
    rowsSelected: rows,
    customToolbar: renderToolBar,
    onRowSelectionChange: (currentRow, allRow) => {
      handleRowClick(currentRow, allRow);
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

  const renderDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
        <DialogTitle variant="h4">Export Subtitle</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
            {tasktype === "TRANSCRIPTION_EDIT" ||
              tasktype === "TRANSCRIPTION_REVIEW"
              ? "Transcription"
              : "Translation"}
          </DialogContentText>
          {tasktype === "TRANSCRIPTION_EDIT" ||
            tasktype === "TRANSCRIPTION_REVIEW" ? (
            <DialogActions sx={{ mr: 10, mb: 1, mt: 1 }}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  {Transcription?.map((item, index) => (
                    <FormControlLabel
                      value={item}
                      control={<Radio />}
                      checked={exportTranscription === item}
                      label={item}
                      onClick={handleClickRadioButton}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogActions>
          ) : (
            <DialogActions sx={{ mr: 17, mb: 1, mt: 1 }}>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  {Translation?.map((item, index) => (
                    <FormControlLabel
                      value={item}
                      control={<Radio />}
                      checked={exportTranslation === item}
                      label={item}
                      onClick={handleClickRadioButtonTranslation}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogActions>
          )}
          <DialogActions>
            <CustomButton
              buttonVariant="standard"
              onClick={handleClose}
              label="Cancel"
            />
            {tasktype === "TRANSCRIPTION_EDIT" ||
            tasktype === "TRANSCRIPTION_REVIEW" ? (
              <CustomButton
                buttonVariant="contained"
                onClick={handleok}
                label="Export"
                style={{ borderRadius: "8px" }}
                autoFocus
              />
            ) : (
              <CustomButton
                onClick={handleokTranslation}
                label="Export"
                buttonVariant="contained"
                style={{ borderRadius: "8px" }}
                autoFocus
              />
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  };

  const handleUpdateTask = async (data) => {
    setLoading(true);

    const body = {
      task_ids: currentSelectedTasks.map((item) => item.id),
      user: data.user.id,
      description: data.description,
      eta: data.date,
      priority: data.priority,
    };

    let userObj;
    if (isBulk) {
      userObj = new EditBulkTaskDetailAPI(body);
    } else {
      userObj = new EditTaskDetailAPI(body, selectedTaskId);
    }

    const res = await fetch(userObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(userObj.getBody()),
      headers: userObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      FetchTaskList();
      setLoading(false);
      setOpenEditTaskDialog(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
      setLoading(false);
      setOpenEditTaskDialog(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {roles.filter((role) => role.value === userData?.role)[0]
          ?.permittedToCreateTask &&
          showEditTaskBtn && (
            <Button
              variant="contained"
              className={classes.createTaskBtn}
              onClick={() => {
                setOpenEditTaskDialog(true);
                setIsBulk(true);
              }}
            >
              Edit Tasks
            </Button>
          )}    
      </Box>

      <Grid>{renderSnackBar()}</Grid>

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={result} columns={columns} options={options} />
      </ThemeProvider>

      {openViewTaskDialog && (
        <ViewTaskDialog
          open={openViewTaskDialog}
          handleClose={() => setOpenViewTaskDialog(false)}
          compareHandler={(id, source, isSubmitCall) => {
            dispatch(clearComparisonTable());
            localStorage.setItem("sourceId", id);
            if (source.length)
              getTranscriptionSourceComparison(id, source, isSubmitCall);
            !isSubmitCall && navigate(`/comparison-table/${id}`);
          }}
          // submitHandler={({id, source}) => {

          // }}
          id={currentTaskDetails[0]}
        />
      )}
      {renderDialog()}

      {openDialog && (
        <DeleteDialog
          openDialog={openDialog}
          handleClose={() => handleCloseDialog()}
          submit={() => handledeletetask(deleteTaskid, true)}
          loading={loading}
          message={deleteMsg}
          deleteResponse={deleteResponse}
        />
      )}

      {openEditTaskDialog && (
        <UpdateBulkTaskDialog
          open={openEditTaskDialog}
          handleUserDialogClose={() => setOpenEditTaskDialog(false)}
          handleUpdateTask={(data) => handleUpdateTask(data)}
          currentSelectedTasks={currentSelectedTasks}
          selectedTaskId={selectedTaskId}
          loading={loading}
          isBulk={isBulk}
        />
      )}

      {openPreviewDialog && (
        <PreviewDialog
          openPreviewDialog={openPreviewDialog}
          handleClose={() => handleCloseDialog()}
          data={Previewdata}
        />
      )}
    </>
  );
};

export default TaskList;
