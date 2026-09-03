/* ============================================
   API CLIENT
   Every network call in the app goes through here.
   Handles: base URL, auth headers, JSON parsing,
   and turning failures into a predictable ApiError
   so screens never have to touch a raw fetch error.
   ============================================ */

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status; // null when the request never reached the server
    this.data = data || null;
  }
}

const api = (() => {
  /**
   * @param {"student"|"admin"|null} authAs - which stored token to attach.
   *        Pass null for endpoints that need no auth (register/login/courses).
   */
  function getToken(authAs) {
    if (authAs === "student") return localStorage.getItem(STORAGE_KEYS.studentToken);
    if (authAs === "admin") return localStorage.getItem(STORAGE_KEYS.adminToken);
    return null;
  }

  async function request(method, path, { body, authAs = null, signal } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken(authAs);
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });
    } catch (networkErr) {
      // fetch throws on network failure / server unreachable / CORS
      throw new ApiError(
        "Could not reach the server. Check your connection and try again.",
        null,
        null
      );
    }

    let payload = null;
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      // Session expired / invalid token — auth.js listens for this event
      // on protected pages and redirects to the right login screen.
      if (response.status === 401) {
        document.dispatchEvent(
          new CustomEvent("kwi:unauthorized", { detail: { authAs } })
        );
      }
      const message =
        (payload && (payload.message || payload.error)) ||
        `Request failed (${response.status}). Please try again.`;
      throw new ApiError(message, response.status, payload);
    }

    return payload;
  }

  return {
    get: (path, opts) => request("GET", path, opts),
    post: (path, body, opts = {}) => request("POST", path, { ...opts, body }),
    patch: (path, body, opts = {}) => request("PATCH", path, { ...opts, body }),
    delete: (path, opts) => request("DELETE", path, opts),
  };
})();
