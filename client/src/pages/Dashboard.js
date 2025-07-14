import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import '../App.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('name');

  useEffect(() => {
    if (!token) {
      alert('Login required');
      navigate('/');
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Error loading tasks:', err);
        alert('Error loading tasks');
      }
    };

    fetchTasks();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const addTask = (newTask) => setTasks(prev => [newTask, ...prev]);

  const deleteTask = (id) =>
    setTasks(prev => prev.filter(task => task._id !== id));

  const toggleTask = (updated) =>
    setTasks(prev => prev.map(task => task._id === updated._id ? updated : task));

  const updateTask = async (updatedTask) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${updatedTask._id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev =>
        prev.map(task => (task._id === updatedTask._id ? res.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error updating task.");
    }
  };

  return (
    <div>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <HamburgerMenu />
        <button className="logout-button" onClick={handleLogout}>
          <i className="fa-solid fa-power-off"></i> Logout
        </button>
      </div>

      <h2><i className="fa-solid fa-door-open"></i> Welcome, {userName}</h2>
      <p style={{ textAlign: 'center', color: '#444' }}>
        Your focus zone starts here <i className="fa-solid fa-jet-fighter"></i>
      </p>

      <TaskForm onTaskAdded={addTask} />
      <TaskList
        tasks={tasks}
        onDeleted={deleteTask}
        onToggled={toggleTask}
        onUpdated={updateTask}
      />
    </div>
  );
};

export default Dashboard;
