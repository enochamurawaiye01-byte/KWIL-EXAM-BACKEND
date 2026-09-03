/* ============================================
   ADMIN LAYOUT — reusable Sidebar + Topbar
   Not part of the original file list, added so the
   sidebar (spec §45 "Components to build reusably")
   isn't duplicated by hand across 14 HTML pages.
   Each admin page just needs:
     <aside id="sidebar-root"></aside>
     <header id="topbar-root"></header>
   and a call to renderAdminLayout("<navKey>", "<Page title>").
   ============================================ */

const ADMIN_NAV = [
  { key: "dashboard", label: "Dashboard", href: "/pages/admin/dashboard.html" },
  { key: "students", label: "Students", href: "/pages/admin/students.html" },
  { key: "courses", label: "Courses", href: "/pages/admin/courses.html" },
  { key: "exams", label: "Exams", href: "/pages/admin/exams.html" },
  { key: "results", label: "Results", href: "/pages/admin/results.html" },
  { key: "leaderboard", label: "Leaderboard", href: "/pages/admin/leaderboard.html" },
  { key: "transcripts", label: "Transcripts", href: "/pages/admin/transcripts.html" },
  { key: "reports", label: "Reports", href: "/pages/admin/reports.html" },
  { key: "settings", label: "Settings", href: "/pages/admin/settings.html" },
];

function renderAdminLayout(activeKey, pageTitle) {
  const sidebarRoot = document.getElementById("sidebar-root");
  const topbarRoot = document.getElementById("topbar-root");
  const profile = auth.getAdminProfile();

  if (sidebarRoot) {
    sidebarRoot.outerHTML = `
      <aside class="sidebar">
        <div class="brand"><span class="brand__mark">KWI</span> Admin</div>
        <nav class="sidebar__nav">
          ${ADMIN_NAV.map(
            (item) => `
            <a class="sidebar__link" href="${item.href}" ${item.key === activeKey ? 'aria-current="page"' : ""}>
              ${utils.escapeHtml(item.label)}
            </a>`
          ).join("")}
        </nav>
        <div class="sidebar__foot">
          <button class="btn btn--ghost btn--block" id="admin-logout-btn" style="color:#fff; justify-content:flex-start;">
            Log out
          </button>
        </div>
      </aside>`;
    document.getElementById("admin-logout-btn").addEventListener("click", async () => {
      const ok = await confirmDialog({
        title: "Log out?",
        body: "You'll need to sign in again to access the admin panel.",
        confirmText: "Log out",
        danger: true,
      });
      if (ok) auth.logoutAdmin();
    });
  }

  if (topbarRoot) {
    topbarRoot.outerHTML = `
      <header class="admin-topbar">
        <h1>${utils.escapeHtml(pageTitle)}</h1>
        <div class="navbar__user">
          <span>${utils.escapeHtml(profile?.fullName || profile?.email || "Admin")}</span>
          <span class="navbar__avatar">${utils.escapeHtml(utils.initials(profile?.fullName || "A"))}</span>
        </div>
      </header>`;
  }
}
