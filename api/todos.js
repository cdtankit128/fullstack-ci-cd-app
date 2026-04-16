const { createClient } = require('@supabase/supabase-js');

// Load environment variables (Vercel provides these automatically)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

function send(res, status, payload) {
  res.status(status).json(payload);
}

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

module.exports = async (req, res) => {
  const body = readBody(req);
  const uid = String(req.query.uid || body.uid || "").trim();

  if (!uid) {
    return send(res, 400, { error: "UID is required" });
  }

  // Note: DDL (`CREATE TABLE IF NOT EXISTS`) is not supported over REST. 
  // You must create the `todos` and `students` table via Supabase Dashboard.

  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('uid', uid)
        .order('created_at', { ascending: false });

      if (error) return send(res, 500, { error: error.message });
      
      const todos = data.map(t => ({
        id: t.id,
        uid: t.uid,
        text: t.text,
        completed: t.completed,
        priority: t.priority,
        dueDate: t.due_date,
        createdAt: t.created_at,
        completedAt: t.completed_at
      }));

      return send(res, 200, { uid, todos });
    }

    if (req.method === "POST") {
      const text = String(body.text || "").trim();
      if (!text) return send(res, 400, { error: "Task text is required" });

      const nextTodo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        uid,
        text,
        completed: false,
        priority: body.priority || "Medium",
        due_date: body.dueDate || null,
        created_at: new Date().toISOString()
      };

      const { error: insertErr } = await supabase.from('todos').insert([nextTodo]);
      if (insertErr) return send(res, 500, { error: insertErr.message });

      // fetch updated list
      const { data: allTodos } = await supabase.from('todos').select('*').eq('uid', uid).order('created_at', { ascending: false });
      const todosList = allTodos.map(t => ({
        id: t.id, uid: t.uid, text: t.text, completed: t.completed, priority: t.priority,
        dueDate: t.due_date, createdAt: t.created_at, completedAt: t.completed_at
      }));

      return send(res, 201, { uid, todo: nextTodo, todos: todosList });
    }

    if (req.method === "PATCH") {
      const id = String(body.id || "").trim();
      if (!id) return send(res, 400, { error: "Task id is required" });

      const hasCompleted = typeof body.completed === "boolean";
      const hasText = Object.prototype.hasOwnProperty.call(body, "text");
      const hasPriority = Object.prototype.hasOwnProperty.call(body, "priority");
      const hasDueDate = Object.prototype.hasOwnProperty.call(body, "dueDate");
      
      const updates = {};
      if (hasCompleted) {
        updates.completed = body.completed;
        updates.completed_at = body.completed ? new Date().toISOString() : null;
      }
      if (hasText) updates.text = String(body.text || "").trim();
      if (hasPriority) updates.priority = body.priority;
      if (hasDueDate) updates.due_date = body.dueDate;

      if (Object.keys(updates).length === 0) return send(res, 400, { error: "No valid updates" });

      const { error: updateErr } = await supabase.from('todos').update(updates).eq('id', id).eq('uid', uid);
      if (updateErr) return send(res, 500, { error: updateErr.message });

      const { data: allTodos } = await supabase.from('todos').select('*').eq('uid', uid).order('created_at', { ascending: false });
      const todosList = allTodos.map(t => ({
        id: t.id, uid: t.uid, text: t.text, completed: t.completed, priority: t.priority,
        dueDate: t.due_date, createdAt: t.created_at, completedAt: t.completed_at
      }));

      return send(res, 200, { uid, todos: todosList });
    }

    if (req.method === "DELETE") {
      const id = String(body.id || "").trim();
      if (!id) return send(res, 400, { error: "Task id is required" });

      const { error: delErr } = await supabase.from('todos').delete().eq('id', id).eq('uid', uid);
      if (delErr) return send(res, 500, { error: delErr.message });

      const { data: allTodos } = await supabase.from('todos').select('*').eq('uid', uid).order('created_at', { ascending: false });
      const todosList = allTodos.map(t => ({
        id: t.id, uid: t.uid, text: t.text, completed: t.completed, priority: t.priority,
        dueDate: t.due_date, createdAt: t.created_at, completedAt: t.completed_at
      }));

      return send(res, 200, { uid, todos: todosList });
    }

  } catch (err) {
    console.error('Database Error:', err);
    return send(res, 500, { error: "API Error: " + err.message });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return send(res, 405, { error: "Method not allowed" });
};
