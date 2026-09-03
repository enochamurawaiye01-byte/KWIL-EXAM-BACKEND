auth.requireStudent();

document.addEventListener("DOMContentLoaded", () => {
  renderStudentNavbar("exams");
  loadExams();
});

async function loadExams() {
  try {
    const res = await api.get("/exam-sessions/available", { authAs: "student" });
    renderExamList(res?.data || []);
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  }
}

function renderExamList(exams) {
  const region = utils.$("#exam-list-region");

  if (!exams.length) {
    region.innerHTML = `
      <div class="card state-block">
        <h3>No examinations available</h3>
        <p>You don't have any examinations to sit right now. Check back later.</p>
      </div>`;
    return;
  }

  region.innerHTML = exams
    .map(
      (exam) => `
    <div class="card exam-card">
      <div>
        <h3>${utils.escapeHtml(exam.title)}</h3>
        <p class="text-muted" style="font-size:var(--fs-sm);">${utils.escapeHtml(exam.course?.name || "")}</p>
        <dl class="exam-card__meta">
          <div><dt>Duration</dt><dd>${utils.formatDuration(exam.duration)}</dd></div>
          <div><dt>Questions</dt><dd>${Math.min(exam.totalQuestions || 0, 30)}</dd></div>
          <div><dt>Total marks</dt><dd>${exam.totalMarks}</dd></div>
        </dl>
      </div>
      <button class="btn btn--primary" ${exam.attempt ? "disabled" : ""} onclick="location.href='exam-instructions.html?examId=${encodeURIComponent(exam.id)}'">
        ${exam.attempt ? "Exam completed" : "Start exam"}
      </button>
    </div>`
    )
    .join("");
}
