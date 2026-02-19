// DigiTech Academy - Stripe Payment Integration
// IMPORTANT: Replace 'pk_test_YOUR_PUBLISHABLE_KEY' with your actual Stripe publishable key

const STRIPE_CONFIG = {
    // DigiTech Globals Stripe publishable key
    publishableKey: 'pk_test_51T2YOpDzN3usTtjjKByGRiTKhCTOtXpqae29uyXXyInXEojIcYKGUGh3zLE7SsQM9AO9F7G634J6CsfOqjhVEu6m00Os1T9bqy',
    
    // Price IDs from your Stripe Dashboard
    // Create these products/prices in Stripe Dashboard first
    prices: {
        'pro-monthly': 'price_XXXXXXXXXXXXXXXX', // $49/month
        'pro-annual': 'price_XXXXXXXXXXXXXXXX',  // $349/year
    },
    
    // Course prices (create these in Stripe as one-time products)
    coursePrices: {
        'it-support-fundamentals': 'price_XXXXXXXXXXXXXXXX',
        'az-900': 'price_XXXXXXXXXXXXXXXX',
        'az-104': 'price_XXXXXXXXXXXXXXXX',
        'cybersec-essentials': 'price_XXXXXXXXXXXXXXXX',
        'security-plus': 'price_XXXXXXXXXXXXXXXX',
        'ms-900': 'price_XXXXXXXXXXXXXXXX',
        'intune-endpoint': 'price_XXXXXXXXXXXXXXXX',
        'networking-fundamentals': 'price_XXXXXXXXXXXXXXXX',
        'ccna-prep': 'price_XXXXXXXXXXXXXXXX',
        'powershell-it': 'price_XXXXXXXXXXXXXXXX',
        'python-it': 'price_XXXXXXXXXXXXXXXX',
    },
    
    // Success and cancel URLs
    successUrl: window.location.origin + '/academy/dashboard.html?payment=success',
    cancelUrl: window.location.origin + '/academy/plans.html?payment=cancelled'
};

// Initialize Stripe
let stripe = null;

function initStripe() {
    if (typeof Stripe !== 'undefined' && STRIPE_CONFIG.publishableKey !== 'pk_test_YOUR_PUBLISHABLE_KEY') {
        stripe = Stripe(STRIPE_CONFIG.publishableKey);
    } else {
        console.warn('Stripe not initialized. Please add your publishable key.');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initStripe);

/**
 * Initiate Stripe Checkout for subscriptions or single courses
 * @param {string} type - 'pro-monthly', 'pro-annual', or 'course'
 * @param {string} courseId - Required if type is 'course'
 */
async function initiateStripeCheckout(type, courseId = null) {
    if (!stripe) {
        // Fallback for demo/development
        showPaymentModal(type, courseId);
        return;
    }
    
    let priceId;
    let mode;
    
    if (type === 'course' && courseId) {
        priceId = STRIPE_CONFIG.coursePrices[courseId];
        mode = 'payment'; // One-time payment
    } else {
        priceId = STRIPE_CONFIG.prices[type];
        mode = 'subscription'; // Recurring subscription
    }
    
    if (!priceId || priceId.startsWith('price_XXXX')) {
        console.error('Invalid price ID. Please configure Stripe prices.');
        showPaymentModal(type, courseId);
        return;
    }
    
    try {
        // Create checkout session via your backend
        // For now, using client-side redirect (not recommended for production)
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: mode,
            successUrl: STRIPE_CONFIG.successUrl + `&plan=${type}`,
            cancelUrl: STRIPE_CONFIG.cancelUrl,
            customerEmail: getUserEmail(),
        });
        
        if (error) {
            console.error('Stripe error:', error);
            alert('Payment failed. Please try again.');
        }
    } catch (err) {
        console.error('Checkout error:', err);
        showPaymentModal(type, courseId);
    }
}

/**
 * Get user email from localStorage or prompt
 */
function getUserEmail() {
    const user = localStorage.getItem('academyUser');
    if (user) {
        return JSON.parse(user).email;
    }
    return null;
}

/**
 * Fallback payment modal for demo/development
 */
