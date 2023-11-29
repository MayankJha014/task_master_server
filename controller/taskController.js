const auth = require("../middlewares/auth");
const ProjectModel = require("../models/projectSchema");
const TaskModel = require("../models/taskSchema");
const User = require("../models/userShcema");
const axios = require("axios");

exports.createApi = async (req, res) => {
  try {
    const { taskGroup, projectName, color, startDate, endDate, logo, status } =
      req.body;

    let user = await User.findById(req.user);

    let task = await ProjectModel({
      adminId: req.user,
      uniqueId: user.uniqueId,
      color: color,
      taskGroup: taskGroup,
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      logo: logo,
      status: status,
    });

    task = await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.dailyTask = async (req, res) => {
  try {
    const {
      projectId,
      taskGroup,
      task,
      color,
      assignedUser,
      startDate,
      endDate,
      status,
    } = req.body;

    let dailyTask = await TaskModel({
      projectId: projectId,
      assignedUser: assignedUser,
      taskGroup: taskGroup,
      task: task,
      startDate: startDate,
      endDate: endDate,
      color: color,
      status: status,
    });

    dailyTask = await dailyTask.save();

    res.status(200).json(dailyTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await TaskModel.find({
      "assignedUser.userId": req.user,
    });
    // const task = await TaskModel.find({
    //   assignedUser: { userId: req.user },
    // });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProject = async (req, res) => {
  try {
    const project = await ProjectModel.find({ adminId: req.user });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOtherProject = async (req, res) => {
  try {
    let otherproject = await ProjectModel.find({ team: req.user });
    let project = await ProjectModel.find({ adminId: req.user });
    let result = otherproject.filter((x) => project.includes(x));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchFriends = async (req, res) => {
  try {
    const user = await User.find({
      displayName: { $regex: req.params.displayName, $options: "i" },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriends = async (req, res) => {
  try {
    const { uid } = req.body;
    let task = await ProjectModel.findById(req.params.id);
    if (task.team.indexOf(uid) !== -1) {
      console.log(task.team.indexOf(uid));
      var i = task.team.indexOf(uid);
      res.status(200).json("User already added to this Project");
    } else {
      task.team.push(uid);
      task = await task.save();
      res.status(200).json(task);
    }
    let user = await User.findById(uid);

    user = user.deviceToken;
    console.log(user);
    const data = JSON.stringify({
      to: user,
      notification: {
        title: `You are added in ${task.projectName}`,
        body: "Congratulation",
      },
    });

    axios
      .post("https://fcm.googleapis.com/fcm/send", data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization":
            "key=AAAAwj-x4S8:APA91bH_6X6OXCHvCtM_RD2VHKGVGCjCg5wyu1XNnt85nVGCXl86ipATMLerHM5sZ8ae3xG6AmFDNXYkyvDzje1LKtBUI31y4qtjbuOezFEIsW4pwlARt7NmVp81lHKzOXveen5BeCRz",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    let task = await ProjectModel.findById(req.params.id);
    taskLength = task.team.length;
    console.log(taskLength);
    let taskData = [];
    for (let i = 0; i < taskLength; i++) {
      taskData.push(await User.findById(task.team[i]));
    }
    res.status(200).json(taskData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTaskInStepper = async (req, res) => {
  try {
    let project = await ProjectModel.findById(req.params.id);

    console.log(req.params.id);
    let {
      taskGroup,
      projectId,
      label,
      startDate,
      endDate,
      assignedUser,
      status,
      task,
      color,
    } = req.body;

    let ans = [];
    assignedUser.forEach((data) => {
      ans.push(JSON.parse(data));
    });

    console.log(ans);
    let dailyTask = await TaskModel({
      projectId: projectId,
      assignedUser: ans,
      taskGroup: taskGroup,
      task: task,
      startDate: startDate,
      endDate: endDate,
      color: color,
      status: status,
    });

    dailyTask = await dailyTask.save();

    await project.stepper.push({
      color: color,
      label: label,
      taskId: dailyTask.id,
      isActive: false,
    });
    project = await project.save();
    res.status(200).json({ dailyTask, project });

    console.log(ans);
    for (let i = 0; i < ans.length; i++) {
      console.log(ans[i].userId);
      let user = ans[i].userId;
      user = await User.findById(user);
      user = user.deviceToken;
      const data = JSON.stringify({
        to: user,
        notification: {
          title: `Task assigned`,
          body: `${task}`,
        },
      });

      axios
        .post("https://fcm.googleapis.com/fcm/send", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAwj-x4S8:APA91bH_6X6OXCHvCtM_RD2VHKGVGCjCg5wyu1XNnt85nVGCXl86ipATMLerHM5sZ8ae3xG6AmFDNXYkyvDzje1LKtBUI31y4qtjbuOezFEIsW4pwlARt7NmVp81lHKzOXveen5BeCRz",
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStepperTask = async (req, res) => {
  try {
    let task = await TaskModel.find({ projectId: req.params.projectId });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endProject = async (req, res) => {
  try {
    const { endProject } = req.body;
    let project = await ProjectModel.findById(req.params.id);
    console.log(project);
    project.endProject = endProject;
    project = await project.save();
    res.status(200).json(project);
    let ans = project.team
    for (let i = 0; i < ans.length; i++) {
      console.log(ans[i]);
      let user = ans[i];
      user = await User.findById(user);
      user = user.deviceToken;
      const data = JSON.stringify({
        to: user,
        notification: {
          title: `${project.projectName}`,
          body: `Project Ended Successfully`,
        },
      });

      axios
        .post("https://fcm.googleapis.com/fcm/send", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAwj-x4S8:APA91bH_6X6OXCHvCtM_RD2VHKGVGCjCg5wyu1XNnt85nVGCXl86ipATMLerHM5sZ8ae3xG6AmFDNXYkyvDzje1LKtBUI31y4qtjbuOezFEIsW4pwlARt7NmVp81lHKzOXveen5BeCRz",
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.endTask = async (req, res) => {
  try {
    const { endTask } = req.body;
    let project = await TaskModel.findById(req.params.id);
    project.status = endTask;
    project = await project.save();
    res.status(200).json(project);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.activateTask = async (req, res) => {
  try {
    const { activateTask, userId } = req.body;
    let task = await TaskModel.findById(req.params.id);
    let user = task.assignedUser;
    user = await user.find((element) => element.userId == userId);
    console.log(user);
    user.isCompleted = activateTask;
    user = await task.save(); // project = await project.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
