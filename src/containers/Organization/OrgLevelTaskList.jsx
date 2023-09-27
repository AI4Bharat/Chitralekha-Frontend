// OrgLevelTaskList
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import C from "redux/constants";
import {
  exportFile,
  exportVoiceover,
  exportZip,
  getColumns,
  getOptions,
  roles,
} from "utils";
import {
  buttonConfig,
  failInfoColumns,
  orgTaskListColumns,
  toolBarActions,
} from "config";
import { renderTaskListColumnCell } from "config/tableColumns";

//Themes
import { DatasetStyle, TableStyles } from "styles";
import { tableTheme } from "theme";

//Components
import {
  ThemeProvider,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Button,
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
} from "common";

//Icons
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

// Utils
import getLocalStorageData from "utils/getLocalStorageData";

// Config
import { org_ids } from "config";

//Apis
import {
  APITransport,
  BulkTaskExportAPI,
  CompareTranscriptionSource,
  ComparisionTableAPI,
  DeleteBulkTaskAPI,
  DeleteTaskAPI,
  EditBulkTaskDetailAPI,
  EditTaskDetailAPI,
  ExportVoiceoverTaskAPI,
  FetchPaginatedOrgTaskListAPI,
  FetchSupportedLanguagesAPI,
  FetchTaskFailInfoAPI,
  FetchTranscriptExportTypesAPI,
  FetchTranslationExportTypesAPI,
  FetchVoiceoverExportTypesAPI,
  FetchpreviewTaskAPI,
  GenerateTranslationOutputAPI,
  ReopenTaskAPI,
  UploadToYoutubeAPI,
  clearComparisonTable,
  exportTranscriptionAPI,
  exportTranslationAPI,
  setComparisonTable,
  setSnackBar,
} from "redux/actions";

