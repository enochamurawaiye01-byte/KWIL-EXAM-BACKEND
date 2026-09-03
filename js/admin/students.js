auth.requireAdmin();
let allStudents = [];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("students", "Students");
  loadStudents();
  utils.$("#search-input").addEventListener("input", utils.debounce(applyFilter, 200));
});

async function loadStudents() {
  const region = utils.$("#students-region");
  try {
    const res = await api.get("/admin/students", { authAs: "admin" });
    allStudents = res?.data || [];
    applyFilter();
  } catch (err) {
    region.innerHTML = `
      <div class="card state-block state-block--error">
        <h3>Couldn't load students</h3>
        <p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p>
        <button class="btn btn--secondary" onclick="location.reload()">Retry</button>
      </div>`;
  }
}

function applyFilter() {
  const query = utils.$("#search-input").value.trim().toLowerCase();
  const filtered = query
    ? allStudents.filter((student) => {
        const courseNames = (student.enrollments || [])
          .map((enrollment) => enrollment.course?.name || "")
          .join(" ");
        return [student.fullName, student.registrationNumber, student.phoneNumber, courseNames]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
    : allStudents;

  renderTable(filtered);
}

function renderTable(students) {
  const region = utils.$("#students-region");
  if (!students.length) {
    region.innerHTML = `
      <div class="card state-block">
        <h3>No students found</h3>
        <p>Try a different search.</p>
      </div>`;
    return;
  }

  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Name</th><th>Registration No.</th><th>Course</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${students.map((student) => {
            const courses = (student.enrollments || [])
              .map((enrollment) => enrollment.course?.name)
              .filter(Boolean)
              .join(", ");
            const isActive = student.user?.isActive !== false;
            return `
              <tr>
                <td>${utils.escapeHtml(student.fullName)}</td>
                <td>${utils.escapeHtml(student.registrationNumber)}</td>
                <td>${utils.escapeHtml(courses || "—")}</td>
                <td>${utils.escapeHtml(student.phoneNumber || "—")}</td>
                <td><span class="badge ${isActive ? "badge--success" : "badge--neutral"}">${isActive ? "Active" : "Inactive"}</span></td>
                <td><a class="btn btn--secondary btn--sm" href="student-details.html?id=${encodeURIComponent(student.id)}">View</a></td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
}
