/* ============================================
   ADMIN — QUESTION MANAGEMENT
   Planned endpoint: POST /api/admin/exams/:examId/questions
   — not built yet. Form is fully validated and ready;
   submit is disabled until the endpoint exists.
   ============================================ */

auth.requireAdmin();

const examId = new URLSearchParams(location.search).get("examId");

document.addEventListener("DOMContentLoaded", () => {
  renderAdminLayout("exams", "Questions");
});

// --- Once the endpoint exists, remove `disabled` from #question-submit
// in the HTML and wire this up:
// utils.$("#question-form").addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const data = Object.fromEntries(new FormData(e.target).entries());
//   const submitBtn = document.getElementById("question-submit");
//   utils.setButtonLoading(submitBtn, true, "Adding…");
//   try {
//     await api.post(`/admin/exams/${examId}/questions`, {
//       text: data.questionText,
//       options: { A: data.optionA, B: data.optionB, C: data.optionC, D: data.optionD },
//       correctAnswer: data.correctAnswer,
//       marks: Number(data.marks),
//     }, { authAs: "admin" });
//     notify.success("Question added.");
//     e.target.reset();
//   } catch (err) {
//     notify.error(utils.safeErrorMessage(err));
//   } finally {
//     utils.setButtonLoading(submitBtn, false);
//   }
// });
