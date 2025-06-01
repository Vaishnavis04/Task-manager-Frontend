import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminManageUsers = () => {
 const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data?.message);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axios.put(
        "/api/users/update-role",
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // refresh
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => toggleRole(u._id, u.role)}>
                  Change to {u.role === "admin" ? "User" : "Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminManageUsers;
