/* ============================================
   ADMIN LOGIN
   POST /api/auth/admin/login → store JWT under the
   admin-only storage key (never shared with student key).
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  if (auth.getAdminToken()) {
    window.location.href = "dashboard.html";
    return;
  }
  utils.$('[data-toggle-for="password"]').addEventListener("click", (e) => {
    const input = document.getElementById("password");
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    e.target.textContent = showing ? "Show" : "Hide";
  });
  utils.$("#admin-login-form").addEventListener("submit", handleSubmit);
});

async function handleSubmit(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());

  let valid = true;
  if (utils.isEmpty(data.email)) {
    document.getElementById("field-email").classList.add("field--invalid");
    valid = false;
  } else {
    document.getElementById("field-email").classList.remove("field--invalid");
  }
  if (utils.isEmpty(data.password)) {
    document.getElementById("field-password").classList.add("field--invalid");
    valid = false;
  } else {
    document.getElementById("field-password").classList.remove("field--invalid");
  }
  if (!valid) return;

  const submitBtn = document.getElementById("admin-login-submit");
  utils.setButtonLoading(submitBtn, true, "Logging in…");

  try {
    const res = await api.post("/auth/admin/login", {
      email: data.email.trim(),
      password: data.password,
    });
    const token = res?.data?.token || res?.token;
    const profile = res?.data?.admin || res?.data?.user || res?.admin || null;
    if (!token) throw new Error("no-token");
    auth.setAdminSession(token, profile);
    window.location.href = "dashboard.html";
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  } finally {
    utils.setButtonLoading(submitBtn, false);
  }
}
