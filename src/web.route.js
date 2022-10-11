import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectDetails from "./containers/Project/ProjectDetails";
import Projects from "./containers/Project/Projects";
import MyOrganization from "./containers/Organization/MyOrganization";
import EditProfile from "./containers/UserManagement/EditProfile";
import Login from "./containers/UserManagement/Login";
import ProfilePage from "./containers/UserManagement/ProfilePage";
import Layout from './Layout'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/projects",
    element: <Projects />
  },
  {
    path: "/projects/:id",
    element: <ProjectDetails />
  },
  {
    path: "/profile/:id",
    element: <ProfilePage />
  },
  {
    path: "/edit-profile",
    element: <EditProfile />
  },
  {
    path: "/my-organization",
    element: <MyOrganization />
  },
]);

const RootRouter = () => {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
};

export default RootRouter;
