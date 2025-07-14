const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  todos: {
    type: [String],
    default: [],
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  dueDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  completed: {
    type: Boolean,
    default: false,
  },
  priorityType: {
    type: String,
    enum: ['early', 'late'],
    default: 'late',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
