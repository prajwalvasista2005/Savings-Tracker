const money = document.getElementById("money");
const amountInput = document.getElementById("amountInput");
const addBtn = document.getElementById("addBtn");
const fill = document.getElementById("fill");
const percent = document.getElementById("percent");
const saved = document.getElementById("saved");
const remaining = document.getElementById("remaining");
const goalInput = document.getElementById("goalInput");
const editInput = document.getElementById("editInput");
const updateBtn = document.getElementById("updateBtn");
const historyList = document.getElementById("historyList");
const days = document.getElementById("days");
const withdrawBtn = document.getElementById("withdrawBtn");
let savedToday = Number(localStorage.getItem("savedToday")) || 0;

let totalMoney = Number(localStorage.getItem("money")) || 0;

let history = JSON.parse(localStorage.getItem("history")) || [];

const savedDays = history.filter((item) => item.amount > 0);

days.innerText = savedDays.length;

function addHistory(amount) {
  const entry = {
    amount,
    date: new Date().toLocaleString(),
  };

  history.unshift(entry);

  localStorage.setItem("history", JSON.stringify(history));

  const savedDays = history.filter((item) => item.amount > 0);

  days.innerText = savedDays.length;

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

let goal = Number(localStorage.getItem("goal")) || 20000;

addBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) return;

  totalMoney += amount;

  addHistory(amount);

  localStorage.setItem("money", totalMoney);

  money.innerText = `₹${totalMoney}`;

  amountInput.value = "";

  savedToday += amount;

  localStorage.setItem("savedToday", savedToday);

  saved.innerText = `₹${savedToday}`;

  remaining.innerText = `₹${goal - totalMoney}`;

  updateProgress();
});

withdrawBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);

  if (isNaN(amount) || amount <= 0) return;

  if (amount > totalMoney) {
    alert("Not enough money to withdraw");

    return;
  }

  totalMoney -= amount;

  addHistory(-amount);

  localStorage.setItem("money", totalMoney);

  amountInput.value = "";

  money.innerText = `₹${totalMoney}`;
  savedToday -= amount;

  localStorage.setItem("savedToday", savedToday);

  saved.innerText = `₹${savedToday}`;

  remaining.innerText = `₹${goal - totalMoney}`;

  updateProgress();
});

goalInput.addEventListener("input", () => {
  goal = Number(goalInput.value);

  localStorage.setItem("goal", goal);

  remaining.innerText = `₹${goal - totalMoney}`;

  updateProgress();
});

updateBtn.addEventListener("click", () => {
  const newamount = Number(editInput.value);

  if (isNaN(newamount)) return;

  totalMoney = newamount;

  localStorage.setItem("money", totalMoney);

  money.innerText = `₹${totalMoney}`;


  remaining.innerText = `₹${goal - totalMoney}`;

  editInput.value = "";

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

remaining.innerText = `₹${goal - totalMoney}`;
saved.innerText = `₹${savedToday}`;

updateProgress();
