

import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Loginseek(onLogin) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
 
  const navigate = useNavigate();
  function handlesign() {
    navigate('/signup')
  }
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/loginseek', { username, password });
      console.log(response.data.success)
      if (response.data.success) {
        sessionStorage.setItem('userId', response.data.userId);
        navigate("/addedjobs");
        
      } else {
        alert("Invalid username or password lov");
        setError('Invalid username or password');
      }
      
    } catch (error) {
      console.error(error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form >
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleLogin} className="lbutton" type="submit">Login</button>
        <br/>
        <button onClick={handlesign} className="lbutton" type="submit">SignUp</button>
      </form>
    </div>
  );
}

export default Loginseek;
