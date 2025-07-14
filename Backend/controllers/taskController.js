const Task = require('../models/Task');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const createTask = async (req, res) => {
  try {
    const { title, todos, dueDate, priorityType } = req.body;
    const task = new Task({
      title,
      todos,
      dueDate,
      priorityType,
      createdBy: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Create Task Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },
        { sharedWith: { $in: [req.user._id] } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: err.message });
  }
};

const toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { sharedWith: { $in: [req.user._id] } }
      ]
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.completed = req.body.completed ?? task.completed;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Task update error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!task || task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, todos, dueDate } = req.body;
    task.title = title || task.title;
    task.todos = Array.isArray(todos) ? todos : task.todos;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

const shareTask = async (req, res) => {
  const { taskId, email } = req.body;
  const { name } = req.user;

  try {
    const userToShareWith = await User.findOne({ email });
    if (!userToShareWith) {
      return res.status(404).json({ message: 'User not found' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.sharedWith.includes(userToShareWith._id)) {
      task.sharedWith.push(userToShareWith._id);
      await task.save();
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const todosText = task.todos && task.todos.length
      ? task.todos.map((t, i) => `${i + 1}. ${t}`).join('<br>')
      : 'No steps added.';

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: `📝 ${name} shared a task with you`,
      html: `
        <h3>${task.title}</h3>
        <p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
        <p><strong>Shared by:</strong> ${name}</p>
        <p><strong>Steps:</strong></p>
        <p>${todosText}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Task shared and email sent successfully!' });

  } catch (err) {
    console.error('Share task error:', err);
    res.status(500).json({ message: 'Failed to share task', error: err.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  deleteTask,
  toggleTask,
  updateTask,
  shareTask
};
