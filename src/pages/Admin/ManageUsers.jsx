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

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
  };

  const handlePositionChange = (e) => {
    setPositionInput(e.target.value);
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhotoInput(e.target.value);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      if (positionInput !== editingUser.position) {
        await axiosInstance.put(
          API_PATH.USERS.UPDATE_POSITION(editingUser._id),
          { position: positionInput }
        );
      }
      if (profilePhotoInput !== editingUser.profileImageUrl) {
        await axiosInstance.put(
          API_PATH.USERS.UPDATE_PROFILE_PHOTO(editingUser._id),
          { profileImageUrl: profilePhotoInput }
        );
      }
      toast.success("User updated successfully");
      setEditingUser(null);
      getAllUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button className="flex md:flex download-btn" onClick={handleDownloadReport}>
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <div key={user._id} className="border p-4 rounded shadow">
              <UserCard userInfo={user} />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={editingUser?._id === user._id ? positionInput : user.position || ""}
                  onChange={handlePositionChange}
                  disabled={editingUser?._id !== user._id}
                  className="form-input mt-1 block w-full"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
                <input
                  type="text"
                  value={editingUser?._id === user._id ? profilePhotoInput : user.profileImageUrl || ""}
                  onChange={handleProfilePhotoChange}
                  disabled={editingUser?._id !== user._id}
                  className="form-input mt-1 block w-full"
                />
              </div>
              {editingUser?._id === user._id ? (
                <div className="mt-2 flex space-x-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-outline"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
