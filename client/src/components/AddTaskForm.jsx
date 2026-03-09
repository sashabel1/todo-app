import React, { useState , useEffect } from 'react';
import '../styles/AddTaskForm.css'; 

const AddTaskForm = ({ userId, taskToEdit, onTaskSaved, closeModal }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    color: '#ffffff',
    customCategory: ''
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
        color: taskToEdit.color || '#ffffff',
        customCategory: taskToEdit.customCategory || ''
      });
    }
  }, [taskToEdit]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isEdit = !!taskToEdit;
    const url = isEdit 
      ? `http://localhost:5000/api/tasks/${taskToEdit._id}` 
      : 'http://localhost:5000/api/tasks';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        const savedTask = await response.json();
        onTaskSaved(savedTask);
        closeModal();
      }
    } catch (error) {
      alert('Error saving task');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
          <textarea 
            placeholder="Description (Optional)" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="form-row">
            <input 
              type="date" 
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Category (e.g. Studies)" 
              value={formData.customCategory}
              onChange={(e) => setFormData({...formData, customCategory: e.target.value})}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-cancel">
              Cancel
            </button>
            
            <button type="submit" className="btn-save">
              {taskToEdit ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;