import HeaderComponent from "./component/HeaderComponent";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateAccount from "./component/CreateAccount";
import LoginComponent from "./component/LoginComponent";
import { isUserLoggedIn, getLoggedInUser } from "./service/AuthApiService";
import TasksComponent from "./component/TasksComponent";
import AddTaskComponent from "./component/AddTaskComponent";
import HomePage from "./component/Home";
import { retrieveAllTasks, createTask } from "./service/TaskApiService";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const activeUser = getLoggedInUser();

  function AuthenticatedRoute({ children }) {
    if (isUserLoggedIn()) {
      return children;
    }
    return <Navigate to="/login" />;
  }

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <AuthenticatedRoute>
                <TasksComponent userId={activeUser?.id} retrieveTasks={retrieveAllTasks} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent userId={activeUser?.id} createTask={createTask} />
              </AuthenticatedRoute>
            }
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
