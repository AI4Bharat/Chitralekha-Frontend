import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  exportFile,
  exportVoiceover,
  exportZip,
  filterTaskList,
  getColumns,
  getOptions,
  roles,
} from "utils";
import {
  buttonConfig,
  taskListColumns,
  toolBarActions,
  failInfoColumns,
  renderTaskListColumnCell,
} from "config";
import moment from "moment";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
//Themes
import { tableTheme } from "theme";
import { DatasetStyle, TableStyles } from "styles";

//Components
import {
  ThemeProvider,
  Box,
  Tooltip,
  IconButton,
  Button,
  Divider,
  Badge,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import {
  AlertComponent,
  DeleteDialog,
  ExportDialog,
  FilterList,
  PreviewDialog,
  SpeakerInfoDialog,
  TableDialog,
  TableSearchPopover,
  UpdateBulkTaskDialog,
  UploadFormatDialog,
  ViewTaskDialog,
  TaskReopenDialog,
} from "common";

//Icons
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AudiotrackOutlinedIcon from '@mui/icons-material/AudiotrackOutlined';

// Utils
import getLocalStorageData from "utils/getLocalStorageData";

// Config
import { specialOrgIds } from "config";

//APIs
import {
  APITransport,
  BulkExportVoiceoverTasksAPI,
  BulkTaskExportAPI,
  CompareTranscriptionSource,
  ComparisionTableAPI,
  DeleteBulkTaskAPI,
  DeleteTaskAPI,
  EditBulkTaskDetailAPI,
  EditTaskDetailAPI,
  ExportVoiceoverTaskAPI,
  FetchSupportedLanguagesAPI,
  FetchTaskFailInfoAPI,
  FetchTaskListAPI,
  FetchTranscriptExportTypesAPI,
  FetchTranslationExportTypesAPI,
  FetchVoiceoverExportTypesAPI,
  GenerateTranslationOutputAPI,
  RegenerateResponseAPI,
  ReopenTaskAPI,
  UploadToYoutubeAPI,
  clearComparisonTable,
  exportTranscriptionAPI,
  exportTranslationAPI,
  setComparisonTable,
  setSnackBar,
  updateColumnDisplay,
  updateProjectSearchValues,
  updateSelectedFilter,
  updateSortOptions,
} from "redux/actions";
import constants from "redux/constants";
import { updateCurrentSearchedColumn } from "redux/actions/taskFilters";
import DeleteTaskDialog from "common/DeleteTaskDialog";
import CompareEdits from "common/CompareEdits";

const TaskList = () => {
  const userOrgId = getLocalStorageData("userData").organization.id;
  const [desc, setShowDesc] = useState(false);
  const [org_id, setId] = useState();

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

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteResponse, setDeleteResponse] = useState([]);

  const [taskReopenMsg, setTaskReopenMsg] = useState("");
  const [taskReopenResponse, setTaskReopenResponse] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);

  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const [currentSelectedTasks, setCurrentSelectedTasks] = useState([]);
  const [uploadTaskRowIndex, setUploadTaskRowIndex] = useState("");

  const [taskColDisplayState, setTaskColDisplayState] = useState({});

  //Dialogs
  const [openDialogs, setOpenDialogs] = useState({
    exportDialog: false,
    deleteDialog: false,
    viewTaskDialog: false,
    previewDialog: false,
    editTaskDialog: false,
    CompareEdits:false,
    uploadDialog: false,
    speakerInfoDialog: false,
    tableDialog: false,
    TaskReopenDialog: false,
    taskType: "",
    deleteTaskDialog: false,
    id: "",
  });
  const [tableDialogMessage, setTableDialogMessage] = useState("");
  const [tableDialogResponse, setTableDialogResponse] = useState([]);
  const [tableDialogColumn, setTableDialogColumn] = useState([]);

  //Bulk Opertaion States
  const [isBulk, setIsBulk] = useState(false);
  const [isBulkTaskDelete, setIsBulkTaskDelete] = useState(false);
  const [isBulkTaskDownload, setIsBulkTaskDownload] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBulkTaskid, setSelectedBulkTaskId] = useState([]);
  const [showEditTaskBtn, setShowEditTaskBtn] = useState(false);
  const [bulkSubtitleAlert, setBulkSubtitleAlert] = useState(false);
  const [bulkSubtitleAlertData, setBulkSubtitleAlertData] = useState({});

  const [exportTypes, setExportTypes] = useState({
    transcription: ["srt"],
    translation: ["srt"],
    voiceover: "mp3",
    speakerInfo: "false",
    bgMusic: "false",
  });
  const [uploadExportType, setUploadExportType] = useState("srt");
  const [alertColumn, setAlertColumn] = useState("");

  //Server Side Pagination States
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [reOpenTaskId, setReOpenTaskId] = useState(null);

  //Data from Redux
  const { total_count: totalCount, tasks_list: taskList } = useSelector(
    (state) => state.getTaskList.data
  );
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const selectedFilters = useSelector(
    (state) => state.taskFilters.selectedFilters
  );
  const sortOptions = useSelector((state) => state.taskFilters.sortOptions);
  const columnDisplay = useSelector((state) => state.taskFilters.columnDisplay);
  const searchValue = useSelector((state) => state.taskFilters.searchValue);
  const currentSearchedColumn = useSelector(
    (state) => state.taskFilters.currentSearchedColumn
  );

  useEffect(() => {
    const displayCols = {};
    const displayColsLocalStorage = JSON.parse(
      localStorage.getItem("taskColDisplayFilter")
    );
    const allCols = [
      ...taskListColumns.map((ele) => ele.name),
      "id",
      "video_name",
      "user",
      "description",
      "created_at",
      "updated_at",
      "Action",
    ];
    const defaultDisabledDisplayCols = [
      "description",
      "created_at",
      "updated_at",
      // "video_name",
    ];
    allCols.forEach((ele) => {
      if (displayColsLocalStorage && ele in displayColsLocalStorage) {
        displayCols[ele] = displayColsLocalStorage[ele];
      } else if (defaultDisabledDisplayCols.includes(ele)) {
        displayCols[ele] = false;
      } else {
        displayCols[ele] = true;
      }
    });
    setTaskColDisplayState(displayCols);
    localStorage.setItem("taskColDisplayFilter", JSON.stringify(displayCols));
  }, []);

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    if (!progress) {
      if (success) {
        switch (apiType) {
          case "EXPORT_VOICEOVER_TASK":
            exportVoiceover(data, currentTaskDetails, exportTypes);
            handleDialogClose("exportDialog");
            break;

          case "DELETE_TASK":
            handleDialogClose("deleteDialog");
            fetchTaskList();
            break;

          case "REOPEN_TASK":
            handleDialogClose("TaskReopenDialog");
            fetchTaskList();
            break;

          case "GENERATE_TRANSLATION_OUTPUT":
            navigate(`/task/${currentTaskDetails?.id}/translate`);
            break;

          case "UPLOAD_TO_YOUTUBE":
            setBulkSubtitleAlert(true);
            setBulkSubtitleAlertData(data);
            setAlertColumn("uploadAlertColumns");
            break;

          case "DELETE_BULK_TASK":
            setRows([]);
            setShowEditTaskBtn(false);
            fetchTaskList();
            break;

          case "EDIT_BULK_TASK_DETAILS":
            fetchTaskList();
            break;

          case "EDIT_TASK_DETAILS":
            fetchTaskList();
            break;

          case "COMPARE_TRANSCRIPTION_SOURCE":
            dispatch(setComparisonTable(data));
            if (isSubmit) {
              onTranslationTaskTypeSubmit(currentTaskDetails?.id, data);
            }
            break;

          case "GET_TASK_FAIL_INFO":
            handleDialogOpen("tableDialog");
            setTableDialogColumn(failInfoColumns);
            setTableDialogMessage(data.message);
            setTableDialogResponse(data.data);
            break;

          default:
            break;
        }
      } else {
        if (apiType === "DELETE_TASK") {
          dispatch(setSnackBar({ open: false }));
          handleDialogOpen("deleteDialog");
          setDeleteMsg(data.message);
          setDeleteResponse(data.response);
        }

        if (apiType === "DELETE_BULK_TASK") {
          dispatch(setSnackBar({ open: false }));
          handleDialogOpen("deleteDialog");
          setDeleteMsg(data.message);
          setDeleteResponse(data.error_report);
        }

        if (apiType === "REOPEN_TASK" && data.response) {
          dispatch(setSnackBar({ open: false }));
          handleDialogOpen("TaskReopenDialog");
          setTaskReopenMsg(data.message);
          setTaskReopenResponse(data.response);
        }

        if (apiType === "GET_TASK_FAIL_INFO") {
          dispatch(setSnackBar({ open: false }));
          handleDialogOpen("tableDialog");
          setTableDialogColumn([]);
          setTableDialogMessage(data.message);
          setTableDialogResponse(null);
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const fetchTaskList = () => {
    setLoading(true);

    const search = {
      task_id: searchValue?.id,
      video_name: searchValue?.video_name,
      description: searchValue?.description,
      assignee: searchValue?.user,
    };

    const taskDescriptionLocalStore=JSON.parse(localStorage.getItem('taskSearchFilters'))?.descriptionProjectLevel
    if (!search["description"] && taskDescriptionLocalStore) {
      search["description"] = taskDescriptionLocalStore
      searchValue["description"]=taskDescriptionLocalStore
    }

    const filter = {
      task_type: selectedFilters?.taskType,
      status: selectedFilters?.status,
      src_language: selectedFilters?.srcLanguage,
      target_language: selectedFilters?.tgtLanguage,
    };

    const searchRequest = Object.entries(search).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const filterRequest = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value.length > 0) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const apiObj = new FetchTaskListAPI(
      projectId,
      offset + 1,
      limit,
      searchRequest,
      filterRequest,
      sortOptions
    );
    dispatch(APITransport(apiObj));
  };

  const updateLocalStorageDisplayCols = (changedColumn, action) => {
    const data = JSON.parse(localStorage.getItem("taskColDisplayFilter"));
    const showStatus = action === "add" ? true : false;
    data[changedColumn] = showStatus;
    setTaskColDisplayState(data)
    localStorage.setItem("taskColDisplayFilter", JSON.stringify(data));
  };

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");

    const transcriptExportObj = new FetchTranscriptExportTypesAPI();
    dispatch(APITransport(transcriptExportObj));

    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));

    const voiceoverExportObj = new FetchVoiceoverExportTypesAPI();
    dispatch(APITransport(voiceoverExportObj));

    const transcriptLangObj = new FetchSupportedLanguagesAPI("TRANSCRIPTION");
    dispatch(APITransport(transcriptLangObj));

    const translationLangObj = new FetchSupportedLanguagesAPI("TRANSLATION");
    dispatch(APITransport(translationLangObj));

    return () => {
      dispatch({ type: constants.CLEAR_PROJECT_TASK_LIST, payload: [] });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchTaskList();

    // eslint-disable-next-line
  }, [offset, limit, searchValue, selectedFilters, sortOptions]);

  useEffect(() => {
    if (taskList) {
      setLoading(false);
      setTableData(taskList);
    }
  }, [taskList]);

  useEffect(() => {
    const option = getOptions(loading);

    const newOptions = {
      ...option,
      selectableRows: roles.filter((role) => role.value === userData?.role)[0]
        ?.showSelectCheckbox
        ? "multiple"
        : "none",
      search: false,
      serverSide: true,
      page: offset,
      rowsSelected: rows,
      rowsPerPage: limit,
      count: totalCount,
      jumpToPage: true,
      selectToolbarPlacement: "none",
      onViewColumnsChange: (changedColumn, action) => {
        updateLocalStorageDisplayCols(changedColumn, action);
      },
      customToolbar: renderToolBar,
      onRowSelectionChange: (currentRow, allRow) => {
        handleRowClick(currentRow, allRow);
      },
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            setOffset(tableState.page);
            break;
          case "changeRowsPerPage":
            setLimit(tableState.rowsPerPage);
            break;
          default:
        }
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
    if (taskList) {
      filterData();
    }
    // eslint-disable-next-line
  }, [selectedFilters, taskList]);

  const exportVoiceoverTask = async (id) => {
    const { id: taskId } = currentTaskDetails;
    const { voiceover, bgMusic } = exportTypes;

    const apiObj = new ExportVoiceoverTaskAPI(taskId, voiceover, bgMusic);
    dispatch(APITransport(apiObj));
  };

  const handleExportSubmitClick = () => {
    if (isBulkTaskDownload) {
      const tasks = currentSelectedTasks.map((item) => item.task_type);

      if (tasks.every((item) => item === "VOICEOVER_EDIT")) {
        handleBulkVoiceoverTaskDownload();
      } else {
        handleBulkTaskDownload();
      }
    } else {
      const { task_type: taskType } = currentTaskDetails;

      if (taskType?.includes("TRANSCRIPTION")) {
        handleTranscriptExport();
      } else if (openDialogs.taskType === "VO"){
        exportVoiceoverTask();
      } else if (taskType?.includes("TRANSLATION")) {
        handleTranslationExport();
      } else {
        exportVoiceoverTask();
      }
    }
  };

  const handleTranscriptExport = async () => {
    const { id: taskId } = currentTaskDetails;
    const { transcription, speakerInfo } = exportTypes;
    console.log(transcription)

    transcription.map(async (transcript)=>{
    const apiObj = new exportTranscriptionAPI(
      taskId,
      transcript,
      speakerInfo
    );
    handleDialogClose("exportDialog");

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();

        exportFile(resp, currentTaskDetails, transcript, "transcription");
      } else {
        const resp = await res.json();

        dispatch(
          setSnackBar({
            open: true,
            message: resp.message,
            variant: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }})
  };

  const handleTranslationExport = async () => {
    const { id: taskId } = currentTaskDetails;
    const { translation, speakerInfo } = exportTypes;
    console.log(translation)

    translation.map(async (translate)=>{
    const apiObj = new exportTranslationAPI(taskId, translate, speakerInfo);
    handleDialogClose("exportDialog");

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();

        exportFile(resp, currentTaskDetails, translate, "translation");
      } else {
        const resp = await res.json();

        dispatch(
          setSnackBar({
            open: true,
            message: resp.message,
            variant: "success",
          })
        );
      }
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }})
  };

  const handleExportRadioButtonChange = (event) => {
    const {
      target: { name, value },
    } = event;

    setExportTypes((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleExportCheckboxChange = (event) => {
    const {
      target: { name, value },
    } = event;
    let new_val=exportTypes[name]
    console.log(new_val)
    if (new_val.includes(value)){
      new_val = new_val.filter(item => item !== value)
    } else{
      new_val.push(value)
    }

    setExportTypes((prevState) => ({
      ...prevState,
      [name]: new_val,
    }));
  }

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
    setIsSubmit(isSubmitCall);
    const sourceTypeList = source.map((el) => {
      return el.toUpperCase().split(" ").join("_");
    });

    const apiObj = new CompareTranscriptionSource(id, sourceTypeList);
    dispatch(APITransport(apiObj));

    localStorage.setItem("sourceTypeList", JSON.stringify(sourceTypeList));
  };

  const handleDeleteTask = async (id, flag) => {
    setLoading(true);
    setIsBulkTaskDelete(false);

    const apiObj = new DeleteTaskAPI(id, flag);
    dispatch(APITransport(apiObj));
    handleDialogClose("deleteDialog");
    handleDialogClose("deleteTaskDialog");
  };

  const handleTaskReopen = async () => {
    setLoading(true);

    const reopenObj = new ReopenTaskAPI(reOpenTaskId, true);
    dispatch(APITransport(reopenObj));
    handleDialogClose("TaskReopenDialog");
  };

  const handlePreviewTask = () => {
    handleDialogOpen("previewDialog");
  };
  const handleCompareEdits = () => {
    handleDialogOpen("CompareEdits");
  };
  const generateTranslationCall = async (id, taskStatus) => {
    if (taskStatus === "SELECTED_SOURCE") {
      const apiObj = new GenerateTranslationOutputAPI(id);
      dispatch(APITransport(apiObj));
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
    dispatch(APITransport(apiObj));

    loadingArray[rowIndex] = false;
    setUploadLoading(loadingArray);
  };

  const handleOpenSubtitleUploadDialog = (rowIndex) => {
    handleDialogOpen("uploadDialog");
    setUploadTaskRowIndex(rowIndex);
  };

  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    dispatch(
      updateCurrentSearchedColumn({
        label: col.label,
        name: col.name,
      })
    );

    if (col.name === "description") {
      dispatch(updateColumnDisplay({ ...columnDisplay, description: true }));
    }
  };

  const renderSortIndicator = (column) => {
    if (sortOptions.sortBy === column) {
      return sortOptions.order ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    }
    return <ImportExportIcon />;
  };

  const CustomTableHeader = (col) => {
    return (
      <>
        <Box className={tableClasses.customTableHeader}>
          {col.label}

          {col.canBeSearch && (
            <IconButton
              sx={{ borderRadius: "100%" }}
              onClick={(e) => handleShowSearch(col, e)}
            >
              <Badge
                color="primary"
                variant="dot"
                invisible={!searchValue[col.name].length}
              >
                <SearchIcon id={col.name + "_btn"} />
              </Badge>
            </IconButton>
          )}

          {col.canBeSorted && (
            <IconButton
              sx={{ borderRadius: "100%" }}
              onClick={() => {
                dispatch(
                  updateColumnDisplay({ ...columnDisplay, [col.name]: true })
                );
                dispatch(
                  updateSortOptions({
                    sortBy: col.name,
                    order:
                      sortOptions.sortBy === col.name
                        ? !sortOptions.order
                        : false,
                  })
                );
              }}
            >
              {renderSortIndicator(col.name)}
            </IconButton>
          )}
        </Box>
      </>
    );
  };

  const handleActionButtonClick = (tableMeta, action) => {
    const { tableData: data, rowIndex } = tableMeta;
    const selectedTask = data[rowIndex];

    const { id, task_type, status } = selectedTask;
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
        } else if (task_type.includes("VOICEOVER")) {
          navigate(`/task/${id}/voiceover`);
        } else {
          generateTranslationCall(id, status);
        }
        break;

      case "Edit-Speaker":
        handleDialogOpen("speakerInfoDialog");
        break;

      case "Export":
        handleDialogOpen("exportDialog");
        setIsBulkTaskDownload(false);
        break;

      case "ExportVO":
        handleDialogOpen("exportDialog", "VO");
        setIsBulkTaskDownload(false);
        break;

      case "Preview":
        handlePreviewTask();
        break;
        case "CompareEdits":
          handleCompareEdits();
          break;

      case "Delete":
        handleDialogOpen("deleteTaskDialog", "", id);
        break;

      case "Info":
        const infoObj = new FetchTaskFailInfoAPI(id);
        dispatch(APITransport(infoObj));
        break;

      case "Reopen":
        const reopenObj = new ReopenTaskAPI(id, false, task_type);
        dispatch(APITransport(reopenObj));
        setReOpenTaskId(id);
        break;

      case "Regenerate":
        const obj = new RegenerateResponseAPI(id);
        dispatch(APITransport(obj));
        break;

      default:
        break;
    }
  };

  const initColumns = () => {
    const id = {
      name: "id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        canBeSearch: true,
        display: taskColDisplayState["id"],
        align: "center",
        customHeadLabelRender: CustomTableHeader,
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps,
        }),
        customBodyRender: renderTaskListColumnCell,
      },
    };

    const videoName = {
      name: "video_name",
      label: "Video Name",
      options: {
        filter: false,
        sort: false,
        canBeSearch: true,
        display: taskColDisplayState["video_name"],
        align: "center",
        customHeadLabelRender: CustomTableHeader,
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps,
        }),
        customBodyRender: renderTaskListColumnCell,
      },
    };

    const assigneeColumn = {
      name: "user",
      label: "Assignee",
      options: {
        filter: false,
        sort: false,
        canBeSearch: true,
        display: taskColDisplayState["user"],
        align: "center",
        customHeadLabelRender: CustomTableHeader,
        customBodyRender: (value, tableMeta) => {
          const { tableData: data, rowIndex } = tableMeta;
          const selectedTask = data[rowIndex];

          return (
            <Box
              style={{
                color: selectedTask.is_active ? "" : "grey",
              }}
            >
              {value.first_name} {value.last_name}
            </Box>
          );
        },
      },
    };

    const descriptionColumn = {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        sort: false,
        canBeSearch: true,
        canBeSorted: true,
        display: specialOrgIds.includes(userOrgId)
          ? true
          : taskColDisplayState["description"],
        align: "center",
        customHeadLabelRender: CustomTableHeader,
        customBodyRender: !specialOrgIds.includes(userOrgId)
          ? renderTaskListColumnCell
          : (value, tableMeta) => {
              const { tableData: data, rowIndex } = tableMeta;
              const selectedTask = data[rowIndex];
              const slicedDesc = String(value).slice(0, 10);

              const handleMouseOver = () => {
                const rowData = tableMeta.rowData;
                setShowDesc(true);
                setId(rowData[0]);
              };

              return (
                <Box
                  id={selectedTask.id}
                  onMouseOver={handleMouseOver}
                  onMouseOut={() => setShowDesc(false)}
                  style={{
                    color: selectedTask.is_active ? "" : "grey",
                  }}
                >
                  {!desc
                    ? slicedDesc
                    : org_id === tableMeta.rowData[0]
                    ? value
                    : slicedDesc}
                </Box>
              );
            },
      },
    };

    const createdAtColumn = {
      name: "created_at",
      label: "Created At",
      options: {
        filter: false,
        sort: false,
        canBeSorted: true,
        display: taskColDisplayState["created_at"],
        customHeadLabelRender: CustomTableHeader,
        customBodyRender: (value, tableMeta) => {
          const { tableData: data, rowIndex } = tableMeta;
          const selectedTask = data[rowIndex];

          return (
            <Box
              style={{
                color: selectedTask.is_active ? "" : "grey",
              }}
            >
              {moment(value).format("DD/MM/YYYY HH:mm:ss")}
            </Box>
          );
        },
      },
    };

    const updatedAtColumn = {
      name: "updated_at",
      label: "Updated At",
      options: {
        filter: false,
        sort: false,
        canBeSorted: true,
        display: taskColDisplayState["updated_at"],
        customHeadLabelRender: CustomTableHeader,
        customBodyRender: (value, tableMeta) => {
          const { tableData: data, rowIndex } = tableMeta;
          const selectedTask = data[rowIndex];

          return (
            <Box
              style={{
                color: selectedTask.is_active ? "" : "grey",
              }}
            >
              {moment(value).format("DD/MM/YYYY HH:mm:ss")}
            </Box>
          );
        },
      },
    };

    const actionColumn = {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        display: taskColDisplayState["Action"],
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
              {(selectedTask?.task_type === "TRANSLATION_VOICEOVER_EDIT" && selectedTask?.status === "COMPLETE") &&
                <Tooltip key="Export Voiceover" title="Export Voiceover" >
                  <IconButton
                    onClick={() =>
                      handleActionButtonClick(tableMeta, "ExportVO")
                    }
                    color="primary"
                  >
                    <AudiotrackOutlinedIcon />
                  </IconButton>
                </Tooltip>
              }
              {((selectedTask?.task_type == "TRANSLATION_VOICEOVER_EDIT"|| selectedTask?.task_type == "TRANSCRIPTION_EDIT" || selectedTask?.task_type == "TRANSLATION_EDIT" )&& selectedTask?.status === "COMPLETE" && (userData.role=="PROJECT_MANAGER" || userData.role=="ORG_OWNER"||userData.role=="ADMIN")) &&
                <Tooltip key="Compare Edits" title="Compare Edits" >
                  <IconButton
                    onClick={() =>
                      handleActionButtonClick(tableMeta, "CompareEdits")
                    }
                    color="primary"
                  >
                    <CompareArrowsIcon />
                  </IconButton>
                </Tooltip>
              }

              {buttonConfig.map((item) => {
                return (
                  <Tooltip key={item.key} title={item.title}>
                    <IconButton
                      onClick={() =>
                        handleActionButtonClick(tableMeta, item.key)
                      }
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

    const columns = [
      ...getColumns(taskListColumns, taskColDisplayState),
      actionColumn,
    ];
    columns.splice(0, 1, id);
    columns.splice(2, 0, videoName);
    columns.splice(3, 0, createdAtColumn);
    columns.splice(4, 0, updatedAtColumn);
    columns.splice(7, 0, assigneeColumn);
    columns.splice(10, 0, descriptionColumn);

    return columns;
  };

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
    dispatch(APITransport(apiObj));

    handleDialogOpen("deleteDialog");
  };

  const handleBulkTaskDownload = async () => {
    handleDialogClose("exportDialog");
    const { translation } = exportTypes;

    translation.map(async (translate)=>{
    const apiObj = new BulkTaskExportAPI(translate, selectedBulkTaskid);

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();
        exportZip(resp);
      } else {
        const resp = await res.json();

        dispatch(
          setSnackBar({
            open: true,
            message: resp.message,
            variant: "error",
          })
        );
      }
    } catch (error) {
      dispatch(
        setSnackBar({
          open: true,
          message: "Something went wrong!!",
          variant: "error",
        })
      );
    }})
  };

  const handleBulkVoiceoverTaskDownload = async () => {
    handleDialogClose("exportDialog");

    const apiObj = new BulkExportVoiceoverTasksAPI(selectedBulkTaskid);
    dispatch(APITransport(apiObj));
  };

  const handleToolbarButtonClick = (key) => {
    switch (key) {
      case "bulkTaskUpdate":
        setCurrentTaskDetails(currentSelectedTasks);
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
    const arrayLengths = Object.values(selectedFilters).map(
      (arr) => arr.length
    );
    const sumOfLengths = arrayLengths.reduce((acc, length) => acc + length, 0);

    return (
      <>
        <Button
          style={{ minWidth: "25px" }}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Tooltip title={"Filter Table"}>
            <Badge color="primary" badgeContent={sumOfLengths}>
              <FilterListIcon sx={{ color: "#515A5A" }} />
            </Badge>
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

  const handleUpdateTask = async (data) => {
    const { id: taskId } = currentTaskDetails;
    setLoading(true);

    const body = data.description==""?{
      task_ids: currentSelectedTasks.map((item) => item.id),
      user: data.user.id,
      eta: data.date,
      priority: data.priority,
    }:{
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
    dispatch(APITransport(userObj));

    handleDialogClose("editTaskDialog");
  };

  const handleDeleteSubmit = () => {
    if (isBulkTaskDelete) {
      const taskIds = currentSelectedTasks.map((item) => item.id);
      handleBulkDelete(taskIds, true);
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

  const handleDialogOpen = (key, taskType="", id="") => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [key]: true,
      taskType: taskType,
      id: id,
    }));
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={tableData}
          columns={initColumns()}
          options={options}
        />
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
          fetchTaskList={fetchTaskList}
        />
      )}

      {openDialogs.exportDialog && (
        <ExportDialog
          open={openDialogs.exportDialog}
          handleClose={() => handleDialogClose("exportDialog")}
          task_type={openDialogs.taskType}
          taskType={currentTaskDetails?.task_type}
          exportTypes={exportTypes}
          handleExportSubmitClick={handleExportSubmitClick}
          handleExportRadioButtonChange={handleExportRadioButtonChange}
          handleExportCheckboxChange = {handleExportCheckboxChange}
          isBulkTaskDownload={isBulkTaskDownload}
          currentSelectedTasks={currentSelectedTasks}
        />
      )}

      {openDialogs.deleteDialog && (
        <DeleteDialog
          openDialog={openDialogs.deleteDialog}
          handleClose={() => handleDialogClose("deleteDialog")}
          submit={() => handleDeleteSubmit()}
          loading={apiStatus.loading}
          message={deleteMsg}
          deleteResponse={deleteResponse}
        />
      )}

      {openDialogs.deleteTaskDialog && (
        <DeleteTaskDialog
          openDialog={openDialogs.deleteTaskDialog}
          handleClose={() => handleDialogClose("deleteTaskDialog")}
          submit={() => handleDeleteTask(openDialogs.id, false)}
        />
      )}

      {openDialogs.TaskReopenDialog && (
        <TaskReopenDialog
          openDialog={openDialogs.TaskReopenDialog}
          handleClose={() => handleDialogClose("TaskReopenDialog")}
          submit={() => handleTaskReopen()}
          loading={apiStatus.loading}
          message={taskReopenMsg}
          taskReopenResponse={taskReopenResponse}
        />
      )}

      {openDialogs.editTaskDialog && (
        <UpdateBulkTaskDialog
          open={openDialogs.editTaskDialog}
          handleUserDialogClose={() => handleDialogClose("editTaskDialog")}
          handleUpdateTask={(data) => handleUpdateTask(data)}
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
          taskType={currentTaskDetails?.task_type}
          videoId={currentTaskDetails?.video}
          targetLanguage={currentTaskDetails?.target_language}
        />
      )}
      {openDialogs.CompareEdits && (
        <CompareEdits
          openPreviewDialog={openDialogs.CompareEdits}
          handleClose={() => handleDialogClose("CompareEdits")}
          taskType={currentTaskDetails?.task_type}
          videoId={currentTaskDetails?.video}
          targetLanguage={currentTaskDetails?.target_language}
        />
      )}

      {Boolean(anchorEl) && (
        <FilterList
          id={"filterList"}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          handleClose={() => setAnchorEl(null)}
          updateFilters={updateSelectedFilter}
          currentFilters={selectedFilters}
        />
      )}

      {bulkSubtitleAlert && (
        <AlertComponent
          open={bulkSubtitleAlert}
          onClose={() => setBulkSubtitleAlert(false)}
          message={bulkSubtitleAlertData.message}
          report={bulkSubtitleAlertData}
          columns={alertColumn}
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
              [currentTaskDetails?.id],
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

      {Boolean(searchAnchor) && (
        <TableSearchPopover
          open={Boolean(searchAnchor)}
          anchorEl={searchAnchor}
          handleClose={() => setSearchAnchor(null)}
          updateFilters={updateProjectSearchValues}
          currentFilters={searchValue}
          searchedCol={currentSearchedColumn}
        />
      )}

      {openDialogs.tableDialog && (
        <TableDialog
          openDialog={openDialogs.tableDialog}
          handleClose={() => handleDialogClose("tableDialog")}
          message={tableDialogMessage}
          response={tableDialogResponse}
          columns={tableDialogColumn}
          taskId={currentTaskDetails.id}
        />
      )}
    </>
  );
};

export default TaskList;
