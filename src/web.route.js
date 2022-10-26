import {
  BrowserRouter as Router,
  HashRouter,
  Link,
  Route,
  Routes,
} from "react-router-dom";
import ProjectDetails from "./containers/Project/ProjectDetails";
import Projects from "./containers/Project/Projects";
import MyOrganization from "./containers/Organization/MyOrganization";
import EditProfile from "./containers/UserManagement/EditProfile";
import Login from "./containers/UserManagement/Login";
import ProfilePage from "./containers/UserManagement/ProfilePage";
import Layout from './Layout'
import { authenticateUser } from "./utils/utils";

const RootRouter = () => {
  const ProtectedRoute = ({ user, children }) => {
    if (!authenticateUser()) {
      return <Link href="/" />;
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
          element={ProtectedRouteWrapper(<Layout component={<ProjectDetails />} Backbutton={true}/>)}
        />
        <Route
          path="/profile/:id"
          element={ProtectedRouteWrapper(<Layout component={<ProfilePage />} Backbutton={true} />)}
        />
        <Route
          path="/edit-profile"
          element={ProtectedRouteWrapper(<Layout component={<EditProfile />} Backbutton={true} />)}
        />
        <Route
          path="/my-organization"
          element={ProtectedRouteWrapper(<Layout component={<MyOrganization />} />)}
        />
      </Routes>
    </HashRouter>
  );
};

export default RootRouter;
