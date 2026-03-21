# 🔐 GitHub Two-Factor Authentication (2FA) Setup Guide

## 🎯 What This Does

Enabling 2FA on your GitHub account will:
- ✅ Protect ALL your repositories with an extra security layer
- ✅ Require a code from your phone in addition to your password
- ✅ Prevent unauthorized access even if someone knows your password
- ✅ Meet GitHub's security best practices

---

## 📱 Step-by-Step Setup

### Step 1: Prepare Your Phone

**You'll need ONE of these apps:**

**Option A: Microsoft Authenticator** (Recommended)
- Download from App Store (iPhone) or Google Play (Android)
- Free and easy to use

**Option B: Google Authenticator**
- Download from App Store or Google Play
- Widely used

**Option C: Authy**
- Download from App Store or Google Play
- Works across multiple devices

---

### Step 2: Enable 2FA on GitHub

1. **Login to GitHub**
   - Go to https://github.com
   - Sign in with your username and password

2. **Access Security Settings**
   - Click your profile picture (top right)
   - Click **Settings**
   - In the left sidebar, click **Password and authentication**
   - Or go directly to: https://github.com/settings/security

3. **Enable Two-Factor Authentication**
   - Find the section "Two-factor authentication"
   - Click **Enable two-factor authentication**
   - You may need to confirm your password

4. **Choose Setup Method**
   - Click **Set up using an app** (RECOMMENDED)
   - GitHub will show you a QR code

5. **Scan QR Code**
   - Open your authenticator app (Microsoft/Google/Authy)
   - Tap "+" or "Add account"
   - Tap "Scan QR code"
   - Point your camera at the QR code on GitHub
   - The app will add GitHub and start showing 6-digit codes

6. **Enter Verification Code**
   - Look at the 6-digit code in your authenticator app
   - Type it into GitHub
   - Click **Continue** or **Verify**

7. **Save Recovery Codes** ⚠️ CRITICAL!
   - GitHub will show you recovery codes
   - **DOWNLOAD THEM** or **PRINT THEM**
   - Store them somewhere safe (NOT on your computer only)
   - You'll need these if you lose your phone

8. **Confirm Setup**
   - Click **I have saved my recovery codes**
   - 2FA is now enabled! ✅

---

## 🔑 Using 2FA When Logging In

### From Now On:

1. **Go to GitHub** and enter your username/password
2. **Enter 6-digit code** from your authenticator app
3. **You're logged in!**

**The code changes every 30 seconds**, so use the current one.

---

## 💻 Using Git with 2FA Enabled

### ⚠️ IMPORTANT: Passwords Won't Work Anymore!

After enabling 2FA, you **CANNOT** use your GitHub password for git operations.

**Instead, you must use a Personal Access Token (PAT).**

---

## 🔐 Create Personal Access Token (PAT)

### Step 1: Generate Token

1. **Go to GitHub Settings**
   - Click profile picture → Settings
   - Scroll down left sidebar → **Developer settings**
   - Click **Personal access tokens** → **Tokens (classic)**
   - Or go to: https://github.com/settings/tokens

2. **Generate New Token**
   - Click **Generate new token** → **Generate new token (classic)**
   - GitHub may ask for your password

3. **Configure Token**
   - **Note:** Enter a description (e.g., "DigiTech Globals Development")
   - **Expiration:** Choose expiration (recommend: 90 days)
   - **Select scopes:**
     - ✅ **repo** (full control of private repositories)
     - ✅ **workflow** (if using GitHub Actions)
     - ✅ **admin:org** (if you have organizations)

4. **Generate Token**
   - Scroll down and click **Generate token**
   - GitHub will show you a token like: `ghp_xxxxxxxxxxxxxxxxxxxx`
   - **⚠️ COPY IT NOW** - You can't see it again!
   - Save it in a password manager or safe place

---

## 💾 Update Git to Use PAT

### When Pushing to GitHub:

