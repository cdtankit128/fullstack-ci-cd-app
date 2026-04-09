const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function getTodos(uid) {
  return request(`/api/todos?uid=${encodeURIComponent(uid)}`);
}

export function createTodo(uid, text) {
  return request("/api/todos", {
    method: "POST",
    body: JSON.stringify({ uid, text }),
  });
}

export function updateTodo(uid, id, changes) {
  return request("/api/todos", {
    method: "PATCH",
    body: JSON.stringify({ uid, id, ...changes }),
  });
}

export function deleteTodo(uid, id) {
  return request("/api/todos", {
    method: "DELETE",
    body: JSON.stringify({ uid, id }),
  });
}
