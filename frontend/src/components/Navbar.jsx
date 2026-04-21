import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-4 z-50 mx-4 my-4 px-6 py-3 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
        Tanit Talent AI
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            {user.role === 'RECRUITER' ? (
              <Link to="/dashboard" className="flex items-center gap-2 hover:text-indigo-400 transition">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            ) : (
              <Link to="/" className="flex items-center gap-2 hover:text-indigo-400 transition">
                <Briefcase size={20} /> Jobs
              </Link>
            )}
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
              <span className="flex items-center gap-2 text-sm text-slate-300">
                <UserIcon size={16} /> {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-pink-400 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
            <Link to="/register" className="btn btn-primary text-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
