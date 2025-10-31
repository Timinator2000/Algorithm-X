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

// --- Render quizzes ---
function renderQuizzesOnPage() {
  document.querySelectorAll('.quiz').forEach(div => {
    const id = div.dataset.id;
    const q = quizzes[id];
    if (!q) {
      div.innerHTML = `<p style="color:red;">Quiz "${id}" not found.</p>`;
      return;
    }

    const instruction = q.type === "multi" ? "Select all that apply." : "Select the best answer.";
    let html = `<p style="font-style: italic; color: gray;">${instruction}</p>`;
    html += `<p><strong>${q.question}</strong></p>`;

    const inputType = q.type === "multi" ? "checkbox" : "radio";
    for (const [key, text] of Object.entries(q.options)) {
      html += `
        <input type="${inputType}" id="${id}${key}" name="${id}" value="${key}">
        <label for="${id}${key}">${text}</label><br>
      `;
    }

    html += `<br><button type="button" class="quiz-check-btn" data-quiz="${id}">Check answer</button>`;
    html += `<p class="quiz-result"></p>`;

    div.innerHTML = html;
  });
}

// --- Event delegation for all quiz buttons ---
document.body.addEventListener("click", function(event) {
  const btn = event.target.closest(".quiz-check-btn");
  if (!btn) return;

  const id = btn.dataset.quiz;
  checkQuiz(id);
});

// --- Check quiz answers ---
function checkQuiz(id) {
  const div = document.querySelector(`[data-id="${id}"]`);
  if (!div) return;
  const result = div.querySelector(".quiz-result");
  const button = div.querySelector(".quiz-check-btn");
  if (!button) return;

  // --- 1-second disable delay ---
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Checking…";
  button.style.opacity = "0.6";
  button.style.cursor = "not-allowed";

  const selected = Array.from(div.querySelectorAll("input:checked")).map(i => i.value);
  const q = quizzes[id];

  setTimeout(() => {
    // Re-enable button
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = "";
    button.style.cursor = "";

    // --- Show result only after delay ---
    if (!q) {
      result.textContent = "Quiz data not found.";
      result.style.color = "gray";
      return;
    }

    if (selected.length === 0) {
      if (q.type === "multi") {
        result.textContent = "⚠️ Please select at least one option.";
      } else {
        result.textContent = "⚠️ Please select the best answer.";
      }
      result.style.color = "gray";
      return;
    }

    // --- Check correctness ---
    let isCorrect = false;
    if (q.type === "multi") {
      const correct = q.answers.map(a => a.toUpperCase()).sort();
      const chosen = selected.map(a => a.toUpperCase()).sort();
      isCorrect = correct.length === chosen.length && correct.every((v, i) => v === chosen[i]);
    } else {
      isCorrect = selected[0] === q.answer;
    }

    // --- Display result ---
    if (isCorrect) {
      result.innerHTML = "✅ Correct! " + (q.explanation || "");
      result.style.color = "green";
    } else {
      result.innerHTML = "❌ Not quite. Try again!";
      result.style.color = "red";
    }
  }, 1000);
}


// --- Initialize quizzes ---
function initQuizzes() {
  if (document.querySelectorAll('.quiz').length > 0) {
    renderQuizzesOnPage();
  }
}

// Initial render on page load
if (document.readyState !== "loading") {
  initQuizzes();
} else {
  document.addEventListener("DOMContentLoaded", initQuizzes);
}

// Re-render on Material instant navigation
document.addEventListener("DOMContentSwitch", initQuizzes);
