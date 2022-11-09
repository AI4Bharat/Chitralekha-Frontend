import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Organization/ProjectList";
import getUserList from "./User/UserList";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";
import getNewProjectDetails from "./Organization/CreateNewProject";

const rootReducer = {
    getOrganizationDetails,
    getProjectList,
    getUserList,
    getLoggedInUserDetails,
    getNewProjectDetails,
};

export default rootReducer;