// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProjectDashboard from './components/AdminLandingPage';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import SignUp from './components/Signup';
import UserLandingPage from './components/UserLandingPage';


const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<SignUp setUser={setUser} />} />
                <Route path="/admin" element={<ProjectDashboard />} />
                <Route path="/admin/dashboard/:projectId" element={<AdminDashboard />} />
                <Route path="/user/:userId" element={<UserLandingPage />} />
                <Route path="/user/:userId/task/:taskId" element={<UserDashboard />} />

                <Route path="/admin/dashboard/:projectId/task/:taskId" element={<UserDashboard />} />
                {/* <Route path="/" element={<Login setUser={setUser} />} />
                <Route path="/signup" element={<SignUp setUser={setUser} />} />
                <Route path="/admin" element={<ProjectDashboard />} />
                <Route path="/admin/dashboard/:projectId" element={<AdminDashboard />} />
                <Route path="/user/:userId" element={<UserLandingPage />} />
                <Route path="/user/:userId/project/:projectId/task/:taskId" element={<UserDashboard />} />
                {<Route path="/admin/dashboard/:projectId/task/:taskId" element={<UserDashboard />} />} */}
            </Routes>
        </Router>
    );
};

export default App;
