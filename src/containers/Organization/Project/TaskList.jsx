import React, { useEffect, useState } from "react";

//Themes
import { ThemeProvider } from "@mui/material";
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

const data = [
  {
    id: 1,
    task_uuid: "ea827352-7062-4f77-a35a-707be95c8c6d",
    task_type: "TRANSLATION_EDIT",
    target_language: "hi",
    status: "NEW",
    video: 1,
    user: 2,
    created_by: 1,
  },
  {
    id: 2,
    task_uuid: "0e09bccc-fa4d-4fde-987b-afff09a03265",
    task_type: "TRANSLATION_EDIT",
    target_language: "hi",
    status: "NEW",
    video: 2,
    user: 3,
    created_by: 1,
  },
  {
    id: 3,
    task_uuid: "c8a637b8-c399-4d02-8a79-09158f9710cc",
    task_type: "TRANSCRIPTION_REVIEW",
    target_language: "bn",
    status: "NEW",
    video: 3,
    user: 2,
    created_by: 1,
  },
];

const TaskList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);

  useEffect(() => {
    const apiObj = new FetchTaskListAPI(projectId);
    dispatch(APITransport(apiObj));
  }, []);

  const taskList = useSelector((state) => state.getTaskList.data);

  const columns = [
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
          style: { height: "30px", fontSize: "16px" },
        }),
        customBodyRender: () => {
          return (
            <CustomButton
              sx={{ borderRadius: 2, marginRight: 2 }}
              label="View"
              onClick={() => setOpenViewTaskDialog(true)}
            />
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
        <MUIDataTable data={data} columns={columns} options={options} />
      </ThemeProvider>

      {openViewTaskDialog && (
        <ViewTaskDialog
          open={openViewTaskDialog}
          handleClose={() => setOpenViewTaskDialog(false)}
          submitHandler={() => {}}
        />
      )}
    </>
  );
};

export default TaskList;
