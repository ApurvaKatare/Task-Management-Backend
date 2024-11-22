const express = require("express");
const fs = require("fs");
const route = express.Router();

const taskFile = "./task.json";

// Utility function to read the tasks.json file
const readTask = () => {
  try {
    const data = fs.readFileSync(taskFile, "utf8");
    return data.trim() === "" ? [] : JSON.parse(data);
  } catch (err) {
    console.error("Error reading tasks.json:", err);
    return [];
  }
};

// GET all tasks
route.get("/", (req, res) => {
  const tasks = readTask();
  res.json(tasks);
});

// GET task by ID
route.get("/tasks/:id", (req, res) => {
  const tasks = readTask();
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// POST to add a task
route.post("/", (req, res) => {
  const tasks = readTask();
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
  res.status(201).json(newTask);
});

// PUT to update a task
route.put("/:id", (req, res) => {
  const tasks = readTask();
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return res.status(404).json({ message: "Task not found" });
  tasks[index] = { ...tasks[index], ...req.body };
  fs.writeFileSync(taskFile, JSON.stringify(tasks, null, 2));
  res.json(tasks[index]);
});

// DELETE a task
route.delete("/:id", (req, res) => {
  const tasks = readTask();
  const taskId = parseInt(req.params.id, 10);
  const updatedTasks = tasks.filter((task) => task.id !== taskId);
  fs.writeFileSync(taskFile, JSON.stringify(updatedTasks, null, 2));
  res.status(200).json({ message: `Task with ID ${taskId} has been deleted.` });res.status(204).end();
});

module.exports = route;
