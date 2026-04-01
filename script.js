let answers = [];

// Select answer
function selectAnswer(type, element) {
  answers.push(type);

  const buttons = element.parentElement.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("selected"));

  element.classList.add("selected");
}

// Show result
function showResult() {
  if (answers.length < 4) {
    alert("Answer all questions first!");
    return;
  }

  const mood = detectMood();

  document.getElementById("questionSection").classList.add("hidden");

  const resultSection = document.getElementById("resultSection");
  resultSection.classList.remove("hidden");
  resultSection.classList.add("fade-in");

  document.getElementById("resultTitle").innerText = formatMood(mood);

  getQuote();
}

// Mood detection
function detectMood() {
  let count = { happy: 0, sad: 0, overthinker: 0 };

  answers.forEach(a => count[a]++);

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}

// Better text
function formatMood(mood) {
  if (mood === "happy") return "You're in a positive space ✨";
  if (mood === "sad") return "You're feeling low right now 💭";
  return "You're an overthinker 🧠";
}

// Fetch quote
function getQuote() {
  const quoteBox = document.getElementById("quoteBox");
  quoteBox.innerText = "Loading...";

  fetch("https://dummyjson.com/quotes")
    .then(res => res.json())
    .then(data => {
      const quotes = data.quotes;
      const random = quotes[Math.floor(Math.random() * quotes.length)];

      quoteBox.innerHTML = `
        <p>"${random.quote}"</p>
        <h4>- ${random.author}</h4>
      `;
    })
    .catch(() => {
      quoteBox.innerText = "Error loading quote!";
    });
}

// Restart
function restart() {
  answers = [];

  document.getElementById("resultSection").classList.add("hidden");
  document.getElementById("questionSection").classList.remove("hidden");

  document.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("selected")
  );
}