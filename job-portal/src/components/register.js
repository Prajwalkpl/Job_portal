import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './navbar'; 
import './regist.css';
function Regist() {
    const location = useLocation();
    const [jobId, setJobId] = useState(null);
    const [name, setName] = useState('');
    const [college, setCollege] = useState('');
    const [skillset, setSkillset] = useState('');
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const jobIdParam = searchParams.get('jobId');
        setJobId(jobIdParam);
    }, [location]);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            navigate('/loginseek');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('jobId', jobId);
        formData.append('name', name);
        formData.append('college', college);
        formData.append('skillset', skillset);
        formData.append('resume', resume);
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await axios.post('http://localhost:5000/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userId}`,
                },
            });
            setMessage(response.data.message);
            alert(response.data.message)
        } catch (error) {
            console.error('Error registering for job:', error);
            setMessage('Error registering for job. Please try again.');
        }
    };

    return (
        <div className="registration-container">
            <NavBar />
            <h1>Registration</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="college">College:</label>
                    <input type="text" id="college" value={college} onChange={(e) => setCollege(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="skillset">Skillset:</label>
                    <input type="text" id="skillset" value={skillset} onChange={(e) => setSkillset(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="resume">Resume:</label>
                    <input type="file" id="resume" onChange={(e) => setResume(e.target.files[0])} />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Regist;
