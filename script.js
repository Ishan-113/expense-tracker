const CATS = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'];
const CAT_COLORS = {
  Food: '#f5a623',
  Transport: '#4fc3f7',
  Shopping: '#ce93d8',
  Bills: '#ef9a9a',
  Health: '#a5d6a7',
  Other: '#90a4ae'
};

let filter = 'All';
let expenses = JSON.parse(localStorage.getItem('ishan_expenses') || '[]');

function save() {
  localStorage.setItem('ishan_expenses', JSON.stringify(expenses));
}

function addExpense() {
  const name = document.getElementById('name').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const cat = document.getElementById('cat').value;
  const err = document.getElementById('err');

  if (!name || isNaN(amount) || amount <= 0) {
    err.style.display = 'block';
    return;
  }

  err.style.display = 'none';
  expenses.unshift({ id: Date.now(), name, amount, cat });
  save();

  document.getElementById('name').value = '';
  document.getElementById('amount').value = '';
  render();
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  save();
  render();
}

function setFilter(cat) {
  filter = cat;
  render();
}

function render() {
  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.cat === filter);
const total = expenses.reduce((sum, e) => sum + e.amount, 0);
document.getElementById('count').textContent = filtered.length;

  document.getElementById('total').textContent =
    '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('count').textContent = filtered.length;

  // Render filter pills
  const fRow = document.getElementById('filters');
  fRow.innerHTML = CATS.map(c =>
    `<button class="pill ${filter === c ? 'active' : ''}" onclick="setFilter('${c}')">${c}</button>`
  ).join('');

  // Render expense list
  const list = document.getElementById('list');
  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty">No expenses yet. Add one above!</div>';
    return;
  }

  list.innerHTML = filtered.map(e => `
    <div class="item">
      
      <span class="item-name">
        ${e.name}
        <span class="item-cat">${e.cat}</span>
      </span>
      <span class="item-amount">
        ₹${e.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <button class="btn-del" onclick="deleteExpense(${e.id})" title="Delete">✕</button>
    </div>
  `).join('');
}

// Allow Enter key to add expense
document.getElementById('name').addEventListener('keydown', e => { if (e.key === 'Enter') addExpense(); });
document.getElementById('amount').addEventListener('keydown', e => { if (e.key === 'Enter') addExpense(); });

render();