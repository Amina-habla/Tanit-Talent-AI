import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route 
            path="/dashboard" 
            element={
              user?.role === 'RECRUITER' ? <Dashboard /> : <Navigate to="/" />
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <footer className="py-8 text-center text-slate-500 border-t border-white/5 mt-auto">
        <p>© 2026 Tanit Talent AI • Built with passion for Advanced Agentic Coding</p>
      </footer>
    </div>
  );
}

export default App;
