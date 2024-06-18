import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobList.css';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';
function AddJobList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/addedjobs')
      .then(response => {
        const transformedJobs = response.data.map(job => ({
          id: job[0],
          title: job[1],
          description: job[2],
          location: job[3],
          requirements: job[4],
          salary: job[5],
          created_at: job[6]
        }));
        setJobs(transformedJobs);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  useEffect(() => {
    const results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.salary.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, jobs]);

  const handlereg = (id) => {
    navigate(`/register?jobId=${id}`);
  };
  return (
    <div className="job-list-container">
      <Navbar/>
      <div className="job-list-heading"><center><bold>Job Openings</bold></center></div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          
        />
        {searchTerm && (
            <a className='clear-button' onClick={() => setSearchTerm('')} >
              &#10006; 
            </a>
          )}
      <p className='se'>Search</p>
      </div>
      <ul className="job-list"  >
        {searchResults.map(job => (
          
            <li className="job-item">
              <h3 className="job-title">Job Title: {job.title}</h3>
              <p className="job-description">Job Description: {job.description}</p>
              <p className="job-location">Job Location: {job.location}</p>
              <p className="job-requirements">Skillset Required: {job.requirements}</p>
              <p className="job-salary">Package: {job.salary}</p>
        <button  onClick={()=>handlereg(job.id)} className="reg-button">Register</button>
              </li>
          
        ))}
      </ul>
    </div>
  );
}

export default AddJobList;
