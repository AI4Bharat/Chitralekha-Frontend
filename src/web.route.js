import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./containers/UserManagement/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  }
]);

const RootRouter = () => {
  return <RouterProvider router={router} />;
};

export default RootRouter;
