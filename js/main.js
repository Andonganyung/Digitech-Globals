// DigiTech Globals - Main JavaScript
// Smart Features & Responsive Enhancements

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all smart features
    initScrollProgress();
    initScrollReveal();
    initCounterAnimation();
    initParticles();
    initTiltEffect();
    initMagneticButtons();
    initSmoothAnchors();
    initLazyLoading();
    
    // Mobile Navigation
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Mobile dropdown toggle
        const dropdowns = navMenu.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            const chevron = link.querySelector('i');
            
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    // On mobile, if clicking on the chevron icon, toggle dropdown
                    // Otherwise, navigate to the link
                    if (e.target === chevron || e.target === link && !link.getAttribute('href').includes('.html')) {
                        e.preventDefault();
                        dropdown.classList.toggle('active');
                    }
                    // If link has a valid href, allow navigation
                }
            });
        });

        // Close menu when clicking a link in dropdown
        navMenu.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Skill Bar Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                const progress = bar.dataset.progress;
                bar.style.width = progress + '%';
            }
        });
    };

    window.addEventListener('scroll', animateSkills);
    animateSkills();

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for Fade Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe stat items
    document.querySelectorAll('.stat-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe tech items
    document.querySelectorAll('.tech-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    // Observe why-feature items
    document.querySelectorAll('.why-feature').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.15}s, transform 0.5s ease ${index * 0.15}s`;
        observer.observe(item);
    });

    // Observe social icons
    document.querySelectorAll('.social-icon').forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(20px)';
        icon.style.transition = `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`;
        observer.observe(icon);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Initialize Pricing Calculator
    initPricingCalculator();

});

// Pricing Calculator Function
function initPricingCalculator() {
    const rates = {
        users: 125,
        devices: 45,
        servers: 250,
        locations: 200,
        firewalls: 75,
        switches: 35,
        afterHours: 150,
        onsite: 125,
        emergency: 200,
        projects: 100
    };

    // Slider inputs and their displays
    const sliders = {
        users: { input: document.getElementById('users'), display: document.getElementById('usersValue') },
        devices: { input: document.getElementById('devices'), display: document.getElementById('devicesValue') },
        servers: { input: document.getElementById('servers'), display: document.getElementById('serversValue') },
        locations: { input: document.getElementById('locations'), display: document.getElementById('locationsValue') },
        firewalls: { input: document.getElementById('firewalls'), display: document.getElementById('firewallsValue') },
        switches: { input: document.getElementById('switches'), display: document.getElementById('switchesValue') }
    };

    // Hourly add-ons
    const addons = {
        afterHours: {
            checkbox: document.getElementById('optAfterHours'),
            slider: document.getElementById('afterHoursHrs'),
            display: document.getElementById('afterHoursHrsValue'),
            container: document.querySelector('#optAfterHours')?.closest('.hourly-service-item')?.querySelector('.hours-slider')
        },
        onsite: {
            checkbox: document.getElementById('optOnsite'),
            slider: document.getElementById('onsiteHrs'),
            display: document.getElementById('onsiteHrsValue'),
            container: document.querySelector('#optOnsite')?.closest('.hourly-service-item')?.querySelector('.hours-slider')
        },
        emergency: {
            checkbox: document.getElementById('optEmergency'),
            slider: document.getElementById('emergencyHrs'),
            display: document.getElementById('emergencyHrsValue'),
            container: document.querySelector('#optEmergency')?.closest('.hourly-service-item')?.querySelector('.hours-slider')
        },
        projects: {
            checkbox: document.getElementById('optProjects'),
            slider: document.getElementById('projectHrs'),
            display: document.getElementById('projectHrsValue'),
            container: document.querySelector('#optProjects')?.closest('.hourly-service-item')?.querySelector('.hours-slider')
        }
    };

    // Output elements
    const totalPriceEl = document.getElementById('totalPrice');
    const desktopPriceEl = document.getElementById('desktopPrice');
    const networkPriceEl = document.getElementById('networkPrice');
    const addonsPriceEl = document.getElementById('addonsPrice');

    // Check if calculator elements exist
    if (!totalPriceEl) return;

    function calculatePrice() {
        // Desktop support
        const usersVal = sliders.users.input ? parseInt(sliders.users.input.value) : 0;
        const devicesVal = sliders.devices.input ? parseInt(sliders.devices.input.value) : 0;
        const serversVal = sliders.servers.input ? parseInt(sliders.servers.input.value) : 0;
        const desktopTotal = (usersVal * rates.users) + (devicesVal * rates.devices) + (serversVal * rates.servers);

        // Network support
        const locationsVal = sliders.locations.input ? parseInt(sliders.locations.input.value) : 0;
        const firewallsVal = sliders.firewalls.input ? parseInt(sliders.firewalls.input.value) : 0;
        const switchesVal = sliders.switches.input ? parseInt(sliders.switches.input.value) : 0;
        const networkTotal = (locationsVal * rates.locations) + (firewallsVal * rates.firewalls) + (switchesVal * rates.switches);

        // Add-ons
        let addonsTotal = 0;
        
        if (addons.afterHours.checkbox?.checked && addons.afterHours.slider) {
            addonsTotal += parseInt(addons.afterHours.slider.value) * rates.afterHours;
        }
        if (addons.onsite.checkbox?.checked && addons.onsite.slider) {
            addonsTotal += parseInt(addons.onsite.slider.value) * rates.onsite;
        }
        if (addons.emergency.checkbox?.checked && addons.emergency.slider) {
            addonsTotal += parseInt(addons.emergency.slider.value) * rates.emergency;
        }
        if (addons.projects.checkbox?.checked && addons.projects.slider) {
            addonsTotal += parseInt(addons.projects.slider.value) * rates.projects;
        }

        // Update displays
        const total = desktopTotal + networkTotal + addonsTotal;
        
        if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString();
        if (desktopPriceEl) desktopPriceEl.textContent = '$' + desktopTotal.toLocaleString();
        if (networkPriceEl) networkPriceEl.textContent = '$' + networkTotal.toLocaleString();
        if (addonsPriceEl) addonsPriceEl.textContent = '$' + addonsTotal.toLocaleString();
    }

    // Initialize slider event listeners
    Object.keys(sliders).forEach(key => {
        const slider = sliders[key];
        if (slider.input && slider.display) {
            slider.input.addEventListener('input', () => {
                slider.display.textContent = slider.input.value;
                calculatePrice();
            });
        }
    });

    // Initialize add-on event listeners
    Object.keys(addons).forEach(key => {
        const addon = addons[key];
        
        if (addon.checkbox) {
            addon.checkbox.addEventListener('change', () => {
                if (addon.container) {
                    addon.container.classList.toggle('active', addon.checkbox.checked);
                }
                calculatePrice();
            });
        }
        
        if (addon.slider && addon.display) {
            addon.slider.addEventListener('input', () => {
                addon.display.textContent = addon.slider.value;
                calculatePrice();
            });
        }
    });

    // Initial calculation
    calculatePrice();
}

// =============================================
// SMART FEATURES
// =============================================

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.id = 'scrollProgress';
    document.body.prepend(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.service-card, .why-card, .stat-item, .tech-item, .feature-card, .plan-card, .course-card, .skill-item');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal', 'active');
                }, index * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
    
    // Section titles
    document.querySelectorAll('.section-title, .section-header').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number, .hero-stat .stat-num, .counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.innerText.replace(/[^0-9]/g, ''));
        const suffix = counter.innerText.replace(/[0-9]/g, '');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.innerText = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target + suffix;
            }
        };
        
        updateCounter();
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counter.dataset.originalText = counter.innerText;
        counterObserver.observe(counter);
    });
}

// Particle Effect for Hero Section
function initParticles() {
    const heroSection = document.querySelector('.hero-section, .academy-hero, .app-hero');
    if (!heroSection) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.style.position = 'relative';
    heroSection.prepend(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Tilt Effect on Cards
function initTiltEffect() {
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.service-card, .why-card, .feature-card, .plan-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }
}

// Magnetic Button Effect
function initMagneticButtons() {
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// Smooth Anchor Scrolling
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Lazy Loading Images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Enhanced Back to Top with Progress Circle
function createBackToTop() {
    const existingBtn = document.getElementById('backToTop');
    if (existingBtn) {
        existingBtn.classList.add('back-to-top');
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                existingBtn.classList.add('visible');
            } else {
                existingBtn.classList.remove('visible');
            }
        });
    }
}

// Create back to top if it doesn't exist
if (!document.getElementById('backToTop')) {
    const btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}

// Typing Effect
function initTypingEffect(element, texts, speed = 100) {
    if (!element) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; type(); }, 2000);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, isDeleting ? speed / 2 : speed);
    }
    
    type();
}

// Touch-friendly swipe detection
function initSwipeDetection() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (diff > 0 && navMenu?.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle?.classList.remove('active');
            }
        }
    }
}

initSwipeDetection();

// Viewport Height Fix for Mobile
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

// Performance: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Optimize scroll handlers
window.addEventListener('scroll', debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 10));