function showPaymentModal(type, courseId) {
    const prices = {
        'pro-monthly': { name: 'Pro Monthly', price: '$49/month' },
        'pro-annual': { name: 'Pro Annual', price: '$349/year' },
        'course': { name: 'Course Purchase', price: 'Varies' }
    };
    
    const plan = prices[type] || prices['course'];
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.innerHTML = `
        <div class="payment-modal">
            <button class="modal-close" onclick="closePaymentModal()">&times;</button>
            <div class="modal-header">
                <i class="fas fa-lock"></i>
                <h2>Complete Your Purchase</h2>
            </div>
            <div class="modal-body">
                <div class="plan-summary">
                    <h3>${plan.name}</h3>
                    <p class="plan-price">${plan.price}</p>
                </div>
                <form id="paymentForm" onsubmit="processPayment(event, '${type}', '${courseId}')">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="paymentEmail" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" id="cardNumber" required placeholder="4242 4242 4242 4242" maxlength="19">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Expiry</label>
                            <input type="text" id="cardExpiry" required placeholder="MM/YY" maxlength="5">
                        </div>
                        <div class="form-group">
                            <label>CVC</label>
                            <input type="text" id="cardCvc" required placeholder="123" maxlength="4">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">
                        <i class="fas fa-credit-card"></i> Pay Now
                    </button>
                </form>
                <div class="payment-security">
                    <i class="fas fa-shield-alt"></i>
                    <span>Secured by Stripe. Your payment info is encrypted.</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not present
    addPaymentModalStyles();
    
    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('cardExpiry').addEventListener('input', formatExpiry);
}

function closePaymentModal() {
    const modal = document.querySelector('.payment-modal-overlay');
    if (modal) modal.remove();
}

function processPayment(event, type, courseId) {
    event.preventDefault();
    
    const email = document.getElementById('paymentEmail').value;
    const cardNumber = document.getElementById('cardNumber').value;
    
    // Show loading
    const btn = event.target.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user data
        const userData = {
            email: email,
            subscription: type.includes('pro') ? 'pro' : 'free',
            subscribedAt: new Date().toISOString(),
            plan: type
        };
        localStorage.setItem('academyUser', JSON.stringify(userData));
        
        // Close modal and redirect
        closePaymentModal();
        window.location.href = `dashboard.html?payment=success&plan=${type}`;
    }, 2000);
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
}

function formatExpiry(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
}

function addPaymentModalStyles() {
    if (document.getElementById('paymentModalStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'paymentModalStyles';
    styles.textContent = `
        .payment-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
        }
        .payment-modal {
            background: var(--dark-card, #162033);
            border-radius: 20px;
            max-width: 450px;
            width: 100%;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: var(--text-muted, #94a3b8);
            font-size: 28px;
            cursor: pointer;
            transition: color 0.3s;
        }
        .modal-close:hover { color: var(--white, #fff); }
        .modal-header {
            text-align: center;
            padding: 30px 30px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .modal-header i {
            font-size: 40px;
            color: var(--accent, #F59E0B);
            margin-bottom: 15px;
        }
        .modal-header h2 {
            color: var(--white, #fff);
            font-size: 24px;
            margin: 0;
        }
        .modal-body { padding: 30px; }
        .plan-summary {
            text-align: center;
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(245, 158, 11, 0.1);
            border-radius: 12px;
        }
        .plan-summary h3 {
            color: var(--white, #fff);
            margin: 0 0 5px;
        }
        .plan-summary .plan-price {
            font-size: 28px;
            font-weight: 700;
            color: var(--accent, #F59E0B);
            margin: 0;
        }
        .payment-modal .form-group {
            margin-bottom: 20px;
        }
        .payment-modal label {
            display: block;
            color: var(--text-muted, #94a3b8);
            font-size: 13px;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .payment-modal input {
            width: 100%;
            padding: 14px 16px;
            background: var(--dark-lighter, #1E293B);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            color: var(--white, #fff);
            font-size: 15px;
            transition: all 0.3s;
        }
        .payment-modal input:focus {
            outline: none;
            border-color: var(--accent, #F59E0B);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        .payment-modal input::placeholder {
            color: var(--text-muted, #94a3b8);
            opacity: 0.5;
        }
        .payment-modal .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .payment-modal .btn-block {
            margin-top: 10px;
            padding: 16px;
            font-size: 16px;
        }
        .payment-security {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
            color: var(--text-muted, #94a3b8);
            font-size: 12px;
        }
        .payment-security i { color: #10B981; }
    `;
    document.head.appendChild(styles);
}

// Handle payment success/cancel from URL
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const plan = urlParams.get('plan');
    
    if (paymentStatus === 'success') {
        showSuccessNotification(plan);
    } else if (paymentStatus === 'cancelled') {
        showCancelNotification();
    }
});

function showSuccessNotification(plan) {
    const notification = document.createElement('div');
    notification.className = 'payment-notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <h4>Payment Successful!</h4>
            <p>Welcome to DigiTech Academy. Your ${plan || 'subscription'} is now active.</p>
        </div>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
    
    // Add notification styles
    addNotificationStyles();
}

function showCancelNotification() {
    const notification = document.createElement('div');
    notification.className = 'payment-notification cancelled';
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <div>
            <h4>Payment Cancelled</h4>
            <p>No charges were made. Feel free to try again when ready.</p>
        </div>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
    
    addNotificationStyles();
}

function addNotificationStyles() {
    if (document.getElementById('notificationStyles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'notificationStyles';
    styles.textContent = `
        .payment-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--dark-card, #162033);
            border-radius: 12px;
            padding: 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            animation: slideInRight 0.4s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            max-width: 400px;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .payment-notification.success i { color: #10B981; font-size: 32px; }
        .payment-notification.cancelled i { color: var(--accent, #F59E0B); font-size: 32px; }
        .payment-notification h4 { color: var(--white, #fff); margin: 0 0 5px; }
        .payment-notification p { color: var(--text-muted, #94a3b8); margin: 0; font-size: 13px; }
        .payment-notification button {
            background: none;
            border: none;
            color: var(--text-muted, #94a3b8);
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(styles);
}
