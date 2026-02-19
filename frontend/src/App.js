import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Lesson from './pages/Lesson';
import Assessment from './pages/Assessment';
import Report from './pages/Report';

function App() {
    const [studentProfile, setStudentProfile] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('morna_student_profile');
        if (stored) {
            setStudentProfile(JSON.parse(stored));
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing onProfileCreated={setStudentProfile} />} />
                <Route path="/lesson" element={<Lesson profile={studentProfile} />} />
                <Route path="/assessment" element={<Assessment profile={studentProfile} />} />
                <Route path="/report" element={<Report profile={studentProfile} />} />
            </Routes>
        </Router>
    );
}

export default App;
