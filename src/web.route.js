import {
  BrowserRouter as Router,
  HashRouter,
  Link,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ProjectDetails from "./containers/Project/ProjectDetails";
import Projects from "./containers/Project/Projects";
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

const RootRouter = () => {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const ProtectedRouteWrapper = (component) => {
    return <ProtectedRoute>{component}</ProtectedRoute>;
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/projects"
          element={ProtectedRouteWrapper(<Layout component={<Projects />} />)}
        />
        <Route
          path="/projects/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<ProjectDetails />} Backbutton={true} />
          )}
        />
        <Route
          path="/profile/:id"
          element={ProtectedRouteWrapper(
            <Layout component={<ProfilePage />} Backbutton={true} />
          )}
        />
        <Route
          path="/edit-profile"
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
          path="/profile/:id/change-password"
          element={ProtectedRouteWrapper(
            <Layout component={<ChangePassword />} Backbutton={true} />
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
          path="/:taskId/transcript"
          element={ProtectedRouteWrapper(
            <Layout component={<VideoLanding />} isDrawer={true}/>
          )}
        />
      </Routes>
      
    </HashRouter>
  );
};

export default RootRouter;
