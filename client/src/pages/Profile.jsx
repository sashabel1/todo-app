import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/user/${user.id}`);
      const data = await response.json();
      setProfileData(data);
      setFormData({ fullName: data.fullName, email: data.email, password: '' });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('user', JSON.stringify({ ...user, fullName: result.user.fullName }));
        setIsEditing(false);
        fetchUserData();
        alert("Profile updated!");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const resetStats = async () => {
    if (!window.confirm("Are you sure you want to reset your task history?")) return;
    try {
      await fetch(`http://localhost:5000/api/auth/reset-stats/${user.id}`, { method: 'POST' });
      fetchUserData();
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  if (!profileData) return <div className="loading">Loading Profile...</div>;

  const chartData = [
  { name: 'Created', value: profileData.stats?.totalCreated || 0, color: '#3F9AAE' },
  { name: 'Completed', value: profileData.stats?.totalCompleted || 0, color: '#4CAF50' },
  { name: 'Overdue', value: profileData.stats?.totalOverdue || 0, color: '#F96E5B' }, 
  ];

  return (
    <div className="profile-container">
      <h1 className="profile-title">MY PROFILE</h1>
      
      <div className="profile-grid">
        <div className="profile-card">
          <h2>Account Settings</h2>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={formData.fullName} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={formData.email} 
                disabled={!isEditing}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>New Password (Leave blank to keep current)</label>
              <input 
                type="password" 
                placeholder="********"
                disabled={!isEditing}
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <div className="profile-buttons-container">
              {!isEditing ? (
                <button type="button" className="edit-details-btn" onClick={() => setIsEditing(true)}>
                  EDIT DETAILS
                </button>
              ) : (
                <div className="edit-actions">
                  <button type="submit" className="save-btn">SAVE</button>
                  <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="profile-card stats-card">
          <h2>Task Productivity</h2>
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">{profileData.stats?.totalCreated}</span>
              <span className="stat-label"> Total Created</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profileData.stats?.totalCompleted}</span>
              <span className="stat-label"> Total Done</span>
            </div>
            <div className="stat-item">
            <span className="stat-value" style={{ color: '#F96E5B' }}>{profileData.stats?.totalOverdue || 0}</span>
            <span className="stat-label"> Overdue</span>
          </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={chartData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <button className="delete-btn" style={{marginTop: '20px', fontSize: '0.9rem'}} onClick={resetStats}>
            RESET ALL STATISTICS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;