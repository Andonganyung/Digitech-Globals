// ============================================
// SECURE PASSWORD VALIDATION
// ============================================

const PasswordValidator = {
    
    /**
     * ✅ SECURE: Validate password strength
     * Requirements:
     * - Minimum 12 characters
     * - Uppercase letter
     * - Lowercase letter
     * - Number
     * - Special character
     * - No common passwords
     * - No sequential/repeated characters
     */
    async validatePassword(password) {
        const errors = [];
        
        // 1. Length check
        if (password.length < 12) {
            errors.push('Password must be at least 12 characters');
        }
        
        if (password.length > 128) {
            errors.push('Password must not exceed 128 characters');
        }
        
        // 2. Complexity checks
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        // 3. Common passwords check
        const commonPasswords = [
            'password', 'password123', '123456', '12345678', 'qwerty', 
            'abc123', 'monkey', '1234567890', 'letmein', 'trustno1',
            'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
            'ashley', 'bailey', 'passw0rd', 'shadow', '123123',
            'admin', 'welcome', 'login', 'qwertyuiop', 'password1',
            'superman', 'princess', 'welcome123', 'admin123'
        ];
        
        if (commonPasswords.includes(password.toLowerCase())) {
            errors.push('This password is too common. Please choose a stronger password.');
        }
        
        // 4. Sequential/repeated characters check
        if (/(.)\1{2,}/.test(password)) {
            errors.push('Password cannot contain three or more repeated characters (aaa, 111, etc.)');
        }
        
        if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
            errors.push('Password cannot contain sequential letters (abc, xyz, etc.)');
        }
        
        if (/(?:012|123|234|345|456|567|678|789|890)/.test(password)) {
            errors.push('Password cannot contain sequential numbers (123, 456, etc.)');
        }
        
        // 5. Check against Have I Been Pwned database
        try {
            const isPwned = await this.checkPwnedPassword(password);
            if (isPwned) {
                errors.push('This password has been exposed in a data breach. Please choose a different one.');
            }
        } catch (error) {
            console.warn('Could not check password breach database:', error);
            // Don't block if API is unavailable
        }
        
        // Return validation result
        if (errors.length > 0) {
            return {
                valid: false,
                errors: errors,
                strength: this.calculateStrength(password)
            };
        }
        
        return {
            valid: true,
            errors: [],
            strength: this.calculateStrength(password)
        };
    },
    
    /**
     * Check if password has been exposed in data breaches
     * Uses Have I Been Pwned API (k-anonymity model - secure)
     */
    async checkPwnedPassword(password) {
        try {
            // Hash password with SHA-1
            const msgBuffer = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
            
            // Send only first 5 characters (k-anonymity)
            const prefix = hashHex.substring(0, 5);
            const suffix = hashHex.substring(5);
            
            const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            
            if (!response.ok) {
                throw new Error('API unavailable');
            }
            
            const data = await response.text();
            
            // Check if our suffix appears in the results
            return data.includes(suffix);
        } catch (error) {
            console.error('Error checking pwned passwords:', error);
            throw error;
        }
    },
    
    /**
     * Calculate password strength (0-100)
     */
    calculateStrength(password) {
        let strength = 0;
        
        // Length points (max 40)
        strength += Math.min(password.length * 2, 40);
        
        // Complexity points
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 10;
        if (/\d/.test(password)) strength += 10;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
        
        // Variety points
        const charTypes = [
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        ].filter(Boolean).length;
        
        strength += charTypes * 5;
        
        // Penalize common patterns
        if (/(.)\1{2,}/.test(password)) strength -= 10;
        if (/(?:123|234|345|456|567|678|789|890|abc|bcd|cde)/i.test(password)) strength -= 15;
        
        return Math.max(0, Math.min(100, strength));
    },
    
    /**
     * Get strength label and color
     */
    getStrengthInfo(strength) {
        if (strength < 30) {
            return { label: 'Weak', color: '#ef4444', class: 'weak' };
        } else if (strength < 50) {
            return { label: 'Fair', color: '#f59e0b', class: 'fair' };
        } else if (strength < 70) {
            return { label: 'Good', color: '#3b82f6', class: 'good' };
        } else if (strength < 90) {
            return { label: 'Strong', color: '#10b981', class: 'strong' };
        } else {
            return { label: 'Very Strong', color: '#059669', class: 'very-strong' };
        }
    },
    
    /**
     * Generate a strong random password
     */
    generatePassword(length = 16) {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O for clarity
        const lowercase = 'abcdefghijkmnopqrstuvwxyz'; // Removed l for clarity
        const numbers = '23456789'; // Removed 0, 1 for clarity
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        const all = uppercase + lowercase + numbers + special;
        
        let password = '';
        
        // Ensure at least one from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];
        
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }
        
        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        return password;
    },
    
    /**
     * Display password strength meter
     */
    updateStrengthMeter(password, meterId = 'passwordStrength') {
        const meter = document.getElementById(meterId);
        if (!meter) return;
        
        const strength = this.calculateStrength(password);
        const info = this.getStrengthInfo(strength);
        
        meter.innerHTML = `
            <div class="strength-bar">
                <div class="strength-fill ${info.class}" style="width: ${strength}%; background: ${info.color};"></div>
            </div>
            <span class="strength-label ${info.class}">${info.label} (${strength}%)</span>
        `;
    }
};

// Export for use in other scripts
window.PasswordValidator = PasswordValidator;
