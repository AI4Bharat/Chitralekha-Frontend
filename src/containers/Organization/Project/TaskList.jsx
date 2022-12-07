import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider, Box, Grid } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import CustomButton from "../../../common/Button";
import CustomizedSnackbars from "../../../common/Snackbar";

//Apis
import FetchTaskListAPI from "../../../redux/actions/api/Project/FetchTaskList";
import APITransport from "../../../redux/actions/apitransport/apitransport";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ViewTaskDialog from "../../../common/ViewTaskDialog";
import { useNavigate } from "react-router-dom";
import CompareTranscriptionSource from "../../../redux/actions/api/Project/CompareTranscriptionSource";
import setComparisonTable from "../../../redux/actions/api/Project/SetComparisonTableData";
import clearComparisonTable from "../../../redux/actions/api/Project/ClearComparisonTable";
import DeleteTaskAPI from "../../../redux/actions/api/Project/DeleteTask";
import ComparisionTableAPI from "../../../redux/actions/api/Project/ComparisonTable";

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [taskid, setTaskid] = useState();

  const navigate = useNavigate();

  const FetchTaskList = () => {
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");
    FetchTaskList();
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);
  // const getTranscriptionSourceComparison = (id, source) => {

  const onTranslationTaskTypeSubmit = async (id, rsp_data) => {
    const payloadData = {
      type: Object.keys(rsp_data.payloads)[0],
      payload: {
        payload: rsp_data.payloads[Object.keys(rsp_data.payloads)[0]]?.payload,
      },
    };
    const comparisonTableObj = new ComparisionTableAPI(id, payloadData);
    dispatch(APITransport(comparisonTableObj));

    navigate(`/${id}/transcript`);
  }

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
      console.log("rsp_data --------- ", rsp_data);
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

  useEffect(() => {
    let taskId;
    taskList?.map((element, index) => {
      taskId = element.id;
    });
    setTaskid(taskId);
  }, [taskList]);

  const handledeletetask = async () => {
    const apiObj = new DeleteTaskAPI(taskid);
    fetch(apiObj.apiEndPoint(), {
      method: "DELETE",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then((response) => {
      if (response.status === 204) {
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: "",
          variant: "success",
        });
        FetchTaskList();
      } else {
        setSnackbarInfo({
          ...snackbar,
          open: true,
          message: " ",
          variant: "error",
        });
      }
    });

    // const submitTranslation = (id, source) => {
  };

  const renderViewButton = (tableData) => {
    console.log(tableData, "tableDatatableData");
    return (
      (tableData.rowData[5] === "NEW" ||
        tableData.rowData[5] === "INPROGRESS") && (
        <CustomButton
          sx={{ borderRadius: 2 }}
          label="View"
          onClick={() => {
            setOpenViewTaskDialog(true);
            setCurrentTaskDetails(tableData.rowData);
          }}
        />
      )
    );
  };

  const renderEditButton = (tableData) => {
    console.log("tableData ---- ", tableData);
    return(
      ((tableData.rowData[5] === "SELECTED_SOURCE" && (tableData.rowData[1] === "TRANSCRIPTION_EDIT" || tableData.rowData[1] === "TRANSLATION_EDIT")) 
      || (tableData.rowData[1] === "TRANSCRIPTION_REVIEW" || tableData.rowData[1] === "TRANSLATION_REVIEW")) && 
      <CustomButton
        sx={{ borderRadius: 2}}
        label="Edit"
        onClick={() => {
          navigate(`/${tableData.rowData[0]}/transcript`);
          console.log("Edit Button ---- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const renderDeleteButton = (tableData) => {
    return (
      <CustomButton
        sx={{ borderRadius: 2, marginLeft: 2 }}
        color="error"
        label="Delete"
        onClick={handledeletetask}
      />
    );
  };

  const columns = [
    {
      name: "id",
      label: "#",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "source_language",
      label: "Source Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
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
          style: { height: "30px", fontSize: "16px", textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box sx={{ display: "flex" }}>
              {renderViewButton(tableMeta)}
              {renderEditButton(tableMeta)}
              {renderDeleteButton(tableMeta)}
            </Box>

            // <CustomButton
            //   sx={{ borderRadius: 2, marginRight: 2 }}
            //   label="View"
            //   onClick={() => {
            //     setOpenViewTaskDialog(true);
            //     setCurrentTaskDetails(tableMeta.rowData);
            //   }}
            // />
          );
        },
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

  return (
    <>
      <Grid>{renderSnackBar()}</Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={taskList} columns={columns} options={options} />
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
    </>
  );
};

export default TaskList;
