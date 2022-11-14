import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Organization/ProjectList";
import getUserList from "./User/UserList";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";
import getNewProjectDetails from "./Organization/CreateNewProject";
import apiStatus from './apistatus/apistatus';
import getMembersList from './Organization/MembersList';

const rootReducer = {
    apiStatus,
    getOrganizationDetails,
    getProjectList,
    getUserList,
    getLoggedInUserDetails,
    getNewProjectDetails,
    getMembersList,
};

export default rootReducer;