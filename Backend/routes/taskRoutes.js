const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

const {
  createTask,
  getTasks,
  toggleTask, 
  deleteTask,
  shareTask
} = require('../controllers/taskController');

router.post('/', protect, createTask);
router.get('/', protect, getTasks);
router.put('/:id', protect, toggleTask);  
router.delete('/:id', protect, deleteTask);
router.post('/share', protect, shareTask);

module.exports = router;
