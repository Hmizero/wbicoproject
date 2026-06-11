// app.js - UI Controller & Event Wireframe

import store from './store.js';

// --- State Variables ---
let cart = [];
let currentCategory = 'all';
let searchQuery = '';
let currentSort = 'default';
let activeDashboardTab = 'overview';
const rwandanPhone = '250788830376'; // Primary contact WhatsApp: +250 788 830 376

// --- Bank Service Parameters ---
const BANK_DETAILS = {
  BK: {
    name: 'Bank of Kigali (BK)',
    logoClass: 'bk-theme',
    desc: 'Authorized Level 1 BK Agency banking desk.',
    limits: 'Max transaction: 5,000,000 RWF per day.',
    processTime: 'Instant real-time account posting.',
    fees: {
      deposit: '0 RWF (Free)',
      withdraw: 'Tiered from 100 RWF to 2,000 RWF depending on amount.',
      school: '100 RWF standard commission per payment slip.'
    },
    requirements: 'National ID card or passport, account number, or student ID (for school fees).'
  },
  Equity: {
    name: 'Equity Bank',
    logoClass: 'equity-theme',
    desc: 'Equity Agent & Ewuza agency point.',
    limits: 'Max daily cashout: 3,000,000 RWF.',
    processTime: 'Instant notification on mobile/card.',
    fees: {
      deposit: '0 RWF (Free)',
      withdraw: 'Standard Equity agent rates apply.',
      school: 'Free for designated partner institutions.'
    },
    requirements: 'Equity Card or mobile phone with active Equitel/Equity App, National ID.'
  },
  BPR: {
    name: 'BPR Bank (KCB Group)',
    logoClass: 'bpr-theme',
    desc: 'Licensed merchant agency for BPR retail transactions.',
    limits: 'Max deposit: Unlimited; Max withdrawal: 2,000,000 RWF daily.',
    processTime: '1 - 5 minutes account credit.',
    fees: {
      deposit: '0 RWF',
      withdraw: 'Tiered agent transaction charges.',
      school: 'Free using KCB school billing codes.'
    },
    requirements: 'Account name validation, National ID check for withdrawals.'
  },
  Ecobank: {
    name: 'Ecobank',
    logoClass: 'ecobank-theme',
    desc: 'Ecobank Xpress Point terminal for pan-African client services.',
    limits: 'Max daily withdrawal: 1,500,000 RWF.',
    processTime: 'Instant digital wallet update.',
    fees: {
      deposit: '0 RWF',
      withdraw: 'Ecobank Xpress transfer cashout fees apply.',
      school: '150 RWF per utility transaction.'
    },
    requirements: 'Xpress Cash token, account number, or registered phone number.'
  },
  IM: {
    name: 'I&M Bank',
    logoClass: 'im-theme',
    desc: 'Specialist trust payouts and RRA Tax payment desk.',
    limits: 'RRA payment: Unlimited; Cash withdrawals: 3,000,000 RWF.',
    processTime: 'Instant receipt generation for RRA.',
    fees: {
      deposit: '0 RWF',
      withdraw: 'Standard I&M partner agent commissions.',
      school: 'N/A (Primarily tax and business accounts).'
    },
    requirements: 'TIN / Reference document for RRA taxes, account details, National ID.'
  }
};

