const API_URL = "http://localhost:3030";

async function fetchTasks(JWT) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${JWT}`,
    },
  });
  return response.json();
}

async function addTask(taskText, JWT) {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JWT}`,
    },
    body: JSON.stringify({ text: taskText }),
  });
  return response.json();
}

async function deleteTask(taskId, JWT) {
  await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${JWT}`,
    },
  });
}

async function updateTask(task, JWT) {
  await fetch(`${API_URL}/tasks/${task._id}`, { // Nutze `_id` statt `id`
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${JWT}`,
    },
    body: JSON.stringify({ text: task.text }),
  });
}


async function loginUser(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    return response.json(); // gibt das JWT zurück
  } else {
    throw new Error("Login fehlgeschlagen");
  }
}

async function registerUser(username, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.ok) {
    return response.json(); // gibt das JWT zurück
  } else {
    throw new Error("Registrierung fehlgeschlagen");
  }
}

export { fetchTasks, addTask, deleteTask, updateTask, loginUser, registerUser };
