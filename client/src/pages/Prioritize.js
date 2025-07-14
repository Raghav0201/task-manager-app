import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HamburgerMenu from '../components/HamburgerMenu';
import TaskList from '../components/TaskList';
import '../App.css';

const Prioritize = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('early');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => task.priorityType === filter);

  return (
    <div>
      <HamburgerMenu />
      <h2>Prioritize</h2>
      <div className="prioritize-buttons">
        <button onClick={() => setFilter('early')}>Early</button>
        <button onClick={() => setFilter('late')}>Late</button>
      </div>
      <TaskList tasks={filteredTasks} />
    </div>
  );
};

export default Prioritize;