// --- DOM ELEMENTS ---
const elements = {
  // Views
  customerView: document.getElementById('customer-view'),
  adminView: document.getElementById('admin-view'),
  
  // Navigation / Auth
  openLoginBtn: document.getElementById('open-login-btn'),
  loginModal: document.getElementById('login-modal'),
  loginModalClose: document.getElementById('login-modal-close'),
  loginForm: document.getElementById('admin-login-form'),
  loginErrorBox: document.getElementById('login-error-box'),
  loginErrorMsg: document.getElementById('login-error-msg'),
  logoutBtn: document.getElementById('logout-btn'),
  switchViewBtn: document.getElementById('switch-view-btn'),
  adminUserDisplay: document.getElementById('admin-user-display'),

  // Banking
  bankInfoModal: document.getElementById('bank-info-modal'),
  bankModalClose: document.getElementById('bank-modal-close'),
  bankModalCloseBtn: document.getElementById('bank-modal-close-btn'),
  bankModalTitle: document.getElementById('bank-modal-title'),
  bankModalBody: document.getElementById('bank-modal-body'),
  calcBank: document.getElementById('calc-bank'),
  calcType: document.getElementById('calc-type'),
  calcAmount: document.getElementById('calc-amount'),
  calcBtn: document.getElementById('calc-btn'),
  calcResult: document.getElementById('calculator-result'),

  // Storefront Catalog
  productsCatalog: document.getElementById('products-catalog'),
  storeSearch: document.getElementById('store-search'),
  categoryTabs: document.getElementById('category-tabs-container'),
  storeSort: document.getElementById('store-sort'),

  // Cart
  cartToggleBtn: document.getElementById('cart-toggle-btn'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartCloseBtn: document.getElementById('cart-close-btn'),
  cartItemsContainer: document.getElementById('cart-items-container'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  cartCount: document.querySelectorAll('.cart-count'),
  checkoutWhatsappBtn: document.getElementById('checkout-inquiry-btn'),
  checkoutEmailBtn: document.getElementById('checkout-email-btn'),

  // Quick inquiry form
  heroInquiryForm: document.getElementById('hero-inquiry-form'),

  // Admin Sidebar tabs
  sidebarTabs: document.querySelectorAll('.sidebar-tab-btn'),
  dbTabPanels: document.querySelectorAll('.db-tab-panel'),

  // Admin Dashboard Tabs: Overview
  metricTotalProducts: document.getElementById('metric-total-products'),
  metricLowStock: document.getElementById('metric-low-stock'),
  metricLowStockCard: document.getElementById('metric-low-stock-card'),
  metricTotalCost: document.getElementById('metric-total-cost'),
  metricTotalValue: document.getElementById('metric-total-value'),
  lowStockAlertsList: document.getElementById('low-stock-alerts-list'),
  quickStockForm: document.getElementById('quick-stock-logger-form'),
  logProductId: document.getElementById('log-product-id'),
  logType: document.getElementById('log-type'),
  logQuantity: document.getElementById('log-quantity'),
  logPrice: document.getElementById('log-price'),
  logPriceHint: document.getElementById('log-price-hint'),
  logNotes: document.getElementById('log-notes'),

  // Admin Dashboard Tabs: Products CRUD
  addProductBtn: document.getElementById('add-product-btn'),
  dbProductsSearch: document.getElementById('db-products-search'),
  dbProductsFilterCategory: document.getElementById('db-products-filter-category'),
  dbProductsList: document.getElementById('db-products-list'),
  productModal: document.getElementById('product-modal'),
  productModalClose: document.getElementById('product-modal-close'),
  productModalCancelBtn: document.getElementById('product-modal-cancel-btn'),
  productModalSaveBtn: document.getElementById('product-modal-save-btn'),
  productModalTitle: document.getElementById('product-modal-title'),
  productCrudForm: document.getElementById('product-crud-form'),
  crudStockGroup: document.getElementById('crud-stock-group'),

  // Admin Dashboard Tabs: Transactions
  dbTxSearch: document.getElementById('db-tx-search'),
  dbTxFilterType: document.getElementById('db-tx-filter-type'),
  dbTransactionsList: document.getElementById('db-transactions-list')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  
  // Load local state & trigger first render
  const initialState = store.state;
  renderProducts(initialState.products);
  renderCart();
  
  // Set up store subscription for live reactivity
  store.subscribe((state) => {
    renderProducts(state.products);
    renderCart();
    renderDashboard(state);
    
    // Manage login status routing
    if (state.currentUser) {
      elements.adminUserDisplay.textContent = state.currentUser.username;
      elements.openLoginBtn.innerHTML = `<i class="fa-solid fa-gauge"></i> <span>Dashboard</span>`;
    } else {
      elements.openLoginBtn.innerHTML = `<i class="fa-solid fa-user-gear"></i> <span>Staff Login</span>`;
    }
  });

  // Check session on load
  if (store.getCurrentUser()) {
    elements.adminUserDisplay.textContent = store.getCurrentUser().username;
    elements.openLoginBtn.innerHTML = `<i class="fa-solid fa-gauge"></i> <span>Dashboard</span>`;
  }
});

// --- STATE-TO-UI BINDINGS ---
function initEventListeners() {
  // Navigation / Navigation Clicks
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSec = document.querySelector(targetId);
      
      document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      window.scrollTo({
        top: targetSec.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });

  // Client Cart Drawer Open/Close
  elements.cartToggleBtn.addEventListener('click', toggleCartDrawer);
  elements.cartCloseBtn.addEventListener('click', toggleCartDrawer);
  elements.customerView.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-drawer-overlay')) {
      toggleCartDrawer();
    }
  });

  // Login Modal Events
  elements.openLoginBtn.addEventListener('click', () => {
    const user = store.getCurrentUser();
    if (user) {
      // Direct routing if already logged in
      switchToView('admin');
    } else {
      openModal(elements.loginModal);
    }
  });
  elements.loginModalClose.addEventListener('click', () => closeModal(elements.loginModal));
  elements.loginModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal(elements.loginModal);
  });

  // Login Form Submission
  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value;
    
    const result = store.login(userVal, passVal);
    if (result.success) {
      elements.loginErrorBox.classList.add('hidden');
      elements.loginForm.reset();
      closeModal(elements.loginModal);
      switchToView('admin');
    } else {
      elements.loginErrorMsg.textContent = result.message;
      elements.loginErrorBox.classList.remove('hidden');
    }
  });

  // Logout Actions
  elements.logoutBtn.addEventListener('click', () => {
    store.logout();
    switchToView('customer');
  });

  elements.switchViewBtn.addEventListener('click', () => {
    switchToView('customer');
  });

  // Agent Banking Service Modals
  document.querySelectorAll('.bank-info-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const bankId = btn.getAttribute('data-bank-id');
      const data = BANK_DETAILS[bankId];
      if (data) {
        elements.bankModalTitle.textContent = data.name;
        elements.bankModalBody.innerHTML = `
          <div class="modal-bank-info-wrapper">
            <p class="mb-desc"><strong>Description:</strong> ${data.desc}</p>
            <div class="mb-grid">
              <div class="mb-item">
                <h5>Daily Limits</h5>
                <p>${data.limits}</p>
              </div>
              <div class="mb-item">
                <h5>Processing Speed</h5>
                <p>${data.processTime}</p>
              </div>
            </div>
            <div class="mb-fees-block">
              <h5>Transaction Fees</h5>
              <ul>
                <li><strong>Cash Deposit:</strong> ${data.fees.deposit}</li>
                <li><strong>Cash Withdrawal:</strong> ${data.fees.withdraw}</li>
                <li><strong>School Fees / Utility:</strong> ${data.fees.school}</li>
              </ul>
            </div>
            <p class="mb-req"><strong>Required Documents:</strong> ${data.requirements}</p>
          </div>
        `;
        openModal(elements.bankInfoModal);
      }
    });
  });

  elements.bankModalClose.addEventListener('click', () => closeModal(elements.bankInfoModal));
  elements.bankModalCloseBtn.addEventListener('click', () => closeModal(elements.bankInfoModal));
  elements.bankInfoModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal(elements.bankInfoModal);
  });

  // Banking Fee Calculator
  elements.calcBtn.addEventListener('click', runFeeCalculation);
  elements.calcAmount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') runFeeCalculation();
  });

  // Stationery Category Tabs Filter
  elements.categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
      document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-category');
      renderProducts(store.getProducts());
    }
  });

  // Stationery Search
  elements.storeSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderProducts(store.getProducts());
  });

  // Stationery Sort
  elements.storeSort.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderProducts(store.getProducts());
  });

  // Checkout Actions
  elements.checkoutWhatsappBtn.addEventListener('click', () => checkoutOrder('whatsapp'));
  elements.checkoutEmailBtn.addEventListener('click', () => checkoutOrder('email'));

  // Quick Hero inquiry Form
  elements.heroInquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inq-name').value;
    const email = document.getElementById('inq-email').value;
    const msg = document.getElementById('inq-msg').value;

    const message = `Hello Wide Business Investment, my name is ${name} (${email}). I have an inquiry: ${msg}`;
    const url = `https://wa.me/${rwandanPhone}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    elements.heroInquiryForm.reset();
    alert('Thank you! Redirecting to WhatsApp to send your inquiry.');
  });

  // --- ADMIN DASHBOARD EVENTS ---
  
  // Dashboard Sidebar Navigation tabs
  elements.sidebarTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.sidebarTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeDashboardTab = btn.getAttribute('data-tab');
      elements.dbTabPanels.forEach(p => p.classList.remove('active'));
      
      const targetPanel = document.getElementById(`db-panel-${activeDashboardTab}`);
      if (targetPanel) targetPanel.classList.add('active');
      
      renderDashboard(store.state);
    });
  });

  // Quick Stock transaction form product-specific price autofill hint
  elements.logProductId.addEventListener('change', (e) => {
    const prod = store.getProductById(e.target.value);
    if (prod) {
      elements.logPrice.value = elements.logType.value === 'purchase' ? prod.costPrice : prod.price;
      elements.logPriceHint.textContent = `Standard price: ${elements.logPrice.value} RWF`;
    }
  });
  elements.logType.addEventListener('change', (e) => {
    const prod = store.getProductById(elements.logProductId.value);
    if (prod) {
      elements.logPrice.value = e.target.value === 'purchase' ? prod.costPrice : prod.price;
      elements.logPriceHint.textContent = `Standard price: ${elements.logPrice.value} RWF`;
    }
  });

  // Submit Quick Stock transaction log
  elements.quickStockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const prodId = elements.logProductId.value;
    const type = elements.logType.value;
    const qty = parseInt(elements.logQuantity.value);
    const price = parseInt(elements.logPrice.value);
    const notes = elements.logNotes.value.trim();

    const result = store.recordTransaction(prodId, type, qty, price, notes);
    if (result.success) {
      elements.quickStockForm.reset();
      alert(`Stock transaction successfully logged! Updated stock level: ${result.product.stock}`);
      // Populate defaults again for the price field
      const nextProd = store.getProductById(elements.logProductId.value);
      if (nextProd) elements.logPrice.value = nextProd.price;
    } else {
      alert(`Error: ${result.message}`);
    }
  });

  // Admin Search / Category filter in registry
  elements.dbProductsSearch.addEventListener('input', () => renderDashboardProductsList());
  elements.dbProductsFilterCategory.addEventListener('change', () => renderDashboardProductsList());

  // Add Product Button
  elements.addProductBtn.addEventListener('click', () => {
    elements.productModalTitle.textContent = 'Add New Product';
    elements.productCrudForm.reset();
    document.getElementById('crud-product-id').value = '';
    elements.crudStockGroup.classList.remove('hidden'); // Show initial stock input
    openModal(elements.productModal);
  });

  elements.productModalClose.addEventListener('click', () => closeModal(elements.productModal));
  elements.productModalCancelBtn.addEventListener('click', () => closeModal(elements.productModal));
  elements.productModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal(elements.productModal);
  });

  // Submit CRUD product form (Add or Edit)
  elements.productCrudForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('crud-product-id').value;
    
    const prodData = {
      name: document.getElementById('crud-name').value.trim(),
      description: document.getElementById('crud-description').value.trim(),
      category: document.getElementById('crud-category').value,
      image: document.getElementById('crud-image').value,
      price: parseInt(document.getElementById('crud-price').value),
      costPrice: parseInt(document.getElementById('crud-cost-price').value),
      minStock: parseInt(document.getElementById('crud-min-stock').value)
    };

    if (id) {
      // Edit mode
      store.updateProduct(id, prodData);
      alert('Product details successfully updated.');
    } else {
      // Create mode
      prodData.stock = parseInt(document.getElementById('crud-stock').value) || 0;
      store.addProduct(prodData);
      alert('New product added to inventory registry.');
    }

    closeModal(elements.productModal);
  });

  // Admin Transaction Log Filters
  elements.dbTxSearch.addEventListener('input', () => renderDashboardTransactionsList());
  elements.dbTxFilterType.addEventListener('change', () => renderDashboardTransactionsList());
}

// --- UTILITY MODAL & VIEW ROUTERS ---
function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

function switchToView(viewName) {
  if (viewName === 'admin') {
    if (!store.getCurrentUser()) {
      openModal(elements.loginModal);
      return;
    }
    elements.customerView.classList.remove('active');
    elements.adminView.classList.add('active');
    
    // Trigger dashboard updates on enter
    renderDashboard(store.state);
  } else {
    elements.adminView.classList.remove('active');
    elements.customerView.classList.add('active');
  }
}

// --- RENDER PORTLET: STATIONERY CATALOG ---
function renderProducts(products) {
  elements.productsCatalog.innerHTML = '';

  // Apply Filters
  let filtered = products.filter(p => {
    const matchesCategory = currentCategory === 'all' || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) || 
                          p.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Apply Sorting
  if (currentSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'stock-high') {
    filtered.sort((a, b) => b.stock - a.stock);
  }

  if (filtered.length === 0) {
    elements.productsCatalog.innerHTML = `
      <div class="cart-empty-state" style="grid-column: 1 / -1; padding: 60px 0;">
        <i class="fa-solid fa-box-open" style="font-size: 3.5rem; margin-bottom: 20px;"></i>
        <p>No products found matching your filter selection.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const stockStatus = getStockStatus(p.stock, p.minStock);
    
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-image-container">
        <!-- SVG/CSS Fallback for custom image styles -->
        <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/placeholder.jpg'">
        <span class="product-category-badge">${p.category}</span>
        <span class="product-stock-badge ${stockStatus.badgeClass}">${stockStatus.text} (${p.stock})</span>
      </div>
      <div class="product-info">
        <div class="product-info-top">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatCurrency(p.price)}</span>
          <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> Add to List
          </button>
        </div>
      </div>
    `;

    // Cart Button wireframe
    const addBtn = productCard.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', () => {
      addToCart(p.id);
    });

    elements.productsCatalog.appendChild(productCard);
  });
}

function getStockStatus(stock, minStock) {
  if (stock <= 0) {
    return { text: 'Out of Stock', badgeClass: 'badge-outstock', indicatorClass: 'indicator-red' };
  } else if (stock <= minStock) {
    return { text: 'Low Stock', badgeClass: 'badge-lowstock', indicatorClass: 'indicator-yellow' };
  } else {
    return { text: 'In Stock', badgeClass: 'badge-instock', indicatorClass: 'indicator-green' };
  }
}

// --- CLIENT CART OPERATIONS ---
function toggleCartDrawer() {
  elements.cartDrawer.classList.toggle('open');
}

function addToCart(productId) {
  const product = store.getProductById(productId);
  if (!product || product.stock <= 0) return;

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    if (cartItem.qty + 1 > product.stock) {
      alert(`Cannot add more. Only ${product.stock} items available in stock.`);
      return;
    }
    cartItem.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  // Visual micro-animation on shopping bag
  const icon = elements.cartToggleBtn.querySelector('i');
  icon.classList.add('fa-bounce');
  setTimeout(() => icon.classList.remove('fa-bounce'), 800);

  store.notify(); // Re-render triggers through subscription
  
  // Auto open cart for user feedback
  if (!elements.cartDrawer.classList.contains('open')) {
    toggleCartDrawer();
  }
}

function renderCart() {
  elements.cartItemsContainer.innerHTML = '';
  let subtotal = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    elements.cartItemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>Your shopping inquiry list is currently empty.</p>
      </div>
    `;
    elements.cartSubtotal.textContent = '0 RWF';
    elements.cartCount.forEach(el => el.textContent = '0');
    return;
  }

  cart.forEach(item => {
    const product = store.getProductById(item.id);
    const maxQty = product ? product.stock : 999;
    
    subtotal += item.price * item.qty;
    totalItems += item.qty;

    const cartItemEl = document.createElement('div');
    cartItemEl.className = 'cart-item';
    cartItemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)} each</div>
      </div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn qty-minus-btn">-</button>
        <span class="cart-qty-val">${item.qty}</span>
        <button class="cart-qty-btn qty-plus-btn" ${item.qty >= maxQty ? 'disabled' : ''}>+</button>
      </div>
      <div class="cart-item-remove"><i class="fa-solid fa-trash-can"></i></div>
    `;

    // Qty minus button
    cartItemEl.querySelector('.qty-minus-btn').addEventListener('click', () => {
      if (item.qty > 1) {
        item.qty--;
        store.notify();
      } else {
        removeFromCart(item.id);
      }
    });

    // Qty plus button
    cartItemEl.querySelector('.qty-plus-btn').addEventListener('click', () => {
      if (item.qty < maxQty) {
        item.qty++;
        store.notify();
      }
    });

    // Remove button
    cartItemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
      removeFromCart(item.id);
    });

    elements.cartItemsContainer.appendChild(cartItemEl);
  });

  elements.cartSubtotal.textContent = formatCurrency(subtotal);
  elements.cartCount.forEach(el => el.textContent = totalItems);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  store.notify();
}

function checkoutOrder(method) {
  if (cart.length === 0) return;

  // 1. Calculate and build text summary for transaction
  let summary = `*Wide Business Investment & Consultancy Ltd - Order Inquiry*\n`;
  summary += `Location: Rubavu District, Western Province\n`;
  summary += `TIN: 103448413\n`;
  summary += `---------------------------------------------------\n`;
  
  let subtotal = 0;
  
  // 2. Loop through cart items, write log and update inventory
  let inventoryUpdatesSuccessful = true;
  const loggedTransactions = [];

  // Transaction checkpoint verify
  for (let item of cart) {
    const dbItem = store.getProductById(item.id);
    if (!dbItem || dbItem.stock < item.qty) {
      alert(`Could not complete checkout. '${item.name}' does not have enough stock remaining.`);
      inventoryUpdatesSuccessful = false;
      break;
    }
  }

  if (!inventoryUpdatesSuccessful) return;

  // Process actual deductions
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    summary += `• ${item.name} | Qty: ${item.qty} | Sub: ${formatCurrency(item.price * item.qty)}\n`;
    
    // Automatically reduce stock levels in localStorage database
    store.recordTransaction(
      item.id, 
      'sale', 
      item.qty, 
      item.price, 
      'Client Storefront Direct Checkout Order'
    );
  });

  summary += `---------------------------------------------------\n`;
  summary += `*Total Amount:* ${formatCurrency(subtotal)}\n\n`;
  summary += `Please confirm availability for pickup at the Rubavu central agency. Thank you!`;

  // 3. Navigate/Redirect user
  if (method === 'whatsapp') {
    const url = `https://wa.me/${rwandanPhone}?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  } else {
    const emailBody = encodeURIComponent(summary.replace(/\*/g, ''));
    const mailtoUrl = `mailto:widebusinessltd@gmail.com?subject=Wide Business Stationery Inquiry&body=${emailBody}`;
    window.location.href = mailtoUrl;
  }

  // Reset cart, close sidebar
  cart = [];
  store.saveState(); // Trigger full redraw and DB state sync
  toggleCartDrawer();
  
  alert('Your inquiry was processed! Stock levels have been adjusted, and you are being redirected to finalize contact.');
}

