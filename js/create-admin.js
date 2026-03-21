// ============================================
// CREATE INITIAL ADMIN ACCOUNT
// ============================================
// Run this script ONCE to create the first admin account
// After creating the first admin, you can use the admin dashboard to manage users

/**
 * Create initial admin account
 * IMPORTANT: Change the email and password before running!
 */
async function createInitialAdmin() {
    try {
        console.log('Creating initial admin account...');

        // ⚠️ CHANGE THESE CREDENTIALS BEFORE RUNNING!
        const adminEmail = 'admin@digitechglobals.com';
        const adminPassword = 'Admin@123456'; // Must be at least 6 characters
        
        // Step 1: Create Firebase Authentication account
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(adminEmail, adminPassword);
        const adminUserId = userCredential.user.uid;
        console.log('✓ Admin auth account created:', adminUserId);

        // Step 2: Create admin profile in Firestore
        await firebaseDB.collection('userProfiles').doc(adminUserId).set({
            userId: adminUserId,
            email: adminEmail,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            applicationId: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✓ Admin profile created in Firestore');

        // Step 3: Success!
        console.log('========================================');
        console.log('✅ Admin account created successfully!');
        console.log('========================================');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('User ID:', adminUserId);
        console.log('========================================');
        console.log('You can now login at: academy/login.html');
        console.log('⚠️ Please change the password after first login');
        console.log('========================================');

        alert('Admin account created successfully! Check the console for details.');

    } catch (error) {
        console.error('❌ Error creating admin account:', error);
        
        if (error.code === 'auth/email-already-in-use') {
            console.log('ℹ️ Admin account already exists with this email.');
        } else {
            console.error('Error details:', error.message);
        }
        
        alert('Error: ' + error.message);
    }
}

// Make function available in console
window.createInitialAdmin = createInitialAdmin;

console.log('========================================');
console.log('ADMIN ACCOUNT CREATION SCRIPT LOADED');
console.log('========================================');
console.log('1. Update email and password in js/create-admin.js');
console.log('2. Open browser console (F12)');
console.log('3. Run: createInitialAdmin()');
console.log('========================================');
