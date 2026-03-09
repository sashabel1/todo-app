import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import AddTaskForm from '../components/AddTaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'year'
  const [categoryFilter, setCategoryFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Fetch tasks 
  useEffect(() => {
    const fetchTasks = async () => {
      const user = JSON.parse(localStorage.getItem('user')); 
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${user.id}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Toggle task completion status
  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  //func checks if a date falls within the current week
  const isThisWeek = (date) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);
    
    const taskDate = new Date(date);
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTaskToEdit(null);
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const now = new Date();
    
    let timeMatch = true;
    if (filter === 'today') {
      timeMatch = taskDate.toDateString() === now.toDateString();
    } else if (filter === 'week') {
      timeMatch = isThisWeek(task.dueDate);
    } else if (filter === 'month') {
      timeMatch = taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
    } else if (filter === 'year') {
      timeMatch = taskDate.getFullYear() === now.getFullYear();
    }

    const categoryMatch = categoryFilter === 'all' || task.customCategory === categoryFilter;

    return timeMatch && categoryMatch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">TO DO DASHBOARD</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + NEW TASK
        </button>
      </div>

      {showModal && (
        <AddTaskForm 
          userId={JSON.parse(localStorage.getItem('user'))?.id} 
          taskToEdit={taskToEdit}
          onTaskSaved={(savedTask) => {
            if (taskToEdit) {
              setTasks(tasks.map(t => t._id === savedTask._id ? savedTask : t));
            } else {
              setTasks([savedTask, ...tasks]);
            }
            handleCloseModal();
          }} 
          closeModal={handleCloseModal} 
        />
      )}

      <div className="filter-bar">
        {['all', 'today', 'week', 'month', 'year'].map(f => (
          <button 
            key={f} 
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <table className="tasks-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map(task => {
            const isOverdue = !task.isCompleted && task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0);

            return (
              <tr 
                key={task._id} 
                className={`task-row ${task.isCompleted ? 'task-row-completed' : ''} ${isOverdue ? 'task-row-overdue' : ''}`}
              >
                <td className="status-cell">
                  <div className="status-container">
                    <input 
                      type="checkbox" 
                      checked={task.isCompleted} 
                      onChange={() => toggleComplete(task._id, task.isCompleted)}
                      className="task-checkbox"
                    />
                    <span className={`status-badge ${task.isCompleted ? 'status-completed' : 'status-pending'}`}>
                      {task.isCompleted ? 'Done' : 'Pending'}
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>{task.title}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</td>
                <td>{task.customCategory || 'General'}</td>
                <td style={{ color: '#666', fontSize: '0.9rem' }}>{task.description}</td>
                <td className="actions-cell">
                  <button 
                      onClick={() => handleEditClick(task)} 
                      className="edit-btn"
                      title="Edit Task"
                    >
                      ✏️
                    </button>
                  <button 
                    onClick={() => deleteTask(task._id)} 
                    className="delete-btn"
                    title="Delete Task"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;