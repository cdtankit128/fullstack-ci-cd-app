import { useOutletContext } from "react-router-dom";

export default function Analytics() {
  const { consistencyData, consistencyStreak, progressPercent, weeklyCompleted, maxDailyCompletions } = useOutletContext();

  return (
    <section className="page-grid">
      <div className="surface-card page-title">
        <p className="tag">Insights</p>
        <h1>Analytics</h1>
        <p>Track consistency, streak quality, and weekly completion behavior.</p>
      </div>

      <div className="stats-card-grid">
        <article className="surface-card stat-card">
          <span>Current Streak</span>
          <strong>{consistencyStreak}d</strong>
        </article>
        <article className="surface-card stat-card">
          <span>Completion Rate</span>
          <strong>{progressPercent}%</strong>
        </article>
        <article className="surface-card stat-card">
          <span>Weekly Done</span>
          <strong>{weeklyCompleted}</strong>
        </article>
      </div>

      <section className="surface-card chart-card-large">
        <h3>Consistency Chart (Last 7 Days)</h3>
        <div className="chart-grid analytics" role="img" aria-label="Bar chart of completed tasks by day">
          {consistencyData.map((item) => {
            const height = Math.max(10, Math.round((item.count / maxDailyCompletions) * 100));
            return (
              <div key={item.key} className="bar-col" data-tip={`${item.day}: ${item.count} complete`}>
                <span className="bar-value">{item.count}</span>
                <div className="bar-track tall">
                  <div className="bar-fill" style={{ height: `${height}%` }} />
                </div>
                <span className="bar-day">{item.day}</span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