// --- AGENT BANKING CALCULATOR ---
function runFeeCalculation() {
  const bank = elements.calcBank.value;
  const type = elements.calcType.value;
  const amount = parseInt(elements.calcAmount.value);

  if (isNaN(amount) || amount <= 0) {
    elements.calcResult.innerHTML = `
      <div class="result-placeholder" style="color: var(--color-danger)">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>Please enter a valid positive transaction amount.</p>
      </div>
    `;
    return;
  }

  let fee = 0;
  let speed = 'Instant (under 60s)';
  let rraSupport = 'No';
  let limitExceeded = false;
  let note = '';

  // MOCK RULES FOR LOCAL Rwandan Agent Banking Rates
  if (type === 'deposit') {
    fee = 0; // Deposit standard free
    note = 'Depositing money into this account carries 0 agency commission charges.';
  } else if (type === 'withdraw') {
    if (amount <= 5000) fee = 100;
    else if (amount <= 20000) fee = 250;
    else if (amount <= 100000) fee = 500;
    else if (amount <= 500000) fee = 1500;
    else fee = 3000;
    note = 'Withdrawal fees are deducted directly from your account balances.';
  } else {
    // School / Utility / tax
    fee = 100;
    if (bank === 'im') {
      fee = 200;
      rraSupport = 'Yes';
    }
  }

  // Daily limits audit
  if (bank === 'bk' && amount > 5000000) limitExceeded = true;
  if (bank === 'equity' && amount > 3000000) limitExceeded = true;
  if (bank === 'bpr' && amount > 2000000 && type === 'withdraw') limitExceeded = true;
  if (bank === 'ecobank' && amount > 1500000) limitExceeded = true;

  if (limitExceeded) {
    elements.calcResult.innerHTML = `
      <div class="result-placeholder" style="color: var(--color-warning)">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p><strong>Limit Alert!</strong> The requested amount exceeds the daily authorized agency limit for this bank partner.</p>
      </div>
    `;
    return;
  }

  const bankName = BANK_DETAILS[bank === 'bk' ? 'BK' : bank === 'equity' ? 'Equity' : bank === 'bpr' ? 'BPR' : bank === 'ecobank' ? 'Ecobank' : 'IM'].name;

  elements.calcResult.innerHTML = `
    <div class="calc-results-list animate-fade">
      <div class="calc-res-header">
        <h4>${bankName} Summary</h4>
        <small>${type.toUpperCase()} transaction breakdown</small>
      </div>
      <div class="calc-res-item">
        <span>Principal Amount</span>
        <span>${formatCurrency(amount)}</span>
      </div>
      <div class="calc-res-item">
        <span>Agency Commission</span>
        <span class="${fee === 0 ? 'text-success' : ''}">${fee === 0 ? 'FREE' : formatCurrency(fee)}</span>
      </div>
      <div class="calc-res-item">
        <span>Processing Speed</span>
        <span><span class="calc-res-badge">${speed}</span></span>
      </div>
      <div class="calc-res-item">
        <span>RRA Tax Compliant</span>
        <span>${rraSupport}</span>
      </div>
      <div class="calc-res-item" style="border: none; padding-top: 10px;">
        <span style="font-size: 0.8rem; font-style: italic; color: var(--text-muted); line-height: 1.3;">
          * ${note} Please present your National ID to the Rubavu counter agent to execute.
        </span>
      </div>
    </div>
  `;
}

