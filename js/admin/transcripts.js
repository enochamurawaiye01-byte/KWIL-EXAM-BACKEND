auth.requireAdmin();

let allTranscripts = [];

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("transcripts", "Transcripts");
  utils.$("#search-input").addEventListener("input", utils.debounce(applyFilter, 200));
  loadTranscripts();
});

async function loadTranscripts() {
  const region = utils.$("#transcripts-region");
  try {
    const res = await api.get("/admin/transcripts", { authAs: "admin" });
    allTranscripts = res?.data || [];
    applyFilter();
  } catch (err) {
    region.innerHTML = `<div class="card state-block state-block--error"><h3>Couldn't load transcripts</h3><p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p></div>`;
  }
}

function applyFilter() {
  const query = utils.$("#search-input").value.trim().toLowerCase();
  const filtered = query
    ? allTranscripts.filter((item) => [
        item.student?.fullName,
        item.student?.registrationNumber,
        item.exam?.title,
        item.exam?.course?.name,
      ].join(" ").toLowerCase().includes(query))
    : allTranscripts;
  renderTranscripts(filtered);
}

function renderTranscripts(transcripts) {
  const region = utils.$("#transcripts-region");
  if (!transcripts.length) {
    region.innerHTML = `<div class="card state-block"><h3>No transcripts found</h3><p>Completed exam results will appear here.</p></div>`;
    return;
  }

  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Student</th><th>Reg. No.</th><th>Course</th><th>Exam</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${transcripts.map((item) => {
            const transcript = item.transcript;
            return `
              <tr>
                <td>${utils.escapeHtml(item.student?.fullName || "—")}</td>
                <td>${utils.escapeHtml(item.student?.registrationNumber || "—")}</td>
                <td>${utils.escapeHtml(item.exam?.course?.name || "—")}</td>
                <td>${utils.escapeHtml(item.exam?.title || "—")}</td>
                <td>${utils.escapeHtml(item.grade || "—")}</td>
                <td><span class="badge ${item.status === "PASS" ? "badge--success" : "badge--danger"}">${utils.escapeHtml(item.status || "—")}</span></td>
                <td>
                  ${transcript
                    ? `<button class="btn btn--secondary btn--sm" data-download-id="${utils.escapeHtml(transcript.id)}" data-file-name="${utils.escapeHtml(transcript.fileName)}">Download</button>`
                    : `<button class="btn btn--primary btn--sm" data-generate-id="${utils.escapeHtml(item.id)}">Generate</button>`}
                </td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;

  utils.$all("[data-generate-id]", region).forEach((button) =>
    button.addEventListener("click", () => generateTranscript(button))
  );
  utils.$all("[data-download-id]", region).forEach((button) =>
    button.addEventListener("click", () => downloadTranscript(button))
  );
}

async function generateTranscript(button) {
  utils.setButtonLoading(button, true, "Generating...");
  try {
    await api.post(`/admin/transcripts/${encodeURIComponent(button.dataset.generateId)}/generate`, {}, { authAs: "admin" });
    notify.success("Transcript generated.");
    await loadTranscripts();
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(button, false);
  }
}

async function downloadTranscript(button) {
  const token = localStorage.getItem(STORAGE_KEYS.adminToken);
  const url = `${API_BASE_URL}/admin/transcripts/${encodeURIComponent(button.dataset.downloadId)}/download`;
  try {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error("Download failed");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = button.dataset.fileName || "transcript.pdf";
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    notify.error("Couldn't download transcript.");
  }
}
