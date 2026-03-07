import React, { useState } from 'react';
import '../styles/AddTaskForm.css'; // כדאי ליצור סטייל תואם

const AddTaskForm = ({ userId, onTaskAdded, closeModal }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    color: '#ffffff',
    customCategory: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, userId }),
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskAdded(newTask);
        closeModal();
      }
    } catch (error) {
      alert('Error adding task');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={taskData.title}
            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
            required 
          />
          <textarea 
            placeholder="Description (Optional)" 
            value={taskData.description}
            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
          />
          <div className="form-row">
            <input 
              type="date" 
              value={taskData.dueDate}
              onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Category (e.g. Studies)" 
              value={taskData.customCategory}
              onChange={(e) => setTaskData({...taskData, customCategory: e.target.value})}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;