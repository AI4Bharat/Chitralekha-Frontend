import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectDetails from "./containers/Project/ProjectDetails";
import Projects from "./containers/Project/Projects";
import Login from "./containers/UserManagement/Login";
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
  }
]);

const RootRouter = () => {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
};

export default RootRouter;
