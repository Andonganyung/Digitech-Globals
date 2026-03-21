// ============================================
// LOGIN PAGE WITH FIREBASE AUTHENTICATION
// ============================================

// Check for registration success message
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
    document.getElementById('successAlert').classList.add('show');
}

// Show/hide alerts
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorAlert.classList.add('show');
    setTimeout(() => {
        errorAlert.classList.remove('show');
    }, 5000);
}

function showSuccess(message) {
    const successAlert = document.getElementById('successAlert');
    successAlert.querySelector('span') ? 
        successAlert.querySelector('span').textContent = message : 
        successAlert.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successAlert.classList.add('show');
    setTimeout(() => {
        successAlert.classList.remove('show');
    }, 3000);
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const email = formData.get('username'); // Can be email or username
    const password = formData.get('password');

    // Disable submit button
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    try {
        // Login with Firebase Authentication
        const user = await AuthService.loginUser(email, password);
        console.log('User logged in:', user.uid);

        // Get user profile from Firestore to check role
        const userProfile = await DatabaseService.getUserProfile(user.uid);
        console.log('User profile:', userProfile);

        // Redirect based on role
        if (userProfile.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'candidate-dashboard.html';
        }

    } catch (error) {
        console.error('Login error:', error);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Show error message
        let errorMessage = 'Invalid credentials. Please try again.';
        if (error.message) {
            errorMessage = error.message;
        }
        showError(errorMessage);
    }
});

// Forgot password handler
document.getElementById('forgotPasswordLink').addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = prompt('Enter your email address to reset your password:');
    
    if (!email) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    try {
        await AuthService.resetPassword(email);
        showSuccess('Password reset email sent! Check your inbox.');
    } catch (error) {
        console.error('Password reset error:', error);
        showError(error.message || 'Failed to send password reset email');
    }
});
