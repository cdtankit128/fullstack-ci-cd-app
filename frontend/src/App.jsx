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
import PersonIcon from "@mui/icons-material/Person";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./services/api";
import studentsData from "./data/students.json";
import "./App.css";

const UID_REGEX = /^23[A-Z]{3}\d{5}$/;

function formatDayLabel(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function AppContent() {
  const navigate = useNavigate();
  const [uidInput, setUidInput] = useState("");
  const [uid, setUid] = useState(localStorage.getItem("todo_uid") || "");
  const [studentName, setStudentName] = useState(localStorage.getItem("todo_student_name") || "");
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const validateUID = (value) => UID_REGEX.test(value);

  const lookupStudentName = (uidValue) => {
    if (!uidValue || !validateUID(uidValue)) return "";
    return studentsData[uidValue] || "";
  };

  const formatUidInput = (rawValue) => {
    const uppercase = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!uppercase) {
      return "";
    }

    // Try to preserve any 23B** prefix the user typed
    const prefixMatch = uppercase.match(/^(23[A-Z]{0,3})/);
    if (prefixMatch && prefixMatch[1].length >= 4) {
      const prefix = prefixMatch[1].slice(0, 5);
      const digits = uppercase.slice(prefix.length).replace(/\D/g, "");
      return `${prefix}${digits}`.slice(0, 10);
    }

    // Default: let the user type freely
    return uppercase.slice(0, 10);
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
    // Live name lookup
    const name = lookupStudentName(formattedValue);
    setStudentName(name);
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
      const resolvedName = lookupStudentName(cleanUid);
      localStorage.setItem("todo_uid", cleanUid);
      localStorage.setItem("todo_student_name", resolvedName);
      setUid(cleanUid);
      setStudentName(resolvedName);
      setError(null);
      navigate("/");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("todo_uid");
    localStorage.removeItem("todo_student_name");
    setUid("");
    setUidInput("");
    setStudentName("");
    setTodos([]);
    setError(null);
    setEditingTodoId(null);
    setEditingText("");
    navigate("/");
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
      const data = await createTodo(uid, task, priority, dueDate);
      setTodos(data.todos || []);
      setNewTask("");
      setPriority("Medium");
      setDueDate(null);
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

  if (!uid) {
    const isUidValid = validateUID(uidInput);
    const previewName = lookupStudentName(uidInput);

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
              helperText={error || "Format: 23BCS12345 / 23BET12345"}
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

            {/* Live name preview */}
            {previewName && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: "12px",
                  background: "rgba(34, 197, 94, 0.12)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  animation: "fadeIn 0.3s ease",
                }}
              >
                <PersonIcon sx={{ color: "#22c55e", fontSize: "1.3rem" }} />
                <Typography variant="body2" sx={{ color: "#4ade80", fontWeight: 600 }}>
                  {previewName}
                </Typography>
              </Box>
            )}

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

  const appContext = {
    uid,
    studentName,
    loading,
    newTask,
    setNewTask,
    filter,
    setFilter,
    stats,
    visibleTodos,
    editingTodoId,
    editingText,
    setEditingText,
    consistencyData,
    maxDailyCompletions,
    progressPercent,
    consistencyStreak,
    weeklyCompleted,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    handleAddTask,
    handleToggle,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDelete,
    clearCompleted,
    handleLogout,
  };

  return (
    <Routes>
      <Route path="/" element={<Layout uid={uid} studentName={studentName} onLogout={handleLogout} appContext={appContext} error={error} />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;