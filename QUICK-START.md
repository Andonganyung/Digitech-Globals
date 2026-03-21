# 🚀 Quick Start Guide

## Step 1: Firebase Setup (5 minutes)

1. Go to https://console.firebase.google.com/
2. Create new project: "digitech-globals-academy"
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database** (production mode)
5. Create **Storage** bucket

## Step 2: Get Firebase Config (2 minutes)

1. Project Settings → Your Apps → Web
2. Copy the `firebaseConfig` object
3. Paste into `js/firebase-config.js`

```javascript
// Replace YOUR_XXX with actual values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 3: Deploy Security Rules (3 minutes)

### Firestore Rules
1. Firebase Console → Firestore → Rules
2. Copy content from `firestore.rules`
3. Paste and Publish

### Storage Rules
1. Firebase Console → Storage → Rules
2. Copy content from `storage.rules`
3. Paste and Publish

## Step 4: Create Admin Account (1 minute)

1. Open `academy/create-admin.html` in browser
2. Change email/password if desired
3. Click "Create Admin Account"
4. Note the credentials

## Step 5: Test It! (2 minutes)

### Test Registration
1. Go to `academy/courses.html`
2. Click "Enroll" on any course
3. Fill the form and submit
4. Login at `academy/login.html`

### Test Admin
1. Login with admin credentials at `academy/login.html`
2. View all applications
3. Approve/decline an application

## ✅ Done!

Your system is now live with:
- ✅ Secure authentication
- ✅ Real database (Firestore)
- ✅ File storage (Firebase Storage)
- ✅ Role-based access control
- ✅ Production-ready security

---

## 📚 Full Documentation

- **Complete Setup:** `FIREBASE-SETUP-GUIDE.md`
- **System Overview:** `PRODUCTION-SYSTEM-SUMMARY.md`
- **Enrollment Guide:** `academy/ENROLLMENT-SYSTEM-README.md`

## ❓ Need Help?

Check `PRODUCTION-SYSTEM-SUMMARY.md` → Troubleshooting section

---

**Default Admin:**
- Email: admin@digitechglobals.com
- Password: Admin@123456
