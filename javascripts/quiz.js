const quizzes = {
  futoshiki_quiz1: {
    type: "multi",
    question: "What is wrong with the above statements? (Select all that apply)",
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


// --- Rendering and checking logic ---

function renderQuizzes() {
  document.querySelectorAll('.quiz').forEach(div => {
    const id = div.dataset.id;
    const q = quizzes[id];
    if (!q) {
      div.innerHTML = `<p style="color:red;">Quiz "${id}" not found.</p>`;
      return;
    }

    // Instruction text based on quiz type
    const instruction = q.type === "multi"
      ? "Select all that apply."
      : "Select the best answer.";

    // Start HTML with instruction only
    let html = `<p style="font-style: italic; color: gray;">${instruction}</p>`;

    // Add inputs
    const inputType = q.type === "multi" ? "checkbox" : "radio";
    for (const [key, text] of Object.entries(q.options)) {
      html += `
        <input type="${inputType}" id="${id}${key}" name="${id}" value="${key}">
        <label for="${id}${key}">${text}</label><br>
      `;
    }

    // Add button and result placeholder
    html += `
      <br>
      <button type="button" onclick="checkQuiz('${id}')">Check answer</button>
      <p class="quiz-result"></p>
    `;

    div.innerHTML = html;
  });
}


function checkQuiz(id) {
  // find the quiz container (we render into <div class="quiz" data-id="...">)
  const div = document.querySelector(`[data-id="${id}"]`);
  if (!div) return console.warn(`checkQuiz: quiz container for "${id}" not found.`);

  const result = div.querySelector('.quiz-result');
  const button = div.querySelector('button');

  if (!button) return console.warn(`checkQuiz: button for "${id}" not found.`);

  // ---- Anti-spam: disable + UI feedback ----
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Checking…';
  button.style.opacity = '0.6';
  button.style.cursor = 'not-allowed';

  // Re-enable after cooldown
  setTimeout(() => {
    button.disabled = false;
    button.textContent = originalText;
    button.style.opacity = '';
    button.style.cursor = '';
  }, 1500);

  // ---- Collect selected inputs ----
  const selected = Array.from(div.querySelectorAll('input:checked')).map(i => i.value);

  if (selected.length === 0) {
    result.textContent = "⚠️ Please select at least one option.";
    result.style.color = "gray";
    return;
  }

  // ---- Lookup quiz definition ----
  const q = quizzes[id];
  if (!q) {
    result.textContent = "Quiz data not found.";
    result.style.color = "gray";
    return;
  }

  // ---- Check correctness ----
  let isCorrect = false;
  if (q.type === "multi") {
    // compare as case-insensitive sets (order-insensitive)
    const correct = (q.answers || []).map(a => String(a).toUpperCase()).sort();
    const chosen = selected.map(a => String(a).toUpperCase()).sort();
    isCorrect = correct.length === chosen.length && correct.every((v, i) => v === chosen[i]);
  } else { // single
    isCorrect = selected[0] === q.answer;
  }

  // ---- Show result ----
  if (isCorrect) {
    result.innerHTML = "✅ Correct! " + (q.explanation || "");
    result.style.color = "green";
  } else {
    result.innerHTML = "❌ Not quite. Try again!";
    result.style.color = "red";
  }
}


document.addEventListener("DOMContentLoaded", renderQuizzes);

