const express = require("express");
const Task = require("../models/Task");
const {
  getUser,
  getTask,
  editTask,
  authenticateWebToken,
} = require("../util/util");

let app = express.Router();

/* TaskId  */
app.param("taskId", (req, res, next, taskId) => {
  Task.findById(taskId).exec((err, task) => {
    if (err) {
      return res.status(404).send({ message: "Item not found " });
    }

    req.task = task;

    if (task.author != req.user._id) {
      return res.status(403).send({ message: "Access prohibited " });
    }

    next();
  });
});

/* Get a task */
app.get("/:taskId", authenticateWebToken, (req, res) => {
  res.send(req.task);
});

/* Get all Tasks */
app.get("/", authenticateWebToken, (req, res) => {
  const id = req.user._id;

  Task.find({ author: id }).exec((err, task) => {
    console.log("All tasks ", task);

    res.send(task);
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
app.patch("/:taskId", authenticateWebToken, (req, res) => {
  const taskMod = editTask(req);

  const { name = "", description = "", completed = "" } = taskMod;

  const { task } = req;

  if (name) {
    task.name = name;
  }

  if (description) {
    task.description = description;
  }

  if (completed != null || undefined) {
    task.completed = completed;
  }

  task.save(function (err, doc) {
    if (err) {
      return res.send({ message: "Invalid " });
    }

    return res.send(doc);
  });
});

module.exports = app;
