import { useOutletContext, useNavigate } from "react-router-dom";
import { Grid, Box, Skeleton } from "@mui/material";

export default function Dashboard() {
  const { stats, progressPercent, consistencyData, consistencyStreak, uid, studentName, visibleTodos, handleToggle, loading, setFilter } = useOutletContext();
  const navigate = useNavigate();

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
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">Welcome back, {studentName ? studentName.split(' ')[0] : 'Ankit'}!</h2>
          <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">Your productivity is soaring this week. You've completed {progressPercent || 85}% of your targets so far.</p>
        </div>
        <div className="md:col-span-4 flex justify-end items-center">
          <div className="text-right">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">New Achievement</span>
            <p className="mt-2 font-headline font-bold text-on-surface">Consistent {consistencyStreak || 7}-Day Streak!</p>
          </div>
        </div>
      </section>

      {/* Summary Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Efficiency Card */}
        <div className="surface-container-highest p-6 rounded-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Efficiency</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{progressPercent || 92}<span className="text-primary">%</span></h3>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle className="text-surface-variant" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * (progressPercent || 92) / 100)} strokeWidth="6"></circle>
              </svg>
              <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-primary text-xl" data-icon="bolt">bolt</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-secondary font-bold">
            <span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
            +5% from yesterday
          </div>
        </div>

        {/* Active Tasks Card */}
        <div className="surface-container-highest p-6 rounded-xl group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Active Tasks</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{stats?.pending || 12}</h3>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" data-icon="checklist">checklist</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span className="w-2 h-2 bg-error rounded-full"></span>
            {stats?.overdue || 3} Tasks due soon
          </div>
        </div>

        {/* Streak Card */}
        <div className="surface-container-highest p-6 rounded-xl group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-sm font-medium mb-1">Daily Streak</p>
              <h3 className="text-3xl font-extrabold font-headline leading-tight">{consistencyStreak || 24}<span className="text-tertiary"> days</span></h3>
            </div>
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary" data-icon="local_fire_department">local_fire_department</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            Personal best: 28 days
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
            <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: "60%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">60</div>
            </div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: "45%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">45</div>
            </div>
            <div className="flex-1 bg-primary/60 hover:bg-primary/80 rounded-t-lg relative group transition-all" style={{ height: "85%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">85</div>
            </div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: "30%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">30</div>
            </div>
            <div className="flex-1 bg-primary/90 rounded-t-lg relative group shadow-[0_0_20px_rgba(186,158,255,0.3)] transition-all" style={{ height: "95%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">95</div>
            </div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: "50%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">50</div>
            </div>
            <div className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t-lg relative group transition-all" style={{ height: "40%" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">40</div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="surface-container p-8 rounded-2xl">
          <h4 className="text-xl font-headline font-bold mb-10">Task Distribution</h4>
          <div className="flex items-center gap-12">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#22262f" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ba9eff" strokeDasharray="100" strokeDashoffset="60" strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#34b5fa" strokeDasharray="25" strokeDashoffset="100" strokeLinecap="round" strokeWidth="4"></circle>
                <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ffb148" strokeDasharray="15" strokeDashoffset="75" strokeLinecap="round" strokeWidth="4"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-on-surface-variant">Total</span>
                <span className="text-xl font-extrabold text-on-surface">{stats?.total || 42}</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Strategic</span>
                </div>
                <span className="text-sm font-bold">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-secondary"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Operational</span>
                </div>
                <span className="text-sm font-bold">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Personal</span>
                </div>
                <span className="text-sm font-bold">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-surface-variant"></span>
                  <span className="text-sm font-medium text-on-surface-variant">Learning</span>
                </div>
                <span className="text-sm font-bold">20%</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
