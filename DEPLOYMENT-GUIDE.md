# 🚀 DigiTech Globals - Namecheap Deployment Guide

## 📦 Production Package Created

**File:** `C:\Users\Andong\Digitech-Globals-Production.zip`

This zip file contains all production-ready files for your DigiTech Globals website.

---

## 📁 What's Included

### Website Files:
```
academy/              ✅ All Academy course pages and dashboards
blog/                 ✅ Blog section
css/                  ✅ All stylesheets
images/               ✅ All images and media
js/                   ✅ JavaScript files (including Firebase)
services/             ✅ Services pages
*.html                ✅ All main HTML pages (index, about, contact, etc.)
```

### Excluded (Development Only):
```
❌ *.md files (documentation)
❌ .git folder
❌ Backup files (*-backup.html, *-old.html)
❌ Development tools
❌ README files
```

---

## 🔧 Namecheap Upload Instructions

### Step 1: Login to Namecheap
1. Go to https://www.namecheap.com
2. Login to your account
3. Navigate to **Dashboard** → **Domain List**
4. Click **Manage** next to your domain

### Step 2: Access cPanel File Manager
1. In the hosting section, click **Go to cPanel**
2. Find and click **File Manager**
3. Navigate to `public_html` folder (this is your website root)

### Step 3: Backup Existing Files (if any)
1. Select all files in `public_html`
2. Click **Compress** → Create a backup zip
3. Download the backup to your computer

### Step 4: Clean public_html
1. Select all files/folders in `public_html`
2. Click **Delete**
3. Confirm deletion

### Step 5: Upload Your Zip File
1. Click **Upload** button
2. Select `Digitech-Globals-Production.zip`
3. Wait for upload to complete

### Step 6: Extract the Zip
1. Select the uploaded zip file
2. Click **Extract**
3. Choose `public_html` as destination
4. Click **Extract Files**

### Step 7: Move Files to Root (Important!)
After extraction, you may have:
```
public_html/
  └── Digitech-Globals/
      ├── academy/
      ├── css/
      ├── index.html
      └── ...
```

You need:
```
public_html/
  ├── academy/
  ├── css/
  ├── index.html
  └── ...
```

**To fix:**
1. Open the `Digitech-Globals` folder
2. Select ALL contents
3. Click **Move**
4. Move to `/public_html/`
5. Delete the empty `Digitech-Globals` folder

### Step 8: Set Permissions
1. Select all folders
2. Click **Permissions**
3. Set to `755` for folders
4. Set to `644` for files

### Step 9: Test Your Website
1. Visit your domain (e.g., https://digitechglobals.com)
2. Check main pages load correctly
3. Test Academy section
4. Verify navigation works

---

## 🔥 Firebase Configuration (CRITICAL!)

### Your Firebase credentials are in the zip file:
- File: `js/firebase-config.js`
- Contains: Firebase project configuration

**⚠️ IMPORTANT SECURITY NOTE:**

The current setup has Firebase credentials in client-side code, which is normal for web apps. However:

### For Production Security:

1. **Update Firebase Domain Whitelist:**
   - Go to Firebase Console
   - Navigate to **Authentication** → **Settings** → **Authorized domains**
   - Add your domain: `digitechglobals.com` and `www.digitechglobals.com`
   - Remove `localhost` from production

2. **Update Firestore Security Rules:**
   - Your rules are in `firestore.rules`
   - Deploy them in Firebase Console:
     - **Firestore Database** → **Rules**
     - Copy contents of `firestore.rules`
     - Click **Publish**

3. **Update Storage Security Rules:**
   - Your rules are in `storage.rules`
   - Deploy them in Firebase Console:
     - **Storage** → **Rules**
     - Copy contents of `storage.rules`
     - Click **Publish**

---

## 📧 Email Configuration

### Contact Form Setup:
Your contact form currently uses client-side only. For production:

**Option 1: Use Formspree (Easiest)**
1. Sign up at https://formspree.io
2. Get your form endpoint
3. Update contact form action URL

**Option 2: Use PHP Email (if Namecheap supports)**
1. Create `contact-handler.php`
2. Update form to POST to this file

**Option 3: Use Firebase Cloud Functions**
1. Set up Firebase Functions
2. Create email sending endpoint
3. Update form to call function

---

## 🌐 Domain Configuration

### DNS Settings (if needed):
1. In Namecheap DNS management
2. Ensure A record points to hosting IP
3. Add www CNAME if needed

### SSL Certificate:
1. In cPanel, find **SSL/TLS Status**
2. Enable AutoSSL (free)
3. Or install Let's Encrypt certificate

---

## ✅ Post-Deployment Checklist

### Test Website Functionality:
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] About, Services, Contact pages accessible
- [ ] Academy section loads
- [ ] All course pages accessible
- [ ] Images display properly
- [ ] CSS styling applies correctly
- [ ] Mobile responsive design works

