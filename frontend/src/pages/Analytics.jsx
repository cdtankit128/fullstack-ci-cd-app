import { useOutletContext } from "react-router-dom";

export default function Analytics() {
  const { consistencyData, consistencyStreak, progressPercent, weeklyCompleted, maxDailyCompletions } = useOutletContext();

  const safeMax = maxDailyCompletions || 1;

  return (
    <section className="max-w-6xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* Header Section */}
      <div className="p-8 rounded-2xl border border-outline-variant/20 bg-surface-variant/30 backdrop-blur-sm">
        <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">insights</span>
          Insights
        </p>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">Analytics Dashboard</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
          Track consistency, streak quality, and weekly completion behavior to optimize your peak performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-variant/10 hover:bg-surface-variant/20 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined">local_fire_department</span>
            Current Streak
          </span>
          <div className="flex items-baseline gap-1">
            <strong className="text-5xl font-headline font-black text-on-surface tracking-tight">{consistencyStreak}</strong>
            <span className="text-lg text-on-surface-variant font-medium mb-1">days</span>
          </div>
        </article>

        <article className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-variant/10 hover:bg-surface-variant/20 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined">task_alt</span>
            Completion Rate
          </span>
          <div className="flex items-baseline gap-1">
            <strong className="text-5xl font-headline font-black text-on-surface tracking-tight">{progressPercent}</strong>
            <span className="text-lg text-on-surface-variant font-medium mb-1">%</span>
          </div>
        </article>

        <article className="p-6 rounded-2xl border border-outline-variant/20 bg-surface-variant/10 hover:bg-surface-variant/20 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group">
          <span className="text-on-surface-variant text-sm font-medium mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
            <span className="material-symbols-outlined">calendar_today</span>
            Weekly Done
          </span>
          <div className="flex items-baseline gap-1">
            <strong className="text-5xl font-headline font-black text-on-surface tracking-tight">{weeklyCompleted}</strong>
            <span className="text-lg text-on-surface-variant font-medium mb-1">tasks</span>
          </div>
        </article>
      </div>

      {/* Bar Chart Section */}
      <section className="p-8 rounded-2xl border border-outline-variant/20 bg-surface-variant/20">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary px-2 py-1 bg-primary/10 rounded-lg">bar_chart</span>
            Consistency Chart (Last 7 Days)
          </h3>
          <span className="text-xs font-bold text-on-surface-variant bg-surface-variant/50 px-3 py-1 rounded-full">
            Max: {safeMax} tasks/day
          </span>
        </div>
        
        <div className="flex h-64 items-end justify-between gap-3 md:gap-6 relative w-full pt-4" role="img" aria-label="Bar chart of completed tasks by day">
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] z-0">
            <div className="border-t border-on-surface w-full"></div>
            <div className="border-t border-on-surface w-full"></div>
            <div className="border-t border-on-surface w-full"></div>
            <div className="border-t border-on-surface w-full"></div>
          </div>

          {consistencyData.map((item) => {
            const heightPct = item.count > 0 ? Math.max(12, Math.round((item.count / safeMax) * 100)) : 0;
            return (
              <div key={item.key} className="flex flex-col items-center flex-1 group z-10 h-full justify-end">
                {/* Tooltip value */}
                <span className={`text-sm font-bold text-primary mb-2 transition-all duration-300 ${item.count > 0 ? 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0' : 'opacity-0'}`}>
                  {item.count}
                </span>
                
                {/* Bar Track & Fill */}
                <div className="w-full max-w-[64px] h-[calc(100%-2rem)] bg-surface-variant/30 rounded-xl overflow-hidden relative flex items-end justify-center group-hover:bg-surface-variant/50 transition-colors border border-outline-variant/10 border-b-0 backdrop-blur-md">
                  <div 
                    className="w-full bg-gradient-to-t from-primary-dim to-primary rounded-t-lg transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(186,158,255,0.4)] group-hover:shadow-[0_0_25px_rgba(186,158,255,0.7)] group-hover:brightness-110"
                    style={{ height: `${heightPct}%` }} 
                  />
                </div>
                
                {/* X-Axis Label */}
                <span className="text-[10px] md:text-xs font-label text-on-surface-variant mt-4 uppercase tracking-widest group-hover:text-on-surface transition-colors">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </section>

    </section>
  );
}
