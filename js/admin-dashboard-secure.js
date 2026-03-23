// ============================================
// SECURE ADMIN DASHBOARD WITH XSS PROTECTION
// ============================================

let currentAdmin = null;
let allApplications = [];

// ✅ SECURE: HTML Sanitization Helper
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ✅ SECURE: Create element with text content (prevents XSS)
function createTextElement(tag, text, className = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text; // ✅ Safe - auto-escapes HTML
    return element;
}

// Check authentication on page load
AuthService.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Get user profile
        const userProfile = await DatabaseService.getUserProfile(user.uid);
        
        // Check if user is admin
        if (userProfile.role !== 'admin') {
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
        await AuthService.logoutUser();
        window.location.href = 'login.html';
    }
});

/**
 * ✅ SECURE: Load all applications
 */
async function loadApplications() {
    try {
        showLoading();

        allApplications = await DatabaseService.getAllApplications();
        updateStats();
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
        // ✅ SAFE: Numbers can't contain XSS
        document.getElementById('totalApps').textContent = stats.total;
        document.getElementById('pendingApps').textContent = stats.pending;
        document.getElementById('approvedApps').textContent = stats.approved;
        document.getElementById('declinedApps').textContent = stats.declined;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

/**
 * ✅ SECURE: Render applications in table with XSS protection
 */
function renderApplications(apps) {
    const tbody = document.getElementById('applicationsBody');
    tbody.innerHTML = ''; // Clear existing content
    
    if (apps.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 7;
        td.style.textAlign = 'center';
        td.style.padding = '40px';
        td.textContent = 'No applications found';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    apps.forEach(app => {
        const tr = document.createElement('tr');
        
        // Application ID (truncated, safe)
        const tdId = createTextElement('td', app.id.substring(0, 12) + '...');
        
        // ✅ SECURE: Name (sanitized)
        const tdName = createTextElement('td', `${app.firstName} ${app.lastName}`);
        
        // ✅ SECURE: Email (sanitized)
        const tdEmail = createTextElement('td', app.email);
        
        // ✅ SECURE: Course name (sanitized)
        const tdCourse = createTextElement('td', app.courseName);
        
        // Date (safe - server timestamp)
        const submittedDate = app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleDateString() : 'N/A';
        const tdDate = createTextElement('td', submittedDate);
        
        // Status badge (safe - server-controlled values)
        const tdStatus = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `status-badge status-${app.status}`;
        statusBadge.textContent = app.status.charAt(0).toUpperCase() + app.status.slice(1);
        tdStatus.appendChild(statusBadge);
        
        // Actions
        const tdActions = document.createElement('td');
        
        // View button
        const btnView = document.createElement('button');
        btnView.className = 'action-btn btn-view';
        btnView.innerHTML = '<i class="fas fa-eye"></i> View';
        btnView.onclick = () => viewApplication(app.id);
        tdActions.appendChild(btnView);
        
        // Approve/Decline buttons (only for pending)
        if (app.status === 'pending') {
            const btnApprove = document.createElement('button');
            btnApprove.className = 'action-btn btn-approve';
            btnApprove.innerHTML = '<i class="fas fa-check"></i>';
            btnApprove.onclick = () => updateStatus(app.id, 'approved');
            tdActions.appendChild(btnApprove);
            
            const btnDecline = document.createElement('button');
            btnDecline.className = 'action-btn btn-decline';
            btnDecline.innerHTML = '<i class="fas fa-times"></i>';
            btnDecline.onclick = () => updateStatus(app.id, 'declined');
            tdActions.appendChild(btnDecline);
        }
        
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdCourse);
        tr.appendChild(tdDate);
        tr.appendChild(tdStatus);
        tr.appendChild(tdActions);
        
        tbody.appendChild(tr);
    });
}

/**
 * Filter applications
 */
function filterApplications() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchText = document.getElementById('searchFilter').value.toLowerCase();

    let filtered = allApplications;

    if (statusFilter !== 'all') {
        filtered = filtered.filter(app => app.status === statusFilter);
    }

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
 * ✅ SECURE: View application details with XSS protection
 */
function viewApplication(appId) {
    const app = allApplications.find(a => a.id === appId);
    if (!app) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = ''; // Clear existing content
    
    // Helper function to create detail section
    function createSection(title, icon) {
        const section = document.createElement('div');
        section.className = 'modal-section';
        
        const h3 = document.createElement('h3');
        const iconEl = document.createElement('i');
        iconEl.className = `fas fa-${icon}`;
        h3.appendChild(iconEl);
        h3.appendChild(document.createTextNode(' ' + title));
        
        section.appendChild(h3);
        return section;
    }
    
    function createDetailItem(label, value) {
        const item = document.createElement('div');
        item.className = 'detail-item';
        
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        
        const valueEl = document.createElement('div');
        valueEl.className = 'value';
        valueEl.textContent = value; // ✅ SAFE - textContent auto-escapes
        
        item.appendChild(labelEl);
        item.appendChild(valueEl);
        return item;
    }
    
    // Application Information
    const infoSection = createSection('Application Information', 'info-circle');
    const infoGrid = document.createElement('div');
    infoGrid.className = 'detail-grid';
    
    infoGrid.appendChild(createDetailItem('Application ID', app.id));
    
    const statusItem = document.createElement('div');
    statusItem.className = 'detail-item';
    const statusLabel = createTextElement('label', 'Status');
    const statusValue = document.createElement('div');
    statusValue.className = 'value';
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-${app.status}`;
    statusBadge.textContent = app.status.toUpperCase();
    statusValue.appendChild(statusBadge);
    statusItem.appendChild(statusLabel);
    statusItem.appendChild(statusValue);
    infoGrid.appendChild(statusItem);
    
    const submittedDate = app.submittedAt ? new Date(app.submittedAt.toDate()).toLocaleString() : 'N/A';
    infoGrid.appendChild(createDetailItem('Submitted', submittedDate));
    
    infoSection.appendChild(infoGrid);
    modalBody.appendChild(infoSection);
    
    // Personal Information
    const personalSection = createSection('Personal Information', 'user');
    const personalGrid = document.createElement('div');
    personalGrid.className = 'detail-grid';
    
    personalGrid.appendChild(createDetailItem('Full Name', `${app.firstName} ${app.lastName}`));
    personalGrid.appendChild(createDetailItem('Email', app.email));
    personalGrid.appendChild(createDetailItem('Phone', app.phone || 'N/A'));
    
    const dob = app.dob ? new Date(app.dob).toLocaleDateString() : 'N/A';
    personalGrid.appendChild(createDetailItem('Date of Birth', dob));
    personalGrid.appendChild(createDetailItem('Gender', app.gender || 'N/A'));
    
    personalSection.appendChild(personalGrid);
    modalBody.appendChild(personalSection);
    
    // Address
    const addressSection = createSection('Address', 'map-marker-alt');
    const addressGrid = document.createElement('div');
    addressGrid.className = 'detail-grid';
    
    addressGrid.appendChild(createDetailItem('Address', app.address || 'N/A'));
    addressGrid.appendChild(createDetailItem('City', app.city || 'N/A'));
    addressGrid.appendChild(createDetailItem('State', app.state || 'N/A'));
    addressGrid.appendChild(createDetailItem('Country', app.country || 'N/A'));
    
    addressSection.appendChild(addressGrid);
    modalBody.appendChild(addressSection);
    
    // Education & Course
    const eduSection = createSection('Education & Course', 'graduation-cap');
    const eduGrid = document.createElement('div');
    eduGrid.className = 'detail-grid';
    
    eduGrid.appendChild(createDetailItem('Education Level', app.education || 'N/A'));
    eduGrid.appendChild(createDetailItem('Employment', app.employment || 'N/A'));
    eduGrid.appendChild(createDetailItem('Course', app.courseName));
    eduGrid.appendChild(createDetailItem('Study Mode', app.studyMode || 'N/A'));
    
    eduSection.appendChild(eduGrid);
    modalBody.appendChild(eduSection);
    
    // Personal Statement (special handling for longer text)
    const statementSection = createSection('Personal Statement', 'comment-alt');
    const statementDiv = document.createElement('div');
    statementDiv.className = 'detail-item';
    statementDiv.style.cssText = 'background: #f9fafb; padding: 15px; border-radius: 8px;';
    const statementValue = document.createElement('div');
    statementValue.className = 'value';
    statementValue.style.lineHeight = '1.6';
    statementValue.textContent = app.statement || 'N/A'; // ✅ SAFE
    statementDiv.appendChild(statementValue);
    statementSection.appendChild(statementDiv);
    modalBody.appendChild(statementSection);
    
    // Document (if exists)
    if (app.documentUrl) {
        const docSection = createSection('Document', 'file');
        const docItem = document.createElement('div');
        docItem.className = 'detail-item';
        
        const docLink = document.createElement('a');
        docLink.href = app.documentUrl;
        docLink.target = '_blank';
        docLink.className = 'action-btn btn-view';
        docLink.innerHTML = '<i class="fas fa-download"></i> ';
        docLink.appendChild(document.createTextNode(`Download ${app.documentName || 'Document'}`));
        
        docItem.appendChild(docLink);
        docSection.appendChild(docItem);
        modalBody.appendChild(docSection);
    }
    
    // Actions (if pending)
    if (app.status === 'pending') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'modal-actions';
        
        const btnApprove = document.createElement('button');
        btnApprove.className = 'modal-btn btn-approve-modal';
        btnApprove.innerHTML = '<i class="fas fa-check"></i> Approve Application';
        btnApprove.onclick = () => {
            updateStatus(app.id, 'approved');
            closeModal();
        };
        
        const btnDecline = document.createElement('button');
        btnDecline.className = 'modal-btn btn-decline-modal';
        btnDecline.innerHTML = '<i class="fas fa-times"></i> Decline Application';
        btnDecline.onclick = () => {
            updateStatus(app.id, 'declined');
            closeModal();
        };
        
        const btnCancel = document.createElement('button');
        btnCancel.className = 'modal-btn btn-cancel';
        btnCancel.textContent = 'Cancel';
        btnCancel.onclick = closeModal;
        
        actionsDiv.appendChild(btnApprove);
        actionsDiv.appendChild(btnDecline);
        actionsDiv.appendChild(btnCancel);
        modalBody.appendChild(actionsDiv);
    }

    document.getElementById('applicationModal').classList.add('show');
}

/**
 * Close modal
 */
function closeModal() {
    document.getElementById('applicationModal').classList.remove('show');
}

/**
 * ✅ SECURE: Update status using Cloud Function
 */
async function updateStatus(appId, newStatus) {
    try {
        showLoading();
        
        // ✅ Call secure Cloud Function
        const updateStatusFunc = firebase.functions().httpsCallable('updateApplicationStatus');
        await updateStatusFunc({ applicationId: appId, status: newStatus });
        
        await loadApplications();
        showSuccess(`Application ${newStatus} successfully!`);
        hideLoading();

    } catch (error) {
        console.error('Error updating status:', error);
        showError('Failed to update application status. Please try again.');
        hideLoading();
    }
}

function showLoading() {
    console.log('Loading...');
}

function hideLoading() {
    console.log('Loaded');
}

function showError(message) {
    alert(message);
}

function showSuccess(message) {
    alert(message);
}

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
