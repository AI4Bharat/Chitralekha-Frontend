import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Project/ProjectList";
import getUserList from "./User/UserList";
import getUserAccessToken from "./User/Login";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";
import getUserDetails from "./User/UserDetails";
import getNewProjectDetails from "./Project/CreateNewProject";
import apiStatus from "./apistatus/apistatus";
import getProjectDetails from "./Project/ProjectDetails";
import getProjectVideoList from "./Project/ProjectVideoList";
import getProjectMembers from "./Project/FetchProjectMembers";
import getLanguages from "./Project/FetchLanguages";
import getTaskList from "./Project/FetchTaskList";
import getTaskDetails from "./Project/FetchTaskDetails";
import setComparisonTable from "./Project/SetComparisonTableData";
// import comparsionTable from "./Project/ComparisionTable";
import getTranscriptTypes from "./Project/FetchTranscriptTypes";
import getVideoDetails from "./Project/FetchVideoDetails";
import getTaskTypes from "./Project/FetchTaskType";
import getBulkTaskTypes from "./Project/FetchBulkTaskType";
import getAllowedTasks from "./Project/FetchAllowedTask";
import getPriorityTypes from "./Project/FetchPriorityTypes";
import getSupportedLanguages from "./Project/FetchSupportedLanguage";
import getTranscriptPayload from "./Project/FetchTranscriptPayload";
import getVideoTaskList from "./Project/FetchVideoTaskList";
import getManagerName from "./Project/FetchManagerName";
import DeleteVideo from "./Project/DeleteVideo";
import getOrganizatioUsers from "./Organization/FetchOrganizatioUsers";
import getOrganizatioProjectManagersUser from "./Organization/FetchOrganizatioProjectManagersUser";
import getUserRoles from "./User/FetchUsersRoles";
import searchList from "./Project/Search";
import getTranslationTypes from "./Project/FetchTranslationTypes";
import commonReducer from "./Common";
import getVideoSubtitle from "./Project/FetchVideoSubtitle";
import getOrganizationList from "./Organization/FetchOrganizationList";
import getAllUserList from "./Admin/FetchAllUsers";
import getOrgOwnerList from "./Admin/FetchOrgOwners";
import getProjectReports from "./Project/FetchProjectReports";
import getOrganizationReports from "./Organization/FetchOrganizationReports";
import getAdminReports from "./Admin/AdminLevelReport";
import getInviteUserInfo from "./User/FetchInviteUserInfo";
import getTranscriptExportTypes from "./Project/FetchTranscriptExportTypes";
import getTranslationExportTypes from "./Project/FetchTranslationExportTypes";
import getVoiceoverExportTypes from "./Project/FetchVoiceoverExportTypes";
import getOrgTaskList from "./Organization/FetchOrgTaskList";
import getTaskQueueStatus from "./Organization/FetchTaskQueueStatus";
import getSpeakerInfo from "./Project/FetchSpeakerInfo";
import getSupportedBulkTaskTypes from "./Project/FetchSupportedBulkTaskTypes";
import getPreviewData from "./Project/FetchPreviewData";
import newsletterPreviewReducer from "./Admin/NewsLetterPreview";
import taskFilters from "./Project/TaskFilters";
import orgTaskFilters from "./Organization/OrgTaskFilters";

const rootReducer = {
  apiStatus,
  getOrganizationDetails,
  getProjectList,
  getUserList,
  getUserAccessToken,
  getLoggedInUserDetails,
  getNewProjectDetails,
  getProjectDetails,
  getProjectVideoList,
  getUserDetails,
  getProjectMembers,
  getLanguages,
  getTaskList,
  getTaskDetails,
  setComparisonTable,
  // comparsionTable,
  getTranscriptTypes,
  getVideoDetails,
  getTaskTypes,
  getAllowedTasks,
  getPriorityTypes,
  getSupportedLanguages,
  getTranscriptPayload,
  getVideoTaskList,
  getManagerName,
  DeleteVideo,
  getOrganizatioUsers,
  getOrganizatioProjectManagersUser,
  getUserRoles,
  searchList,
  getTranslationTypes,
  commonReducer,
  getBulkTaskTypes,
  getVideoSubtitle,
  getOrganizationList,
  getOrgOwnerList,
  getAllUserList,
  getProjectReports,
  getOrganizationReports,
  getAdminReports,
  getInviteUserInfo,
  getTranscriptExportTypes,
  getTranslationExportTypes,
  getOrgTaskList,
  getTaskQueueStatus,
  getSpeakerInfo,
  getVoiceoverExportTypes,
  getSupportedBulkTaskTypes,
  getPreviewData,
  newsletterPreviewReducer,
  taskFilters,
  orgTaskFilters,
};

export default rootReducer;
