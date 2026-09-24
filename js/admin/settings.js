auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("settings", "Settings");
  utils.$("#password-form").addEventListener("submit", handlePasswordChange);
});

async function handlePasswordChange(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const submitButton = utils.$("#password-submit");

  if (!data.currentPassword || !data.newPassword) {
    notify.error("Enter your current and new password.");
    return;
  }

  if (data.newPassword.length < 8 || !/[A-Za-z]/.test(data.newPassword) || !/\d/.test(data.newPassword)) {
    notify.error("New password must be at least 8 characters and contain a letter and a number.");
    return;
  }

  utils.setButtonLoading(submitButton, true, "Updating...");
  try {
    await api.patch("/admin/settings/password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }, { authAs: "admin" });
    notify.success("Password updated. Please log in again.");
    form.reset();
    setTimeout(() => auth.logoutAdmin(), 900);
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(submitButton, false);
  }
}
