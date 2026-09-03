auth.requireAdmin();

let allResults = [];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("results", "Results");
  wireFilters();
  loadResults();
});

function wireFilters() {
  ["#search-input", "#course-filter", "#exam-filter", "#grade-filter", "#status-filter"].forEach((selector) => {
    utils.$(selector).addEventListener("input", applyFilters);
    utils.$(selector).addEventListener("change", applyFilters);
  });
}

async function loadResults() {
  const region = utils.$("#results-region");
  try {
    const res = await api.get("/admin/results", { authAs: "admin" });
    allResults = res?.data || [];
    populateFilters();
    applyFilters();
  } catch (err) {
    region.innerHTML = `
      <div class="card state-block state-block--error">
        <h3>Couldn't load results</h3>
        <p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p>
        <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
      </div>`;
  }
}

function populateFilters() {
  const courses = new Map();
  const exams = new Map();
  allResults.forEach((result) => {
    if (result.exam?.course?.id) courses.set(result.exam.course.id, result.exam.course.name);
    if (result.exam?.id) exams.set(result.exam.id, result.exam.title);
  });
  setFilterOptions("#course-filter", "Filter by course", courses);
  setFilterOptions("#exam-filter", "Filter by exam", exams);
}

function setFilterOptions(selector, placeholder, options) {
  const select = utils.$(selector);
  const selected = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>` +
    [...options].map(([value, label]) => `<option value="${utils.escapeHtml(value)}">${utils.escapeHtml(label)}</option>`).join("");
  if ([...options].some(([value]) => value === selected)) select.value = selected;
}

function applyFilters() {
  const query = utils.$("#search-input").value.trim().toLowerCase();
  const courseId = utils.$("#course-filter").value;
  const examId = utils.$("#exam-filter").value;
  const grade = utils.$("#grade-filter").value;
  const status = utils.$("#status-filter").value;
  const filtered = allResults.filter((result) => {
    const searchable = [result.student?.fullName, result.student?.registrationNumber, result.exam?.title].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) &&
      (!courseId || result.exam?.course?.id === courseId) &&
      (!examId || result.exam?.id === examId) &&
      (!grade || result.grade === grade) &&
      (!status || result.status === status);
  });
  renderResults(filtered);
}

function renderResults(results) {
  const region = utils.$("#results-region");
  if (!results.length) {
    region.innerHTML = `<div class="card state-block"><h3>No results found</h3><p>Try changing your search or filters.</p></div>`;
    return;
  }
  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Student</th><th>Reg. No.</th><th>Course</th><th>Exam</th><th>Score</th><th>%</th><th>Grade</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          ${results.map((result) => `
            <tr>
              <td>${utils.escapeHtml(result.student?.fullName || "—")}</td>
              <td>${utils.escapeHtml(result.student?.registrationNumber || "—")}</td>
              <td>${utils.escapeHtml(result.exam?.course?.name || "—")}</td>
              <td>${utils.escapeHtml(result.exam?.title || "—")}</td>
              <td>${utils.escapeHtml(`${result.score ?? "—"}/${result.totalMarks ?? result.exam?.totalMarks ?? "—"}`)}</td>
              <td>${result.percentage ?? "—"}%</td>
              <td>${utils.escapeHtml(result.grade || "—")}</td>
              <td><span class="badge ${result.status === "PASS" ? "badge--success" : "badge--danger"}">${utils.escapeHtml(result.status || "—")}</span></td>
              <td>${utils.formatDate(result.submittedAt)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}