// --- ADMINISTRATIVE DASHBOARD CONTROLS ---
function renderDashboard(state) {
  if (elements.adminView.classList.contains('active')) {
    // 1. Overview Tab Data Refresher
    renderDashboardOverview(state);
    
    // 2. Products List Tab Data Refresher
    renderDashboardProductsList();

    // 3. Transactions Log Data Refresher
    renderDashboardTransactionsList();

    // 4. Update the select inputs in Quick Stock Transaction
    populateQuickStockDropdown(state.products);
  }
}

function renderDashboardOverview(state) {
  const products = state.products;
  const txs = state.transactions;

  // Totals calculations
  let totalCostValue = 0;
  let totalRetailValue = 0;
  let lowStockCount = 0;

  products.forEach(p => {
    totalCostValue += p.costPrice * p.stock;
    totalRetailValue += p.price * p.stock;
    if (p.stock <= p.minStock) lowStockCount++;
  });

  elements.metricTotalProducts.textContent = products.length;
  elements.metricLowStock.textContent = lowStockCount;
  
  if (lowStockCount > 0) {
    elements.metricLowStockCard.classList.add('warning-glow-effect');
  } else {
    elements.metricLowStockCard.classList.remove('warning-glow-effect');
  }

  elements.metricTotalCost.textContent = formatCurrency(totalCostValue);
  elements.metricTotalValue.textContent = formatCurrency(totalRetailValue);

  // Render Low Stock Alert Table Rows
  elements.lowStockAlertsList.innerHTML = '';
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  
  if (lowStockItems.length === 0) {
    elements.lowStockAlertsList.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">
          All stock items are healthy! No low stock alerts active.
        </td>
      </tr>
    `;
  } else {
    lowStockItems.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${p.name}</strong></td>
        <td>${p.category}</td>
        <td class="text-warning font-bold">${p.stock}</td>
        <td>${p.minStock}</td>
        <td>
          <button class="btn btn-sm btn-outline quick-restock-btn" data-id="${p.id}"><i class="fa-solid fa-plus"></i> Restock</button>
        </td>
      `;
      row.querySelector('.quick-restock-btn').addEventListener('click', () => {
        elements.sidebarTabs.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="stock-log"]').classList.add('active');
        elements.dbTabPanels.forEach(p => p.classList.remove('active'));
        document.getElementById('db-panel-stock-log').classList.add('active');
        
        elements.logProductId.value = p.id;
        elements.logType.value = 'purchase';
        elements.logQuantity.value = '50';
        elements.logPrice.value = p.costPrice;
        elements.logPriceHint.textContent = `Standard price: ${p.costPrice} RWF`;
        
        window.scrollTo({
          top: elements.quickStockForm.offsetTop - 80,
          behavior: 'smooth'
        });
      });
      elements.lowStockAlertsList.appendChild(row);
    });
  }
}

