// --- Quiz definitions ---
const quizzes = {
  futoshiki_quiz1: {
    type: "multi",
    question: "What is wrong with the above statements?",
    options: {
      A: "Nothing is wrong. In the absence of hints, either cell could take any of those values.",
      B: "b cannot be 1 since there are no values for a that allow a < b to be true.",
      C: "a must be 1 and b must be 2 because a < b.",
      D: "a cannot be 6 since there are no values for b that allow a < b to be true."
    },
    answers: ["B", "D"],
    explanation: ""
  },
  futoshiki_quiz2: {
    type: "single",
    question: "How do we tell Algorithm X certain things are not allowed?",
    options: {
      A: "Send an email.",
      B: "Post a message in the CodinGame Forum.",
      C: "Create requirements to handle mutual exclusivity.",
      D: "Call a special AlgorithmXSolver method.",
      E: "Ask @5DN1L to reach out to CodinGame directly."
    },
    answer: "C",
    explanation: "Mutually exclusive items cannot both be part of the same solution."
  }
};

// 🆕 --- Helper function: enable/disable Check button based on selections ---
function updateQuizButtonState(div) {
  const anySelected = div.querySelectorAll("input:checked").length > 0;
  const button = div.querySelector(".quiz-check-btn");
  if (button) button.disabled = !anySelected;
}

// --- Render quizzes ---
function renderQuizzesOnPage() {
  document.querySelectorAll(".quiz").forEach(div => {
    const id = div.dataset.id;
    const q = quizzes[id];
    if (!q) {
      div.innerHTML = `<p class="error">Quiz "${id}" not found.</p>`;
      return;
    }

    const instruction = q.type === "multi" ? "Select all that apply." : "Select the best answer.";
    const inputType = q.type === "multi" ? "checkbox" : "radio";
    const options = Object.entries(q.options)
      .map(([key, text]) => `
        <input type="${inputType}" name="${id}" value="${key}">
        ${text}
      `)
      .join("<br>");

    div.innerHTML = `
      <p class="quiz-instruction">${instruction}</p>
      <p class="quiz-question">${q.question}</p>
      ${options}
      <br><br>
      <button class="quiz-check-btn" data-quiz="${id}" disabled>Check answer</button>
      <p class="quiz-result"></p>
    `;

    // 🆕 Added: update button state initially and on every change
    updateQuizButtonState(div);
    div.addEventListener("change", () => updateQuizButtonState(div));
  });
}

// --- Check quiz answers ---
function checkQuiz(id) {
  const q = quizzes[id];
  const div = document.querySelector(`[data-id="${id}"]`);
  const button = div.querySelector(".quiz-check-btn");
  const result = div.querySelector(".quiz-result");
  const selected = Array.from(div.querySelectorAll("input:checked")).map(i => i.value);

  if (selected.length === 0) {
    result.textContent = q.type === "multi"
      ? "⚠️ Please select at least one option."
      : "⚠️ Please select one option.";
    result.className = "quiz-result neutral visible";
    return;
  }

  // Disable button until learner changes an answer
  button.disabled = true;
  let isCorrect = false;
  if (q.type === "multi") {
    const correct = q.answers.map(a => a.toUpperCase()).sort();
    const chosen = selected.map(a => a.toUpperCase()).sort();
    isCorrect = correct.length === chosen.length && correct.every((v, i) => v === chosen[i]);
  } else {
    isCorrect = selected[0] === q.answer;
  }

  result.textContent = isCorrect
    ? `✅ Correct! ${q.explanation || ""}`
    : "❌ Not quite. Try again!";
  result.className = `quiz-result ${isCorrect ? "correct" : "incorrect"} visible`;
}

// --- Initialize quizzes ---
function initQuizzes() {
  if (document.querySelectorAll(".quiz").length > 0) {
    renderQuizzesOnPage();
  }
}

// --- Event handlers ---
document.body.addEventListener("click", e => {
  const btn = e.target.closest(".quiz-check-btn");
  if (!btn || btn.disabled) return;
  const id = btn.dataset.quiz;
  checkQuiz(id);
});

document.body.addEventListener("change", e => {
  if (e.target.matches(".quiz input")) {
    const div = e.target.closest(".quiz");
    const button = div.querySelector(".quiz-check-btn");
    const result = div.querySelector(".quiz-result");

    // Re-enable the button and hide previous result when learner changes the answer
    if (button) {
      button.disabled = false;
      result.classList.remove("visible");
    }

    // 🆕 Added to keep button disabled if all answers were unchecked
    updateQuizButtonState(div);
  }
});

// Initial render on page load
if (document.readyState !== "loading") {
  initQuizzes();
} else {
  document.addEventListener("DOMContentLoaded", initQuizzes);
}

// Re-render on Material instant navigation
document.addEventListener("DOMContentSwitch", initQuizzes);
