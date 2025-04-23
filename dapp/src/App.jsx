import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
 import LandingPage from './Pages/Landing'; 
 import Dashboard from './Pages/Dashboard'; 
import { ContractProvider } from './context/ContractContext';

 function App() 
 { return ( 
  <ContractProvider>
 <Router> 
  <div className="App"> 
  <Routes>
     <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} /> 
     
  </Routes> 
  </div> 
  </Router>
  </ContractProvider> ); }
   export default App;