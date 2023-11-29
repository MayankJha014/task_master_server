const express = require("express");
const {
  createApi,
  getTask,
  searchFriends,
  addFriends,
  getFriends,
  dailyTask,
  getProject,
  addTaskInStepper,
  getStepperTask,
  endProject,
  activateTask,
  getOtherProject,
  endTask,
} = require("../controller/taskController");
const auth = require("../middlewares/auth");
const taskRoute = express.Router();

taskRoute.post("/api/create-post", auth, createApi);
taskRoute.post("/api/daily-task", auth, dailyTask);
taskRoute.post("/api/add-friend/:id", auth, addFriends);
taskRoute.post("/api/add-task/stepper/:id", auth, addTaskInStepper);
taskRoute.post("/api/end-project/:id", auth, endProject);
taskRoute.post("/api/end-task/:id", auth, endTask);
taskRoute.post("/api/activate-task/:id", auth, activateTask);
taskRoute.get("/api/get-friend/:id", auth, getFriends);
taskRoute.get("/api/get-stepper-task/:projectId", auth, getStepperTask);
taskRoute.get("/api/get-task", auth, getTask);
taskRoute.get("/api/get-project-other", auth, getOtherProject);
taskRoute.get("/api/get-project", auth, getProject);
taskRoute.get("/api/add-friend/:displayName", auth, searchFriends);

module.exports = taskRoute;
