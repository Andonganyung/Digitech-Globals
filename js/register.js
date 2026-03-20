// Course Registration Handler
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
    const fileName = e.target.files[0]?.name;
    if (fileName) {
        document.getElementById('fileName').innerHTML = `<i class="fas fa-file"></i> ${fileName}`;
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

// Form submission
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    if (!validateForm(formData)) {
        return;
    }

    // Prepare application data
    const applicationData = {
        courseId: formData.get('courseId'),
        courseName: formData.get('course'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
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
        username: formData.get('username'),
        password: formData.get('password'),
        role: 'candidate',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        document: formData.get('document')?.name || null
    };

    // Save to localStorage (simulating backend)
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check username uniqueness
    if (users.find(u => u.username === applicationData.username)) {
        const input = document.querySelector('[name="username"]');
        input.classList.add('error');
        input.nextElementSibling.textContent = 'Username already exists';
        input.nextElementSibling.classList.add('show');
        return;
    }

    // Check email uniqueness
    if (users.find(u => u.email === applicationData.email)) {
        const input = document.querySelector('[name="email"]');
        input.classList.add('error');
        input.nextElementSibling.textContent = 'Email already registered';
        input.nextElementSibling.classList.add('show');
        return;
    }

    // Generate application ID
    applicationData.id = 'APP' + Date.now();

    // Save application
    applications.push(applicationData);
    localStorage.setItem('applications', JSON.stringify(applications));

    // Create user account
    const userAccount = {
        id: 'USER' + Date.now(),
        username: applicationData.username,
        email: applicationData.email,
        password: applicationData.password, // In production, hash this
        role: 'candidate',
        firstName: applicationData.firstName,
        lastName: applicationData.lastName,
        applicationId: applicationData.id,
        createdAt: new Date().toISOString()
    };

    users.push(userAccount);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    document.getElementById('successMessage').classList.add('show');
    this.style.display = 'none';

    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html?registered=true';
    }, 2000);
});
