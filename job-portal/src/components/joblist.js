import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobList.css';
import deleteImage from './delete.png'; 
import Navbar from './navbarhire';
import { useNavigate } from 'react-router-dom';
function JobList() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/getjobs', {
      headers: {
        'Authorization': `Bearer ${userId}`
      }
    })
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

  const handleDelete = async (jobs) => {
    try {
      await axios.delete(`http://localhost:5000/deletejob/${jobs.id}`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobs.id));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  const regdet = (job) => {
    console.log(job.id)
    navigate(`/regdet?jobId=${job.id}`);
  };
  return (
    <div className="job-list-container">
      <Navbar/>
      <div className="job-list-heading"><center><bold>Added Jobs</bold></center></div>
     

      <ul className="job-list"  >
        {searchResults.map(job => (
          
            <li className="job-item">
              <h3 className="job-title">Job Title: {job.title}</h3>
              <p className="job-description">Job Description: {job.description}</p>
              <p className="job-location">Job Location: {job.location}</p>
              <p className="job-requirements">Skillset Required: {job.requirements}</p>
              <p className="job-salary">Package: {job.salary}</p>
        <button  onClick={()=>handleDelete(job)} className="delete-button"><img src={deleteImage}/></button>
         <button  onClick={()=>regdet(job)} className="rsbutton">Applicants details</button>
         </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
