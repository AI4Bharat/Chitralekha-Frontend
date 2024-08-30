import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import MyOrganization from "./containers/Organization/MyOrganization";
import EditProfile from "./containers/UserManagement/EditProfile";
import Login from "./containers/UserManagement/Login";
import ProfilePage from "./containers/UserManagement/ProfilePage";
import Layout from "./Layout";
import { authenticateUser } from "./utils/utils";
import Project from "./containers/Organization/Project/Project";
import CreateNewProject from "./containers/Organization/Project/CreateNewProject";
import ChangePassword from "./containers/UserManagement/ChangePassword";
import ConfirmForgotPassword from "./containers/UserManagement/ConfirmForgotPassword";
import ForgotPassword from "./containers/UserManagement/ForgotPassword";
import ComparisonTable from "./containers/Organization/Project/ComparisonTable";
import VideoLanding from "./containers/Organization/Video/VideoLanding";
import CreateNewOrg from "./containers/Admin/CreateNewOrg";
import DashBoard from "./containers/Admin/Dashboard";
import DashBoard1 from "containers/admin1/Dashboard1";
import EditOrganizationDetails from "./containers/Admin/EditOrganizationDetails";
import EditProject from "./containers/Organization/Project/EditProject";
import SignUp from "./containers/UserManagement/signup";
import ConfirmForgetPassword from "./containers/UserManagement/ConfirmForgotPassword";
import OrgLevelTaskList from "./containers/Organization/OrgLevelTaskList";
import TaskQueueStatus from "./containers/Organization/TaskQueueStatus/TaskQueueStatus";
import ChitralekhaPortal from "./common/ChitralekhaPortal";
import Unsubscribe from "containers/UserManagement/Unsubscribe";
import MyGlossary from "containers/UserManagement/MyGlossary";
import CreateBulkProjects from "containers/Organization/Project/CreateBulkProjects";
import { Charts, TestimonialPage, Thanks, UseCases } from "containers/intro";

const RootRouter = () => {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const PublicRoute = ({ user, children }) => {
    if (authenticateUser()) {
      const orgId = JSON.parse(localStorage.getItem("userData"))?.organization
        .id;
      return <Navigate to={`/my-organization/${orgId}`} />;
    }
    return children;
  };

  const ProtectedRouteWrapper = (component) => {
    return <ProtectedRoute>{component}</ProtectedRoute>;
  };

  const PublicRouteWrapper = (component) => {
    return <PublicRoute>{component}</PublicRoute>;
  };

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={PublicRouteWrapper(
            <Layout component={<ChitralekhaPortal />} />
          )}
        />
        <Route path="/Thanks" element={<Layout component={<Thanks />} />} />
        <Route path="/useCases" element={<Layout component={<UseCases />} />} />
        <Route path="/testimonials" element={<Layout component={<TestimonialPage />} />} />
        <Route path="/dashboards" element={<Layout component={<Charts />} />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<ProfilePage />} Backbutton={true} />
          )}
        />
        <Route
          path="/edit-profile/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<EditProfile />} Backbutton={true} />
          )}
        />
        <Route
          path="/my-organization/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<MyOrganization />} />
          )}
        />
        <Route
          path="/task-list"
          element={ProtectedRouteWrapper(
            <Layout component={<OrgLevelTaskList />} />
          )}
        />
        <Route
          path="/my-organization/:orgId/project/:projectId"
          element={ProtectedRouteWrapper(
            <Layout component={<Project />} Backbutton={true} />
          )}
        />
        <Route
          path="/my-organization/:orgId/create-new-project"
          element={ProtectedRouteWrapper(
            <Layout component={<CreateNewProject />} Backbutton={true} />
          )}
        />
        <Route
          path="/my-organization/:orgId/create-bulk-projects"
          element={ProtectedRouteWrapper(
            <Layout component={<CreateBulkProjects />} Backbutton={true} />
          )}
        />
        <Route
          path="/profile/:id/change-password"
          element={ProtectedRouteWrapper(
            <Layout component={<ChangePassword />} Backbutton={true} />
          )}
        />

        <Route
          path="/profile/:id/my-glossary"
          element={ProtectedRouteWrapper(
            <Layout component={<MyGlossary />} Backbutton={true} />
          )}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forget-password/confirm/:key/:token"
          element={<ConfirmForgotPassword />}
        />
        <Route
          path="/comparison-table/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<ComparisonTable />} />
          )}
        />

        <Route
          path="/task/:taskId/transcript"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/task/:taskId/transcript/:offset/:segment"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/task/:taskId/translate"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/task/:taskId/translate/:offset/:segment"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/task/:taskId/voiceover"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/task/:taskId/voiceover/:offset/:segment"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true} />
          )}
        />

        <Route
          path="/admin"
          element={ProtectedRouteWrapper(<Layout component={<DashBoard />} />)}
        />

        <Route
          path="/admin1"
          element={ProtectedRouteWrapper(<Layout component={<DashBoard1 />} />)}
        />

        <Route
          path="/admin/create-new-org"
          element={ProtectedRouteWrapper(
            <Layout component={<CreateNewOrg />} Backbutton={true} />
          )}
        />

        <Route
          path="/admin/edit-organization/:orgId"
          element={ProtectedRouteWrapper(
            <Layout component={<EditOrganizationDetails />} Backbutton={true} />
          )}
        />

        <Route
          path="/my-organization/:orgId/project/:projectId/edit-project"
          element={ProtectedRouteWrapper(
            <Layout component={<EditProject />} Backbutton={true} />
          )}
        />

        <Route path="/invite/:invitecode" element={<SignUp />} />

        <Route
          path="/forget-password/confirm/:uid/:token"
          element={<ConfirmForgetPassword />}
        />

        <Route
          path="/task-queue-status"
          element={ProtectedRouteWrapper(
            <Layout component={<TaskQueueStatus />} />
          )}
        />

        <Route path="/newsletter/unsubscribe" element={<Unsubscribe />} />
      </Routes>
    </HashRouter>
  );
};

export default RootRouter;
