import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { filterTaskList, getDateTime, roles } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { getColumns, getOptions } from "../../../utils/tableUtils";
import { taskListColumns } from "../../../config/tableColumns";
import { buttonConfig, toolBarActions } from "../../../config/projectConfigs";

//Themes
import tableTheme from "../../../theme/tableTheme";
import DatasetStyle from "../../../styles/datasetStyle";
import TableStyles from "../../../styles/tableStyles";

//Components
import {
  ThemeProvider,
  Box,
  Grid,
  Tooltip,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import CustomizedSnackbars from "../../../common/Snackbar";
import UpdateBulkTaskDialog from "../../../common/UpdateBulkTaskDialog";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import PreviewDialog from "../../../common/PreviewDialog";
import FilterList from "../../../common/FilterList";
import DeleteDialog from "../../../common/DeleteDialog";
import ExportDialog from "../../../common/ExportDialog";
import UploadAlertComponent from "../../../common/UploadAlertComponent";
import UploadFormatDialog from "../../../common/UploadFormatDialog";
import SpeakerInfoDialog from "../../../common/SpeakerInfoDialog";

//Icons
import FilterListIcon from "@mui/icons-material/FilterList";

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
import FetchTranscriptExportTypesAPI from "../../../redux/actions/api/Project/FetchTranscriptExportTypes";
import FetchTranslationExportTypesAPI from "../../../redux/actions/api/Project/FetchTranslationExportTypes";
import DeleteBulkTaskAPI from "../../../redux/actions/api/Project/DeleteBulkTask";
import GenerateTranslationOutputAPI from "../../../redux/actions/api/Project/GenerateTranslationOutput";
import BulkTaskExportAPI from "../../../redux/actions/api/Project/BulkTaskDownload";
import ExportVoiceoverTaskAPI from "../../../redux/actions/api/Project/ExportVoiceoverTask";
import UploadToYoutubeAPI from "../../../redux/actions/api/Project/UploadToYoutube";
import constants from "../../../redux/constants";

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Styles
  const classes = DatasetStyle();
  const tableClasses = TableStyles();

  //Table States
  const [tableData, setTableData] = useState([]);
  const [options, setOptions] = useState();
  const [rows, setRows] = useState([]);

  //Filter States
  const [srcLanguageList, setSrcLanguageList] = useState([]);
  const [tgtLanguageList, setTgtLanguageList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    taskType: [],
    srcLanguage: [],
    tgtLanguage: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteResponse, setDeleteResponse] = useState([]);

  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const [previewData, setPreviewData] = useState([]);
  const [currentSelectedTasks, setCurrentSelectedTasks] = useState([]);
  const [uploadTaskRowIndex, setUploadTaskRowIndex] = useState("");

  //Dialogs
  const [openDialogs, setOpenDialogs] = useState({
    exportDialog: false,
    deleteDialog: false,
    viewTaskDialog: false,
    previewDialog: false,
    editTaskDialog: false,
    uploadDialog: false,
    speakerInfoDialog: false,
  });

  //Bulk Opertaion States
  const [isBulk, setIsBulk] = useState(false);
  const [isBulkTaskDelete, setIsBulkTaskDelete] = useState(false);
  const [isBulkTaskDownload, setIsBulkTaskDownload] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBulkTaskid, setSelectedBulkTaskId] = useState([]);
  const [showEditTaskBtn, setShowEditTaskBtn] = useState(false);
  const [bulkSubtitleAlert, setBulkSubtitleAlert] = useState(false);
  const [bulkSubtitleAlertData, setBulkSubtitleAlertData] = useState({});

  const [exportTranscription, setExportTranscription] = useState("srt");
  const [exportTranslation, setExportTranslation] = useState("srt");
  const [uploadExportType, setUploadExportType] = useState("srt");

  //Data from Redux
  const {
    tasks_list: taskList,
    src_languages_list: sourceLanguagesList,
    target_languages_list: targetlanguagesList,
  } = useSelector((state) => state.getTaskList.data);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const transcriptExportTypes = useSelector(
    (state) => state.getTranscriptExportTypes.data.export_types
  );
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );

  const fetchTaskList = () => {
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");

    const transcriptExportObj = new FetchTranscriptExportTypesAPI();
    dispatch(APITransport(transcriptExportObj));

    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));

    fetchTaskList();

    return () => {
      dispatch({ type: constants.CLEAR_PROJECT_TASK_LIST, payload: [] });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (taskList) {
      setLoading(false);
      setTableData(taskList);
      setSrcLanguageList(sourceLanguagesList);
      setTgtLanguageList(targetlanguagesList);
    }
  }, [taskList, sourceLanguagesList, targetlanguagesList]);

  useEffect(() => {
    const option = getOptions(loading);

    const newOptions = {
      ...option,
      selectableRows: roles.filter((role) => role.value === userData?.role)[0]
        ?.showSelectCheckbox
        ? "multiple"
        : "none",
      search: true,
      jumpToPage: true,
      selectToolbarPlacement: "none",
      rowsSelected: rows,
      customToolbar: renderToolBar,
      onRowSelectionChange: (currentRow, allRow) => {
        handleRowClick(currentRow, allRow);
      },
    };

    setOptions(newOptions);

    // eslint-disable-next-line
  }, [loading, rows]);

  const filterData = () => {
    const filterResult = filterTaskList(taskList, selectedFilters);

    if (filterResult) {
      setSelectedBulkTaskId("");
      setRows([]);
      setShowEditTaskBtn(false);
      setTableData(filterResult);
    }
  };

  useMemo(() => {
    filterData();
    // eslint-disable-next-line
  }, [selectedFilters]);

  const exportVoiceoverTask = async (id) => {
    const apiObj = new ExportVoiceoverTaskAPI(id);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        const task = taskList.filter((task) => task.id === id)[0];

        const link = document.createElement("a");
        link.href = resp.azure_url;

        link.setAttribute(
          "download",
          `Chitralekha_Video_${task.video_name}_${getDateTime()}_${
            task.target_language
          }.mp4`
        );

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    }
  };

  const handleExportButtonClick = (id, taskType) => {
    if (taskType.includes("VOICEOVER")) {
      exportVoiceoverTask(id);
    } else {
      handleDialogOpen("exportDialog");
      setIsBulkTaskDownload(false);
    }
  };

  const handleTranscriptExport = async () => {
    const { id: taskId } = currentTaskDetails;

    const apiObj = new exportTranscriptionAPI(taskId, exportTranscription);
    handleDialogClose("exportDialog");

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.blob();

      if (res.ok) {
        const task = taskList.filter((task) => task.id === taskId)[0];

        let newBlob;
        if (exportTranscription === "docx") {
          newBlob = new Blob([resp], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
        } else {
          newBlob = new Blob([resp]);
        }

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
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    }
  };

  const handleTranslationExport = async () => {
    const { id: taskId } = currentTaskDetails;

    const apiObj = new exportTranslationAPI(taskId, exportTranslation);
    handleDialogClose("exportDialog");

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.blob();

      if (res.ok) {
        const task = taskList.tasks_list.filter(
          (task) => task.id === taskId
        )[0];

        let newBlob;
        if (exportTranscription === "docx") {
          newBlob = new Blob([resp], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
        } else {
          newBlob = new Blob([resp]);
        }

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
          `Chitralekha_Video${task.video}_${YYYYMMDD}_${HHMMSS}_${task.target_language}.${exportTranslation}`
        );
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
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    }
  };

  const handleTranscriptRadioButton = (e) => {
    setExportTranscription(e.target.value);
  };

  const handleTranslationRadioButton = (e) => {
    setExportTranslation(e.target.value);
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

  const getTranscriptionSourceComparison = async (id, source, isSubmitCall) => {
    const sourceTypeList = source.map((el) => {
      return el.toUpperCase().split(" ").join("_");
    });

    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    localStorage.setItem("sourceTypeList", JSON.stringify(sourceTypeList));

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "post",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        dispatch(setComparisonTable(resp));
        if (isSubmitCall) {
          // --------------------- if task type is translation, submit translation with trg lang ------------- //
          await onTranslationTaskTypeSubmit(id, resp);
        }
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    }
  };

  const handleDeleteTask = async (id, flag) => {
    setLoading(true);
    setIsBulkTaskDelete(false);

    const apiObj = new DeleteTaskAPI(id, flag);

    try {
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
        handleDialogClose("deleteDialog");
        fetchTaskList();
      } else {
        handleDialogOpen("deleteDialog");
        setDeleteMsg(resp.message);
        setDeleteResponse(resp.response);
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewTask = async (videoId, taskType, targetlanguage) => {
    setPreviewData([]);
    handleDialogOpen("previewDialog");

    const taskObj = new FetchpreviewTaskAPI(videoId, taskType, targetlanguage);

    try {
      const res = await fetch(taskObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(taskObj.getBody()),
        headers: taskObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        setPreviewData(resp.data.payload);
      } else {
        handleDialogClose("previewDialog");
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTranslationCall = async (id, taskStatus) => {
    if (taskStatus === "SELECTED_SOURCE") {
      const apiObj = new GenerateTranslationOutputAPI(id);

      try {
        const res = await fetch(apiObj.apiEndPoint(), {
          method: "POST",
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers,
        });

        const resp = await res.json();

        if (res.ok) {
          navigate(`/task/${id}/translate`);
        } else {
          setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
          });
        }
      } catch (error) {
        setSnackbarInfo({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        });
      }
    } else {
      navigate(`/task/${id}/translate`);
    }
  };

  const handleUploadSubtitle = async (id, rowIndex, exportType = "srt") => {
    handleDialogClose("uploadDialog");

    const loadingArray = [...uploadLoading];
    loadingArray[rowIndex] = true;
    setUploadLoading(loadingArray);

    const apiObj = new UploadToYoutubeAPI(id, exportType);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      const resp = await res.json();

      if (res.ok) {
        setBulkSubtitleAlert(true);
        setBulkSubtitleAlertData(resp);
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      loadingArray[rowIndex] = false;
      setUploadLoading(loadingArray);
    }
  };

  const handleOpenSubtitleUploadDialog = (rowIndex) => {
    handleDialogOpen("uploadDialog");
    setUploadTaskRowIndex(rowIndex);
  };

  const handleActionButtonClick = (tableMeta, action) => {
    const { tableData: data, rowIndex } = tableMeta;
    const selectedTask = data[rowIndex];

    const { id, task_type, status, video, target_language } = selectedTask;
    setCurrentTaskDetails(selectedTask);

    switch (action) {
      case "Upload":
        if (task_type.includes("TRANSCRIPTION")) {
          handleOpenSubtitleUploadDialog(rowIndex);
        } else {
          handleUploadSubtitle([id], rowIndex);
        }
        break;

      case "Update":
        setIsBulk(false);
        handleDialogOpen("editTaskDialog");
        break;

      case "View":
        handleDialogOpen("viewTaskDialog");
        break;

      case "Edit":
        if (task_type.includes("TRANSCRIPTION")) {
          navigate(`/task/${id}/transcript`);
        } else if (task_type.includes("TRANSLATION")) {
          generateTranslationCall(id, status);
        } else {
          navigate(`/task/${id}/voiceover`);
        }
        break;

      case "Edit-Speaker":
        handleDialogOpen("speakerInfoDialog");
        break;

      case "Export":
        handleExportButtonClick(id, task_type);
        break;

      case "Preview":
        handlePreviewTask(video, task_type, target_language);
        break;

      case "Delete":
        handleDeleteTask(id, false);
        break;

      default:
        break;
    }
  };

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      setCellHeaderProps: () => ({
        className: tableClasses.cellHeaderProps,
      }),
      customBodyRender: (_value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedTask = data[rowIndex];

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {buttonConfig.map((item) => {
              return (
                <Tooltip key={item.key} title={item.title}>
                  <IconButton
                    onClick={() => handleActionButtonClick(tableMeta, item.key)}
                    color={item.color}
                    sx={{
                      display: selectedTask.buttons?.[item.key] ? "" : "none",
                    }}
                    disabled={
                      item.key === "Edit" ? !selectedTask.is_active : false
                    }
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              );
            })}
          </Box>
        );
      },
    },
  };

  const columns = [...getColumns(taskListColumns), actionColumn];

  const handleRowClick = (_currentRow, allRow) => {
    const temp = tableData?.filter((_item, index) => {
      return allRow.find((element) => element.index === index);
    });

    let temp2 = [];
    allRow.forEach((element) => {
      temp2.push(element.dataIndex);
    });

    const taskIds = temp.map((item) => item.id);
    let temp3 = taskIds.join();

    setSelectedBulkTaskId(temp3);
    setCurrentSelectedTasks(temp);
    setRows(temp2);
    setShowEditTaskBtn(!!temp.length);
  };

  const handleBulkDelete = async (taskIds, flag) => {
    setLoading(true);
    setIsBulkTaskDelete(true);

    const apiObj = new DeleteBulkTaskAPI(flag, taskIds);

    try {
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
        handleDialogClose("deleteDialog");

        setRows([]);
        setShowEditTaskBtn(false);
        fetchTaskList();
      } else {
        handleDialogOpen("deleteDialog");
        setDeleteMsg(resp.message);
        setDeleteResponse(resp.error_report);
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTaskDownload = async () => {
    handleDialogClose("exportDialog");

    const apiObj = new BulkTaskExportAPI(exportTranslation, selectedBulkTaskid);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();
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
          `Chitralekha_Tasks_${YYYYMMDD}_${HHMMSS}.zip`
        );

        document.body.appendChild(link);

        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        const resp = await res.json();

        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToolbarButtonClick = (key) => {
    switch (key) {
      case "bulkTaskUpdate":
        handleDialogOpen("editTaskDialog");
        setIsBulk(true);
        break;

      case "bulkTaskDelete":
        const taskIds = currentSelectedTasks.map((item) => item.id);
        handleBulkDelete(taskIds, false);
        break;

      case "bulkTaskDownload":
        handleDialogOpen("exportDialog");
        setIsBulkTaskDownload(true);
        break;

      case "bulkTaskUpload":
        handleUploadSubtitle(selectedBulkTaskid.split(","));
        break;

      default:
        break;
    }
  };

  const renderToolBar = () => {
    return (
      <>
        <Button
          style={{ minWidth: "25px" }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Tooltip title={"Filter Table"}>
            <FilterListIcon sx={{ color: "#515A5A" }} />
          </Tooltip>
        </Button>

        <div style={{ display: "inline", verticalAlign: "middle" }}>
          {roles.filter((role) => role.value === userData?.role)[0]
            ?.permittedToCreateTask &&
            showEditTaskBtn && (
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
            showEditTaskBtn &&
            toolBarActions.map((item) => {
              return (
                <Tooltip key={item.key} title={item.title} placement="bottom">
                  <IconButton
                    className={classes.createTaskBtn}
                    onClick={() => handleToolbarButtonClick(item.key)}
                    style={item.style}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              );
            })}
        </div>
      </>
    );
  };

  const renderSnackBar = useCallback(() => {
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
  }, [snackbar]);

  const handleUpdateTask = async (data) => {
    const { id: taskId } = currentTaskDetails;
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
      userObj = new EditTaskDetailAPI(body, taskId);
    }

    try {
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
        fetchTaskList();
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: "Something went wrong!!",
        variant: "error",
      });
    } finally {
      setLoading(false);
      handleDialogClose("editTaskDialog");
    }
  };

  const handleDeleteSubmit = () => {
    if (isBulkTaskDelete) {
      handleBulkDelete(currentTaskDetails?.id, true);
    } else {
      handleDeleteTask(currentTaskDetails?.id, true);
    }
  };

  const handleDialogClose = (key) => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const handleDialogOpen = (key) => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [key]: true,
    }));
  };

  return (
    <>
      <Grid>{renderSnackBar()}</Grid>

      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={tableData} columns={columns} options={options} />
      </ThemeProvider>

      {openDialogs.viewTaskDialog && (
        <ViewTaskDialog
          open={openDialogs.viewTaskDialog}
          handleClose={() => handleDialogClose("viewTaskDialog")}
          compareHandler={(id, source, isSubmitCall) => {
            dispatch(clearComparisonTable());
            localStorage.setItem("sourceId", id);
            if (source.length)
              getTranscriptionSourceComparison(id, source, isSubmitCall);
            !isSubmitCall && navigate(`/comparison-table/${id}`);
          }}
          id={currentTaskDetails?.id}
          snackbar={snackbar}
          setSnackbarInfo={setSnackbarInfo}
          fetchTaskList={fetchTaskList}
        />
      )}

      {openDialogs.exportDialog && (
        <ExportDialog
          open={openDialogs.exportDialog}
          handleClose={() => handleDialogClose("exportDialog")}
          taskType={currentTaskDetails?.task_type}
          handleTranscriptRadioButton={handleTranscriptRadioButton}
          handleTranslationRadioButton={handleTranslationRadioButton}
          handleTranscriptExport={handleTranscriptExport}
          handleTranslationExport={handleTranslationExport}
          exportTranscription={exportTranscription}
          exportTranslation={exportTranslation}
          transcriptionOptions={transcriptExportTypes}
          translationOptions={translationExportTypes}
          isBulkTaskDownload={isBulkTaskDownload}
          handleBulkTaskDownload={handleBulkTaskDownload}
        />
      )}

      {openDialogs.deleteDialog && (
        <DeleteDialog
          openDialog={openDialogs.deleteDialog}
          handleClose={() => handleDialogClose("deleteDialog")}
          submit={() => handleDeleteSubmit()}
          loading={loading}
          message={deleteMsg}
          deleteResponse={deleteResponse}
        />
      )}

      {openDialogs.editTaskDialog && (
        <UpdateBulkTaskDialog
          open={openDialogs.editTaskDialog}
          handleUserDialogClose={() => handleDialogClose("editTaskDialog")}
          handleUpdateTask={(data) => handleUpdateTask(data)}
          currentSelectedTasks={currentSelectedTasks}
          currentTaskDetails={currentTaskDetails}
          loading={loading}
          isBulk={isBulk}
          projectId={projectId}
        />
      )}

      {openDialogs.previewDialog && (
        <PreviewDialog
          openPreviewDialog={openDialogs.previewDialog}
          handleClose={() => handleDialogClose("previewDialog")}
          data={previewData}
          taskType={currentTaskDetails?.task_type}
        />
      )}

      {Boolean(anchorEl) && (
        <FilterList
          id={"filterList"}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          handleClose={() => setAnchorEl(null)}
          updateFilters={setSelectedFilters}
          currentFilters={selectedFilters}
          taskList={taskList}
          srcLanguageList={srcLanguageList}
          tgtLanguageList={tgtLanguageList}
        />
      )}

      {bulkSubtitleAlert && (
        <UploadAlertComponent
          open={bulkSubtitleAlert}
          onClose={() => setBulkSubtitleAlert(false)}
          message={bulkSubtitleAlertData.message}
          report={bulkSubtitleAlertData}
        />
      )}

      {openDialogs.uploadDialog && (
        <UploadFormatDialog
          open={openDialogs.uploadDialog}
          handleClose={() => handleDialogClose("uploadDialog")}
          uploadExportType={uploadExportType}
          setUploadExportType={setUploadExportType}
          handleSubtitleUpload={() =>
            handleUploadSubtitle(
              currentTaskDetails?.id,
              uploadTaskRowIndex,
              uploadExportType
            )
          }
        />
      )}

      {openDialogs.speakerInfoDialog && (
        <SpeakerInfoDialog
          open={openDialogs.speakerInfoDialog}
          handleClose={() => handleDialogClose("speakerInfoDialog")}
          taskId={currentTaskDetails?.id}
          handleContinueEdit={() =>
            generateTranslationCall(
              currentTaskDetails?.id,
              currentTaskDetails?.status
            )
          }
        />
      )}
    </>
  );
};

export default TaskList;
