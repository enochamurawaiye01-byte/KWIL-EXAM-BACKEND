auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("reports", "Reports");
  loadReports();
});

async function loadReports() {
  try {
    const res = await api.get("/admin/reports", { authAs: "admin" });
    const data = res?.data || {};
    renderCoursePerformance(data.performanceByCourse || []);
    renderExamSummary(data.examSummary || []);
    renderEnrollmentTrend(data.enrollmentTrend || []);
  } catch (err) {
    ["course-performance-region", "exam-summary-region", "enrollment-trend-region"].forEach((id) => {
      utils.$(`#${id}`).innerHTML = `<p class="text-muted">${utils.escapeHtml(utils.safeErrorMessage(err))}</p>`;
    });
  }
}

function renderCoursePerformance(items) {
  const region = utils.$("#course-performance-region");
  region.innerHTML = items.length
    ? `<div class="stack">${items.map((item) => `<div><strong>${utils.escapeHtml(item.course?.name || "—")}</strong><div class="text-muted">Average: ${item.averageScore}% · Pass rate: ${item.passRate}% · Attempts: ${item.attempts}</div></div>`).join("")}</div>`
    : `<p class="text-muted">No completed results yet.</p>`;
}

function renderExamSummary(items) {
  const region = utils.$("#exam-summary-region");
  region.innerHTML = items.length
    ? `<div class="stack">${items.map((item) => `<div><strong>${utils.escapeHtml(item.exam?.title || "—")}</strong><div class="text-muted">Completed: ${item.completed} · Pass: ${item.passed} · Fail: ${item.failed}</div></div>`).join("")}</div>`
    : `<p class="text-muted">No exams available.</p>`;
}

function renderEnrollmentTrend(items) {
  const region = utils.$("#enrollment-trend-region");
  region.innerHTML = items.length
    ? `<div class="stack">${items.map((item) => `<div><strong>${utils.escapeHtml(item.month)}</strong><div class="text-muted">${item.enrollments} enrollment${item.enrollments === 1 ? "" : "s"}</div></div>`).join("")}</div>`
    : `<p class="text-muted">No enrollment data yet.</p>`;
}
