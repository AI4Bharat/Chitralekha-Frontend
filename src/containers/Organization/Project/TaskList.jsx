import React, { useEffect, useState, useMemo } from "react";
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
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import CustomizedSnackbars from "../../../common/Snackbar";
import Search from "../../../common/Search";
import UpdateBulkTaskDialog from "../../../common/UpdateBulkTaskDialog";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import Loader from "../../../common/Spinner";
import PreviewDialog from "../../../common/PreviewDialog";
import UserMappedByRole from "../../../utils/UserMappedByRole";
import FilterList from "../../../common/FilterList";
import DeleteDialog from "../../../common/DeleteDialog";
import ExportDialog from "../../../common/ExportDialog";

//Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PreviewIcon from "@mui/icons-material/Preview";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";

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

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const apiStatus = useSelector((state) => state.apiStatus);
  const orgId = userData?.organization?.id;

  const transcriptExportTypes = useSelector(
    (state) => state.getTranscriptExportTypes.data.export_types
  );
  const translationExportTypes = useSelector(
    (state) => state.getTranslationExportTypes.data.export_types
  );

  const FetchTaskList = () => {
      const apiObj = new FetchTaskListAPI(projectId);
      dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    const statusData = selectedFilters?.status?.map((el) => el);
    setFilterStatus(statusData.toString());

    const taskTypeData = selectedFilters?.taskType?.map((el) => el);
    setFilterTaskType(taskTypeData.toString());
  }, [selectedFilters.status, selectedFilters?.taskType]);

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");

    const transcriptExportObj = new FetchTranscriptExportTypesAPI();
    dispatch(APITransport(transcriptExportObj));

    const translationExportObj = new FetchTranslationExportTypesAPI();
    dispatch(APITransport(translationExportObj));
    
    FetchTaskList();
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);
  const SearchProject = useSelector((state) => state.searchList.data);

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
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
      const task = taskList.tasks_list.filter(
        (task) => task.id === taskdata
      )[0];
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
      } else {
        console.log("failed");
      }
    });
  };

  const handledeletetask = async (id, flag) => {
    setDeleteTaskid(id);
    setLoading(true);
    setIsBulkTaskDelete(false);

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
      tableData.rowData[15]?.View && (
        <Tooltip title="View">
          <IconButton
            onClick={() => {
              setOpenViewTaskDialog(true);
              setCurrentTaskDetails(tableData.rowData);
            }}
            disabled={!tableData.rowData[11]}
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
      tableData.rowData[15]?.Export && (
        <Tooltip title="Export">
          <IconButton
            onClick={() =>
              handleClickOpen(tableData.rowData[0], tableData.rowData[1])
            }
            disabled={!tableData.rowData[11]}
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
      tableData.rowData[15]?.Edit && (
        <Tooltip title="Edit">
          <IconButton
            disabled={!tableData.rowData[11]}
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
      tableData.rowData[15]?.Delete && (
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
      tableData.rowData[15]?.Update && (
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
      tableData.rowData[15]?.Preview && (
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
  }, [taskList.tasks_list, SearchProject]);

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
      });
    } else {
      filterResult = lngResult;
    }
    taskList.filteredData = filterResult;
    setfilterData(filterResult);
    return taskList.tasks_list;
  };

  useMemo(() => {
    FilterData();
  }, [filterStatus, filterTaskType, selectedFilters, SearchProject]);

  useEffect(() => {
    const pageSearchData = filterData?.filter((el) => {
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
      }
    });
    setfilterData(pageSearchData);
  }, [SearchProject]);

  const result =
    taskList.tasks_list && taskList.tasks_list.length > 0
      ? filterData?.map((item, i) => {
          const status =
            item.status_label && UserMappedByRole(item.status_label)?.element;
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
            status ? status : item.status_label,
            item.user,
            item.is_active,
            `${item.user?.first_name} ${item.user?.last_name}`,
            item.project_name,
            item.video,
            item.buttons,
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
        display: false,
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
      name: "status_label",
      label: "Status",
      options: {
        filter: true,
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
                color: tableMeta.rowData[11] ? "" : "grey",
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
        display: "excluded",
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
                color: tableMeta.rowData[11] ? "" : "grey",
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
    const temp = taskList.tasks_list.filter((_item, index) => {
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
      FetchTaskList();
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
      onClick: () => {
        const taskIds = currentSelectedTasks.map((item) => item.id);
        handleBulkDelete(taskIds, false);
      },
      style: { backgroundColor: "red", marginRight: "auto" },
    },
    // {
    //   title: "Bulk Task Dowload",
    //   icon: <FileDownloadIcon />,
    //   onClick: () => {},
    //   style: { marginRight: "auto" },
    // },
  ];

  const renderToolBar = () => {
    return (
      <>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
          <Tooltip title={"Filter Table"}>
            <FilterListIcon sx={{ color: "#515A5A" }} />
          </Tooltip>
        </Button>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={classes.searchStyle}
        >
          {roles.filter((role) => role.value === userData?.role)[0]
            ?.permittedToCreateTask &&
            showEditTaskBtn &&
            toolBarActions.map((item) => {
              return (
                <Tooltip title={item.title} placement="bottom">
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

          {/* <Search /> */}
        </Box>
      </>
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
    search: true,
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
          taskList={taskList}
        />
      )}
    </>
  );
};

export default TaskList;
