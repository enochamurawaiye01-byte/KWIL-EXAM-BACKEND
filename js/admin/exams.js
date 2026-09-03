/* ============================================
   ADMIN — EXAMS
   Planned endpoints: GET/POST /api/admin/exams — not
   built yet. Renders sample data only. Once ready,
   follow the same fetch/render/action pattern used in
   js/admin/courses.js (that page is fully wired and is
   the best reference for this one).
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("exams", "Exam management");
});
