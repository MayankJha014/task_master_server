const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    projectId: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      required: true,
      default: "0",
    },
    taskGroup: {
      type: String,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    assignedUser: [
      {
        userId: { type: String, default: "" },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "Ongoing",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model("Task", taskSchema);
module.exports = TaskModel;
