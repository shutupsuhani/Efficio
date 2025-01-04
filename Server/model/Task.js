import mongoose from "mongoose";

// Define the Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, enum: ["pending", "finished"], required: true , default: "pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User who created the task
});


// Pre-save hook to calculate the total time when a task is saved or updated
TaskSchema.pre("save", function (next) {
  console.log("Status update:", this.status);
  console.log("End time:", this.end_time);
  console.log("Start time:", this.start_time);
 
  if (this.start_time >= this.end_time) {
    const error = new Error("Start time must be earlier than end time");
    return next(error);
  }

  if (this.isModified("status") && this.status === "finished" && this.end_time === this.start_time) {
    // If status is updated to finished, set end_time to current time
    this.end_time = new Date();
  }
  next();
});

// Define the model
const Task = mongoose.model("Task", TaskSchema);

export default Task;
