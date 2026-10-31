// ==========================================
// 1. SHOPPING CART LOGIC
// ==========================================
let cart = JSON.parse(localStorage.getItem('medibloom_cart')) || [];

// Update the number on the cart icon
function updateCartCount() {
    document.getElementById('cart-count').innerText = cart.length;
}

// Add event listeners to all "Add to Cart" buttons on the page
function setupCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            // Get product info from the button's data attributes
            const product = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: parseFloat(e.target.dataset.price)
            };
            
            cart.push(product);
            localStorage.setItem('medibloom_cart', JSON.stringify(cart)); 
            updateCartCount();
            
            // Simple alert to show it worked
            alert(`${product.name} added to cart!`);
        });
    });
}

// View Cart Button (Just shows an alert for now)
document.getElementById('cart-btn').addEventListener('click', () => {
    if(cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        alert(`You have ${cart.length} items in your cart.\nTotal: KES ${total}`);
    }
});


// ==========================================
// 2. ACCOUNT LOGIN/LOGOUT LOGIC
// ==========================================
let currentUser = localStorage.getItem('medibloom_user');

function checkAuth() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const greeting = document.getElementById('user-greeting');

    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        greeting.innerText = `Hi, ${currentUser}`;
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        greeting.innerText = '';
    }
}

document.getElementById('login-btn').addEventListener('click', () => {
    let username = prompt("Enter your username (or create a new one):"); 
    if(username && username.trim() !== "") {
        localStorage.setItem('medibloom_user', username);
        currentUser = username;
        checkAuth();
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('medibloom_user');
    currentUser = null;
    checkAuth();
});


// ==========================================
// 3. INITIALIZE EVERYTHING ON PAGE LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    checkAuth();
    setupCartButtons();
});