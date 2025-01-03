import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import axios from "axios";
import { Edit2Icon, DeleteIcon, MoveLeftIcon } from "lucide-react";
import { ListNumbers, Plus, Trash } from "@phosphor-icons/react";
import { format } from "date-fns"; // Using date-fns for date formatting
import { Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Stores all tasks
  const [modalOpen, setModalOpen] = useState(false); // Controls modal visibility
  const [taskData, setTaskData] = useState({
    _id: "",
    title: "",
    start_time: "",
    end_time: "",
    priority: "",
  }); // Stores the task being created or edited
  const [isEditing, setIsEditing] = useState(false); // Editing mode flag
  const [errorMessage, setErrorMessage] = useState(""); // Error message for validation

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authentication token is missing. Please log in.");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/file/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched tasks:", response.data); // Debugging
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setErrorMessage("Failed to fetch tasks. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  // Open modal for adding or editing
  const openModal = (task = { _id: "", title: "", start_time: "", end_time: "", priority: "" }) => {
    setTaskData(task);
    setIsEditing(!!task._id);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setTaskData({ _id: "", title: "", start_time: "", end_time: "", priority: "" });
    setErrorMessage(""); // Clear error message
  };

  const saveTask = async () => {
    if (!taskData.title || !taskData.start_time || !taskData.end_time || !taskData.priority) {
      setErrorMessage("All fields are required");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve the token
    if (!token) {
      console.error("Authentication token is missing");
      setErrorMessage("You must be logged in to save a task.");
      return;
    }

    try {
      if (isEditing) {
        // Update task
        await axios.put(
          `http://localhost:3000/api/file/tasks/${taskData._id}`, // Use taskData._id for the update
          {
            title: taskData.title,
            start_time: taskData.start_time,
            end_time: taskData.end_time,
            priority: taskData.priority,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        // Update the task in the state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskData._id ? { ...task, ...taskData } : task
          )
        );
      } else {
        // Create new task
        const response = await axios.post(
          "http://localhost:3000/api/file/tasks",
          {
            title: taskData.title,
            start_time: taskData.start_time,
            end_time: taskData.end_time,
            priority: taskData.priority,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to save task. Please try again.");
    }
  };

  const deleteTask = async (_id) => {
    const token = localStorage.getItem("token");
    console.log(_id);
    if (!token) {
      console.error("Authentication token is missing");
      setErrorMessage("You must be logged in to delete a task.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/file/tasks/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== _id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setErrorMessage("Failed to delete task. Please try again.");
    }
  };

  // Format date-time to a human-readable format
  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return format(date, "PPPppp"); // Example format: 'Jan 1, 2025, 3:30:00 PM'
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
     <Link to={'/'}> <div className="text-black p-5"><MoveLeftIcon/></div> </Link>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl flex space-x-3 text-blue-950 font-bold">
            <ListNumbers size={32} /> <span>Task List</span>
          </h1>
          <button
            onClick={() => openModal()}
            className="bg-white shadow-md flex items-center justify-center space-x-1 px-4 py-2 rounded"
          >
            <div className="flex space-x-2 justify-center items-center">
              <div className="bg-green-600 rounded-full w-3 h-3"></div>
              <div className="bg-red-600 rounded-full w-3 h-3"></div>
              <div className=" bg-yellow-300 rounded-full w-3 h-3"></div>
            </div>
            <Plus className="text-black font-extrabold" size={32} />
          </button>
        </div>
        <div className="grid text-black grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-blue-100 border rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-black">{task.title}</h2>
                <p>
                  Start: {formatDateTime(task.start_time)} 
                </p>
                <p>
                End: {formatDateTime(task.end_time)}
                </p>
                <p>Priority: {task.priority}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(task)}
                  className="text-yellow-500 hover:underline"
                >
                  <Edit2Icon />
                </button>
                <button
                  onClick={() => deleteTask(task._id)} // Use task._id instead of task.id
                  className="text-red-500 hover:underline"
                >
                  <Trash size={32} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
              {isEditing ? "Edit Task" : "Add Task"}
            </h2>

            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full p-3 border text-gray-600 bg-slate-100 rounded-lg focus:ring focus:ring-blue-300"
              />

              <input
                type="datetime-local"
                name="start_time"
                value={taskData.start_time}
                onChange={handleChange}
                className="w-full p-3 border  text-gray-600 bg-slate-100 rounded-lg focus:ring focus:ring-blue-300"
              />

              <input
                type="datetime-local"
                name="end_time"
                value={taskData.end_time}
                onChange={handleChange}
                className="w-full p-3 border  text-gray-600 bg-slate-100 rounded-lg focus:ring focus:ring-blue-300"
              />

              <input
                type="text"
                name="priority"
                placeholder="Priority (e.g., Low, Medium, High)"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full p-3 border  text-gray-600 bg-slate-100 rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-5 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>

              <button
                onClick={saveTask}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;