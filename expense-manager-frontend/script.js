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

const API_URL = 'http://localhost:8000/transactions';

let transactions = [];

const fromApi = t => ({
  id: t.id,
  description: t.description,
  amount: t.amount,
  date: t.dateoftransaction,
  type: t.transactiontype,
});

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

async function fetchTransactions() {
  try {
    const data = await request(API_URL);
    transactions = data.map(fromApi);
    errorEl.hidden = true;
  } catch {
    showError('Could not load transactions. Is the backend running on http://localhost:8000?');
  }
  render();
}

async function createTransaction({ description, amount, date, type }) {
  const created = await request(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      description,
      amount,
      dateoftransaction: date,
      transactiontype: type,
    }),
  });
  return fromApi(created);
}

async function deleteTransaction(id) {
  await request(`${API_URL}/${id}`, { method: 'DELETE' });
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
    del.addEventListener('click', async () => {
      try {
        await deleteTransaction(t.id);
        transactions = transactions.filter(x => x.id !== t.id);
        render();
      } catch {
        showError('Could not delete the transaction. Please try again.');
      }
    });

    li.append(info, amount, del);
    listEl.appendChild(li);
  });

  emptyEl.hidden = transactions.length > 0;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const date = dateInput.value;
  const type = typeInput.value;

  if (!description || !date || !(amount > 0)) {
    showError('Please enter a description, a date and an amount greater than zero.');
    return;
  }
  errorEl.hidden = true;

  try {
    const created = await createTransaction({
      description,
      amount: Math.round(amount * 100) / 100,
      date,
      type,
    });
    transactions.push(created);
    render();

    form.reset();
    dateInput.value = todayISO();
    descriptionInput.focus();
  } catch {
    showError('Could not save the transaction. Please try again.');
  }
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
fetchTransactions();
