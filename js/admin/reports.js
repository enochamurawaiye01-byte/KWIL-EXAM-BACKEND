/* ============================================
   ADMIN — REPORTS
   Planned endpoint: GET /api/admin/reports — not built
   yet. Buttons are disabled until it exists.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("reports", "Reports");
});
