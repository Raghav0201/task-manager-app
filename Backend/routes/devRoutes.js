const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

router.get('/fix-completed', async (req, res) => {
  try {
    const result = await Task.updateMany(
      { completed: { $exists: false } },
      { $set: { completed: false } }
    );
    res.json({ message: 'Tasks updated successfully!', result });
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({ message: 'Update failed', error });
  }
});

module.exports = router;
