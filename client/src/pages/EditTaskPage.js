import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = res.data.find(t => t._id === taskId);
        if (!found) {
          alert("Task not found.");
          return navigate('/dashboard');
        }

        setTask(found);
        setTitle(found.title || '');
        setDueDate(found.dueDate?.substring(0, 10) || '');
        setTodos(found.todos || []);
      } catch (err) {
        console.error('Error loading task:', err);
        alert("Something went wrong while fetching task.");
      }
    };

    fetchTask();
  }, [taskId, navigate, token]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...task,
        title,
        dueDate,
        todos: todos.filter(todo => todo.trim() !== '')
      };

      await axios.put(`http://localhost:5000/api/tasks/update/${taskId}`, { title, todos, dueDate }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


      alert('Task updated!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update task.');
    }
  };

  const handleTodoChange = (index, value) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = value;
    setTodos(updatedTodos);
  };

  const addTodo = () => setTodos(prev => [...prev, '']);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="modal-content" style={{ margin: '40px auto', maxWidth: '500px' }}>
      <h3>Edit Task</h3>
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <h4>Steps</h4>
        {todos.map((todo, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Step ${i + 1}`}
            value={todo}
            onChange={(e) => handleTodoChange(i, e.target.value)}
          />
        ))}

        <button type="button" onClick={addTodo}>+ Add Step</button>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditTaskPage;