function populateQuickStockDropdown(products) {
  const prevVal = elements.logProductId.value;
  elements.logProductId.innerHTML = '';
  
  products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} (Stock: ${p.stock})`;
    elements.logProductId.appendChild(opt);
  });

  if (prevVal && [...elements.logProductId.options].some(o => o.value === prevVal)) {
    elements.logProductId.value = prevVal;
  } else if (products.length > 0) {
    const initial = products[0];
    elements.logPrice.value = elements.logType.value === 'purchase' ? initial.costPrice : initial.price;
  }
}

function renderDashboardProductsList() {
  elements.dbProductsList.innerHTML = '';
  const products = store.getProducts();
  const searchVal = elements.dbProductsSearch.value.toLowerCase();
  const catFilter = elements.dbProductsFilterCategory.value;

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || p.description.toLowerCase().includes(searchVal);
    const matchesCat = catFilter === 'all' || p.category === catFilter;
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    elements.dbProductsList.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          No matching records registered in product database.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(p => {
    const stockStatus = getStockStatus(p.stock, p.minStock);
    const profit = p.price - p.costPrice;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="db-product-cell">
          <div class="db-product-avatar"><i class="fa-solid fa-book-open"></i></div>
          <div class="db-product-name-info">
            <strong>${p.name}</strong>
            <span>ID: ${p.id}</span>
          </div>
        </div>
      </td>
      <td>${p.category}</td>
      <td>${formatCurrency(p.costPrice)}</td>
      <td>
        <div style="font-weight: 700; color: var(--color-primary);">${formatCurrency(p.price)}</div>
        <small style="font-size:0.75rem; color:var(--color-success)">Margin: +${formatCurrency(profit)}</small>
      </td>
      <td style="font-weight: 700;">${p.stock}</td>
      <td>
        <span class="status-indicator ${stockStatus.indicatorClass}">
          <span class="status-dot"></span>
          ${stockStatus.text}
        </span>
      </td>
      <td>
        <div class="actions-cell">
          <button class="action-icon-btn action-edit" title="Edit Product"><i class="fa-solid fa-pen"></i></button>
          <button class="action-icon-btn action-delete" title="Delete Product"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    `;

    // Edit Product trigger
    row.querySelector('.action-edit').addEventListener('click', () => {
      elements.productModalTitle.textContent = 'Edit Product Registry';
      elements.crudStockGroup.classList.add('hidden'); // Hide stock during standard info edit, stock adjustments handled via logs
      
      document.getElementById('crud-product-id').value = p.id;
      document.getElementById('crud-name').value = p.name;
      document.getElementById('crud-description').value = p.description;
      document.getElementById('crud-category').value = p.category;
      document.getElementById('crud-image').value = p.image;
      document.getElementById('crud-price').value = p.price;
      document.getElementById('crud-cost-price').value = p.costPrice;
      document.getElementById('crud-min-stock').value = p.minStock;

      openModal(elements.productModal);
    });

    // Delete Product trigger
    row.querySelector('.action-delete').addEventListener('click', () => {
      if (confirm(`Are you sure you want to completely delete '${p.name}' from the database?`)) {
        store.deleteProduct(p.id);
        alert('Product successfully removed from registry.');
      }
    });

    elements.dbProductsList.appendChild(row);
  });
}

