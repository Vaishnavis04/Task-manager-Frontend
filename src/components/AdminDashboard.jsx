// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTachometerAlt, FaUsers, FaTasks } from 'react-icons/fa';
import API from '../utils/api';
import './AdminDashboard.css'; // Import your CSS styles
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

const STATUS_COLORS = {
  completed: '#4caf50',
  pending: '#f44336',
  assigned: '#2196f3',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview'); // 'users' | 'tasks' | 'overview'
  // User management state
  const [userSearch, setUserSearch] = useState('');
  // Task management state
  const [taskFilters, setTaskFilters] = useState({ status: '', dueDate: '', priority: '' });
  const [taskEditId, setTaskEditId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

 const [newTaskForm, setNewTaskForm] = useState({
  title: '',
  description: '',
  dueDate: '',
  status: 'assigned',
  priority: 'medium',
  assignedTo: '',
});
const [taskEditForm, setTaskEditForm] = useState({
  title: '',
  description: '',
  dueDate: '',
  assignedTo: '',
  status: ''
});

  useEffect(() => {
    fetchUsers();
    fetchTasks();
  }, []);
  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/all-users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err?.response?.data?.message || err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err?.response?.data?.message || err.message);
    }
  };

  // Update user role
const changeUserRole = async (userId, newRole) => {
  try {
    const response = await API.put(
      '/auth/update-role',
      {
        userId,
        newRole,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    alert(response.data.message);
    fetchUsers(); // ✅ Correct function to refresh users list
  } catch (error) {
    console.error('Error updating role:', error.response?.data?.message || error.message);
    alert('Failed to update role');
  }
};


  // Enable/disable user
  const toggleUserStatus = async (userId, enabled) => {
    try {
      await API.put(`/auth/users/${userId}/status`, { enabled });
      fetchUsers();
    } catch (err) {
      alert('Error updating user status');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/auth/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  // Start editing a task
  const startEditTask = (task) => {
    setTaskEditId(task._id);
    setTaskEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.slice(0, 10),
      status: task.status,
    });
  };
  // to start editing
const handleEditClick = (taskId) => {
  setEditingTaskId(taskId);
  setTaskEditForm({ ...task });
};

  // Submit edited task
  const submitEditTask = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token'); // or however you store the JWT
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    const response = await axios.put(
     `http://localhost:5000/api/tasks/${taskEditId}`,
      taskEditForm,  // taskEditForm = { title, description, dueDate, assignedTo, status }
      config
    );

    console.log('Task updated:', response.data);
    alert('Task updated successfully!');
    setEditingTaskId(null); // close edit mode
    fetchTasks(); // reload updated list
  } catch (error) {
    console.error('Error updating task:', error.response?.data || error.message);
    alert('Failed to update task.');
  }
};



