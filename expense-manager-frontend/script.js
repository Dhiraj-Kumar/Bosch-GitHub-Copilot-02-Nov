const STORAGE_KEY = 'expense-manager-transactions';
const THEME_KEY = 'expense-manager-theme';

const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const typeInput = document.getElementById('type');
const errorEl = document.getElementById('form-error');
const listEl = document.getElementById('transaction-list');
const emptyEl = document.getElementById('empty-state');
const incomeEl = document.getElementById('income-amount');
const expenseEl = document.getElementById('expense-amount');
const balanceEl = document.getElementById('balance-amount');
const themeToggle = document.getElementById('theme-toggle');

const CURRENCY_KEY = 'expense-manager-currency';
const currencyToggle = document.getElementById('currency-toggle');

const CURRENCIES = {
  USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
  INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
};

let currentCurrency = localStorage.getItem(CURRENCY_KEY) === 'INR' ? 'INR' : 'USD';
const currency = { format: value => CURRENCIES[currentCurrency].format(value) };

function loadTransactions() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

let transactions = loadTransactions();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function render() {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = currency.format(income);
  expenseEl.textContent = currency.format(expense);
  balanceEl.textContent = (balance < 0 ? '-' : '') + currency.format(Math.abs(balance));

  listEl.innerHTML = '';
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  sorted.forEach(t => {
    const li = document.createElement('li');
    li.className = `transaction ${t.type}`;

    const info = document.createElement('div');
    info.className = 'tx-info';

    const desc = document.createElement('div');
    desc.className = 'tx-desc';
    desc.textContent = t.description;
    desc.title = t.description;

    const date = document.createElement('div');
    date.className = 'tx-date';
    date.innerHTML = '<i class="fa-regular fa-calendar"></i>';
    date.append(formatDate(t.date));

    info.append(desc, date);

    const amount = document.createElement('div');
    amount.className = 'tx-amount';
    amount.textContent = (t.type === 'income' ? '+' : '-') + currency.format(t.amount);

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'tx-delete';
    del.setAttribute('aria-label', 'Delete transaction');
    del.title = 'Delete';
    del.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    del.addEventListener('click', () => {
      transactions = transactions.filter(x => x.id !== t.id);
      save();
      render();
    });

    li.append(info, amount, del);
    listEl.appendChild(li);
  });

  emptyEl.hidden = transactions.length > 0;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const type = typeInput.value;

  if (!description || !date || !(amount > 0)) {
    errorEl.textContent = 'Please enter a description, a date and an amount greater than zero.';
    errorEl.hidden = false;
    return;
  }
  errorEl.hidden = true;

  transactions.push({ id: Date.now(), description, amount: Math.round(amount * 100) / 100, date, type });
  save();
  render();

  form.reset();
  dateInput.value = todayISO();
  descriptionInput.focus();
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  themeToggle.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

function applyCurrency() {
  const isInr = currentCurrency === 'INR';
  currencyToggle.innerHTML = isInr
    ? '<i class="fa-solid fa-indian-rupee-sign"></i>'
    : '<i class="fa-solid fa-dollar-sign"></i>';
  currencyToggle.title = isInr ? 'Switch to US Dollar' : 'Switch to Indian Rupee';
}

currencyToggle.addEventListener('click', () => {
  currentCurrency = currentCurrency === 'USD' ? 'INR' : 'USD';
  localStorage.setItem(CURRENCY_KEY, currentCurrency);
  applyCurrency();
  render();
});

dateInput.value = todayISO();
applyCurrency();
applyTheme(document.documentElement.getAttribute('data-theme'));
render();
