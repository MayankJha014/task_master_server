const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      default: "",
    },
    uniqueId: {
      type: String,
      default: "",
    },
    taskGroup: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      default: "",
    },
    endDate: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      required: true,
      default: "0",
    },
    team: [
      {
        type: String,
        default: "",
      },
    ],
    stepper: [
      {
        taskId: {
          type: String,
        },
        label: {
          type: String,
        },
        color: {
          type: String,
        },
        isActive: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      default: "Ongoing",
    },
    endProject: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("Project", projectSchema);
module.exports = ProjectModel;
