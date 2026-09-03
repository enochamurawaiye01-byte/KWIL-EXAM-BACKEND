/* ============================================
   ADMIN — SETTINGS
   No profile/password endpoint exists yet. Layout only.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("settings", "Settings");
});
