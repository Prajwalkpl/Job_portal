import React from 'react';
import JobList from './components/joblist';
import AddJobList from './components/addedjobs';
import AddJob from './components/addjob';
import Regist from './components/register';
import Loginseek from './components/loginseek';
import Loginhire from './components/loginhire';
import Sign from './components/signup';
import Signup from './components/signuphire';
import Registered from './components/registered';
import Footer from './components/footer';
import Home from './components/home';
import Regdet from './components/regdet';
import './App.css';

import { Route, Routes } from 'react-router-dom';
import NavBar from './components/navbar';

function App() {
  return (
    <div className="main">
      
        <Routes>
          <Route path='/' element={<Home />}></Route>
           <Route path='/addjob' element={<AddJob />}></Route>
           <Route path='/joblist' element={<JobList />}></Route>
           <Route path='/loginseek' element={<Loginseek />}></Route>
           <Route path='/loginhire' element={<Loginhire />}></Route>
           <Route path='/signup' element={<Sign />}></Route>
           <Route path='/signuphire' element={<Signup />}></Route>
           <Route path='/addedjobs' element={<AddJobList />}></Route>
           <Route path='/register' element={<Regist />}></Route>
           <Route path='/registered' element={<Registered />}></Route>
           <Route path='/regdet' element={<Regdet />}></Route>
        </Routes>
      <Footer />
      
    </div>
  );
}


export default App;
