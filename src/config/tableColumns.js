import { Box } from "@mui/material";
import moment from "moment";

export const projectColumns = [
  {
    name: "title",
    label: "Name",
  },
  {
    name: "Manager",
    label: "Manager",
  },
  {
    name: "createdAt",
    label: "Created At",
  },
  {
    name: "createdBy",
    label: "Created By",
  },
  {
    name: "Action",
    label: "Actions",
  },
];

export const usersColumns = [
  {
    name: "name",
    label: "Name",
  },
  {
    name: "email",
    label: "Email",
  },
  {
    name: "role",
    label: "Role",
  },
  {
    name: "Action",
    label: "Actions",
  },
];

export const adminOrgListColumns = [
  {
    name: "id",
    label: "id",
    options: {
      display: "excluded",
    },
  },
  {
    name: "title",
    label: "Organization",
  },
  {
    name: "organization_owner",
    label: "Organization Owner",
    options: {
      customBodyRender: (value) => {
        return <Box>{`${value?.first_name} ${value?.last_name}`}</Box>;
      },
    },
  },
  {
    name: "created_by",
    label: "Created By",
    options: {
      customBodyRender: (value) => {
        return <Box>{`${value?.first_name} ${value?.last_name}`}</Box>;
      },
    },
  },
  {
    name: "created_at",
    label: "Created At",
    options: {
      customBodyRender: (value) => {
        return (
          <div style={{ textTransform: "none" }}>
            {moment(value).format("DD/MM/YYYY hh:mm:ss")}
          </div>
        );
      },
    },
  },
  {
    name: "email_domain_name",
    label: "Email Domain Name",
  },
];

export const adminMemberListColumns = [
  {
    name: "id",
    label: "id",
    options: {
      display: "excluded",
    },
  },
  {
    name: "first_name",
    label: "Name",
  },
  {
    name: "organization",
    label: "Organization",
    options: {
      customBodyRender: (value) => {
        return <Box sx={{ display: "flex" }}>{value?.title}</Box>;
      },
    },
  },
  {
    name: "email",
    label: "Email",
  },
  {
    name: "role_label",
    label: "Role",
  },
];

export const videoTaskListColumns = [
  {
    name: "task_type",
    label: "Task Type",
  },
  {
    name: "user",
    label: "Assigned User",
    options: {
      customBodyRender: (value) => {
        return <Box>{`${value.first_name} ${value.last_name}`}</Box>;
      },
    },
  },
  {
    name: "created_at",
    label: "Created At",
    options: {
      customBodyRender: (value) => {
        return <Box>{moment(value).format("DD/MM/YYYY HH:mm:ss")}</Box>;
      },
    },
  },
  {
    name: "status",
    label: "Status",
  },
  {
    name: "src_language_label",
    label: "Source Language",
  },
  {
    name: "target_language_label",
    label: "Target Language",
  },
  {
    name: "priority",
    label: "Priority",
  },
];

export const videoListColumns = [
  {
    name: "id",
    label: "Video Id",
    options: {
      setCellHeaderProps: () => ({
        style: { width: "60px" },
      }),
    },
  },
  {
    name: "name",
    label: "Video Name",
  },
  {
    name: "url",
    label: "URL",
  },
  {
    name: "duration",
    label: "Duration",
  },
  {
    name: "status",
    label: "Status",
    options: {
      viewColumns: false,
      display: "exclude",
    },
  },
  {
    name: "description",
    label: "Description",
    options: {
      display: "exclude",
    },
  },
  {
    name: "Action",
    label: "Actions",
  },
];

export const taskListColumns = [
  {
    name: "id",
    label: "Id",
    options: {
      display: "exclude",
    },
  },
  {
    name: "task_type",
    label: "",
    options: {
      display: "excluded",
    },
  },
  {
    name: "task_type_label",
    label: "Task Type",
    options: {
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
    name: "video_name",
    label: "Video Name",
    options: {
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
    name: "created_at",
    label: "Created At",
    options: {
      display: false,
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
    name: "src_language",
    label: "",
    options: {
      display: "excluded",
    },
  },
  {
    name: "src_language_label",
    label: "Source Language",
    options: {
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
    name: "target_language",
    label: "",
    options: {
      display: "excluded",
    },
  },
  {
    name: "target_language_label",
    label: "Target Language",
    options: {
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
    name: "status_label",
    label: "Status",
    options: {
      sort: false,
      align: "center",
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
      display: "excluded",
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
    name: "time_spent",
    label: "Time Spent",
    options: {
      customBodyRender: (value, tableMeta) => {
        return (
          <Box
            style={{
              color: tableMeta.rowData[11] ? "" : "grey",
              textAlign: "right"
            }}
          >
            {value}
          </Box>
        );
      },
    },
  },
  {
    name: "description",
    label: "Description",
    options: {
      display: "exclude",
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
    name: "status",
    label: "",
    options: {
      display: "excluded",
      viewColumns: false,
    },
  },
];

export const taskQueueStatusColumns = [
  {
    name: "S. No",
    label: "Seq. No.",
  },
  {
    name: "task_id",
    label: "Task Id",
    options: {
      display: false,
    },
  },
  {
    name: "video_id",
    label: "Video Id",
  },
  {
    name: "submitter_name",
    label: "Submitter",
  },
  {
    name: "org_name",
    label: "Organization",
  },
  {
    name: "video_duration",
    label: "Video Duration",
  },
];
