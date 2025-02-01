import React, { useState } from "react";

const RequestsSection = () => {
  const [filter, setFilter] = useState("all");

  // Hardcoded data for requests
  const allRequests = [
    {
      _id: "REQ001",
      userId: {
        name: "Alice Johnson",
        photo: "https://via.placeholder.com/40",
        email: "alice.johnson@example.com",
      },
      description: "Need help with JavaScript performance optimization.",
      status: "pending",
    },
    {
      _id: "REQ002",
      userId: {
        name: "Bob Smith",
        photo: "https://via.placeholder.com/40",
        email: "bob.smith@example.com",
      },
      description: "Looking for a mentor in React development.",
      status: "accepted",
    },
    {
      _id: "REQ003",
      userId: {
        name: "Charlie Brown",
        photo: "https://via.placeholder.com/40",
        email: "charlie.brown@example.com",
      },
      description: "Need assistance with deploying a Node.js app.",
      status: "resolved",
    },
    {
      _id: "REQ004",
      userId: {
        name: "Diana Prince",
        photo: "https://via.placeholder.com/40",
        email: "diana.prince@example.com",
      },
      description: "Requesting feedback on my portfolio website.",
      status: "rejected",
    },
  ];

  // Filter requests based on selected status
  const filteredRequests =
    filter === "all"
      ? allRequests
      : allRequests.filter((request) => request.status === filter);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Management</h2>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        {["all", "pending", "accepted", "resolved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            } shadow`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
            <tr>
              <th className="px-4 py-2">Request ID</th>
              <th className="px-4 py-2">User Info</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map(({ _id, userId, description, status }) => (
                <tr key={_id} className="border-t">
                  <td className="px-4 py-2">{_id}</td>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <img
                      src={userId.photo}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold">{userId.name}</p>
                      <p className="text-xs text-gray-600">{userId.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2">{description}</td>
                  <td className="px-4 py-2 capitalize">{status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  No requests found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsSection;
