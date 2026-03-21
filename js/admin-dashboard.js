// ============================================
// ADMIN DASHBOARD WITH FIREBASE
// ============================================

let currentAdmin = null;
let allApplications = [];

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
        
        // Check if user is admin
        if (userProfile.role !== 'admin') {
            // Not an admin, redirect to login
            await AuthService.logoutUser();
            window.location.href = 'login.html';
            return;
        }

        currentAdmin = {
            uid: user.uid,
            email: user.email,
            ...userProfile
        };

        // Load applications
        await loadApplications();

    } catch (error) {
        console.error('Error loading admin data:', error);
        // If error, logout and redirect
        await AuthService.logoutUser();
        window.location.href = 'login.html';
    }
});

/**
 * Load all applications from Firestore
 */
async function loadApplications() {
    try {
        showLoading();

        // Get all applications
        allApplications = await DatabaseService.getAllApplications();
        
        // Update statistics
        updateStats();
        
        // Render applications table
        renderApplications(allApplications);

        hideLoading();

    } catch (error) {
        console.error('Error loading applications:', error);
        showError('Failed to load applications. Please refresh the page.');
        hideLoading();
    }
}

/**
 * Update statistics cards
 */
async function updateStats() {
    try {
        const stats = await DatabaseService.getApplicationStats();
        document.getElementById('totalApps').textContent = stats.total;
        document.getElementById('pendingApps').textContent = stats.pending;
        document.getElementById('approvedApps').textContent = stats.approved;
        document.getElementById('declinedApps').textContent = stats.declined;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

/**
 * Render applications in table
 */
function renderApplications(apps) {
    const tbody = document.getElementById('applicationsBody');
    
    if (apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No applications found</td></tr>';
        return;
    }

    tbody.innerHTML = apps.map(app => {
        const submittedDate = app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'N/A';
        return `
            <tr>
                <td>${app.id.substring(0, 12)}...</td>
                <td>${app.firstName} ${app.lastName}</td>
                <td>${app.email}</td>
                <td>${app.courseName}</td>
                <td>${submittedDate}</td>
                <td><span class="status-badge status-${app.status}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn btn-view" onclick="viewApplication('${app.id}')"><i class="fas fa-eye"></i> View</button>
                    ${app.status === 'pending' ? `
                        <button class="action-btn btn-approve" onclick="updateStatus('${app.id}', 'approved')"><i class="fas fa-check"></i></button>
                        <button class="action-btn btn-decline" onclick="updateStatus('${app.id}', 'declined')"><i class="fas fa-times"></i></button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Filter applications by status and search text
 */
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchText = document.getElementById('searchFilter').value.toLowerCase();

    let filtered = allApplications;

    // Filter by status
    if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search text
    if (searchText) {
        filtered = filtered.filter(app => 
            app.firstName.toLowerCase().includes(searchText) ||
            app.lastName.toLowerCase().includes(searchText) ||
            app.email.toLowerCase().includes(searchText) ||
            app.courseName.toLowerCase().includes(searchText)
        );
    }

    renderApplications(filtered);
}

/**
 * View application details in modal
 */
function viewApplication(appId) {
    const app = allApplications.find(a => a.id === appId);
    if (!app) return;

    const submittedDate = app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleString() : 'N/A';
    const dob = app.dob ? new Date(app.dob).toLocaleDateString() : 'N/A';

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-section">
            <h3><i class="fas fa-info-circle"></i> Application Information</h3>
            <div class="detail-grid">
                <div class="detail-item"><label>Application ID</label><div class="value">${app.id}</div></div>
                <div class="detail-item"><label>Status</label><div class="value"><span class="status-badge status-${app.status}">${app.status.toUpperCase()}</span></div></div>
                <div class="detail-item"><label>Submitted</label><div class="value">${submittedDate}</div></div>
            </div>
        </div>
        <div class="modal-section">
            <h3><i class="fas fa-user"></i> Personal Information</h3>
            <div class="detail-grid">
                <div class="detail-item"><label>Full Name</label><div class="value">${app.firstName} ${app.lastName}</div></div>
                <div class="detail-item"><label>Email</label><div class="value">${app.email}</div></div>
                <div class="detail-item"><label>Phone</label><div class="value">${app.phone}</div></div>
                <div class="detail-item"><label>Date of Birth</label><div class="value">${dob}</div></div>
                <div class="detail-item"><label>Gender</label><div class="value">${app.gender || 'N/A'}</div></div>
            </div>
        </div>
        <div class="modal-section">
            <h3><i class="fas fa-map-marker-alt"></i> Address</h3>
            <div class="detail-grid">
                <div class="detail-item"><label>Address</label><div class="value">${app.address || 'N/A'}</div></div>
                <div class="detail-item"><label>City</label><div class="value">${app.city || 'N/A'}</div></div>
                <div class="detail-item"><label>State</label><div class="value">${app.state || 'N/A'}</div></div>
                <div class="detail-item"><label>Country</label><div class="value">${app.country || 'N/A'}</div></div>
            </div>
        </div>
        <div class="modal-section">
            <h3><i class="fas fa-graduation-cap"></i> Education & Course</h3>
            <div class="detail-grid">
                <div class="detail-item"><label>Education Level</label><div class="value">${app.education || 'N/A'}</div></div>
                <div class="detail-item"><label>Employment</label><div class="value">${app.employment || 'N/A'}</div></div>
                <div class="detail-item"><label>Course</label><div class="value">${app.courseName}</div></div>
                <div class="detail-item"><label>Study Mode</label><div class="value">${app.studyMode || 'N/A'}</div></div>
            </div>
        </div>
        <div class="modal-section">
            <h3><i class="fas fa-comment-alt"></i> Personal Statement</h3>
            <div class="detail-item" style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                <div class="value" style="line-height: 1.6;">${app.statement || 'N/A'}</div>
            </div>
        </div>
        ${app.documentUrl ? `
        <div class="modal-section">
            <h3><i class="fas fa-file"></i> Document</h3>
            <div class="detail-item">
                <a href="${app.documentUrl}" target="_blank" class="action-btn btn-view">
                    <i class="fas fa-download"></i> Download ${app.documentName || 'Document'}
                </a>
            </div>
        </div>
        ` : ''}
        ${app.status === 'pending' ? `
        <div class="modal-actions">
            <button class="modal-btn btn-approve-modal" onclick="updateStatus('${app.id}', 'approved'); closeModal();">
                <i class="fas fa-check"></i> Approve Application
            </button>
            <button class="modal-btn btn-decline-modal" onclick="updateStatus('${app.id}', 'declined'); closeModal();">
                <i class="fas fa-times"></i> Decline Application
            </button>
            <button class="modal-btn btn-cancel" onclick="closeModal()">Cancel</button>
        </div>
        ` : ''}
    `;

    document.getElementById('applicationModal').classList.add('show');
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('applicationModal').classList.remove('show');
}

/**
 * Update application status
 */
async function updateStatus(appId, newStatus) {
    try {
        showLoading();
        
        // Update status in Firestore
        await DatabaseService.updateApplicationStatus(appId, newStatus);
        
        // Reload applications
        await loadApplications();
        
        // Show success message
        showSuccess(`Application ${newStatus} successfully!`);
        
        hideLoading();

    } catch (error) {
        console.error('Error updating status:', error);
        showError('Failed to update application status. Please try again.');
        hideLoading();
    }
}

/**
 * Show loading state
 */
function showLoading() {
    // Add loading overlay if needed
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
    alert(message); // Can be replaced with a better UI notification
}

/**
 * Show success message
 */
function showSuccess(message) {
    alert(message); // Can be replaced with a better UI notification
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

// Make functions available globally
window.filterApplications = filterApplications;
window.viewApplication = viewApplication;
window.closeModal = closeModal;
window.updateStatus = updateStatus;
window.logout = logout;
