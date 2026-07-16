import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Droplet, Heart, Sparkles, Plus, Star } from 'lucide-react';

const CalendarWidget = ({ periods, symptoms, predictions, onAddPeriodDate, onLogSymptomDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Helper date matching (removes hour details)
  const isSameDay = (d1Str, d2) => {
    if (!d1Str || !d2) return false;
    const d1 = new Date(d1Str);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);

  // Generate date cells
  const dayCells = [];
  // padding empty boxes
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(null);
  }
  // days
  for (let d = 1; d <= daysInMonth; d++) {
    dayCells.push(new Date(year, month, d));
  }

  // Highlight matches
  const checkDayStatus = (date) => {
    if (!date) return {};
    let isPeriod = false;
    let isFertile = false;
    let isOvulation = false;
    let loggedSymptom = null;

    // 1. Period matching
    periods.forEach(p => {
      const start = new Date(p.startDate);
      start.setHours(0,0,0,0);
      const end = p.endDate ? new Date(p.endDate) : new Date(p.startDate);
      end.setHours(23,59,59,999);
      if (date >= start && date <= end) {
        isPeriod = true;
      }
    });

    // 2. Prediction matching
    if (predictions) {
      if (predictions.ovulationDate && isSameDay(predictions.ovulationDate, date)) {
        isOvulation = true;
      }
      if (predictions.fertileWindow) {
        const start = new Date(predictions.fertileWindow.start);
        const end = new Date(predictions.fertileWindow.end);
        if (date >= start && date <= end) {
          isFertile = true;
        }
      }
    }

    // 3. Logged symptoms matching
    symptoms.forEach(s => {
      if (isSameDay(s.date, date)) {
        loggedSymptom = s;
      }
    });

    const isToday = isSameDay(new Date().toISOString(), date);

    return { isPeriod, isFertile, isOvulation, loggedSymptom, isToday };
  };

  // Get active day details
  const getSelectedDayDetails = () => {
    if (!selectedDay) return null;
    const { isPeriod, isFertile, isOvulation, loggedSymptom } = checkDayStatus(selectedDay);
    return {
      date: selectedDay,
      isPeriod,
      isFertile,
      isOvulation,
      symptom: loggedSymptom
    };
  };

  const activeDetails = getSelectedDayDetails();

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Interactive Calendar</h3>
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Plan & Predict</span>
        </div>
        <div className="flex gap-1.5">
          <button onClick={handlePrevMonth} className="p-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 text-slate-655 dark:text-zinc-400 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-bold font-outfit text-xs text-slate-800 dark:text-white bg-violet-500/5 border border-violet-500/10 rounded-xl flex items-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="p-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 text-slate-655 dark:text-zinc-400 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-555">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {dayCells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

          const { isPeriod, isFertile, isOvulation, loggedSymptom, isToday } = checkDayStatus(date);
          const isSelected = selectedDay && date.getDate() === selectedDay.getDate() && date.getMonth() === selectedDay.getMonth();

          // Visual styles depending on state
          let dayClass = 'text-slate-800 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40';
          if (isPeriod) {
            dayClass = 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/20';
          } else if (isOvulation) {
            dayClass = 'bg-teal-500/15 text-teal-600 dark:bg-teal-500/25 dark:text-teal-400 border border-teal-500/20 font-bold';
          } else if (isFertile) {
            dayClass = 'bg-teal-500/5 text-teal-655 dark:bg-teal-500/10 dark:text-teal-400';
          }

          return (
            <button
              key={`day-${idx}`}
              onClick={() => setSelectedDay(date)}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center relative text-xs font-semibold transition-all duration-200 border
                ${dayClass}
                ${isToday ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-zinc-900' : ''}
                ${isSelected ? 'scale-105 border-violet-500 bg-violet-500/10' : 'border-transparent'}
              `}
            >
              <span>{date.getDate()}</span>
              
              {/* Markers */}
              <div className="absolute bottom-1 flex gap-0.5">
                {isPeriod && <span className="w-1 h-1 bg-rose-500 rounded-full" />}
                {isOvulation && <Star className="w-2 h-2 text-teal-500 fill-teal-500" />}
                {!isOvulation && isFertile && <span className="w-1 h-1 bg-teal-400 rounded-full" />}
                {loggedSymptom && <span className="w-1 h-1 bg-purple-400 rounded-full" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-[10px] font-semibold text-slate-500 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500/30 rounded-md" />
          <span>Period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-teal-500/10 rounded-md" />
          <span>Fertile Window</span>
        </div>
        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
          <Star className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
          <span>Ovulation Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-purple-400 rounded-full" />
          <span>Symptom Tracker</span>
        </div>
      </div>

      {/* Selected Date Detail Drawer/Box */}
      {activeDetails && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 animate-in fade-in duration-200 space-y-3.5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-outfit font-bold text-xs text-slate-800 dark:text-white">
                {activeDetails.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-zinc-555">Daily Log Details</p>
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => onAddPeriodDate && onAddPeriodDate(activeDetails.date)}
                className="p-1 px-2.5 text-[9px] font-bold uppercase tracking-wider rounded-lg bg-rose-600 text-white flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Log Period
              </button>
              <button 
                onClick={() => onLogSymptomDate && onLogSymptomDate(activeDetails.date)}
                className="p-1 px-2.5 text-[9px] font-bold uppercase tracking-wider rounded-lg bg-teal-600 text-white flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Log Symptom
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {activeDetails.isPeriod && (
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-medium">
                <Droplet className="w-4 h-4" />
                <span>Period active on this day.</span>
              </div>
            )}
            {activeDetails.isOvulation && (
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Ovulation predicted on this day.</span>
              </div>
            )}

            {/* Render Logged symptoms */}
            {activeDetails.symptom ? (
              <div className="space-y-1.5 pt-1.5 border-t border-slate-200 dark:border-zinc-800/80">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-555">Symptoms Logged</span>
                <div className="flex flex-wrap gap-1">
                  {['cramps', 'headache', 'fatigue', 'moodSwings', 'acne', 'bloating', 'backPain', 'nausea'].map(s => {
                    if (activeDetails.symptom[s]) {
                      return (
                        <span key={s} className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-650 dark:text-purple-300 border border-purple-500/10 rounded-md capitalize">
                          {s.replace(/([A-Z])/g, ' $1')}
                        </span>
                      );
                    }
                    return null;
                  })}
                  {activeDetails.symptom.flow !== 'none' && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/10 rounded-md capitalize">
                      {activeDetails.symptom.flow} Flow
                    </span>
                  )}
                  {activeDetails.symptom.painLevel > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-md">
                      Pain: {activeDetails.symptom.painLevel}/10
                    </span>
                  )}
                </div>
                {activeDetails.symptom.notes && (
                  <p className="text-[11px] italic text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-zinc-800/30 p-2 rounded-xl mt-1.5">
                    "{activeDetails.symptom.notes}"
                  </p>
                )}
              </div>
            ) : (
              !activeDetails.isPeriod && !activeDetails.isOvulation && (
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">No health symptoms or periods logged for this date.</p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
