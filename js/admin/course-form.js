/* ============================================
   ADMIN — CREATE / EDIT COURSE
   Same form handles both, based on ?id= in the URL:
     no id   → POST /api/courses
     with id → GET /api/courses/:id to prefill, then
               PATCH /api/courses/:id to save
   ============================================ */

auth.requireAdmin();

const courseId = new URLSearchParams(location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("courses", courseId ? "Edit course" : "Create course");
  if (courseId) loadExisting();
  utils.$("#course-form").addEventListener("submit", handleSubmit);
});

async function loadExisting() {
  try {
    const res = await api.get(`/courses/${courseId}`, { authAs: "admin" });
    const course = res?.data || res;
    utils.$("#name").value = course.name || course.title || "";
    utils.$("#code").value = course.code || "";
    utils.$("#description").value = course.description || "";
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  if (utils.isEmpty(data.name)) {
    document.getElementById("field-name").classList.add("field--invalid");
    return;
  }
  document.getElementById("field-name").classList.remove("field--invalid");

  const submitBtn = document.getElementById("course-submit");
  utils.setButtonLoading(submitBtn, true, "Saving…");

  const payload = {
    name: data.name.trim(),
    code: data.code.trim() || undefined,
    description: data.description.trim() || undefined,
  };

  try {
    if (courseId) {
      await api.patch(`/courses/${courseId}`, payload, { authAs: "admin" });
      notify.success("Course updated.");
    } else {
      await api.post("/courses", payload, { authAs: "admin" });
      notify.success("Course created.");
    }
    window.location.href = "courses.html";
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(submitBtn, false);
  }
}
