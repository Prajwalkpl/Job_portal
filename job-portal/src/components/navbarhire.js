import React, { useEffect, useState }  from 'react';
import {useNavigate} from 'react-router-dom';
const NavBar = ( {}) => {
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
          <li style={styles.li}><a href="/addjob" style={styles.a}>Add Job</a></li>
          {isLoggedIn && <li style={styles.li}><a href="/joblist" style={styles.a}>Added jobs</a></li>}
        {isLoggedIn && <li style={styles.li}><a style={styles.a} onClick={handleLogout}>Logout</a></li>}
          
        </ul>
      </nav>
    );
  }
 
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
    form: {
      display: 'inline-block',
    },
    input: {
      padding: '5px',
      marginRight: '10px',
      borderRadius: '3px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    button: {
      padding: '5px 10px',
      borderRadius: '3px',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: 'white',
      fontSize: '14px',
      cursor: 'pointer',
    },
  
  };

export default NavBar;
