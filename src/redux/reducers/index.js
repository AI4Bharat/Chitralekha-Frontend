import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Project/ProjectList";
import getUserList from "./User/UserList";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";
import getNewProjectDetails from "./Project/CreateNewProject";
import apiStatus from './apistatus/apistatus';
import getProjectDetails from "./Project/ProjectDetails";
import getProjectVideoList from "./Project/ProjectVideoList";

const rootReducer = {
    apiStatus,
    getOrganizationDetails,
    getProjectList,
    getUserList,
    getLoggedInUserDetails,
    getNewProjectDetails,
    getProjectDetails,
    getProjectVideoList,
};

export default rootReducer;