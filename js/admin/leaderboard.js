auth.requireAdmin();

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("leaderboard", "Leaderboard");
  loadLeaderboard();
});

async function loadLeaderboard() {
  const region = utils.$("#leaderboard-region");
  try {
    const res = await api.get("/admin/leaderboard", { authAs: "admin" });
    renderLeaderboard(res?.data || []);
  } catch (err) {
    region.innerHTML = `<div class="card state-block state-block--error"><h3>Couldn't load leaderboard</h3><p>${utils.escapeHtml(utils.safeErrorMessage(err))}</p><button class="btn btn--secondary" onclick="location.reload()">Retry</button></div>`;
  }
}

function renderLeaderboard(entries) {
  const region = utils.$("#leaderboard-region");
  if (!entries.length) {
    region.innerHTML = `<div class="card state-block"><h3>No leaderboard data yet</h3><p>Students will appear here after completing examinations.</p></div>`;
    return;
  }

  region.innerHTML = `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Rank</th><th>Student</th><th>Registration No.</th><th>Course</th><th>Average score</th><th>Attempts</th></tr></thead>
        <tbody>
          ${entries.map((entry) => `
            <tr>
              <td>${entry.rank}</td>
              <td>${utils.escapeHtml(entry.student?.fullName || "—")}</td>
              <td>${utils.escapeHtml(entry.student?.registrationNumber || "—")}</td>
              <td>${utils.escapeHtml(entry.course?.name || "—")}</td>
              <td>${entry.averageScore}%</td>
              <td>${entry.attempts}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}
