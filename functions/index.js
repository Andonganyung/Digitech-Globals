// ============================================
// FIREBASE CLOUD FUNCTIONS - SECURE BACKEND
// ============================================
// Install dependencies: npm install firebase-functions firebase-admin validator dompurify isomorphic-dompurify

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// ============================================
// USER CREATION (Triggered automatically on signup)
// ============================================
exports.createUserProfile = functions.auth.user().onCreate(async (user) => {
    try {
        // Automatically create user profile
        await db.collection('userProfiles').doc(user.uid).set({
            userId: user.uid,
            email: user.email,
            role: 'candidate', // ✅ SERVER ENFORCES THIS - Cannot be overridden by client
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'active'
        });
        
        console.log('User profile created:', user.uid);
        return null;
    } catch (error) {
        console.error('Error creating user profile:', error);
        return null;
    }
});

// ============================================
// USER DELETION (Cleanup on account delete)
// ============================================
exports.deleteUserData = functions.auth.user().onDelete(async (user) => {
    try {
        const batch = db.batch();
        
        // Delete user profile
        batch.delete(db.collection('userProfiles').doc(user.uid));
        
        // Delete applications
        const apps = await db.collection('applications').where('userId', '==', user.uid).get();
        apps.forEach(doc => batch.delete(doc.ref));
        
        // Delete cart
        batch.delete(db.collection('carts').doc(user.uid));
        
        await batch.commit();
        
        console.log('User data deleted:', user.uid);
        return null;
    } catch (error) {
        console.error('Error deleting user data:', error);
        return null;
    }
});

