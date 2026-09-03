/* ============================================
   STUDENT REGISTRATION
   Loads the course list from GET /api/courses, then
   submits to POST /api/auth/student/register.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  loadCourses();
  wirePasswordToggles();
  utils.$("#register-form").addEventListener("submit", handleSubmit);
});

async function loadCourses() {
  const select = utils.$("#courseId");
  try {
    const res = await api.get("/courses");
    const courses = res?.data || res?.courses || [];
    if (!courses.length) {
      select.innerHTML = `<option value="" disabled selected>No courses available yet</option>`;
      return;
    }
    select.innerHTML =
      `<option value="" disabled selected>Select your course</option>` +
      courses
        .map(
          (c) => `<option value="${utils.escapeHtml(c.id)}">${utils.escapeHtml(c.name || c.title)}</option>`
        )
        .join("");
  } catch (err) {
    select.innerHTML = `<option value="" disabled selected>Couldn't load courses</option>`;
    notify.error(utils.safeErrorMessage(err));
  }
}

function wirePasswordToggles() {
  utils.$all("[data-toggle-for]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.toggleFor);
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
    });
  });
}

function setFieldError(fieldId, hasError) {
  const field = document.getElementById(`field-${fieldId}`);
  field.classList.toggle("field--invalid", hasError);
  const control = field.querySelector(".input, .select");
  control.classList.toggle("input--error", hasError && control.classList.contains("input"));
  control.classList.toggle("select--error", hasError && control.classList.contains("select"));
}

function validate(data) {
  let valid = true;
  const checks = {
    fullName: !utils.isEmpty(data.fullName),
    phoneNumber: utils.isValidPhone(data.phoneNumber),
    courseId: !utils.isEmpty(data.courseId),
    password: utils.isStrongPassword(data.password),
    confirmPassword: data.confirmPassword === data.password && !utils.isEmpty(data.confirmPassword),
  };
  for (const [field, ok] of Object.entries(checks)) {
    setFieldError(field, !ok);
    if (!ok) valid = false;
  }
  return valid;
}

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  if (!validate(data)) return;

  const submitBtn = document.getElementById("register-submit");
  utils.setButtonLoading(submitBtn, true, "Registering…");

  try {
    const res = await api.post("/auth/student/register", {
      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      courseId: data.courseId,
      password: data.password,
    });

    // The registration number is read from the API response, never
    // hardcoded (spec §"Registration Success Screen").
    const regNumber =
      res?.registrationNumber ||
      res?.data?.registrationNumber ||
      res?.data?.student?.registrationNumber ||
      res?.student?.registrationNumber;
    if (!regNumber) throw new Error("Registration number was not returned by the server.");
    sessionStorage.setItem("kwi_new_registration_number", regNumber);
    window.location.href = "registration-success.html";
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  } finally {
    utils.setButtonLoading(submitBtn, false);
  }
}
