// ============================================
// CANDIDATE DASHBOARD WITH FIREBASE
// ============================================

let currentUser = null;
let userApplication = null;

// Check authentication on page load
AuthService.onAuthStateChanged(async (user) => {
    if (!user) {
        // No user logged in, redirect to login
        window.location.href = 'login.html';
        return;
    }

    try {
        // Get user profile
        const userProfile = await DatabaseService.getUserProfile(user.uid);
        
        // Check if user is candidate
        if (userProfile.role !== 'candidate') {
            // Not a candidate, redirect to login
            await AuthService.logoutUser();
            window.location.href = 'login.html';
            return;
        }

        currentUser = {
            uid: user.uid,
            email: user.email,
            ...userProfile
        };

        // Load candidate data
        await loadCandidateData();

    } catch (error) {
        console.error('Error loading user data:', error);
        // If error, logout and redirect
        await AuthService.logoutUser();
        window.location.href = 'login.html';
    }
});

/**
 * Load candidate application data from Firestore
 */
async function loadCandidateData() {
    try {
        // Show loading state
        showLoading();

        // Get application data
        userApplication = await DatabaseService.getApplicationByUserId(currentUser.uid);
        
        if (!userApplication) {
            showError('No application found for your account.');
            return;
        }

        // Update UI with application data
        updateUI(userApplication);

    } catch (error) {
        console.error('Error loading application data:', error);
        showError('Failed to load your application data. Please try refreshing the page.');
    }
}

/**
 * Update UI with application data
 */
function updateUI(app) {
    // Update user welcome section
    document.getElementById('userName').textContent = app.firstName;
    document.getElementById('userAvatar').textContent = app.firstName.charAt(0) + app.lastName.charAt(0);
    
    // Update course information
    document.getElementById('courseName').textContent = app.courseName;
    const submittedDate = app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'N/A';
    document.getElementById('courseDuration').innerHTML = `<i class="fas fa-clock"></i> Application submitted on ${submittedDate}`;
    
    // Update application status
    document.getElementById('appId').textContent = app.id;
    document.getElementById('submittedDate').textContent = submittedDate;
    document.getElementById('studyMode').textContent = app.studyMode || 'N/A';
    
    const statusBadge = document.getElementById('appStatus');
    statusBadge.textContent = app.status.charAt(0).toUpperCase() + app.status.slice(1);
    statusBadge.className = 'status-badge status-' + app.status;
    
    // Update personal information
    document.getElementById('fullName').textContent = `${app.firstName} ${app.lastName}`;
    document.getElementById('email').textContent = app.email;
    document.getElementById('phone').textContent = app.phone;
    const dob = app.dob ? new Date(app.dob).toLocaleDateString() : 'N/A';
    document.getElementById('dob').textContent = dob;
    
    // Update address
    document.getElementById('address').textContent = app.address || 'N/A';
    document.getElementById('city').textContent = app.city || 'N/A';
    document.getElementById('state').textContent = app.state || 'N/A';
    document.getElementById('country').textContent = app.country || 'N/A';
    
    // Update education & employment
    document.getElementById('education').textContent = app.education || 'N/A';
    document.getElementById('employment').textContent = app.employment || 'N/A';
    
    // Update personal statement
    document.getElementById('statement').textContent = app.statement || 'N/A';

    // Hide loading state
    hideLoading();
}

/**
 * Show loading state
 */
function showLoading() {
    // You can add a loading spinner here
    console.log('Loading...');
}

/**
 * Hide loading state
 */
function hideLoading() {
    console.log('Loaded');
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'background: #fee2e2; color: #991b1b; padding: 16px; border-radius: 8px; margin: 20px; border-left: 4px solid #ef4444;';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.querySelector('.container').prepend(errorDiv);
}

/**
 * Logout function
 */
async function logout() {
    try {
        await AuthService.logoutUser();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to logout. Please try again.');
    }
}

// Make logout function available globally
window.logout = logout;
