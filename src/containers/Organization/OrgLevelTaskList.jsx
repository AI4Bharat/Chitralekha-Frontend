// OrgLevelTaskList
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDateTime, roles } from "../../utils/utils";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getOptions } from "../../utils/tableUtils";
import C from "../../redux/constants";
import statusColor from "../../utils/getStatusColor";

//Themes
import tableTheme from "../../theme/tableTheme";
import DatasetStyle from "../../styles/datasetStyle";
import TableStyles from "../../styles/TableStyles";

//Components
import {
  ThemeProvider,
  Box,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import CustomizedSnackbars from "../../common/Snackbar";
import UpdateBulkTaskDialog from "../../common/UpdateBulkTaskDialog";
import ViewTaskDialog from "../../common/ViewTaskDialog";
import FilterList from "../../common/FilterList";
import ExportDialog from "../../common/ExportDialog";

//Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PreviewDialog from "../../common/PreviewDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterListIcon from "@mui/icons-material/FilterList";

//Apis
import APITransport from "../../redux/actions/apitransport/apitransport";
import DeleteTaskAPI from "../../redux/actions/api/Project/DeleteTask";
import ComparisionTableAPI from "../../redux/actions/api/Project/ComparisonTable";
import exportTranscriptionAPI from "../../redux/actions/api/Project/ExportTranscrip";
import EditBulkTaskDetailAPI from "../../redux/actions/api/Project/EditBulkTaskDetails";
import EditTaskDetailAPI from "../../redux/actions/api/Project/EditTaskDetails";
import exportTranslationAPI from "../../redux/actions/api/Project/ExportTranslation";
import CompareTranscriptionSource from "../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../redux/actions/api/Project/SetComparisonTableData";
import clearComparisonTable from "../../redux/actions/api/Project/ClearComparisonTable";
import FetchpreviewTaskAPI from "../../redux/actions/api/Project/FetchPreviewTask";
import DeleteDialog from "../../common/DeleteDialog";
import FetchSupportedLanguagesAPI from "../../redux/actions/api/Project/FetchSupportedLanguages";
import FetchOrgTaskList from "../../redux/actions/api/Organization/FetchOrgTaskList";
import DeleteBulkTaskAPI from "../../redux/actions/api/Project/DeleteBulkTask";
import FetchTranscriptExportTypesAPI from "../../redux/actions/api/Project/FetchTranscriptExportTypes";
import FetchTranslationExportTypesAPI from "../../redux/actions/api/Project/FetchTranslationExportTypes";
import BulkTaskExportAPI from "../../redux/actions/api/Project/BulkTaskDownload";
import ExportVoiceoverTaskAPI from "../../redux/actions/api/Project/ExportVoiceoverTask";

const OrgLevelTaskList = () => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const tableClasses = TableStyles();
  const navigate = useNavigate();

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
  const [task_type, setTask_type] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setsSelectedFilters] = useState({
    status: [],
    taskType: [],
    SrcLanguage: [],
    TgtLanguage: [],
  });
  const [filterData, setfilterData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTaskType, setFilterTaskType] = useState(" ");
  const [isBulkTaskDelete, setIsBulkTaskDelete] = useState(false);
  const [isBulkTaskDownload, setIsBulkTaskDownload] = useState(false);
  const [selectedBulkTaskid, setSelectedBulkTaskId] = useState([]);
  const [options, setOptions] = useState({});

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const orgId = userData?.organization?.id;
  const transcriptExportTypes = useSelector(
    (state) => state.getTranscriptExportTypes.data.export_types
  );
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );

  const fetchTaskList = () => {
    setLoading(true);
    const apiObj = new FetchOrgTaskList(orgId);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    const langObj = new FetchSupportedLanguagesAPI();
    dispatch(APITransport(langObj));

    const transcriptExportObj = new FetchTranscriptExportTypesAPI();
    dispatch(APITransport(transcriptExportObj));

    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));

    return () => {
      dispatch({ type: C.CLEAR_ORG_TASK_LIST, payload: [] });
    };
    // eslint-disable-next-line
  }, []);

  const supportedLanguages = useSelector(
    (state) => state.getSupportedLanguages.data
  );

  useEffect(() => {
    const statusData = selectedFilters?.status?.map((el) => el);
    setFilterStatus(statusData.toString());

    const taskTypeData = selectedFilters?.taskType?.map((el) => el);
    setFilterTaskType(taskTypeData.toString());
  }, [selectedFilters.status, selectedFilters?.taskType]);

  useEffect(() => {
    if (orgId) {
      fetchTaskList();
    }
    // eslint-disable-next-line
  }, [orgId]);

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");
  }, []);

  const taskList = useSelector((state) => state.getOrgTaskList.data);
  const SearchProject = useSelector((state) => state.searchList.data);

  useEffect(() => {
    if (taskList.tasks_list) {
      setLoading(false);
    }
  }, [taskList]);

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenPreviewDialog(false);
  };

  const exportVoiceoverTask = async (id) => {
    const apiObj = new ExportVoiceoverTaskAPI(id);

    const res = await fetch(apiObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const resp = await res.json();

    if (res.ok) {
      const task = taskList.tasks_list.filter((task) => task.id === id)[0];

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
  };

  const handleClickOpen = (id, taskType) => {
    if (taskType.includes("VOICEOVER")) {
      exportVoiceoverTask(id);
    } else {
      setOpen(true);
      setTaskdata(id);
      setTasktype(taskType);
      setIsBulkTaskDownload(false);
    }
  };

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
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
      const task = taskList.tasks_list.filter(
        (task) => task.id === taskdata
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
      const task = taskList.tasks_list.filter(
        (task) => task.id === taskdata
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
      // link.setAttribute("download", `${taskdata}.${exportTranslation}`);
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
      }
    });
  };

  const handledeletetask = async (id, flag) => {
    setDeleteTaskid(id);

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
      fetchTaskList();
    } else {
      setOpenDialog(true);
      setDeleteMsg(resp.message);
      setDeleteResponse(resp.response);
      setLoading(false);
    }
  };

  const handlePreviewTask = async (id, Task_type, Targetlanguage) => {
    setPreviewdata({});
    setOpenPreviewDialog(true);
    setTask_type(Task_type);
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
      tableData.rowData[17]?.View && (
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
      tableData.rowData[17]?.Export && (
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
      tableData.rowData[17]?.Edit && (
        <Tooltip title="Edit">
          <IconButton
            disabled={!tableData.rowData[12]}
            onClick={() => {
              if (tableData.rowData[1].includes("TRANSCRIPTION")) {
                navigate(`/task/${tableData.rowData[0]}/transcript`);
              } else if (tableData.rowData[1].includes("TRANSLATION")) {
                navigate(`/task/${tableData.rowData[0]}/translate`);
              } else {
                navigate(`/task/${tableData.rowData[0]}/voiceover`);
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
      tableData.rowData[17]?.Delete && (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handledeletetask(tableData.rowData[0], false)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const renderUpdateTaskButton = (tableData) => {
    return (
      tableData.rowData[17]?.Update && (
        <Tooltip title="Edit Task Details">
          <IconButton
            color="primary"
            onClick={() => {
              setSelectedTaskId(tableData.rowData[0]);
              setOpenEditTaskDialog(true);
              setIsBulk(false);
            }}
          >
            <AppRegistrationIcon />
          </IconButton>
        </Tooltip>
      )
    );
  };

  const renderPreviewButton = (tableData) => {
    return (
      tableData.rowData[17]?.Preview && (
        <Tooltip title="Preview">
          <IconButton
            color="primary"
            onClick={() =>
              handlePreviewTask(
                tableData.rowData[14],
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

  useEffect(() => {
    setfilterData(taskList.tasks_list);
  }, [taskList.tasks_list]);

  useEffect(() => {
    FilterData();
    // eslint-disable-next-line
  }, [filterStatus, filterTaskType]);

  const FilterData = () => {
    let statusFilter = [];
    let filterResult = [];
    let lngResult = [];
    let TaskTypefilter = [];
    if (
      selectedFilters &&
      selectedFilters.hasOwnProperty("status") &&
      selectedFilters.status.length > 0
    ) {
      statusFilter = taskList.tasks_list.filter((value) => {
        if (selectedFilters.status.includes(value.status_label)) {
          return value;
        }

        return [];
      });
    } else {
      statusFilter = taskList.tasks_list;
    }
    if (
      selectedFilters &&
      selectedFilters.hasOwnProperty("taskType") &&
      selectedFilters.taskType.length > 0
    ) {
      TaskTypefilter = statusFilter.filter((value) => {
        if (selectedFilters.taskType.includes(value.task_type_label)) {
          return value;
        }
        return [];
      });
    } else {
      TaskTypefilter = statusFilter;
    }

    if (
      selectedFilters &&
      selectedFilters.hasOwnProperty("SrcLanguage") &&
      selectedFilters.SrcLanguage.length > 0
    ) {
      lngResult = TaskTypefilter.filter((value) => {
        if (selectedFilters.SrcLanguage.includes(value.src_language_label)) {
          return value;
        }
        return [];
      });
    } else {
      lngResult = TaskTypefilter;
    }

    if (
      selectedFilters &&
      selectedFilters.hasOwnProperty("TgtLanguage") &&
      selectedFilters.TgtLanguage.length > 0
    ) {
      filterResult = lngResult.filter((value) => {
        if (selectedFilters.TgtLanguage.includes(value.target_language_label)) {
          return value;
        }
        return [];
      });
    } else {
      filterResult = lngResult;
    }
    taskList.filteredData = filterResult;

    setSelectedBulkTaskId("");
    setRows([]);
    setShowEditTaskBtn(false);

    setfilterData(filterResult);
    return taskList.tasks_list;
  };

  useEffect(() => {
    const pageSearchData = taskList.tasks_list?.filter((el) => {
      if (SearchProject === "") {
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
        el.src_language_label
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.target_language_label
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.status_label?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
    setfilterData(pageSearchData);

    // eslint-disable-next-line
  }, [SearchProject]);

  const result =
    taskList.tasks_list && taskList.tasks_list.length > 0
      ? filterData?.map((item, i) => {
          const status =
            item.status_label && statusColor(item.status_label)?.element;
          return [
            item.id,
            item.task_type,
            item.task_type_label,
            item.video_name,
            moment(item.created_at).format("DD/MM/YYYY HH:mm:ss"),
            item.source_type,
            item.src_language,
            item.src_language_label,
            item.target_language,
            item.target_language_label,
            status ? status : item.status_label,
            item.user,
            item.is_active,
            `${item.user?.first_name} ${item.user?.last_name}`,
            item.project_name,
            item.video,
            item.description,
            item.buttons,
          ];
        })
      : [];

  const columns = [
    {
      name: "id",
      label: "Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: "exclude",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
      },
    },
    {
      name: "task_type",
      label: "",
      options: {
        display: "excluded",
        filter: true,
      },
    },
    {
      name: "task_type_label",
      label: "Task Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
          className: tableClasses.cellHeaderProps
        }),
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
        display: false,
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
      name: "source_type",
      label: "Source Type",
      options: {
        filter: false,
        sort: false,
        display: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
      }
    },
    {
      name: "src_language",
      label: "",
      options: {
        display: "excluded",
        filter: true,
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
          className: tableClasses.cellHeaderProps
        }),
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
      name: "target_language",
      label: "",
      options: {
        display: "excluded",
        filter: true,
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
          className: tableClasses.cellHeaderProps
        }),
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
      name: "status_label",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
          className: tableClasses.cellHeaderProps
        }),
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
      name: "project_name",
      label: "Project Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: true,
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
      name: "buttons",
      label: "",
      options: {
        display: "excluded",
      },
    },
    {
      name: "description",
      label: "Description",
      options: {
        filter: false,
        sort: false,
        display: "exclude",
        align: "center",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
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
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: tableClasses.cellHeaderProps
        }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box sx={{ display: "flex" }}>
              {renderUpdateTaskButton(tableMeta)}

              {renderViewButton(tableMeta)}

              {renderEditButton(tableMeta)}

              {renderExportButton(tableMeta)}

              {renderPreviewButton(tableMeta)}

              {renderDeleteButton(tableMeta)}
            </Box>
          );
        },
      },
    },
  ];

  const handleRowClick = (_currentRow, allRow) => {
    const temp = filterData.filter((_item, index) => {
      return allRow.find((element) => element.index === index);
    });

    let temp2 = [];
    allRow.forEach((element) => {
      temp2.push(element.dataIndex);
    });

    const taskIds = temp.map((item) => item.id);
    let temp3 = taskIds.join();

    setSelectedBulkTaskId(temp3);
    setCurrentSelectedTask(temp);
    setRows(temp2);
    setShowEditTaskBtn(!!temp.length);
  };

  const handleBulkDelete = async (taskIds, flag) => {
    setLoading(true);
    setIsBulkTaskDelete(true);

    const apiObj = new DeleteBulkTaskAPI(flag, taskIds);

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
      fetchTaskList();
    } else {
      setDeleteTaskid(resp.task_ids);
      setOpenDialog(true);
      setDeleteMsg(resp.message);
      setDeleteResponse(resp.error_report);
      setLoading(false);
    }
  };

  const toolBarActions = [
    {
      title: "Bulk Task Update",
      icon: <AppRegistrationIcon />,
      onClick: () => {
        setOpenEditTaskDialog(true);
        setIsBulk(true);
      },
    },
    {
      title: "Bulk Task Delete",
      icon: <DeleteIcon />,
      onClick: () => {},
      style: { color: "#d32f2f" },
    },
    {
      title: "Bulk Task Dowload",
      icon: <FileDownloadIcon />,
      onClick: () => {
        setOpen(true);
        setTasktype("TRANSLATION_EDIT");
        setIsBulkTaskDownload(true);
      },
      style: { marginRight: "auto" },
    },
  ];

  const renderToolBar = () => {
    return (
      <>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
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
      </>
    );
  };

  useEffect(() => {
    let option = getOptions(loading);

    option = {
      ...option,
      selectableRows: roles.filter((role) => role.value === userData?.role)[0]
        ?.showSelectCheckbox
        ? "multiple"
        : "none",
      selectToolbarPlacement: "none",
      rowsSelected: rows,
      customToolbar: renderToolBar,
      onRowSelectionChange: (currentRow, allRow) => {
        handleRowClick(currentRow, allRow);
      },
    };

    setOptions(option);
    
    // eslint-disable-next-line
  }, [loading]);

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
      fetchTaskList();
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

  const handleBulkTaskDownload = async () => {
    setOpen(false);
    const apiObj = new BulkTaskExportAPI(exportTranslation, selectedBulkTaskid);

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

      setLoading(false);
    } else {
      const resp = await res.json();

      setLoading(false);
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  return (
    <>
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

      {open && (
        <ExportDialog
          open={open}
          handleClose={handleClose}
          taskType={tasktype}
          handleTranscriptRadioButton={handleClickRadioButton}
          handleTranslationRadioButton={handleClickRadioButtonTranslation}
          handleTranscriptExport={handleok}
          handleTranslationExport={handleokTranslation}
          exportTranscription={exportTranscription}
          exportTranslation={exportTranslation}
          transcriptionOptions={transcriptExportTypes}
          translationOptions={translationExportTypes}
          isBulkTaskDownload={isBulkTaskDownload}
          handleBulkTaskDownload={handleBulkTaskDownload}
        />
      )}

      {openDialog && (
        <DeleteDialog
          openDialog={openDialog}
          handleClose={() => handleCloseDialog()}
          submit={() => {
            isBulkTaskDelete
              ? handleBulkDelete(deleteTaskid, true)
              : handledeletetask(deleteTaskid, true);
          }}
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
          task_type={task_type}
        />
      )}
      {popoverOpen && (
        <FilterList
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          supportedLanguages={supportedLanguages}
          taskList={taskList}
        />
      )}
    </>
  );
};

export default OrgLevelTaskList;
