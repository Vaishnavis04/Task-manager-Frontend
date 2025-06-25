import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import { FaTasks, FaListUl } from "react-icons/fa";

import "./UserDashboard.css";

const ITEMS_PER_PAGE = 5;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("assigned");
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState([{ title: "", completed: false }]);
  const [editTodo, setEditTodo] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filterText.toLowerCase());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [filterText]);

  const fetchMyTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos/my-todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchMyTasks();
    fetchTodos();
  }, []);

  const updateStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchMyTasks();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const todoData = {
        title,
        description,
        priority,
        dueDate,
        subtasks: subtasks.filter((s) => s.title.trim() !== ""),
      };

      if (editTodo) {
        await API.put(`/todos/${editTodo._id}`, todoData);
      } else {
        await API.post("/todos", todoData);
      }

      resetForm();
      fetchTodos();
    } catch (err) {
      console.error("Error saving todo:", err.message);
    }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority || "Medium");
    setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    setSubtasks(
      todo.subtasks?.length ? todo.subtasks : [{ title: "", completed: false }],
    );
  };

  const toggleTodoComplete = async (todoId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );

    try {
      await API.patch(`/todos/${todoId}/toggleComplete`);
    } catch (err) {
      console.error("Failed to toggle completion", err);
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    }
  };

  const toggleSubtask = async (todoId, subtaskIndex) => {
    try {
      await API.patch(`/todos/${todoId}/subtasks/${subtaskIndex}/toggle`);
      fetchTodos();
    } catch (err) {
      console.error("Error toggling subtask:", err.message);
    }
  };

  const handleDeleteSubtask = async (todoId, subtaskIndex) => {
    try {
      await API.delete(`/todos/${todoId}/subtasks/${subtaskIndex}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting subtask:", err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  const handleSubtaskChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index][field] = value;
    setSubtasks(updated);
  };

  const addSubtaskField = () => {
    setSubtasks([...subtasks, { title: "", completed: false }]);
  };

  const resetForm = () => {
    setEditTodo(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setSubtasks([{ title: "", completed: false }]);
  };
  const handleSaveEdit = async (index) => {
    try {
      const response = await axios.put(
        `/api/todos/${todo._id}/subtasks/${index}/edit`,
        { newText: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setEditIndex(null);
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === todo._id ? response.data : t)),
      );
    } catch (err) {
      console.error("Failed to edit subtask", err);
    }
  };

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "dueDate") {
        aVal = aVal ? new Date(aVal) : new Date(0);
        bVal = bVal ? new Date(bVal) : new Date(0);
      } else {
        aVal = aVal?.toString().toLowerCase() || "";
        bVal = bVal?.toString().toLowerCase() || "";
      }

      return sortOrder === "asc"
        ? aVal < bVal
          ? -1
          : 1
        : aVal > bVal
          ? -1
          : 1;
    });
    return sorted;
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (debouncedFilter) {
      filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedFilter),
      );
    }
    return sortItems(filtered);
  }, [tasks, debouncedFilter, sortField, sortOrder]);

  const filteredTodos = useMemo(() => {
    let filtered = todos;
    if (debouncedFilter) {
      filtered = todos.filter((todo) =>
        todo.title.toLowerCase().includes(debouncedFilter),
      );
    }
    return sortItems(filtered);
  }, [todos, debouncedFilter, sortField, sortOrder]);

  const paginatedItems = (items) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const totalPages = (items) => Math.ceil(items.length / ITEMS_PER_PAGE);

  const clearFilter = () => {
    setFilterText("");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterText("");
    setSortField("title");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  return (
    <div className="dashboard-container">
      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h3
          onClick={() => handleTabChange("assigned")}
          className={activeTab === "assigned" ? "active" : ""}
        >
          📌 Assigned Tasks
        </h3>
        <h3
          onClick={() => handleTabChange("todo")}
          className={activeTab === "todo" ? "active" : ""}
        >
          📝 Personal To-do
        </h3>
      </div>

      <div
        className="main-content"
        style={{ flex: 1, padding: "20px", overflowY: "auto" }}
      >
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder={`Filter ${activeTab === "assigned" ? "Tasks" : "To-dos"} by Title`}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ padding: "6px", width: "300px", marginRight: "10px" }}
          />
          <button onClick={clearFilter} disabled={!filterText}>
            Clear
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>
            Sort by:{" "}
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="title">Title</option>
              <option value="dueDate">Due Date</option>
            </select>
          </label>

          <label style={{ marginLeft: "15px" }}>
            Order:{" "}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>

        {activeTab === "assigned" ? (
          <>
            <h2>Assigned Tasks</h2>
            {filteredTasks.length === 0 ? (
              <p>No tasks assigned matching the filter.</p>
            ) : (
              <>
                <table
                  border="1"
                  cellPadding="8"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems(filteredTasks).map((task) => (
                      <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>{task.status || "assigned"}</td>
                        <td>
                          <select
                            value={task.status || "assigned"}
                            onChange={(e) =>
                              updateStatus(task._id, e.target.value)
                            }
                          >
                            <option value="assigned">Assigned</option>
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    Page {currentPage} of {totalPages(filteredTasks)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, totalPages(filteredTasks)),
                      )
                    }
                    disabled={currentPage === totalPages(filteredTasks)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <h2>My To-dos</h2>

            <form
              onSubmit={handleSubmit}
              style={{
                marginBottom: "30px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                maxWidth: "600px",
              }}
            >
              <h3>{editTodo ? "Edit To-do" : "Add To-do"}</h3>

              <input
                type="text"
                placeholder="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "6px", marginBottom: "10px" }}
              />

              <label>
                Priority:{" "}
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ marginBottom: "10px" }}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <br />

              <label>
                Due Date:{" "}
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ marginBottom: "10px" }}
                />
              </label>

              <div style={{ marginTop: "10px" }}>
                <label>Subtasks:</label>
                {subtasks.map((subtask, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={(e) =>
                        handleSubtaskChange(i, "completed", e.target.checked)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Subtask title"
                      value={subtask.title}
                      onChange={(e) =>
                        handleSubtaskChange(i, "title", e.target.value)
                      }
                      style={{ flex: 1, marginLeft: "8px", padding: "4px" }}
                    />
                  </div>
                ))}
                <button type="button" onClick={addSubtaskField}>
                  + Add Subtask
                </button>
              </div>

              <button type="submit" style={{ marginTop: "15px" }}>
                {editTodo ? "Update To-do" : "Add To-do"}
              </button>
              {editTodo && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              )}
            </form>

            {filteredTodos.length === 0 ? (
              <p>No to-dos matching the filter.</p>
            ) : (
              <>
                <table
                  border="1"
                  cellPadding="8"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Completed</th>
                      <th>Subtasks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems(filteredTodos).map((todo) => (
                      <tr key={todo._id}>
                        <td>{todo.title}</td>
                        <td>{todo.description}</td>
                        <td>{todo.priority}</td>
                        <td>
                          {todo.dueDate
                            ? new Date(todo.dueDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{todo.completed ? "✔️" : "❌"}</td>
                        <td>
                          {todo.subtasks?.length ? (
                            <ul style={{ paddingLeft: "20px", margin: 0 }}>
                              {todo.subtasks.map((st, idx) => (
                                <li key={idx}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={st.completed}
                                      onChange={() =>
                                        toggleSubtask(todo._id, idx)
                                      }
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span
                                      style={{
                                        textDecoration: st.completed
                                          ? "line-through"
                                          : "none",
                                      }}
                                    >
                                      {st.title}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleDeleteSubtask(todo._id, idx)
                                      }
                                      style={{
                                        marginLeft: "8px",
                                        color: "red",
                                      }}
                                    >
                                      🗑
                                    </button>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No subtasks"
                          )}
                        </td>
                        <td>
                          <button onClick={() => handleEdit(todo)}>Edit</button>
                          <button onClick={() => toggleTodoComplete(todo._id)}>
                            {todo.completed
                              ? "Mark Incomplete"
                              : "Mark Complete"}
                          </button>
                          <button onClick={() => deleteTodo(todo._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    Page {currentPage} of {totalPages(filteredTodos)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, totalPages(filteredTodos)),
                      )
                    }
                    disabled={currentPage === totalPages(filteredTodos)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