function renderDashboardTransactionsList() {
  elements.dbTransactionsList.innerHTML = '';
  const txs = store.getTransactions();
  const searchVal = elements.dbTxSearch.value.toLowerCase();
  const filterType = elements.dbTxFilterType.value;

  const filtered = txs.filter(tx => {
    const matchesSearch = tx.productName.toLowerCase().includes(searchVal) || 
                          tx.notes.toLowerCase().includes(searchVal) ||
                          tx.id.toLowerCase().includes(searchVal);
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    elements.dbTransactionsList.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">
          No transactions registered under selected criteria.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(tx => {
    const dateFormatted = new Date(tx.date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const badgeClass = tx.type === 'purchase' ? 'tx-purchase' : 'tx-sale';
    const typeLabel = tx.type === 'purchase' ? 'Purchase (Restock)' : 'Sale (Invoice)';
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><span style="font-family: monospace;">${dateFormatted}</span></td>
      <td><strong>${tx.productName}</strong><br><small style="color:var(--text-muted)">ID: ${tx.productId}</small></td>
      <td><span class="tx-badge ${badgeClass}">${typeLabel}</span></td>
      <td style="font-weight: 700;">${tx.quantity}</td>
      <td>${formatCurrency(tx.unitPrice)}</td>
      <td style="font-weight: 700; color:${tx.type === 'purchase' ? 'var(--color-danger)' : 'var(--color-success)'}">
        ${tx.type === 'purchase' ? '-' : '+'}${formatCurrency(tx.totalPrice)}
      </td>
      <td><span style="font-size:0.8rem; color:var(--text-secondary);">${tx.notes || '-'}</span></td>
    `;
    elements.dbTransactionsList.appendChild(row);
  });
}

// --- GENERAL FORMATTING ---
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('RWF', 'RWF ');
}
