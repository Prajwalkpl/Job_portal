import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobList.css';
import Navbar from './navbarhire';
import { useLocation } from 'react-router-dom';

function Regdet() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const jobIdParam = searchParams.get('jobId');
    setJobId(jobIdParam);
  }, [location]);

  useEffect(() => {
    if (jobId) {
      axios.get('http://localhost:5000/regdet', {
        headers: {
          'Authorization': `Bearer ${jobId}`
        }
      })
      .then(response => {
        const transformedDet = response.data.map(det => ({
          id: det.id,
          name: det.name,
          college: det.college,
          skillset: det.skillset,
          resume_name: det.resume_filename,
          resume_data: det.file,
          status: det.status,
          pdfUrl: null,
          resume_blob: null
        }));
        setSearchResults(transformedDet);
      })
      .catch(error => {
        console.error('Error fetching details:', error);
      });
    }
  }, [jobId]);

  const fetchPdf = async (index, resume_data, resume_name) => {
    try {
      console.log('Fetching PDF for data:', resume_data);
      const byteCharacters = atob(resume_data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      setSearchResults(prevResults => {
        const newResults = [...prevResults];
        newResults[index].pdfUrl = url;
        newResults[index].resume_blob = blob;
        newResults[index].resume_name = resume_name;
        return newResults;
      });
    } catch (error) {
      console.error('Error fetching the PDF:', error);
    }
  };

  const closePdf = (index) => {
    setSearchResults(prevResults => {
      const newResults = [...prevResults];
      newResults[index].pdfUrl = null;
      newResults[index].resume_blob = null;
      return newResults;
    });
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put('http://localhost:5000/updateStatus', {
        id,
        status: newStatus
      });

      setSearchResults(prevResults => prevResults.map(det => det.id === id ? { ...det, status: newStatus } : det));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="job-list-container">
      <Navbar />
      <div className="job-list-heading"><center><strong>Applicants details</strong></center></div>
      <ul className="job-list">
        {searchResults.map((det, index) => (
          <li className="job-item" key={det.id}>
            <h3 className="job-title">Name: {det.name}</h3>
            <p className="job-description">College: {det.college}</p>
            <p className="job-location">Skillset: {det.skillset}</p>
            <div>
              <button className='fetch-button' onClick={() => fetchPdf(index, det.resume_data, det.resume_name)}>View Resume</button>
              {det.pdfUrl && (
                <>
                  <iframe
                    src={det.pdfUrl}
                    style={{ width: '100%', height: '500px' }}
                    title={`PDF Viewer ${index}`}
                  />
                  <button className="close-button" onClick={() => closePdf(index)}>Close</button>
                 
                </>
              )}
            </div>
            <div>
            <select
                value={det.status}
                onChange={(e) => updateStatus(det.id, e.target.value)}
                className="select-status"
              >
                <option value="Applied">Applied</option>
                <option value="Verification">Online Assessment</option>
                <option value="In Process">Interview</option>
                <option value="Interview">H R Interview</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Regdet;
