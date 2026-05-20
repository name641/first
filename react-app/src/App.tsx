import { Routes, Route } from "react-router-dom";
import Ce from "./pages/Create";
import Login from "./pages/Login";
import FeatureList from "./pages/FunctionList";
import TasksCreate from "./pages/TasksCreate";
import TaskEdit from "./pages/TaskEdit";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/functionlist" element={<FeatureList />} />
      <Route path="/create" element={<Ce />} />
      <Route path="/taskscreate" element={<TasksCreate />} />
      <Route path="/taskedit/:id" element={<TaskEdit />} />
    </Routes>
  );
}

export default App;