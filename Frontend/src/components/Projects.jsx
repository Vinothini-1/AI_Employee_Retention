import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    title: "",
    id: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  const axiosBaseURL = "http://localhost:8000/api";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${axiosBaseURL}/employees/all`, {
          headers: { authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };

    const storedTasks = localStorage.getItem("assignedTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.assignedTo) {
      toast.error("Please select a user to assign the task.");
      return;
    }

    try {
      const res = await axios.post(
        `${axiosBaseURL}/tasks/assign`,
        { ...task },
        {
          headers: { authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );

      const newTask = { ...res.data.task, assignedTo: users.find((u) => u._id === task.assignedTo) };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem("assignedTasks", JSON.stringify(updatedTasks));

      toast.success("Task assigned successfully!");
      setTask({ title: "", id: "", description: "", assignedTo: "", priority: "Medium", dueDate: "" });
    } catch (error) {
      console.error("Error assigning task:", error.response?.data || error.message);
      toast.error("Failed to assign task.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Assign Task</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Task Title:</label>
          <input type="text" className="form-control" name="title" value={task.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Task ID:</label>
          <input type="text" className="form-control" name="id" value={task.id} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Assign To:</label>
          <select className="form-select" name="assignedTo" value={task.assignedTo} onChange={handleChange} required>
            <option value="">Select a User</option>
            <option value=""></option>
          </select>
        </div>
        <div className="mb-3">
          <label>Description:</label>
          <textarea className="form-control" name="description" value={task.description} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Priority:</label>
          <select className="form-select" name="priority" value={task.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Due Date:</label>
          <input type="date" className="form-control" name="dueDate" value={task.dueDate} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Assign Task
        </button>
      </form>

      <h4 className="mt-4">Assigned Tasks</h4>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>ID</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Priority</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.id}</td>
                <td>{task.description}</td>
                <td>{task.assignedTo?.name || "Unknown"}</td>
                <td>{task.priority}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No tasks assigned yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AssignTask;
