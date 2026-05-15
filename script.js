const money = document.getElementById("money");
const amountInput = document.getElementById("amountInput");
const addBtn = document.getElementById("addBtn");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");
const saved = document.getElementById("saved");
const remaining = document.getElementById("remaining");
const goalInput = document.getElementById("goalInput");
const historyList = document.getElementById("historyList");
const days = document.getElementById("days");
const withdrawBtn = document.getElementById("withdrawBtn");

let history = JSON.parse(localStorage.getItem("history")) || [];

let totalMoney = history.reduce((sum, item) => sum + item.amount, 0);

let savedToday = Number(localStorage.getItem("savedToday"));

if (savedToday === null || isNaN(savedToday)) {
  savedToday = 0;
}

let goal = Number(localStorage.getItem("goal")) || 20000;

function updateDays() {
  const savedDays = history.filter((item) => item.amount > 0);

  days.innerText = savedDays.length;
}

updateDays();


function addHistory(amount) {
  const entry = {
    amount,
    date: new Date().toLocaleString(),
  };

  history.unshift(entry);

  localStorage.setItem("history", JSON.stringify(history));

  updateDays();

  const li = document.createElement("div");

  li.classList.add("item");

  li.innerHTML = `
    <span>₹${entry.amount}</span>
    <span>${entry.date}</span>
    `;

  historyList.prepend(li);
}


history.forEach((entry) => {
  const li = document.createElement("div");

  li.classList.add("item");

  li.innerHTML = `
    <span>₹${entry.amount}</span>
    <span>${entry.date}</span>
    `;

  historyList.appendChild(li);
});

addBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) return;

  totalMoney += amount;

  addHistory(amount);

  money.innerText = `₹${totalMoney}`;

  savedToday += amount;

  localStorage.setItem("savedToday", savedToday);

  saved.innerText = `₹${savedToday}`;

  remaining.innerText = `₹${goal - totalMoney}`;

  amountInput.value = "";

  updateProgress();
});

withdrawBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) return;

  if (amount > totalMoney) {
    alert("Not enough money");

    return;
  }

  totalMoney -= amount;

  addHistory(-amount);

  savedToday -= amount;

  localStorage.setItem("savedToday", savedToday);

  money.innerText = `₹${totalMoney}`;

  saved.innerText = `₹${savedToday}`;

  remaining.innerText = `₹${goal - totalMoney}`;

  amountInput.value = "";

  updateProgress();
});

goalInput.addEventListener("input", () => {
  goal = Number(goalInput.value);

  localStorage.setItem("goal", goal);

  remaining.innerText = `₹${goal - totalMoney}`;

  updateProgress();
});

function updateProgress() {
  if (goal <= 0) return;

  const progress = Math.min((totalMoney / goal) * 100, 100);

  fill.style.width = `${progress}%`;

  percent.innerText = `${Math.floor(progress)}%`;
}

money.innerText = `₹${totalMoney}`;

goalInput.value = goal;

saved.innerText = `₹${savedToday}`;

remaining.innerText = `₹${goal - totalMoney}`;

updateProgress();
