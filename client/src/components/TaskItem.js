import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const TaskItem = ({ task, onDeleted, onToggled, onUpdated, disabledCheckbox = false }) => {
  const token = localStorage.getItem("token");
  const [showShare, setShowShare] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [localCompleted, setLocalCompleted] = useState(!!task.completed);
  const [timeLeft, setTimeLeft] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLocalCompleted(!!task.completed);
  }, [task.completed]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const due = new Date(task.dueDate);
      const diff = due - now;

      if (diff <= 0) {
        setTimeLeft("Task date ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setTimeLeft(`${days} days ${hours} hrs left`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [task.dueDate]);

  const deleteTask = async () => {
    await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onDeleted(task._id);
  };

  const shareTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks/share", {
        taskId: task._id,
        email: shareEmail,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Task shared successfully!");
      setShareEmail('');
      setShowShare(false);
    } catch (err) {
      console.error("Error sharing task:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to share task.");
    }
  };

  const toggleComplete = async () => {
    const newCompleted = !localCompleted;
    setLocalCompleted(newCompleted);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/update/${task._id}`,
        { completed: newCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onToggled) onToggled(res.data);
    } catch (err) {
      console.error("Toggle error:", err);
      alert("Failed to toggle task.");
      setLocalCompleted(!newCompleted); // Revert if failed
    }
  };



  const strikeStyle = localCompleted ? {
    textDecoration: 'line-through',
    color: '#888'
  } : {};


  return (
    <div
  className="task-card compact-task-card"
  style={{
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    ...strikeStyle
  }}
>

      <div className="compact-task-row">
        <div className="compact-task-left">
          <input
            type="checkbox"
            checked={localCompleted}
            onChange={!disabledCheckbox ? toggleComplete : undefined}
            disabled={disabledCheckbox}
            style={{
              width: "18px",
              height: "18px",
              cursor: disabledCheckbox ? "not-allowed" : "pointer"
            }}
          />
          <h4 style={{ marginLeft: "10px", ...strikeStyle }}>{task.title}</h4>
        </div>
        <div className="compact-task-actions">
          <button onClick={() => navigate(`/edit/${task._id}`)}><MdModeEdit /></button>
          <button onClick={deleteTask}><MdDelete /></button>
          <button onClick={() => setShowShare(prev => !prev)}><FaShareAlt /></button>
        </div>
      </div>

      <ul>
        {Array.isArray(task.todos) && task.todos.length > 0 && task.todos.some(t => t && t.trim()) ? (
          task.todos
            .filter(todo => todo && todo.trim())
            .map((todo, i) => (
              <li
                key={i}
                style={{ cursor: 'pointer', ...strikeStyle }}
                onClick={(e) => {
                  const current = e.target.style.textDecoration;
                  e.target.style.textDecoration = current === 'line-through' ? 'none' : 'line-through';
                  e.target.style.color = current === 'line-through' ? '#000' : '#888';
                }}
              >
                {todo}
              </li>
            ))
        ) : (
          <li style={strikeStyle}>No steps added</li>
        )}
      </ul>

      <div className="task-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...strikeStyle }}>
        <span style={{ flex: 1 }}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: '500' }}>{timeLeft}</span>
        <span style={{ flex: 1, textAlign: 'right', fontWeight: '500' }}>Priority: {task.priorityType}</span>
      </div>

      {showShare && (
        <form onSubmit={shareTask} style={{ marginTop: '10px' }}>
          <input
            type="email"
            placeholder="Collaborator's Email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '8px', marginRight: '10px' }}
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default TaskItem;
