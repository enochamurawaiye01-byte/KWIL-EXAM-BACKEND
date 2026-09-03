/* ============================================
   ADMIN — STUDENTS
   Planned endpoint: GET /api/admin/students — not built
   yet. Renders sample data only (already in the HTML).
   Once the endpoint exists, replace the static <tbody>
   rows with a fetch + render, following the pattern in
   js/admin/courses.js.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("students", "Students");
});
