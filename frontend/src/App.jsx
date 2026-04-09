import { useEffect, useMemo, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./services/api";
import "./App.css";

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

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanUid = uidInput.trim();
    if (!cleanUid) {
      setError("Please enter your UID.");
      return;
    }

    localStorage.setItem("todo_uid", cleanUid);
    setUid(cleanUid);
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
    const completed = todos.filter((todo) => todo.completed).map((todo) => todo.id);
    for (const id of completed) {
      await handleDelete(id);
    }
  };

  return (
    <div className="dashboard-layout">
      <main className="dashboard-shell">
        <section className="hero-panel">
          <p className="tag">UID Workspace</p>
          <h1>TO-DO CONTROL CENTER</h1>
          <p>
            Plan your day using a clean workspace connected to your full stack API.
            Sign in with your UID to load your personalized task stream.
          </p>
          {!uid ? (
            <form className="uid-form" onSubmit={handleLogin}>
              <label htmlFor="uid">ENTER YOUR UID</label>
              <input
                id="uid"
                type="text"
                value={uidInput}
                onChange={(e) => setUidInput(e.target.value)}
                placeholder="example: uid-2026-a01"
              />
              <button type="submit">Open Dashboard</button>
            </form>
          ) : (
            <div className="session-row">
              <p>Signed in as <span>{uid}</span></p>
              <button className="ghost" onClick={handleLogout}>Switch UID</button>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </section>

        <section className="todo-panel">
          <div className="todo-topbar">
            <h2>Dashboard</h2>
            <div className="stats">
              <div><strong>{stats.total}</strong><span>Total</span></div>
              <div><strong>{stats.active}</strong><span>Active</span></div>
              <div><strong>{stats.completed}</strong><span>Done</span></div>
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
            <button type="submit" disabled={!uid || loading}>Add</button>
          </form>

          <div className="filter-row">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>Active</button>
            <button className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>Completed</button>
            <button className="ghost" onClick={clearCompleted} disabled={!stats.completed}>Clear Completed</button>
          </div>

          <div className="todo-list">
            {uid && visibleTodos.length === 0 && <p className="empty">No tasks yet. Add your first task.</p>}
            {!uid && <p className="empty">Log in with UID to start managing tasks.</p>}
            {visibleTodos.map((todo) => (
              <article key={todo.id} className={todo.completed ? "todo-item done" : "todo-item"}>
                <button className="tick" onClick={() => handleToggle(todo)} aria-label="Toggle complete">
                  {todo.completed ? "Done" : "Todo"}
                </button>
                <p>{todo.text}</p>
                <button className="remove" onClick={() => handleDelete(todo.id)} aria-label="Delete task">Delete</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
