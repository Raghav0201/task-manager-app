// pages/SingleTaskView.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SingleTaskView = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      navigate("/");
      return;
    }

    const fetchTask = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTask(res.data);
      } catch (err) {
        console.error("Error fetching task:", err);
        alert("Failed to load task");
        navigate("/dashboard");
      }
    };

    fetchTask();
  }, [id, navigate]);

  if (!task) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
        🔄 Loading task...
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{task.title}</h2>
        <p style={styles.date}>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</p>

        {Array.isArray(task.todos) && task.todos.length > 0 ? (
          <ul style={styles.todoList}>
            {task.todos.map((todo, idx) => (
              <li key={idx} style={styles.todoItem}>
                {idx + 1}. {todo}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ textAlign: 'center', color: '#999' }}>No steps added.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '16px',
    padding: '30px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 8px 28px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(6px)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: '600',
    textAlign: 'center',
  },
  date: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
    textAlign: 'center',
  },
  todoList: {
    paddingLeft: '20px',
  },
  todoItem: {
    fontSize: '16px',
    marginBottom: '10px',
  },
};

export default SingleTaskView;
