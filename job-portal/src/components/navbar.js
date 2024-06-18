import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    setIsLoggedIn(!!userId); // Convert userId to boolean
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li style={styles.li}><a href="/" style={styles.a}>Home</a></li>
        <li style={styles.li}><a href="/addedjobs" style={styles.a}>Jobs and Internships</a></li>
        {isLoggedIn && <li style={styles.li}><a href="/registered" style={styles.a}>Registered jobs</a></li>}
        {isLoggedIn && <li style={styles.li}><a style={styles.a} onClick={handleLogout}>Logout</a></li>}
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: 'black',
    padding: '10px',
    marginBottom: '20px',
  },
  ul: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'center',
  },
  li: {
    display: 'inline-block',
    margin: '0 30px',
    fontSize: '30px',
  },
  a: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
  },
};

export default NavBar;
