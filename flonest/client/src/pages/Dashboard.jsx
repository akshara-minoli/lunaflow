import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Layout & Common components
import DashboardLayout from '../components/Layout/DashboardLayout';
import FloatingActionButton from '../components/Common/FloatingActionButton';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import Loader from '../components/Common/Loader';
import ErrorState from '../components/Common/ErrorState';

// Dashboard components
import HeroCard from '../components/Dashboard/HeroCard';
import StatCard from '../components/Dashboard/StatCard';
import PredictionCard from '../components/Dashboard/PredictionCard';
import CalendarWidget from '../components/Dashboard/CalendarWidget';
import SymptomSummary from '../components/Dashboard/SymptomSummary';
import RecentPeriodTable from '../components/Dashboard/RecentPeriodTable';
import InsightCard from '../components/Dashboard/InsightCard';
import ChartCard from '../components/Dashboard/ChartCard';
import ReminderCard from '../components/Dashboard/ReminderCard';
import HealthTipCard from '../components/Dashboard/HealthTipCard';
import ProfileCard from '../components/Dashboard/ProfileCard';

// Icons
import { Droplet, Heart, Plus, Save, X, Calendar, Settings, Sparkles, User, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Navigation active state: 'dashboard' | 'periods' | 'symptoms' | 'calendar' | 'fertility' | 'analytics' | 'reminders' | 'profile' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Backend state
  const [periods, setPeriods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Add Period Modal state
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [periodForm, setPeriodForm] = useState({ startDate: '', endDate: '', notes: '' });

  // Add Symptom Modal state
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);
  const [symptomForm, setSymptomForm] = useState({
    date: new Date().toISOString().split('T')[0],
    cramps: false, headache: false, fatigue: false,
    moodSwings: false, acne: false, bloating: false,
    backPain: false, nausea: false,
    flow: 'none', painLevel: 0, notes: ''
  });

  // Edit / Delete states
  const [editItem, setEditItem] = useState(null); // { type: 'period'|'symptom', data: obj }
  const [deleteItemId, setDeleteItemId] = useState(null); // { type: 'period'|'symptom', id: string }

  const SYMPTOMS_LIST = [
    { key: 'cramps', label: 'Cramps' },
    { key: 'moodSwings', label: 'Mood Swings' },
    { key: 'fatigue', label: 'Fatigue' },
    { key: 'headache', label: 'Headache' },
    { key: 'acne', label: 'Acne' },
    { key: 'bloating', label: 'Bloating' },
    { key: 'backPain', label: 'Back Pain' },
    { key: 'nausea', label: 'Nausea' }
  ];

  // Fetching orchestration
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [periodsRes, symptomsRes, predsRes] = await Promise.all([
        api.get('/periods'),
        api.get('/symptoms'),
        api.get('/predictions')
      ]);
      if (periodsRes.data.success) setPeriods(periodsRes.data.data.periods);
      if (symptomsRes.data.success) setSymptoms(symptomsRes.data.data.symptoms);
      if (predsRes.data.success) setPredictions(predsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard intelligence.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toast notification Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // ── PERIOD CRUD ──
  const handleCreatePeriod = async (e) => {
    e.preventDefault();
    if (!periodForm.startDate) { showToast('Start date is required', 'error'); return; }
    try {
      const res = await api.post('/periods', {
        startDate: periodForm.startDate,
        endDate: periodForm.endDate || null,
        notes: periodForm.notes
      });
      if (res.data.success) {
        showToast('Period cycle logged successfully!');
        setIsPeriodModalOpen(false);
        setPeriodForm({ startDate: '', endDate: '', notes: '' });
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to record period.', 'error');
    }
  };

  const handleUpdatePeriod = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/periods/${editItem.data._id}`, {
        startDate: editItem.data.startDate,
        endDate: editItem.data.endDate || null,
        notes: editItem.data.notes
      });
      if (res.data.success) {
        showToast('Period cycle updated!');
        setEditItem(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update period.', 'error');
    }
  };

  const handleDeletePeriod = async () => {
    try {
      const res = await api.delete(`/periods/${deleteItemId.id}`);
      if (res.data.success) {
        showToast('Period log removed.');
        setDeleteItemId(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete operation failed.', 'error');
    }
  };

  // ── SYMPTOM CRUD ──
  const handleCreateSymptom = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/symptoms', symptomForm);
      if (res.data.success) {
        showToast('Symptoms logged successfully!');
        setIsSymptomModalOpen(false);
        setSymptomForm({
          date: new Date().toISOString().split('T')[0],
          cramps: false, headache: false, fatigue: false,
          moodSwings: false, acne: false, bloating: false,
          backPain: false, nausea: false,
          flow: 'none', painLevel: 0, notes: ''
        });
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to log symptoms.', 'error');
    }
  };

  const handleUpdateSymptom = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/symptoms/${editItem.data._id}`, editItem.data);
      if (res.data.success) {
        showToast('Symptom log updated!');
        setEditItem(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update symptom.', 'error');
    }
  };

  const handleDeleteSymptom = async () => {
    try {
      const res = await api.delete(`/symptoms/${deleteItemId.id}`);
      if (res.data.success) {
        showToast('Symptom log removed.');
        setDeleteItemId(null);
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete operation failed.', 'error');
    }
  };

  // Calendar triggers
  const handleAddPeriodOnDate = (date) => {
    setPeriodForm({
      startDate: date.toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setIsPeriodModalOpen(true);
  };

  const handleLogSymptomOnDate = (date) => {
    setSymptomForm(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
    setIsSymptomModalOpen(true);
  };

  // Render view router based on sidebar active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <HeroCard predictions={predictions} user={user} />
                <StatCard predictions={predictions} periods={periods} symptoms={symptoms} user={user} />
              </div>
              <div className="space-y-8">
                <InsightCard periods={periods} symptoms={symptoms} predictions={predictions} />
                <HealthTipCard />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <PredictionCard predictions={predictions} />
                <ChartCard periods={periods} symptoms={symptoms} />
              </div>
              <div className="space-y-8">
                <CalendarWidget
                  periods={periods}
                  symptoms={symptoms}
                  predictions={predictions}
                  onAddPeriodDate={handleAddPeriodOnDate}
                  onLogSymptomDate={handleLogSymptomOnDate}
                />
                <ReminderCard />
              </div>
            </div>
            <RecentPeriodTable 
              periods={periods.slice(0, 5)} 
              onEdit={(p) => setEditItem({ type: 'period', data: { ...p, startDate: p.startDate.split('T')[0], endDate: p.endDate ? p.endDate.split('T')[0] : '' } })}
              onDelete={(id) => setDeleteItemId({ type: 'period', id })}
            />
          </>
        );

      case 'periods':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RecentPeriodTable 
                periods={periods} 
                onEdit={(p) => setEditItem({ type: 'period', data: { ...p, startDate: p.startDate.split('T')[0], endDate: p.endDate ? p.endDate.split('T')[0] : '' } })}
                onDelete={(id) => setDeleteItemId({ type: 'period', id })}
              />
            </div>
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-3xl border space-y-4">
                <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Quick Log</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Instantly log active cycle start dates.</p>
                <button 
                  onClick={() => setIsPeriodModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/10 btn-glow"
                >
                  <Plus className="w-4 h-4" /> Add Period Log
                </button>
              </div>
              <HealthTipCard />
            </div>
          </div>
        );

      case 'symptoms':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SymptomSummary
                symptoms={symptoms}
                onEdit={(s) => setEditItem({
                  type: 'symptom',
                  data: { ...s, date: s.date ? s.date.split('T')[0] : new Date().toISOString().split('T')[0] }
                })}
                onDelete={(id) => setDeleteItemId({ type: 'symptom', id })}
              />
            </div>
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-3xl border space-y-4">
                <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Record Wellbeing</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Record cramps, flows, pain levels, and physical symptoms daily.</p>
                <button 
                  onClick={() => setIsSymptomModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10 btn-glow"
                >
                  <Plus className="w-4 h-4" /> Log Daily Symptoms
                </button>
              </div>
              <ReminderCard />
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="max-w-4xl mx-auto">
            <CalendarWidget
              periods={periods}
              symptoms={symptoms}
              predictions={predictions}
              onAddPeriodDate={handleAddPeriodOnDate}
              onLogSymptomDate={handleLogSymptomOnDate}
            />
          </div>
        );

      case 'fertility':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <PredictionCard predictions={predictions} />
            <div className="glass-panel p-6 rounded-3xl border space-y-4">
              <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-teal-500" />
                <span>Fertile Window Intelligence</span>
              </h3>
              <p className="text-xs text-slate-555 dark:text-zinc-300 leading-relaxed">
                Your fertile window represents the 6 days of your cycle where conception is possible. The most fertile days are the 2 days leading up to ovulation and the day of ovulation itself. FloNest calculates this by matching your cycle history defaults or logged inputs.
              </p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="max-w-4xl mx-auto">
            <ChartCard periods={periods} symptoms={symptoms} />
          </div>
        );

      case 'reminders':
        return (
          <div className="max-w-2xl mx-auto">
            <ReminderCard />
          </div>
        );

      case 'profile':
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto">
            <ProfileCard onUpdateSuccess={fetchData} />
          </div>
        );

      default:
        return <div className="text-center text-sm py-12">Tab not found</div>;
    }
  };

  if (loading && periods.length === 0) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} predictions={predictions} periods={periods} symptoms={symptoms}>
        <Loader type="dashboard" />
      </DashboardLayout>
    );
  }

  if (error && periods.length === 0) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} predictions={predictions} periods={periods} symptoms={symptoms}>
        <ErrorState message={error} onRetry={fetchData} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      predictions={predictions}
      periods={periods}
      symptoms={symptoms}
    >
      {/* Toast Alert Popups */}
      {toast.show && (
        <div className={`
          fixed top-6 right-6 z-55 flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300
          ${toast.type === 'error' 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-350 dark:text-rose-400' 
            : 'bg-teal-500/10 border-teal-500/20 text-teal-350 dark:text-teal-400'}
        `}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Dynamic Tab Body */}
      <div className="space-y-8 animate-in fade-in duration-300">
        {renderActiveView()}
      </div>

      {/* Floating Action Button (FAB) */}
      <FloatingActionButton
        onAddPeriod={() => setIsPeriodModalOpen(true)}
        onLogSymptoms={() => setIsSymptomModalOpen(true)}
        onViewCalendar={() => setActiveTab('calendar')}
        onSetReminder={() => setActiveTab('reminders')}
      />

      {/* ══════════════ ADD PERIOD MODAL ══════════════ */}
      {isPeriodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPeriodModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-500" />
              <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-lg">Log Period Cycle</h3>
            </div>
            <form onSubmit={handleCreatePeriod} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Start Date *</label>
                <input 
                  type="date" 
                  required
                  value={periodForm.startDate}
                  onChange={e => setPeriodForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">End Date (optional)</label>
                <input 
                  type="date" 
                  value={periodForm.endDate}
                  min={periodForm.startDate}
                  onChange={e => setPeriodForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Notes</label>
                <textarea 
                  rows="3"
                  placeholder="Cycle flow, cramping levels..."
                  value={periodForm.notes}
                  onChange={e => setPeriodForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input resize-none" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/10 btn-glow"
              >
                <Plus className="w-4 h-4" /> Log Cycle
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ EDIT PERIOD MODAL ══════════════ */}
      {editItem && editItem.type === 'period' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setEditItem(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-500" />
              <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-lg">Edit Period Log</h3>
            </div>
            <form onSubmit={handleUpdatePeriod} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Start Date *</label>
                <input 
                  type="date" 
                  required
                  value={editItem.data.startDate}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, startDate: e.target.value } }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">End Date</label>
                <input 
                  type="date" 
                  value={editItem.data.endDate || ''}
                  min={editItem.data.startDate}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, endDate: e.target.value } }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Notes</label>
                <textarea 
                  rows="3"
                  value={editItem.data.notes || ''}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input resize-none" 
                />
              </div>
              <div className="flex gap-2.5 pt-1.5">
                <button 
                  type="button" 
                  onClick={() => setEditItem(null)}
                  className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-655 dark:text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/10 btn-glow"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ LOG SYMPTOMS MODAL ══════════════ */}
      {isSymptomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto pr-2 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSymptomModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-500" />
              <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-lg">Record Health & Symptoms</h3>
            </div>
            <form onSubmit={handleCreateSymptom} className="space-y-4.5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Log Date *</label>
                <input 
                  type="date" 
                  required
                  value={symptomForm.date}
                  onChange={e => setSymptomForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>

              {/* Symptom Checklist */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Symptoms</label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOMS_LIST.map(({ key, label }) => (
                    <button 
                      type="button" 
                      key={key}
                      onClick={() => setSymptomForm(p => ({ ...p, [key]: !p[key] }))}
                      className={`
                        px-3.5 py-2 rounded-full text-[11px] font-semibold border transition-all duration-200
                        ${symptomForm[key] 
                          ? 'bg-teal-500/15 border-teal-500 text-teal-750 dark:text-teal-400' 
                          : 'bg-slate-50 dark:bg-zinc-850/50 border-slate-100 dark:border-zinc-800 text-slate-500 hover:bg-slate-100'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flow selection */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Menstrual Flow</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['none', 'light', 'medium', 'heavy'].map(level => (
                    <button 
                      type="button" 
                      key={level}
                      onClick={() => setSymptomForm(p => ({ ...p, flow: level }))}
                      className={`
                        py-2.5 rounded-xl text-[11px] font-semibold border capitalize transition-all duration-200
                        ${symptomForm.flow === level 
                          ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-500/15' 
                          : 'bg-slate-50 dark:bg-zinc-850/50 border-slate-100 dark:border-zinc-800 text-slate-500 hover:bg-slate-100'}
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain level slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400 dark:text-zinc-555">Pain Intensity</span>
                  <span className="text-rose-500">{symptomForm.painLevel}/10</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={symptomForm.painLevel}
                  onChange={e => setSymptomForm(p => ({ ...p, painLevel: Number(e.target.value) }))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Wellness Notes</label>
                <textarea 
                  rows="2"
                  placeholder="Any extra physical details, medications taken..."
                  value={symptomForm.notes}
                  onChange={e => setSymptomForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input resize-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10 btn-glow"
              >
                <Plus className="w-4 h-4" /> Save Symptoms
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ EDIT SYMPTOM MODAL ══════════════ */}
      {editItem && editItem.type === 'symptom' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto pr-2 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setEditItem(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-teal-500" />
              <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-lg">Edit Health Symptoms</h3>
            </div>
            <form onSubmit={handleUpdateSymptom} className="space-y-4.5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Log Date *</label>
                <input 
                  type="date" 
                  required
                  value={editItem.data.date.split('T')[0]}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, date: e.target.value } }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input" 
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Symptoms</label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOMS_LIST.map(({ key, label }) => (
                    <button 
                      type="button" 
                      key={key}
                      onClick={() => setEditItem(p => ({ ...p, data: { ...p.data, [key]: !p.data[key] } }))}
                      className={`
                        px-3.5 py-2 rounded-full text-[11px] font-semibold border transition-all duration-200
                        ${editItem.data[key] 
                          ? 'bg-teal-500/15 border-teal-500 text-teal-750 dark:text-teal-400' 
                          : 'bg-slate-50 dark:bg-zinc-850/50 border-slate-100 dark:border-zinc-800 text-slate-500 hover:bg-slate-100'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flow selection */}
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Menstrual Flow</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['none', 'light', 'medium', 'heavy'].map(level => (
                    <button 
                      type="button" 
                      key={level}
                      onClick={() => setEditItem(p => ({ ...p, data: { ...p.data, flow: level } }))}
                      className={`
                        py-2.5 rounded-xl text-[11px] font-semibold border capitalize transition-all duration-200
                        ${editItem.data.flow === level 
                          ? 'bg-rose-600 border-rose-500 text-white shadow-md shadow-rose-500/15' 
                          : 'bg-slate-50 dark:bg-zinc-850/50 border-slate-100 dark:border-zinc-800 text-slate-500 hover:bg-slate-100'}
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain level slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-400 dark:text-zinc-555">Pain Intensity</span>
                  <span className="text-rose-500">{editItem.data.painLevel}/10</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={editItem.data.painLevel}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, painLevel: Number(e.target.value) } }))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider block">Wellness Notes</label>
                <textarea 
                  rows="2"
                  value={editItem.data.notes || ''}
                  onChange={e => setEditItem(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))}
                  className="w-full px-4 py-2.5 rounded-xl text-slate-850 dark:text-zinc-150 glass-input resize-none" 
                />
              </div>

              <div className="flex gap-2.5 pt-1.5">
                <button 
                  type="button" 
                  onClick={() => setEditItem(null)}
                  className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-655 dark:text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10 btn-glow"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ CONFIRMATION MODAL ══════════════ */}
      <ConfirmationModal
        isOpen={deleteItemId !== null}
        onClose={() => setDeleteItemId(null)}
        onConfirm={deleteItemId?.type === 'period' ? handleDeletePeriod : handleDeleteSymptom}
        title={`Delete ${deleteItemId?.type === 'period' ? 'Period Cycle Log' : 'Wellness Symptom Log'}`}
        message="Are you sure you want to permanently delete this log entry? This operation will recalculate cycle mathematics and predictions immediately."
      />
    </DashboardLayout>
  );
};

export default Dashboard;
