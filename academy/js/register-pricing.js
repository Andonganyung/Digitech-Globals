// Initialize pricing on registration page
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course');
const pricing = getCoursePricing(courseId);

document.getElementById('selfStudyPrice').textContent = '$' + pricing.selfStudy;
document.getElementById('instructorLedPrice').textContent = '$' + pricing.instructorLed;

// Highlight selected pricing option
document.querySelectorAll('.pricing-option-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.pricing-option-card').forEach(c => c.style.borderColor = '#d1d5db');
        this.style.borderColor = '#2563eb';
    });
});

// Override form submission to proceed to checkout
const origSubmit = document.getElementById('registrationForm').onsubmit;
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const trainingMode = document.querySelector('input[name="trainingMode"]:checked').value;
    const amount = trainingMode === 'self-study' ? pricing.selfStudy : pricing.instructorLed;
    const formData = new FormData(this);
    
    sessionStorage.setItem('pendingRegistration', JSON.stringify({
        courseId, 
        trainingMode, 
        amount,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    }));
    
    window.location.href = `checkout.html?course=${courseId}&mode=${trainingMode}&amount=${amount}`;
});
