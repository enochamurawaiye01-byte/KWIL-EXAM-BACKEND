/* ============================================
   ADMIN — COURSE MANAGEMENT
   Fully wired: GET/POST/PATCH/DELETE /api/courses are
   all live per the endpoint table, so this page does
   real create/edit/activate/deactivate/delete — no
   sample data, no pending notice.
   ============================================ */

auth.requireAdmin();

let allCourses = [];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("courses", "Courses");
  loadCourses();
  utils.$("#search-input").addEventListener("input", utils.debounce(applyFilter, 200));
});

async function loadCourses() {
  const region = utils.$("#courses-region");
  try {
    const res = await api.get("/courses", { authAs: "admin" });
    allCourses = res?.data || res?.courses || [];
    applyFilter();
  } catch (err) {
    region.innerHTML = `
      <div class="card state-block state-block--error">
        <h3>Couldn't load courses</h3>
        <p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p>
        <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
      </div>`;
  }
}

function applyFilter() {
  const q = utils.$("#search-input").value.trim().toLowerCase();
  const filtered = q
    ? allCourses.filter((c) => (c.name || c.title || "").toLowerCase().includes(q))
    : allCourses;
  renderTable(filtered);
}

function renderTable(courses) {
  const region = utils.$("#courses-region");

  if (!courses.length) {
    region.innerHTML = `
      <div class="card state-block">
        <h3>No courses found</h3>
        <p>Try a different search, or create a new course.</p>
      </div>`;
    return;
  }

  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Course</th><th>Code</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${courses
            .map(
              (c) => `
            <tr data-id="${utils.escapeHtml(c.id)}">
              <td>${utils.escapeHtml(c.name || c.title)}</td>
              <td>${utils.escapeHtml(c.code || "—")}</td>
              <td>
                ${
                  c.isActive || c.status === "ACTIVE"
                    ? '<span class="badge badge--success">Active</span>'
                    : '<span class="badge badge--neutral">Inactive</span>'
                }
              </td>
              <td class="row-actions">
                <a class="btn btn--secondary btn--sm" href="course-form.html?id=${utils.escapeHtml(c.id)}">Edit</a>
                <button class="btn btn--secondary btn--sm" data-action="toggle" data-active="${c.isActive || c.status === "ACTIVE"}">
                  ${c.isActive || c.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
                <button class="btn btn--danger btn--sm" data-action="delete">Delete</button>
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>`;

  utils.$all('[data-action="toggle"]', region).forEach((btn) =>
    btn.addEventListener("click", (e) => handleToggle(e, btn))
  );
  utils.$all('[data-action="delete"]', region).forEach((btn) =>
    btn.addEventListener("click", (e) => handleDelete(e, btn))
  );
}

async function handleToggle(e, btn) {
  const row = btn.closest("tr");
  const id = row.dataset.id;
  const isActive = btn.dataset.active === "true";
  utils.setButtonLoading(btn, true);
  try {
    await api.patch(`/courses/${id}/${isActive ? "deactivate" : "activate"}`, {}, { authAs: "admin" });
    notify.success(`Course ${isActive ? "deactivated" : "activated"}.`);
    loadCourses();
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(btn, false);
  }
}

async function handleDelete(e, btn) {
  const row = btn.closest("tr");
  const id = row.dataset.id;
  const courseName = row.children[0].textContent;
  const ok = await confirmDialog({
    title: "Delete this course?",
    body: `"${courseName}" will be permanently removed. This can't be undone.`,
    confirmText: "Delete",
    danger: true,
  });
  if (!ok) return;

  utils.setButtonLoading(btn, true);
  try {
    await api.delete(`/courses/${id}`, { authAs: "admin" });
    notify.success("Course deleted.");
    loadCourses();
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(btn, false);
  }
}
