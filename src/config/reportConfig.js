export const reportLevels = [
  {
    reportLevel: "Task",
    endPoint: "get_tasks_report",
    downloadEndPoint: "send_tasks_report_email",
  },
  {
    reportLevel: "User",
    endPoint: "get_report_users",
    downloadEndPoint: "send_users_report_email",
  },
  {
    reportLevel: "Project",
    endPoint: "get_report_projects",
    downloadEndPoint: "send_projects_report_email",
  },
  {
    reportLevel: "Project Language",
    endPoint: "get_report_languages",
    downloadEndPoint: "send_languages_report_email",
  },
];

export const languagelevelStats = [
  { lable: "Transcript", value: "transcript_stats" },
  { lable: "Translation", value: "translation_stats" },
  { lable: "Voiceover", value: "voiceover_stats" },
];

export const projectReportLevels = [
  { reportLevel: "User" },
  { reportLevel: "Language" },
];
