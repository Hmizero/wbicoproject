// store.js - Local state database with LocalStorage persistence

const STORE_KEY = 'wide_business_store_data';

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'A5 Exercise Book (96 Pages)',
    description: 'High-quality ruled paper notebook, ideal for secondary and primary school students.',
    category: 'Books & Notebooks',
    price: 600,
    costPrice: 400,
    stock: 150,
    minStock: 20,
    image: 'assets/exercise_book_96.jpg'
  },
  {
    id: 'prod-002',
    name: 'A4 Ruled Notebook (200 Pages)',
    description: 'Premium softcover notebook with margin, double-wire binding, ideal for office and university.',
    category: 'Books & Notebooks',
    price: 1800,
    costPrice: 1200,
    stock: 80,
    minStock: 15,
    image: 'assets/notebook_a4_200.jpg'
  },
  {
    id: 'prod-003',
    name: 'Standard Mathematical Set',
    description: 'Geometrical instrument box containing compass, dividers, protractor, set squares, ruler, pencil, and eraser.',
    category: 'School Supplies',
    price: 2500,
    costPrice: 1700,
    stock: 45,
    minStock: 10,
    image: 'assets/mathematical_set.jpg'
  },
  {
    id: 'prod-004',
    name: 'Premium A4 Copy Paper Ream (80gsm)',
    description: 'Bright white photocopy and printing paper. 500 sheets per ream. High jam-resistance.',
    category: 'Office Paper',
    price: 6500,
    costPrice: 4800,
    stock: 120,
    minStock: 25,
    image: 'assets/a4_paper_ream.jpg'
  },
  {
    id: 'prod-005',
    name: 'Fine Ballpoint Blue Pens (Pack of 10)',
    description: 'Smooth-writing 0.7mm tip blue ink pens. Comfortable grip and long-lasting ink.',
    category: 'Writing Instruments',
    price: 1200,
    costPrice: 800,
    stock: 200,
    minStock: 30,
    image: 'assets/pens_blue_pack.jpg'
  },
  {
    id: 'prod-006',
    name: 'Advanced Scientific Calculator',
    description: 'Dual-power (solar and battery) scientific calculator with 417 functions. Perfect for secondary and college students.',
    category: 'Office Equipment',
    price: 18500,
    costPrice: 14000,
    stock: 18,
    minStock: 5,
    image: 'assets/scientific_calculator.jpg'
  }
];

class StateStore {
  constructor() {
    this.listeners = [];
    this.loadState();
  }

