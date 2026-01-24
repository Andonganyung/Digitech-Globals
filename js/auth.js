// Password Protection for DigiTech Globals
(function() {
    const SITE_PASSWORD = 'Admin@123';
    const AUTH_KEY = 'digitech_authenticated';
    
    function isAuthenticated() {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    }
    
    function showLoginOverlay() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <div class="auth-logo">
                        <i class="fas fa-globe"></i>
                        <span>DigiTech<strong>Globals</strong></span>
                    </div>
                    <h2>Protected Site</h2>
                    <p>Please enter the password to access this website.</p>
                    <form id="auth-form">
                        <div class="auth-input-group">
                            <i class="fas fa-lock"></i>
                            <input type="password" id="auth-password" placeholder="Enter password" required autofocus>
                        </div>
                        <button type="submit" class="auth-btn">
                            <i class="fas fa-sign-in-alt"></i> Access Site
                        </button>
                        <p id="auth-error" class="auth-error"></p>
                    </form>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #auth-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Poppins', sans-serif;
            }
            .auth-container {
                width: 100%;
                max-width: 420px;
                padding: 20px;
            }
            .auth-box {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            .auth-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 30px;
                font-size: 1.5rem;
                color: #fff;
            }
            .auth-logo i {
                font-size: 2rem;
                color: #00d4ff;
            }
            .auth-logo strong {
                color: #00d4ff;
            }
            .auth-box h2 {
                color: #fff;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .auth-box p {
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 25px;
                font-size: 0.95rem;
            }
            .auth-input-group {
                position: relative;
                margin-bottom: 20px;
            }
            .auth-input-group i {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(255, 255, 255, 0.5);
            }
            #auth-password {
                width: 100%;
                padding: 15px 15px 15px 45px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                color: #fff;
                font-size: 1rem;
                outline: none;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }
            #auth-password:focus {
                border-color: #00d4ff;
                background: rgba(255, 255, 255, 0.1);
            }
            #auth-password::placeholder {
                color: rgba(255, 255, 255, 0.4);
            }
            .auth-btn {
                width: 100%;
                padding: 15px;
                border: none;
                border-radius: 10px;
                background: linear-gradient(135deg, #00d4ff, #0099cc);
                color: #fff;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            .auth-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            }
            .auth-error {
                color: #ff6b6b;
                margin-top: 15px;
                font-size: 0.9rem;
                min-height: 20px;
            }
            .auth-box.shake {
                animation: shake 0.5s ease;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(overlay);
        
        // Handle form submission
        document.getElementById('auth-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('auth-password').value;
            const errorEl = document.getElementById('auth-error');
            const authBox = document.querySelector('.auth-box');
            
            if (password === SITE_PASSWORD) {
                sessionStorage.setItem(AUTH_KEY, 'true');
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s ease';
                setTimeout(() => overlay.remove(), 300);
            } else {
                errorEl.textContent = 'Incorrect password. Please try again.';
                authBox.classList.add('shake');
                setTimeout(() => authBox.classList.remove('shake'), 500);
                document.getElementById('auth-password').value = '';
                document.getElementById('auth-password').focus();
            }
        });
    }
    
    // Check authentication on page load
    if (!isAuthenticated()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showLoginOverlay);
        } else {
            showLoginOverlay();
        }
    }
})();
