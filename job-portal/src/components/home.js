import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import './Home.css';
import My from './ma.png';
import ca from './car.png';
import Axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [isLoggedInSeek, setIsLoggedInSeek] = useState(false);
  const [isLoggedInHire, setIsLoggedInHire] = useState(false);

  const handleLoginSeek = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/checkseek');
      if (response.data.success) {
        setIsLoggedInSeek(true);
        navigate('/addedjobs');
      } else {
        navigate('/loginseek');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLoginHire = async () => {
    try {
      const response = await Axios.get('http://localhost:5000/checkhire');
      if (response.data.success) {
        setIsLoggedInHire(true);
        navigate('/joblist');
      } else {
        navigate('/loginhire');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='homes'>
      <div className='back'><img className='im' src={My} alt='no'/></div>
      <nav></nav>
      <h1 className='head'><center>Careerlink</center></h1>
      <img className='im' src={My} alt='no'/>
      <img className='imp' src={ca} alt='no'/>
      <h1 className='hh'><center>"Opportunities don't happen, you create them. Explore, connect, and unlock the door to your next career chapter."</center></h1>
      <button className="pbutton" onClick={handleLoginSeek}>Job Seekers</button>
      <button className="sbutton" onClick={handleLoginHire}>Job Providers</button>
    </div>
  );
}

export default Home;
