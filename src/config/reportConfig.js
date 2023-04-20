export const reportLevels = [
  { reportLevel: "Aggregated User", endPoint: "get_aggregated_report_users" },
  { reportLevel: "Aggregated Language", endPoint: "get_aggregated_report_languages" },
  { reportLevel: "Project", endPoint: "get_report_projects" },
  { reportLevel: "User", endPoint: "get_report_users" },
  { reportLevel: "Project Language", endPoint: "get_report_languages" },
  { reportLevel: "Task", endPoint: "get_tasks_report" },
];

export const languagelevelStats = [
  { lable: "Transcript", value: "transcript_stats" },
  { lable: "Translation", value: "translation_stats" },
];

export const projectReportLevels = [
  { reportLevel: "User" },
  { reportLevel: "Language" },
];
