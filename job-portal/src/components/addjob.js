import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css';
import NavBarhire from './navbarhire';
import { useNavigate } from 'react-router-dom';

function AddJob() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
  
    if (!userId) {
      navigate('/loginseek');
      return;
    }
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    requirements: '',
    salary: '',
    deletion_date: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    axios.post('http://localhost:5000/addjobs', formData, {
      headers: {
          'Authorization': `Bearer ${userId}` 
      }
    })
    .then(response => {
      setFormData({
        title: '',
        description: '',
        location: '',
        requirements: '',
        salary: '',
        deletion_date: '' 
      });
      alert('Job added successfully');
    })
    .catch(error => {
      console.error('Error adding job:', error);
    });
  };

  return (
    <div className="add-job-container">
      <NavBarhire />
      <h1>Add New Job</h1>
      <form className="add-job-form" onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label>Requirements:</label>
          <textarea name="requirements" value={formData.requirements} onChange={handleChange} required></textarea>
        </div>
        <div>
          <label>Salary:</label>
          <input type="text" name="salary" value={formData.salary} onChange={handleChange} required />
        </div>
        <div>
          <label>Deletion Date:</label>
          <input type="date" name="deletion_date" value={formData.deletion_date} onChange={handleChange} required />
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}

export default AddJob;
