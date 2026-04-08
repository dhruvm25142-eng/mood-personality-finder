let answers = [];
let allQuotes = [];

// Answer select
function selectAnswer(type, element) {
  const parent = element.parentElement;

  // Remove previous selection in same question
  parent.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("selected")
  );

  element.classList.add("selected");

  // Replace answer instead of pushing multiple times
  const index = [...document.querySelectorAll(".question")].indexOf(parent);
  answers[index] = type;
}

// Show result
function showResult() {
  if (answers.length < 3 || answers.includes(undefined)) {
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
    })
    .catch(() => {
      document.getElementById("quoteBox").innerHTML =
        "<p>Failed to load quotes 😢</p>";
    });
}

// Display quotes
function displayQuotes(quotes) {
  const box = document.getElementById("quoteBox");

  if (!quotes.length) {
    box.innerHTML = "<p>No quotes found 😕</p>";
    return;
  }

  const random = quotes[Math.floor(Math.random() * quotes.length)];

  box.innerHTML = `
    <p>"${random.quote}"</p>
    <h4>- ${random.author}</h4>
  `;
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

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {

  // 🔍 Search
  document.getElementById("searchInput").addEventListener("input", e => {
    const val = e.target.value.toLowerCase();

    const filtered = allQuotes.filter(q =>
      q.quote.toLowerCase().includes(val)
    );

    displayQuotes(filtered);
  });

  // 🎯 Filter (future ready)
  document.getElementById("filterMood").addEventListener("change", () => {
    displayQuotes(allQuotes);
  });

  // 🌙 Theme Toggle
  const toggleBtn = document.getElementById("themeToggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // 🌗 Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
  }

});