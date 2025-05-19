import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";

const AdminTaskAssignmentMailbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch all pending task assignment requests for admin view
      const response = await axiosInstance.get(API_PATH.TASK_ASSIGNMENT.GET_ALL_REQUESTS);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching assignment requests", error);
      toast.error("Failed to load assignment requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <DashboardLayout activeMenu="Task Mailbox">
      {loading ? (
        <div>Loading assignment requests...</div>
      ) : requests.length === 0 ? (
        <div>No pending task assignment requests.</div>
      ) : (
        <div className="task-assignment-mailbox card p-4 my-4">
          <h3 className="text-lg font-semibold mb-3">Pending Task Assignment Requests</h3>
          <ul>
            {requests.map((req) => (
              <li key={req._id} className="mb-3 border-b pb-2">
                <p>
                  Task: <strong>{req.taskId?.title || "Unknown Task"}</strong>
                </p>
                <p>
                  Assigned to: <strong>{req.assignedToUserId?.name || "Unknown User"}</strong>
                </p>
                <p>
                  Requested by: <strong>{req.assignedByAdminId?.name || "Unknown Admin"}</strong>
                </p>
                <p>Status: <strong>{req.status || "Pending"}</strong></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminTaskAssignmentMailbox;
