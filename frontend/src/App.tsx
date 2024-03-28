import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const statusOptions = ["To Do", "In Progress", "Done"];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const [filter, setFilter] = useState("All");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const startEditing = (task: Task) => {
    setIsEditing(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  };

  const fetchTasks = async () => {
    const response = await fetch("http://localhost:8080/tasks");
    const data = await response.json();
    if (filter === "All") {
      setTasks(data);
    } else {
      setTasks(data.filter((task: Task) => task.status === filter));
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required.");

    try {
      await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status }),
      });
      setTitle("");
      setDescription("");
      setStatus(statusOptions[0]);
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (id: number) => {
    if (!editTitle.trim() || !editStatus) {
      alert("Title and status are required.");
      return;
    }

    try {
      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status: editStatus,
        }),
      });
      setIsEditing(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <form onSubmit={handleCreateTask} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border-gray-300 shadow-sm"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border-gray-300 shadow-sm"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2">
          Create Task
        </button>
      </form>

      <div className="mb-4">
        <label htmlFor="filter" className="block text-sm font-medium mb-1">
          Filter Tasks
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border-gray-300 shadow-sm"
        >
          <option value="All">All</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-4 p-4 border rounded shadow-sm">
            {isEditing === task.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border-2 border-gray-200 p-2 w-full mb-2"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border-2 border-gray-200 p-2 w-full mb-2"
                ></textarea>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="border-2 border-gray-200 p-2 w-full mb-2"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleUpdateTask(task.id)}
                  className="bg-green-500 text-white p-2 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="bg-gray-500 text-white p-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="mb-4">{task.description}</p>
                <p className="mb-4">Status: {task.status}</p>
                <button
                  onClick={() => startEditing(task)}
                  className="bg-yellow-500 text-white p-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white p-2"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
