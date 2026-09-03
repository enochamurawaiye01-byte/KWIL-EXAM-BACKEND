/* ============================================
   ADMIN — CREATE / EDIT EXAM
   The course dropdown uses the real, ready
   GET /api/courses endpoint. Saving the exam itself
   is disabled because POST/PATCH /api/admin/exams
   haven't been built yet — see the pending notice.
   ============================================ */

auth.requireAdmin();

const examId = new URLSearchParams(location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("exams", examId ? "Edit exam" : "Create exam");
  loadCourseOptions();

  // --- Once POST/PATCH /api/admin/exams exist, remove the `disabled`
  // attribute on #exam-submit in the HTML and uncomment:
  // utils.$("#exam-form").addEventListener("submit", handleSubmit);
});

async function loadCourseOptions() {
  const select = utils.$("#courseId");
  try {
    const res = await api.get("/courses", { authAs: "admin" });
    const courses = res?.data || res?.courses || [];
    select.innerHTML =
      `<option value="" disabled selected>Select a course</option>` +
      courses
        .map((c) => `<option value="${utils.escapeHtml(c.id)}">${utils.escapeHtml(c.name || c.title)}</option>`)
        .join("");
  } catch (err) {
    select.innerHTML = `<option value="" disabled selected>Couldn't load courses</option>`;
  }
}

// async function handleSubmit(e) {
//   e.preventDefault();
//   const data = Object.fromEntries(new FormData(e.target).entries());
//   const submitBtn = document.getElementById("exam-submit");
//   utils.setButtonLoading(submitBtn, true, "Saving…");
//   try {
//     if (examId) {
//       await api.patch(`/admin/exams/${examId}`, data, { authAs: "admin" });
//     } else {
//       await api.post("/admin/exams", data, { authAs: "admin" });
//     }
//     notify.success("Exam saved.");
//     window.location.href = "exams.html";
//   } catch (err) {
//     notify.error(utils.safeErrorMessage(err));
//     utils.setButtonLoading(submitBtn, false);
//   }
// }
