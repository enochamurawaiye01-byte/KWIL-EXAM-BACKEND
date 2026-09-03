/* ============================================
   STUDENT DASHBOARD
   GET /api/students/me (Bearer studentToken) →
   welcome card + assigned courses.
   ============================================ */

auth.requireStudent();

document.addEventListener("DOMContentLoaded", () => {
  renderStudentNavbar("dashboard");
  loadProfile();
});

async function loadProfile() {
  try {
    const res = await api.get("/students/me", { authAs: "student" });
    const student = res?.data || res?.student || res;
    auth.setStudentSession(auth.getStudentToken(), student); // keep cached profile fresh
    renderWelcome(student);
    renderCourses(student.courses || student.enrollments || []);
  } catch (err) {
    utils.$("#welcome-card").innerHTML = `<p style="color:#fff;">${utils.escapeHtml(utils.safeErrorMessage(err))}</p>`;
    utils.$("#courses-region").innerHTML = errorState();
  }
}

function renderWelcome(student) {
  const card = utils.$("#welcome-card");
  card.innerHTML = `
    <div class="welcome-card__name">Welcome, ${utils.escapeHtml(student.fullName)}</div>
    <div>
      <div class="welcome-card__meta-label">Registration number</div>
      <div class="welcome-card__meta-value">${utils.escapeHtml(student.registrationNumber)}</div>
    </div>
    <div>
      <div class="welcome-card__meta-label">Phone</div>
      <div class="welcome-card__meta-value">${utils.escapeHtml(student.phoneNumber || "—")}</div>
    </div>
    <div>
      <div class="welcome-card__meta-label">Status</div>
      <div class="welcome-card__meta-value">${utils.escapeHtml(student.status || "Active")}</div>
    </div>`;
}

function renderCourses(courses) {
  const region = utils.$("#courses-region");
  const list = (courses || []).map((c) => c.course || c); // handle enrollment-wrapped shape

  if (!list.length) {
    region.innerHTML = `
      <div class="card state-block">
        <h3>No courses assigned yet</h3>
        <p>Once you're enrolled in a course, it will appear here.</p>
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
}

function errorState() {
  return `
    <div class="card state-block state-block--error">
      <h3>Couldn't load your courses</h3>
      <p>Please refresh the page to try again.</p>
      <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
    </div>`;
}
