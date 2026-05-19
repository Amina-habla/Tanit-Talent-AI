import React, { useEffect, useState } from 'react';
import { fetchJobs, applyToJob } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Building, Search, Upload, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await fetchJobs();
      setJobs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const file = e.target.cv.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      await applyToJob(selectedJob._id, formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedJob(null);
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-slate-400 text-lg">AI-powered recruitment for the next generation of talent.</p>
        
        <div className="max-w-2xl mx-auto mt-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by role or company..."
            className="input-glass pl-12 py-4 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div 
              layoutId={job._id}
              key={job._id} 
              className="glass-card flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Briefcase size={24} />
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  {job.type}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-2">{job.title}</h2>
              <div className="space-y-2 mb-6 text-sm text-slate-400">
                <div className="flex items-center gap-2"><Building size={16} /> {job.company}</div>
                <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
              </div>
              <div className="mt-auto">
                {user?.role === 'CANDIDATE' ? (
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="btn btn-primary w-full justify-center"
                  >
                    Apply Now
                  </button>
                ) : !user ? (
                  <button onClick={() => window.location.href='/login'} className="btn btn-glass w-full justify-center">Sign in to Apply</button>
                ) : (
                  <div className="text-xs text-center text-slate-500 italic">View as Recruiter</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg relative z-10"
            >
              <h2 className="text-2xl font-bold mb-2">Apply for {selectedJob.title}</h2>
              <p className="text-slate-400 mb-6">{selectedJob.company} • {selectedJob.location}</p>

              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex p-4 rounded-full bg-green-500/20 text-green-400 mb-4 animate-bounce">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-xl font-bold">Application Sent!</h3>
                  <p className="text-slate-400">Our AI is now analyzing your profile.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl text-center hover:border-indigo-500/40 transition-colors bg-white/5 relative">
                    <input 
                      type="file" 
                      name="cv" 
                      accept=".pdf,.doc,.docx" 
                      required
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-slate-500 mb-4" size={40} />
                    <p className="font-medium">Upload CV (PDF/DOCX)</p>
                    <p className="text-xs text-slate-500 mt-2">Max file size 5MB</p>
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setSelectedJob(null)} className="btn btn-glass flex-1 justify-center">Cancel</button>
                    <button type="submit" disabled={uploadLoading} className="btn btn-primary flex-1 justify-center">
                      {uploadLoading ? <Loader2 className="animate-spin" /> : 'Submit CV'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
