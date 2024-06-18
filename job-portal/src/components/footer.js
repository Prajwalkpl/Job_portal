
import React from 'react';
import './footer.css'; 

function Footer() {
  const EmailLink = ({ onClick }) => (
    <span onClick={onClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
      Email
    </span>
  );
  const handleEmailClick = (e) => {
    console.log("error")
    e.preventDefault();
    window.open('mailto:prajwalkpl@gmail.com', '_self');
  };
  return (
    <footer className="footer">
        <div className="footer-links">
        <a href="mailto:prajwalkpl@gmail.com" download="mailto:prajwalkpl@gmail.com">Email</a>
        <a href="https://www.instagram.com/prajwal_karippali" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/prajwal.kc.5095" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.linkedin.com/in/prajwal-k-c-360865209/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <p>&copy; 2024 Careerlink. All rights reserved. Made by Prajwal K C</p>
      
    </footer>
  );
}

export default Footer;
