auth.requireAdmin();

const studentId = new URLSearchParams(location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("students", "Student details");
  loadStudent();
});

async function loadStudent() {
  const region = utils.$("#student-details-region");
  if (!studentId) {
    region.innerHTML = '<div class="card state-block state-block--error"><h3>Student not found</h3></div>';
    return;
  }

  try {
    const res = await api.get(`/admin/students/${encodeURIComponent(studentId)}`, { authAs: "admin" });
    const student = res?.data;
    const courses = (student.enrollments || [])
      .map((enrollment) => enrollment.course?.name)
      .filter(Boolean)
      .join(", ");
    const isActive = student.user?.isActive !== false;
    region.innerHTML = `
      <div class="grid" style="grid-template-columns: 2fr 1fr;">
        <div class="card">
          <div class="card__header"><h3>${utils.escapeHtml(student.fullName)}</h3><span class="badge ${isActive ? "badge--success" : "badge--neutral"}">${isActive ? "Active" : "Inactive"}</span></div>
          <div class="grid" style="grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            <div><div class="text-faint" style="font-size:var(--fs-xs);">Registration number</div><div>${utils.escapeHtml(student.registrationNumber)}</div></div>
            <div><div class="text-faint" style="font-size:var(--fs-xs);">Phone</div><div>${utils.escapeHtml(student.phoneNumber || "—")}</div></div>
            <div><div class="text-faint" style="font-size:var(--fs-xs);">Course</div><div>${utils.escapeHtml(courses || "—")}</div></div>
            <div><div class="text-faint" style="font-size:var(--fs-xs);">Registered</div><div>${utils.formatDate(student.createdAt)}</div></div>
          </div>
        </div>
        <div class="card"><h4>Exam history</h4><p class="text-muted" style="font-size:var(--fs-sm); margin-top:var(--space-2);">Exam results are managed from the admin results section.</p></div>
      </div>`;
  } catch (err) {
    region.innerHTML = `<div class="card state-block state-block--error"><h3>Couldn't load student</h3><p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p></div>`;
  }
}
