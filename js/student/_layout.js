/* ============================================
   STUDENT LAYOUT — reusable top Navbar
   Not part of the original file list, added so the
   navbar isn't duplicated by hand across every
   student page. Each page needs:
     <header id="navbar-root"></header>
   and a call to renderStudentNavbar("<navKey>").
   ============================================ */

const STUDENT_NAV = [
  { key: "dashboard", label: "Dashboard", href: "../student/dashboard.html" },
  { key: "courses", label: "My Courses", href: "../student/courses.html" },
  { key: "exams", label: "Exams", href: "../student/exam-list.html" },
  { key: "transcript", label: "Transcript", href: "../student/transcript.html" },
];

function renderStudentNavbar(activeKey) {
  const root = document.getElementById("navbar-root");
  if (!root) return;
  const profile = auth.getStudentProfile();

  root.outerHTML = `
    <header class="navbar">
      <div class="container navbar__inner">
        <div class="cluster" style="gap: var(--space-6);">
          <a class="brand" href="/pages/student/dashboard.html"><span class="brand__mark">KWI</span> Exams</a>
          <nav class="cluster" style="gap: var(--space-5);">
            ${STUDENT_NAV.map(
              (item) => `
              <a class="link" style="font-size:var(--fs-sm); color:${item.key === activeKey ? "var(--color-primary)" : "var(--color-ink-muted)"}; font-weight:${item.key === activeKey ? 600 : 500};" href="${item.href}">
                ${utils.escapeHtml(item.label)}
              </a>`
            ).join("")}
          </nav>
        </div>
        <div class="navbar__user">
          <span class="navbar__avatar">${utils.escapeHtml(utils.initials(profile?.fullName || "S"))}</span>
          <span>${utils.escapeHtml(profile?.fullName || "Student")}</span>
          <button class="btn btn--ghost btn--sm" id="student-logout-btn">Log out</button>
        </div>
      </div>
    </header>`;

  document.getElementById("student-logout-btn").addEventListener("click", async () => {
    const ok = await confirmDialog({
      title: "Log out?",
      body: "You'll need your registration number and password to sign back in.",
      confirmText: "Log out",
      danger: true,
    });
    if (ok) auth.logoutStudent();
  });
}
