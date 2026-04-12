# Stripe Dynamic Pricing Setup Guide

## Current Situation
You have individual pricing for each course, but your Stripe payment links are fixed at $99 and $1,195. We need to switch to **Stripe Checkout Sessions** with dynamic pricing.

---

## Option 1: Firebase Functions (RECOMMENDED - Already 90% Done!)

You already have the Firebase function code ready! Just need to deploy it.

### Step 1: Get Your Stripe Secret Key

1. Go to: https://dashboard.stripe.com/apikeys
2. Find "**Secret key**" (starts with `sk_live_...`)
3. Click "Reveal live key token"
4. Copy it (keep it private!)

### Step 2: Set Up Firebase Functions

```bash
# Navigate to your project
cd "C:\Users\Andong\Digitech-Globals"

# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions (if not done)
firebase init functions
# Select: Use existing project
# Language: JavaScript
# Install dependencies: Yes

# Go to functions directory
cd functions

# Install Stripe
npm install stripe

# Go back to root
cd ..
```

### Step 3: Add Stripe Secret Key to Firebase

```bash
firebase functions:config:set stripe.secret="sk_live_YOUR_SECRET_KEY_HERE"
```

Replace `sk_live_YOUR_SECRET_KEY_HERE` with your actual Stripe secret key.

### Step 4: Update the Function File

The file `functions/stripe-checkout.js` needs to be moved/renamed to `functions/index.js`:

```bash
# Windows Command Prompt
move functions\stripe-checkout.js functions\index.js
```

### Step 5: Deploy the Function

```bash
firebase deploy --only functions
```

After deployment, you'll get a function URL like:
```
https://us-central1-YOUR-PROJECT.cloudfunctions.net/createCheckoutSession
```

### Step 6: Update payment.html

I'll update the code to use this function URL instead of payment links.

---

## Option 2: Use Netlify/Vercel Functions (Alternative)

If you prefer not to use Firebase Functions, you can deploy to Netlify or Vercel.

### For Netlify:

1. Create folder: `netlify/functions/`
2. Copy `functions/stripe-checkout.js` to `netlify/functions/create-checkout.js`
3. Deploy to Netlify
4. Add Stripe secret key to Netlify environment variables

### For Vercel:

1. Create folder: `api/`
2. Copy `functions/stripe-checkout.js` to `api/create-checkout.js`
3. Deploy to Vercel
4. Add Stripe secret key to Vercel environment variables

---

## Option 3: Simple Backend (Heroku/Railway)

Deploy a simple Node.js Express server with the Stripe checkout endpoint.

---

## Which Option Should You Choose?

**Use Firebase Functions (Option 1)** because:
- ✅ You already have Firebase hosting set up
- ✅ The code is already written
- ✅ Firebase Functions free tier is generous
- ✅ Integrated with your existing Firebase project
- ✅ Only takes 5 minutes to deploy

---

## Quick Commands Summary (Firebase Functions)

```bash
# 1. Navigate to project
cd "C:\Users\Andong\Digitech-Globals"

# 2. Install Firebase CLI
npm install -g firebase-tools

# 3. Login
firebase login

# 4. Install Stripe in functions
cd functions
npm install stripe
cd ..

# 5. Set Stripe secret
firebase functions:config:set stripe.secret="sk_live_YOUR_SECRET_KEY"

# 6. Rename file
move functions\stripe-checkout.js functions\index.js

# 7. Deploy
firebase deploy --only functions
```

---

## After Deployment

Once deployed, give me the function URL and I'll update `payment.html` to use dynamic pricing that matches each course's individual price!

---

## Need Help?

Let me know which option you want to use, and I'll guide you through each step!
