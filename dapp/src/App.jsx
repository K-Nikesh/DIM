import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
 import LandingPage from './Pages/Landing'; 
 import Dashboard from './Pages/Dashboard'; 
import { ContractProvider } from './context/ContractContext';
import ConsentDashboard from './Pages/consent-dashboard';
import SSIDemoPage from './Pages/ssi-demo';
import DataSharingPage from './Pages/data-sharing-page';
import AuthDemoPage from './Pages/auth-demo';

 function App() 
 { return ( 
  <ContractProvider>
 <Router> 
  <div className="App"> 
  <Routes>
     <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard/*" element={<Dashboard />} /> 
      <Route path="/cd" element={<ConsentDashboard />} /> 
      <Route path="/ssi-auth" element={<SSIDemoPage />} />
      <Route path="/data-sharing" element={<DataSharingPage />} />
      <Route path="/ssi-single" element={<AuthDemoPage />} />
     
  </Routes> 
  </div> 
  </Router>
  </ContractProvider> ); }
   export default App;