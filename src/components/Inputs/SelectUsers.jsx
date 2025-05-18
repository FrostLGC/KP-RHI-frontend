import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { LuUsers } from "react-icons/lu";
import Modal from "../modal";
import AvatarGroup from "../AvatarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModaloOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

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

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) => {
      return prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId];
    });
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectrdUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => ({
      profileImageUrl: user.profileImageUrl,
      name: user.name,
    }));

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
    return () => {};
  }, [selectedUsers]);
  return (
    <div className="space-y-4 mt-2">
      {selectrdUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Tambah Anggota
        </button>
      )}

      {selectrdUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-4">
            {selectrdUserAvatars.slice(0, 3).map((user, index) => (
              <div key={index} className="flex items-center gap-1">
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))}
            {selectrdUserAvatars.length > 3 && (
              <span className="text-sm font-medium">+{selectrdUserAvatars.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModaloOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
          <div
            key={user._id}
            className=" flex items-center gap-4 p-3 border-b border-gray-200"
          >
            <img
              src={user.profileImageUrl && user.profileImageUrl.trim() !== "" ? user.profileImageUrl : null}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800 dark:text-white">
                  {user.name}
                </p>
                {user.position && (
                  <span className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-md">
                    {user.position}
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-500">{user.email}</p>
            </div>
            <input
              type="checkbox"
              checked={tempSelectedUsers.includes(user._id)}
              onChange={() => toggleUserSelection(user._id)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
            />
          </div>
          ))}
        </div>

        <div className="flex jutify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
