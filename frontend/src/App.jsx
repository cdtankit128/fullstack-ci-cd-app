import { useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./services/api";
import "./App.css";

const UID_PREFIX = "23BCS";
const UID_REGEX = /^23BCS\d{5}$/;

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
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateUID = (value) => UID_REGEX.test(value);

  const formatUidInput = (rawValue) => {
    const uppercase = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!uppercase) {
      return "";
    }

    if (uppercase.startsWith(UID_PREFIX)) {
      const digits = uppercase.slice(UID_PREFIX.length).replace(/\D/g, "");
      return `${UID_PREFIX}${digits}`.slice(0, 10);
    }

    const digits = uppercase.replace(/\D/g, "");
    return `${UID_PREFIX}${digits}`.slice(0, 10);
  };

  const getUidError = (value) => {
    if (!value) {
      return "";
    }

    if (validateUID(value)) {
      return "";
    }

    return "Invalid UID format (23BCS + 5 digits).";
  };

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

  const handleUidChange = (e) => {
    const formattedValue = formatUidInput(e.target.value);
    setUidInput(formattedValue);
    setError(getUidError(formattedValue) || null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUid = formatUidInput(uidInput.trim());
    setUidInput(cleanUid);

    if (!cleanUid) {
      setError("Please enter your UID.");
      return;
    }

    if (!validateUID(cleanUid)) {
      setError("Please enter a valid UID.");
      return;
    }

    setLoginLoading(true);

    try {
      localStorage.setItem("todo_uid", cleanUid);
      setUid(cleanUid);
      setError(null);
    } finally {
      setLoginLoading(false);
    }
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
    const isUidValid = validateUID(uidInput);

    return (
      <div className="login-layout">
        <Paper
          elevation={0}
          className="login-mui-card"
          sx={{
            width: "min(400px, 100%)",
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
              display: "inline-flex",
              alignItems: "center",
              px: 1.15,
              py: 0.35,
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(15,23,42,0.24)",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.125em",
              color: "rgba(226,232,240,0.82)",
              opacity: 0.78,
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
            <Typography
              variant="body2"
              sx={{
                mb: 0.85,
                fontWeight: 600,
                color: "rgba(241,245,249,0.9)",
              }}
            >
              University UID
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="23BCS12345"
              value={uidInput}
              onChange={handleUidChange}
              error={Boolean(error)}
              helperText={error || "Format: 23BCS + 5 digits"}
              inputProps={{ maxLength: 10 }}
              sx={{
                "& .MuiInputBase-input, & .MuiFormHelperText-root": {
                  fontFamily: '"Inter", sans-serif',
                },
                "& .MuiFormHelperText-root": {
                  mt: 1,
                  color: error ? "#fca5a5" : "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "rgba(15,23,42,0.35)",
                  boxShadow: "none",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.24)",
                  },
                  "&.Mui-focused": {
                    boxShadow: "0 0 0 2px rgba(139,92,246,0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#8b5cf6",
                  },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={!isUidValid || loginLoading}
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
                "&:disabled": {
                  background: "rgba(100, 116, 139, 0.55)",
                  color: "rgba(241, 245, 249, 0.82)",
                },
              }}
            >
              {loginLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Continue ->"}
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
