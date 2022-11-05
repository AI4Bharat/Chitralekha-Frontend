import getOrganizationDetails from "./Organization/OrganizationDetails";
import getProjectList from "./Organization/ProjectList";
import getUserList from "./User/UserList";
import getLoggedInUserDetails from "./User/LoggedInUserDetails";

const rootReducer = {
    getOrganizationDetails,
    getProjectList,
    getUserList,
    getLoggedInUserDetails,
};

export default rootReducer;