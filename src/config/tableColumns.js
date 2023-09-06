import { Box } from "@mui/material";
import moment from "moment";
import statusColor from "../utils/getStatusColor";

export const projectColumns = [
  {
    name: "title",
    label: "Name",
  },
  {
    name: "managers",
    label: "Manager",
    options: {
      customBodyRender: (value) => {
        return <Box>{value[0]?.email}</Box>;
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
    name: "created_by",
    label: "Created By",
    options: {
      customBodyRender: (value) => {
        return (
          <Box>
            {value.first_name} {value.last_name}
          </Box>
        );
      },
    },
  },
];

export const usersColumns = [
  {
    name: "name",
    label: "Name",
    options: {
      customBodyRender: (_value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];

        return (
          <Box>
            {selectedRow.first_name} {selectedRow.last_name}
          </Box>
        );
      },
    },
  },
  {
    name: "email",
    label: "Email",
  },
  {
    name: "languages",
    label: "Languages",
    options: {
      customBodyRender: (value) => {
        return <Box>{value?.join(", ")}</Box>;
      },
    },
  },
  {
    name: "role",
    label: "Role",
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

export const renderTaskListColumnCell = (value, tableMeta) => {
  const { tableData: data, rowIndex } = tableMeta;
  const selectedTask = data[rowIndex];

  return (
    <Box
      style={{
        color: selectedTask.is_active ? "" : "grey",
      }}
    >
      {value}
    </Box>
  );
};

export const taskListColumns = [
  {	
    name: "id",	
    label: "Id",	
    options: {	
      customBodyRender: renderTaskListColumnCell,	
    },	
  },
  {
    name: "task_type_label",
    label: "Task Type",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "created_at",
    label: "Created At",
    options: {
      display: false,
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
  },
  {
    name: "src_language_label",
    label: "Source Language",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "target_language_label",
    label: "Target Language",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "status_label",
    label: "Status",
    options: {
      sort: false,
      align: "center",
      customBodyRender: (value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedTask = data[rowIndex];

        return (
          <Box
            style={{
              color: selectedTask.is_active ? "" : "grey",
            }}
          >
            {statusColor(value)?.element}
          </Box>
        );
      },
    },
  },
  {
    name: "time_spent",
    label: "Time Spent",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
];

export const orgTaskListColumns = [
  {	
    name: "id",	
    label: "Id",	
    options: {	
      customBodyRender: renderTaskListColumnCell,	
    },	
  },
  {
    name: "task_type_label",
    label: "Task Type",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "created_at",
    label: "Created At",
    options: {
      display: localStorage.getItem("tableCurrentState").columns?.[3].display ? localStorage.getItem("tableCurrentState").columns?.[3].display : false,
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
  },
  {
    name: "src_language_label",
    label: "Source Language",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "target_language_label",
    label: "Target Language",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "status_label",
    label: "Status",
    options: {
      sort: false,
      align: "center",
      customBodyRender: (value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedTask = data[rowIndex];

        return (
          <Box
            style={{
              color: selectedTask.is_active ? "" : "grey",
            }}
          >
            {statusColor(value)?.element}
          </Box>
        );
      },
    },
  },
  {
    name: "project_name",
    label: "Project Name",
    options: {
      customBodyRender: renderTaskListColumnCell,
    },
  },
  {
    name: "time_spent",
    label: "Time Spent",
    options: {
      customBodyRender: renderTaskListColumnCell,
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

export const failInfoColumns = [
  {
    name: "index",
    label: "Id",
  },
  {
    name: "page_number",
    label: "Page Number",
  },
  {
    name: "start_time",
    label: "Start Time",
  },
  {
    name: "end_time",
    label: "End Time",
  },
  {
    name: "text",
    label: "Source Text",
  },
  {
    name: "target_text",
    label: "Target Text",
  },
];

export const voiceoverFailInfoColumns = [
  {
    name: "index",
    label: "Id",
  },
  {
    name: "page_number",
    label: "Page Number",
  },
  {
    name: "reason",
    label: "Reason",
  },
  {
    name: "sentence",
    label: "Sentence",
  },
];
