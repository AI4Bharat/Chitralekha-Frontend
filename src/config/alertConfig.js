import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Box } from "@mui/material";
import { ProjectStyle } from "styles";

export const createVideoAlertColumns = (data) => {
  const classes = ProjectStyle();

  return [
    {
      name: "task_type",
      label: "Task Type",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        customBodyRender: (value, tableMeta) => {
          return <Box className={classes.contentTaskType}>{value}</Box>;
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({ style: { width: "30%" } }),
        customBodyRender: (value, tableMeta) => {
          const { rowIndex } = tableMeta;
          const selectedRow = data[rowIndex];
          return (
            <Box key={rowIndex} className={classes.contentParent}>
              <Box className={classes.contentStatusTop}>
                {!selectedRow.task_type.includes("Transcription")
                  ? `${selectedRow.source_language} - ${selectedRow.target_language}`
                  : selectedRow.source_language}
              </Box>
              <Box>
                {selectedRow.status === "Fail" ? (
                  <CancelOutlinedIcon color="error" />
                ) : (
                  <TaskAltIcon color="success" />
                )}
              </Box>
            </Box>
          );
        },
      },
    },
    {
      name: "message",
      label: "Message",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({ style: { width: "30%" } }),
      },
    },
  ];
};

export const csvAlertColumns = () => {
  return [
    {
      name: "row_no",
      label: "Row Number",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
      },
    },
    {
      name: "message",
      label: "Message",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({ style: { width: "30%" } }),
      },
    },
  ];
};

export const uploadAlertColumns = (data) => {
  const classes = ProjectStyle();

  return [
    {
      name: "video_name",
      label: "Video Name",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
      },
    },
    {
      name: "source_language",
      label: "Language",
      customBodyRender: (value, tableMeta) => {
        const { rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];
        return (
          <Box className={classes.content}>
            {`${
              selectedRow.task_type.includes("TRANSLATION")
                ? selectedRow.target_language
                : selectedRow.source_language
            }`}
          </Box>
        );
      },
    },
    {
      name: "status",
      label: "Status",
      customBodyRender: (value, tableMeta) => {
        const { rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];
        return (
          <Box className={classes.contentStatus}>
            <Box className={classes.contentStatusTop}>{selectedRow.status}</Box>
            <Box>
              {selectedRow.status === "Fail" ? (
                <CancelOutlinedIcon color="error" />
              ) : (
                <TaskAltIcon color="success" />
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      name: "message",
      label: "Message",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({ style: { width: "30%" } }),
      },
    },
  ];
};

export const updateRoleAlertColumns = () => {
  return [
    {
      name: "id",
      label: "Task Id",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "20%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "20%", textAlign: "center" },
        }),
      },
    },
    {
      name: "task_type_label",
      label: "Task Type",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
      },
    },
    {
      name: "video_name",
      label: "Video Name",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
      },
    },
    {
      name: "project_name",
      label: "Project Name",
      options: {
        setCellHeaderProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
        setCellProps: () => ({
          style: { width: "30%", textAlign: "center" },
        }),
      },
    },
  ];
};
