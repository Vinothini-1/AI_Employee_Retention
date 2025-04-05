import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignTask = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]); // State to store assigned tasks
  const [task, setTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });
    const clearTasks = () => {
      if (window.confirm("Are you sure you want to clear all assigned tasks?")) {
        setTasks([]);
        localStorage.removeItem("assignedTasks");
        toast.success("Assigned tasks cleared successfully.");
      }
    };
  
  const axiosBaseURL = "http://localhost:8000/api";

  // Fetch users from backend
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

    // Instead of fetching tasks from a non-existent backend endpoint, load from localStorage
    const storedTasks = localStorage.getItem("assignedTasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    
    fetchUsers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  // Handle form submission for task assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate assigning task and saving it permanently in localStorage
    try {
      // Create a new task object, assign a unique _id (using Date.now) and include assigned user's info if available
      const newTask = {
        ...task,
        _id: Date.now().toString(),
        assignedTo: users.find((u) => u._id === task.assignedTo) || { name: "Unknown" },
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem("assignedTasks", JSON.stringify(updatedTasks));
      toast.success("Task assigned successfully!");
      // Reset the form
      setTask({ title: "", description: "", assignedTo: "", priority: "Medium", dueDate: "" });
    } catch (error) {
      console.error("Error assigning task:", error.message);
      toast.error("Failed to assign task.");
    }
  };

  return (
    <div className="container mt-4">
      

      {/* Display assigned tasks in a table */}
      <h4 className="mt-4">Assigned Tasks</h4>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Title</th>
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
                <td>{task.description}</td>
                <td>{task.assignedTo.name}</td>
                <td>{task.priority}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No tasks assigned yet.</td>
            </tr>
          )}
        </tbody>
        <button className="btn btn-danger mt-3" onClick={clearTasks}>
        Clear Assigned Tasks
      </button>
      </table>
      <ToastContainer />
    </div>
    
  );
};

export default AssignTask;
