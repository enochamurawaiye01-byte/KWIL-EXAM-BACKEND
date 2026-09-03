/* ============================================
   ADMIN — STUDENT DETAILS
   Planned endpoint: GET /api/admin/students/:id — not
   built yet. Renders sample data only.
   ============================================ */

auth.requireAdmin();

const studentId = new URLSearchParams(location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("students", "Student details");
});
