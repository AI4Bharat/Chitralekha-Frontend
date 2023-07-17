import { HashRouter, Switch, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ChitralekhaPortal from "./ui/pages/component/ChitralekhaPortal";
import Thanks from "../src/ui/pages/container/Thanks";
import UseCases from "./ui/pages/container/UseCases";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout component={<ChitralekhaPortal />} />}
        />
        <Route path="/Thanks" element={<Layout component={<Thanks />} />} />
        <Route path="/useCases" element={<Layout component={<UseCases />} />} />
      </Routes>
    </HashRouter>
  );
}
