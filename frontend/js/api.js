// ============================================================
// API Client - HTTP interface to backend REST API
// ============================================================

// Configurable base URL for the backend API
const BASE_URL = localStorage.getItem('ft_api_url') || 'http://localhost:8080/api';

// Default headers for JSON requests
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Generic fetch wrapper with error handling.
 * Returns parsed JSON on success, null on failure.
 */
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { ...HEADERS },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, options);

    if (!response.ok) {
      console.warn(`API ${method} ${path} returned ${response.status}`);
      return null;
    }

    // Handle 204 No Content (e.g., delete)
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.warn(`API ${method} ${path} failed:`, error.message);
    return null;
  }
}

/**
 * Fetch all tasks from the backend.
 * @returns {Promise<Array|null>}
 */
export async function getTasks() {
  return await request('GET', '/tasks');
}

/**
 * Fetch a single task by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTask(id) {
  return await request('GET', `/tasks/${id}`);
}

/**
 * Create a new task.
 * @param {Object} data - { title, description, priority, status, dueDate }
 * @returns {Promise<Object|null>} - The created task or null
 */
export async function createTask(data) {
  return await request('POST', '/tasks', data);
}

/**
 * Update an existing task.
 * @param {string} id
 * @param {Object} data - Fields to update
 * @returns {Promise<Object|null>}
 */
export async function updateTask(id, data) {
  return await request('PUT', `/tasks/${id}`, data);
}

/**
 * Delete a task by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function deleteTask(id) {
  return await request('DELETE', `/tasks/${id}`);
}

/**
 * Check if the API is reachable.
 * @returns {Promise<boolean>}
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { BASE_URL };
