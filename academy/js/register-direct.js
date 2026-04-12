// Direct registration without Cloud Functions - workaround
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
        
        // Get pricing
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('course');
        const pricing = getCoursePricing(courseId);
        const amount = trainingMode === 'self-study' ? pricing.selfStudy : pricing.instructorLed;

        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save registration data to Firestore
        await firebase.firestore().collection('registrations').add({
            uid: user.uid,
            courseId: courseId,
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
            courseId, trainingMode, amount,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: email,
            phone: formData.get('phone')
        }));

        // Redirect to checkout
        window.location.href = `checkout.html?course=${courseId}&mode=${trainingMode}&amount=${amount}`;

    } catch (error) {
        console.error('Registration error:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        alert('Registration failed: ' + error.message);
    }
});
