/* ============================================
   AUTH
   Session storage + route guards.
   Student and admin sessions use separate storage
   keys (see config.js) so logging into one never
   touches the other.
   ============================================ */

const auth = {
  /* ---------- Student session ---------- */
  setStudentSession(token, profile) {
    localStorage.setItem(STORAGE_KEYS.studentToken, token);
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.studentProfile, JSON.stringify(profile));
    }
  },
  getStudentToken() {
    return localStorage.getItem(STORAGE_KEYS.studentToken);
  },
  getStudentProfile() {
    const raw = localStorage.getItem(STORAGE_KEYS.studentProfile);
    return raw ? JSON.parse(raw) : null;
  },
  clearStudentSession() {
    localStorage.removeItem(STORAGE_KEYS.studentToken);
    localStorage.removeItem(STORAGE_KEYS.studentProfile);
  },

  /* ---------- Admin session ---------- */
  setAdminSession(token, profile) {
    localStorage.setItem(STORAGE_KEYS.adminToken, token);
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.adminProfile, JSON.stringify(profile));
    }
  },
  getAdminToken() {
    return localStorage.getItem(STORAGE_KEYS.adminToken);
  },
  getAdminProfile() {
    const raw = localStorage.getItem(STORAGE_KEYS.adminProfile);
    return raw ? JSON.parse(raw) : null;
  },
  clearAdminSession() {
    localStorage.removeItem(STORAGE_KEYS.adminToken);
    localStorage.removeItem(STORAGE_KEYS.adminProfile);
  },

  /* ---------- Route guards ----------
     Call at the top of every protected page's script.
     Redirects immediately if there's no session. */
  requireStudent() {
    if (!auth.getStudentToken()) {
      window.location.href = "../student/login.html";
    }
  },
  requireAdmin() {
    if (!auth.getAdminToken()) {
      window.location.href = "../admin/login.html";
    }
  },

  logoutStudent() {
    auth.clearStudentSession();
    window.location.href = "../student/login.html";
  },
  logoutAdmin() {
    auth.clearAdminSession();
    window.location.href = "../admin/login.html";
  },
};

// A 401 from any API call means the token is dead — bounce to login
// rather than leaving the screen in a broken half-loaded state.
document.addEventListener("kwi:unauthorized", (e) => {
  if (e.detail.authAs === "admin") {
    auth.logoutAdmin();
  } else if (e.detail.authAs === "student") {
    auth.logoutStudent();
  }
});
