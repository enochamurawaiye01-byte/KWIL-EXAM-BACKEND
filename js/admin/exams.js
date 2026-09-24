auth.requireAdmin();

let allExams = [];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("exams", "Exam management");
  utils.$("#search-input").addEventListener("input", utils.debounce(applyFilters, 200));
  utils.$("#status-filter").addEventListener("change", applyFilters);
  loadExams();
});

async function loadExams() {
  const region = utils.$("#exams-region");
  try {
    const res = await api.get("/exams", { authAs: "admin" });
    allExams = res?.data || [];
    applyFilters();
  } catch (err) {
    region.innerHTML = `<div class="card state-block state-block--error"><h3>Couldn't load exams</h3><p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p><button class="btn btn--secondary" onclick="location.reload()">Retry</button></div>`;
  }
}

function applyFilters() {
  const query = utils.$("#search-input").value.trim().toLowerCase();
  const status = utils.$("#status-filter").value;
  const filtered = allExams.filter((exam) => {
    const searchable = [exam.title, exam.description, exam.course?.name, exam.course?.code].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) && (!status || exam.status === status);
  });
  renderExams(filtered);
}

function renderExams(exams) {
  const region = utils.$("#exams-region");
  if (!exams.length) {
    region.innerHTML = `<div class="card state-block"><h3>No exams found</h3><p>Try changing your search or filter.</p></div>`;
    return;
  }

  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Exam</th><th>Course</th><th>Duration</th><th>Questions</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${exams.map((exam) => `
            <tr data-id="${utils.escapeHtml(exam.id)}">
              <td>${utils.escapeHtml(exam.title)}</td>
              <td>${utils.escapeHtml(exam.course?.name || "—")}</td>
              <td>${utils.formatDuration(exam.duration)}</td>
              <td>${exam._count?.questions ?? 0}</td>
              <td><span class="status-dot status-dot--${String(exam.status || "").toLowerCase()}"></span>${utils.escapeHtml(exam.status || "—")}</td>
              <td class="row-actions">
                <a class="btn btn--secondary btn--sm" href="exam-form.html?id=${encodeURIComponent(exam.id)}">Edit</a>
                <a class="btn btn--secondary btn--sm" href="questions.html?examId=${encodeURIComponent(exam.id)}">Questions</a>
                ${exam.status === "DRAFT" ? `<button class="btn btn--primary btn--sm" data-action="publish">Publish</button>` : ""}
                ${exam.status === "PUBLISHED" ? `<button class="btn btn--secondary btn--sm" data-action="close">Close</button>` : ""}
                ${exam._count?.sessions === 0 ? `<button class="btn btn--danger btn--sm" data-action="delete">Delete</button>` : ""}
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;

  utils.$all('[data-action="publish"], [data-action="close"], [data-action="delete"]', region)
    .forEach((button) => button.addEventListener("click", () => handleAction(button)));
}

async function handleAction(button) {
  const row = button.closest("tr");
  const examId = row.dataset.id;
  const action = button.dataset.action;
  if (action === "delete" && !(await confirmDialog({ title: "Delete this exam?", body: "This action cannot be undone.", confirmText: "Delete", danger: true }))) return;

  utils.setButtonLoading(button, true, `${action[0].toUpperCase()}${action.slice(1)}...`);
  try {
    if (action === "delete") await api.delete(`/exams/${encodeURIComponent(examId)}`, { authAs: "admin" });
    else await api.patch(`/exams/${encodeURIComponent(examId)}/${action}`, {}, { authAs: "admin" });
    const actionLabel = action === "delete" ? "deleted" : action === "close" ? "closed" : "published";
    notify.success(`Exam ${actionLabel} successfully.`);
    await loadExams();
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(button, false);
  }
}