const OrgLevelTaskList = () => {
  const user_org_id = getLocalStorageData("userData").organization.id;
  const [desc, setShowDesc] = useState(false);
  const [org_id, setId] = useState();

  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const tableClasses = TableStyles();
  const navigate = useNavigate();

  //Table States
  const [tableData, setTableData] = useState([]);
  const [options, setOptions] = useState();
  const [rows, setRows] = useState([]);

  //Filter States
  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    taskType: [],
    srcLanguage: [],
    tgtLanguage: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState([]);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteResponse, setDeleteResponse] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const [currentTaskDetails, setCurrentTaskDetails] = useState();
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
    tableDialog: false,
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

  //Server Side Pagination States
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const [searchedCol, setSearchedCol] = useState({});
  const [searchedColumn, setSearchedColumn] = useState({});
  const [columnDisplay, setColumnDisplay] = useState(false);

  const [exportTypes, setExportTypes] = useState({
    transcription: "srt",
    translation: "srt",
    voiceover: "mp4",
    speakerInfo: "false",
    bgMusic: "false",
  });
  const [uploadExportType, setUploadExportType] = useState("srt");
  const [alertColumn, setAlertColumn] = useState("");

  const userData = useSelector((state) => state.getLoggedInUserDetails.data);
  const orgId = userData?.organization?.id;

  const apiStatus = useSelector((state) => state.apiStatus);
  const previewData = useSelector(
    (state) => state.getPreviewData?.data?.data?.payload
  );

  useEffect(() => {
    const { progress, success, apiType, data } = apiStatus;
    if (!progress) {
      if (success) {
        switch (apiType) {
          case "EXPORT_VOICEOVER_TASK":
            exportVoiceover(data.azure_url, currentTaskDetails, exportTypes);
            handleDialogClose("exportDialog");
            break;

          case "DELETE_TASK":
            handleDialogClose("deleteDialog");
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

          case "EDIT_BULK_TASK_DETAILS" || "EDIT_TASK_DETAILS":
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
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const { total_count: totalCount, tasks_list: taskList } = useSelector(
    (state) => state.getOrgTaskList.data
  );

  const fetchTaskList = () => {
    setLoading(true);

    const search = {
      task_id: searchedColumn?.id,
      video_name: searchedColumn?.video_name,
      description: searchedColumn?.description,
      assignee: searchedColumn?.user,
    };

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

    const apiObj = new FetchPaginatedOrgTaskListAPI(
      orgId,
      offset + 1,
      limit,
      searchRequest,
      filterRequest
    );
    dispatch(APITransport(apiObj));
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
      dispatch({ type: C.CLEAR_ORG_TASK_LIST, payload: [] });
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (orgId) {
      fetchTaskList();
    }

    // eslint-disable-next-line
  }, [orgId, offset, limit, searchedColumn, selectedFilters]);

  useEffect(() => {
    if (taskList) {
      setLoading(false);
      setTableData(taskList);
    }
  }, [taskList]);

  const exportVoiceoverTask = async () => {
    const { id: taskId } = currentTaskDetails;
    const { voiceover, bgMusic } = exportTypes;

    const apiObj = new ExportVoiceoverTaskAPI(taskId, voiceover, bgMusic);
    dispatch(APITransport(apiObj));
  };

  const handleTranscriptExport = async () => {
    const { id: taskId } = currentTaskDetails;
    const { transcription, speakerInfo } = exportTypes;

    const apiObj = new exportTranscriptionAPI(
      taskId,
      transcription,
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

        exportFile(resp, currentTaskDetails, transcription, "transcription");
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
    }
  };

  const handleTranslationExport = async () => {
    const { id: taskId } = currentTaskDetails;
    const { translation, speakerInfo } = exportTypes;

    const apiObj = new exportTranslationAPI(taskId, translation, speakerInfo);
    handleDialogClose("exportDialog");

    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();

        exportFile(resp, currentTaskDetails, translation, "translation");
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
    }
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
  };

  const handlePreviewTask = async (id, taskType, targetlanguage) => {
    handleDialogOpen("previewDialog");

    const taskObj = new FetchpreviewTaskAPI(id, taskType, targetlanguage);
    dispatch(APITransport(taskObj));
  };

  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol({
      label: col.label,
      name: col.name,
    });

    if (col.name === "description") {
      setColumnDisplay(true);
    }
  };

  const CustomTableHeader = (col) => {
    return (
      <>
        <Box className={tableClasses.customTableHeader}>
          {col.label}
          <IconButton
            sx={{ borderRadius: "100%" }}
            onClick={(e) => handleShowSearch(col, e)}
          >
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>
        </Box>
      </>
    );
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
        handleDialogOpen("exportDialog");
        setIsBulkTaskDownload(false);
        break;

      case "Preview":
        handlePreviewTask(video, task_type, target_language);
        break;

      case "Delete":
        handleDeleteTask(id, false);
        break;

      case "Info":
        const infoObj = new FetchTaskFailInfoAPI(id);
        dispatch(APITransport(infoObj));
        break;

      case "Reopen":
        const apiObj = new ReopenTaskAPI(id);
        dispatch(APITransport(apiObj));
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
        display: org_ids.includes(user_org_id) ? true : columnDisplay,
        align: "center",
        customHeadLabelRender: CustomTableHeader,
        customBodyRender: !org_ids.includes(user_org_id) ? renderTaskListColumnCell : (value, tableMeta) => {
          const { tableData: data, rowIndex } = tableMeta;
          const selectedTask = data[rowIndex];
          const slicedDesc = String(value).slice(0, 10);

          const handleMouseOver = () => {
            const rowData = tableMeta.rowData;
            setShowDesc(true);
            setId(rowData[0]);
          }

          return (
            <Box
              id={selectedTask.id}
              onMouseOver = {handleMouseOver}
              onMouseOut={() => setShowDesc(false)}
              style={{
                color: selectedTask.is_active ? "" : "grey",
              }}
            >
              {!desc ? slicedDesc : (org_id === tableMeta.rowData[0] ? value : slicedDesc)}
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

    const columns = [...getColumns(orgTaskListColumns), actionColumn];
    columns.splice(0, 1, id);
    columns.splice(2, 0, videoName);
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

    handleDialogClose("deleteDialog");
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
            toolBarActions.map((item, index) => {
              return (
                <Tooltip key={index} title={item.title} placement="bottom">
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

  useEffect(() => {
    let option = getOptions(loading);

    const newOptions = {
      ...option,
      selectableRows: roles.filter((role) => role.value === userData?.role)[0]
        ?.showSelectCheckbox
        ? "multiple"
        : "none",
      selectToolbarPlacement: "none",
      search: false,
      serverSide: true,
      page: offset,
      rowsSelected: rows,
      rowsPerPage: limit,
      count: totalCount,
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
    dispatch(APITransport(userObj));

    handleDialogClose("editTaskDialog");
  };

  const handleBulkTaskDownload = async () => {
    handleDialogClose("exportDialog");
    const { translation } = exportTypes;

    const apiObj = new BulkTaskExportAPI(translation, selectedBulkTaskid);
    try {
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });

      if (res.ok) {
        const resp = await res.blob();
        exportZip(resp);
      }  else {
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
    }
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

  const handleExportSubmitClick = () => {
    if (isBulkTaskDownload) {
      handleBulkTaskDownload();
    } else {
      const { task_type: taskType } = currentTaskDetails;

      if (taskType?.includes("TRANSCRIPTION")) {
        handleTranscriptExport();
      } else if (taskType?.includes("TRANSLATION")) {
        handleTranslationExport();
      } else {
        exportVoiceoverTask();
      }
    }
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

  const handleDialogOpen = (key) => {
    setOpenDialogs((prevState) => ({
      ...prevState,
      [key]: true,
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
          taskType={currentTaskDetails?.task_type}
          exportTypes={exportTypes}
          handleExportSubmitClick={handleExportSubmitClick}
          handleExportRadioButtonChange={handleExportRadioButtonChange}
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
          currentTaskDetails={currentTaskDetails}
          loading={loading}
          isBulk={isBulk}
          projectId={currentTaskDetails?.project}
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

      {Boolean(searchAnchor) && (
        <TableSearchPopover
          open={Boolean(searchAnchor)}
          anchorEl={searchAnchor}
          handleClose={() => setSearchAnchor(null)}
          updateFilters={setSearchedColumn}
          currentFilters={searchedColumn}
          searchedCol={searchedCol}
        />
      )}

      {openDialogs.tableDialog && (
        <TableDialog
          openDialog={openDialogs.tableDialog}
          handleClose={() => handleDialogClose("tableDialog")}
          message={tableDialogMessage}
          response={tableDialogResponse}
          columns={tableDialogColumn}
        />
      )}
    </>
  );
};

export default OrgLevelTaskList;
