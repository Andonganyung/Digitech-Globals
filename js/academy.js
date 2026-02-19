// DigiTech Academy - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Course Filtering
    initCourseFilters();
    
    // Billing Toggle
    initBillingToggle();
    
    // FAQ Accordion
    initFAQAccordion();
    
});

// Course Filtering System
function initCourseFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchCourses');
    const coursesGrid = document.getElementById('coursesGrid');
    const noResults = document.getElementById('noResults');
    
    if (!coursesGrid) return;
    
    const courseCards = coursesGrid.querySelectorAll('.course-card');
    
    function filterCourses() {
        const category = categoryFilter ? categoryFilter.value : 'all';
        const level = levelFilter ? levelFilter.value : 'all';
        const price = priceFilter ? priceFilter.value : 'all';
        const search = searchInput ? searchInput.value.toLowerCase() : '';
        
        let visibleCount = 0;
        
        courseCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardLevel = card.dataset.level;
            const cardPrice = card.dataset.price;
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('p').textContent.toLowerCase();
            
            const matchCategory = category === 'all' || cardCategory === category;
            const matchLevel = level === 'all' || cardLevel === level;
            const matchPrice = price === 'all' || cardPrice === price;
            const matchSearch = search === '' || cardTitle.includes(search) || cardDesc.includes(search);
            
            if (matchCategory && matchLevel && matchPrice && matchSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
    
    // Add event listeners
    if (categoryFilter) categoryFilter.addEventListener('change', filterCourses);
    if (levelFilter) levelFilter.addEventListener('change', filterCourses);
    if (priceFilter) priceFilter.addEventListener('change', filterCourses);
    if (searchInput) searchInput.addEventListener('input', filterCourses);
    
    // Check URL params for initial filter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
        filterCourses();
    }
}

// Billing Toggle (Monthly/Annual)
function initBillingToggle() {
    const billingToggle = document.getElementById('billingToggle');
    const proPrice = document.getElementById('proPrice');
    const proPeriod = document.getElementById('proPeriod');
    
    if (!billingToggle || !proPrice) return;
    
    const prices = {
        monthly: { amount: '$49', period: '/month' },
        annual: { amount: '$349', period: '/year' }
    };
    
    billingToggle.addEventListener('change', function() {
        const isAnnual = this.checked;
        const pricing = isAnnual ? prices.annual : prices.monthly;
        
        proPrice.textContent = pricing.amount;
        proPeriod.textContent = pricing.period;
        
        // Update button data
        const subscribeBtn = document.getElementById('proSubscribeBtn');
        if (subscribeBtn) {
            subscribeBtn.dataset.plan = isAnnual ? 'pro-annual' : 'pro-monthly';
        }
        
        // Toggle labels
        document.querySelectorAll('.toggle-label').forEach(label => {
            label.classList.toggle('active', label.dataset.billing === (isAnnual ? 'annual' : 'monthly'));
        });
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Subscription Functions (Stripe Integration Placeholders)
function startFreePlan() {
    // Redirect to signup with free plan
    window.location.href = 'dashboard.html?plan=free&signup=true';
}

function subscribePro() {
    const billingToggle = document.getElementById('billingToggle');
    const isAnnual = billingToggle ? billingToggle.checked : false;
    const plan = isAnnual ? 'pro-annual' : 'pro-monthly';
    
    // Check if Stripe is loaded
    if (typeof initiateStripeCheckout === 'function') {
        initiateStripeCheckout(plan);
    } else {
        // Fallback - redirect to checkout page
        window.location.href = `checkout.html?plan=${plan}`;
    }
}

// Course Enrollment
function enrollCourse(courseId) {
    // Check if user is logged in
    const user = localStorage.getItem('academyUser');
    
    if (!user) {
        // Redirect to login/signup
        window.location.href = `login.html?redirect=course-detail.html?id=${courseId}`;
        return;
    }
    
    // Check subscription status
    const userData = JSON.parse(user);
    
    if (userData.subscription === 'pro' || userData.subscription === 'enterprise') {
        // Direct access for subscribers
        window.location.href = `course-player.html?id=${courseId}`;
    } else {
        // Single course purchase
        if (typeof initiateStripeCheckout === 'function') {
            initiateStripeCheckout('course', courseId);
        } else {
            window.location.href = `checkout.html?type=course&id=${courseId}`;
        }
    }
}

// Progress Tracking
function updateProgress(courseId, lessonId, completed) {
    const progressKey = `progress_${courseId}`;
    let progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    progress[lessonId] = completed;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    
    // Calculate overall progress
    const totalLessons = document.querySelectorAll('.lesson-item').length;
    const completedLessons = Object.values(progress).filter(v => v).length;
    const percentage = Math.round((completedLessons / totalLessons) * 100);
    
    // Update UI
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}% Complete`;
    
    // Sync with server if logged in
    syncProgressToServer(courseId, progress);
}

function syncProgressToServer(courseId, progress) {
    // API call to save progress
    // This would connect to your backend
    console.log('Syncing progress:', courseId, progress);
}

// Certificate Generation
function generateCertificate(courseId, courseName) {
    const user = JSON.parse(localStorage.getItem('academyUser') || '{}');
    
    const certificateData = {
        studentName: user.name || 'Student',
        courseName: courseName,
        completionDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        certificateId: `DTG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    
    // Store certificate
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    certificates.push({
        ...certificateData,
        courseId: courseId,
        issuedAt: new Date().toISOString()
    });
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    // Redirect to certificate view
    window.location.href = `certificate.html?id=${certificateData.certificateId}`;
}
