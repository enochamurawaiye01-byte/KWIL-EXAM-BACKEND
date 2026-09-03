/* ============================================
   ADMIN — RESULTS
   Planned endpoint: GET /api/admin/results — not built
   yet. Renders sample data only.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("results", "Results");
});
