import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./containers/UserManagement/Login";
import Layout from './Layout'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
