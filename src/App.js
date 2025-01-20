import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks");
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTask && category) {
      try {
        const response = await axios.post("/api/tasks", {
          task: newTask,
          category,
        });
        setTasks([...tasks, response.data]); // Add new task to state
        setNewTask(""); // Clear the input
        setCategory(""); // Clear the category
      } catch (err) {
        console.error("Error adding task:", err);
      }
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, {
        completed: !completed,
      });
      setTasks(
        tasks.map((task) =>
          task.id === response.data.id ? response.data : task
        )
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id)); // Remove deleted task
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Fetch tasks on component mount
  React.useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>To-Do List</h1>
      </header>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task ${task.completed ? "completed" : ""}`}
          >
            <div>
              <h3>{task.task}</h3>
              <p>Category: {task.category}</p>
            </div>
            <div>
              <button onClick={() => toggleComplete(task.id, task.completed)}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
