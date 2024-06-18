import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './registered.css'; 
import { useNavigate } from 'react-router-dom';
import NavBar from './navbar';

function Registered() {
  const [registeredJobs, setRegisteredJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/registered', {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    })
    .then(response => {
      const transformedJobs = response.data.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        status: job.status
      }));
      setRegisteredJobs(transformedJobs);
    })
    .catch(error => {
      console.error('Error fetching registered jobs:', error);
    });
  }, [navigate]);

  const getProgressBarWidth = (status) => {
    const stages = ['Applied', 'Verification', 'In Process', 'Interview', 'Offer', 'Hired'];
    if (status === 'Rejected') {
      return '100%';
    }
    const currentIndex = stages.indexOf(status);
    if (currentIndex === -1) return '0%';
    return `${((currentIndex + 1) / stages.length) * 100}%`;
  };

  const renderProgressSteps = (status) => {
    if (status === 'Rejected') {
      return (
        <div className="progress-step rejected" data-step="Rejected">Rejected</div>
      );
    } else if (status === 'Hired') {
      return (
        <div className="progress-step hired" data-step="Hired">Hired</div>
      );
    } else {
      return (
        <>
          <div className={`progress-step ${status === 'Applied' ? 'active' : status === 'Verification' || status === 'In Process' || status === 'Interview' || status === 'Offer' ? 'completed' : ''}`} data-step="Applied">Applied</div>
          <div className={`progress-step ${status === 'Verification' ? 'active' : status === 'In Process' || status === 'Interview' || status === 'Offer' ? 'completed' : ''}`} data-step="Online Assessment">Online Assessment</div>
          <div className={`progress-step ${status === 'In Process' ? 'active' : status === 'Interview' || status === 'Offer' ? 'completed' : ''}`} data-step="Interview">Interview</div>
          <div className={`progress-step ${status === 'Interview' ? 'active' : status === 'Offer' ? 'completed' : ''}`} data-step="HR Interview">HR Interview</div>
  
        </>
      );
    }
  };

  return (
    <div className="registered-container">
      <NavBar />
      <h1 className="registered-heading">Registered Jobs</h1>
      <ul className="registered-list">
        {registeredJobs.map(job => (
          <li key={job.id} className="registered-item">
            <div className="job-title">Job Title: {job.title}</div>
            <div className="job-description">Description: {job.description}</div>
            <div className="job-location">Location: {job.location}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: getProgressBarWidth(job.status) }}></div>
              {renderProgressSteps(job.status)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Registered;
