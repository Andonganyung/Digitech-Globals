// ============================================
// AUTHENTICATION SERVICE
// ============================================
// Handles user authentication, registration, login, logout, and password management

const AuthService = {
    
    /**
     * Register a new user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<firebase.User>} - Created user object
     */
    async registerUser(email, password) {
        try {
            const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            console.log('User registered successfully:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw this.handleAuthError(error);
        }
    },

    /**
     * Login user with email and password
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<firebase.User>} - Logged in user object
     */
    async loginUser(email, password) {
        try {
            const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            console.log('User logged in successfully:', userCredential.user.uid);
            return userCredential.user;
        } catch (error) {
            console.error('Login error:', error);
            throw this.handleAuthError(error);
        }
    },

    /**
     * Logout current user
     * @returns {Promise<void>}
     */
    async logoutUser() {
        try {
            await firebaseAuth.signOut();
            console.log('User logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to logout. Please try again.');
        }
    },

    /**
     * Send password reset email
     * @param {string} email - User's email
     * @returns {Promise<void>}
     */
    async resetPassword(email) {
        try {
            await firebaseAuth.sendPasswordResetEmail(email);
            console.log('Password reset email sent to:', email);
        } catch (error) {
            console.error('Password reset error:', error);
            throw this.handleAuthError(error);
        }
    },

    /**
     * Get current authenticated user
     * @returns {firebase.User|null} - Current user or null
     */
    getCurrentUser() {
        return firebaseAuth.currentUser;
    },

    /**
     * Listen for authentication state changes
     * @param {Function} callback - Callback function to execute on auth state change
     * @returns {Function} - Unsubscribe function
     */
    onAuthStateChanged(callback) {
        return firebaseAuth.onAuthStateChanged(callback);
    },

    /**
     * Update user email
     * @param {string} newEmail - New email address
     * @returns {Promise<void>}
     */
    async updateUserEmail(newEmail) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('No user logged in');
            await user.updateEmail(newEmail);
            console.log('Email updated successfully');
        } catch (error) {
            console.error('Email update error:', error);
            throw this.handleAuthError(error);
        }
    },

    /**
     * Update user password
     * @param {string} newPassword - New password
     * @returns {Promise<void>}
     */
    async updateUserPassword(newPassword) {
        try {
            const user = this.getCurrentUser();
            if (!user) throw new Error('No user logged in');
            await user.updatePassword(newPassword);
            console.log('Password updated successfully');
        } catch (error) {
            console.error('Password update error:', error);
            throw this.handleAuthError(error);
        }
    },

    /**
     * Handle Firebase authentication errors
     * @param {Error} error - Firebase error object
     * @returns {Error} - Formatted error message
     */
    handleAuthError(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered. Please login or use a different email.',
            'auth/invalid-email': 'Invalid email address format.',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
            'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            'auth/user-disabled': 'This account has been disabled. Please contact support.',
            'auth/user-not-found': 'No account found with this email. Please register first.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your internet connection.',
            'auth/requires-recent-login': 'Please logout and login again to perform this action.'
        };

        const message = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
        return new Error(message);
    }
};

// Export for use in other scripts
window.AuthService = AuthService;
