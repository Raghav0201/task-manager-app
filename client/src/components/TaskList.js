// TaskList.js
import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDeleted, onToggled, onUpdated, disabledCheckbox = false }) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onDeleted={onDeleted}
          onToggled={onToggled}
          onUpdated={onUpdated}
          disabledCheckbox={disabledCheckbox} // ✅ forward the prop
        />
      ))}
    </div>
  );
};

export default TaskList;