// ============================================
// CREATE APPLICATION (Secure server-side)
// ============================================
exports.createApplication = functions.https.onCall(async (data, context) => {
    // 1. Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to submit an application');
    }
    
    // 2. Rate limiting (prevent spam)
    const recentApps = await db.collection('applications')
        .where('userId', '==', context.auth.uid)
        .where('submittedAt', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
        .get();
    
    if (recentApps.size >= 3) {
        throw new functions.https.HttpsError('resource-exhausted', 'Maximum 3 applications per day. Please try again tomorrow.');
    }
    
    // 3. Input validation
    const errors = [];
    
    if (!validator.isEmail(data.email)) {
        errors.push('Invalid email address');
    }
    
    if (!validator.isLength(data.firstName || '', { min: 1, max: 50 })) {
        errors.push('First name must be 1-50 characters');
    }
    
    if (!validator.isLength(data.lastName || '', { min: 1, max: 50 })) {
        errors.push('Last name must be 1-50 characters');
    }
    
    if (!validator.isMobilePhone(data.phone || '', 'any', { strictMode: false })) {
        errors.push('Invalid phone number');
    }
    
    if (!validator.isLength(data.statement || '', { min: 50, max: 1000 })) {
        errors.push('Statement must be 50-1000 characters');
    }
    
    if (!data.courseId || !data.courseName) {
        errors.push('Course information is required');
    }
    
    if (errors.length > 0) {
        throw new functions.https.HttpsError('invalid-argument', errors.join('. '));
    }
    
    // 4. Sanitize all text inputs (prevent XSS)
    const sanitize = (text) => DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
    
    // 5. Verify document URL belongs to user (if provided)
    if (data.documentUrl && !data.documentUrl.includes(`/documents/${context.auth.uid}/`)) {
        throw new functions.https.HttpsError('permission-denied', 'Invalid document URL');
    }
    
    // 6. Create application with sanitized data
    const application = {
        userId: context.auth.uid,
        courseId: sanitize(data.courseId),
        courseName: sanitize(data.courseName),
        
        // Personal Information (sanitized)
        firstName: sanitize(data.firstName),
        lastName: sanitize(data.lastName),
        email: validator.normalizeEmail(data.email),
        phone: validator.trim(data.phone),
        dob: data.dob,
        gender: sanitize(data.gender),
        
        // Address (sanitized)
        address: sanitize(data.address),
        city: sanitize(data.city),
        state: sanitize(data.state),
        country: sanitize(data.country),
        
        // Education & Employment (sanitized)
        education: sanitize(data.education),
        employment: sanitize(data.employment),
        
        // Course Details
        studyMode: sanitize(data.studyMode),
        statement: sanitize(data.statement),
        
        // Document (if provided)
        documentUrl: data.documentUrl || null,
        documentName: data.documentName ? sanitize(data.documentName) : null,
        
        // Status & Metadata (SERVER CONTROLLED)
        status: 'pending',
        role: 'candidate',
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    // 7. Save to Firestore
    const docRef = await db.collection('applications').add(application);
    
    // 8. Update user profile with application ID
    await db.collection('userProfiles').doc(context.auth.uid).update({
        applicationId: docRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Application created:', docRef.id);
    
    return {
        success: true,
        applicationId: docRef.id
    };
});

// ============================================
// UPDATE APPLICATION STATUS (Admin only)
// ============================================
exports.updateApplicationStatus = functions.https.onCall(async (data, context) => {
    // 1. Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    // 2. Authorization check (must be admin)
    const userDoc = await db.collection('userProfiles').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    
    // 3. Validate input
    if (!data.applicationId || !data.status) {
        throw new functions.https.HttpsError('invalid-argument', 'Application ID and status required');
    }
    
    if (!['pending', 'approved', 'declined'].includes(data.status)) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid status');
    }
    
    // 4. Update application
    await db.collection('applications').doc(data.applicationId).update({
        status: data.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        reviewedBy: context.auth.uid,
        reviewedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Application status updated:', data.applicationId, data.status);
    
    // 5. Send notification email (optional)
    // TODO: Implement email notification
    
    return { success: true };
});

// ============================================
// PROMOTE USER TO ADMIN (Super Admin only)
// ============================================
exports.promoteToAdmin = functions.https.onCall(async (data, context) => {
    // 1. Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    // 2. Check if caller is admin
    const callerDoc = await db.collection('userProfiles').doc(context.auth.uid).get();
    if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can promote users');
    }
    
    // 3. Validate input
    if (!data.userId) {
        throw new functions.https.HttpsError('invalid-argument', 'User ID required');
    }
    
    // 4. Promote user
    await db.collection('userProfiles').doc(data.userId).update({
        role: 'admin',
        promotedAt: admin.firestore.FieldValue.serverTimestamp(),
        promotedBy: context.auth.uid
    });
    
    console.log('User promoted to admin:', data.userId);
    
    return { success: true };
});

// ============================================
// CREATE CERTIFICATE (Admin only)
// ============================================
exports.createCertificate = functions.https.onCall(async (data, context) => {
    // 1. Check admin access
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }
    
    const userDoc = await db.collection('userProfiles').doc(context.auth.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Admin access required');
    }
    
    // 2. Generate unique certificate ID
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // 3. Sanitize inputs
    const sanitize = (text) => DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });
    
    // 4. Create certificate
    const certificate = {
        certificateId: certificateId,
        userId: data.userId,
        courseId: sanitize(data.courseId),
        courseName: sanitize(data.courseName),
        studentName: sanitize(data.studentName),
        issueDate: admin.firestore.FieldValue.serverTimestamp(),
        completionDate: data.completionDate,
        grade: data.grade || null,
        instructor: sanitize(data.instructor || 'DigiTech Academy'),
        status: 'valid',
        createdBy: context.auth.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('certificates').add(certificate);
    
    console.log('Certificate created:', certificateId);
    
    return {
        success: true,
        certificateId: certificateId
    };
});

// ============================================
// VERIFY CERTIFICATE (Public)
// ============================================
exports.verifyCertificate = functions.https.onCall(async (data, context) => {
    if (!data.certificateId) {
        throw new functions.https.HttpsError('invalid-argument', 'Certificate ID required');
    }
    
    const snapshot = await db.collection('certificates')
        .where('certificateId', '==', data.certificateId)
        .limit(1)
        .get();
    
    if (snapshot.empty) {
        return {
            valid: false,
            message: 'Certificate not found'
        };
    }
    
    const cert = snapshot.docs[0].data();
    
    if (cert.status !== 'valid') {
        return {
            valid: false,
            message: 'Certificate has been revoked'
        };
    }
    
    return {
        valid: true,
        certificate: {
            certificateId: cert.certificateId,
            studentName: cert.studentName,
            courseName: cert.courseName,
            issueDate: cert.issueDate,
            instructor: cert.instructor
        },
        message: 'Certificate is valid'
    };
});

// ============================================
// CREATE CHECKOUT SESSION (Stripe + Cart)
// ============================================
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    // 1. Authentication required
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Login required for checkout');
    }
    
    // 2. Get user's cart
    const cartDoc = await db.collection('carts').doc(context.auth.uid).get();
    if (!cartDoc.exists || !cartDoc.data().items || cartDoc.data().items.length === 0) {
        throw new functions.https.HttpsError('failed-precondition', 'Cart is empty');
    }
    
    const cartItems = cartDoc.data().items;
    
    // 3. Fetch actual prices from database (NEVER trust client)
    const productsRef = db.collection('products');
    let subtotal = 0;
    const lineItems = [];
    
    for (const item of cartItems) {
        const productDoc = await productsRef.doc(item.productId).get();
        if (!productDoc.exists) {
            console.warn('Product not found:', item.productId);
            continue;
        }
        
        const product = productDoc.data();
        const price = product.price; // ✅ Server-side price (trusted)
        const itemTotal = price * item.quantity;
        
        subtotal += itemTotal;
        lineItems.push({
            productId: item.productId,
            title: product.title,
            price: price,
            quantity: item.quantity,
            total: itemTotal
        });
    }
    
    // 4. Calculate totals
    const shipping = subtotal >= 100 ? 0 : 15;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    // 5. Create order in database
    const orderRef = await db.collection('orders').add({
        userId: context.auth.uid,
        items: lineItems,
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        total: total,
        status: 'pending',
        paymentStatus: 'awaiting',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Order created:', orderRef.id);
    
    // 6. Return order details (for Stripe checkout)
    return {
        orderId: orderRef.id,
        total: total,
        items: lineItems
    };
    
    // TODO: Integrate actual Stripe Checkout Session creation
    // const stripe = require('stripe')(functions.config().stripe.secret_key);
    // const session = await stripe.checkout.sessions.create({ ... });
    // return { sessionId: session.id };
});

// ============================================
// RATE LIMITING (Anti-spam)
// ============================================
exports.checkRateLimit = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return { allowed: true }; // Guest users have different limits
    }
    
    const rateLimitRef = db.collection('rateLimits').doc(context.auth.uid);
    const rateLimitDoc = await rateLimitRef.get();
    
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    if (rateLimitDoc.exists) {
        const { count, resetTime } = rateLimitDoc.data();
        
        if (now < resetTime) {
            if (count >= 60) { // 60 requests per minute
                throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded. Please try again later.');
            }
            
            await rateLimitRef.update({
                count: admin.firestore.FieldValue.increment(1)
            });
        } else {
            await rateLimitRef.set({
                count: 1,
                resetTime: now + oneMinute
            });
        }
    } else {
        await rateLimitRef.set({
            count: 1,
            resetTime: now + oneMinute
        });
    }
    
    return { allowed: true };
});
