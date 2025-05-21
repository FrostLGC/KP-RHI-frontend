import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import TaskAssignmentMailboxAdmin from "./pages/Admin/TaskAssignmentMailbox";

import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetail";
import UserTaskAssignmentMailbox from "./pages/User/UserTaskAssignmentMailbox";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";



const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route
                path="/admin/task-assignment-mailbox"
                element={<TaskAssignmentMailboxAdmin />}
              />
            </Route>

            {/* routes user*/}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTask />} />
              <Route
                path="/user/tasks-details/:id"
                element={<ViewTaskDetails />}
              />
              <Route
                path="/user/task-assignment-mailbox"
                element={<UserTaskAssignmentMailbox />}
              />
            </Route>

            {/* Default Route*/}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
        {/* <div className="leaflet-custom-attribution" style={{ position: "fixed", bottom: 0, right: 0, padding: "4px", backgroundColor: "white", zIndex: 1000 }}>
          <svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: "middle" }}>
            <rect width="12" height="4" fill="#FF0000" />
            <rect y="4" width="12" height="4" fill="#FFFFFF" />
          </svg>
          <a href="https://leafletjs.com" style={{ marginLeft: "4px" }}>Leaflet</a>
        </div> */}
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
};
