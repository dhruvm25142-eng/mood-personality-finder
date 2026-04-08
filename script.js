let answers = [];
let allQuotes = [];

// Answer select
function selectAnswer(type, element) {
  const parent = element.parentElement;

  parent.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("selected")
  );

  element.classList.add("selected");
  answers.push(type);
}

// Show result
function showResult() {
  if (answers.length < 3) {
    alert("Answer all questions!");
    return;
  }

  const mood = detectMood();

  document.getElementById("questionSection").classList.add("hidden");
  document.getElementById("resultSection").classList.remove("hidden");

  document.getElementById("resultTitle").innerText =
    mood === "happy" ? "You're feeling Happy 😊" :
    mood === "sad" ? "You're feeling Low 😔" :
    "You're an Overthinker 🤯";

  fetchQuotes();
}

// Mood logic
function detectMood() {
  let count = { happy: 0, sad: 0, overthinker: 0 };

  answers.forEach(a => count[a]++);

  return Object.keys(count).reduce((a, b) =>
    count[a] > count[b] ? a : b
  );
}

// Fetch quotes
function fetchQuotes() {
  fetch("https://dummyjson.com/quotes")
    .then(res => res.json())
    .then(data => {
      allQuotes = data.quotes;
      displayQuotes(allQuotes);
    });
}

// Display quotes
function displayQuotes(quotes) {
  const box = document.getElementById("quoteBox");

  const random = quotes[Math.floor(Math.random() * quotes.length)];

  box.innerHTML = `
    <p>"${random.quote}"</p>
    <h4>- ${random.author}</h4>
  `;
}

// Search
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput").addEventListener("input", e => {
    const val = e.target.value.toLowerCase();

    const filtered = allQuotes.filter(q =>
      q.quote.toLowerCase().includes(val)
    );

    displayQuotes(filtered);
  });

  document.getElementById("filterMood").addEventListener("change", e => {
    displayQuotes(allQuotes);
  });

  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
});

// Restart
function restart() {
  answers = [];
  document.getElementById("resultSection").classList.add("hidden");
  document.getElementById("questionSection").classList.remove("hidden");

  document.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("selected")
  );
}
// Save theme
document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Load theme
window.onload = () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }
};