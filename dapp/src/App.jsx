import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
 import LandingPage from './Pages/Landing'; 
 import Dashboard from './Pages/Dashboard'; 
import { ContractProvider } from './context/ContractContext';
import AuthDemoPage from './Pages/auth-demo';
import ConsentDashboard from './Pages/consent-dashboard';
import SSIDemoPage from './Pages/ssi-demo';

 function App() 
 { return ( 
  <ContractProvider>
 <Router> 
  <div className="App"> 
  <Routes>
     <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} /> 
      <Route path="/auth" element={<AuthDemoPage />} /> 
      <Route path="/cd" element={<ConsentDashboard />} /> 
      <Route path="/ssi-auth" element={<SSIDemoPage />} />
     
  </Routes> 
  </div> 
  </Router>
  </ContractProvider> ); }
   export default App;