const NEWEST_PREFIX = 'ftn-newest';

export class FinancialTrackingNewest {
  constructor() {
    this.root = null;
    this.sections = {};
    this.summaryEls = {};
    this.forms = {};
    this.messages = {};
    this.buttons = {};
    this.transactionBody = null;
    this.transactionFilters = {};
    this.state = {
      transactions: [],
      totals: { income: 0, expense: 0, balance: 0 }
    };
  }

  createContent() {
    return `
      <div class="financial-newest">
        <div class="section-header">
          <h3 class="section-title">Financial Tracking (Newest)</h3>
          <p class="section-description">
            Streamlined tools to manage income, expenses, and transaction insights independently.
          </p>
        </div>

        <section class="sub-content-section active" data-view="overview">
          <div class="financial-stats-grid">
            <div class="stat-card financial-card">
              <div class="stat-header">
                <h3 class="stat-title">Jumlah Terkumpul</h3>
                <span class="stat-icon">&#128176;</span>
              </div>
              <p class="stat-value" id="ftn-newest-total-income">RM 0.00</p>
              <p class="stat-change positive">Updated from database</p>
            </div>
            <div class="stat-card financial-card">
              <div class="stat-header">
                <h3 class="stat-title">Jumlah Perbelanjaan</h3>
                <span class="stat-icon">&#128184;</span>
              </div>
              <p class="stat-value" id="ftn-newest-total-expense">RM 0.00</p>
              <p class="stat-change negative">Tracked expenses</p>
            </div>
            <div class="stat-card financial-card">
              <div class="stat-header">
                <h3 class="stat-title">Baki Semasa</h3>
                <span class="stat-icon">&#128200;</span>
              </div>
              <p class="stat-value" id="ftn-newest-net-balance">RM 0.00</p>
              <p class="stat-change" id="ftn-newest-balance-info">Awaiting activity</p>
            </div>
          </div>

          <div class="financial-actions">
            <div class="action-buttons" style="display:flex;flex-wrap:wrap;gap:20px;margin:30px 0;">
              <button class="action-btn primary-action" data-view-target="income">
                <span>&#10133;</span> Money In
              </button>
              <button class="action-btn primary-action" data-view-target="expense">
                <span>&#10134;</span> Money Out
              </button>
              <div style="width:100%;height:8px;"></div>
              <button class="action-btn" data-action="generate-income-report">
                <span>&#128202;</span> Generate Income Report
              </button>
              <button class="action-btn" data-action="generate-expense-report">
                <span>&#128200;</span> Generate Expense Report
              </button>
              <button class="action-btn" data-action="export">
                <span>&#128190;</span> Export Financial Data
              </button>
              <button class="action-btn" data-view-target="transactions">
                <span>&#128197;</span> Show All Transactions
              </button>
            </div>
          </div>
        </section>

        <section class="sub-content-section" data-view="income">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-view-target="overview">
                <span>&larr;</span> Back to Overview
              </button>
              <h3 class="section-title">Money In - Add Income Entry</h3>
            </div>
            <p class="section-description">Record incoming funds with relevant context and references.</p>
          </div>

          <div class="form-container">
            <form id="ftn-newest-income-form" class="income-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="ftn-newest-income-date" class="form-label">Date</label>
                  <input type="date" id="ftn-newest-income-date" name="date" class="form-input" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-income-source" class="form-label">Income Source</label>
                  <input type="text" id="ftn-newest-income-source" name="source" class="form-input" placeholder="Client, donor, or reference" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-income-category" class="form-label">Category</label>
                  <select id="ftn-newest-income-category" name="category" class="form-select" required>
                    <option value="">Select Category</option>
                    <option value="sales-revenue">Sales Revenue</option>
                    <option value="service-income">Service Income</option>
                    <option value="grants-funding">Grants & Funding</option>
                    <option value="donations">Donations</option>
                    <option value="investment-returns">Investment Returns</option>
                    <option value="rental-income">Rental Income</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-income-amount" class="form-label">Amount (RM)</label>
                  <input type="number" step="0.01" min="0" id="ftn-newest-income-amount" name="amount" class="form-input" placeholder="0.00" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-income-method" class="form-label">Payment Method</label>
                  <select id="ftn-newest-income-method" name="paymentMethod" class="form-select" required>
                    <option value="">Select Method</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="online-payment">Online Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-income-reference" class="form-label">Reference Number</label>
                  <input type="text" id="ftn-newest-income-reference" name="reference" class="form-input" placeholder="Invoice or receipt number">
                </div>
              </div>

              <div class="form-group">
                <label for="ftn-newest-income-description" class="form-label">Description</label>
                <textarea id="ftn-newest-income-description" name="description" class="form-textarea" rows="3" placeholder="Additional notes about this income"></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="ftn-newest-income-clear">
                  <span class="btn-icon">&#10006;</span> Clear Form
                </button>
                <button type="submit" class="btn btn-primary" id="ftn-newest-income-submit">
                  <span class="btn-icon">&#128190;</span> Save Income Entry
                </button>
              </div>

              <div class="form-message" id="ftn-newest-income-message" style="display:none;"></div>
            </form>
          </div>
        </section>

        <section class="sub-content-section" data-view="expense">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-view-target="overview">
                <span>&larr;</span> Back to Overview
              </button>
              <h3 class="section-title">Money Out - Add Expense Entry</h3>
            </div>
            <p class="section-description">Capture outgoing payments for better spending visibility.</p>
          </div>

          <div class="form-container">
            <form id="ftn-newest-expense-form" class="expense-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="ftn-newest-expense-date" class="form-label">Date</label>
                  <input type="date" id="ftn-newest-expense-date" name="date" class="form-input" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-expense-vendor" class="form-label">Vendor / Payee</label>
                  <input type="text" id="ftn-newest-expense-vendor" name="vendor" class="form-input" placeholder="Supplier or person" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-expense-category" class="form-label">Category</label>
                  <select id="ftn-newest-expense-category" name="category" class="form-select" required>
                    <option value="">Select Category</option>
                    <option value="operating-expenses">Operating Expenses</option>
                    <option value="staff-salaries">Staff Salaries</option>
                    <option value="equipment-supplies">Equipment & Supplies</option>
                    <option value="marketing-advertising">Marketing & Advertising</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent-facilities">Rent & Facilities</option>
                    <option value="professional-services">Professional Services</option>
                    <option value="travel-transport">Travel & Transport</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-expense-amount" class="form-label">Amount (RM)</label>
                  <input type="number" step="0.01" min="0" id="ftn-newest-expense-amount" name="amount" class="form-input" placeholder="0.00" required>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-expense-method" class="form-label">Payment Method</label>
                  <select id="ftn-newest-expense-method" name="paymentMethod" class="form-select" required>
                    <option value="">Select Method</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="online-payment">Online Payment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="ftn-newest-expense-reference" class="form-label">Reference Number</label>
                  <input type="text" id="ftn-newest-expense-reference" name="reference" class="form-input" placeholder="Invoice or receipt number">
                </div>
              </div>

              <div class="form-group">
                <label for="ftn-newest-expense-description" class="form-label">Description</label>
                <textarea id="ftn-newest-expense-description" name="description" class="form-textarea" rows="3" placeholder="Additional notes about this expense"></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="ftn-newest-expense-clear">
                  <span class="btn-icon">&#10006;</span> Clear Form
                </button>
                <button type="submit" class="btn btn-primary" id="ftn-newest-expense-submit">
                  <span class="btn-icon">&#128190;</span> Save Expense Entry
                </button>
              </div>

              <div class="form-message" id="ftn-newest-expense-message" style="display:none;"></div>
            </form>
          </div>
        </section>

        <section class="sub-content-section" data-view="transactions">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-view-target="overview">
                <span>&larr;</span> Back to Overview
              </button>
              <h3 class="section-title">All Transactions</h3>
            </div>
            <p class="section-description">Combined timeline of income and expense records with quick filters.</p>
          </div>

          <div class="filters-container">
            <div class="filter-group">
              <label for="ftn-newest-transaction-type">Type</label>
              <select id="ftn-newest-transaction-type" class="form-select">
                <option value="all">All</option>
                <option value="income">Money In</option>
                <option value="expense">Money Out</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="ftn-newest-transaction-date">Date</label>
              <input type="date" id="ftn-newest-transaction-date" class="form-input">
            </div>
            <button class="btn btn-secondary" id="ftn-newest-transaction-reset">Reset</button>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount (RM)</th>
                </tr>
              </thead>
              <tbody id="ftn-newest-transaction-body">
                <tr>
                  <td colspan="5" class="loading-text">Loading transactions...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }
  async initialize() {
    this.root = document.getElementById('financial-tracking-newest-content');
    if (!this.root) {
      console.error('FinancialTrackingNewest: container not found');
      return;
    }
    this.cacheDom();
    this.setupNavigation();
    this.setupActions();
    this.setupFormHandlers();
    this.setupTransactionFilters();
    await this.refreshSummary();
  }

  cacheDom() {
    this.root.querySelectorAll('.sub-content-section').forEach(section => {
      this.sections[section.dataset.view] = section;
    });
    this.summaryEls = {
      income: this.root.querySelector(`#${NEWEST_PREFIX}-total-income`),
      expense: this.root.querySelector(`#${NEWEST_PREFIX}-total-expense`),
      balance: this.root.querySelector(`#${NEWEST_PREFIX}-net-balance`),
      info: this.root.querySelector(`#${NEWEST_PREFIX}-balance-info`)
    };
    this.forms = {
      income: this.root.querySelector(`#${NEWEST_PREFIX}-income-form`),
      expense: this.root.querySelector(`#${NEWEST_PREFIX}-expense-form`)
    };
    this.messages = {
      income: this.root.querySelector(`#${NEWEST_PREFIX}-income-message`),
      expense: this.root.querySelector(`#${NEWEST_PREFIX}-expense-message`)
    };
    this.buttons = {
      incomeSubmit: this.root.querySelector(`#${NEWEST_PREFIX}-income-submit`),
      expenseSubmit: this.root.querySelector(`#${NEWEST_PREFIX}-expense-submit`)
    };
    this.transactionBody = this.root.querySelector(`#${NEWEST_PREFIX}-transaction-body`);
    this.transactionFilters = {
      type: this.root.querySelector(`#${NEWEST_PREFIX}-transaction-type`),
      date: this.root.querySelector(`#${NEWEST_PREFIX}-transaction-date`),
      reset: this.root.querySelector(`#${NEWEST_PREFIX}-transaction-reset`)
    };
  }

  setupNavigation() {
    const triggers = this.root.querySelectorAll('[data-view-target]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', event => {
        event.preventDefault();
        this.showSection(trigger.getAttribute('data-view-target'));
      });
    });
  }

  showSection(view) {
    if (!this.sections[view]) {
      return;
    }
    Object.entries(this.sections).forEach(([key, section]) => {
      section.classList.toggle('active', key === view);
    });
    if (view === 'overview') {
      this.refreshSummary();
    }
    if (view === 'income') {
      this.setDefaultDate(`${NEWEST_PREFIX}-income-date`);
    }
    if (view === 'expense') {
      this.setDefaultDate(`${NEWEST_PREFIX}-expense-date`);
    }
    if (view === 'transactions') {
      this.loadTransactions();
    }
  }

  setupActions() {
    const actionButtons = this.root.querySelectorAll('[data-action]');
    actionButtons.forEach(button => {
      const action = button.getAttribute('data-action');
      button.addEventListener('click', event => {
        event.preventDefault();
        this.handleAction(action);
      });
    });
  }

  handleAction(action) {
    const messages = {
      'generate-income-report': 'Income report generation will be available soon.',
      'generate-expense-report': 'Expense report generation will be available soon.',
      export: 'Export functionality will be available soon.'
    };
    alert(messages[action] || 'Feature coming soon.');
  }

  setupFormHandlers() {
    const incomeForm = this.forms.income;
    if (incomeForm && !incomeForm.dataset.listenersAttached) {
      incomeForm.addEventListener('submit', event => {
        event.preventDefault();
        this.handleIncomeSubmit();
      });
      const clearBtn = this.root.querySelector(`#${NEWEST_PREFIX}-income-clear`);
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.resetForm('income'));
      }
      const amountInput = this.root.querySelector(`#${NEWEST_PREFIX}-income-amount`);
      if (amountInput) {
        amountInput.addEventListener('input', () => this.ensureNonNegative(amountInput));
      }
      incomeForm.dataset.listenersAttached = 'true';
      this.setDefaultDate(`${NEWEST_PREFIX}-income-date`);
    }

    const expenseForm = this.forms.expense;
    if (expenseForm && !expenseForm.dataset.listenersAttached) {
      expenseForm.addEventListener('submit', event => {
        event.preventDefault();
        this.handleExpenseSubmit();
      });
      const clearBtn = this.root.querySelector(`#${NEWEST_PREFIX}-expense-clear`);
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.resetForm('expense'));
      }
      const amountInput = this.root.querySelector(`#${NEWEST_PREFIX}-expense-amount`);
      if (amountInput) {
        amountInput.addEventListener('input', () => this.ensureNonNegative(amountInput));
      }
      expenseForm.dataset.listenersAttached = 'true';
      this.setDefaultDate(`${NEWEST_PREFIX}-expense-date`);
    }
  }

  setupTransactionFilters() {
    if (this.transactionFilters.type) {
      this.transactionFilters.type.addEventListener('change', () => this.applyTransactionFilters());
    }
    if (this.transactionFilters.date) {
      this.transactionFilters.date.addEventListener('change', () => this.applyTransactionFilters());
    }
    if (this.transactionFilters.reset) {
      this.transactionFilters.reset.addEventListener('click', () => {
        if (this.transactionFilters.type) this.transactionFilters.type.value = 'all';
        if (this.transactionFilters.date) this.transactionFilters.date.value = '';
        this.applyTransactionFilters();
      });
    }
  }
  async handleIncomeSubmit() {
    const data = this.getIncomeData();
    const validation = this.validateIncome(data);
    if (!validation.valid) {
      this.setFormMessage('income', validation.message, 'error');
      return;
    }
    this.setSubmitState('income', true);
    try {
      await this.saveIncome(data);
      this.setFormMessage('income', 'Income entry saved successfully.', 'success');
      this.resetForm('income');
      await this.refreshSummary();
      this.state.transactions = [];
      if (this.sections.transactions && this.sections.transactions.classList.contains('active')) {
        await this.loadTransactions(true);
      }
    } catch (error) {
      console.error('FinancialTrackingNewest: income save failed', error);
      this.setFormMessage('income', 'Error saving income entry. Please try again.', 'error');
    } finally {
      this.setSubmitState('income', false);
    }
  }

  async handleExpenseSubmit() {
    const data = this.getExpenseData();
    const validation = this.validateExpense(data);
    if (!validation.valid) {
      this.setFormMessage('expense', validation.message, 'error');
      return;
    }
    this.setSubmitState('expense', true);
    try {
      await this.saveExpense(data);
      this.setFormMessage('expense', 'Expense entry saved successfully.', 'success');
      this.resetForm('expense');
      await this.refreshSummary();
      this.state.transactions = [];
      if (this.sections.transactions && this.sections.transactions.classList.contains('active')) {
        await this.loadTransactions(true);
      }
    } catch (error) {
      console.error('FinancialTrackingNewest: expense save failed', error);
      this.setFormMessage('expense', 'Error saving expense entry. Please try again.', 'error');
    } finally {
      this.setSubmitState('expense', false);
    }
  }

  getIncomeData() {
    return {
      date: this.getFieldValue(`${NEWEST_PREFIX}-income-date`),
      source: this.getFieldValue(`${NEWEST_PREFIX}-income-source`),
      category: this.getFieldValue(`${NEWEST_PREFIX}-income-category`),
      amount: parseFloat(this.getFieldValue(`${NEWEST_PREFIX}-income-amount`)),
      paymentMethod: this.getFieldValue(`${NEWEST_PREFIX}-income-method`),
      reference: this.getFieldValue(`${NEWEST_PREFIX}-income-reference`),
      description: this.getFieldValue(`${NEWEST_PREFIX}-income-description`)
    };
  }

  getExpenseData() {
    return {
      date: this.getFieldValue(`${NEWEST_PREFIX}-expense-date`),
      vendor: this.getFieldValue(`${NEWEST_PREFIX}-expense-vendor`),
      category: this.getFieldValue(`${NEWEST_PREFIX}-expense-category`),
      amount: parseFloat(this.getFieldValue(`${NEWEST_PREFIX}-expense-amount`)),
      paymentMethod: this.getFieldValue(`${NEWEST_PREFIX}-expense-method`),
      reference: this.getFieldValue(`${NEWEST_PREFIX}-expense-reference`),
      description: this.getFieldValue(`${NEWEST_PREFIX}-expense-description`)
    };
  }

  validateIncome(data) {
    const errors = [];
    if (!data.date) errors.push('Date is required');
    if (!data.source || data.source.length < 2) errors.push('Income source must be at least 2 characters');
    if (!data.category) errors.push('Category is required');
    if (!data.paymentMethod) errors.push('Payment method is required');
    if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
    if (this.isFuture(data.date)) errors.push('Date cannot be in the future');
    return errors.length ? { valid: false, message: errors.join('. ') } : { valid: true };
  }

  validateExpense(data) {
    const errors = [];
    if (!data.date) errors.push('Date is required');
    if (!data.vendor || data.vendor.length < 2) errors.push('Vendor / Payee must be at least 2 characters');
    if (!data.category) errors.push('Category is required');
    if (!data.paymentMethod) errors.push('Payment method is required');
    if (!data.amount || data.amount <= 0) errors.push('Amount must be greater than 0');
    if (this.isFuture(data.date)) errors.push('Date cannot be in the future');
    return errors.length ? { valid: false, message: errors.join('. ') } : { valid: true };
  }

  async saveIncome(data) {
    const { collection, addDoc } = await import('firebase/firestore');
    const { db } = await import('../../services/database/firebase.js');
    const { COLLECTIONS, addStandardFields } = await import('../../services/database/collections.js');
    const docData = addStandardFields({
      ...data,
      type: 'income',
      amount: Number(data.amount) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await addDoc(collection(db, COLLECTIONS.FINANCIAL_INCOME), docData);
  }

  async saveExpense(data) {
    const { collection, addDoc } = await import('firebase/firestore');
    const { db } = await import('../../services/database/firebase.js');
    const { COLLECTIONS, addStandardFields } = await import('../../services/database/collections.js');
    const docData = addStandardFields({
      ...data,
      type: 'expense',
      amount: Number(data.amount) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await addDoc(collection(db, COLLECTIONS.FINANCIAL_EXPENSES), docData);
  }
  setFormMessage(key, message, type) {
    const element = this.messages[key];
    if (!element) return;
    element.className = `form-message ${type}`;
    element.textContent = message;
    element.style.display = 'block';
    window.setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }

  resetForm(key) {
    const form = this.forms[key];
    if (!form) return;
    form.reset();
    const dateId = key === 'income' ? `${NEWEST_PREFIX}-income-date` : `${NEWEST_PREFIX}-expense-date`;
    this.setDefaultDate(dateId);
    const message = this.messages[key];
    if (message) {
      message.style.display = 'none';
    }
  }

  setSubmitState(key, saving) {
    const button = key === 'income' ? this.buttons.incomeSubmit : this.buttons.expenseSubmit;
    if (!button) return;
    if (saving) {
      button.disabled = true;
      button.dataset.originalText = button.dataset.originalText || button.textContent;
      button.textContent = 'Saving...';
    } else {
      button.disabled = false;
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText;
      }
    }
  }

  async refreshSummary() {
    try {
      const totals = await this.fetchTotals();
      this.updateSummary(totals);
    } catch (error) {
      console.error('FinancialTrackingNewest: summary load failed', error);
      this.updateSummary({ income: 0, expense: 0, balance: 0, info: 'Unable to load summary' });
    }
  }

  async fetchTotals() {
    const { collection, getDocs, query } = await import('firebase/firestore');
    const { db } = await import('../../services/database/firebase.js');
    const { COLLECTIONS, createEnvFilter } = await import('../../services/database/collections.js');

    let totalIncome = 0;
    let totalExpense = 0;

    try {
      const incomeSnapshot = await getDocs(query(collection(db, COLLECTIONS.FINANCIAL_INCOME), createEnvFilter()));
      totalIncome = incomeSnapshot.docs.reduce((sum, doc) => {
        const amount = parseFloat(doc.data().amount);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0);
    } catch (error) {
      console.warn('FinancialTrackingNewest: income total unavailable', error.message);
    }

    try {
      const expenseSnapshot = await getDocs(query(collection(db, COLLECTIONS.FINANCIAL_EXPENSES), createEnvFilter()));
      totalExpense = expenseSnapshot.docs.reduce((sum, doc) => {
        const amount = parseFloat(doc.data().amount);
        return sum + (Number.isFinite(amount) ? amount : 0);
      }, 0);
    } catch (error) {
      console.warn('FinancialTrackingNewest: expense total unavailable', error.message);
    }

    const balance = totalIncome - totalExpense;
    return {
      income: totalIncome,
      expense: totalExpense,
      balance,
      info:
        totalIncome === 0 && totalExpense === 0
          ? 'No transactions recorded yet.'
          : balance >= 0
            ? `Surplus of ${this.formatCurrency(balance)}`
            : `Deficit of ${this.formatCurrency(Math.abs(balance))}`
    };
  }

  updateSummary(totals) {
    if (this.summaryEls.income) {
      this.summaryEls.income.textContent = this.formatCurrency(totals.income || 0);
    }
    if (this.summaryEls.expense) {
      this.summaryEls.expense.textContent = this.formatCurrency(totals.expense || 0);
    }
    if (this.summaryEls.balance) {
      this.summaryEls.balance.textContent = this.formatCurrency(totals.balance || 0);
    }
    if (this.summaryEls.info) {
      this.summaryEls.info.textContent = totals.info || 'Summary unavailable.';
      const classes = ['positive', 'negative', 'neutral'];
      this.summaryEls.info.classList.remove(...classes);
      const clazz = totals.balance > 0 ? 'positive' : totals.balance < 0 ? 'negative' : 'neutral';
      this.summaryEls.info.classList.add(clazz);
    }
  }

  async loadTransactions(force = false) {
    if (!force && this.state.transactions.length) {
      this.applyTransactionFilters();
      return;
    }

    try {
      const { collection, getDocs, query } = await import('firebase/firestore');
      const { db } = await import('../../services/database/firebase.js');
      const { COLLECTIONS, createEnvFilter } = await import('../../services/database/collections.js');

      const [incomeSnapshot, expenseSnapshot] = await Promise.all([
        getDocs(query(collection(db, COLLECTIONS.FINANCIAL_INCOME), createEnvFilter())),
        getDocs(query(collection(db, COLLECTIONS.FINANCIAL_EXPENSES), createEnvFilter()))
      ]);

      const incomeTransactions = incomeSnapshot.docs.map(doc => this.transformTransaction(doc, 'income'));
      const expenseTransactions = expenseSnapshot.docs.map(doc => this.transformTransaction(doc, 'expense'));

      this.state.transactions = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      this.applyTransactionFilters();
    } catch (error) {
      console.error('FinancialTrackingNewest: transactions failed', error);
      if (this.transactionBody) {
        this.transactionBody.innerHTML = `
          <tr>
            <td colspan="5" class="error-text">Unable to load transactions.</td>
          </tr>
        `;
      }
    }
  }

  transformTransaction(doc, type) {
    const data = doc.data();
    const date = this.normalizeDate(data.date || data.createdAt || new Date());
    return {
      id: doc.id,
      type,
      category: data.category || 'Uncategorised',
      description:
        type === 'income'
          ? data.source || data.description || 'Income entry'
          : data.vendor || data.description || 'Expense entry',
      amount: parseFloat(data.amount) || 0,
      date,
      isoDate: this.formatDate(date, 'iso'),
      displayDate: this.formatDate(date, 'display')
    };
  }

  applyTransactionFilters() {
    if (!this.transactionBody) {
      return;
    }
    let list = [...this.state.transactions];
    const typeFilter = this.transactionFilters.type?.value || 'all';
    const dateFilter = this.transactionFilters.date?.value || '';

    if (typeFilter !== 'all') {
      list = list.filter(item => item.type === typeFilter);
    }
    if (dateFilter) {
      list = list.filter(item => item.isoDate === dateFilter);
    }

    this.renderTransactions(list);
  }
  renderTransactions(transactions) {
    if (!this.transactionBody) {
      return;
    }
    if (!transactions.length) {
      this.transactionBody.innerHTML = `
        <tr>
          <td colspan="5" class="loading-text">No transactions found for the selected filters.</td>
        </tr>
      `;
      return;
    }

    this.transactionBody.innerHTML = transactions
      .map(item => {
        const typeLabel = item.type === 'income' ? 'Money In' : 'Money Out';
        const amountClass = item.type === 'income' ? 'positive' : 'negative';
        return `
          <tr>
            <td>${item.displayDate}</td>
            <td><span class="status-badge ${amountClass}">${typeLabel}</span></td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${this.formatCurrency(item.amount)}</td>
          </tr>
        `;
      })
      .join('');
  }

  ensureNonNegative(input) {
    if (!input) return;
    const value = parseFloat(input.value);
    if (Number.isFinite(value) && value < 0) {
      input.value = 0;
    }
  }

  getFieldValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
  }

  setDefaultDate(id) {
    const element = document.getElementById(id);
    if (element && !element.value) {
      element.value = this.getToday();
    }
  }

  getToday() {
    return new Date().toISOString().split('T')[0];
  }

  isFuture(dateString) {
    if (!dateString) return false;
    const selected = new Date(dateString);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected.getTime() > today.getTime();
  }

  formatDate(date, mode) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return mode === 'iso' ? '' : 'Unknown date';
    }
    if (mode === 'iso') {
      return date.toISOString().split('T')[0];
    }
    return date.toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(value) {
    const amount = Number.isFinite(value) ? value : 0;
    return `RM ${amount.toLocaleString('en-MY', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  normalizeDate(value) {
    if (!value) return new Date();
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    if (value.toDate && typeof value.toDate === 'function') {
      return value.toDate();
    }
    if (value.seconds) {
      return new Date(value.seconds * 1000);
    }
    return new Date();
  }
}

window.financialTrackingNewest = null;
