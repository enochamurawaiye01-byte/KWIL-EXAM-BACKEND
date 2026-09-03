/* ============================================
   ADMIN — TRANSCRIPTS
   Planned endpoints: GET /api/admin/transcripts and
   GET /api/admin/transcripts/:id/download — not built
   yet. Renders sample data only.
   ============================================ */

auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("transcripts", "Transcripts");
});
