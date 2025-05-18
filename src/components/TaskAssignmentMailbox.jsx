import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import toast from "react-hot-toast";

const TaskAssignmentMailbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.TASK_ASSIGNMENT.GET_USER_REQUESTS);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching assignment requests", error);
      toast.error("Failed to load assignment requests");
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      await axiosInstance.put(`${API_PATH.TASK_ASSIGNMENT.RESPOND_TO_REQUEST(requestId)}`, {
        action,
      });
      toast.success(`Request ${action}ed successfully`);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading assignment requests...</div>;
  }

  if (requests.length === 0) {
    return <div>No pending task assignment requests.</div>;
  }

  return (
    <div className="task-assignment-mailbox card p-4 my-4">
      <h3 className="text-lg font-semibold mb-3">Task Assignment Requests</h3>
      <ul>
        {requests.map((req) => (
          <li key={req._id} className="mb-3 border-b pb-2">
            <p>
              Task: <strong>{req.taskId?.title || "Unknown Task"}</strong>
            </p>
            <p>
              Assigned by: <strong>{req.assignedByAdminId?.name || "Unknown Admin"}</strong>
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-success px-3 py-1 rounded bg-green-500 text-white"
                onClick={() => respondToRequest(req._id, "approve")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger px-3 py-1 rounded bg-red-500 text-white"
                onClick={() => respondToRequest(req._id, "reject")}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskAssignmentMailbox;
