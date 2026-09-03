/* ============================================
   NOTIFICATIONS
   Toasts + confirmation dialogs. Both inject their
   own markup on first use, so any page just needs
   this file included — no HTML boilerplate required.
   ============================================ */

const notify = (() => {
  function region() {
    let el = document.querySelector(".toast-region");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast-region";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    return el;
  }

  function show(message, type = "neutral", timeout = 4500) {
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.innerHTML = `<span>${utils.escapeHtml(message)}</span><button class="toast__close" aria-label="Dismiss">×</button>`;
    el.querySelector(".toast__close").addEventListener("click", () => el.remove());
    region().appendChild(el);
    if (timeout) setTimeout(() => el.remove(), timeout);
  }

  return {
    success: (msg) => show(msg, "success"),
    error: (msg) => show(msg, "error"),
    warning: (msg) => show(msg, "warning"),
    info: (msg) => show(msg, "neutral"),
  };
})();

/**
 * Promise-based confirmation dialog, replacing window.confirm with
 * something that matches the design system.
 * @returns {Promise<boolean>} true if the user confirmed.
 */
function confirmDialog({
  title = "Are you sure?",
  body = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
} = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h3 class="modal__title" id="confirm-title">${utils.escapeHtml(title)}</h3>
        <p class="modal__body">${utils.escapeHtml(body)}</p>
        <div class="modal__actions">
          <button class="btn btn--secondary" data-action="cancel">${utils.escapeHtml(cancelText)}</button>
          <button class="btn ${danger ? "btn--danger" : "btn--primary"}" data-action="confirm">${utils.escapeHtml(confirmText)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function close(result) {
      overlay.remove();
      resolve(result);
    }
    overlay.querySelector('[data-action="cancel"]').addEventListener("click", () => close(false));
    overlay.querySelector('[data-action="confirm"]').addEventListener("click", () => close(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close(false);
    });
    document.addEventListener(
      "keydown",
      function escHandler(e) {
        if (e.key === "Escape") {
          close(false);
          document.removeEventListener("keydown", escHandler);
        }
      },
      { once: true }
    );
  });
}
