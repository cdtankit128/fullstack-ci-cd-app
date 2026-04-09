const store = globalThis.__todoStore || new Map();
globalThis.__todoStore = store;

function send(res, status, payload) {
  res.status(status).json(payload);
}

function readBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body;
}

function ensureUser(uid) {
  const key = String(uid || "").trim();
  if (!key) {
    return null;
  }

  if (!store.has(key)) {
    store.set(key, []);
  }

  return key;
}

module.exports = (req, res) => {
  const body = readBody(req);
  const uid = ensureUser(req.query.uid || body.uid);

  if (!uid) {
    return send(res, 400, { error: "UID is required" });
  }

  if (req.method === "GET") {
    return send(res, 200, { uid, todos: store.get(uid) });
  }

  if (req.method === "POST") {
    const text = String(body.text || "").trim();
    if (!text) {
      return send(res, 400, { error: "Task text is required" });
    }

    const nextTodo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const todos = store.get(uid);
    todos.unshift(nextTodo);
    return send(res, 201, { uid, todo: nextTodo, todos });
  }

  if (req.method === "PATCH") {
    const id = String(body.id || "").trim();
    if (!id) {
      return send(res, 400, { error: "Task id is required" });
    }

    const todos = store.get(uid);
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      return send(res, 404, { error: "Task not found" });
    }

    const isCompleted = Boolean(body.completed);
    const updated = {
      ...todos[idx],
      completed: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : null,
    };

    todos[idx] = updated;
    return send(res, 200, { uid, todo: updated, todos });
  }

  if (req.method === "DELETE") {
    const id = String(body.id || "").trim();
    if (!id) {
      return send(res, 400, { error: "Task id is required" });
    }

    const todos = store.get(uid);
    const nextTodos = todos.filter((t) => t.id !== id);
    store.set(uid, nextTodos);
    return send(res, 200, { uid, todos: nextTodos });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return send(res, 405, { error: "Method not allowed" });
};
