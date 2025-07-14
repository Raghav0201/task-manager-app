import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TaskForm.css';

const TaskForm = ({ onTaskAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState(['']);
  const [dueDate, setDueDate] = useState('');
  const [priorityType, setPriorityType] = useState('late');

  const handleTodoChange = (index, value) => {
    const updated = [...todos];
    updated[index] = value;
    setTodos(updated);
  };

  const addTodoField = () => setTodos([...todos, '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const cleanedTodos = todos.filter(todo => todo.trim() !== '');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/tasks',
        { title, todos: cleanedTodos, dueDate, priorityType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onTaskAdded(res.data);
      setTitle('');
      setTodos(['']);
      setDueDate('');
      setPriorityType('late');
      setShowModal(false);
    } catch (err) {
      console.error('Add Task Error:', err.response?.data || err.message);
      alert('Error adding task');
    }
  };

  return (
    <div>
      <button className="new-task-button" onClick={() => setShowModal(true)}>
        Create New Task
      </button>

      {showModal && (
        <div className="modal-overlay create-modal-overlay">
          <div className="modal-content">
            <h3>Create Task</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Task Title"
                required
              />

              <h4>Steps</h4>
              {todos.map((todo, idx) => (
                <input
                  key={idx}
                  className="form-input"
                  value={todo}
                  onChange={e => handleTodoChange(idx, e.target.value)}
                  placeholder={`Step ${idx + 1}`}
                />
              ))}

              <button
                type="button"
                className="new-task-button"
                onClick={addTodoField}
              >
                + Add Step
              </button>

              <h4>Due Date</h4>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />

              <label>Priority</label>
              <select
                value={priorityType}
                onChange={e => setPriorityType(e.target.value)}
              >
                <option value="early">Early</option>
                <option value="late">Late</option>
              </select>

              <button type="submit" className="new-task-button">Create</button>
              <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskForm;
