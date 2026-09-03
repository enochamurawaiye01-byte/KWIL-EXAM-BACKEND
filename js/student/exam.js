auth.requireStudent();

let exam = null;
let sessionId = null;
let questions = [];
let currentIndex = 0;
const answers = {}; // { questionId: selectedOptionId }
let remainingSeconds = 0;
let timerHandle = null;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  sessionId = params.get("sessionId");
  if (!sessionId) {
    notify.error("This exam session could not be found.");
    return;
  }

  utils.$("#prev-btn").addEventListener("click", () => go(-1));
  utils.$("#next-btn").addEventListener("click", () => go(1));
  utils.$("#submit-btn").addEventListener("click", handleSubmitClick);

  await loadExam();
});

async function loadExam() {
  try {
    const res = await api.get(`/exam-sessions/${encodeURIComponent(sessionId)}/questions`, { authAs: "student" });
    const data = res?.data;
    exam = data?.exam;
    questions = data?.questions || [];
    remainingSeconds = data?.session?.remainingTime || 0;

    if (!questions.length) throw new Error("This exam has no questions.");

    questions.forEach((question) => {
      if (question.selectedOptionId) answers[question.id] = question.selectedOptionId;
    });
    utils.$("#exam-title-label").textContent = exam?.title || "Examination";
    renderQuestion();
    startTimer();
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
  }
}

function startTimer() {
  updateTimerDisplay();
  timerHandle = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) {
      clearInterval(timerHandle);
      submitExamAutomatically();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = utils.$("#exam-timer");
  el.textContent = utils.formatSeconds(remainingSeconds);
  el.classList.toggle("exam-timer--critical", remainingSeconds <= 60);
}

function go(delta) {
  const next = currentIndex + delta;
  if (next < 0 || next >= questions.length) return;
  currentIndex = next;
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  utils.$("#question-progress").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  utils.$("#question-text").textContent = q.questionText;
  utils.$("#option-list").innerHTML = q.options
    .map(
      (opt) => `
    <label class="option">
      <input type="radio" name="q-${q.id}" value="${utils.escapeHtml(opt.id)}" ${answers[q.id] === opt.id ? "checked" : ""} />
      <span>${utils.escapeHtml(opt.text)}</span>
    </label>`
    )
    .join("");

  utils.$all(`input[name="q-${q.id}"]`).forEach((input) => {
    input.addEventListener("change", (e) => saveAnswer(q.id, e.target.value));
  });

  utils.$("#prev-btn").disabled = currentIndex === 0;
  utils.$("#next-btn").disabled = currentIndex === questions.length - 1;
  renderNavigator();
}

async function saveAnswer(questionId, optionIndex) {
  answers[questionId] = optionIndex;
  renderNavigator();

  try {
    await api.post(`/exam-sessions/${encodeURIComponent(sessionId)}/answers`, {
      questionId,
      selectedOptionId: optionIndex,
    }, { authAs: "student" });
  } catch (err) {
    delete answers[questionId];
    renderQuestion();
    notify.error(utils.safeErrorMessage(err));
  }
}

function renderNavigator() {
  const grid = utils.$("#navigator-grid");
  grid.innerHTML = questions.map((q, i) => {
    const state = i === currentIndex ? "current" : answers[q.id] !== undefined ? "answered" : "unanswered";
    return `<button type="button" class="navigator-cell" data-state="${state}" data-index="${i}">${i + 1}</button>`;
  }).join("");
  utils.$all(".navigator-cell", grid).forEach((btn) => {
    btn.addEventListener("click", () => {
      currentIndex = Number(btn.dataset.index);
      renderQuestion();
    });
  });
}

async function handleSubmitClick() {
  const answeredCount = Object.keys(answers).length;
  const ok = await confirmDialog({
    title: "Submit examination?",
    body: `You have answered ${answeredCount} out of ${questions.length} questions. Once submitted, you cannot return to the examination.`,
    confirmText: "Submit",
    danger: true,
  });
  if (ok) submitExam();
}

function submitExamAutomatically() {
  notify.warning("Time's up — submitting your examination.");
  submitExam();
}

async function submitExam() {
  clearInterval(timerHandle);
  utils.setButtonLoading(utils.$("#submit-btn"), true, "Submitting…");

  try {
    const res = await api.post(`/exam-sessions/${encodeURIComponent(sessionId)}/submit`, {}, { authAs: "student" });
    window.location.href = `exam-result.html?sessionId=${encodeURIComponent(sessionId)}`;
  } catch (err) {
    notify.error(utils.safeErrorMessage(err));
    utils.setButtonLoading(utils.$("#submit-btn"), false);
  }
}