  loadState() {
    const data = localStorage.getItem(STORE_KEY);
    if (data) {
      try {
        this.state = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing localStorage data, resetting store.', e);
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }
  }

  resetToDefaults() {
    this.state = {
      products: [...DEFAULT_PRODUCTS],
      transactions: [
        {
          id: 'tx-001',
          date: new Date(Date.now() - 48 * 3600000).toISOString(), // 2 days ago
          productId: 'prod-001',
          productName: 'A5 Exercise Book (96 Pages)',
          type: 'purchase', // purchase or sale
          quantity: 200,
          unitPrice: 400,
          totalPrice: 80000,
          notes: 'Initial stock purchase from wholesale distributor.'
        },
        {
          id: 'tx-002',
          date: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
          productId: 'prod-001',
          productName: 'A5 Exercise Book (96 Pages)',
          type: 'sale',
          quantity: 50,
          unitPrice: 600,
          totalPrice: 30000,
          notes: 'Bulk retail sale to local school.'
        }
      ],
      currentUser: null
    };
    this.saveState();
  }

  saveState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // --- Auth Actions ---
  login(username, password) {
    if (username === 'admin' && password === 'wide2027') {
      this.state.currentUser = { username: 'admin', role: 'administrator' };
      this.saveState();
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password' };
  }

  logout() {
    this.state.currentUser = null;
    this.saveState();
  }

  getCurrentUser() {
    return this.state.currentUser;
  }

  // --- Product CRUD ---
  getProducts() {
    return this.state.products;
  }

  getProductById(id) {
    return this.state.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const newProduct = {
      id: 'prod-' + Date.now(),
      name: productData.name || 'Unnamed Product',
      description: productData.description || '',
      category: productData.category || 'General',
      price: Number(productData.price) || 0,
      costPrice: Number(productData.costPrice) || 0,
      stock: Number(productData.stock) || 0,
      minStock: Number(productData.minStock) || 5,
      image: productData.image || 'assets/placeholder.jpg'
    };

    this.state.products.push(newProduct);
    
    // Log the initial stock purchase
    if (newProduct.stock > 0) {
      this.addTransactionInternal({
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'purchase',
        quantity: newProduct.stock,
        unitPrice: newProduct.costPrice,
        totalPrice: newProduct.stock * newProduct.costPrice,
        notes: 'Initial inventory record.'
      });
    }

    this.saveState();
    return newProduct;
  }

  updateProduct(id, productData) {
    const index = this.state.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const oldProduct = this.state.products[index];
    const updatedProduct = {
      ...oldProduct,
      name: productData.name !== undefined ? productData.name : oldProduct.name,
      description: productData.description !== undefined ? productData.description : oldProduct.description,
      category: productData.category !== undefined ? productData.category : oldProduct.category,
      price: productData.price !== undefined ? Number(productData.price) : oldProduct.price,
      costPrice: productData.costPrice !== undefined ? Number(productData.costPrice) : oldProduct.costPrice,
      minStock: productData.minStock !== undefined ? Number(productData.minStock) : oldProduct.minStock,
      image: productData.image !== undefined ? productData.image : oldProduct.image
    };

    // If stock is explicitly updated directly (not through transaction), handles difference
    if (productData.stock !== undefined && Number(productData.stock) !== oldProduct.stock) {
      const difference = Number(productData.stock) - oldProduct.stock;
      if (difference !== 0) {
        const type = difference > 0 ? 'purchase' : 'sale';
        const absQty = Math.abs(difference);
        const price = type === 'purchase' ? updatedProduct.costPrice : updatedProduct.price;
        
        this.addTransactionInternal({
          productId: id,
          productName: updatedProduct.name,
          type: type,
          quantity: absQty,
          unitPrice: price,
          totalPrice: absQty * price,
          notes: 'Manual inventory adjustment.'
        });
      }
      updatedProduct.stock = Number(productData.stock);
    }

    this.state.products[index] = updatedProduct;
    this.saveState();
    return updatedProduct;
  }

  deleteProduct(id) {
    this.state.products = this.state.products.filter(p => p.id !== id);
    this.saveState();
    return true;
  }

  // --- Stock Transactions ---
  getTransactions() {
    return this.state.transactions;
  }

  // Internal log writer (doesn't trigger double saves)
  addTransactionInternal(txData) {
    const tx = {
      id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      date: new Date().toISOString(),
      productId: txData.productId,
      productName: txData.productName,
      type: txData.type, // 'purchase' or 'sale'
      quantity: Number(txData.quantity),
      unitPrice: Number(txData.unitPrice),
      totalPrice: Number(txData.totalPrice),
      notes: txData.notes || ''
    };
    this.state.transactions.unshift(tx); // Newest first
  }

  // Public transaction log & stock updater
  recordTransaction(productId, type, quantity, unitPrice, notes = '') {
    const product = this.getProductById(productId);
    if (!product) return { success: false, message: 'Product not found' };

    quantity = Number(quantity);
    unitPrice = Number(unitPrice);

    if (type === 'sale' && product.stock < quantity) {
      return { success: false, message: `Insufficient stock! Current stock: ${product.stock}` };
    }

    // Update stock levels
    if (type === 'purchase') {
      product.stock += quantity;
    } else if (type === 'sale') {
      product.stock -= quantity;
    }

    this.addTransactionInternal({
      productId,
      productName: product.name,
      type,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
      notes
    });

    this.saveState();
    return { success: true, product };
  }
}

// Export a singleton instance
const store = new StateStore();
window.store = store; // Make it globally accessible for our scripts
export default store;
