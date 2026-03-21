# 🔥 Firebase Setup Guide for DigiTech Globals Academy

## Overview
This guide will help you set up Firebase for the DigiTech Globals course registration and enrollment system.

---

## 📋 Prerequisites

1. A Google account
2. Basic understanding of Firebase Console
3. The DigiTech Globals codebase

---

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `digitech-globals-academy` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click **"Create project"**

---

## 🔑 Step 2: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register app with nickname: `DigiTech Academy Web`
6. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxx"
};
```

7. **Replace the config** in `js/firebase-config.js` with your actual values

---

## 🔐 Step 3: Enable Firebase Authentication

1. In Firebase Console, go to **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Click on **"Sign-in method"** tab
4. Enable **"Email/Password"** provider:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

---

## 💾 Step 4: Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules next)
4. Choose a Cloud Firestore location (closest to your users)
5. Click **"Enable"**

### Deploy Security Rules

1. Click on the **"Rules"** tab in Firestore
2. Copy the contents of `firestore.rules` file from your project
3. Paste into the Firebase Console rules editor
4. Click **"Publish"**

---

## 📁 Step 5: Set Up Firebase Storage

1. In Firebase Console, go to **"Storage"** (left sidebar)
2. Click **"Get started"**
3. Select **"Start in production mode"**
4. Choose the same location as Firestore
5. Click **"Done"**

### Deploy Storage Rules

1. Click on the **"Rules"** tab in Storage
2. Copy the contents of `storage.rules` file from your project
3. Paste into the Firebase Console rules editor
4. Click **"Publish"**

---

## 👤 Step 6: Create Initial Admin Account

### Method 1: Using the Admin Creation Page (Recommended)

1. Make sure your Firebase config is updated in `js/firebase-config.js`
2. Open your web browser
3. Navigate to: `academy/create-admin.html`
4. Fill in the admin details (or use the defaults):
   - **Email:** admin@digitechglobals.com
   - **Password:** Admin@123456
   - **First Name:** Admin
   - **Last Name:** User
5. Click **"Create Admin Account"**
6. Wait for success message
7. Login at `academy/login.html` with your admin credentials

### Method 2: Using Browser Console

1. Open `academy/create-admin.html` in your browser
2. Open browser DevTools (press F12)
3. Go to the **Console** tab
4. Edit the email/password in `js/create-admin.js` if needed
5. Run: `createInitialAdmin()`
6. Check console for success message

---

## 🔒 Step 7: Update Firebase Security Rules (Optional)

### Firestore Indexes

Some queries may require composite indexes. Firebase will prompt you with a link when needed. Click the link and it will auto-create the index.

### Add Custom Claims for Admin (Advanced)

For production, you may want to use Firebase Admin SDK to set custom claims for admin users. This is more secure than storing roles in Firestore documents.

---

## 📊 Step 8: Test the System

### Test Candidate Registration

1. Navigate to `academy/courses.html`
2. Click **"Enroll"** on any course
3. Fill out the registration form
4. Upload a test document (optional)
5. Submit the form
6. Check Firebase Console:
   - **Authentication** → User should appear
   - **Firestore** → `applications` collection should have new document
   - **Firestore** → `userProfiles` collection should have new document
   - **Storage** → `documents/{userId}/` should have uploaded file (if uploaded)

### Test Candidate Login

1. Go to `academy/login.html`
2. Login with the candidate email and password
3. You should be redirected to `academy/candidate-dashboard.html`
4. Verify all application data is displayed correctly

### Test Admin Login

1. Go to `academy/login.html`
2. Login with admin credentials
3. You should be redirected to `academy/admin-dashboard.html`
4. Verify you can see all applications
5. Test approving/declining applications

---

## 🗂️ Firestore Collections Structure

### `userProfiles` Collection

Document ID: Firebase Auth User ID

```javascript
{
    userId: "firebase_auth_uid",
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "candidate" | "admin",
    applicationId: "application_doc_id" | null,
    createdAt: Timestamp,
    updatedAt: Timestamp
}
```

### `applications` Collection

Document ID: Auto-generated by Firestore

```javascript
{
    userId: "firebase_auth_uid",
    courseId: "course-slug",
    courseName: "Course Name",
    firstName: "John",
    lastName: "Doe",
    email: "user@example.com",
    phone: "+1234567890",
    dob: "1990-01-01",
    gender: "male" | "female" | "other" | "prefer-not-to-say",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    education: "bachelor" | "master" | etc.,
    employment: "employed-ft" | "student" | etc.,
    studyMode: "self-paced" | "part-time" | "full-time",
    statement: "Personal statement text...",
    documentUrl: "https://storage.googleapis.com/..." | null,
    documentName: "document.pdf" | null,
    status: "pending" | "approved" | "declined",
    role: "candidate",
    submittedAt: Timestamp,
    updatedAt: Timestamp
}
```

### `adminUsers` Collection (Optional)

Document ID: Firebase Auth User ID

```javascript
{
    userId: "firebase_auth_uid",
    email: "admin@example.com",
    createdAt: Timestamp
}
```

---

## 📦 Firebase Storage Structure

```
storage/
└── documents/
    └── {userId}/
        ├── {userId}_timestamp_document1.pdf
        ├── {userId}_timestamp_document2.jpg
        └── ...
