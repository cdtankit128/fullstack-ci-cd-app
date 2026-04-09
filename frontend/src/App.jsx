import { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./services/api";
import "./App.css";

function formatDayLabel(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function App() {
  const [uidInput, setUidInput] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("todo_uid") || "");
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTodos = async (activeUid) => {
    if (!activeUid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getTodos(activeUid);
      setTodos(data.todos || []);
    } catch {
      setError("Unable to load tasks right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) {
      setUidInput(uid);
      loadTodos(uid);
    }
  }, [uid]);

  const visibleTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
    };
  }, [todos]);

  const progressPercent = useMemo(() => {
    if (!stats.total) {
      return 0;
    }

    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  const consistencyData = useMemo(() => {
    const dayCounts = new Map();
    todos
      .filter((todo) => todo.completed)
      .forEach((todo) => {
        const timestamp = todo.completedAt || todo.createdAt;
        const key = toDateKey(new Date(timestamp));
        dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
      });

    const rows = [];
    const now = new Date();
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const key = toDateKey(day);
      rows.push({
        key,
        day: formatDayLabel(day),
        count: dayCounts.get(key) || 0,
      });
    }

    return rows;
  }, [todos]);

  const maxDailyCompletions = useMemo(() => {
    return Math.max(1, ...consistencyData.map((item) => item.count));
  }, [consistencyData]);

  const consistencyStreak = useMemo(() => {
    let streak = 0;
    const completedDaySet = new Set(
      consistencyData.filter((item) => item.count > 0).map((item) => item.key),
    );

    const now = new Date();
    while (true) {
      const dayKey = toDateKey(now);
      if (!completedDaySet.has(dayKey)) {
        break;
      }

      streak += 1;
      now.setDate(now.getDate() - 1);
    }

    return streak;
  }, [consistencyData]);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUid = uidInput.trim();
    if (!cleanUid) {
      setError("Please enter your UID.");
      return;
    }

    const normalizedUid = cleanUid.toUpperCase();
    if (!normalizedUid.startsWith("23BCS")) {
      setError("UID must start with 23BCS.");
      return;
    }

    if (!/^23BCS\d{5}$/.test(normalizedUid)) {
      setError("UID must be in the format 23BCS followed by 5 digits.");
      return;
    }

    localStorage.setItem("todo_uid", normalizedUid);
    setUid(normalizedUid);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("todo_uid");
    setUid("");
    setUidInput("");
    setTodos([]);
    setError(null);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const task = newTask.trim();
    if (!task || !uid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createTodo(uid, task);
      setTodos(data.todos || []);
      setNewTask("");
    } catch {
      setError("Could not add task.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (todo) => {
    if (!uid) {
      return;
    }

    try {
      const data = await updateTodo(uid, todo.id, !todo.completed);
      setTodos(data.todos || []);
    } catch {
      setError("Could not update task.");
    }
  };

  const handleDelete = async (id) => {
    if (!uid) {
      return;
    }

    try {
      const data = await deleteTodo(uid, id);
      setTodos(data.todos || []);
    } catch {
      setError("Could not delete task.");
    }
  };

  const clearCompleted = async () => {
    const completedIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);
    for (const id of completedIds) {
      await handleDelete(id);
    }
  };

  if (!uid) {
    return (
      <div className="login-layout">
        <Paper
          elevation={0}
          className="login-mui-card"
          sx={{
            width: "min(430px, 100%)",
            p: { xs: 3, sm: 4 },
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            color: "#f8fafc",
            fontFamily: '"Poppins", "Inter", sans-serif',
          }}
        >
          <Box className="login-logo-wrap">
            <img src="/cu-logo.svg" alt="TaskSphere logo" className="cu-logo login-logo-centered" />
          </Box>

          <Typography
            variant="overline"
            sx={{
              display: "block",
              letterSpacing: "0.12em",
              color: "rgba(226,232,240,0.85)",
              fontWeight: 600,
            }}
          >
            Secure Login
          </Typography>

          <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: "#ffffff" }}>
            TaskSphere
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, color: "rgba(226,232,240,0.82)" }}>
            Enter your UID to continue
          </Typography>

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="University UID"
              placeholder="23BCS12345"
              value={uidInput}
              onChange={(e) => setUidInput(e.target.value)}
              error={Boolean(error)}
              helperText={error || "Format: 23BCS12345"}
              sx={{
                mt: 2,
                "& .MuiInputBase-input, & .MuiInputLabel-root, & .MuiFormHelperText-root": {
                  fontFamily: '"Inter", sans-serif',
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(226,232,240,0.8)",
                },
                "& .MuiFormHelperText-root": {
                  mt: 1,
                  color: error ? "#fca5a5" : "rgba(226,232,240,0.72)",
                  fontSize: "0.78rem",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(15,23,42,0.35)",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(129,140,248,0.75)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 4px rgba(99,102,241,0.2)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#818cf8",
                  },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                mt: 3,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: '"Poppins", "Inter", sans-serif',
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 12px 26px rgba(99,102,241,0.35)",
                "&:hover": {
                  filter: "brightness(1.08)",
                  boxShadow: "0 14px 30px rgba(99,102,241,0.42)",
                },
              }}
            >
              Continue -&gt;
            </Button>
          </Box>
        </Paper>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <main className="dashboard-shell">
        <section className="hero-panel">
          <p className="tag">TaskSphere Workspace</p>
          <h1>TaskSphere Control Center</h1>
          <p>
            Manage tasks with a live progress tracker, consistency chart, and clear complete/incomplete actions.
          </p>
          <div className="session-row">
            <p>
              Signed in as <span>{uid}</span>
            </p>
            <button type="button" className="ghost" onClick={handleLogout}>
              Switch UID
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}

          <div className="progress-wrap">
            <div className="progress-head">
              <h3>Progress Tracking</h3>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-track" aria-label="Task completion progress">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="progress-meta">
              {stats.completed} completed out of {stats.total} total tasks. Current consistency streak: {consistencyStreak} day
              {consistencyStreak === 1 ? "" : "s"}.
            </p>
          </div>
        </section>

        <section className="todo-panel">
          <div className="todo-topbar">
            <h2>Dashboard</h2>
            <div className="stats">
              <div>
                <strong>{stats.total}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>{stats.active}</strong>
                <span>Active</span>
              </div>
              <div>
                <strong>{stats.completed}</strong>
                <span>Done</span>
              </div>
            </div>
          </div>

          <form className="task-form" onSubmit={handleAddTask}>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              disabled={!uid || loading}
            />
            <button type="submit" disabled={!uid || loading}>
              Add
            </button>
          </form>

          <div className="filter-row">
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              All
            </button>
            <button
              type="button"
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              type="button"
              className={filter === "completed" ? "active" : ""}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
            <button type="button" className="ghost" onClick={clearCompleted} disabled={!stats.completed}>
              Clear Completed
            </button>
          </div>

          <div className="todo-list">
            {visibleTodos.length === 0 && <p className="empty">No tasks yet. Add your first task.</p>}
            {visibleTodos.map((todo) => (
              <article key={todo.id} className={todo.completed ? "todo-item done" : "todo-item"}>
                <button
                  type="button"
                  className="tick"
                  onClick={() => handleToggle(todo)}
                  aria-label="Toggle complete"
                >
                  {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <div className="todo-copy">
                  <p>{todo.text}</p>
                  <small>
                    Created {new Date(todo.createdAt).toLocaleString()} {todo.completedAt ? `| Completed ${new Date(todo.completedAt).toLocaleString()}` : ""}
                  </small>
                </div>
                <button
                  type="button"
                  className="remove"
                  onClick={() => handleDelete(todo.id)}
                  aria-label="Delete task"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>

          <section className="consistency-card">
            <h3>Consistency Chart (Last 7 Days)</h3>
            <div className="chart-grid" role="img" aria-label="Bar chart of completed tasks by day">
              {consistencyData.map((item) => {
                const height = Math.max(8, Math.round((item.count / maxDailyCompletions) * 100));
                return (
                  <div key={item.key} className="bar-col">
                    <span className="bar-value">{item.count}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${height}%` }} />
                    </div>
                    <span className="bar-day">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
