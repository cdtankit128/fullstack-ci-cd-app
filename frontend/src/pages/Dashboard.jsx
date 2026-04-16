import { useOutletContext, useNavigate } from "react-router-dom";
import { Grid, Box, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { stats, progressPercent, consistencyData, maxDailyCompletions, consistencyStreak, uid, studentName, visibleTodos, handleToggle, loading, setFilter } = useOutletContext();
  const navigate = useNavigate();

  const targetTask = visibleTodos?.filter(t => !t.completed && t.priority === "High" && t.dueDate)
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!targetTask) return;
    
    const computeTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetTask.dueDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft("Started!");
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        let tl = "";
        if (days > 0) tl += `${days}d `;
        if (hours > 0 || days > 0) tl += `${hours}h `;
        tl += `${minutes}m ${seconds}s`;
        setTimeLeft(tl);
      }
    };
    
    computeTime();
    const interval = setInterval(computeTime, 1000);
    return () => clearInterval(interval);
  }, [targetTask]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-10 max-w-7xl mx-auto w-full">
         <Skeleton variant="rounded" width="100%" height={220} sx={{ borderRadius: "24px", bgcolor: "rgba(255,255,255,0.05)" }} />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      {/* Welcome Section (Hero Bento Row) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-2">
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Welcome back, {studentName ? studentName.split(' ')[0] : 'Student'}!</h2>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">Your productivity is soaring this week. You've completed {progressPercent || 0}% of your targets so far.</p>
        </div>
        <div className="md:col-span-4 flex justify-end items-center">
          <div className="text-right">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">Current Streak</span>
            <p className="mt-2 font-headline font-bold text-on-surface">{consistencyStreak || 0}-Day Streak!</p>
          </div>
        </div>
      </section>

      {/* High Priority Timer Banner */}
      {targetTask && (
        <section className="bg-error/10 border border-error/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(248,113,113,0.1)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center animate-pulse shrink-0">
              <span className="material-symbols-outlined text-error">campaign</span>
            </div>
            <div>
              <h3 className="text-error font-extrabold text-xl font-headline tracking-tight">High Priority Task Alert</h3>
              <p className="text-on-surface font-medium mt-1 text-sm md:text-base">"<span className="truncate inline-block max-w-[200px] align-bottom">{targetTask.text}</span>" is scheduled to start on {new Date(targetTask.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right bg-surface px-6 py-3 rounded-xl border border-outline-variant/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1 opacity-70">Time Remaining</p>
            <p className="text-2xl md:text-3xl font-black font-headline text-error tabular-nums tracking-wider">{timeLeft || "Computing..."}</p>
            <button onClick={() => handleToggle(targetTask)} className="mt-3 text-xs uppercase tracking-widest bg-error text-white px-4 py-1.5 rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all">Mark Completed</button>
          </div>
        </section>
      )}

      {/* Summary Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Efficiency Card */}
        <div className="surface-container-highest p-6 rounded-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Efficiency</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{progressPercent || 0}<span className="text-primary">%</span></h3>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle className="text-surface-variant" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * (progressPercent || 0) / 100)} strokeWidth="6"></circle>
              </svg>
              <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-xl" data-icon="bolt">bolt</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-secondary font-bold">
            <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
            Keep pushing forward!
          </div>
        </div>

        {/* Active Tasks Card */}
        <div className="surface-container-highest p-6 rounded-xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Active Tasks</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{stats?.active || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" data-icon="checklist">checklist</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            {(stats?.active || 0) > 0 ? (
              <>
                <span className="w-2 h-2 bg-error rounded-full"></span>
                Focus on completing them
              </>
            ) : (
               <>
                <span className="w-2 h-2 bg-success rounded-full"></span>
                All caught up!
              </>
            )}
          </div>
        </div>

        {/* Streak Card */}
        <div className="surface-container-highest p-6 rounded-xl group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Daily Streak</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{consistencyStreak || 0}<span className="text-tertiary"> days</span></h3>
            </div>
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary" data-icon="local_fire_department">local_fire_department</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            Current login streak
          </div>
        </div>
      </section>

      {/* Middle Section: Tasks & Streak Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Tasks */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-headline font-bold text-on-surface">Active Tasks</h4>
            <button 
              onClick={() => navigate('/tasks')}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary hover:text-on-primary transition-all duration-300"
            >
              <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
              Add Task
            </button>
          </div>

          <div className="flex-1 min-h-[340px] surface-container rounded-2xl flex flex-col items-center justify-center p-12 text-center border border-dashed border-outline-variant/30">
            <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center mb-6 relative">
              <span className="material-symbols-outlined text-primary text-5xl opacity-40" data-icon="rocket_launch">rocket_launch</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full shadow-[0_0_12px_rgba(186,158,255,0.4)] animate-pulse"></div>
            </div>
            <h5 className="text-2xl font-headline font-bold text-on-surface mb-2">No active tasks found</h5>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">It looks like your slate is clean. This is the perfect moment to start your journey and conquer new goals!</p>
            <button 
              onClick={() => navigate('/tasks')}
              className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold shadow-[0_0_32px_rgba(186,158,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Start your journey!
            </button>
          </div>
        </div>

        {/* Right: Productivity & Streak Widget */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-2xl shadow-[0_0_32px_0_rgba(186,158,255,0.08)]">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-bold text-on-surface">Streak Tracker</h4>
              <span className="text-xs font-bold text-on-surface-variant opacity-60">October 2023</span>
            </div>

            <div className="grid grid-cols-7 gap-y-4 text-center mb-8">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Mo</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Tu</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">We</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Th</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Fr</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Sa</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Su</span>
              <span className="text-xs text-on-surface-variant opacity-30">25</span>
              <span className="text-xs text-on-surface-variant opacity-30">26</span>
              <span className="text-xs text-on-surface-variant opacity-30">27</span>
              <span className="text-xs text-on-surface-variant opacity-30">28</span>
              <span className="text-xs text-on-surface-variant opacity-30">29</span>
              <span className="text-xs text-on-surface-variant opacity-30">30</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">1</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">2</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">3</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">4</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">5</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">6</span>
              <span className="text-xs font-bold text-on-surface bg-primary/20 w-8 h-8 flex items-center justify-center rounded-lg mx-auto border border-primary/40 shadow-[0_0_10px_rgba(186,158,255,0.2)]">7</span>
              <span className="text-xs font-bold text-on-surface-variant w-8 h-8 flex items-center justify-center mx-auto opacity-70">8</span>
            </div>

            <div className="space-y-4 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-on-surface-variant">Consistency</p>
                <p className="text-sm font-bold text-secondary">98%</p>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full w-[98%] shadow-[0_0_12px_rgba(52,181,250,0.4)]"></div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium text-on-surface-variant">Focus Hours</p>
                <p className="text-sm font-bold text-primary">34.5h</p>
              </div>
              <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[75%] shadow-[0_0_12px_rgba(186,158,255,0.4)]"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Visualizations: Charts Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="surface-container p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-headline font-bold">Weekly Progress</h4>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Tasks
              </span>
              <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Focus
              </span>
            </div>
          </div>
            <div className="relative h-48 flex items-end justify-between gap-4">
              {consistencyData?.map((item) => {
                const maxVal = Math.max(1, ...consistencyData.map(d => d.count));
                const heightPct = item.count > 0 ? Math.max(10, Math.round((item.count / maxVal) * 100)) : 5;
                const isToday = item.day === new Date().toLocaleDateString('en-US', { weekday: 'short' });
                return (
                  <div key={item.key} className={`flex-1 ${isToday ? 'bg-primary/90 shadow-[0_0_20px_rgba(186,158,255,0.3)]' : item.count > 0 ? 'bg-primary/60 hover:bg-primary/80' : 'bg-primary/10 hover:bg-primary/30'} rounded-t-lg relative group transition-all duration-500`} style={{ height: `${heightPct}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
              {consistencyData?.map((item) => (
                <span key={item.key}>{item.day}</span>
              ))}
            </div>
          </div>

        <div className="surface-container p-8 rounded-2xl">
          <h4 className="text-xl font-headline font-bold mb-10">Task Distribution</h4>
          <div className="flex items-center gap-12">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#22262f" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ba9eff" strokeDasharray="100.53" strokeDashoffset={100.53 - (100.53 * (stats?.total ? stats.active / stats.total : 0))} strokeLinecap="round" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" fill="transparent" r="16" stroke="#34b5fa" strokeDasharray="100.53" strokeDashoffset={100.53 - (100.53 * (stats?.total ? stats.completed / stats.total : 0))} strokeLinecap="round" strokeWidth="4" className="origin-center" style={{ transform: `rotate(${(stats?.total ? stats.active / stats.total : 0) * 360}deg)` }}></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-on-surface-variant">Total</span>
                <span className="text-xl font-extrabold text-on-surface">{stats?.total || 0}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Active</span>
                </div>
                <span className="text-sm font-bold">
                  {stats?.total ? Math.round((stats.active / stats.total) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Completed</span>
                </div>
                <span className="text-sm font-bold">
                  {stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
