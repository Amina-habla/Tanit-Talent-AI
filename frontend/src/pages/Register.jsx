import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'CANDIDATE' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await register(formData);
      loginUser(data.user, data.token);
      navigate(data.user.role === 'RECRUITER' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-pink-500/20 text-pink-400 mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-400 mt-2">Join Tanit Talent AI today</p>
        </div>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'CANDIDATE'})}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                formData.role === 'CANDIDATE' 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              <User size={20} />
              <span className="text-xs font-semibold">Candidate</span>
              {formData.role === 'CANDIDATE' && <CheckCircle size={12} className="absolute top-2 right-2" />}
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'RECRUITER'})}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                formData.role === 'RECRUITER' 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-white/10 text-slate-400 hover:bg-white/5'
              }`}
            >
              <Briefcase size={20} />
              <span className="text-xs font-semibold">Recruiter</span>
              {formData.role === 'RECRUITER' && <CheckCircle size={12} className="absolute top-2 right-2" />}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                required
                className="input-glass pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                className="input-glass pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                className="input-glass pl-10"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full justify-center text-lg mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Already have an account? {' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
