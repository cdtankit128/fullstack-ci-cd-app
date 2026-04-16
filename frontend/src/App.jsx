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
import "./App.css";

const UID_REGEX = /^23[A-Z]{3,4}\d{4,5}$/;

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
  const [studentsData, setStudentsData] = useState({});
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

  useEffect(() => {
    // Load student data using fetch at runtime from our Supabase backend
    const loadStudentData = async () => {
      try {
        const response = await fetch("/api/students");
        if (response.ok) {
          const data = await response.json();
          setStudentsData(data || {});
        } else {
          console.warn("Failed to fetch students from API.");
        }
      } catch (err) {
        console.warn("Could not fetch student data.", err);
      }
    };
    loadStudentData();
  }, []);

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
      return `${prefix}${digits}`.slice(0, 11);
    }

    // Default: let the user type freely
    return uppercase.slice(0, 11);
  };

  const getUidError = (value) => {
    if (!value || validateUID(value)) {
      return "";
    }

    return "Invalid UID format. Must match 23 + letters + digits.";
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
      <div className="font-body text-on-surface min-h-screen flex flex-col items-center justify-between overflow-x-hidden relative" style={{ backgroundColor: "#0b1326", backgroundImage: "radial-gradient(at 0% 0%, rgba(74, 86, 226, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(190, 194, 255, 0.1) 0px, transparent 50%)" }}>
        
        <header className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center bg-transparent z-10 relative">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-headline font-bold text-lg tracking-tight text-[#bec2ff]">TaskSphere</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <span className="material-symbols-outlined text-[#bec2ff]/70 hover:text-white transition-colors cursor-pointer" data-icon="security" style={{fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>security</span>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center px-4 w-full relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="w-full max-w-md p-8 md:p-10 rounded-xl flex flex-col items-center gap-8 relative z-10" style={{ background: "rgba(45, 52, 73, 0.6)", backdropFilter: "blur(24px)", boxShadow: "0 20px 40px rgba(0, 4, 106, 0.2)", border: "1px solid rgba(143, 143, 160, 0.15)" }}>
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center glow-effect" style={{ background: "linear-gradient(135deg, #bec2ff 0%, #4a56e2 100%)", boxShadow: "0 0 25px rgba(190, 194, 255, 0.3)" }}>
                <span className="material-symbols-outlined text-on-primary-fixed text-4xl" data-icon="school" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <div className="bg-surface-bright px-3 py-1 rounded-full border border-outline-variant/20">
                <span className="font-label text-[10px] tracking-widest text-[#bec2ff] uppercase">SECURE LOGIN</span>
              </div>
              <div className="text-center">
                <h1 className="font-headline font-extrabold text-3xl tracking-tighter text-[#bec2ff] mb-1">TaskSphere</h1>
                <p className="font-body text-[#c6c5d7] text-sm">Enter your UID to continue</p>
              </div>
            </div>

            <form className="w-full flex flex-col gap-6" onSubmit={handleLogin}>
              <div className="flex flex-col gap-2">
                <label className="font-label text-xs tracking-wider text-[#c6c5d7] uppercase px-1" htmlFor="uid">University UID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[#8f8fa0] text-xl group-focus-within:text-[#bec2ff] transition-colors">badge</span>
                  </div>
                  <input 
                    className="w-full bg-[#2d3449] border-[#454654]/20 border text-[#dae2fd] pl-12 pr-4 py-4 rounded-lg focus:ring-2 focus:ring-[#bec2ff]/30 focus:border-[#bec2ff]/50 transition-all placeholder:text-[#8f8fa0]/50 font-label tracking-tight focus:outline-none" 
                    id="uid" 
                    placeholder="23BCS12345" 
                    type="text" 
                    value={uidInput}
                    onChange={handleUidChange}
                    maxLength={11}
                  />
                  {isUidValid && (
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#22c55e] text-xl">check_circle</span>
                    </div>
                  )}
                </div>
                <p className={`text-[10px] font-body px-1 ${error ? "text-[#ffb4ab]" : "text-[#8f8fa0]"}`}>{error || "Format: 23BCS12345 / 23BET12345"}</p>
              </div>
              
              {previewName && (
                <div className="p-3 rounded-lg flex items-center gap-3" style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                  <span className="material-symbols-outlined text-[#22c55e]">person</span>
                  <span className="text-sm font-body font-semibold text-[#4ade80]">{previewName}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={!isUidValid || loginLoading}
                className="w-full py-4 rounded-full font-headline font-bold text-[#00046a] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all glow-effect group cursor-pointer"
                style={{ background: "linear-gradient(135deg, #bec2ff 0%, #4a56e2 100%)", boxShadow: "0 0 25px rgba(190, 194, 255, 0.3)", opacity: (!isUidValid || loginLoading) ? 0.6 : 1 }}
              >
                {loginLoading ? <CircularProgress size={22} sx={{ color: "#000ba6" }} /> : "Continue"}
                {!loginLoading && <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </form>
          </div>
        </main>

        <footer className="w-full py-8 px-4 flex flex-col items-center gap-4 bg-transparent mt-auto z-10 relative">
          <div className="flex gap-6 items-center">
            <a className="font-label text-xs uppercase tracking-widest text-[#8f8fa0] hover:text-[#bec2ff] transition-colors" href="#">Privacy Policy</a>
            <a className="font-label text-xs uppercase tracking-widest text-[#8f8fa0] hover:text-[#bec2ff] transition-colors" href="#">Terms of Service</a>
            <a className="font-label text-xs uppercase tracking-widest text-[#8f8fa0] hover:text-[#bec2ff] transition-colors" href="#">Security Center</a>
          </div>
          <p className="font-label text-[10px] tracking-widest text-[#8f8fa0] uppercase opacity-60">© 2024 TaskSphere Academic Systems. All Rights Reserved.</p>
        </footer>

        <div className="fixed top-20 right-[-100px] w-[400px] h-[400px] opacity-20 pointer-events-none hidden lg:block z-0">
            <img className="w-full h-full object-cover rounded-full mix-blend-screen" alt="circuit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtVTLgFrQbDdyZXZQt-YKDI3aLw5c-q99Cx3QSuKMj_6bJSz4W0CSKTcfaUMNiMBr3nabCkfCFuiJ_4h3KOZS-4mX2YuYiHaJ0mfTrHQ7bAEraSSbUDQKK7IUxhOQ7yAtwoNQMw_2hPPbJHWxU1EBwKLYwbbkYgaplcfJEoaVHy8jF2O7kK1tkeFVfS5gsjTMmLOxkd5akeHNfjUyjABMfAqqOCAayZL-Y5N2FFYqeIJVtc8f5oh0TXhEODXg1fn6FB54--qmB-khR" />
        </div>
        <div className="fixed bottom-20 left-[-100px] w-[350px] h-[350px] opacity-20 pointer-events-none hidden lg:block z-0">
            <img className="w-full h-full object-cover rounded-full mix-blend-screen" alt="nebula" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEndzltbXB0WOT2Vpv_w4tCpMm_lLzZgR8mjIgHAnHjGvqKF-c3N9q3bzP6MfrXKWoTuFr7yEPPTpr5Q-g2FIesWmuUd1Vf4Z_tpQ0LGFLjPqjlaQFUZMZQefNRC6me-qJT23kJy1Oie0yZcKzFGfLQAFTd8G614m4IpBBscpYMR3jrrg7IzePjpH5SEoyb661jxgOQ_nvtQbK2ZBPq4yvZBveyEC_x_t_G5OLTHDzxTthD1JIZdFYq3gtY5nT0kIdAeVNXjhYqPqO" />
        </div>
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