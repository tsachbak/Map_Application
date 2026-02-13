import { API_BASE_URL } from "../config/apiConfig";

/**
 * GET request to the specified path.
 */
export async function get(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      `GET request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * POST request to the specified path with the provided data.
 */
export async function post(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data ?? {}),
  });

  if (!response.ok) {
    throw new Error(
      `POST request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/**
 * DELETE request to the specified path.
 */
export async function del(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `DELETE request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
