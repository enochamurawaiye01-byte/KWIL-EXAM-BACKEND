/* ============================================
   STUDENT LOGIN
   POST /api/auth/student/login → store JWT under the
   student-only storage key, then go to the dashboard.
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // If already logged in, skip straight to the dashboard.
  if (auth.getStudentToken()) {
    window.location.href = "dashboard.html";
    return;
  }
  wirePasswordToggle();
  utils.$("#login-form").addEventListener("submit", handleSubmit);
});

function wirePasswordToggle() {
  const btn = utils.$('[data-toggle-for="password"]');
  btn.addEventListener("click", () => {
    const input = document.getElementById("password");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    btn.textContent = showing ? "Show" : "Hide";
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  let valid = true;
  if (utils.isEmpty(data.registrationNumber)) {
    document.getElementById("field-registrationNumber").classList.add("field--invalid");
    valid = false;
  } else {
    document.getElementById("field-registrationNumber").classList.remove("field--invalid");
  }
  if (utils.isEmpty(data.password)) {
    document.getElementById("field-password").classList.add("field--invalid");
    valid = false;
  } else {
    document.getElementById("field-password").classList.remove("field--invalid");
  }
  if (!valid) return;

  const submitBtn = document.getElementById("login-submit");
  utils.setButtonLoading(submitBtn, true, "Logging in…");

  try {
    const res = await api.post("/auth/student/login", {
      registrationNumber: data.registrationNumber.trim(),
      password: data.password,
    });
    const token = res?.data?.token || res?.token;
    const profile = res?.data?.student || res?.data?.user || res?.student || null;
    if (!token) throw new Error("no-token");
    auth.setStudentSession(token, profile);
    window.location.href = "dashboard.html";
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  } finally {
    utils.setButtonLoading(submitBtn, false);
  }
}
