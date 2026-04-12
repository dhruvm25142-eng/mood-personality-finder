let answers = [];
let allQuotes = [];
let currentMood = "";

// Answer select
function selectAnswer(type, element) {
  const parent = element.parentElement;

  parent.querySelectorAll("button").forEach(btn =>
    btn.classList.remove("selected")
  );

  element.classList.add("selected");

  const index = [...document.querySelectorAll(".question")].indexOf(parent);
  answers[index] = type;
}

// Show result
function showResult() {
  if (answers.length < 3 || answers.includes(undefined)) {
    alert("Answer all questions!");
    return;
  }

  currentMood = detectMood();

  document.getElementById("questionSection").classList.add("hidden");
  document.getElementById("resultSection").classList.remove("hidden");

  document.getElementById("resultTitle").innerText =
    currentMood === "happy" ? "You're feeling Happy 😊" :
    currentMood === "sad" ? "You're feeling Low 😔" :
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
  const box = document.getElementById("quoteBox");
  box.innerHTML = "<p>Loading quotes...</p>";

  fetch("https://dummyjson.com/quotes")
    .then(res => res.json())
    .then(data => {
      allQuotes = data.quotes;
      getQuote(); // show first quote properly
    })
    .catch(() => {
      box.innerHTML = "<p>Failed to load quotes 😢</p>";
    });
}

// ⭐ NEW FUNCTION (FIXED BUTTON)
function getQuote() {
  if (!allQuotes.length) return;

  let filtered = allQuotes;

  // Optional: mood-based filtering (future ready)
  if (currentMood === "happy") {
    filtered = allQuotes.slice(0, 10);
  } else if (currentMood === "sad") {
    filtered = allQuotes.slice(10, 20);
  } else {
    filtered = allQuotes.slice(20, 30);
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];

  document.getElementById("quoteBox").innerHTML = `
    <p>"${random.quote}"</p>
    <h4>- ${random.author}</h4>
  `;
}

// Restart
function restart() {
  answers = [];
  currentMood = "";

  document.getElementById("resultSection").classList.add("hidden");
  document.getElementById("questionSection").classList.remove("hidden");

  document.querySelectorAll(".question button").forEach(btn =>
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

    if (filtered.length) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];

      document.getElementById("quoteBox").innerHTML = `
        <p>"${random.quote}"</p>
        <h4>- ${random.author}</h4>
      `;
    } else {
      document.getElementById("quoteBox").innerHTML = "<p>No quotes found 😕</p>";
    }
  });

  // 🎯 Filter
  document.getElementById("filterMood").addEventListener("change", e => {
    const val = e.target.value;

    if (val === "all") {
      getQuote();
    } else {
      currentMood = val;
      getQuote();
    }
  });

  // 🌙 Theme Toggle
  const toggleBtn = document.getElementById("themeToggle");

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });

  // 🌗 Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }
});