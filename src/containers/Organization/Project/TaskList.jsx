import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider, Box } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import CustomButton from "../../../common/Button";

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

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [currentTaskDetails, setCurrentTaskDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("sourceTypeList");
    localStorage.removeItem("sourceId");
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);

  const getTranscriptionSourceComparison = (id, source) => {
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
      } else {
        console.log("failed");
      }
    });
  };

  const renderViewButton = (tableData) => {
    return (
      (tableData.rowData[5] === "NEW" || tableData.rowData[5] === "INPROGRESS") && <CustomButton
        sx={{ borderRadius: 2}}
        label="View"
        onClick={() => {
          setOpenViewTaskDialog(true);
          setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const renderEditButton = (tableData) => {
    return(
      tableData.rowData[5] === "SELECTED_SOURCE" && <CustomButton
        sx={{ borderRadius: 2}}
        label="Edit"
        onClick={() => {
          console.log("Edit Button --- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

  const renderDeleteButton = (tableData) => {
    return (
      <CustomButton
        sx={{ borderRadius: 2, marginLeft: 2}}
        color="error"
        label="Delete"
        onClick={() => {
          console.log("Delete Button --- ", tableData.rowData);
          // setOpenViewTaskDialog(true);
          // setCurrentTaskDetails(tableData.rowData);
        }}
      />
    )
  }

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
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta) => {
          return (
            <Box sx={{display: 'flex'}}>
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
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={taskList} columns={columns} options={options} />
      </ThemeProvider>

      {openViewTaskDialog && (
        <ViewTaskDialog
          open={openViewTaskDialog}
          handleClose={() => setOpenViewTaskDialog(false)}
          submitHandler={(id, source) => {
            dispatch(clearComparisonTable());
            localStorage.setItem("sourceId", id);
            if (source.length) getTranscriptionSourceComparison(id, source);
            navigate(`/comparison-table/${id}`);
          }}
          id={currentTaskDetails[0]}
        />
      )}
    </>
  );
};

export default TaskList;
