# Upload to Namecheap Hosting - Final Update

## ✅ Your Local Files Are Working!

The pricing system works perfectly on your computer. Now you just need to upload these files to your live Namecheap hosting.

---

## 📦 Files to Upload:

I've created a ZIP file with all updated files:
**Location:** `C:\Users\Andong\Digitech-Globals\Digitech-Pricing-Update.zip`

---

## 🚀 Upload Instructions:

### Method 1: cPanel File Manager (Easiest)

1. **Login to Namecheap:**
   - Go to: https://www.namecheap.com
   - Click "Sign In"
   - Go to "Hosting List" → Select your hosting account

2. **Open cPanel:**
   - Click "Go to cPanel" or "Manage"

3. **Open File Manager:**
   - Find "File Manager" in cPanel
   - Navigate to `public_html` (or wherever your website root is)

4. **Upload Files:**
   - Extract `Digitech-Pricing-Update.zip` on your computer first
   - Upload these folders to your website:
     - Upload `academy/` folder → Overwrite existing
     - Upload `js/` folder → Overwrite existing
     - Upload `functions/` folder → Upload new

5. **Verify:**
   - Visit: https://yourdomain.com/academy/python-it.html
   - Click "Enroll Now"
   - Check if pricing cards show $119 / $1,895

---

### Method 2: FTP (Faster for Multiple Files)

1. **Get FTP Details from Namecheap:**
   - In cPanel → "FTP Accounts"
   - Note: FTP Hostname, Username, Password

2. **Use FTP Client:**
   - Download FileZilla: https://filezilla-project.org/
   - Connect with your FTP details

3. **Upload Folders:**
   - Upload `academy/` → `/public_html/academy/`
   - Upload `js/` → `/public_html/js/`
   - Upload `functions/` → `/public_html/functions/`
   - **Choose:** "Overwrite" when prompted

---

## 📝 What Changed (for your reference):

### Course Pages (27 files):
All enrollment buttons now have `?course=COURSE_ID` parameter

### Registration Page:
- Fixed script loading
- Pricing cards now visible
- JavaScript updates prices based on course

### Payment System:
- Integrated with Firebase Functions
- Dynamic pricing per course
- Stripe checkout with correct amounts

---

## ✅ After Upload - Test:

1. **Visit:** https://yourdomain.com/academy/python-it.html
2. **Check:** Price shows $119
3. **Click:** "Enroll Now"
4. **Verify:** Registration shows both cards with $119 / $1,895
5. **Test another:** IT Support ($79 / $995)

---

## ⚠️ Important:

**Clear your browser cache after uploading:**
- Press: **Ctrl + Shift + Delete**
- Clear: Cached images and files
- Or use: **Ctrl + Shift + R** (hard refresh)

---

## 🆘 If Something Goes Wrong:

I have backups. Just let me know and I can help restore or fix specific files.

---

**The system is working perfectly locally. Once you upload these files to Namecheap, your live site will work the same way!**
