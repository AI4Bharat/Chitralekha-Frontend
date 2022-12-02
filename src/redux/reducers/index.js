import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Project/ProjectList";
import getUserList from "./User/UserList";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";
import getUserDetails from "./User/UserDetails";
import getNewProjectDetails from "./Project/CreateNewProject";
import apiStatus from './apistatus/apistatus';
import getProjectDetails from "./Project/ProjectDetails";
import getProjectVideoList from "./Project/ProjectVideoList";
import getProjectMembers from "./Project/FetchProjectMembers";
import getLanguages from "./Project/FetchLanguages";
import getTaskList from "./Project/FetchTaskList";
import getTaskDetails from "./Project/FetchTaskDetails";
import setComparisonTable from "./Project/SetComparisonTableData";
// import comparsionTable from "./Project/ComparisionTable";

const rootReducer = {
    apiStatus,
    getOrganizationDetails,
    getProjectList,
    getUserList,
    getLoggedInUserDetails,
    getNewProjectDetails,
    getProjectDetails,
    getProjectVideoList,
    getUserDetails,
    getProjectMembers,
    getLanguages,
    getTaskList,
    getTaskDetails,
    setComparisonTable
    // comparsionTable,
};

export default rootReducer;