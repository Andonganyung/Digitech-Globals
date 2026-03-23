// ============================================
// COURSE REGISTRATION WITH FIREBASE
// ============================================

const COURSES_DATA = {
    'it-support-fundamentals': { name: 'IT Support Fundamentals', duration: '15 Hours', price: '$49' },
    'helpdesk-pro': { name: 'Help Desk Professional Certification', duration: '20 Hours', price: '$79' },
    'enterprise-desktop-engineer': { name: 'Enterprise Desktop Engineer', duration: '50 Hours', price: '$199' },
    'az-900': { name: 'Microsoft Azure Fundamentals (AZ-900)', duration: '20 Hours', price: '$79' },
    'az-104': { name: 'Azure Administrator (AZ-104)', duration: '40 Hours', price: '$149' },
    'cybersec-essentials': { name: 'Cybersecurity Essentials', duration: '30 Hours', price: '$99' },
    'security-plus': { name: 'CompTIA Security+ Prep', duration: '50 Hours', price: '$179' },
    'ms-900': { name: 'Microsoft 365 Fundamentals (MS-900)', duration: '15 Hours', price: '$59' },
    'intune-endpoint': { name: 'Microsoft Intune & Endpoint Management', duration: '25 Hours', price: '$89' },
    'sccm-intune-endpoint': { name: 'Enterprise Endpoint Management with SCCM & Intune', duration: '60 Hours', price: '$249' },
    'networking-fundamentals': { name: 'Networking Fundamentals', duration: '25 Hours', price: '$79' },
    'ccna-prep': { name: 'Cisco CCNA Preparation', duration: '60 Hours', price: '$199' },
    'powershell-it': { name: 'PowerShell for IT Professionals', duration: '20 Hours', price: '$69' },
    'python-it': { name: 'Python for IT Automation', duration: '30 Hours', price: '$99' },
    'ai-for-it-engineers': { name: 'AI for IT Engineers: Practical Automation', duration: '35 Hours', price: '$199' }
};

let uploadedDocument = null; // Store uploaded file temporarily

// Get course from URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course');
const course = COURSES_DATA[courseId];

// Display course info
if (course) {
    document.getElementById('courseName').textContent = course.name;
    document.getElementById('courseDetails').textContent = `${course.duration} • ${course.price}`;
    document.getElementById('courseInput').value = course.name;
    document.getElementById('courseIdInput').value = courseId;
} else {
    document.getElementById('courseInfoCard').innerHTML = '<h3>Course not specified</h3><p>Please select a course from the catalog</p>';
}

// File upload handler
document.getElementById('fileUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        // Validate file size and type
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            this.value = '';
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            alert('Only PDF, JPG, and PNG files are allowed');
            this.value = '';
            return;
        }
        
        uploadedDocument = file;
        document.getElementById('fileName').innerHTML = `<i class="fas fa-file"></i> ${file.name}`;
    }
});

// Password validation
function validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

// Form validation
function validateForm(formData) {
    let isValid = true;
    const errors = [];

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'country', 
                           'dob', 'gender', 'education', 'employment', 'studyMode', 'statement', 'username', 'password'];
    
    requiredFields.forEach(field => {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            const input = document.querySelector(`[name="${field}"]`);
            input.classList.add('error');
            input.nextElementSibling.classList.add('show');
            isValid = false;
        }
    });

    // Validate email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        const input = document.querySelector('[name="email"]');
        input.classList.add('error');
        input.nextElementSibling.textContent = 'Invalid email format';
        input.nextElementSibling.classList.add('show');
        isValid = false;
    }

    // Validate password
    const password = formData.get('password');
    if (password && !validatePassword(password)) {
        const input = document.querySelector('[name="password"]');
        input.classList.add('error');
        input.nextElementSibling.classList.add('show');
        isValid = false;
    }

    // Validate password match
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
        const input = document.querySelector('[name="confirmPassword"]');
        input.classList.add('error');
        input.nextElementSibling.classList.add('show');
        isValid = false;
    }

    // Validate statement length
    const statement = formData.get('statement');
    if (statement && statement.length < 50) {
        const input = document.querySelector('[name="statement"]');
        input.classList.add('error');
        input.nextElementSibling.classList.add('show');
        isValid = false;
    }

    // Validate terms
    if (!formData.get('terms')) {
        document.getElementById('termsError').classList.add('show');
        isValid = false;
    }

    return isValid;
}

// ✅ SECURE Form submission using Cloud Functions
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    if (!validateForm(formData)) {
        return;
    }

    // Disable submit button to prevent double submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const email = formData.get('email');
        const password = formData.get('password');

        // Step 1: Register user with Firebase Authentication
        const user = await AuthService.registerUser(email, password);
        console.log('User created:', user.uid);
        
        // ✅ User profile is automatically created by Cloud Function!
        // No client-side profile creation - prevents role manipulation

        // Step 2: Upload document if provided
        let documentUrl = null;
        let documentName = null;
        if (uploadedDocument) {
            try {
                const uploadResult = await StorageService.uploadDocument(uploadedDocument, user.uid);
                documentUrl = uploadResult.url;
                documentName = uploadResult.name;
                console.log('Document uploaded:', documentUrl);
            } catch (uploadError) {
                console.error('Document upload failed:', uploadError);
                // Continue without document - it's optional
            }
        }

        // Step 3: Prepare application data
        const applicationData = {
            courseId: formData.get('courseId'),
            courseName: formData.get('course'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: email,
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            country: formData.get('country'),
            dob: formData.get('dob'),
            gender: formData.get('gender'),
            education: formData.get('education'),
            employment: formData.get('employment'),
            studyMode: formData.get('studyMode'),
            statement: formData.get('statement'),
            documentUrl: documentUrl,
            documentName: documentName
        };

        // Step 4: ✅ SECURE - Call Cloud Function for server-side validation
        const createApp = firebase.functions().httpsCallable('createApplication');
        const result = await createApp(applicationData);
        
        console.log('Application created securely:', result.data.applicationId);

        // Step 5: Show success message
        document.getElementById('successMessage').classList.add('show');
        this.style.display = 'none';

        // Step 6: Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // Show error message (sanitized)
        let errorMessage = 'Registration failed. Please try again.';
        if (error.message) {
            // ✅ Sanitize error message to prevent XSS
            const tempDiv = document.createElement('div');
            tempDiv.textContent = error.message;
            errorMessage = tempDiv.innerHTML;
        }

        // Display error in UI
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.style.cssText = 'background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;';
        // ✅ Use textContent instead of innerHTML to prevent XSS
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-circle';
        errorDiv.appendChild(icon);
        errorDiv.appendChild(document.createTextNode(' ' + errorMessage));
        
        const form = document.getElementById('registrationForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
});
