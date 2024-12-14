import React, { useEffect, useState } from "react";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/admin/messages");
      setMessages(response.data);
    } catch (error) {
      toastr.error("Failed to fetch messages.");
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  // Delete a message
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/messages/${id}`);
      toastr.success("Message deleted successfully!");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      toastr.error("Failed to delete message.");
      console.error("Error deleting message:", error);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-center">User Messages</h1>
      <hr />
      {loading ? (
        <p className="text-center">Loading messages...</p>
      ) : messages.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg._id}>
                  <td>{index + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteMessage(msg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No messages found.</p>
      )}
    </div>
  );
};

export default AdminMessages;
