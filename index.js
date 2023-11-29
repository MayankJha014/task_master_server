const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");

PORT = 5000;

DB = "mongodb+srv://TaskMaster:task123@cluster0.ltuwngv.mongodb.net/TaskMaster";

app.use(express.json());
app.use(authRoute);
app.use(taskRoute);

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
