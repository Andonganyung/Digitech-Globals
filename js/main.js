// DigiTech Globals - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
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
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
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