### Test Firebase Features:
- [ ] Student registration works
- [ ] Login system functional
- [ ] Admin dashboard accessible
- [ ] Certificate system works
- [ ] File uploads to Firebase Storage work

### Test Forms:
- [ ] Contact form submits
- [ ] Registration form works
- [ ] No console errors

### Performance:
- [ ] Page load speed acceptable
- [ ] Images optimized
- [ ] No broken links

---

## 🐛 Common Issues & Solutions

### Issue 1: Pages show 404 errors
**Solution:** 
- Check file paths are correct
- Ensure all files extracted to `public_html` root
- Check .htaccess file if present

### Issue 2: CSS/JS not loading
**Solution:**
- Check file permissions (644 for files)
- Clear browser cache
- Check console for errors
- Verify file paths in HTML

### Issue 3: Firebase not working
**Solution:**
- Check domain is authorized in Firebase Console
- Verify Firebase config in `js/firebase-config.js`
- Check browser console for errors
- Deploy Firestore and Storage rules

### Issue 4: Images not displaying
**Solution:**
- Check image file permissions (644)
- Verify image paths are correct
- Check image file names (case-sensitive)

### Issue 5: Contact form not sending
**Solution:**
- Set up backend email handler (see Email Configuration above)
- Or use third-party form service

---

## 📊 Website Structure on Server

After deployment, your structure should be:

```
public_html/
├── index.html              (Homepage)
├── about.html
├── contact.html
├── services.html
├── pricing.html
├── academy/
│   ├── index.html          (Academy home)
│   ├── courses.html
│   ├── dashboard.html
│   ├── certificates.html
│   ├── az-900.html
│   ├── (all course pages)
│   ├── admin-dashboard-temp.html
│   ├── candidate-dashboard-temp.html
│   └── login-firebase.html
├── blog/
│   └── (blog files)
├── services/
│   └── (service pages)
├── css/
│   ├── style.css
│   └── academy.css
├── js/
│   ├── main.js
│   ├── firebase-config.js
│   ├── auth-service.js
│   ├── database-service.js
│   ├── storage-service.js
│   ├── certificates.js
│   ├── course-completion.js
│   └── (all JS files)
└── images/
    └── (all images)
```

---

## 🔐 Security Recommendations

### 1. Protect Admin Files:
Create `.htaccess` in academy folder:
```apache
<Files "admin-dashboard-temp.html">
  Order Allow,Deny
  Deny from all
  # Only allow from specific IPs if needed
  # Allow from 123.456.789.0
</Files>
```

### 2. Hide Sensitive Files:
Add to root `.htaccess`:
```apache
# Deny access to Firebase rules
<Files "firestore.rules">
  Order Allow,Deny
  Deny from all
</Files>

<Files "storage.rules">
  Order Allow,Deny
  Deny from all
</Files>
```

### 3. Enable HTTPS:
Force HTTPS in `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📱 Mobile Testing

After deployment, test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad)
- [ ] Different screen sizes

---

## 🎯 Next Steps After Deployment

1. **Test Everything**
   - Go through entire website
   - Test all forms
   - Verify Firebase connections

2. **Monitor Firebase Usage**
   - Check Firebase Console for activity
   - Monitor quotas and usage
   - Set up billing alerts

3. **Set Up Analytics**
   - Add Google Analytics
   - Monitor visitor traffic
   - Track conversions

4. **SEO Optimization**
   - Submit sitemap to Google
   - Set up Google Search Console
   - Verify meta tags

5. **Backup Strategy**
   - Schedule regular backups in cPanel
   - Download backups monthly
   - Test backup restoration

---

## 📞 Support Resources

### Namecheap Support:
- Live Chat: Available 24/7
- Knowledge Base: https://www.namecheap.com/support/knowledgebase/

### Firebase Support:
- Documentation: https://firebase.google.com/docs
- Console: https://console.firebase.google.com

---

## ✅ Final Checklist Before Going Live

- [ ] Zip file uploaded to Namecheap
- [ ] Files extracted to public_html
- [ ] Website accessible at your domain
- [ ] Firebase domain authorized
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] SSL certificate installed
- [ ] Contact form configured
- [ ] All pages tested
- [ ] Mobile responsive verified
- [ ] Admin dashboard secured
- [ ] Backup created
- [ ] Analytics set up

---

**Your DigiTech Globals website is ready for production deployment!** 🚀

**Zip File Location:** `C:\Users\Andong\Digitech-Globals-Production.zip`

Upload this file to your Namecheap hosting and follow the steps above.

Good luck with your launch! 🎉
