import express from "express";
import Task from "../model/Task.js";
import  authenticate  from "../middleware/authenticate.js"; 
const router = express.Router();

// Create a Task
router.post("/tasks", authenticate, async (req, res) => {
  const { title, start_time, end_time, priority } = req.body;
  
  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: "User not authenticated" });
  }
  
  const task = new Task({
    title,
    start_time,
    end_time,
    priority,
    user: req.user._id, 
  });
  
  try {
    await task.save();
    res.status(201).json(task);
    console.log(req.user._id)
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a Task
router.put("/tasks/:id", authenticate, async (req, res) => {
   
    const { id } = req.params; 
    const updates = req.body; 
  
    try {
      // Find the task by ID and update it
      const updatedTask = await Task.findOneAndUpdate(
        { _id: id, user: req.user._id }, // Ensure the task belongs to the logged-in user
        updates,
        { new: true, runValidators: true } // Return the updated task and validate the fields
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found or not authorized to update this task" });
      }
  
      res.status(200).json(updatedTask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }


});

// Delete a Task
router.delete("/tasks/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Tasks with Filtering and Sorting
router.get("/tasks", authenticate, async (req, res) => {
    const { priority, status, sortBy } = req.query; // Query parameters for filtering and sorting
  const filter = { user: req.user._id }; // Filter tasks for authenticated user

  // Add filtering conditions if specified
  if (priority) {
    filter.priority = priority;
  }
  if (status) {
    filter.status = status;
  }

  try {
    // Define sorting criteria
    const sortCriteria = {};
    if (sortBy) {
      const [key, order] = sortBy.split(":");
      sortCriteria[key] = order === "desc" ? -1 : 1;
    }

    const tasks = await Task.find(filter).sort(sortCriteria);

    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Dashboard Statistics
router.get("/dashboard", authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
    
        const tasks = await Task.find({ user: userId });
    
        const totalTasks = tasks.length;
    
        const completedTasks = tasks.filter((task) => task.status === "finished").length;
        const pendingTasks = totalTasks - completedTasks;
    
        // Percentages
        const completedPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const pendingPercent = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;
    
        // Pending tasks statistics
        const pendingStats = tasks
          .filter((task) => task.status === "pending")
          .reduce(
            (stats, task) => {
              const now = new Date();
              const startTime = new Date(task.start_time);
              const endTime = new Date(task.end_time);
    
              const timeLapsed = Math.max(0, (now - startTime) / (1000 * 60 * 60)); // Time lapsed in hours
              const balanceTime = Math.max(0, (endTime - now) / (1000 * 60 * 60)); // Balance time in hours
    
              stats.totalLapsed += timeLapsed;
              stats.totalBalance += balanceTime;
    
              if (!stats.groupedByPriority[task.priority]) {
                stats.groupedByPriority[task.priority] = { lapsed: 0, balance: 0 };
              }
    
              stats.groupedByPriority[task.priority].lapsed += timeLapsed;
              stats.groupedByPriority[task.priority].balance += balanceTime;
    
              return stats;
            },
            { totalLapsed: 0, totalBalance: 0, groupedByPriority: {} }
          );
    
        // Average completion time for finished tasks
        const finishedStats = tasks
          .filter((task) => task.status === "finished")
          .reduce(
            (stats, task) => {
              const startTime = new Date(task.start_time);
              const endTime = new Date(task.end_time);
    
              const timeTaken = Math.max(0, (endTime - startTime) / (1000 * 60 * 60)); // Time taken in hours
              stats.totalTime += timeTaken;
              stats.count += 1;
    
              return stats;
            },
            { totalTime: 0, count: 0 }
          );
    
        const averageCompletionTime =
          finishedStats.count > 0 ? finishedStats.totalTime / finishedStats.count : 0;
    
        // Response data
        const dashboardData = {
          totalTasks,
          completedTasks,
          pendingTasks,
          completedPercent: completedPercent.toFixed(2),
          pendingPercent: pendingPercent.toFixed(2),
          pendingStats: {
            totalLapsed: pendingStats.totalLapsed.toFixed(2),
            totalBalance: pendingStats.totalBalance.toFixed(2),
            groupedByPriority: pendingStats.groupedByPriority,
          },
          averageCompletionTime: averageCompletionTime.toFixed(2),
        };
    
        res.status(200).json(dashboardData);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

export const taskRouter = router;
