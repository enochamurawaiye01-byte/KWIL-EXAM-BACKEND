/* ============================================
   ADMIN DASHBOARD
   Planned endpoint: GET /api/admin/dashboard — not
   built yet. We still attempt the real call (so this
   starts working the instant the backend ships it),
   but on failure we show the pending notice and leave
   every stat as "—" rather than inventing numbers.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("dashboard", "Dashboard");
  loadStats();
});

async function loadStats() {
  try {
    const res = await api.get("/admin/dashboard", { authAs: "admin" });
    const data = res?.data || res;
    utils.$("#stat-students").textContent = data.totalStudents ?? "—";
    utils.$("#stat-courses").textContent = data.totalCourses ?? "—";
    utils.$("#stat-active-exams").textContent = data.activeExams ?? "—";
    utils.$("#stat-completed-exams").textContent = data.completedExams ?? "—";
    utils.$("#stat-pass-rate").textContent =
      data.passRate !== undefined ? `${data.passRate}%` : "—";
  } catch (err) {
    // Endpoint not implemented yet (404) or any other failure — never fake numbers.
    utils.$("#pending-notice").style.display = "flex";
  }
}
