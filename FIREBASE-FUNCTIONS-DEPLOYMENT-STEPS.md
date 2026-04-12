# Firebase Functions Deployment - Step-by-Step Guide

## ✅ Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)
- [ ] Stripe Secret Key from dashboard.stripe.com/apikeys
- [ ] Firebase project already set up (digitech-globals-academy)

---

## 🚀 Deployment Steps

### Step 1: Install Firebase CLI

Open Command Prompt or PowerShell and run:

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

---

### Step 2: Login to Firebase

```bash
firebase login
```

This will open your browser. Login with your Google account that has access to the Firebase project.

---

### Step 3: Navigate to Your Project

```bash
cd "C:\Users\Andong\Digitech-Globals"
```

---

### Step 4: Install Function Dependencies

```bash
cd functions
npm install
```

This will install:
- firebase-admin
- firebase-functions
- stripe

Wait for installation to complete (may take 1-2 minutes).

---

### Step 5: Get Your Stripe Secret Key

1. Go to: **https://dashboard.stripe.com/apikeys**
2. Find "**Secret key**" (starts with `sk_live_...` or `sk_test_...`)
3. Click **"Reveal live key token"**
4. **Copy the entire key** (it's long!)

⚠️ **IMPORTANT:** Keep this key secret! Never share it or commit it to GitHub.

---

### Step 6: Set Stripe Secret Key in Firebase

Go back to Command Prompt (make sure you're in the project root, not functions folder):

```bash
cd ..
```

Now set the Stripe secret:

```bash
firebase functions:config:set stripe.secret="sk_live_YOUR_ACTUAL_SECRET_KEY_HERE"
```

**Replace `sk_live_YOUR_ACTUAL_SECRET_KEY_HERE` with your actual Stripe secret key!**

Example:
```bash
firebase functions:config:set stripe.secret="sk_live_51ABC123xyz..."
```

Verify it was set:
```bash
firebase functions:config:get
```

You should see:
```json
{
  "stripe": {
    "secret": "sk_live_..."
  }
}
```

---

### Step 7: Deploy the Functions

```bash
firebase deploy --only functions
```

This will:
1. Upload your function code
2. Deploy it to Google Cloud
3. Give you the function URL

**Expected output:**
```
✔  functions: Finished running predeploy script.
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
✔  functions: required API cloudfunctions.googleapis.com is enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (XX KB) for uploading
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 18 function createCheckoutSession...
✔  functions[createCheckoutSession]: Successful create operation.
i  functions: creating Node.js 18 function stripeWebhook...
✔  functions[stripeWebhook]: Successful create operation.

✔  Deploy complete!

Function URL (createCheckoutSession): https://us-central1-digitech-globals-academy.cloudfunctions.net/createCheckoutSession
Function URL (stripeWebhook): https://us-central1-digitech-globals-academy.cloudfunctions.net/stripeWebhook
```

**🎯 SAVE THIS URL!** You'll need it in the next step.

---

### Step 8: Copy the Function URL

From the deployment output, copy the **createCheckoutSession** URL.

It will look like:
```
https://us-central1-digitech-globals-academy.cloudfunctions.net/createCheckoutSession
```

**Send me this URL** and I'll update your payment.html file to use it!

---

## 🧪 Testing

After deployment, test the function:

```bash
curl -X POST https://YOUR_FUNCTION_URL/createCheckoutSession \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 9900,
    "courseId": "test-course",
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "registrationData": {
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "trainingMode": "self-study"
    }
  }'
```

You should get a response with a session ID.

---

## ❌ Troubleshooting

### Error: "Firebase CLI not found"
**Solution:** Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Error: "Not authorized"
**Solution:** Login again:
```bash
firebase login --reauth
```

### Error: "Stripe secret not found"
**Solution:** Set the config again:
```bash
firebase functions:config:set stripe.secret="sk_live_YOUR_KEY"
```

### Error: "Module 'stripe' not found"
**Solution:** Install dependencies:
```bash
cd functions
npm install
cd ..
```

### Error: "Billing account required"
**Solution:** Firebase Functions require the Blaze (pay-as-you-go) plan. Don't worry, it has a generous free tier and you likely won't be charged for course enrollments.
1. Go to: https://console.firebase.google.com/project/digitech-globals-academy/overview
2. Click "Upgrade to Blaze plan"
3. Add a credit card (free tier covers most usage)

---

## 📊 Monitoring

After deployment, monitor your functions:

**View logs:**
```bash
firebase functions:log
```

**View in Firebase Console:**
https://console.firebase.google.com/project/digitech-globals-academy/functions

---

## 🎯 Next Steps

After successful deployment:
1. **Copy the function URL**
2. **Give it to me** so I can update `academy/payment.html`
3. **Test a course enrollment** to make sure payment works
4. **(Optional) Set up Stripe webhook** for order tracking

---

## 💰 Cost

Firebase Functions Blaze Plan:
- **Free tier:** 2 million invocations/month
- **Estimated cost for your site:** $0-5/month (unless you get thousands of enrollments)
- First 2 million function calls are FREE

---

## 🆘 Need Help?

If you encounter any errors during deployment, share:
1. The exact error message
2. The step where it failed
3. Screenshot if possible

I'll help you troubleshoot!

---

**Ready to start? Begin with Step 1!** 🚀
