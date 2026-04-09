import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [uidInput, setUidInput] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("todo_uid") || "");
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");

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
    if (!value || validateUID(value)) {
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

  const weeklyCompleted = useMemo(() => {
    return consistencyData.reduce((sum, item) => sum + item.count, 0);
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
      navigate("/dashboard", { replace: true });
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
    setEditingTodoId(null);
    setEditingText("");
    navigate("/", { replace: true });
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
      const data = await updateTodo(uid, todo.id, { completed: !todo.completed });
      setTodos(data.todos || []);
    } catch {
      setError("Could not update task status.");
    }
  };

  const handleStartEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (id) => {
    const trimmedText = editingText.trim();
    if (!trimmedText || !uid) {
      setError("Task text cannot be empty.");
      return;
    }

    try {
      const data = await updateTodo(uid, id, { text: trimmedText });
      setTodos(data.todos || []);
      setEditingTodoId(null);
      setEditingText("");
      setError(null);
    } catch {
      setError("Could not update task text.");
    }
  };

  const handleDelete = async (id) => {
    if (!uid) {
      return;
    }

    try {
      const data = await deleteTodo(uid, id);
      setTodos(data.todos || []);
      if (editingTodoId === id) {
        handleCancelEdit();
      }
    } catch {
      setError("Could not delete task.");
    }
  };

  const clearCompleted = async () => {
    if (!uid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completedIds = todos.filter((todo) => todo.completed).map((todo) => todo.id);
      for (const id of completedIds) {
        await deleteTodo(uid, id);
      }
      await loadTodos(uid);
    } catch {
      setError("Could not clear completed tasks.");
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
    { to: "/tasks", label: "Tasks", icon: <TaskAltRoundedIcon fontSize="small" /> },
    { to: "/analytics", label: "Analytics", icon: <InsightsRoundedIcon fontSize="small" /> },
    { to: "/settings", label: "Settings", icon: <SettingsRoundedIcon fontSize="small" /> },
  ];

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
              helperText={error || "Format: 23BCS12345"}
              inputProps={{ maxLength: 10 }}
              InputProps={{
                endAdornment: isUidValid ? (
                  <InputAdornment position="end">
                    <CheckCircleIcon sx={{ color: "#22c55e" }} />
                  </InputAdornment>
                ) : null,
              }}
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
                    borderColor: isUidValid ? "#22c55e" : "#8b5cf6",
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
    <div className="workspace-layout">
      <aside className="workspace-sidebar">
        <div>
          <div className="sidebar-brand">
            <img src="/cu-logo.svg" alt="TaskSphere logo" className="sidebar-logo" />
            <div>
              <p className="sidebar-eyebrow">TaskSphere</p>
              <h2>Workspace</h2>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-profile">
          <p>Signed in as</p>
          <strong>{uid}</strong>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <LogoutRoundedIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      <main className="workspace-content">
        {error && <p className="error-text route-error">{error}</p>}

        <Routes>
          <Route
            path="/dashboard"
            element={
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
                        <div key={item.key} className="bar-col">
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
            }
          />

          <Route
            path="/tasks"
            element={
              <section className="page-grid">
                <div className="surface-card page-title">
                  <p className="tag">Core Work Area</p>
                  <h1>Tasks</h1>
                  <p>Add tasks, filter quickly, edit names, and keep your list clean.</p>
                </div>

                <section className="surface-card">
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
                    <button
                      type="button"
                      className={filter === "all" ? "active" : ""}
                      onClick={() => setFilter("all")}
                    >
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
                    <button type="button" className="ghost" onClick={clearCompleted} disabled={!stats.completed || loading}>
                      Clear Completed
                    </button>
                  </div>
                </section>

                <section className="surface-card">
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
                          {todo.completed ? "Undo" : "Done"}
                        </button>

                        <div className="todo-copy">
                          {editingTodoId === todo.id ? (
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="task-edit-input"
                            />
                          ) : (
                            <p>{todo.text}</p>
                          )}

                          <small>
                            Created {new Date(todo.createdAt).toLocaleString()} {todo.completedAt ? `| Completed ${new Date(todo.completedAt).toLocaleString()}` : ""}
                          </small>
                        </div>

                        <div className="task-actions">
                          {editingTodoId === todo.id ? (
                            <>
                              <button type="button" className="ghost" onClick={() => handleSaveEdit(todo.id)}>
                                Save
                              </button>
                              <button type="button" className="ghost" onClick={handleCancelEdit}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button type="button" className="ghost" onClick={() => handleStartEdit(todo)}>
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            className="remove"
                            onClick={() => handleDelete(todo.id)}
                            aria-label="Delete task"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </section>
            }
          />

          <Route
            path="/analytics"
            element={
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
                        <div key={item.key} className="bar-col">
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
            }
          />

          <Route
            path="/settings"
            element={
              <section className="page-grid">
                <div className="surface-card page-title">
                  <p className="tag">Profile</p>
                  <h1>Settings</h1>
                  <p>Manage session identity and account context.</p>
                </div>

                <section className="surface-card settings-card">
                  <h3>Current UID</h3>
                  <p className="settings-uid">{uid}</p>
                  <div className="settings-actions">
                    <button type="button" className="ghost" onClick={handleLogout}>
                      Switch UID
                    </button>
                    <button type="button" className="remove" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </section>
              </section>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;