**Old way (won't work anymore):**
```
Username: your-username
Password: your-password ❌
```

**New way (with PAT):**
```
Username: your-username
Password: ghp_xxxxxxxxxxxxxxxxxxxx ✅ (use your token)
```

---

### Option 1: Update Credential Manager (Windows)

1. **Open Credential Manager**
   - Press Windows key
   - Type "Credential Manager"
   - Click "Credential Manager"

2. **Find GitHub Credentials**
   - Click **Windows Credentials**
   - Look for `git:https://github.com`
   - Click the arrow to expand
   - Click **Edit**

3. **Update Password**
   - Replace password with your Personal Access Token
   - Click **Save**

4. **Test It**
   ```bash
   cd C:\Users\Andong\Digitech-Globals
   git push origin main
   ```
   - Should work without asking for password

---

### Option 2: Save Token in Git (Alternative)

```bash
cd C:\Users\Andong\Digitech-Globals
git config --global credential.helper store
git push origin main
```

**When prompted:**
- Username: `your-github-username`
- Password: `ghp_xxxxxxxxxxxxxxxxxxxx` (your PAT)

Git will save these credentials and remember them.

---

## 📱 Using 2FA Daily

### Logging into GitHub Website:
1. Enter username + password
2. Open authenticator app
3. Enter current 6-digit code
4. Done!

### Using Git Commands:
1. Use your Personal Access Token instead of password
2. That's it!

---

## 🆘 If You Lose Your Phone

### Don't Panic! Use Recovery Codes:

1. **Go to GitHub login**
2. Enter username + password
3. Click **"Use a recovery code"**
4. Enter one of your saved recovery codes
5. You're in!

**Then immediately:**
1. Go to Settings → Security
2. Set up 2FA again with your new phone
3. Download new recovery codes

---

## 🔄 Managing Your 2FA

### View/Edit 2FA Settings:
- Go to: https://github.com/settings/security
- You can:
  - View recovery codes
  - Regenerate recovery codes
  - Add backup phone numbers
  - Add security keys (like YubiKey)

---

## ✅ Quick Reference

### Enable 2FA:
```
GitHub.com → Settings → Password and authentication → Enable 2FA
```

### Create Personal Access Token:
```
GitHub.com → Settings → Developer settings → Personal access tokens → Generate new token
```

### Update Windows Credentials:
```
Windows → Credential Manager → Windows Credentials → git:https://github.com
```

---

## 🎯 Post-Setup Checklist

After enabling 2FA, make sure you:

- [ ] Saved recovery codes in a safe place
- [ ] Created a Personal Access Token (PAT)
- [ ] Updated Git credentials with PAT
- [ ] Tested `git push` works
- [ ] Logged in to GitHub website successfully
- [ ] Authenticator app installed on phone
- [ ] Backup authentication method configured (optional)

---

## 🔐 Additional Security Tips

### 1. Use Strong GitHub Password
- At least 12 characters
- Mix of letters, numbers, symbols
- Don't reuse from other sites

### 2. Review Active Sessions
- Go to: https://github.com/settings/security
- Scroll to "Sessions"
- Sign out any suspicious sessions

### 3. Review Authorized Apps
- Go to: https://github.com/settings/applications
- Remove apps you don't use

### 4. Enable Vigilant Mode
- Settings → Security → Vigilant mode
- Shows signature verification on commits

### 5. Use SSH Keys (Optional but Recommended)
- More secure than PAT
- No need to enter token each time
- Setup guide: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 🆘 Troubleshooting

### Problem: "Authentication failed" when pushing
**Solution:** You're using your password instead of PAT
- Use your Personal Access Token as the password
- Update Credential Manager with PAT

### Problem: "Token expired"
**Solution:** Generate a new token
- Go to GitHub → Settings → Developer settings → Tokens
- Generate new token with same permissions
- Update Git credentials

### Problem: Lost phone with authenticator
**Solution:** Use recovery codes
- Enter recovery code when asked for 2FA code
- Set up 2FA again with new phone

### Problem: Lost recovery codes
**Solution:** Contact GitHub support
- Go to: https://support.github.com
- They'll verify your identity and help recover access

---

## 📊 What Changes After 2FA

### Before 2FA:
- Login: username + password ✅
- Git push: username + password ✅
- Risky if password is leaked ⚠️

### After 2FA:
- Login: username + password + 6-digit code ✅✅
- Git push: username + Personal Access Token ✅✅
- Much more secure! 🔐

---

## 🎉 Benefits of 2FA

✅ **Protects ALL your repositories**
✅ **Even if password is leaked, account is safe**
✅ **Industry standard security**
✅ **Required by many organizations**
✅ **Free to use**
✅ **Easy once set up**

---

## 📱 Recommended: Backup 2FA Method

Set up a backup in case you lose your phone:

### Option 1: SMS Backup (Not recommended but better than nothing)
- Settings → Security → SMS number
- Add your phone number
- Receive codes via text

### Option 2: Security Key (Most secure)
- Buy a YubiKey or similar
- Settings → Security → Security keys
- Register your key

### Option 3: Multiple Authenticator Apps
- Set up same account in multiple authenticator apps
- Keep one on tablet/other device

---

## 🔗 Official GitHub Documentation

- **2FA Overview:** https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa
- **Personal Access Tokens:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **SSH Keys:** https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## ⏱️ Time Required

**Initial Setup:** 10-15 minutes
- Enable 2FA: 5 minutes
- Create PAT: 3 minutes
- Update Git: 2 minutes
- Save recovery codes: 2 minutes

**Daily Use:** 5 extra seconds
- Just enter the 6-digit code when logging in

---

## ✅ Summary

**What You'll Do:**
1. Install authenticator app on phone
2. Enable 2FA on GitHub (scan QR code)
3. Save recovery codes
4. Create Personal Access Token
5. Update Git credentials to use PAT

**Result:**
- 🔐 All your GitHub repositories protected
- 🔐 Account secure even if password leaks
- 🔐 Industry-standard security

---

**Ready to set up 2FA? Follow the steps above!** 🚀🔐

**Start here:** https://github.com/settings/security
