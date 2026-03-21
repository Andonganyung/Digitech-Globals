// ============================================
// DATABASE SERVICE (FIRESTORE)
// ============================================
// Handles all database operations for candidate applications and user profiles

const DatabaseService = {

    // Firestore collections
    COLLECTIONS: {
        APPLICATIONS: 'applications',
        USER_PROFILES: 'userProfiles',
        ADMIN_USERS: 'adminUsers'
    },

    /**
     * Create a new candidate application
     * @param {string} userId - Firebase Auth user ID
     * @param {Object} applicationData - Application form data
     * @returns {Promise<string>} - Created application document ID
     */
    async createApplication(userId, applicationData) {
        try {
            const application = {
                userId: userId,
                courseId: applicationData.courseId,
                courseName: applicationData.courseName,
                
                // Personal Information
                firstName: applicationData.firstName,
                lastName: applicationData.lastName,
                email: applicationData.email,
                phone: applicationData.phone,
                dob: applicationData.dob,
                gender: applicationData.gender,
                
                // Address
                address: applicationData.address,
                city: applicationData.city,
                state: applicationData.state,
                country: applicationData.country,
                
                // Education & Employment
                education: applicationData.education,
                employment: applicationData.employment,
                
                // Course Details
                studyMode: applicationData.studyMode,
                statement: applicationData.statement,
                
                // Document
                documentUrl: applicationData.documentUrl || null,
                documentName: applicationData.documentName || null,
                
                // Status & Metadata
                status: 'pending', // pending, approved, declined
                role: 'candidate',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS).add(application);
            console.log('Application created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error creating application:', error);
            throw new Error('Failed to submit application. Please try again.');
        }
    },

    /**
     * Create user profile after registration
     * @param {string} userId - Firebase Auth user ID
     * @param {Object} profileData - User profile data
     * @returns {Promise<void>}
     */
    async createUserProfile(userId, profileData) {
        try {
            const profile = {
                userId: userId,
                email: profileData.email,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                role: profileData.role || 'candidate',
                applicationId: profileData.applicationId || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firebaseDB.collection(this.COLLECTIONS.USER_PROFILES).doc(userId).set(profile);
            console.log('User profile created for:', userId);
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw new Error('Failed to create user profile.');
        }
    },

    /**
     * Get user profile by user ID
     * @param {string} userId - Firebase Auth user ID
     * @returns {Promise<Object>} - User profile data
     */
    async getUserProfile(userId) {
        try {
            const doc = await firebaseDB.collection(this.COLLECTIONS.USER_PROFILES).doc(userId).get();
            if (!doc.exists) {
                throw new Error('User profile not found');
            }
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    /**
     * Get application by user ID
     * @param {string} userId - Firebase Auth user ID
     * @returns {Promise<Object>} - Application data
     */
    async getApplicationByUserId(userId) {
        try {
            const snapshot = await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS)
                .where('userId', '==', userId)
                .limit(1)
                .get();

            if (snapshot.empty) {
                throw new Error('Application not found');
            }

            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('Error getting application:', error);
            throw error;
        }
    },

    /**
     * Get all applications (Admin only)
     * @returns {Promise<Array>} - Array of all applications
     */
    async getAllApplications() {
        try {
            const snapshot = await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS)
                .orderBy('submittedAt', 'desc')
                .get();

            const applications = [];
            snapshot.forEach(doc => {
                applications.push({ id: doc.id, ...doc.data() });
            });

            return applications;
        } catch (error) {
            console.error('Error getting all applications:', error);
            throw new Error('Failed to load applications.');
        }
    },

    /**
     * Get applications by status (Admin only)
     * @param {string} status - Application status (pending, approved, declined)
     * @returns {Promise<Array>} - Filtered applications
     */
    async getApplicationsByStatus(status) {
        try {
            const snapshot = await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS)
                .where('status', '==', status)
                .orderBy('submittedAt', 'desc')
                .get();

            const applications = [];
            snapshot.forEach(doc => {
                applications.push({ id: doc.id, ...doc.data() });
            });

            return applications;
        } catch (error) {
            console.error('Error getting applications by status:', error);
            throw error;
        }
    },

    /**
     * Update application status (Admin only)
     * @param {string} applicationId - Application document ID
     * @param {string} newStatus - New status (approved/declined)
     * @returns {Promise<void>}
     */
    async updateApplicationStatus(applicationId, newStatus) {
        try {
            await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS).doc(applicationId).update({
                status: newStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Application status updated:', applicationId, newStatus);
        } catch (error) {
            console.error('Error updating application status:', error);
            throw new Error('Failed to update application status.');
        }
    },

    /**
     * Check if user is admin
     * @param {string} userId - Firebase Auth user ID
     * @returns {Promise<boolean>} - True if user is admin
     */
    async isAdmin(userId) {
        try {
            const profile = await this.getUserProfile(userId);
            return profile.role === 'admin';
        } catch (error) {
            return false;
        }
    },

    /**
     * Create admin user (use this once to set up initial admin)
     * @param {string} userId - Firebase Auth user ID
     * @param {string} email - Admin email
     * @returns {Promise<void>}
     */
    async createAdminUser(userId, email) {
        try {
            await this.createUserProfile(userId, {
                email: email,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin'
            });
            console.log('Admin user created:', userId);
        } catch (error) {
            console.error('Error creating admin user:', error);
            throw error;
        }
    },

    /**
     * Get application statistics (Admin only)
     * @returns {Promise<Object>} - Stats object with counts
     */
    async getApplicationStats() {
        try {
            const snapshot = await firebaseDB.collection(this.COLLECTIONS.APPLICATIONS).get();
            
            let total = 0;
            let pending = 0;
            let approved = 0;
            let declined = 0;

            snapshot.forEach(doc => {
                total++;
                const status = doc.data().status;
                if (status === 'pending') pending++;
                else if (status === 'approved') approved++;
                else if (status === 'declined') declined++;
            });

            return { total, pending, approved, declined };
        } catch (error) {
            console.error('Error getting stats:', error);
            return { total: 0, pending: 0, approved: 0, declined: 0 };
        }
    }
};

// Export for use in other scripts
window.DatabaseService = DatabaseService;

// Certificate Management Functions
async function createCertificate(certificateData) { try { const certsRef = collection(db, 'certificates'); const docRef = await addDoc(certsRef, { ...certificateData, createdAt: serverTimestamp() }); return { success: true, certificateId: docRef.id }; } catch (error) { console.error('Error creating certificate:', error); return { success: false, error: error.message }; } }
async function getUserCertificates(userId) { try { const certsRef = collection(db, 'certificates'); const q = query(certsRef, where('userId', '==', userId)); const snapshot = await getDocs(q); return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); } catch (error) { console.error('Error fetching certificates:', error); return []; } }
async function verifyCertificate(certificateId) { try { const certsRef = collection(db, 'certificates'); const q = query(certsRef, where('certificateId', '==', certificateId)); const snapshot = await getDocs(q); if (snapshot.empty) return { valid: false, message: 'Certificate not found' }; const certData = snapshot.docs[0].data(); return { valid: true, certificate: certData, message: 'Certificate is valid' }; } catch (error) { return { valid: false, message: 'Verification failed' }; } }
