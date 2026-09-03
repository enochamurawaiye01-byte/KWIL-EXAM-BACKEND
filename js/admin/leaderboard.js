/* ============================================
   ADMIN — LEADERBOARD
   Planned endpoint: GET /api/admin/leaderboard — not
   built yet. Renders sample data only.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("leaderboard", "Leaderboard");
});
