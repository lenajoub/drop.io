// Product Data
const products = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        price: 59.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
    },
    {
        id: 2,
        name: 'Smart Watch Pro',
        price: 199.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'
    },
    {
        id: 3,
        name: 'Premium Leather Wallet',
        price: 49.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop'
    },
    {
        id: 4,
        name: 'Minimalist Backpack',
        price: 79.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop'
    },
    {
        id: 5,
        name: 'Ceramic Plant Pot Set',
        price: 34.99,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop'
    },
    {
        id: 6,
        name: 'Modern Table Lamp',
        price: 89.99,
        category: 'home',
        image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=500&h=500&fit=crop'
    },
    {
        id: 7,
        name: 'Fitness Tracker Band',
        price: 39.99,
        category: 'electronics',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop'
    },
    {
        id: 8,
        name: 'Sunglasses Classic',
        price: 29.99,
        category: 'fashion',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop'
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartSidebar = document.getElementById('cartSidebar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    setupEventListeners();
    updateCartUI();
});

// Display Products
function displayProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            displayProducts(e.target.dataset.filter);
        });
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
            }
        });
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer;">-</button>
                        <span style="padding: 5px 10px;">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer;">+</button>
                        <button onclick="removeFromCart(${item.id})" style="margin-left: auto; color: red; border: none; background: none; cursor: pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Toggle Cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Checkout functionality would be implemented here. Total: ' + cartTotal.textContent);
    cart = [];
    updateCartUI();
    toggleCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
