/* ============================================
   UTILS
   Small, dependency-free helpers shared by every page.
   ============================================ */

const utils = {
  /* ---------- DOM shorthand ---------- */
  $(selector, scope = document) {
    return scope.querySelector(selector);
  },
  $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  },

  /* ---------- Escaping ----------
     Always run untrusted/API string data through this before
     injecting into innerHTML, so a student's name or a question
     body can never break the page or inject markup. */
  escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
  },

  /* ---------- Validation ---------- */
  isEmpty(value) {
    return !value || String(value).trim().length === 0;
  },
  isValidPhone(value) {
    return /^0\d{10}$/.test(String(value).trim());
  },
  isStrongPassword(value) {
    // Mirrors the backend's likely rule: 8+ chars, one letter, one number.
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value));
  },

  /* ---------- Formatting ---------- */
  formatDate(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  },
  formatDateTime(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    return `${utils.formatDate(isoString)}, ${d.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  },
  formatDuration(minutes) {
    if (!minutes && minutes !== 0) return "—";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  },
  formatSeconds(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  },
  initials(fullName) {
    if (!fullName) return "?";
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");
  },

  /* ---------- Misc ---------- */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /* ---------- Button loading state ----------
     Every submit button should call this so users get consistent
     spinner + disabled behaviour, and can't double-submit. */
  setButtonLoading(button, isLoading, loadingText = "Please wait…") {
    if (!button) return;
    if (isLoading) {
      button.dataset.originalText = button.dataset.originalText || button.innerHTML;
      button.disabled = true;
      button.innerHTML = `<span class="btn__spinner" aria-hidden="true"></span><span>${loadingText}</span>`;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) {
        button.innerHTML = button.dataset.originalText;
      }
    }
  },

  /* ---------- Safe error message ----------
     Never let a raw JS/network error string reach the UI. */
  safeErrorMessage(err) {
    if (err && err.name === "ApiError") return err.message;
    return "Something went wrong. Please try again.";
  },
};
