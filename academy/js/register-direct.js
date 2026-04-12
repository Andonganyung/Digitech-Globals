// Direct registration without Cloud Functions - workaround

// Course data mapping
const COURSES_DATA = {
    'it-support-fundamentals': { name: 'IT Support Fundamentals', duration: '15 Hours' },
    'helpdesk-pro': { name: 'Help Desk Professional Certification', duration: '20 Hours' },
    'enterprise-desktop-engineer': { name: 'Enterprise Desktop Engineer', duration: '50 Hours' },
    'az-900': { name: 'Microsoft Azure Fundamentals (AZ-900)', duration: '20 Hours' },
    'az-104': { name: 'Azure Administrator (AZ-104)', duration: '40 Hours' },
    'cybersec-essentials': { name: 'Cybersecurity Essentials', duration: '30 Hours' },
    'security-plus': { name: 'CompTIA Security+ Prep', duration: '50 Hours' },
    'ms-900': { name: 'Microsoft 365 Fundamentals (MS-900)', duration: '15 Hours' },
    'intune-endpoint': { name: 'Microsoft Intune & Endpoint Management', duration: '25 Hours' },
    'sccm-intune-endpoint': { name: 'Enterprise Endpoint Management with SCCM & Intune', duration: '60 Hours' },
    'networking-fundamentals': { name: 'Networking Fundamentals', duration: '25 Hours' },
    'ccna-prep': { name: 'Cisco CCNA Preparation', duration: '60 Hours' },
    'powershell-it': { name: 'PowerShell for IT Professionals', duration: '20 Hours' },
    'python-it': { name: 'Python for IT Automation', duration: '30 Hours' },
    'ai-for-it-engineers': { name: 'AI for IT Engineers: Practical Automation', duration: '35 Hours' },
    'computer-basics': { name: 'Computer Basics for Beginners', duration: '12 Hours' },
    'windows-basics': { name: 'Windows 10/11 Fundamentals', duration: '15 Hours' },
    'internet-safety': { name: 'Internet Safety & Security', duration: '10 Hours' },
    'ms-excel': { name: 'Microsoft Excel Essentials', duration: '18 Hours' },
    'ms-word': { name: 'Microsoft Word Essentials', duration: '15 Hours' },
    'ms-powerpoint': { name: 'Microsoft PowerPoint Essentials', duration: '12 Hours' },
    'ms-outlook': { name: 'Microsoft Outlook Essentials', duration: '10 Hours' },
    'windows-power': { name: 'Windows Power User', duration: '25 Hours' },
    'digital-marketing': { name: 'Digital Marketing Fundamentals', duration: '28 Hours' },
    'entrepreneurship': { name: 'Entrepreneurship Essentials', duration: '30 Hours' },
    'leadership': { name: 'Leadership & Management', duration: '25 Hours' },
    'email-social': { name: 'Email & Social Media Marketing', duration: '22 Hours' }
};

// Display course info on page load
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course');
const courseData = COURSES_DATA[courseId];
const pricing = getCoursePricing(courseId);

if (courseData) {
    document.getElementById('courseName').textContent = courseData.name;
    document.getElementById('courseDetails').textContent = `${courseData.duration} • Self-Study: $${pricing.selfStudy} • Instructor-Led: $${pricing.instructorLed}`;
    document.getElementById('selfStudyPrice').textContent = '$' + pricing.selfStudy;
    document.getElementById('instructorLedPrice').textContent = '$' + pricing.instructorLed;
    
    // Auto-select course in dropdown
    document.getElementById('courseSelect').value = courseId;
} else {
    document.getElementById('courseInfoCard').innerHTML = '<h3>Course not found</h3><p>Please select a course from the catalog</p>';
}

document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        const email = formData.get('email');
        const password = formData.get('password');
        const trainingMode = document.querySelector('input[name="trainingMode"]:checked').value;
        
        // Get pricing from selected course
        const selectedCourseId = document.getElementById('courseSelect').value;
        const pricing = getCoursePricing(selectedCourseId);
        const amount = trainingMode === 'self-study' ? pricing.selfStudy : pricing.instructorLed;

        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save registration data to Firestore
        await firebase.firestore().collection('registrations').add({
            uid: user.uid,
            courseId: selectedCourseId,
            trainingMode: trainingMode,
            amount: amount,
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
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Store data for checkout
        sessionStorage.setItem('pendingRegistration', JSON.stringify({
            courseId: selectedCourseId, trainingMode, amount,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: email,
            phone: formData.get('phone')
        }));

        // Redirect to checkout
        window.location.href = `checkout.html?course=${selectedCourseId}&mode=${trainingMode}&amount=${amount}`;

    } catch (error) {
        console.error('Registration error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        alert('Registration failed: ' + error.message);
    }
});
