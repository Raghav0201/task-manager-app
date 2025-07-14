import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HamburgerMenu from '../components/HamburgerMenu';
import TaskList from '../components/TaskList';

const Yet = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingTasks = res.data.filter(task => !task.completed);
        setTasks(pendingTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <HamburgerMenu />
      <h2>Pending Tasks</h2>
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Yet;