```

---

## 🔐 Security Features Implemented

### Authentication
- ✅ Email/password authentication with Firebase Auth
- ✅ Password hashing handled automatically by Firebase
- ✅ Password reset via email
- ✅ Session management
- ✅ No plaintext passwords stored anywhere

### Authorization
- ✅ Role-based access control (candidate/admin)
- ✅ Firestore security rules prevent unauthorized access
- ✅ Storage security rules limit file access to owners and admins
- ✅ Candidates can only see their own data
- ✅ Admins can see all data

### Data Validation
- ✅ Client-side validation (JavaScript)
- ✅ Server-side validation (Firestore rules)
- ✅ File type validation (PDF, JPG, PNG only)
- ✅ File size validation (5MB max)
- ✅ Email format validation
- ✅ Required field validation

---

## 🚨 Common Issues & Solutions

### Issue: "Firebase not defined"
**Solution:** Make sure Firebase SDK scripts are loaded before your app scripts. Check the order in HTML files.

### Issue: "Permission denied" errors
**Solution:** Check that Firestore and Storage security rules are deployed correctly.

### Issue: "Email already in use"
**Solution:** This email is already registered. Use a different email or login with existing credentials.

### Issue: Admin dashboard not loading applications
**Solution:** Make sure the admin user has `role: 'admin'` in their `userProfiles` document.

### Issue: Document upload failing
**Solution:** 
1. Check file size (max 5MB)
2. Check file type (only PDF, JPG, PNG allowed)
3. Verify Storage rules are deployed

---

## 🔄 Migration from localStorage

The old localStorage-based system has been completely replaced. If you have existing test data in localStorage, it will not be migrated automatically. You'll need to:

1. Start fresh with Firebase
2. Re-register test candidates
3. Re-create admin accounts using the setup script

---

## 📝 Production Checklist

Before deploying to production:

- [ ] Update Firebase config with production credentials
- [ ] Change default admin password
- [ ] Review and test all Firestore security rules
- [ ] Review and test all Storage security rules
- [ ] Set up Firebase billing (required for production)
- [ ] Enable Firebase App Check (optional but recommended)
- [ ] Set up monitoring and alerts
- [ ] Test password reset flow
- [ ] Test file upload with various file types and sizes
- [ ] Test role-based access control thoroughly
- [ ] Remove or protect `create-admin.html` in production
- [ ] Set up custom domain for Firebase Auth (optional)
- [ ] Configure email templates in Firebase Console

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Check Firebase Console logs
3. Review security rules
4. Verify Firebase config is correct
5. Check that all Firebase services are enabled

---

## 🎉 You're All Set!

Your DigiTech Globals Academy enrollment system is now running on Firebase with production-ready security and authentication!

**Default Admin Credentials:**
- Email: admin@digitechglobals.com
- Password: Admin@123456

**⚠️ Remember to change the admin password after first login!**
