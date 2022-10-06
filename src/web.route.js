import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
