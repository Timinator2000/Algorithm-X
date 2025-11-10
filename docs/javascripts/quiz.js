// --- Quiz definitions ---
const quizzes = {
  futoshiki_quiz1: {
    type: "multi",
    question: "",
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
    question: "",
    options: {
      A: "Send an email.",
      B: "Post a message in the CodinGame Forum.",
      C: "Create requirements to handle mutual exclusivity.",
      D: "Call a special AlgorithmXSolver method.",
      E: "Ask @5DN1L to reach out to CodinGame directly."
    },
    answer: "C",
    explanation: "Mutually exclusive items cannot both be part of the same solution."
  },
  multiplicity_quiz1: {
    type: "single",
    question: "",
    options: {
      A: "None - Cutting and pasting into my coding environment takes too much time.",
      B: "2 - Exactly what I expected!",
      C: "4 - Is Algorithm X broken?",
      D: "37 - Ella just stopped by and bumped her request to 5 lessons per week."
    },
    answer: "C",
    explanation: 'The bigger question is now, "Why did Algorithm X find 4 solutions???'
  },
  equation_search_quiz1: {
    type: "single",
    question: "",
    options: {
      A: "1",
      B: "2",
      C: "3",
      D: "4"
    },
    answer: "C",
    explanation: ""
  },
  equation_search_quiz2: {
    type: "single",
    question: "",
    options: {
      A: "4",
      B: "6",
      C: "8",
      D: "13"
    },
    answer: "B",
    explanation: ""
  }
};

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
      <br>
      <br>
      <button class="quiz-check-btn" data-quiz="${id}" disabled>Check answer</button>
      <p class="quiz-result"></p>
    `;
 
    // Direct per-quiz event listeners
    div.addEventListener("click", e => {
      const btn = div.querySelector(".quiz-check-btn");
      if (!btn || btn.disabled) return;
      const id = btn.dataset.quiz;
      checkQuiz(id);
    });
 
    div.addEventListener("change", e => {
      if (!e.target.matches("input")) return;
      const button = div.querySelector(".quiz-check-btn");
      const result = div.querySelector(".quiz-result");
 
      // Re-enable the button and hide previous result when learner changes the answer
      if (button) {
        const anySelected = div.querySelectorAll("input:checked").length > 0;
        button.disabled = !anySelected;
        result.classList.remove("visible");
      }
    });
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
 
// Initial render on page load
if (document.readyState !== "loading") {
  initQuizzes();
} else {
  document.addEventListener("DOMContentLoaded", initQuizzes);
}
 
// Re-render on Material instant navigation
document.addEventListener("DOMContentSwitch", initQuizzes);