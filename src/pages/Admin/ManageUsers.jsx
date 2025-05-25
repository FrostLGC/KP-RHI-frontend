import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [positionInput, setPositionInput] = useState("");
  const [profilePhotoInput, setProfilePhotoInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  const getUsersAndTasks = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        axiosInstance.get(API_PATH.USERS.GET_ALL_USERS),
        axiosInstance.get(API_PATH.TASK.USERS_TASKS_GROUPED),
      ]);

      if (usersRes.data && tasksRes.data && tasksRes.data.users) {
        // Map tasks by user ID for quick lookup
        const tasksByUserId = {};
        tasksRes.data.users.forEach((user) => {
          tasksByUserId[user._id] = user.tasks || {};
        });

        // Merge user info with task counts
        const mergedUsers = usersRes.data.map((user) => {
          const userTasks = tasksByUserId[user._id] || {};
          return {
            ...user,
            pendingTask: userTasks.Pending ? userTasks.Pending.length : 0,
            inProgressTask: userTasks["In Progress"]
              ? userTasks["In Progress"].length
              : 0,
            completedTask: userTasks.Completed ? userTasks.Completed.length : 0,
          };
        });

        setAllUsers(mergedUsers);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching users and tasks:", error);
      toast.error("Failed to load users and tasks");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.REPORT.EXPORT_USER, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setPositionInput(user.position || "");
    setProfilePhotoInput(user.profileImageUrl || "");
    setRoleInput(user.role || "");
  };

  const handlePositionChange = (e) => {
    setPositionInput(e.target.value);
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhotoInput(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleInput(e.target.value);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      if (positionInput !== editingUser.position) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/position`,
          { position: positionInput }
        );
      }
      if (profilePhotoInput !== editingUser.profileImageUrl) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/profile-photo`,
          { profileImageUrl: profilePhotoInput }
        );
      }
      if (roleInput !== editingUser.role) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/role`,
          { role: roleInput }
        );
      }
      toast.success("User updated successfully");
      setEditingUser(null);
      getUsersAndTasks();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  React.useEffect(() => {
    getUsersAndTasks();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <div
              key={user._id}
              className="border border-gray-400/50 p-3 rounded shadow"
            >
              <UserCard userInfo={user} />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  value={
                    editingUser?._id === user._id
                      ? positionInput
                      : user.position || ""
                  }
                  onChange={handlePositionChange}
                  disabled={editingUser?._id !== user._id}
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={editingUser?._id === user._id ? roleInput : ""}
                  onChange={handleRoleChange}
                  disabled={editingUser?._id !== user._id}
                  className="form-input mt-1 block w-full"
                >
                  <option value="" disabled>
                    Select role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              {editingUser?._id === user._id ? (
                <div className="mt-2 flex space-x-2">
                  <button
                    className="btn btn-edit-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-edit-primary" onClick={handleSave}>
                    Save
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex space-x-2">
                  <button
                    className="btn btn-edit-primary"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
