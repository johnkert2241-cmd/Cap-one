import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// UserInterface
import Home from './pages/Home'
import SignupBusiness from './pages/SignupBusiness'
import Contact from './components/Home/FooterContact'
import About from './components/Home/AboutUs'

// Users Profile

import CusProfile from './pages/Users'


// Authentication fom
import Signup from './pages/Signupform'
import Login from './pages/Loginform'

// BusinessLogin  
import Businesslogin from './Auth/BusinessLogin'

// Contractor form
import Contractor from './pages/Contractor/ContractorDashboard'

// Contractor Dashboard
import Dashboard from './pages/Contractor/Dashboard'
import Profile from './pages/Contractor/Profile'
import Products from './pages/Contractor/Products'
import Orders from './pages/Contractor/Orders'
import Services from './pages/Contractor/Services'
import Services2 from './pages/Contractor/Services2'

// ADMIN Dashboard
import AdminDashboard from './pages/Admin/Dashboard'

import Admin from './pages/Admin/DashboardMain'
import Request from './pages/Admin/BusinessRequest'
import Registered from './pages/Admin/BusinessRegistered'
import Reports from './pages/Admin/Reports'



function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/About" element={<About />} />
        </Route>

        {/* Users */}
        <Route path="/CusProfile" element={<CusProfile />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Businesslogin" element={<Businesslogin />} />
        {/* Business Contractor  */}
        <Route path="/Signupbusiness" element={<SignupBusiness />} />

        {/* Contractor with nested routes */}

        <Route path="/Contractor" element={<Contractor />}>
          <Route index element={<Dashboard />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Products" element={<Products />} />
          <Route path="Services2" element={<Services2 />} />
          <Route path="Orders" element={<Orders />} />
          <Route path="Services" element={<Services />} />

        </Route>


        {/* Admin */}

        <Route path="/Admin" element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="Request" element={<Request />} />
          <Route path="BusinessRequest" element={<Reports />} />
          <Route path="BusinessRegistered" element={<Registered />} />
          <Route path="Reports" element={<Reports />} />
        </Route>



      </Routes>

    </BrowserRouter >
  );
}

export default App;
