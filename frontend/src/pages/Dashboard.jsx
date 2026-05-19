import React, { useEffect, useState } from 'react';
import { fetchJobs, createJob, fetchJobApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Users, Award, TrendingUp, Calendar, Loader2, PlusCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddJob, setShowAddJob] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', company: '', location: '', type: 'Full-time' });
  const [selectedJobApps, setSelectedJobApps] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadMyJobs();
  }, []);

  const loadMyJobs = async () => {
    try {
      const { data } = await fetchJobs();
      // In a real app, filter by recruiter id, but for study we'll show all or recent
      setJobs(data.data.filter(j => j.recruiter?._id === user?.id || j.company === user?.name));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      setShowAddJob(false);
      loadMyJobs();
    } catch (err) {
      alert('Error creating job');
    }
  };

  const viewApplications = async (jobId) => {
    try {
      const { data } = await fetchJobApplications(jobId);
      setSelectedJobApps(data.data);
    } catch (err) {
      alert('Error fetching applications');
    }
  };

  return (
    <div className="container animate-fade">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Recruiter Dashboard</h1>
          <p className="text-slate-400">Manage your listings and analyze candidates with AI.</p>
        </div>
        <button onClick={() => setShowAddJob(true)} className="btn btn-primary">
          <Plus size={20} /> Post New Job
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl"><PlusCircle size={28} /></div>
          <div><p className="text-sm text-slate-400 font-medium">Active Jobs</p><p className="text-2xl font-bold">{jobs.length}</p></div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-pink-500/20 text-pink-400 rounded-2xl"><Users size={28} /></div>
          <div><p className="text-sm text-slate-400 font-medium">Total Applicants</p><p className="text-2xl font-bold">24</p></div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl"><Award size={28} /></div>
          <div><p className="text-sm text-slate-400 font-medium">High Potential</p><p className="text-2xl font-bold">8</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-indigo-400" /> Your Active Listings</h2>
          {loading ? <Loader2 className="animate-spin text-center w-full" /> : 
            jobs.map(job => (
              <div key={job._id} onClick={() => viewApplications(job._id)} className="glass flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors border-l-4 border-indigo-500">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-sm text-slate-400">{job.location} • {job.type}</p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-400 font-bold block">12 Apps</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Calendar size={12} /> Posté il y a 2j</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Selected Job Apps (Ranking View) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Award className="text-pink-400" /> AI Candidate Ranking</h2>
          <div className="glass h-[600px] overflow-y-auto">
            {!selectedJobApps ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <Users size={64} className="mb-4 opacity-20" />
                <p>Click on a job to view ranked candidates</p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {selectedJobApps.map((app, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={app._id} 
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">{app.candidate?.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        app.aiScore > 0.7 ? 'bg-emerald-500/20 text-emerald-400' :
                        app.aiScore > 0.4 ? 'bg-amber-500/20 text-amber-400' : 'bg-pink-500/20 text-pink-400'
                      }`}>
                        {Math.round(app.aiScore * 100)}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{app.candidate?.email}</p>
                    <a href={app.cvPath} className="text-[10px] text-indigo-400 hover:underline mt-2 block">View Document</a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddJob(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card w-full max-w-xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Post a New Job</h2>
                <button onClick={() => setShowAddJob(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2">
                   <label className="text-sm font-medium text-slate-400 mb-1 block">Job Title</label>
                   <input required type="text" className="input-glass" placeholder="Senior Product Designer" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-sm font-medium text-slate-400 mb-1 block">Company</label>
                   <input required type="text" className="input-glass" placeholder="TechCorp" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                 </div>
                 <div>
                   <label className="text-sm font-medium text-slate-400 mb-1 block">Location</label>
                   <input required type="text" className="input-glass" placeholder="San Francisco / Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                 </div>
                 <div className="md:col-span-2">
                   <label className="text-sm font-medium text-slate-400 mb-1 block">Description</label>
                   <textarea required rows={4} className="input-glass" placeholder="Job requirements..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <button type="submit" className="btn btn-primary md:col-span-2 justify-center mt-4">Create Job listing</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
