const express = require("express");
const Task = require("../models/Task");
const {
  getUser,
  getTask,
  generateAccessToken,
  authenticateWebToken,
} = require("../util/util");

let app = express.Router();

/* TaskId  */
app.param("taskId", (req, res, next, taskId) => {
  Task.findById(taskId).exec((err, task) => {
    // console.log("Task from param", task);
    req.task = task;
    next();
  });
});

/* Create a new task */
app.post("/", authenticateWebToken, (req, res) => {
  const task = getTask(req);

  const newTask = new Task(task);

  newTask.save(function (err, doc) {
    return res.send(doc);
  });
});

/* Update a task */
app.patch("/:taskId", authenticateWebToken, (req, res) => {});

module.exports = app;
