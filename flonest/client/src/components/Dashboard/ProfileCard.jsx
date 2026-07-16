import React, { useState } from 'react';
import { User, Mail, Calendar, TrendingUp, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ProfileCard = ({ onUpdateSuccess }) => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    averageCycleLength: user?.averageCycleLength || 28,
    averagePeriodLength: user?.averagePeriodLength || 5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        setUser(res.data.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        if (onUpdateSuccess) onUpdateSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile configurations.');
    } finally {
      setLoading(false);
    }
  };

  const formattedJoinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-6 relative overflow-hidden">
      {/* Background soft bubble */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Your Profile</h3>
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Cycle Configurations</span>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-violet-50 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            aria-label="Edit configurations"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-xl">{error}</p>}
      {success && <p className="text-xs text-teal-500 bg-teal-500/10 p-2.5 rounded-xl">{success}</p>}

      {!isEditing ? (
        <div className="space-y-5">
          {/* Avatar and User Detail */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-blush-500 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-white font-extrabold font-outfit text-xl shadow-md">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <User />}
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-slate-850 dark:text-white text-base leading-none">{user?.name}</h4>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold block mt-1">{user?.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs border-t border-b border-slate-100 dark:border-zinc-800/80 py-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-455 font-semibold block">Target Cycle</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-violet-500" />
                {user?.averageCycleLength || 28} Days
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-455 font-semibold block">Target Period</span>
              <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-500" />
                {user?.averagePeriodLength || 5} Days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-455 font-semibold">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Member since {formattedJoinDate}</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl text-slate-800 dark:text-zinc-100 glass-input text-xs" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Avg Cycle Length</label>
              <input 
                type="number" 
                required
                min="20"
                max="45"
                value={formData.averageCycleLength}
                onChange={e => setFormData(p => ({ ...p, averageCycleLength: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl text-slate-800 dark:text-zinc-100 glass-input text-xs" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Avg Period Length</label>
              <input 
                type="number" 
                required
                min="3"
                max="10"
                value={formData.averagePeriodLength}
                onChange={e => setFormData(p => ({ ...p, averagePeriodLength: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl text-slate-800 dark:text-zinc-100 glass-input text-xs" 
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-655 dark:text-zinc-300 font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-1/2 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-violet-500/15"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configs</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileCard;
