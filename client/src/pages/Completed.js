import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HamburgerMenu from '../components/HamburgerMenu';
import TaskList from '../components/TaskList';

const Completed = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const completed = res.data.filter(task => task.completed);
      setTasks(completed);
    })
    .catch(err => console.error('Error fetching completed tasks:', err));
  }, []);

  return (
    <div>
      <HamburgerMenu />
      <h2>Completed Tasks</h2>
      <TaskList tasks={tasks} disabledCheckbox={true} />
    </div>
  );
};

export default Completed;
