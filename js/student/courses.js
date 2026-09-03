/* ============================================
   STUDENT COURSES
   Reuses GET /api/students/me (which returns each
   student's enrollments) rather than GET /api/courses,
   which would list every course in the system, not just
   the student's own.
   ============================================ */

auth.requireStudent();

document.addEventListener("DOMContentLoaded", () => {
  renderStudentNavbar("courses");
  loadCourses();
});

async function loadCourses() {
  const region = utils.$("#courses-region");
  try {
    const res = await api.get("/students/me", { authAs: "student" });
    const student = res?.data || res?.student || res;
    const list = (student.courses || student.enrollments || []).map((c) => c.course || c);

    if (!list.length) {
      region.innerHTML = `
        <div class="card state-block">
          <h3>No courses yet</h3>
          <p>You're not enrolled in any course at the moment.</p>
        </div>`;
      return;
    }

    region.innerHTML = `
      <div class="course-grid">
        ${list
          .map(
            (c) => `
          <div class="card">
            <span class="badge badge--info course-card__tag">${utils.escapeHtml(c.code || "COURSE")}</span>
            <h4 class="course-card__title">${utils.escapeHtml(c.name || c.title)}</h4>
            <p style="font-size: var(--fs-sm);">${utils.escapeHtml(c.description || "No description provided.")}</p>
          </div>`
          )
          .join("")}
      </div>`;
  } catch (err) {
    region.innerHTML = `
      <div class="card state-block state-block--error">
        <h3>Couldn't load your courses</h3>
        <p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p>
        <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
      </div>`;
  }
}
