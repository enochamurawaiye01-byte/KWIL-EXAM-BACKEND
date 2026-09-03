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
    notify.error(utils.safeErrorMessage(err));
  }
}
