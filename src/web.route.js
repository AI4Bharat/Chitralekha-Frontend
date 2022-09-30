import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectList from "./containers/Project/ProjectList";
import Login from "./containers/UserManagement/Login";
import Layout from './Layout'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/projects",
    element: <ProjectList />
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
