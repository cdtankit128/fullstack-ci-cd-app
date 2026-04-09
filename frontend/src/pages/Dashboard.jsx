import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
  const { stats, progressPercent, consistencyData, maxDailyCompletions } = useOutletContext();

  return (
    <section className="page-grid">
      <div className="surface-card page-title">
        <p className="tag">Overview</p>
        <h1>Dashboard</h1>
        <p>Quick snapshot of your progress, active items, and short-term consistency.</p>
      </div>

      <div className="stats-card-grid">
        <article className="surface-card stat-card">
          <span>Total Tasks</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="surface-card stat-card">
          <span>Active</span>
          <strong>{stats.active}</strong>
        </article>
        <article className="surface-card stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </article>
      </div>

      <section className="surface-card progress-card">
        <div className="progress-head">
          <h3>Completion</h3>
          <span>{progressPercent}%</span>
        </div>
        <div className="progress-track" aria-label="Task completion progress">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="progress-meta">
          {stats.completed} done out of {stats.total} tasks.
        </p>
      </section>

      <section className="surface-card chart-card-small">
        <h3>Last 7 Days</h3>
        <div className="chart-grid" role="img" aria-label="Mini chart of completed tasks by day">
          {consistencyData.map((item) => {
            const height = Math.max(8, Math.round((item.count / maxDailyCompletions) * 100));
            return (
              <div key={item.key} className="bar-col" data-tip={`${item.day}: ${item.count} complete`}>
                <span className="bar-value">{item.count}</span>
                <div className="bar-track compact">
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
