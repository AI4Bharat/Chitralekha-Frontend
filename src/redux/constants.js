const constants = {
  APISTATUS: "APISTATUS",
  
  //organization
  GET_ORGANIZATION_DETAILS: "GET_ORGANIZATION_DETAILS",
  EDIT_ORGANIZATION_DETAILS: "EDIT_ORGANIZATION_DETAILS",
  ADD_ORGANIZATION_MEMBER: "ADD_ORGANIZATION_MEMBER",
  GET_ORGANIZATION_USERS: "GET_ORGANIZATION_USERS",
  GET_ORGANIZATION_PROJECT_MANAGER_USER:
    "GET_ORGANIZATION_PROJECT_MANAGER_USER",
  GET_USERS_ROLES: "GET_USERS_ROLES",
  CREATE_NEW_ORGANIZATION: "CREATE_NEW_ORGANIZATION",
  GET_ORGANIZATION_LIST: "GET_ORGANIZATION_LIST",
  DELETE_ORGANIZATION: "DELETE_ORGANIZATION",
  GET_ORGANIZATION_REPORTS: "GET_ORGANIZATION_REPORTS",
  DOWNLOAD_ORGANIZATION_REPORTS:"DOWNLOAD_ORGANIZATION_REPORTS",
  GET_ORG_TASK_LIST: "GET_ORG_TASK_LIST",
  CLEAR_ORG_TASK_LIST: "CLEAR_ORG_TASK_LIST",

  //project
  GET_PROJECT_LIST: "GET_PROJECT_LIST",
  CREATE_NEW_PROJECT: "CREATE_NEW_PROJECT",
  GET_PROJECT_DETAILS: "GET_PROJECT_DETAILS",
  EDIT_PROJECT_DETAILS: "EDIT_PROJECT_DETAILS",
  ARCHIVE_PROJECT: "ARCHIVE_PROJECT",
  GET_PROJECT_VIDEOS: "GET_PROJECT_VIDEOS",
  REMOVE_PROJECT_MEMBER: "REMOVE_PROJECT_MEMBER",
  GET_PROJECT_MEMBERS: "GET_PROJECT_MEMBERS",
  GET_LANGUAGES: "GET_LANGUAGES",
  CREATE_NEW_VIDEO: "CREATE_NEW_VIDEO",
  COMPARE_TRANSCRIPTION_SOURCE: "COMPARE_TRANSCRIPTION_SOURCE",
  CLEAR_COMPARISON_TABLE: "CLEAR_COMPARISON_TABLE",
  COMPARISION_TABLE: "COMPARISION_TABLE",
  GET_PRIORITY_TYPES: "GET_PRIORITY_TYPES",
  DELETE_TASK: "DELETE_TASK",
  GET_VIDEO_TASK_LIST: "GET_VIDEO_TASK_LIST",
  GET_MANAGER_NAME: "GET_MANAGER_NAME",
  DELETE_Project: "DELETE_Project",
  ADD_PROJECT_MEMBERS: "ADD_PROJECT_MEMBERS",
  EXPORT_TRANSCRIPTION: "EXPORT_TRANSCRIPTION",
  DELETE_VIDEO: "DELETE_VIDEO",
  EXPORT_TRANLATION: "EXPORT_TRANLATION",
  SEARCH_LIST: "SEARCH_LIST",
  GET_VIDEO_SUBTITLE: "GET_VIDEO_SUBTITLE",
  GET_PROJECT_REPORTS: "GET_PROJECT_REPORTS",
  DOWNLOAD_PROJECT_REPORTS: "DOWNLOAD_PROJECT_REPORTS",
  GET_FULL_PAYLOAD: "GET_FULL_PAYLOAD",
  CLEAR_PROJECT_TASK_LIST: "CLEAR_PROJECT_TASK_LIST",
  CLEAR_PROJECT_VIDEOS: "CLEAR_PROJECT_VIDEOS",
  GET_TRANSCRIPT_EXPORT_TYPE: "GET_TRANSCRIPT_EXPORT_TYPE",
  GET_TRANSLATION_EXPORT_TYPE: "GET_TRANSLATION_EXPORT_TYPE",

  //User
  GET_USER_LIST: "GET_USER_LIST",
  GET_LOGGEDIN_USER_DETAILS: "GET_LOGGEDIN_USER_DETAILS",
  UPDATE_EMAIL: "UPDATE_EMAIL",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  VERIFY_UPDATE_EMAIL: "VERIFY_UPDATE_EMAIL",
  GET_USER_DETAILS: "GET_USER_DETAILS",
  GET_USER_ACCESS_TOKEN: "GET_USER_ACCESS_TOKEN",
  LOGOUT: "LOGOUT",
  GET_INVITE_USER_DETAILS: "GET_INVITE_USER_DETAILS",
  TOGGLE_MAILS: "TOGGLE_MAILS",
  SIGNUP: "SIGNUP",
  UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
  SUBSCRIBE_TO_NEWSLETTER: "SUBSCRIBE_TO_NEWSLETTER",

  //Task
  CREATE_NEW_TASk: "CREATE_NEW_TASk",
  GET_TASK_LIST: "GET_TASK_LIST",
  GET_TASK_DETAILS: "GET_TASK_DETAILS",
  GET_TRANSCRIPT_TYPES: "GET_TRANSCRIPT_TYPES",
  GET_VIDEO_DETAILS: "GET_VIDEO_DETAILS",
  CLEAR_VIDEO_DETAILS: "CLEAR_VIDEO_DETAILS",
  GET_TASK_TYPE: "GET_TASK_TYPE",
  GET_ALLOWED_TASK: "GET_ALLOWED_TASK",
  GET_SUPPORTED_LANGUAGES: "GET_SUPPORTED_LANGUAGES",
  GET_SUPPORTED_VOICEOVER_LANGUAGES: "GET_SUPPORTED_VOICEOVER_LANGUAGES",
  GET_SUPPORTED_TRANSLATION_LANGUAGES: "GET_SUPPORTED_TRANSLATION_LANGUAGES",
  GET_SUPPORTED_TRANSCRIPTION_LANGUAGES:
    "GET_SUPPORTED_TRANSCRIPTION_LANGUAGES",
  GET_TRANSCRIPT_PAYLOAD: "GET_TRANSCRIPT_PAYLOAD",
  SAVE_TRANSCRIPT: "SAVE_TRANSCRIPT",
  GET_TRANSLATION_TYPES: "GET_TRANSLATION_TYPES",
  GET_VOICEOVER_EXPORT_TYPE: "GET_VOICEOVER_EXPORT_TYPE",
  GET_BULK_TASK_TYPE: "GET_BULK_TASK_TYPE",
  DELETE_BULK_TASK: "DELETE_BULK_TASK",
  GET_TASK_QUEUE_STATUS: "GET_TASK_QUEUE_STATUS",
  LIMIT: "LIMIT",
  UPDATE_TIME_SPENT: "UPDATE_TIME_SPENT",
  GET_SPEAKER_INFO: "GET_SPEAKER_INFO",
  GET_SUPPORTED_BULK_TASK_TYPE: "GET_SUPPORTED_BULK_TASK_TYPE",
  UPLOAD_CSV: "UPLOAD_CSV",
  EXPORT_VOICEOVER_TASK: "EXPORT_VOICEOVER_TASK",
  GET_PREVIEW_TASK: "GET_PREVIEW_TASK",
  GENERATE_TRANSLATION_OUTPUT: "GENERATE_TRANSLATION_OUTPUT",
  UPLOAD_TO_YOUTUBE: "UPLOAD_TO_YOUTUBE",
  EDIT_BULK_TASK_DETAILS: "EDIT_BULK_TASK_DETAILS",
  EDIT_TASK_DETAILS: "EDIT_TASK_DETAILS",
  BULK_TASK_EXPORT: "BULK_TASK_EXPORT",
  BULK_VIDEO_DOWNLOAD: "BULK_VIDEO_DOWNLOAD",
  GET_TASK_FAIL_INFO: "GET_TASK_FAIL_INFO",
  REOPEN_TASK: "REOPEN_TASK",

  //Common
  FULLSCREEN: "FULLSCREEN",
  FULLSCREEN_VIDEO: "FULLSCREEN_VIDEO",
  SUBTITLES: "SUBTITLES",
  PLAYER: "PLAYER",
  SUBTITLES_FOR_CHECK: "SUBTITLES_FOR_CHECK",
  TOTAL_PAGES: "TOTAL_PAGES",
  CURRENT_PAGE: "CURRENT_PAGE",
  NEXT_PAGE: "NEXT_PAGE",
  PREVIOUS_PAGE: "PREVIOUS_PAGE",
  COMPLETED_COUNT: "COMPLETED_COUNT",
  FULL_SUBTITLES: "FULL_SUBTITLES",
  RANGE_START: "RANGE_START",
  RANGE_END: "RANGE_END",
  SNACKBAR: "SNACKBAR",
  LOADING: "LOADING",
  TOTAL_SENTENCES: "TOTAL_SENTENCES",

  //Admin
  GET_ORG_OWNER_LIST: "GET_ORG_OWNER_LIST",
  GET_ADMIN_REPORTS: "GET_ADMIN_REPORTS",
  GET_TEMPLATE_PREVIEW: "GET_TEMPLATE_PREVIEW",
  CLEAR_TEMPLATE_PREVIEW: "CLEAR_TEMPLATE_PREVIEW",

  //clear state
  CLEAR_STATE: "CLEAR_STATE",

  //Filters
  SELECTED_FILTERS: "SELECTED_FILTERS",
  SORT_OPTIONS: "SORT_OPTIONS",
  COLUMN_DISPLAY: "COLUMN_DISPLAY",
  PROJECT_SEARCH_VALUES: "PROJECT_SEARCH_VALUES",
  CURRENT_SEARCHED_COLUMN: "CURRENT_SEARCHED_COLUMN",

  //Org Filters
  ORG_SELECTED_FILTERS: "ORG_SELECTED_FILTERS",
  ORG_SORT_OPTIONS: "ORG_SORT_OPTIONS",
  ORG_COLUMN_DISPLAY: "ORG_COLUMN_DISPLAY",
  ORG_SEARCH_VALUES: "ORG_SEARCH_VALUES",
  CURRENT_ORG_SEARCHED_COLUMN: "CURRENT_ORG_SEARCHED_COLUMN",

  //Project Tabs
  PROJECT_TAB_INDEX: "PROJECT_TAB_INDEX",
};

export default constants;