//create a task
const createTask = async (e) => {
  e.preventDefault();
  try {
    const response = await API.post('/tasks', newTaskForm); // Use newTaskForm instead of newTask
    const createdTask = response.data;

    // Optimistically update the task list immediately
    setTasks((prevTasks) => [...prevTasks, createdTask]);

    // Reset the form
    setNewTaskForm({
      title: '',
      description: '',
      dueDate: '',
      status: 'assigned',
      priority: 'medium',
      assignedTo: '',
    });

    // Optionally fetch the latest tasks in the background to stay in sync
    fetchTasks();

    alert('Task created successfully');
  } catch (err) {
    console.error('Create task error:', err);
    alert('Error creating task');
  }
};
  // Filtered users and tasks
 const filteredUsers = users.filter(
  (u) =>
    (u.username?.toLowerCase() || '').includes(userSearch.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())
);


  const filteredTasks = tasks.filter((t) => {
    let statusMatch = taskFilters.status ? t.status === taskFilters.status : true;
    let dueDateMatch = taskFilters.dueDate ? t.dueDate.slice(0, 10) === taskFilters.dueDate : true;
    let priorityMatch = taskFilters.priority ? t.priority === taskFilters.priority : true;
    return statusMatch && dueDateMatch && priorityMatch;
  });

  // Dashboard stats
  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'assigned').length;

  // Pie data for completed vs pending
  const pieData = [
    { name: 'Completed', value: completedTasks, color: STATUS_COLORS.completed },
    { name: 'Pending', value: pendingTasks, color: STATUS_COLORS.pending },
  ];

  return (
    <div className="admin-dashboard-container">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li
              className={selectedTab === "overview" ? "active" : ""}
              onClick={() => setSelectedTab("overview")}
            >
              <FaTachometerAlt /> Dashboard Overview
            </li>
            <li
              className={selectedTab === "users" ? "active" : ""}
              onClick={() => setSelectedTab("users")}
            >
              <FaUsers /> User Management
            </li>
            <li
              className={selectedTab === "tasks" ? "active" : ""}
              onClick={() => setSelectedTab("tasks")}
            >
              <FaTasks /> Task Management
            </li>
          </ul>
        </nav>
      </aside>
<main className="main-content">
  <div className="tab-content-scroll">
  {selectedTab === "overview" && (
    <section>
      <h2>Dashboard Overview</h2>
      <div className="widgets">
        <div className="widget users-widget">
          <h3>
            <FaUsers style={{ color: "#4e73df", marginRight: "8px" }} />
            Total Users
          </h3>
          <p>{totalUsers}</p>
        </div>
        <div className="widget tasks-widget">
          <h3>
            <FaTasks style={{ color: "#1cc88a", marginRight: "8px" }} />
            Total Tasks
          </h3>
          <p>{totalTasks}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart pie-chart">
          <h4 style={{ color: "#4e73df" }}>Tasks Status</h4>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart bar-chart">
          <h4 style={{ color: "#1cc88a" }}>Recent Tasks (Bar Chart)</h4>
          <BarChart width={500} height={300} data={tasks.slice(-7)}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="status" fill="#1cc88a" />
          </BarChart>
        </div>
      </div>
    </section>
  )}


        {selectedTab === "users" && (
          <section>
            <h2>User Management</h2>
            <input
              type="text"
              placeholder="Search users by name/email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="search-input"
            />
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className={user.enabled ? "" : "disabled"}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        onClick={() =>
                          changeUserRole(
                            user._id,
                            user.role === "admin" ? "user" : "admin",
                          )
                        }
                      >
                        Make {user.role === "admin" ? "User" : "Admin"}
                      </button>
                    </td>
                    <td>
                      <button
                        className={
                          user.enabled ? "enabled-btn" : "disabled-btn"
                        }
                        onClick={() =>
                          toggleUserStatus(user._id, !user.enabled)
                        }
                      >
                        {user.enabled ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      <section className="h-screen overflow-y-auto p-5">
        {selectedTab === "tasks" && (
          
          <section>
            <h2>Task Management</h2>

            {/* Create New Task Form */}
            <form onSubmit={createTask} className="task-create-form">
              <h3>Create New Task</h3>
              <input
                type="text"
                placeholder="Title"
                value={newTaskForm.title}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newTaskForm.description}
                onChange={(e) =>
                  setNewTaskForm({
                    ...newTaskForm,
                    description: e.target.value,
                  })
                }
                required
              />
              <input
                type="date"
                value={newTaskForm.dueDate}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })
                }
                required
              />
              <select
                value={newTaskForm.status}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, status: e.target.value })
                }
              >
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={newTaskForm.priority}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={newTaskForm.assignedTo}
                onChange={(e) =>
                  setNewTaskForm({ ...newTaskForm, assignedTo: e.target.value })
                }
              >
                <option value="">-- Assign to --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <button type="submit">Create Task</button>
            </form>

            {/* Filters */}
            <div className="filters">
              <label>
                Status:
                <select
                  value={taskFilters.status}
                  onChange={(e) =>
                    setTaskFilters({ ...taskFilters, status: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="assigned">Assigned</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <label>
                Due Date:
                <input
                  type="date"
                  value={taskFilters.dueDate}
                  onChange={(e) =>
                    setTaskFilters({ ...taskFilters, dueDate: e.target.value })
                  }
                />
              </label>

              <label>
                Priority:
                <select
                  value={taskFilters.priority}
                  onChange={(e) =>
                    setTaskFilters({ ...taskFilters, priority: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            {/* Edit or List */}
            {taskEditId ? (
              <form onSubmit={submitEditTask} className="task-edit-form">
                <h3>Edit Task</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={taskEditForm.title}
                  onChange={(e) =>
                    setTaskEditForm({ ...taskEditForm, title: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Description"
                  value={taskEditForm.description}
                  onChange={(e) =>
                    setTaskEditForm({
                      ...taskEditForm,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="date"
                  value={taskEditForm.dueDate}
                  onChange={(e) =>
                    setTaskEditForm({
                      ...taskEditForm,
                      dueDate: e.target.value,
                    })
                  }
                  required
                />
                <select
                  value={taskEditForm.status}
                  onChange={(e) =>
                    setTaskEditForm({ ...taskEditForm, status: e.target.value })
                  }
                  required
                >
                  <option value="assigned">Assigned</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="edit-buttons">
                  <button type="submit">Update Task</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setTaskEditId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Show filtered task list
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.dueDate?.slice(0, 10)}</td>
                      <td>{task.status}</td>
                      <td>{task.priority}</td>
                      <td>
                        {users.find((u) => u._id === task.assignedTo)
                          ?.username || "Unassigned"}
                      </td>
                      <td>
                        <button onClick={() => startEditTask(task)}>
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
        </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
